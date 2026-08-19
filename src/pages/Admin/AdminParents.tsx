import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  RefreshCw,
  Image as ImageIcon
} from 'lucide-react';
import styles from './AdminParents.module.css';
import {
  type ParentTestimonial,
  getAllParents,
  fetchParentsFromSupabase,
  createParent,
  updateParent,
  deleteParent
} from '../../services/parentService';
import { MediaSelectorModal } from '../../components/Admin/MediaSelectorModal';
import { useToast } from '../../components/Toast/Toast';

export const AdminParents: React.FC = () => {
  const [parents, setParents] = useState<ParentTestimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [editingParent, setEditingParent] = useState<ParentTestimonial | null>(null);
  const [activeLangTab, setActiveLangTab] = useState<'vi' | 'en'>('vi');

  const { showToast } = useToast();

  // Form states
  const [childName, setChildName] = useState('');
  const [years, setYears] = useState<number>(10);
  const [image, setImage] = useState('');
  const [feedback, setFeedback] = useState('');
  const [feedbackEn, setFeedbackEn] = useState('');

  const loadParents = async () => {
    try {
      const initial = getAllParents();
      if (initial && initial.length > 0) {
        setParents(initial);
      } else {
        setIsLoading(true);
      }
      const data = await fetchParentsFromSupabase();
      if (data && data.length > 0) {
        setParents(data);
      }
    } catch (err) {
      console.warn('Error loading parent testimonials:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadParents();
  }, []);

  const openCreateModal = () => {
    setEditingParent(null);
    setChildName('');
    setYears(10);
    setImage('https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400');
    setFeedback('');
    setFeedbackEn('');
    setActiveLangTab('vi');
    setIsModalOpen(true);
  };

  const openEditModal = (parent: ParentTestimonial) => {
    setEditingParent(parent);
    setChildName(parent.childName);
    setYears(parent.years || 10);
    setImage(parent.image);
    setFeedback(parent.feedback || '');
    setFeedbackEn(parent.feedbackEn || parent.feedback || '');
    setActiveLangTab('vi');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!childName.trim()) {
      showToast('Vui lòng nhập tên bé', 'error');
      return;
    }
    if (!feedback.trim()) {
      showToast('Vui lòng nhập nội dung cảm nhận phụ huynh', 'error');
      return;
    }

    try {
      if (editingParent) {
        const res = await updateParent(editingParent.id, {
          childName: childName.trim(),
          years: Number(years) || 10,
          image: image.trim(),
          feedback: feedback.trim(),
          feedbackEn: (feedbackEn || feedback).trim(),
        });
        if (res.success) {
          showToast('Cập nhật ý kiến phụ huynh thành công!', 'success');
        } else {
          showToast(res.error || 'Có lỗi xảy ra', 'error');
        }
      } else {
        const res = await createParent({
          childName: childName.trim(),
          years: Number(years) || 10,
          image: image.trim(),
          feedback: feedback.trim(),
          feedbackEn: (feedbackEn || feedback).trim(),
        });
        if (res.success) {
          showToast('Thêm ý kiến phụ huynh thành công!', 'success');
        } else {
          showToast(res.error || 'Có lỗi xảy ra', 'error');
        }
      }
      setIsModalOpen(false);
      loadParents();
    } catch (err: any) {
      showToast(err.message || 'Thao tác thất bại', 'error');
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa ý kiến phụ huynh này?')) return;
    try {
      const res = await deleteParent(id);
      if (res.success) {
        showToast('Đã xóa ý kiến phụ huynh', 'success');
        loadParents();
      } else {
        showToast(res.error || 'Lỗi khi xóa', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Lỗi khi xóa', 'error');
    }
  };

  const filteredParents = parents.filter(
    (p) =>
      p.childName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.feedback.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.container}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Ý Kiến Phụ Huynh</h1>
          <p className={styles.pageSubtitle}>
            Quản lý và cập nhật các đánh giá, cảm nhận từ phụ huynh học viên tại iCANCAM
          </p>
        </div>
        <button onClick={openCreateModal} className={styles.createBtn}>
          <Plus size={18} />
          <span>Thêm Ý Kiến Phụ Huynh</span>
        </button>
      </div>

      {/* Filter Card */}
      <div className={styles.filterCard}>
        <div className={styles.searchBox}>
          <Search className={styles.searchIcon} size={18} />
          <input
            type="text"
            placeholder="Tìm kiếm phụ huynh / tên bé..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <button onClick={loadParents} className={styles.refreshBtn} title="Làm mới">
          <RefreshCw size={18} />
          <span>Làm mới</span>
        </button>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className={styles.emptyState}>Đang tải danh sách ý kiến phụ huynh...</div>
      ) : filteredParents.length === 0 ? (
        <div className={styles.emptyState}>Chưa có ý kiến phụ huynh nào phù hợp.</div>
      ) : (
        <div className={styles.grid}>
          {filteredParents.map((parent) => (
            <div key={parent.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <img src={parent.image} alt={parent.childName} className={styles.avatar} />
                <div className={styles.cardInfo}>
                  <h3 className={styles.childName}>{parent.childName}</h3>
                  <span className={styles.yearsBadge}>
                    Học viên {parent.years || 10} tuổi
                  </span>
                </div>
              </div>
              <div className={styles.cardBody}>
                <p className={styles.feedbackVi}>"{parent.feedback}"</p>
                {parent.feedbackEn && (
                  <p className={styles.feedbackEn}>"{parent.feedbackEn}"</p>
                )}
              </div>
              <div className={styles.cardFooter}>
                <button onClick={() => openEditModal(parent)} className={styles.editBtn}>
                  <Edit2 size={14} />
                  <span>Sửa</span>
                </button>
                <button onClick={() => handleDelete(parent.id)} className={styles.deleteBtn}>
                  <Trash2 size={14} />
                  <span>Xóa</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Edit/Create */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                {editingParent ? 'Chỉnh Sửa Ý Kiến Phụ Huynh' : 'Thêm Ý Kiến Phụ Huynh Mới'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className={styles.closeBtn}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className={styles.modalForm}>
              <div className={styles.modalBody}>
                {/* Language Tabs */}
                <div className={styles.langTabGroup}>
                  <button
                    type="button"
                    className={`${styles.langTab} ${activeLangTab === 'vi' ? styles.langTabActive : ''}`}
                    onClick={() => setActiveLangTab('vi')}
                  >
                    🇻🇳 Nội dung Tiếng Việt
                  </button>
                  <button
                    type="button"
                    className={`${styles.langTab} ${activeLangTab === 'en' ? styles.langTabActive : ''}`}
                    onClick={() => setActiveLangTab('en')}
                  >
                    🇬🇧 Nội dung Tiếng Anh
                  </button>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Tên Bé / Học Viên (*)</label>
                    <input
                      type="text"
                      value={childName}
                      onChange={(e) => setChildName(e.target.value)}
                      placeholder="Ví dụ: Bé Võ Huỳnh Thiên Ân"
                      required
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Độ Tuổi / Lớp (*)</label>
                    <input
                      type="number"
                      value={years}
                      onChange={(e) => setYears(Number(e.target.value))}
                      placeholder="Ví dụ: 10"
                      required
                      className={styles.input}
                    />
                  </div>
                </div>

                {/* Avatar Image Selection */}
                <div className={styles.formGroup}>
                  <label className={styles.label}>Ảnh Đại Diện Phụ Huynh / Học Viên (*)</label>
                  <div className={styles.imagePreviewRow}>
                    <img src={image || 'https://via.placeholder.com/65'} alt="Avatar Preview" className={styles.imagePreview} />
                    <button
                      type="button"
                      onClick={() => setIsMediaModalOpen(true)}
                      className={styles.mediaSelectBtn}
                    >
                      <ImageIcon size={16} style={{ display: 'inline', marginRight: '6px' }} />
                      Chọn từ Thư viện Media
                    </button>
                  </div>
                  <input
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="URL Hình ảnh..."
                    style={{ marginTop: '0.5rem' }}
                    className={styles.input}
                  />
                </div>

                {/* Feedback text according to selected tab */}
                {activeLangTab === 'vi' ? (
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Cảm Nhận Của Phụ Huynh (Tiếng Việt) (*)</label>
                    <textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Nhập nhận xét, cảm nghĩ của phụ huynh về trung tâm iCANCAM..."
                      required
                      className={styles.textarea}
                    />
                  </div>
                ) : (
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Cảm Nhận Của Phụ Huynh (Tiếng Anh)</label>
                    <textarea
                      value={feedbackEn}
                      onChange={(e) => setFeedbackEn(e.target.value)}
                      placeholder="Enter parent feedback in English..."
                      className={styles.textarea}
                    />
                  </div>
                )}
              </div>

              <div className={styles.modalFooter}>
                <button type="button" onClick={() => setIsModalOpen(false)} className={styles.cancelBtn}>
                  Hủy
                </button>
                <button type="submit" className={styles.saveBtn}>
                  {editingParent ? 'Lưu Thay Đổi' : 'Thêm Phụ Huynh'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Media Selector Modal */}
      {isMediaModalOpen && (
        <MediaSelectorModal
          isOpen={isMediaModalOpen}
          onClose={() => setIsMediaModalOpen(false)}
          onSelect={(items) => {
            if (items && items.length > 0) {
              setImage(items[0].public_url);
            }
            setIsMediaModalOpen(false);
          }}
        />
      )}
    </div>
  );
};
