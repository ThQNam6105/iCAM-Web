import React, { useState, useEffect, useRef } from 'react';
import { Eye, Upload, Save, RefreshCw, History } from 'lucide-react';
import {
  type DynamicNewsItem,
  type PostStatus,
  generateSlug,
  validatePostForm,
  type ValidationError,
  saveDraftAutosave,
  clearDraftAutosave
} from '../../services/newsService';
import { PostPreviewModal } from './PostPreviewModal';
import { useToast } from '../Toast/Toast';
import styles from './PostEditModal.module.css';

interface PostEditModalProps {
  isOpen: boolean;
  postToEdit?: DynamicNewsItem | null;
  onSave: (postData: Partial<DynamicNewsItem>) => void;
  onClose: () => void;
}

import { RichTextEditor } from './RichTextEditor';
import { SeoPanel } from './SeoPanel';
import { QualityChecker } from './QualityChecker';
import { RevisionHistoryModal } from './RevisionHistoryModal';
import { createPostRevision, getPostRevisions, type PostRevision } from '../../services/revisionService';

export const PostEditModal: React.FC<PostEditModalProps> = ({
  isOpen,
  postToEdit,
  onSave,
  onClose,
}) => {
  const { showToast } = useToast();
  const coverImageInputRef = useRef<HTMLInputElement>(null);

  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Vui lòng chọn file định dạng hình ảnh (PNG, JPG, WEBP...)', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      const base64Data = evt.target?.result as string;
      setImage(base64Data);
      showToast('Đã tải ảnh từ máy tính lên thành công! ✓', 'success');
    };
    reader.readAsDataURL(file);
  };

  const [title, setTitle] = useState(postToEdit?.title || '');
  const [titleEn, setTitleEn] = useState(postToEdit?.titleEn || '');
  const [slug, setSlug] = useState(postToEdit?.slug || (postToEdit?.title ? generateSlug(postToEdit.title) : ''));
  const [status, setStatus] = useState<PostStatus>(postToEdit?.status || 'draft');
  const [category, setCategory] = useState<'events' | 'scholarship' | 'tips'>(postToEdit?.category || 'events');
  const [categoryLabel, setCategoryLabel] = useState(postToEdit?.categoryLabel || 'SỰ KIỆN NỔI BẬT');
  const [categoryLabelEn, setCategoryLabelEn] = useState(postToEdit?.categoryLabelEn || 'FEATURED EVENT');
  const [image, setImage] = useState(postToEdit?.image || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop');
  const [excerpt, setExcerpt] = useState(postToEdit?.excerpt || '');
  const [excerptEn, setExcerptEn] = useState(postToEdit?.excerptEn || '');
  const [content, setContent] = useState(postToEdit?.content || '');
  const [contentEn, setContentEn] = useState(postToEdit?.contentEn || '');
  const [errors, setErrors] = useState<ValidationError>({});

  // SEO States
  const [metaTitle, setMetaTitle] = useState(postToEdit?.title || '');
  const [metaDescription, setMetaDescription] = useState(postToEdit?.excerpt || '');
  const [ogImage, setOgImage] = useState(postToEdit?.image || '');
  const [canonicalUrl, setCanonicalUrl] = useState('');

  // Revision History States
  const [isRevisionOpen, setIsRevisionOpen] = useState(false);
  const [revisions] = useState<PostRevision[]>(() =>
    postToEdit?.id ? getPostRevisions(postToEdit.id) : []
  );

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [lastAutosave, setLastAutosave] = useState<string | null>(null);
  const [blockersCount, setBlockersCount] = useState(0);

  // Auto-generate slug when VI title changes (if user hasn't custom edited it)
  const handleTitleChange = (val: string) => {
    setTitle(val);
    setSlug(generateSlug(val));
  };

  // Autosave interval every 30s for draft posts
  useEffect(() => {
    if (!isOpen || status !== 'draft') return;

    const interval = setInterval(() => {
      if (title.trim()) {
        saveDraftAutosave({ title, titleEn, slug, category, excerpt, content, image });
        const timeStr = new Date().toLocaleTimeString('vi-VN');
        setLastAutosave(timeStr);
        showToast(`Tự động lưu nháp lúc ${timeStr}`, 'info');
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isOpen, status, title, titleEn, slug, category, excerpt, content, image, showToast]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const postData: Partial<DynamicNewsItem> = {
      title,
      titleEn: titleEn || title,
      slug: slug || generateSlug(title),
      status,
      category,
      categoryLabel,
      categoryLabelEn: categoryLabelEn || categoryLabel,
      image: image || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop',
      excerpt,
      excerptEn: excerptEn || excerpt,
      content,
      contentEn: contentEn || content,
      url: '/news',
      author: 'iCANCAM Admin',
      tags: ['Anh ngữ', 'Giáo dục'],
    };

    const validation = validatePostForm(postData);
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      showToast('Vui lòng kiểm tra lại thông tin còn thiếu!', 'error');
      return;
    }

    onSave(postData);
    if (postToEdit?.id) {
      createPostRevision({ ...postData, id: postToEdit.id });
    }
    clearDraftAutosave();
    onClose();
  };

  if (!isOpen) return null;

  const currentPreviewData: Partial<DynamicNewsItem> = {
    title,
    titleEn,
    categoryLabel,
    image,
    excerpt,
    content,
    status,
    author: 'iCANCAM Admin',
  };

  return (
    <>
      <div className={styles.overlay}>
        <div className={styles.modalContent}>
          <div className={styles.modalHeader}>
            <h2 className={styles.modalTitle}>
              {postToEdit ? 'Chỉnh Sửa Bài Viết' : 'Thêm Bài Viết Mới'}
            </h2>

            <div className={styles.headerActions}>
              {revisions.length > 0 && (
                <button
                  type="button"
                  onClick={() => setIsRevisionOpen(true)}
                  className={styles.previewBtn}
                  title="Xem lịch sử phiên bản"
                >
                  <History size={16} /> Phiên bản ({revisions.length})
                </button>
              )}
              {lastAutosave && (
                <span className={styles.autosaveBadge}>
                  <RefreshCw size={12} /> Đã lưu nháp {lastAutosave}
                </span>
              )}
              <button
                type="button"
                onClick={() => setIsPreviewOpen(true)}
                className={styles.previewBtn}
              >
                <Eye size={16} /> Xem Trước (Preview)
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className={styles.formGrid}>
            <div className={styles.rowTwo}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Trạng thái xuất bản (Status)</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as PostStatus)}
                  className={styles.select}
                >
                  <option value="draft">Bản nháp (Draft - Ẩn trên web)</option>
                  <option value="published">Đã xuất bản (Published - Hiện trên web)</option>
                  <option value="archived">Lưu trữ (Archived)</option>
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Danh mục bài viết</label>
                <select
                  value={category}
                  onChange={(e) => {
                    const val = e.target.value as 'events' | 'scholarship' | 'tips';
                    setCategory(val);
                    if (val === 'events') {
                      setCategoryLabel('SỰ KIỆN NỔI BẬT');
                      setCategoryLabelEn('FEATURED EVENT');
                    } else if (val === 'scholarship') {
                      setCategoryLabel('HỌC BỔNG & THÀNH TÍCH');
                      setCategoryLabelEn('SCHOLARSHIP & ACHIEVEMENTS');
                    } else {
                      setCategoryLabel('BÍ QUYẾT TIẾNG ANH');
                      setCategoryLabelEn('ENGLISH TIPS');
                    }
                  }}
                  className={styles.select}
                >
                  <option value="events">SỰ KIỆN NỔI BẬT</option>
                  <option value="scholarship">HỌC BỔNG & THÀNH TÍCH</option>
                  <option value="tips">BÍ QUYẾT TIẾNG ANH</option>
                </select>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Tiêu đề bài viết (Tiếng Việt) *</label>
              <input
                type="text"
                placeholder="Nhập tiêu đề Tiếng Việt..."
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className={styles.input}
              />
              {errors.title && <span className={styles.errorText}>{errors.title}</span>}
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Tiêu đề bài viết (Tiếng Anh) *</label>
              <input
                type="text"
                placeholder="English title..."
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                className={styles.input}
              />
              {errors.titleEn && <span className={styles.errorText}>{errors.titleEn}</span>}
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>SEO Slug (Đường dẫn thân thiện)</label>
              <input
                type="text"
                placeholder="chua-co-slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Hình ảnh bìa bài viết (URL hoặc Tải từ máy tính) *</label>
              <input
                type="file"
                ref={coverImageInputRef}
                accept="image/*"
                onChange={handleCoverImageUpload}
                style={{ display: 'none' }}
              />
              <div className={styles.imageInputGroup}>
                <input
                  type="text"
                  placeholder="Dán URL ảnh hoặc bấm Tải ảnh từ máy..."
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className={styles.input}
                />
                <button
                  type="button"
                  onClick={() => coverImageInputRef.current?.click()}
                  className={styles.uploadPlaceholderBtn}
                  title="Chọn ảnh từ máy tính / điện thoại"
                >
                  <Upload size={16} /> Tải ảnh từ máy
                </button>
              </div>
              {errors.image && <span className={styles.errorText}>{errors.image}</span>}
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Tóm tắt bài viết (Tiếng Việt) *</label>
              <textarea
                rows={2}
                placeholder="Tóm tắt nội dung bài viết..."
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className={styles.textarea}
              />
              {errors.excerpt && <span className={styles.errorText}>{errors.excerpt}</span>}
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Tóm tắt bài viết (Tiếng Anh)</label>
              <textarea
                rows={2}
                placeholder="Short excerpt in English..."
                value={excerptEn}
                onChange={(e) => setExcerptEn(e.target.value)}
                className={styles.textarea}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Nội dung chi tiết bài viết (Tiếng Việt) *</label>
              <RichTextEditor
                value={content}
                onChange={setContent}
                placeholder="Soạn thảo nội dung bài viết Tiếng Việt như trên Word..."
              />
              {errors.content && <span className={styles.errorText}>{errors.content}</span>}
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Nội dung chi tiết bài viết (Tiếng Anh)</label>
              <RichTextEditor
                value={contentEn}
                onChange={setContentEn}
                placeholder="Full article content in English..."
              />
            </div>

            <SeoPanel
              articleTitle={title}
              articleExcerpt={excerpt}
              coverImage={image}
              slug={slug}
              metaTitle={metaTitle}
              metaDescription={metaDescription}
              ogImage={ogImage}
              canonicalUrlOverride={canonicalUrl}
              onChangeSlug={setSlug}
              onChangeMetaTitle={setMetaTitle}
              onChangeMetaDescription={setMetaDescription}
              onChangeOgImage={setOgImage}
              onChangeCanonicalUrlOverride={setCanonicalUrl}
            />

            <QualityChecker
              title={title}
              titleEn={titleEn}
              excerpt={excerpt}
              content={content}
              image={image}
              slug={slug}
              metaTitle={metaTitle}
              metaDescription={metaDescription}
              onFixMetaDescription={setMetaDescription}
              onFixSlug={setSlug}
              onFixContent={setContent}
              onBlockersChange={setBlockersCount}
            />

            <div className={styles.modalActions}>
              <button type="button" onClick={onClose} className={styles.cancelBtn}>
                Hủy Bỏ
              </button>

              <button
                type="submit"
                className={styles.saveBtn}
                disabled={blockersCount > 0 && status === 'published'}
                title={blockersCount > 0 ? `Vui lòng xử lý ${blockersCount} Rào Cản Xuất Bản trước khi Đăng bài` : undefined}
              >
                <Save size={16} /> {postToEdit ? 'Lưu Thay Đổi' : 'Lưu & Đăng Bài'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <PostPreviewModal
        isOpen={isPreviewOpen}
        post={currentPreviewData}
        onClose={() => setIsPreviewOpen(false)}
      />

      <RevisionHistoryModal
        isOpen={isRevisionOpen}
        revisions={revisions}
        onRestore={(rev) => {
          setTitle(rev.title);
          setContent(rev.content);
          setExcerpt(rev.excerpt);
          setStatus(rev.status as PostStatus);
          setIsRevisionOpen(false);
          showToast(`Đã khôi phục phiên bản v${rev.versionNumber}!`, 'success');
        }}
        onClose={() => setIsRevisionOpen(false)}
      />
    </>
  );
};
