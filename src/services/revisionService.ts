import { type DynamicNewsItem } from './newsService';

export interface PostRevision {
  id: string;
  postId: string | number;
  versionNumber: number;
  timestamp: string;
  title: string;
  content: string;
  excerpt: string;
  status: string;
}

const REVISIONS_STORAGE_KEY = 'icancam_post_revisions_v1';

export const getPostRevisions = (postId: string | number): PostRevision[] => {
  try {
    const raw = localStorage.getItem(REVISIONS_STORAGE_KEY);
    const allRevisions: PostRevision[] = raw ? JSON.parse(raw) : [];
    return allRevisions
      .filter((r) => String(r.postId) === String(postId))
      .sort((a, b) => b.versionNumber - a.versionNumber);
  } catch {
    return [];
  }
};

export const createPostRevision = (post: Partial<DynamicNewsItem>): PostRevision | null => {
  if (!post.id) return null;

  try {
    const raw = localStorage.getItem(REVISIONS_STORAGE_KEY);
    const allRevisions: PostRevision[] = raw ? JSON.parse(raw) : [];

    const existingForPost = allRevisions.filter((r) => String(r.postId) === String(post.id));
    const nextVersion = existingForPost.length + 1;

    const newRevision: PostRevision = {
      id: `rev_${Date.now()}`,
      postId: post.id,
      versionNumber: nextVersion,
      timestamp: new Date().toLocaleTimeString('vi-VN') + ' - ' + new Date().toLocaleDateString('vi-VN'),
      title: post.title || 'Bài viết chưa có tiêu đề',
      content: post.content || '',
      excerpt: post.excerpt || '',
      status: post.status || 'draft',
    };

    // Keep max 10 revisions per post
    const updated = [newRevision, ...allRevisions].slice(0, 100);
    localStorage.setItem(REVISIONS_STORAGE_KEY, JSON.stringify(updated));

    return newRevision;
  } catch (error) {
    console.error('Error creating revision:', error);
    return null;
  }
};
