import { supabase } from './supabaseClient';
import { type ParentTestimonial } from '../data/parentData';
import { saveParentsIDB, compressBase64Image } from './cmsStorage';

export type { ParentTestimonial };

const LOCAL_STORAGE_KEY = 'icancam_parents_v1';
let inMemoryParents: ParentTestimonial[] | null = null;

// PARENTS CRUD - SUPABASE AS SINGLE SOURCE OF TRUTH
export const getAllParents = (): ParentTestimonial[] => {
  if (inMemoryParents) {
    return inMemoryParents;
  }
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const list = JSON.parse(raw);
      inMemoryParents = list;
      return list;
    }
    return [];
  } catch {
    return [];
  }
};

export const syncParentsToSystemSettings = async (list: ParentTestimonial[]) => {
  try {
    const compressedList = await Promise.all(
      list.map(async (p) => {
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
  inMemoryParents = list;
  saveParentsIDB(list);
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
  } catch (err) {
    console.warn('LocalStorage save warning in parentService:', err);
  }
  syncParentsToSystemSettings(list);
};

export const fetchParentsFromSupabase = async (): Promise<ParentTestimonial[]> => {
  try {
    const { data: globalSetting, error } = await supabase
      .from('system_settings')
      .select('value')
      .eq('key', 'icancam_all_parents_v1')
      .maybeSingle();

    if (!error && globalSetting && globalSetting.value) {
      const parsed: ParentTestimonial[] = JSON.parse(globalSetting.value);
      if (Array.isArray(parsed)) {
        inMemoryParents = parsed;
        saveParentsIDB(parsed);
        try {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parsed));
        } catch {
          // Ignore
        }
        return parsed;
      }
    }
  } catch (err) {
    console.warn('System settings global parents fetch notice:', err);
  }
  return getAllParents();
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
  const list = getAllParents();
  const filtered = list.filter((p) => String(p.id) !== String(id));
  saveParents(filtered);
  return { success: true };
};
