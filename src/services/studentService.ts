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

import { saveStudentsIDB, getStudentsIDB, compressBase64Image } from './cmsStorage';

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

export const syncStudentsToSystemSettings = async (list: Student[]) => {
  try {
    const deletedSet = new Set(getDeletedStudentIds());
    const cleanList = list.filter((s) => !deletedSet.has(s.id));
    const compressedList = await Promise.all(
      cleanList.map(async (s) => {
        if (s.image && s.image.startsWith('data:image/') && s.image.length > 20000) {
          const comp = await compressBase64Image(s.image);
          return { ...s, image: comp };
        }
        return s;
      })
    );

    const { error } = await supabase.from('system_settings').upsert({
      key: 'icancam_all_students_v1',
      value: JSON.stringify(compressedList),
      updated_at: new Date().toISOString(),
    });
    if (error) console.warn('Supabase system_settings students sync error:', error.message);
  } catch (err) {
    console.warn('Supabase system_settings students sync notice:', err);
  }
};

export const saveStudents = (list: Student[]) => {
  const deletedSet = new Set(getDeletedStudentIds());
  const cleanList = list.filter((s) => !deletedSet.has(s.id));
  inMemoryStudents = cleanList;
  saveStudentsIDB(cleanList);
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cleanList));
  } catch (err) {
    console.warn('LocalStorage save warning in studentService:', err);
  }
  syncStudentsToSystemSettings(cleanList);
};

export const fetchStudentsFromSupabase = async (): Promise<Student[]> => {
  const idbStudents = await getStudentsIDB();
  const localList = getAllStudents();

  // Combine LocalStorage and IndexedDB (IndexedDB takes priority for large images)
  const localMap = new Map<string, Student>();
  for (const s of localList) localMap.set(s.id, s);
  for (const s of idbStudents) localMap.set(s.id, s);
  const currentLocalStudents = Array.from(localMap.values());

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

  // Cross-device & Mobile sync: Try reading global students list from Supabase system_settings first!
  try {
    const { data: globalSetting } = await supabase
      .from('system_settings')
      .select('value')
      .eq('key', 'icancam_all_students_v1')
      .maybeSingle();

    if (globalSetting && globalSetting.value) {
      const parsed: Student[] = JSON.parse(globalSetting.value);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const cleanGlobal = parsed.filter((s) => !deletedSet.has(s.id));
        inMemoryStudents = cleanGlobal;
        saveStudentsIDB(cleanGlobal);
        try {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cleanGlobal));
        } catch {
          // Ignore
        }
        return cleanGlobal;
      }
    }
  } catch (err) {
    console.warn('System settings global students fetch notice:', err);
  }

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

      const mergedMap = new Map<string, Student>();
      for (const item of currentLocalStudents) {
        mergedMap.set(item.id, item);
      }
      for (const item of studentsFromDb) {
        mergedMap.set(item.id, item);
      }

      const mergedList = Array.from(mergedMap.values()).filter((s) => !deletedSet.has(s.id));
      saveStudents(mergedList);
      return mergedList;
    }
  } catch (err) {
    console.warn('Supabase students table offline or not synced yet:', err);
  }

  return currentLocalStudents.length > 0 ? currentLocalStudents : localList;
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
  let image = data.image;
  if (image && image.startsWith('data:image/') && image.length > 20000) {
    image = await compressBase64Image(image);
  }

  const created: Student = {
    ...data,
    image,
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

  let image = data.image !== undefined ? data.image : list[idx].image;
  if (image && image.startsWith('data:image/') && image.length > 20000) {
    image = await compressBase64Image(image);
  }

  const updated: Student = {
    ...list[idx],
    ...data,
    image,
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
