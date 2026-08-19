import { articlesData, type Article } from '../data/newsData';
import { supabase } from './supabaseClient';

const LOCAL_STORAGE_KEY = 'icancam_dynamic_news_posts_v4';
const AUTOSAVE_DRAFT_KEY = 'icancam_news_draft_autosave';

let inMemoryNewsPostsCache: DynamicNewsItem[] = [];

const safeSetLocalStorage = (key: string, value: string): void => {
  try {
    localStorage.setItem(key, value);
  } catch (err) {
    console.warn(`[LocalStorage Notice] Storage quota exceeded writing "${key}". Supabase Cloud Database remains the authoritative source of truth.`, err);
  }
};

export type PostStatus = 'draft' | 'published' | 'archived';

export interface DynamicNewsItem extends Article {
  id: string | number;
  slug: string;
  status: PostStatus;
  author: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  featured: boolean;
  readingTime: string;
  isCustom?: boolean;
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  canonicalUrlOverride?: string;
  noIndex?: boolean;
  noFollow?: boolean;
}

export interface PostFilterOptions {
  searchQuery?: string;
  category?: string;
  status?: PostStatus | 'all';
  sortBy?: 'newest' | 'oldest' | 'alphabetical';
}

// Generate SEO-friendly slug
export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

// Calculate reading time roughly
export const calculateReadingTime = (content: string): string => {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 180));
  return `${minutes} phút đọc`;
};

// Sync and fetch posts from Supabase Database
export const fetchPostsFromSupabase = async (): Promise<DynamicNewsItem[]> => {
  try {
    const { data, error } = await supabase.from('news_posts').select('*').order('created_at', { ascending: false });

    if (!error && data) {
      const postsFromDb: DynamicNewsItem[] = data.map((item) => ({
        id: item.id,
        title: item.title,
        titleEn: item.title_en || item.title,
        slug: item.slug,
        category: item.category,
        categoryLabel: item.category_label,
        categoryLabelEn: item.category_label_en,
        status: item.status as PostStatus,
        author: item.author || 'iCANCAM Editor',
        excerpt: item.excerpt,
        excerptEn: item.excerpt_en || item.excerpt,
        content: item.content,
        contentEn: item.content_en || item.content,
        image: item.image,
        imageEn: item.image_en || item.image,
        url: item.url || '/news',
        date: item.date || item.published_at,
        publishedAt: item.published_at,
        readingTime: item.reading_time || '3 phút đọc',
        featured: item.featured ?? true,
        isCustom: item.is_custom ?? true,
        tags: item.tags || ['Anh ngữ', 'Giáo dục'],
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      }));

      // Cache exact Supabase posts into localStorage so all devices & sessions stay 100% in sync
      inMemoryNewsPostsCache = postsFromDb;
      safeSetLocalStorage(LOCAL_STORAGE_KEY, JSON.stringify(postsFromDb));
      return postsFromDb;
    }
  } catch (err) {
    console.warn('Supabase table not created yet or offline, using local storage cache:', err);
  }
  return getAllNewsPosts();
};

// Get raw combined posts from storage (seed with default data if empty)
export const getAllNewsPosts = (): DynamicNewsItem[] => {
  try {
    const customPostsRaw = localStorage.getItem(LOCAL_STORAGE_KEY);
    let posts: DynamicNewsItem[] = [];
    if (customPostsRaw) {
      posts = JSON.parse(customPostsRaw);
    } else if (inMemoryNewsPostsCache.length > 0) {
      posts = inMemoryNewsPostsCache;
    } else {
      // Seed default articles into localStorage with fixed baseline past timestamp
      const baselineTime = '2026-08-01T00:00:00.000Z';
      posts = articlesData.map((post) => ({
        ...post,
        id: post.id,
        slug: generateSlug(post.title),
        status: 'published',
        author: 'iCANCAM Editor',
        tags: ['Anh ngữ', 'Giáo dục'],
        createdAt: baselineTime,
        updatedAt: baselineTime,
        publishedAt: post.date,
        featured: true,
        readingTime: '3 phút đọc',
        isCustom: false,
      }));
      safeSetLocalStorage(LOCAL_STORAGE_KEY, JSON.stringify(posts));
    }

    inMemoryNewsPostsCache = posts;
    return posts;
  } catch (error) {
    console.error('Error reading news posts:', error);
    return [];
  }
};

// Public website: Only get published posts
export const getPublicNewsPosts = (): DynamicNewsItem[] => {
  return getAllNewsPosts().filter((post) => post.status === 'published');
};

