import { supabase } from './supabaseClient';
import { studentsData, type Student, type StudentHighlight } from '../data/studentData';

export type { Student, StudentHighlight };

const LOCAL_STORAGE_KEY = 'icancam_students_v1';
const DELETED_STUDENTS_KEY = 'icancam_deleted_student_ids_v1';

export const getDeletedStudentIds = (): string[] => {
  try {
    const raw = localStorage.getItem(DELETED_STUDENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveDeletedStudentIds = (idsList: string[]) => {
  localStorage.setItem(DELETED_STUDENTS_KEY, JSON.stringify(Array.from(new Set(idsList))));
};

export const markStudentAsDeleted = (id: string) => {
  const ids = new Set(getDeletedStudentIds());
  ids.add(id);
  saveDeletedStudentIds(Array.from(ids));
};

let inMemoryStudents: Student[] | null = null;

export const getAllStudents = (): Student[] => {
  if (inMemoryStudents) {
    const deletedSet = new Set(getDeletedStudentIds());
    return inMemoryStudents.filter((s) => !deletedSet.has(s.id));
  }
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    let list: Student[] = [];
    if (raw) {
      list = JSON.parse(raw);
    } else {
      list = studentsData;
    }
    const deletedSet = new Set(getDeletedStudentIds());
    const cleanList = list.filter((s) => !deletedSet.has(s.id));
    inMemoryStudents = cleanList;
    return cleanList;
  } catch {
    const deletedSet = new Set(getDeletedStudentIds());
    const cleanList = studentsData.filter((s) => !deletedSet.has(s.id));
    inMemoryStudents = cleanList;
    return cleanList;
  }
};

export const saveStudents = (list: Student[]) => {
  const deletedSet = new Set(getDeletedStudentIds());
  const cleanList = list.filter((s) => !deletedSet.has(s.id));
  inMemoryStudents = cleanList;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cleanList));
  } catch (err) {
    console.warn('LocalStorage save warning in studentService:', err);
  }
};

export const fetchStudentsFromSupabase = async (): Promise<Student[]> => {
  const localList = getAllStudents();
  let globalDeletedIds = getDeletedStudentIds();
  try {
    const { data: settingsData } = await supabase
      .from('system_settings')
      .select('value')
      .eq('key', 'icancam_deleted_student_ids')
      .maybeSingle();
    if (settingsData && settingsData.value) {
      const parsed = JSON.parse(settingsData.value);
      if (Array.isArray(parsed) && parsed.length > 0) {
        globalDeletedIds = Array.from(new Set([...globalDeletedIds, ...parsed]));
        saveDeletedStudentIds(globalDeletedIds);
      }
    }
  } catch {
    // Ignore settings fetch error
  }

  const deletedSet = new Set(globalDeletedIds);

  try {
    const { data, error } = await supabase.from('students').select('*').order('created_at', { ascending: false });
    if (!error && data && data.length > 0) {
      const studentsFromDb: Student[] = data
        .filter((item) => !deletedSet.has(item.id))
        .map((item) => {
          const seed = studentsData.find((init) => init.id === item.id);
          return {
            id: item.id,
            name: item.name || seed?.name || '',
            role: item.role || seed?.role || '',
            roleEn: item.role_en || item.roleEn || seed?.roleEn || '',
            image: item.image || seed?.image || '',
            mainHighlight: item.main_highlight || item.mainHighlight || seed?.mainHighlight || '',
            mainHighlightEn: item.main_highlight_en || item.mainHighlightEn || seed?.mainHighlightEn || '',
            highlights: Array.isArray(item.highlights) ? item.highlights : seed?.highlights || [],
          };
        });

      // MERGE Supabase DB with LocalStorage (Local edits take priority over old DB rows)
      const mergedMap = new Map<string, Student>();
      for (const item of studentsFromDb) {
        mergedMap.set(item.id, item);
      }
      for (const item of localList) {
        mergedMap.set(item.id, item); // Local item OVERRIDES DB item so user edits are NEVER lost!
      }

      const mergedList = Array.from(mergedMap.values()).filter((s) => !deletedSet.has(s.id));
      saveStudents(mergedList);
      return mergedList;
    }
  } catch (err) {
    console.warn('Supabase students table offline or not synced yet:', err);
  }

  return localList;
};

export const syncStudentToSupabase = async (student: Student): Promise<{ success: boolean; error?: string }> => {
  const fullPayload: Record<string, any> = {
    id: student.id,
    name: student.name,
    role: student.role,
    role_en: student.roleEn || student.role,
    image: student.image,
    main_highlight: student.mainHighlight,
    main_highlight_en: student.mainHighlightEn || student.mainHighlight,
    highlights: student.highlights,
    updated_at: new Date().toISOString(),
  };

  try {
    const { error } = await supabase.from('students').upsert(fullPayload);
    if (error) {
      console.warn('Supabase students upsert notice:', error.message);
    }
    return { success: true };
  } catch (err: any) {
    console.warn('Supabase student sync exception:', err);
    return { success: true };
  }
};

export const createStudent = async (
  data: Omit<Student, 'id'>
): Promise<{ success: boolean; data?: Student; error?: string }> => {
  const list = getAllStudents();
  const created: Student = {
    ...data,
    id: `student_${Date.now()}`,
  };

  await syncStudentToSupabase(created);

  const updatedList = [created, ...list];
  saveStudents(updatedList);
  return { success: true, data: created };
};

export const updateStudent = async (
  id: string,
  data: Partial<Student>
): Promise<{ success: boolean; data?: Student; error?: string }> => {
  const list = getAllStudents();
  const idx = list.findIndex((s) => s.id === id);
  if (idx === -1) return { success: false, error: 'Học viên không tồn tại' };

  const updated: Student = {
    ...list[idx],
    ...data,
  };

  await syncStudentToSupabase(updated);

  list[idx] = updated;
  saveStudents(list);
  return { success: true, data: updated };
};

export const deleteStudent = async (id: string): Promise<{ success: boolean; error?: string }> => {
  markStudentAsDeleted(id);

  const list = getAllStudents();
  const filtered = list.filter((s) => s.id !== id);
  saveStudents(filtered);

  try {
    await supabase.from('students').delete().eq('id', id);
  } catch (err) {
    console.warn('Supabase delete student notice:', err);
  }

  try {
    const deletedList = getDeletedStudentIds();
    await supabase.from('system_settings').upsert({
      key: 'icancam_deleted_student_ids',
      value: JSON.stringify(deletedList),
      updated_at: new Date().toISOString(),
    });
  } catch (err) {
    console.warn('Supabase system_settings sync notice:', err);
  }

  return { success: true };
};
