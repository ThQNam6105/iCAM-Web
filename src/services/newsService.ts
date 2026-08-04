import { articlesData, type Article } from '../data/newsData';

const LOCAL_STORAGE_KEY = 'icancam_dynamic_news_posts';

export interface DynamicNewsItem extends Article {
  id: number | string;
  isCustom?: boolean;
  createdAt?: string;
}

// Get all news posts (combining default articlesData + dynamic posts)
export const getNewsPosts = (): DynamicNewsItem[] => {
  try {
    const customPostsRaw = localStorage.getItem(LOCAL_STORAGE_KEY);
    const customPosts: DynamicNewsItem[] = customPostsRaw ? JSON.parse(customPostsRaw) : [];
    
    // Map default posts
    const defaultPosts: DynamicNewsItem[] = articlesData.map((post) => ({
      ...post,
      isCustom: false,
    }));

    return [...customPosts, ...defaultPosts];
  } catch (error) {
    console.error('Error reading news posts:', error);
    return articlesData.map((post) => ({ ...post, isCustom: false }));
  }
};

// Add a new news post
export const addNewsPost = (newPost: Omit<DynamicNewsItem, 'id' | 'isCustom' | 'createdAt'>): DynamicNewsItem => {
  const customPostsRaw = localStorage.getItem(LOCAL_STORAGE_KEY);
  const customPosts: DynamicNewsItem[] = customPostsRaw ? JSON.parse(customPostsRaw) : [];

  const createdPost: DynamicNewsItem = {
    ...newPost,
    id: `custom_${Date.now()}`,
    isCustom: true,
    createdAt: new Date().toISOString(),
  };

  const updatedPosts = [createdPost, ...customPosts];
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedPosts));
  return createdPost;
};

// Delete a news post by ID
export const deleteNewsPost = (id: string | number): boolean => {
  try {
    const customPostsRaw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!customPostsRaw) return false;

    const customPosts: DynamicNewsItem[] = JSON.parse(customPostsRaw);
    const filtered = customPosts.filter((post) => String(post.id) !== String(id));

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error deleting news post:', error);
    return false;
  }
};

// Check if user is authenticated as Admin
export const isAdminAuthenticated = (): boolean => {
  return sessionStorage.getItem('icancam_admin_session') === 'true';
};

// Admin Login helper
export const loginAdmin = (password: string): boolean => {
  // Default admin pass: icancam2026
  if (password === 'icancam2026' || password === 'admin123') {
    sessionStorage.setItem('icancam_admin_session', 'true');
    return true;
  }
  return false;
};

// Admin Logout helper
export const logoutAdmin = (): void => {
  sessionStorage.removeItem('icancam_admin_session');
};
