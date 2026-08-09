import { supabase } from './supabaseClient';

export interface CategoryItem {
  id: string;
  slug: string;
  nameVi: string;
  nameEn: string;
  color?: string;
  icon?: string;
  description?: string;
  order: number;
}

const LOCAL_STORAGE_KEY = 'icancam_dynamic_categories_v2';

export const DEFAULT_CATEGORIES: CategoryItem[] = [
  {
    id: 'su-kien',
    slug: 'su-kien',
    nameVi: 'SỰ KIỆN',
    nameEn: 'EVENTS',
    color: '#F58220',
    icon: 'Sparkles',
    description: 'Các sự kiện, workshop và hoạt động nổi bật tại trung tâm iCANCAM',
    order: 1,
  },
  {
    id: 'tuyen-dung',
    slug: 'tuyen-dung',
    nameVi: 'TUYỂN DỤNG',
    nameEn: 'RECRUITMENT',
    color: '#8b5cf6',
    icon: 'Briefcase',
    description: 'Tin tức tuyển dụng giáo viên và nhân sự tại trung tâm iCANCAM',
    order: 2,
  },
  {
    id: 'cuoc-thi',
    slug: 'cuoc-thi',
    nameVi: 'CUỘC THI',
    nameEn: 'CONTEST',
    color: '#ef4444',
    icon: 'Award',
    description: 'Các cuộc thi học thuật, sân chơi Tiếng Anh và học bổng vinh danh',
    order: 3,
  },
];

// Initialize and get all categories
export const getCategories = (): CategoryItem[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.sort((a, b) => a.order - b.order);
      }
    }
  } catch (err) {
    console.error('Error reading categories from localStorage:', err);
  }

  // Fallback to default
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_CATEGORIES));
  return DEFAULT_CATEGORIES;
};

// Save local storage categories
const saveToLocal = (categories: CategoryItem[]) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(categories));
};

// Sync with Supabase Database
export const fetchCategoriesFromSupabase = async (): Promise<CategoryItem[]> => {
  try {
    const { data, error } = await supabase.from('news_categories').select('*').order('order', { ascending: true });
    if (!error && data && data.length > 0) {
      const formatted: CategoryItem[] = data.map((item) => ({
        id: item.id || item.slug,
        slug: item.slug,
        nameVi: item.name_vi || item.name_vi,
        nameEn: item.name_en || item.name_vi,
        color: item.color || '#F58220',
        icon: item.icon || 'Folder',
        description: item.description || '',
        order: item.order || 1,
      }));
      saveToLocal(formatted);
      return formatted;
    }
  } catch (e) {
    console.warn('Supabase categories sync fallback to local cache', e);
  }
  return getCategories();
};

// Save (Create or Update) Category
export const saveCategory = async (categoryData: Partial<CategoryItem>): Promise<CategoryItem[]> => {
  const current = getCategories();
  const id = categoryData.id || categoryData.slug || `cat_${Date.now()}`;
  const slug = categoryData.slug || id;

  const newCategory: CategoryItem = {
    id,
    slug,
    nameVi: categoryData.nameVi || 'DANH MỤC MỚI',
    nameEn: categoryData.nameEn || categoryData.nameVi || 'NEW CATEGORY',
    color: categoryData.color || '#F58220',
    icon: categoryData.icon || 'Folder',
    description: categoryData.description || '',
    order: categoryData.order || current.length + 1,
  };

  const existingIdx = current.findIndex((c) => c.id === id || c.slug === slug);
  let updatedList: CategoryItem[];

  if (existingIdx >= 0) {
    updatedList = [...current];
    updatedList[existingIdx] = { ...updatedList[existingIdx], ...newCategory };
  } else {
    updatedList = [...current, newCategory];
  }

  saveToLocal(updatedList);

  // Sync with Supabase database
  try {
    await supabase.from('news_categories').upsert({
      id: newCategory.id,
      slug: newCategory.slug,
      name_vi: newCategory.nameVi,
      name_en: newCategory.nameEn,
      color: newCategory.color,
      icon: newCategory.icon,
      description: newCategory.description,
      order: newCategory.order,
    });
  } catch (err) {
    console.warn('Could not sync category to Supabase:', err);
  }

  return updatedList;
};

// Delete Category
export const deleteCategory = async (categoryId: string): Promise<CategoryItem[]> => {
  const current = getCategories();
  const updatedList = current.filter((c) => c.id !== categoryId && c.slug !== categoryId);
  saveToLocal(updatedList);

  try {
    await supabase.from('news_categories').delete().eq('id', categoryId);
  } catch (err) {
    console.warn('Could not delete category from Supabase:', err);
  }

  return updatedList;
};

// Helper to get dynamic category color
export const getCategoryColor = (catId?: string, label?: string): string => {
  const cats = getCategories();
  if (!catId && !label) return '#F58220';
  const normCat = (catId || '').toLowerCase().trim();
  const normLabel = (label || '').toLowerCase().trim();

  const found = cats.find(
    (c) =>
      c.id.toLowerCase() === normCat ||
      c.slug.toLowerCase() === normCat ||
      c.nameVi.toLowerCase() === normCat ||
      c.nameVi.toLowerCase() === normLabel ||
      c.nameEn.toLowerCase() === normLabel
  );
  return found?.color || '#F58220';
};

// Helper to get dynamic category label
export const getCategoryDisplayLabel = (
  catId?: string,
  savedLabel?: string,
  savedLabelEn?: string,
  lang: 'vi' | 'en' = 'vi'
): string => {
  const cats = getCategories();
  const normCat = (catId || '').toLowerCase().trim();
  const normLabel = (savedLabel || '').toLowerCase().trim();

  const found = cats.find(
    (c) =>
      c.id.toLowerCase() === normCat ||
      c.slug.toLowerCase() === normCat ||
      c.nameVi.toLowerCase() === normCat ||
      c.nameVi.toLowerCase() === normLabel
  );

  if (found) {
    return lang === 'en' ? (found.nameEn || found.nameVi) : found.nameVi;
  }

  if (lang === 'en' && savedLabelEn) return savedLabelEn;
  return savedLabel || catId || 'TIN TỨC';
};
