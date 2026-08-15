import React, { useState } from 'react';
import { X, Plus, Edit2, Trash2, Save, FolderTree } from 'lucide-react';
import {
  type DepartmentItem,
  getAllDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from '../../services/careersService';
import { Button } from './UI';
import styles from './DepartmentManagerModal.module.css';

interface DepartmentManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDepartmentsChange: () => void;
}

export const DepartmentManagerModal: React.FC<DepartmentManagerModalProps> = ({
  isOpen,
  onClose,
  onDepartmentsChange,
}) => {
  const [departments, setDepartments] = useState<DepartmentItem[]>(() => getAllDepartments());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [color, setColor] = useState('#3b82f6');

  if (!isOpen) return null;

  const refreshList = () => {
    const fresh = getAllDepartments();
    setDepartments(fresh);
    onDepartmentsChange();
  };

  const handleResetForm = () => {
    setEditingId(null);
    setName('');
    setNameEn('');
    setColor('#3b82f6');
  };

  const handleEditClick = (dept: DepartmentItem) => {
    setEditingId(dept.id);
    setName(dept.name);
    setNameEn(dept.nameEn || '');
    setColor(dept.color || '#3b82f6');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingId) {
      updateDepartment(editingId, { name, nameEn, color });
    } else {
      createDepartment({ name, nameEn, color });
    }

    handleResetForm();
    refreshList();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phòng ban này?')) {
      deleteDepartment(id);
      refreshList();
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.header}>
          <div className={styles.titleGroup}>
            <FolderTree size={20} color="#F58220" />
            <h3 className={styles.title}>Quản Lý Phòng Ban & Khối Chức Năng</h3>
          </div>
          <button type="button" onClick={onClose} className={styles.closeBtn}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.body}>
          {/* Add / Edit Form */}
          <form onSubmit={handleSave} className={styles.formCard}>
            <h4 className={styles.formTitle}>
              {editingId ? <Edit2 size={16} /> : <Plus size={16} />}
              {editingId ? 'Chỉnh sửa phòng ban' : 'Thêm phòng ban mới'}
            </h4>

            <div className={styles.formGrid}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Tên phòng ban (Tiếng Việt) *</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Khối Học Thuật & Đào Tạo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Tên phòng ban (English)</label>
                <input
                  type="text"
                  placeholder="VD: Academic Department"
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Màu sắc phân loại badge</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  style={{ width: '40px', height: '36px', padding: 0, border: 'none', borderRadius: '8px', cursor: 'pointer', background: 'transparent' }}
                />
                <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Màu sắc đại diện cho phòng ban này</span>
              </div>
            </div>

            <div className={styles.formActions}>
              {editingId && (
                <Button type="button" variant="secondary" size="sm" onClick={handleResetForm}>
                  Hủy sửa
                </Button>
              )}
              <Button type="submit" variant="primary" size="sm" icon={<Save size={15} />}>
                {editingId ? 'Cập nhật' : 'Thêm phòng ban'}
              </Button>
            </div>
          </form>

          {/* Department List */}
          <div>
            <div className={styles.deptListHeader}>
              <h4 className={styles.deptListTitle}>Danh sách phòng ban ({departments.length})</h4>
            </div>

            <div className={styles.deptGrid} style={{ marginTop: '0.75rem' }}>
              {departments.map((dept) => (
                <div key={dept.id} className={styles.deptItem}>
                  <div className={styles.deptInfo}>
                    <div className={styles.deptDot} style={{ backgroundColor: dept.color || '#3b82f6' }} />
                    <div className={styles.deptNames}>
                      <span className={styles.deptNameVi}>{dept.name}</span>
                      {dept.nameEn && <span className={styles.deptNameEn}>{dept.nameEn}</span>}
                    </div>
                  </div>

                  <div className={styles.deptActions}>
                    <button
                      type="button"
                      onClick={() => handleEditClick(dept)}
                      className={styles.actionBtn}
                      title="Chỉnh sửa phòng ban"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(dept.id)}
                      className={`${styles.actionBtn} ${styles.deleteBtn}`}
                      title="Xóa phòng ban"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
