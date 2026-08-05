import { articlesData, type Article } from '../data/newsData';

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

// Get raw combined posts from storage (seed with default data if empty)
export const getAllNewsPosts = (): DynamicNewsItem[] => {
  try {
    const customPostsRaw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (customPostsRaw) {
      return JSON.parse(customPostsRaw);
    }

    // Seed default articles into localStorage so all of them are editable & deletable
    const initialPosts: DynamicNewsItem[] = articlesData.map((post) => ({
      ...post,
      id: `default_${post.id}`,
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

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialPosts));
    return initialPosts;
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
  return updatedPost;
};

// Delete post
export const deleteNewsPost = (id: string | number): boolean => {
  try {
    const posts = getAllNewsPosts();
    const filtered = posts.filter((post) => String(post.id) !== String(id));

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
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
  if (!data.title || data.title.trim().length < 5) {
    errors.title = 'Tiêu đề tiếng Việt phải dài ít nhất 5 ký tự.';
  }
  if (!data.titleEn || data.titleEn.trim().length < 5) {
    errors.titleEn = 'Tiêu đề tiếng Anh phải dài ít nhất 5 ký tự.';
  }
  if (!data.excerpt || data.excerpt.trim().length < 10) {
    errors.excerpt = 'Tóm tắt bài viết phải dài ít nhất 10 ký tự.';
  }
  if (!data.content || data.content.trim().length < 20) {
    errors.content = 'Nội dung chi tiết phải dài ít nhất 20 ký tự.';
  }
  if (!data.image || (!data.image.startsWith('http') && !data.image.startsWith('data:image/'))) {
    errors.image = 'Vui lòng nhập đường dẫn URL hình ảnh hoặc tải ảnh từ máy tính lên.';
  }
  return errors;
};
