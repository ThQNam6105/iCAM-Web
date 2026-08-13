import React, { useState, useEffect, useMemo } from 'react';
import {
  FolderTree,
  Plus,
  Edit2,
  Trash2,
  Check,
  Tag,
  FileText,
  Layers,
} from 'lucide-react';
import {
  saveCategory,
  deleteCategory,
  fetchCategoriesFromSupabase,
  type CategoryItem,
} from '../../services/categoryService';
import { getAllNewsPosts, fetchPostsFromSupabase, generateSlug } from '../../services/newsService';
import { ConfirmModal } from '../../components/ConfirmModal/ConfirmModal';
import { useToast } from '../../components/Toast/Toast';
import { Button } from '../../components/Admin/UI';
import styles from './AdminCategories.module.css';

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

export const AdminCategories: React.FC = () => {
  const { showToast } = useToast();
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);

  // Form states
  const [nameVi, setNameVi] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [slug, setSlug] = useState('');
  const [color, setColor] = useState('#F58220');
  const [description, setDescription] = useState('');

  const [deleteCandidateId, setDeleteCandidateId] = useState<string | null>(null);

  const resetForm = () => {
    setEditingCategory(null);
    setNameVi('');
    setNameEn('');
    setSlug('');
    setColor('#F58220');
    setDescription('');
  };

  const loadCategoryData = () => {
    fetchCategoriesFromSupabase().then((data) => {
      setCategories(data);
    });
    fetchPostsFromSupabase();
  };

  useEffect(() => {
    loadCategoryData();
  }, []);

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      editingCategory ? 'Đã cập nhật danh mục thành công! ✓' : 'Đã tạo danh mục mới thành công! ✓',
      'success'
    );
    resetForm();
  };

  const handleConfirmDelete = async () => {
    if (!deleteCandidateId) return;

    const posts = getAllNewsPosts();
    const assignedCount = posts.filter(
      (p) => p.category === deleteCandidateId || p.category === generateSlug(deleteCandidateId)
    ).length;

    if (assignedCount > 0) {
      showToast(`Không thể xóa! Đang có ${assignedCount} bài viết thuộc danh mục này.`, 'error');
      setDeleteCandidateId(null);
      return;
    }

    const updated = await deleteCategory(deleteCandidateId);
    setCategories(updated);
    showToast('Đã xóa danh mục bài viết khỏi hệ thống!', 'info');
    setDeleteCandidateId(null);
  };

  const allPosts = useMemo(() => getAllNewsPosts(), [categories]);

  const stats = useMemo(() => {
    const totalCategories = categories.length;
    const customCategories = categories.filter((c) => !['events', 'scholarship', 'tips'].includes(c.id)).length;
    const totalPostsAssigned = allPosts.length;
    return { totalCategories, customCategories, totalPostsAssigned };
  }, [categories, allPosts]);

  return (
    <div className={styles.container}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>
            <FolderTree className={styles.titleIcon} size={28} /> Quản lý danh mục bài viết
          </h1>
          <p className={styles.pageSubtitle}>
            Tạo mới, chỉnh sửa tên song ngữ (VI/EN) và thiết lập màu sắc hiển thị danh mục bài viết CMS
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div>
            <div className={styles.statValue}>{stats.totalCategories}</div>
            <div className={styles.statLabel}>Tổng danh mục</div>
          </div>
          <div className={styles.statIcon}>
            <FolderTree size={24} />
          </div>
        </div>

        <div className={styles.statCard}>
          <div>
            <div className={styles.statValue}>{stats.customCategories}</div>
            <div className={styles.statLabel}>Danh mục tùy chỉnh</div>
          </div>
          <div className={styles.statIcon} style={{ color: '#8b5cf6' }}>
            <Layers size={24} />
          </div>
        </div>

        <div className={styles.statCard}>
          <div>
            <div className={styles.statValue}>{stats.totalPostsAssigned}</div>
            <div className={styles.statLabel}>Tổng bài viết đang phân loại</div>
          </div>
          <div className={styles.statIcon} style={{ color: '#10b981' }}>
            <FileText size={24} />
          </div>
        </div>
      </div>

      {/* Main Split Grid Layout */}
      <div className={styles.mainGrid}>
        {/* Left Column: Form Card */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>
            {editingCategory ? <Edit2 size={18} /> : <Plus size={18} />}
            {editingCategory ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
          </h3>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>
                Tên tiếng Việt <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                placeholder="Ví dụ: SỰ KIỆN NỔI BẬT"
                value={nameVi}
                onChange={(e) => handleNameViChange(e.target.value)}
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Tên tiếng Anh (English name)</label>
              <input
                type="text"
                placeholder="Ví dụ: FEATURED EVENTS"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                className={styles.input}
              />
            </div>

            {/* Color Palette */}
            <div className={styles.inputGroup}>
              <label className={styles.label}>Màu sắc nhận diện badge</label>
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
                rows={3}
                placeholder="Mô tả ngắn gọn về nhóm bài viết này..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={styles.textarea}
              />
            </div>

            <div className={styles.formActions}>
              <Button type="submit" variant="primary" size="md" fullWidth>
                {editingCategory ? 'Lưu thay đổi' : 'Thêm danh mục'}
              </Button>
              {editingCategory && (
                <Button type="button" variant="secondary" size="md" onClick={resetForm}>
                  Hủy bỏ
                </Button>
              )}
            </div>
          </form>
        </div>

        {/* Right Column: Category List Grid */}
        <div className={`${styles.card} ${styles.listCard}`}>
          <h3 className={styles.cardTitle}>
            <Tag size={18} /> Danh sách danh mục hiện có ({categories.length})
          </h3>

          <div className={styles.categoryScrollArea}>
            <div className={styles.categoryListGrid}>
              {categories.map((cat) => {
                const assignedPostCount = allPosts.filter(
                  (p) => p.category === cat.id || p.category === cat.slug
                ).length;

                return (
                  <div key={cat.id} className={styles.categoryItemCard}>
                    <div className={styles.catColorBar} style={{ backgroundColor: cat.color || '#F58220' }} />
                    <div>
                      <div className={styles.catHeader}>
                        <h4 className={styles.catNameVi}>{cat.nameVi}</h4>
                        <span className={styles.postCountBadge}>
                          <FileText size={12} /> {assignedPostCount} bài
                        </span>
                      </div>
                      <p className={styles.catNameEn}>EN: {cat.nameEn}</p>
                      <span className={styles.catSlug}>slug: /{cat.slug}</span>
                    </div>

                    <div className={styles.catFooter}>
                      <div className={styles.catItemActions}>
                        <button
                          type="button"
                          onClick={() => handleStartEdit(cat)}
                          className={styles.actionIconBtn}
                          title="Chỉnh sửa thông tin danh mục"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteCandidateId(cat.id)}
                          className={`${styles.actionIconBtn} ${styles.deleteIconBtn}`}
                          title="Xóa danh mục này"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteCandidateId !== null}
        title="Xác nhận xóa danh mục"
        message="Hành động này sẽ xóa vĩnh viễn danh mục khỏi hệ thống. Bạn có chắc chắn muốn xóa?"
        confirmLabel="Xóa vĩnh viễn"
        cancelLabel="Hủy bỏ"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteCandidateId(null)}
      />
    </div>
  );
};
