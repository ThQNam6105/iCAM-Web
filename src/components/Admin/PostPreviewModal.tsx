import React, { useState } from 'react';
import { Monitor, Tablet, Smartphone, X } from 'lucide-react';
import { type DynamicNewsItem } from '../../services/newsService';
import { getCategoryColor } from '../../services/categoryService';
import styles from './PostPreviewModal.module.css';

interface PostPreviewModalProps {
  isOpen: boolean;
  post: Partial<DynamicNewsItem>;
  onClose: () => void;
}

export const PostPreviewModal: React.FC<PostPreviewModalProps> = ({ isOpen, post, onClose }) => {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.topBar}>
        <div className={styles.deviceSwitcher}>
          <button
            type="button"
            onClick={() => setDevice('desktop')}
            className={`${styles.deviceBtn} ${device === 'desktop' ? styles.deviceBtnActive : ''}`}
          >
            <Monitor size={16} /> Desktop
          </button>
          <button
            type="button"
            onClick={() => setDevice('tablet')}
            className={`${styles.deviceBtn} ${device === 'tablet' ? styles.deviceBtnActive : ''}`}
          >
            <Tablet size={16} /> Tablet
          </button>
          <button
            type="button"
            onClick={() => setDevice('mobile')}
            className={`${styles.deviceBtn} ${device === 'mobile' ? styles.deviceBtnActive : ''}`}
          >
            <Smartphone size={16} /> Mobile
          </button>
        </div>

        <button type="button" onClick={onClose} className={styles.closeBtn}>
          <X size={18} /> Đóng Xem Trước
        </button>
      </div>

      <div className={styles.previewFrameWrapper}>
        <div className={`${styles.previewCard} ${styles[device]}`}>
          {post.image && <img src={post.image} alt={post.title || 'Preview'} className={styles.previewImage} />}
          <div className={styles.previewBody}>
            <span
              className={styles.badge}
              style={{ backgroundColor: getCategoryColor(post.category, post.categoryLabel) }}
            >
              {post.categoryLabel || 'TIN TỨC'}
            </span>
            <h1 className={styles.title}>{post.title || 'Chưa có tiêu đề bài viết'}</h1>
            <div className={styles.meta}>
              <span>Tác giả: {post.author || 'iCANCAM Editor'}</span>
              <span>•</span>
              <span>Thời gian đọc: {post.readingTime || '3 phút đọc'}</span>
              <span>•</span>
              <span>Trạng thái: {post.status || 'draft'}</span>
            </div>
            <p className={styles.excerpt}>{post.excerpt || 'Chưa có tóm tắt bài viết...'}</p>
            <div
              className={styles.content}
              dangerouslySetInnerHTML={{ __html: post.content || 'Chưa có nội dung chi tiết...' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
