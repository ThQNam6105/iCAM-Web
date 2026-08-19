import { supabase } from './supabaseClient';
import { type Teacher, type TeacherHighlight } from '../data/teacherData';
import { saveTeachersIDB, compressBase64Image } from './cmsStorage';

export type { Teacher, TeacherHighlight };

const LOCAL_STORAGE_KEY = 'icancam_teachers_v1';
let inMemoryTeachers: Teacher[] | null = null;

// TEACHERS CRUD - SUPABASE AS SINGLE SOURCE OF TRUTH
export const getAllTeachers = (): Teacher[] => {
  if (inMemoryTeachers) {
    return inMemoryTeachers;
  }
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const list = JSON.parse(raw);
      inMemoryTeachers = list;
      return list;
    }
    return [];
  } catch {
    return [];
  }
};

export const syncTeachersToSystemSettings = async (list: Teacher[]) => {
  try {
    const compressedList = await Promise.all(
      list.map(async (t) => {
        if (t.image && t.image.startsWith('data:image/') && t.image.length > 20000) {
          const comp = await compressBase64Image(t.image);
          return { ...t, image: comp };
        }
        return t;
      })
    );

    const { error } = await supabase.from('system_settings').upsert({
      key: 'icancam_all_teachers_v1',
      value: JSON.stringify(compressedList),
      updated_at: new Date().toISOString(),
    });
    if (error) console.warn('Supabase system_settings teachers sync error:', error.message);
  } catch (err) {
    console.warn('Supabase system_settings teachers sync notice:', err);
  }
};

export const saveTeachers = (list: Teacher[]) => {
  inMemoryTeachers = list;
  saveTeachersIDB(list);
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
  } catch (err) {
    console.warn('LocalStorage save warning in teacherService:', err);
  }
  syncTeachersToSystemSettings(list);
};

export const fetchTeachersFromSupabase = async (): Promise<Teacher[]> => {
  try {
    const { data: globalSetting, error } = await supabase
      .from('system_settings')
      .select('value')
      .eq('key', 'icancam_all_teachers_v1')
      .maybeSingle();

    if (!error && globalSetting && globalSetting.value) {
      const parsed: Teacher[] = JSON.parse(globalSetting.value);
      if (Array.isArray(parsed)) {
        inMemoryTeachers = parsed;
        saveTeachersIDB(parsed);
        try {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parsed));
        } catch {
          // Ignore
        }
        return parsed;
      }
    }
  } catch (err) {
    console.warn('System settings global teachers fetch notice:', err);
  }
  return getAllTeachers();
};

export const syncTeacherToSupabase = async (teacher: Teacher): Promise<{ success: boolean; error?: string }> => {
  const fullPayload: Record<string, any> = {
    id: teacher.id,
    name: teacher.name,
    role: teacher.role,
    role_en: teacher.roleEn || teacher.role,
    image: teacher.image,
    main_highlight: teacher.mainHighlight,
    highlights: teacher.highlights,
    updated_at: new Date().toISOString(),
  };

  try {
    const { error } = await supabase.from('teachers').upsert(fullPayload);
    if (error) {
      console.warn('Supabase teachers upsert notice:', error.message);
    }
    return { success: true };
  } catch (err: any) {
    console.warn('Supabase teacher sync exception:', err);
    return { success: true };
  }
};

export const createTeacher = async (
  data: Omit<Teacher, 'id'>
): Promise<{ success: boolean; data?: Teacher; error?: string }> => {
  const list = getAllTeachers();
  let image = data.image;
  if (image && image.startsWith('data:image/') && image.length > 20000) {
    image = await compressBase64Image(image);
  }

  const created: Teacher = {
    ...data,
    image,
    id: `teacher_${Date.now()}`,
  };

  await syncTeacherToSupabase(created);

  const updatedList = [created, ...list];
  saveTeachers(updatedList);
  return { success: true, data: created };
};

export const updateTeacher = async (
  id: string,
  data: Partial<Teacher>
): Promise<{ success: boolean; data?: Teacher; error?: string }> => {
  const list = getAllTeachers();
  const idx = list.findIndex((t) => t.id === id);
  if (idx === -1) return { success: false, error: 'Giáo viên không tồn tại' };

  let image = data.image !== undefined ? data.image : list[idx].image;
  if (image && image.startsWith('data:image/') && image.length > 20000) {
    image = await compressBase64Image(image);
  }

  const updated: Teacher = {
    ...list[idx],
    ...data,
    image,
  };

  await syncTeacherToSupabase(updated);

  list[idx] = updated;
  saveTeachers(list);
  return { success: true, data: updated };
};

export const deleteTeacher = async (id: string): Promise<{ success: boolean; error?: string }> => {
  const list = getAllTeachers();
  const filtered = list.filter((t) => t.id !== id);
  saveTeachers(filtered);
  return { success: true };
};
