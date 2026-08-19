import { articlesData, type Article } from '../data/newsData';
import { supabase } from './supabaseClient';

const LOCAL_STORAGE_KEY = 'icancam_dynamic_news_posts_v3';
const AUTOSAVE_DRAFT_KEY = 'icancam_news_draft_autosave';

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
    const localPosts = getAllNewsPosts();

    if (!error && data && data.length > 0) {
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

      // Smart merge: Local edits win if local updatedAt is newer or equal
      const mergedPostsMap = new Map<string, DynamicNewsItem>();
      postsFromDb.forEach((dbPost) => {
        mergedPostsMap.set(String(dbPost.id), dbPost);
      });

      localPosts.forEach((localPost) => {
        const key = String(localPost.id).replace('default_', '');
        const dbPost = mergedPostsMap.get(key) || mergedPostsMap.get(String(localPost.id));

        const localTime = new Date(localPost.updatedAt || 0).getTime();
        const dbTime = dbPost ? new Date(dbPost.updatedAt || 0).getTime() : 0;

        if (!dbPost || localTime >= dbTime) {
          mergedPostsMap.set(key, { ...localPost, id: dbPost ? dbPost.id : localPost.id });
          if (dbPost && localTime > dbTime) {
            // Push local edit back to Supabase
            syncPostToSupabase(localPost);
          }
        }
      });

      const finalPosts = Array.from(mergedPostsMap.values());
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(finalPosts));
      return finalPosts;
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
    } else {
      // Seed default articles into localStorage so all of them are editable & deletable
      posts = articlesData.map((post) => ({
        ...post,
        id: post.id,
        slug: generateSlug(post.title),
        status: 'published',
        author: 'iCANCAM Editor',
        tags: ['Anh ngữ', 'Giáo dục'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        publishedAt: post.date,
        featured: true,
        readingTime: '3 phút đọc',
        isCustom: true,
      }));
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(posts));
    }

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
const syncPostToSupabase = async (post: DynamicNewsItem) => {
  try {
    const rawId = String(post.id).replace('default_', '');
    const dbId = !isNaN(Number(rawId)) ? Number(rawId) : rawId;

    const { error } = await supabase.from('news_posts').upsert({
      id: dbId,
      title: post.title,
      title_en: post.titleEn,
      slug: post.slug,
      category: post.category,
      category_label: post.categoryLabel,
      category_label_en: post.categoryLabelEn,
      status: post.status,
      author: post.author,
      excerpt: post.excerpt,
      excerpt_en: post.excerptEn,
      content: post.content,
      content_en: post.contentEn,
      image: post.image,
      image_en: post.imageEn || post.image,
      og_image: post.ogImage || post.image,
      og_title: post.ogTitle || post.title,
      og_description: post.ogDescription || post.excerpt,
      canonical_url_override: post.canonicalUrlOverride,
      url: post.url,
      date: post.date,
      published_at: post.publishedAt,
      reading_time: post.readingTime,
      featured: post.featured,
      is_custom: post.isCustom,
      tags: post.tags,
      created_at: post.createdAt,
      updated_at: post.updatedAt,
    });
    if (error) {
      console.warn('Supabase upsert error:', error.message);
    }
  } catch (err) {
    console.warn('Supabase sync warning:', err);
  }
};

// Create new post
export const createNewsPost = (
  data: Omit<DynamicNewsItem, 'id' | 'createdAt' | 'updatedAt' | 'isCustom'>
): DynamicNewsItem => {
  const posts = getAllNewsPosts();

  const now = new Date().toISOString();
  const createdPost: DynamicNewsItem = {
    ...data,
    id: `post_${Date.now()}`,
    slug: data.slug || generateSlug(data.title),
    createdAt: now,
    updatedAt: now,
    publishedAt: data.status === 'published' ? new Date().toLocaleDateString('vi-VN') : undefined,
    readingTime: calculateReadingTime(data.content),
    isCustom: true,
  };

  const updatedPosts = [createdPost, ...posts];
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedPosts));

  // Sync background to Supabase
  syncPostToSupabase(createdPost);

  return createdPost;
};

// Update existing post
export const updateNewsPost = (
  id: string | number,
  data: Partial<Omit<DynamicNewsItem, 'id' | 'createdAt' | 'isCustom'>>
): DynamicNewsItem | null => {
  const posts = getAllNewsPosts();

  const index = posts.findIndex((p) => String(p.id) === String(id));
  if (index === -1) return null;

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

  posts[index] = updatedPost;
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(posts));

  // Sync background to Supabase
  syncPostToSupabase(updatedPost);

  return updatedPost;
};

// Delete post
export const deleteNewsPost = (id: string | number): boolean => {
  try {
    const posts = getAllNewsPosts();
    const filtered = posts.filter((post) => String(post.id) !== String(id));

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));

    // Async delete from Supabase
    supabase.from('news_posts').delete().eq('id', String(id)).then();

    return true;
  } catch (error) {
    console.error('Error deleting news post:', error);
    return false;
  }
};

// Autosave draft helper
export const saveDraftAutosave = (draftData: Partial<DynamicNewsItem>): void => {
  localStorage.setItem(AUTOSAVE_DRAFT_KEY, JSON.stringify({ ...draftData, savedAt: new Date().toISOString() }));
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
