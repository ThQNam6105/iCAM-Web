import React, { useState, useEffect } from 'react';
import {
  Eye,
  Save,
  RefreshCw,
  History,
  X,
  FolderTree,
} from 'lucide-react';
import {
  type DynamicNewsItem,
  type PostStatus,
  generateSlug,
  validatePostForm,
  type ValidationError,
  saveDraftAutosave,
  clearDraftAutosave
} from '../../services/newsService';
import { getCategories } from '../../services/categoryService';
import { PostPreviewModal } from './PostPreviewModal';
import { MediaSelectorModal } from './MediaSelectorModal';
import { useToast } from '../Toast/Toast';
import { Button, Select } from './UI';
import styles from './PostEditModal.module.css';

interface PostEditModalProps {
  isOpen: boolean;
  postToEdit?: DynamicNewsItem | null;
  onSave: (postData: Partial<DynamicNewsItem>) => void;
  onClose: () => void;
}

import { RichTextEditor } from './RichTextEditor';
import { SeoPanel } from './SeoPanel';
import { RevisionHistoryModal } from './RevisionHistoryModal';
import { ImageEditorCore } from './ImageEditorCore';
import { createPostRevision, getPostRevisions, type PostRevision } from '../../services/revisionService';

export const PostEditModal: React.FC<PostEditModalProps> = ({
  isOpen,
  postToEdit,
  onSave,
  onClose,
}) => {
  const { showToast } = useToast();

  const getInitialCategory = () => {
    const cats = getCategories();
    if (postToEdit?.category) {
      const found = cats.find(
        (c) =>
          c.id === postToEdit.category ||
          c.slug === postToEdit.category ||
          generateSlug(c.nameVi) === generateSlug(postToEdit.category)
      );
      if (found) return found;
      return {
        id: postToEdit.category,
        slug: generateSlug(postToEdit.category),
        nameVi: postToEdit.categoryLabel || postToEdit.category.toUpperCase(),
        nameEn: postToEdit.categoryLabelEn || postToEdit.categoryLabel || postToEdit.category.toUpperCase(),
      };
    }
    return cats[0] || { id: 'news', slug: 'news', nameVi: 'TIN TỨC', nameEn: 'NEWS' };
  };

  const initialCat = getInitialCategory();
  const [activeLangTab, setActiveLangTab] = useState<'vi' | 'en'>('vi');

  const [title, setTitle] = useState(postToEdit?.title || '');
  const [titleEn, setTitleEn] = useState(postToEdit?.titleEn || '');
  const [slug, setSlug] = useState(postToEdit?.slug || (postToEdit?.title ? generateSlug(postToEdit.title) : ''));
  const [status, setStatus] = useState<PostStatus>(postToEdit?.status || 'draft');
  const [category, setCategory] = useState<string>(initialCat.id || initialCat.slug);
  const [categoryLabel, setCategoryLabel] = useState<string>(initialCat.nameVi);
  const [categoryLabelEn, setCategoryLabelEn] = useState<string>(initialCat.nameEn);

  // Cover image VI & EN
  const [image, setImage] = useState(postToEdit?.image || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop');
  const [imageEn, setImageEn] = useState(postToEdit?.imageEn || postToEdit?.image || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop');

  const [imageZoom, setImageZoom] = useState<number>(postToEdit?.imageZoom ?? 100);
  const [panX, setPanX] = useState<number>(postToEdit?.panX ?? 50);
  const [panY, setPanY] = useState<number>(postToEdit?.panY ?? 50);

  const [excerpt, setExcerpt] = useState(postToEdit?.excerpt || '');
  const [excerptEn, setExcerptEn] = useState(postToEdit?.excerptEn || '');
  const [content, setContent] = useState(postToEdit?.content || '');
  const [contentEn, setContentEn] = useState(postToEdit?.contentEn || '');
  const [errors, setErrors] = useState<ValidationError>({});

  // Media selector target ('image' or 'imageEn')
  const [mediaTarget, setMediaTarget] = useState<'image' | 'imageEn'>('image');

  // SEO States
  const [metaTitle, setMetaTitle] = useState(postToEdit?.title || '');
  const [metaDescription, setMetaDescription] = useState(postToEdit?.excerpt || '');
  const [ogTitle, setOgTitle] = useState(postToEdit?.ogTitle || '');
  const [ogDescription, setOgDescription] = useState(postToEdit?.ogDescription || '');
  const [ogImage, setOgImage] = useState(postToEdit?.ogImage || '');
  const [canonicalUrl, setCanonicalUrl] = useState(postToEdit?.canonicalUrlOverride || '');
  const [noIndex, setNoIndex] = useState(postToEdit?.noIndex || false);
  const [noFollow, setNoFollow] = useState(postToEdit?.noFollow || false);

  // Revision History States
  const [isRevisionOpen, setIsRevisionOpen] = useState(false);
  const [revisions] = useState<PostRevision[]>(() =>
    postToEdit?.id ? getPostRevisions(postToEdit.id) : []
  );
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isMediaSelectorOpen, setIsMediaSelectorOpen] = useState(false);
  const [lastAutosave, setLastAutosave] = useState<string | null>(null);

  // Auto-generate slug when VI title changes
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

    const cats = getCategories();
    const matchedCat = cats.find((c) => c.id === category || c.slug === category);
    const finalLabelVi = matchedCat ? matchedCat.nameVi : categoryLabel;
    const finalLabelEn = matchedCat ? matchedCat.nameEn : (categoryLabelEn || finalLabelVi);

    const postData: Partial<DynamicNewsItem> = {
      title: title.trim(),
      titleEn: (titleEn || title).trim(),
      slug: generateSlug(title),
      status,
      category,
      categoryLabel: finalLabelVi,
      categoryLabelEn: finalLabelEn,
      image: image.trim() || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop',
      imageEn: (imageEn || image).trim(),
      imageZoom,
      panX,
      panY,
      excerpt: excerpt.trim(),
      excerptEn: (excerptEn || excerpt).trim(),
      content: content.trim(),
      contentEn: (contentEn || content).trim(),
      ogTitle,
      ogDescription,
      ogImage: ogImage || image,
      canonicalUrlOverride: canonicalUrl,
      noIndex,
      noFollow,
      url: '/news',
      author: 'iCANCAM Admin',
      tags: ['Anh ngữ', 'Giáo dục'],
    };

    const validation = validatePostForm(postData);
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      if (validation.title || validation.content || validation.excerpt || validation.image) {
        setActiveLangTab('vi');
      } else if (validation.titleEn) {
        setActiveLangTab('en');
      }
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
    image: activeLangTab === 'en' ? (imageEn || image) : image,
    excerpt: activeLangTab === 'en' ? (excerptEn || excerpt) : excerpt,
    content: activeLangTab === 'en' ? (contentEn || content) : content,
    status,
    author: 'iCANCAM Admin',
  };

  return (
    <>
      <div className={styles.overlay}>
        <div className={styles.modalContent}>
          <button
            type="button"
            onClick={onClose}
            className={styles.closeModalXBtn}
            title="Đóng cửa sổ soạn thảo (hủy bỏ)"
          >
            <X size={20} />
          </button>

          <div className={styles.modalHeader}>
            <h2 className={styles.modalTitle}>
              {postToEdit ? 'Chỉnh sửa bài viết' : 'Thêm bài viết mới'}
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
                <Eye size={16} /> Xem trước (Preview)
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate className={styles.formGrid}>
            {/* Top Common Fields: Status & Category */}
            <div className={styles.rowTwo}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  Trạng thái xuất bản (Status) <span className={styles.requiredStar}>*</span>
                </label>
                <Select
                  options={[
                    { value: 'draft', label: 'Bản nháp (Draft - ẩn trên web)' },
                    { value: 'published', label: 'Đã xuất bản (Published - hiện trên web)' },
                    { value: 'archived', label: 'Lưu trữ (Archived)' },
                  ]}
                  value={status}
                  onChange={(val) => setStatus(val as PostStatus)}
                  fullWidth
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  Danh mục bài viết <span className={styles.requiredStar}>*</span>
                </label>
                <Select
                  options={getCategories().map((cat) => ({
                    value: cat.id || cat.slug,
                    label: cat.nameVi,
                  }))}
                  value={category}
                  onChange={(val) => {
                    setCategory(val);
                    const found = getCategories().find((c) => c.id === val || c.slug === val);
                    if (found) {
                      setCategoryLabel(found.nameVi);
                      setCategoryLabelEn(found.nameEn);
                    }
                  }}
                  fullWidth
                />
              </div>
            </div>

            {/* Language Tabs */}
            <div className={styles.langTabGroup}>
              <button
                type="button"
                className={`${styles.langTab} ${activeLangTab === 'vi' ? styles.langTabActive : ''}`}
                onClick={() => setActiveLangTab('vi')}
              >
                Nội dung Tiếng Việt
              </button>
              <button
                type="button"
                className={`${styles.langTab} ${activeLangTab === 'en' ? styles.langTabActive : ''}`}
                onClick={() => setActiveLangTab('en')}
              >
                Nội dung Tiếng Anh
              </button>
            </div>

            {/* Tab 1: Nội dung Tiếng Việt */}
            {activeLangTab === 'vi' && (
              <>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>
                    Tiêu đề bài viết (Tiếng Việt) <span className={styles.requiredStar}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Nhập tiêu đề tiếng Việt..."
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className={styles.input}
                  />
                  {errors.title && <span className={styles.errorText}>{errors.title}</span>}
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>
                    Ảnh bìa bài viết (Tiếng Việt) <span className={styles.requiredStar}>*</span>
                  </label>
                  <div className={styles.imageInputGroup}>
                    <input
                      type="text"
                      placeholder="Dán URL ảnh hoặc chọn từ Thư viện hệ thống..."
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      className={styles.input}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setMediaTarget('image');
                        setIsMediaSelectorOpen(true);
                      }}
                      className={styles.uploadPlaceholderBtn}
                      style={{ background: '#F58220', color: '#ffffff' }}
                      title="Chọn ảnh từ Thư viện hệ thống"
                    >
                      <FolderTree size={16} /> Thư viện hệ thống
                    </button>
                  </div>
                  {errors.image && <span className={styles.errorText}>{errors.image}</span>}

                  {image && (
                    <div style={{ marginTop: '0.75rem', background: '#0f172a', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <ImageEditorCore
                        mode="quick"
                        imageSrc={image}
                        initialPanX={panX}
                        initialPanY={panY}
                        initialZoom={imageZoom}
                        filename="cover_vi.jpg"
                        onQuickChange={(s) => {
                          setPanX(s.panX);
                          setPanY(s.panY);
                          setImageZoom(s.zoom);
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>
                    Tóm tắt bài viết (Tiếng Việt) <span className={styles.requiredStar}>*</span>
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Tóm tắt nội dung bài viết tiếng Việt..."
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    className={styles.textarea}
                  />
                  {errors.excerpt && <span className={styles.errorText}>{errors.excerpt}</span>}
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>
                    Nội dung chi tiết bài viết (Tiếng Việt) <span className={styles.requiredStar}>*</span>
                  </label>
                  <RichTextEditor
                    value={content}
                    onChange={setContent}
                    placeholder="Soạn thảo nội dung bài viết tiếng Việt như trên Word..."
                  />
                  {errors.content && <span className={styles.errorText}>{errors.content}</span>}
                </div>
              </>
            )}

            {/* Tab 2: Nội dung Tiếng Anh */}
            {activeLangTab === 'en' && (
              <>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>
                    Tiêu đề bài viết (Tiếng Anh) <span className={styles.requiredStar}>*</span>
                  </label>
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
                  <label className={styles.label}>
                    Ảnh bìa bài viết (Tiếng Anh) <span className={styles.requiredStar}>*</span>
                  </label>
                  <div className={styles.imageInputGroup}>
                    <input
                      type="text"
                      placeholder="Dán URL ảnh bìa tiếng Anh hoặc chọn từ Thư viện..."
                      value={imageEn}
                      onChange={(e) => setImageEn(e.target.value)}
                      className={styles.input}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setMediaTarget('imageEn');
                        setIsMediaSelectorOpen(true);
                      }}
                      className={styles.uploadPlaceholderBtn}
                      style={{ background: '#F58220', color: '#ffffff' }}
                      title="Chọn ảnh từ Thư viện hệ thống"
                    >
                      <FolderTree size={16} /> Thư viện hệ thống
                    </button>
                  </div>

                  {imageEn && (
                    <div style={{ marginTop: '0.75rem', background: '#0f172a', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <ImageEditorCore
                        mode="quick"
                        imageSrc={imageEn}
                        initialPanX={panX}
                        initialPanY={panY}
                        initialZoom={imageZoom}
                        filename="cover_en.jpg"
                        onQuickChange={(s) => {
                          setPanX(s.panX);
                          setPanY(s.panY);
                          setImageZoom(s.zoom);
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>
                    Tóm tắt bài viết (Tiếng Anh) <span className={styles.requiredStar}>*</span>
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Short excerpt in English..."
                    value={excerptEn}
                    onChange={(e) => setExcerptEn(e.target.value)}
                    className={styles.textarea}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>
                    Nội dung chi tiết bài viết (Tiếng Anh) <span className={styles.requiredStar}>*</span>
                  </label>
                  <RichTextEditor
                    value={contentEn}
                    onChange={setContentEn}
                    placeholder="Full article content in English..."
                  />
                </div>
              </>
            )}

            {/* SEO Panel */}
            <SeoPanel
              articleTitle={title}
              articleExcerpt={excerpt}
              articleContent={content}
              coverImage={image}
              slug={slug}
              metaTitle={metaTitle}
              metaDescription={metaDescription}
              ogTitle={ogTitle}
              ogDescription={ogDescription}
              ogImage={ogImage}
              canonicalUrlOverride={canonicalUrl}
              noIndex={noIndex}
              noFollow={noFollow}
              onChangeSlug={setSlug}
              onChangeMetaTitle={setMetaTitle}
              onChangeMetaDescription={setMetaDescription}
              onChangeOgTitle={setOgTitle}
              onChangeOgDescription={setOgDescription}
              onChangeOgImage={setOgImage}
              onChangeCanonicalUrlOverride={setCanonicalUrl}
              onChangeNoIndex={setNoIndex}
              onChangeNoFollow={setNoFollow}
            />

            <div className={styles.modalActions}>
              <Button type="submit" variant="primary" size="md" icon={<Save size={16} />}>
                {postToEdit ? 'Lưu thay đổi' : 'Lưu & đăng bài'}
              </Button>
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

      <MediaSelectorModal
        isOpen={isMediaSelectorOpen}
        onClose={() => setIsMediaSelectorOpen(false)}
        filterType="image"
        onSelect={(assets) => {
          if (assets.length > 0) {
            const chosen = assets[0];
            if (mediaTarget === 'imageEn') {
              setImageEn(chosen.public_url);
            } else {
              setImage(chosen.public_url);
            }
            if (chosen.focal_x !== undefined) setPanX(Math.round(chosen.focal_x * 100));
            if (chosen.focal_y !== undefined) setPanY(Math.round(chosen.focal_y * 100));
            showToast('Đã chọn ảnh bìa từ Thư viện Media! ✓', 'success');
          }
        }}
      />
    </>
  );
};