// Filter, search & sort posts for Admin
export const getFilteredNewsPosts = (options: PostFilterOptions): DynamicNewsItem[] => {
  let posts = getAllNewsPosts();

  const { searchQuery, category, status, sortBy = 'newest' } = options;

  if (searchQuery && searchQuery.trim() !== '') {
    const q = searchQuery.toLowerCase().trim();
    posts = posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        (p.titleEn && p.titleEn.toLowerCase().includes(q)) ||
        p.slug.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }

  if (category && category !== 'all') {
    posts = posts.filter((p) => p.category === category);
  }

  if (status && status !== 'all') {
    posts = posts.filter((p) => p.status === status);
  }

  // Sorting
  posts.sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sortBy === 'oldest') {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    if (sortBy === 'alphabetical') {
      return a.title.localeCompare(b.title, 'vi');
    }
    return 0;
  });

  return posts;
};

// Helper to sync single post to Supabase
export const syncPostToSupabase = async (post: DynamicNewsItem): Promise<{ success: boolean; error?: string }> => {
  try {
    const rawIdStr = String(post.id).replace('default_', '').replace('post_', '');
    const dbId = !isNaN(Number(rawIdStr)) && Number(rawIdStr) > 0 ? Number(rawIdStr) : Date.now();

    const { error } = await supabase.from('news_posts').upsert({
      id: dbId,
      title: post.title,
      title_en: post.titleEn || post.title,
      slug: post.slug,
      category: post.category,
      category_label: post.categoryLabel,
      category_label_en: post.categoryLabelEn || post.categoryLabel,
      status: post.status,
      author: post.author || 'iCANCAM Admin',
      excerpt: post.excerpt,
      excerpt_en: post.excerptEn || post.excerpt,
      content: post.content,
      content_en: post.contentEn || post.content,
      image: post.image,
      url: post.url || '/news',
      date: post.date || post.publishedAt || new Date().toLocaleDateString('vi-VN'),
      published_at: post.publishedAt,
      reading_time: post.readingTime || '3 phút đọc',
      featured: post.featured ?? true,
      is_custom: post.isCustom ?? true,
      tags: post.tags || ['Anh ngữ', 'Giáo dục'],
      created_at: post.createdAt || new Date().toISOString(),
      updated_at: post.updatedAt || new Date().toISOString(),
    });
    if (error) {
      console.error('Supabase news_posts upsert error:', error.message, error.details);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    console.error('Supabase sync exception:', err);
    return { success: false, error: err?.message || 'Lỗi kết nối khi đồng bộ CSDL' };
  }
};

// Helper to sync all local posts to Supabase & clean up deleted posts in DB
export const syncAllLocalPostsToSupabase = async () => {
  try {
    const localPosts = getAllNewsPosts();
    if (localPosts.length === 0) return;

    const localIdSet = new Set(
      localPosts.map((p) => String(p.id).replace('default_', '').replace('post_', ''))
    );

    // 1. Fetch current IDs in Supabase DB
    const { data: dbRows, error } = await supabase.from('news_posts').select('id');
    if (!error && dbRows && dbRows.length > 0) {
      for (const row of dbRows) {
        const dbIdStr = String(row.id).replace('default_', '').replace('post_', '');
        // If a post exists in Supabase DB but is NOT in Admin local posts, delete it from Supabase DB!
        if (!localIdSet.has(dbIdStr) && !localIdSet.has(String(row.id))) {
          const dbIdVal = !isNaN(Number(dbIdStr)) ? Number(dbIdStr) : row.id;
          await supabase.from('news_posts').delete().eq('id', dbIdVal);
        }
      }
    }

    // 2. Upsert current local posts to Supabase DB
    for (const post of localPosts) {
      await syncPostToSupabase(post);
    }
  } catch (err) {
    console.warn('Sync error:', err);
  }
};

// Create new post
export const createNewsPost = async (
  data: Omit<DynamicNewsItem, 'id' | 'createdAt' | 'updatedAt' | 'isCustom'>
): Promise<{ success: boolean; data?: DynamicNewsItem; error?: string }> => {
  const posts = getAllNewsPosts();

  const now = new Date().toISOString();
  const numericId = Date.now();
  const createdPost: DynamicNewsItem = {
    ...data,
    id: numericId,
    slug: data.slug || generateSlug(data.title),
    createdAt: now,
    updatedAt: now,
    publishedAt: data.status === 'published' ? new Date().toLocaleDateString('vi-VN') : undefined,
    readingTime: calculateReadingTime(data.content),
    isCustom: true,
  };

  const syncRes = await syncPostToSupabase(createdPost);
  if (!syncRes.success) {
    return { success: false, error: syncRes.error };
  }

  const updatedPosts = [createdPost, ...posts];
  inMemoryNewsPostsCache = updatedPosts;
  safeSetLocalStorage(LOCAL_STORAGE_KEY, JSON.stringify(updatedPosts));

  return { success: true, data: createdPost };
};

// Update existing post
export const updateNewsPost = async (
  id: string | number,
  data: Partial<Omit<DynamicNewsItem, 'id' | 'createdAt' | 'isCustom'>>
): Promise<{ success: boolean; data?: DynamicNewsItem; error?: string }> => {
  const posts = getAllNewsPosts();
  const targetIdStr = String(id).replace('default_', '').replace('post_', '');

  let index = posts.findIndex(
    (p) =>
      String(p.id) === String(id) ||
      String(p.id).replace('default_', '').replace('post_', '') === targetIdStr
  );

  // If still not found by ID, try matching by slug or title
  if (index === -1 && data.title) {
    const searchSlug = data.slug || generateSlug(data.title);
    index = posts.findIndex((p) => p.slug === searchSlug || generateSlug(p.title) === searchSlug);
  }

  // Fallback: If post doesn't exist in local array, create it as new post!
  if (index === -1) {
    const newPostData = {
      title: data.title || 'Bài viết tin tức iCANCAM',
      titleEn: data.titleEn || data.title || 'iCANCAM News Article',
      slug: data.slug || (data.title ? generateSlug(data.title) : `post_${Date.now()}`),
      status: data.status || 'draft',
      category: data.category || 'news',
      categoryLabel: data.categoryLabel || 'TIN TỨC',
      categoryLabelEn: data.categoryLabelEn || 'NEWS',
      image: data.image || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop',
      imageEn: data.imageEn || data.image || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop',
      excerpt: data.excerpt || data.title || '',
      excerptEn: data.excerptEn || data.excerpt || data.title || '',
      content: data.content || `<p>${data.title || ''}</p>`,
      contentEn: data.contentEn || data.content || `<p>${data.title || ''}</p>`,
      url: '/news',
      author: 'iCANCAM Admin',
      tags: ['Anh ngữ', 'Giáo dục'],
      featured: true,
      readingTime: '3 phút đọc',
      date: data.date || new Date().toLocaleDateString('vi-VN'),
      ...data,
    } as any;
    return createNewsPost(newPostData);
  }

  const now = new Date().toISOString();
  const updatedPost: DynamicNewsItem = {
    ...posts[index],
    ...data,
    updatedAt: now,
    publishedAt:
      data.status === 'published' && !posts[index].publishedAt
        ? new Date().toLocaleDateString('vi-VN')
        : posts[index].publishedAt,
    readingTime: data.content ? calculateReadingTime(data.content) : posts[index].readingTime,
  };

  const syncRes = await syncPostToSupabase(updatedPost);
  if (!syncRes.success) {
    return { success: false, error: syncRes.error };
  }

  posts[index] = updatedPost;
  inMemoryNewsPostsCache = posts;
  safeSetLocalStorage(LOCAL_STORAGE_KEY, JSON.stringify(posts));

  return { success: true, data: updatedPost };
};

// Delete post
export const deleteNewsPost = async (id: string | number): Promise<boolean> => {
  try {
    const posts = getAllNewsPosts();
    const targetIdStr = String(id).replace('default_', '').replace('post_', '');

    const filtered = posts.filter(
      (post) =>
        String(post.id) !== String(id) &&
        String(post.id).replace('default_', '').replace('post_', '') !== targetIdStr
    );

    inMemoryNewsPostsCache = filtered;
    safeSetLocalStorage(LOCAL_STORAGE_KEY, JSON.stringify(filtered));

    // Delete from Supabase Database
    const dbIdVal = !isNaN(Number(targetIdStr)) ? Number(targetIdStr) : targetIdStr;
    const { error } = await supabase.from('news_posts').delete().eq('id', dbIdVal);
    if (error) {
      console.warn('Supabase delete error:', error.message);
    }

    return true;
  } catch (error) {
    console.error('Error deleting news post:', error);
    return false;
  }
};

// Autosave draft helper
export const saveDraftAutosave = (draftData: Partial<DynamicNewsItem>): void => {
  safeSetLocalStorage(AUTOSAVE_DRAFT_KEY, JSON.stringify({ ...draftData, savedAt: new Date().toISOString() }));
};

export const getDraftAutosave = (): (Partial<DynamicNewsItem> & { savedAt?: string }) | null => {
  try {
    const raw = localStorage.getItem(AUTOSAVE_DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const clearDraftAutosave = (): void => {
  localStorage.removeItem(AUTOSAVE_DRAFT_KEY);
};

// Validation Helper
export interface ValidationError {
  title?: string;
  titleEn?: string;
  excerpt?: string;
  content?: string;
  image?: string;
}

export const validatePostForm = (data: Partial<DynamicNewsItem>): ValidationError => {
  const errors: ValidationError = {};
  if (!data.title || data.title.trim().length === 0) {
    errors.title = 'Vui lòng nhập tiêu đề bài viết.';
  }
  return errors;
};
