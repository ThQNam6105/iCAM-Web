import { supabase } from './supabaseClient';
import { teachersData, type Teacher, type TeacherHighlight } from '../data/teacherData';

export type { Teacher, TeacherHighlight };

const LOCAL_STORAGE_KEY = 'icancam_teachers_v1';
const DELETED_TEACHERS_KEY = 'icancam_deleted_teacher_ids_v1';

export const getDeletedTeacherIds = (): string[] => {
  try {
    const raw = localStorage.getItem(DELETED_TEACHERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveDeletedTeacherIds = (idsList: string[]) => {
  localStorage.setItem(DELETED_TEACHERS_KEY, JSON.stringify(Array.from(new Set(idsList))));
};

export const markTeacherAsDeleted = (id: string) => {
  const ids = new Set(getDeletedTeacherIds());
  ids.add(id);
  saveDeletedTeacherIds(Array.from(ids));
};

let inMemoryTeachers: Teacher[] | null = null;

// IndexedDB Helper for Teacher Data
const DB_NAME = 'icancam_cms_db_v1';
const DB_VERSION = 1;
let dbPromise: Promise<IDBDatabase> | null = null;

const getIDB = (): Promise<IDBDatabase> => {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB unavailable'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('teachers')) {
        db.createObjectStore('teachers', { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  return dbPromise;
};

const saveTeachersToIDB = async (teachers: Teacher[]) => {
  try {
    const db = await getIDB();
    const tx = db.transaction('teachers', 'readwrite');
    const store = tx.objectStore('teachers');
    store.clear();
    for (const t of teachers) {
      store.put(t);
    }
  } catch {
    // Ignore
  }
};

const getTeachersFromIDB = async (): Promise<Teacher[]> => {
  try {
    const db = await getIDB();
    return new Promise((resolve) => {
      const tx = db.transaction('teachers', 'readonly');
      const req = tx.objectStore('teachers').getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    });
  } catch {
    return [];
  }
};

export const getAllTeachers = (): Teacher[] => {
  if (inMemoryTeachers) {
    const deletedSet = new Set(getDeletedTeacherIds());
    return inMemoryTeachers.filter((t) => !deletedSet.has(t.id));
  }
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    let list: Teacher[] = [];
    if (raw) {
      list = JSON.parse(raw);
    } else {
      list = teachersData;
    }
    const deletedSet = new Set(getDeletedTeacherIds());
    const cleanList = list.filter((t) => !deletedSet.has(t.id));
    inMemoryTeachers = cleanList;
    return cleanList;
  } catch {
    const deletedSet = new Set(getDeletedTeacherIds());
    const cleanList = teachersData.filter((t) => !deletedSet.has(t.id));
    inMemoryTeachers = cleanList;
    return cleanList;
  }
};

export const saveTeachers = (list: Teacher[]) => {
  const deletedSet = new Set(getDeletedTeacherIds());
  const cleanList = list.filter((t) => !deletedSet.has(t.id));
  inMemoryTeachers = cleanList;
  saveTeachersToIDB(cleanList);
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cleanList));
  } catch (err) {
    console.warn('LocalStorage save warning in teacherService:', err);
  }
};

export const fetchTeachersFromSupabase = async (): Promise<Teacher[]> => {
  const idbTeachers = await getTeachersFromIDB();
  const localList = getAllTeachers();

  const localMap = new Map<string, Teacher>();
  for (const t of localList) localMap.set(t.id, t);
  for (const t of idbTeachers) localMap.set(t.id, t);
  const currentLocalTeachers = Array.from(localMap.values());

  let globalDeletedIds = getDeletedTeacherIds();
  try {
    const { data: settingsData } = await supabase
      .from('system_settings')
      .select('value')
      .eq('key', 'icancam_deleted_teacher_ids')
      .maybeSingle();
    if (settingsData && settingsData.value) {
      const parsed = JSON.parse(settingsData.value);
      if (Array.isArray(parsed) && parsed.length > 0) {
        globalDeletedIds = Array.from(new Set([...globalDeletedIds, ...parsed]));
        saveDeletedTeacherIds(globalDeletedIds);
      }
    }
  } catch {
    // Ignore settings fetch error
  }

  const deletedSet = new Set(globalDeletedIds);

  try {
    const { data, error } = await supabase.from('teachers').select('*').order('created_at', { ascending: false });
    if (!error && data && data.length > 0) {
      const teachersFromDb: Teacher[] = data
        .filter((item) => !deletedSet.has(item.id))
        .map((item) => {
          const seed = teachersData.find((init) => init.id === item.id);
          return {
            id: item.id,
            name: item.name || seed?.name || '',
            role: item.role || seed?.role || '',
            roleEn: item.role_en || item.roleEn || seed?.roleEn || '',
            image: item.image || seed?.image || '',
            mainHighlight: item.main_highlight || item.mainHighlight || seed?.mainHighlight || '',
            highlights: Array.isArray(item.highlights) ? item.highlights : seed?.highlights || [],
          };
        });

      const mergedMap = new Map<string, Teacher>();
      for (const item of teachersFromDb) {
        mergedMap.set(item.id, item);
      }
      for (const item of currentLocalTeachers) {
        mergedMap.set(item.id, item); // Local/IndexedDB item OVERRIDES DB item so user edits are NEVER lost!
      }

      const mergedList = Array.from(mergedMap.values()).filter((t) => !deletedSet.has(t.id));
      saveTeachers(mergedList);
      return mergedList;
    }
  } catch (err) {
    console.warn('Supabase teachers table offline or not synced yet:', err);
  }

  return currentLocalTeachers.length > 0 ? currentLocalTeachers : localList;
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
  const created: Teacher = {
    ...data,
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

  const updated: Teacher = {
    ...list[idx],
    ...data,
  };

  await syncTeacherToSupabase(updated);

  list[idx] = updated;
  saveTeachers(list);
  return { success: true, data: updated };
};

export const deleteTeacher = async (id: string): Promise<{ success: boolean; error?: string }> => {
  markTeacherAsDeleted(id);

  const list = getAllTeachers();
  const filtered = list.filter((t) => t.id !== id);
  saveTeachers(filtered);

  try {
    await supabase.from('teachers').delete().eq('id', id);
  } catch (err) {
    console.warn('Supabase delete teacher notice:', err);
  }

  try {
    const deletedList = getDeletedTeacherIds();
    await supabase.from('system_settings').upsert({
      key: 'icancam_deleted_teacher_ids',
      value: JSON.stringify(deletedList),
      updated_at: new Date().toISOString(),
    });
  } catch (err) {
    console.warn('Supabase system_settings sync notice:', err);
  }

  return { success: true };
};
