import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, FolderTree } from 'lucide-react';
import {
  type FaqCategoryItem,
  getAllFaqCategories,
  createFaqCategory,
  deleteFaqCategory,
} from '../../services/faqService';
import { useToast } from '../Toast/Toast';
import { Button } from './UI';
import styles from './FaqCategoryManagerModal.module.css';

interface FaqCategoryManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCategoriesUpdated: () => void;
}

export const FaqCategoryManagerModal: React.FC<FaqCategoryManagerModalProps> = ({
  isOpen,
  onClose,
  onCategoriesUpdated,
}) => {
  const { showToast } = useToast();
  const [categories, setCategories] = useState<FaqCategoryItem[]>([]);
  const [nameVi, setNameVi] = useState('');
  const [nameEn, setNameEn] = useState('');

  const loadData = () => {
    setCategories(getAllFaqCategories());
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameVi.trim()) return;

    createFaqCategory({
      nameVi: nameVi.trim(),
      nameEn: nameEn.trim() || nameVi.trim(),
      displayOrder: categories.length + 1,
      status: 'active',
    });

    setNameVi('');
    setNameEn('');
    showToast('Tạo danh mục câu hỏi mới thành công! ✓', 'success');
    loadData();
    onCategoriesUpdated();
  };

  const handleDelete = (id: string, name: string) => {
    const res = deleteFaqCategory(id);
    if (!res.success) {
      showToast(res.message || 'Không thể xóa danh mục này!', 'error');
      return;
    }
    showToast(`Đã xóa danh mục "${name}"!`, 'info');
    loadData();
    onCategoriesUpdated();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.header}>
          <h3 className={styles.title} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FolderTree size={18} color="#F58220" /> Quản lý danh mục FAQ
          </h3>
          <button type="button" onClick={onClose} className={styles.closeBtn}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.body}>
          <form onSubmit={handleAddCategory} className={styles.addForm}>
            <strong style={{ color: '#f8fafc', fontSize: '0.9rem' }}>+ Thêm danh mục mới:</strong>
            <div className={styles.formRow}>
              <input
                type="text"
                required
                placeholder="Tên danh mục (Tiếng Việt)..."
                value={nameVi}
                onChange={(e) => setNameVi(e.target.value)}
                className={styles.input}
              />
              <input
                type="text"
                placeholder="Tên danh mục (Tiếng Anh)..."
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                className={styles.input}
              />
            </div>
            <Button type="submit" variant="primary" size="sm" icon={<Plus size={14} />}>
              Thêm danh mục
            </Button>
          </form>

          <strong style={{ color: '#cbd5e1', fontSize: '0.85rem', marginTop: '0.5rem' }}>
            Danh sách danh mục hiện có ({categories.length}):
          </strong>

          <div className={styles.catList}>
            {categories.map((cat) => (
              <div key={cat.id} className={styles.catItem}>
                <div className={styles.catNames}>
                  <span className={styles.nameVi}>{cat.nameVi}</span>
                  <span className={styles.nameEn}>{cat.nameEn}</span>
                </div>
                <div className={styles.actions}>
                  <button
                    type="button"
                    onClick={() => handleDelete(cat.id, cat.nameVi)}
                    className={styles.deleteBtn}
                    title="Xóa danh mục"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
