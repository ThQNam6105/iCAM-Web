import React, { useState, useEffect } from 'react';
import {
  FolderTree,
  Plus,
  Edit2,
  Trash2,
  X,
  Check,
  Tag,
  FileText,
} from 'lucide-react';
import {
  saveCategory,
  deleteCategory,
  fetchCategoriesFromSupabase,
  type CategoryItem,
} from '../../services/categoryService';
import { getAllNewsPosts, generateSlug } from '../../services/newsService';
import { useToast } from '../Toast/Toast';
import styles from './CategoryManagerModal.module.css';

interface CategoryManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCategoriesUpdated?: () => void;
}

const PRESET_COLORS = [
  '#F58220', // Orange iCANCAM
  '#0d255f', // Navy iCANCAM
  '#10b981', // Emerald Green
  '#8b5cf6', // Purple
  '#ef4444', // Red
  '#3b82f6', // Blue
  '#ec4899', // Pink
  '#f59e0b', // Amber
];

export const CategoryManagerModal: React.FC<CategoryManagerModalProps> = ({
  isOpen,
  onClose,
  onCategoriesUpdated,
}) => {
  const { showToast } = useToast();
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);

  // Form states
  const [nameVi, setNameVi] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [slug, setSlug] = useState('');
  const [color, setColor] = useState('#F58220');
  const [description, setDescription] = useState('');

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const resetForm = () => {
    setEditingCategory(null);
    setNameVi('');
    setNameEn('');
    setSlug('');
    setColor('#F58220');
    setDescription('');
  };

  useEffect(() => {
    if (isOpen) {
      fetchCategoriesFromSupabase().then((data) => {
        setCategories(data);
      });
    }
  }, [isOpen]);

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleNameViChange = (val: string) => {
    setNameVi(val);
    if (!editingCategory) {
      setSlug(generateSlug(val));
    }
  };

  const handleStartEdit = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setNameVi(cat.nameVi);
    setNameEn(cat.nameEn);
    setSlug(cat.slug);
    setColor(cat.color || '#F58220');
    setDescription(cat.description || '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameVi.trim()) {
      showToast('Vui lòng nhập Tên Tiếng Việt cho danh mục!', 'error');
      return;
    }

    const payload: Partial<CategoryItem> = {
      id: editingCategory ? editingCategory.id : slug || generateSlug(nameVi),
      slug: slug || generateSlug(nameVi),
      nameVi: nameVi.trim().toUpperCase(),
      nameEn: (nameEn.trim() || nameVi.trim()).toUpperCase(),
      color,
      description: description.trim(),
    };

    const updated = await saveCategory(payload);
    setCategories(updated);
    showToast(
      editingCategory ? 'Đã cập nhật danh mục thành công! ✓' : 'Đã thêm danh mục mới thành công! ✓',
      'success'
    );
    resetForm();
    if (onCategoriesUpdated) onCategoriesUpdated();
  };

  const handleDelete = async (id: string) => {
    // Check if posts are assigned to this category
    const posts = getAllNewsPosts();
    const assignedCount = posts.filter((p) => p.category === id).length;
    if (assignedCount > 0) {
      showToast(`Không thể xóa! Đang có ${assignedCount} bài viết thuộc danh mục này.`, 'error');
      setDeleteConfirmId(null);
      return;
    }

    const updated = await deleteCategory(id);
    setCategories(updated);
    showToast('Đã xóa danh mục bài viết!', 'info');
    setDeleteConfirmId(null);
    if (onCategoriesUpdated) onCategoriesUpdated();
  };

  if (!isOpen) return null;

  const posts = getAllNewsPosts();

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.headerTitle}>
            <FolderTree className={styles.headerIcon} size={22} />
            <div>
              <h3>QUẢN LÝ DANH MỤC BÀI VIẾT (CMS CATEGORIES)</h3>
              <p className={styles.headerSubText}>Tạo, chỉnh sửa tên song ngữ VI/EN và màu sắc hiển thị danh mục</p>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={handleClose} aria-label="Đóng">
            <X size={20} />
          </button>
        </div>

        {/* Body Container */}
        <div className={styles.modalBody}>
          {/* Left: Category Form */}
          <div className={styles.formCard}>
            <h4 className={styles.formCardTitle}>
              {editingCategory ? <Edit2 size={16} /> : <Plus size={16} />}
              {editingCategory ? 'Chỉnh sửa Danh mục' : 'Thêm Danh mục Mới'}
            </h4>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Tên Tiếng Việt *</label>
                <input
                  type="text"
                  placeholder="Ví dụ: SỰ KIỆN NỔI BẬT"
                  value={nameVi}
                  onChange={(e) => handleNameViChange(e.target.value)}
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Tên Tiếng Anh (English Name)</label>
                <input
                  type="text"
                  placeholder="Ví dụ: FEATURED EVENTS"
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>SEO Slug (Mã đường dẫn)</label>
                <input
                  type="text"
                  placeholder="su-kien-noi-bat"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className={styles.input}
                />
              </div>

              {/* Preset Palette */}
              <div className={styles.inputGroup}>
                <label className={styles.label}>Màu sắc nhận diện Badge</label>
                <div className={styles.colorPalette}>
                  {PRESET_COLORS.map((c) => (
                    <button
                      type="button"
                      key={c}
                      className={`${styles.colorDot} ${color === c ? styles.selectedColorDot : ''}`}
                      style={{ backgroundColor: c }}
                      onClick={() => setColor(c)}
                    >
                      {color === c && <Check size={14} color="#ffffff" />}
                    </button>
                  ))}
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className={styles.customColorPicker}
                    title="Chọn màu tùy chỉnh"
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Mô tả danh mục</label>
                <textarea
                  rows={2}
                  placeholder="Ghi chú mô tả ngắn về danh mục này..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={styles.textarea}
                />
              </div>

              <div className={styles.formActions}>
                <button type="submit" className={styles.submitBtn}>
                  {editingCategory ? 'Lưu thay đổi' : 'Tạo danh mục'}
                </button>
                {editingCategory && (
                  <button type="button" onClick={resetForm} className={styles.cancelBtn}>
                    Hủy bỏ
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Right: Existing Categories List */}
          <div className={styles.listCard}>
            <h4 className={styles.listCardTitle}>
              <Tag size={16} /> Danh sách Danh mục ({categories.length})
            </h4>

            <div className={styles.categoryGrid}>
              {categories.map((cat) => {
                const count = posts.filter((p) => p.category === cat.id || p.category === cat.slug).length;

                return (
                  <div key={cat.id} className={styles.categoryItemCard}>
                    <div className={styles.catColorBar} style={{ backgroundColor: cat.color || '#F58220' }} />
                    <div className={styles.catInfo}>
                      <div className={styles.catHeader}>
                        <h5 className={styles.catNameVi}>{cat.nameVi}</h5>
                        <span className={styles.postCountBadge}>
                          <FileText size={12} /> {count} bài
                        </span>
                      </div>
                      <p className={styles.catNameEn}>EN: {cat.nameEn}</p>
                      <span className={styles.catSlug}>slug: /{cat.slug}</span>
                    </div>

                    <div className={styles.catItemActions}>
                      <button
                        type="button"
                        onClick={() => handleStartEdit(cat)}
                        className={styles.actionIconBtn}
                        title="Chỉnh sửa danh mục"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(cat.id)}
                        className={`${styles.actionIconBtn} ${styles.deleteIconBtn}`}
                        title="Xóa danh mục"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    {/* Inline Delete Confirmation */}
                    {deleteConfirmId === cat.id && (
                      <div className={styles.deleteConfirmOverlay}>
                        <p>Xác nhận xóa danh mục này?</p>
                        <div className={styles.deleteConfirmBtns}>
                          <button
                            type="button"
                            onClick={() => handleDelete(cat.id)}
                            className={styles.confirmDeleteBtn}
                          >
                            Xóa ngay
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(null)}
                            className={styles.cancelDeleteBtn}
                          >
                            Hủy
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
