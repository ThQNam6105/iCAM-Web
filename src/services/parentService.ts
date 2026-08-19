import { supabase } from './supabaseClient';
import { parentsData, type ParentTestimonial } from '../data/parentData';
import { saveParentsIDB, getParentsIDB, compressBase64Image } from './cmsStorage';

export type { ParentTestimonial };

const LOCAL_STORAGE_KEY = 'icancam_parents_v1';
const DELETED_PARENTS_KEY = 'icancam_deleted_parent_ids_v1';

export const getDeletedParentIds = (): (string | number)[] => {
  try {
    const raw = localStorage.getItem(DELETED_PARENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveDeletedParentIds = (idsList: (string | number)[]) => {
  localStorage.setItem(DELETED_PARENTS_KEY, JSON.stringify(Array.from(new Set(idsList))));
};

export const markParentAsDeleted = (id: string | number) => {
  const ids = new Set(getDeletedParentIds());
  ids.add(id);
  saveDeletedParentIds(Array.from(ids));
};

let inMemoryParents: ParentTestimonial[] | null = null;

export const getAllParents = (): ParentTestimonial[] => {
  if (inMemoryParents) {
    const deletedSet = new Set(getDeletedParentIds());
    return inMemoryParents.filter((p) => !deletedSet.has(p.id));
  }
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    let list: ParentTestimonial[] = [];
    if (raw) {
      list = JSON.parse(raw);
    } else {
      list = parentsData;
    }
    const deletedSet = new Set(getDeletedParentIds());
    const cleanList = list.filter((p) => !deletedSet.has(p.id));
    inMemoryParents = cleanList;
    return cleanList;
  } catch {
    const deletedSet = new Set(getDeletedParentIds());
    const cleanList = parentsData.filter((p) => !deletedSet.has(p.id));
    inMemoryParents = cleanList;
    return cleanList;
  }
};

export const syncParentsToSystemSettings = async (list: ParentTestimonial[]) => {
  try {
    const deletedSet = new Set(getDeletedParentIds());
    const cleanList = list.filter((p) => !deletedSet.has(p.id));
    const compressedList = await Promise.all(
      cleanList.map(async (p) => {
        if (p.image && p.image.startsWith('data:image/') && p.image.length > 20000) {
          const comp = await compressBase64Image(p.image);
          return { ...p, image: comp };
        }
        return p;
      })
    );

    const { error } = await supabase.from('system_settings').upsert({
      key: 'icancam_all_parents_v1',
      value: JSON.stringify(compressedList),
      updated_at: new Date().toISOString(),
    });
    if (error) console.warn('Supabase system_settings parents sync error:', error.message);
  } catch (err) {
    console.warn('Supabase system_settings parents sync notice:', err);
  }
};

export const saveParents = (list: ParentTestimonial[]) => {
  const deletedSet = new Set(getDeletedParentIds());
  const cleanList = list.filter((p) => !deletedSet.has(p.id));
  inMemoryParents = cleanList;
  saveParentsIDB(cleanList);
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cleanList));
  } catch (err) {
    console.warn('LocalStorage save warning in parentService:', err);
  }
  syncParentsToSystemSettings(cleanList);
};

export const fetchParentsFromSupabase = async (): Promise<ParentTestimonial[]> => {
  const idbParents = await getParentsIDB();
  const localList = getAllParents();

  const localMap = new Map<string | number, ParentTestimonial>();
  for (const p of localList) localMap.set(p.id, p);
  for (const p of idbParents) localMap.set(p.id, p);
  const currentLocalParents = Array.from(localMap.values());

  let globalDeletedIds = getDeletedParentIds();
  try {
    const { data: settingsData } = await supabase
      .from('system_settings')
      .select('value')
      .eq('key', 'icancam_deleted_parent_ids')
      .maybeSingle();
    if (settingsData && settingsData.value) {
      const parsed = JSON.parse(settingsData.value);
      if (Array.isArray(parsed) && parsed.length > 0) {
        globalDeletedIds = Array.from(new Set([...globalDeletedIds, ...parsed]));
        saveDeletedParentIds(globalDeletedIds);
      }
    }
  } catch {
    // Ignore settings fetch error
  }

  const deletedSet = new Set(globalDeletedIds);

  try {
    const { data: globalSetting } = await supabase
      .from('system_settings')
      .select('value')
      .eq('key', 'icancam_all_parents_v1')
      .maybeSingle();

    if (globalSetting && globalSetting.value) {
      const parsed: ParentTestimonial[] = JSON.parse(globalSetting.value);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const cleanGlobal = parsed.filter((p) => !deletedSet.has(p.id));
        inMemoryParents = cleanGlobal;
        saveParentsIDB(cleanGlobal);
        try {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cleanGlobal));
        } catch {
          // Ignore
        }
        return cleanGlobal;
      }
    }
  } catch (err) {
    console.warn('System settings global parents fetch notice:', err);
  }

  return currentLocalParents.length > 0 ? currentLocalParents : localList;
};

export const createParent = async (
  data: Omit<ParentTestimonial, 'id'>
): Promise<{ success: boolean; data?: ParentTestimonial; error?: string }> => {
  try {
    let image = data.image;
    if (image && image.startsWith('data:image/') && image.length > 20000) {
      image = await compressBase64Image(image);
    }

    const newParent: ParentTestimonial = {
      id: Date.now(),
      childName: data.childName,
      image,
      feedback: data.feedback,
      feedbackEn: data.feedbackEn || data.feedback,
      years: data.years || 10,
    };

    const list = getAllParents();
    list.unshift(newParent);
    saveParents(list);

    return { success: true, data: newParent };
  } catch (err: any) {
    return { success: false, error: err.message || 'Lỗi khi tạo đánh giá phụ huynh' };
  }
};

export const updateParent = async (
  id: string | number,
  data: Partial<ParentTestimonial>
): Promise<{ success: boolean; data?: ParentTestimonial; error?: string }> => {
  const list = getAllParents();
  const idx = list.findIndex((p) => String(p.id) === String(id));
  if (idx === -1) return { success: false, error: 'Ý kiến phụ huynh không tồn tại' };

  let image = data.image !== undefined ? data.image : list[idx].image;
  if (image && image.startsWith('data:image/') && image.length > 20000) {
    image = await compressBase64Image(image);
  }

  const updated: ParentTestimonial = {
    ...list[idx],
    ...data,
    image,
  };

  list[idx] = updated;
  saveParents(list);
  return { success: true, data: updated };
};

export const deleteParent = async (id: string | number): Promise<{ success: boolean; error?: string }> => {
  markParentAsDeleted(id);

  const list = getAllParents();
  const filtered = list.filter((p) => String(p.id) !== String(id));
  saveParents(filtered);

  try {
    const deletedList = getDeletedParentIds();
    await supabase.from('system_settings').upsert({
      key: 'icancam_deleted_parent_ids',
      value: JSON.stringify(deletedList),
      updated_at: new Date().toISOString(),
    });
  } catch (err) {
    console.warn('Supabase system_settings sync notice:', err);
  }

  return { success: true };
};
