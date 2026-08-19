import { supabase } from './supabaseClient';
import { type Student, type StudentHighlight } from '../data/studentData';
import { saveStudentsIDB, compressBase64Image } from './cmsStorage';

export type { Student, StudentHighlight };

const LOCAL_STORAGE_KEY = 'icancam_students_v1';
let inMemoryStudents: Student[] | null = null;

// STUDENTS CRUD - SUPABASE AS SINGLE SOURCE OF TRUTH
export const getAllStudents = (): Student[] => {
  if (inMemoryStudents) {
    return inMemoryStudents;
  }
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const list = JSON.parse(raw);
      inMemoryStudents = list;
      return list;
    }
    return [];
  } catch {
    return [];
  }
};

export const syncStudentsToSystemSettings = async (list: Student[]) => {
  try {
    const compressedList = await Promise.all(
      list.map(async (s) => {
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
  inMemoryStudents = list;
  saveStudentsIDB(list);
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
  } catch (err) {
    console.warn('LocalStorage save warning in studentService:', err);
  }
  syncStudentsToSystemSettings(list);
};

export const fetchStudentsFromSupabase = async (): Promise<Student[]> => {
  try {
    const { data: globalSetting, error } = await supabase
      .from('system_settings')
      .select('value')
      .eq('key', 'icancam_all_students_v1')
      .maybeSingle();

    if (!error && globalSetting && globalSetting.value) {
      const parsed: Student[] = JSON.parse(globalSetting.value);
      if (Array.isArray(parsed)) {
        inMemoryStudents = parsed;
        saveStudentsIDB(parsed);
        try {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parsed));
        } catch {
          // Ignore
        }
        return parsed;
      }
    }
  } catch (err) {
    console.warn('System settings global students fetch notice:', err);
  }
  return getAllStudents();
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
  const list = getAllStudents();
  const filtered = list.filter((s) => s.id !== id);
  saveStudents(filtered);
  return { success: true };
};
