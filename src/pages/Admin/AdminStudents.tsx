import React, { useState, useEffect } from 'react';
import {
  Star,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Award,
  Sparkles,
  RefreshCw,
  Trophy,
  FolderTree
} from 'lucide-react';
import styles from './AdminStudents.module.css';
import {
  type Student,
  type StudentHighlight,
  fetchStudentsFromSupabase,
  createStudent,
  updateStudent,
  deleteStudent
} from '../../services/studentService';
import { MediaSelectorModal } from '../../components/Admin/MediaSelectorModal';
import { useToast } from '../../components/Toast/Toast';

export const AdminStudents: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [activeLangTab, setActiveLangTab] = useState<'vi' | 'en'>('vi');

  const { showToast } = useToast();

  // Form states
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [roleEn, setRoleEn] = useState('');
  const [image, setImage] = useState('');
  const [mainHighlight, setMainHighlight] = useState('');
  const [mainHighlightEn, setMainHighlightEn] = useState('');

  // 3 Highlights states
  const [hl1Icon, setHl1Icon] = useState<'ielts' | 'degree' | 'medal'>('ielts');
  const [hl1Title, setHl1Title] = useState('');
  const [hl1TitleEn, setHl1TitleEn] = useState('');
  const [hl1Sub, setHl1Sub] = useState('');
  const [hl1SubEn, setHl1SubEn] = useState('');

  const [hl2Icon, setHl2Icon] = useState<'ielts' | 'degree' | 'medal'>('degree');
  const [hl2Title, setHl2Title] = useState('');
  const [hl2TitleEn, setHl2TitleEn] = useState('');
  const [hl2Sub, setHl2Sub] = useState('');
  const [hl2SubEn, setHl2SubEn] = useState('');

  const [hl3Icon, setHl3Icon] = useState<'ielts' | 'degree' | 'medal'>('medal');
  const [hl3Title, setHl3Title] = useState('');
  const [hl3TitleEn, setHl3TitleEn] = useState('');
  const [hl3Sub, setHl3Sub] = useState('');
  const [hl3SubEn, setHl3SubEn] = useState('');

  const loadStudents = async () => {
    setIsLoading(true);
    const data = await fetchStudentsFromSupabase();
    setStudents(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const openCreateModal = () => {
    setEditingStudent(null);
    setName('');
    setRole('Học viên tiêu biểu tại iCANCAM');
    setRoleEn('Outstanding Student at iCANCAM');
    setImage('https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=400');
    setMainHighlight('15/15 Flyers Overall');
    setMainHighlightEn('15/15 Shields Flyers');

    setHl1Icon('ielts');
    setHl1Title('15/15 khiên');
    setHl1TitleEn('15/15 Shields');
    setHl1Sub('Flyers Cambridge');
    setHl1SubEn('Cambridge Flyers');

    setHl2Icon('degree');
    setHl2Title('Điểm Tuyệt Đối');
    setHl2TitleEn('Perfect Score');
    setHl2Sub('Starters & Movers');
    setHl2SubEn('Starters & Movers');

    setHl3Icon('medal');
    setHl3Title('Giải Nhất');
    setHl3TitleEn('1st Prize');
    setHl3Sub('Tiếng Anh cấp trường');
    setHl3SubEn('School English Contest');

    setActiveLangTab('vi');
    setIsModalOpen(true);
  };

  const openEditModal = (s: Student) => {
    setEditingStudent(s);
    setName(s.name);
    setRole(s.role);
    setRoleEn(s.roleEn || s.role);
    setImage(s.image);
    setMainHighlight(s.mainHighlight);
    setMainHighlightEn(s.mainHighlightEn || s.mainHighlight);

    const hls = s.highlights || [];
    if (hls[0]) {
      setHl1Icon(hls[0].iconType);
      setHl1Title(hls[0].title);
      setHl1TitleEn(hls[0].titleEn || hls[0].title);
      setHl1Sub(hls[0].subText);
      setHl1SubEn(hls[0].subTextEn || hls[0].subText);
    }
    if (hls[1]) {
      setHl2Icon(hls[1].iconType);
      setHl2Title(hls[1].title);
      setHl2TitleEn(hls[1].titleEn || hls[1].title);
      setHl2Sub(hls[1].subText);
      setHl2SubEn(hls[1].subTextEn || hls[1].subText);
    }
    if (hls[2]) {
      setHl3Icon(hls[2].iconType);
      setHl3Title(hls[2].title);
      setHl3TitleEn(hls[2].titleEn || hls[2].title);
      setHl3Sub(hls[2].subText);
      setHl3SubEn(hls[2].subTextEn || hls[2].subText);
    }

    setActiveLangTab('vi');
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, nameStr: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa học viên "${nameStr}"?`)) {
      const res = await deleteStudent(id);
      if (res.success) {
        showToast(`Đã xóa học viên ${nameStr} thành công`, 'success');
        loadStudents();
      } else {
        showToast(res.error || 'Có lỗi xảy ra', 'error');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Vui lòng nhập tên học viên', 'error');
      return;
    }

    const highlightsArr: StudentHighlight[] = [
      {
        iconType: hl1Icon,
        title: hl1Title,
        titleEn: hl1TitleEn || hl1Title,
        subText: hl1Sub,
        subTextEn: hl1SubEn || hl1Sub,
      },
      {
        iconType: hl2Icon,
        title: hl2Title,
        titleEn: hl2TitleEn || hl2Title,
        subText: hl2Sub,
        subTextEn: hl2SubEn || hl2Sub,
      },
      {
        iconType: hl3Icon,
        title: hl3Title,
        titleEn: hl3TitleEn || hl3Title,
        subText: hl3Sub,
        subTextEn: hl3SubEn || hl3Sub,
      },
    ];

    const payload = {
      name,
      role,
      roleEn: roleEn || role,
      image: image || 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=400',
      mainHighlight: mainHighlight || '15/15 Khiên Cambridge',
      mainHighlightEn: mainHighlightEn || mainHighlight || '15/15 Cambridge Shields',
      highlights: highlightsArr,
    };

    if (editingStudent) {
      const res = await updateStudent(editingStudent.id, payload);
      if (res.success) {
        showToast('Cập nhật thông tin học viên thành công', 'success');
        setIsModalOpen(false);
        loadStudents();
      } else {
        showToast(res.error || 'Lỗi cập nhật', 'error');
      }
    } else {
      const res = await createStudent(payload);
      if (res.success) {
        showToast('Thêm học viên ưu tú thành công', 'success');
        setIsModalOpen(false);
        loadStudents();
      } else {
        showToast(res.error || 'Lỗi thêm mới', 'error');
      }
    }
  };

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.mainHighlight.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Quản Lý Học Viên Ưu Tú</h1>
          <p className={styles.pageSubtitle}>
            Đăng & tuyên dương các gương mặt học viên xuất sắc, thủ khoa chứng chỉ Cambridge / IELTS
          </p>
        </div>

        <button onClick={openCreateModal} className={styles.createBtn}>
          <Plus size={18} />
          <span>Thêm Học Viên Mới</span>
        </button>
      </div>

      {/* STATS SUMMARY */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div>
            <div className={styles.statVal}>{students.length}</div>
            <div className={styles.statLabel}>Học viên ưu tú</div>
          </div>
          <Star size={28} color="#F58220" />
        </div>
        <div className={styles.statCard}>
          <div>
            <div className={styles.statVal}>15/15</div>
            <div className={styles.statLabel}>Khiên Cambridge tối đa</div>
          </div>
          <Trophy size={28} color="#3b82f6" />
        </div>
        <div className={styles.statCard}>
          <div>
            <div className={styles.statVal}>100%</div>
            <div className={styles.statLabel}>Tự tin phản xạ quốc tế</div>
          </div>
          <Award size={28} color="#10b981" />
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className={styles.filterCard}>
        <div className={styles.searchBox}>
          <Search size={18} color="#94a3b8" />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Tìm kiếm theo tên học viên, danh hiệu, khiên Cambridge..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button onClick={loadStudents} className={styles.actionBtn} title="Tải lại dữ liệu">
          <RefreshCw size={18} />
        </button>
      </div>

      {/* STUDENTS DIRECTORY TABLE */}
      <div className={styles.tableContainer}>
        {isLoading ? (
          <div className={styles.emptyState}>Đang tải danh sách học viên...</div>
        ) : filteredStudents.length === 0 ? (
          <div className={styles.emptyState}>Chưa có học viên nào khớp với tìm kiếm</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Học Viên</th>
                <th>Danh Hiệu / Vai Trò</th>
                <th>Thành Tích Nổi Bật</th>
                <th style={{ textAlign: 'right' }}>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td>
                    <div className={styles.avatarCell}>
                      <img
                        src={student.image}
                        alt={student.name}
                        className={styles.avatarImg}
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <div>
                        <div className={styles.studentName}>{student.name}</div>
                        <div className={styles.studentRole}>{student.roleEn || student.role}</div>
                      </div>
                    </div>
                  </td>
                  <td>{student.role}</td>
                  <td>
                    <span className={styles.highlightBadge}>{student.mainHighlight}</span>
                  </td>
                  <td>
                    <div className={styles.actionsCell}>
                      <button
                        onClick={() => openEditModal(student)}
                        className={styles.actionBtn}
                        title="Chỉnh sửa"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(student.id, student.name)}
                        className={`${styles.actionBtn} ${styles.deleteBtn}`}
                        title="Xóa học viên"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>{editingStudent ? 'Chỉnh Sửa Học Viên' : 'Thêm Học Viên Ưu Tú'}</h2>
              <button onClick={() => setIsModalOpen(false)} className={styles.closeModalBtn}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className={styles.modalBody}>
                {/* Language Tab Switcher */}
                <div className={styles.langTabGroup}>
                  <button
                    type="button"
                    className={`${styles.langTab} ${activeLangTab === 'vi' ? styles.langTabActive : ''}`}
                    onClick={() => setActiveLangTab('vi')}
                  >
                    <span>Nội Dung Tiếng Việt</span>
                  </button>
                  <button
                    type="button"
                    className={`${styles.langTab} ${activeLangTab === 'en' ? styles.langTabActive : ''}`}
                    onClick={() => setActiveLangTab('en')}
                  >
                    <span>Nội Dung Tiếng Anh</span>
                  </button>
                </div>

                {activeLangTab === 'vi' ? (
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label>Họ và Tên Học Viên *</label>
                      <input
                        type="text"
                        className={styles.formInput}
                        placeholder="Ví dụ: Đỗ Nhất Huy"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Thành Tích Nổi Bật Chính (Tiếng Việt) *</label>
                      <input
                        type="text"
                        className={styles.formInput}
                        placeholder="Ví dụ: 15/15 Flyers Overall"
                        value={mainHighlight}
                        onChange={(e) => setMainHighlight(e.target.value)}
                        required
                      />
                    </div>

                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                      <label>Danh Hiệu / Vai Trò (Tiếng Việt)</label>
                      <input
                        type="text"
                        className={styles.formInput}
                        placeholder="Ví dụ: Học viên tiêu biểu tại iCANCAM"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                      />
                    </div>

                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                      <label>Ảnh Học Viên *</label>
                      <div className={styles.imagePickerWrapper}>
                        <div className={styles.mediaPickerGroup}>
                          <input
                            type="text"
                            className={styles.formInput}
                            placeholder="Dán đường dẫn ảnh hoặc chọn từ thư viện..."
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                            style={{ flex: 1 }}
                          />
                          <button
                            type="button"
                            className={styles.selectMediaBtn}
                            onClick={() => setIsMediaModalOpen(true)}
                          >
                            <FolderTree size={16} />
                            <span>Thư Viện Hệ Thống</span>
                          </button>
                        </div>
                        {image && (
                          <div className={styles.imagePreviewBox}>
                            <img src={image} alt="Preview" className={styles.imagePreviewImg} />
                            <div className={styles.imagePreviewInfo} style={{ flex: 1 }}>
                              <strong>Xem trước ảnh học viên</strong>
                              <div style={{ color: '#94a3b8', fontSize: '0.82rem', marginTop: '2px' }}>
                                {image.startsWith('data:image/')
                                  ? `📷 Tệp ảnh ${image.split(';')[0].replace('data:image/', '').toUpperCase()} từ Thư viện Media`
                                  : image.length > 55
                                  ? `${image.substring(0, 52)}...`
                                  : image}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => setImage('')}
                              style={{
                                background: 'rgba(239, 68, 68, 0.15)',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                color: '#ef4444',
                                borderRadius: '8px',
                                padding: '0.35rem 0.65rem',
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                cursor: 'pointer'
                              }}
                            >
                              Gỡ ảnh
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className={styles.formGrid}>
                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                      <label>Thành Tích Nổi Bật Chính (Tiếng Anh)</label>
                      <input
                        type="text"
                        className={styles.formInput}
                        placeholder="Ví dụ: 15/15 Shields Flyers"
                        value={mainHighlightEn}
                        onChange={(e) => setMainHighlightEn(e.target.value)}
                      />
                    </div>

                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                      <label>Danh Hiệu / Vai Trò (Tiếng Anh)</label>
                      <input
                        type="text"
                        className={styles.formInput}
                        placeholder="Ví dụ: Outstanding Student at iCANCAM"
                        value={roleEn}
                        onChange={(e) => setRoleEn(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {/* 3 HIGHLIGHTS CARDS SECTION */}
                <div className={styles.highlightSection}>
                  <div className={styles.highlightSectionTitle}>
                    <Sparkles size={16} style={{ display: 'inline', marginRight: '0.4rem' }} />
                    3 Điểm Thành Tích Chi Tiết (Hiển thị dạng Thẻ khen thưởng)
                  </div>

                  {/* Highlight 1 */}
                  <div className={styles.highlightCard}>
                    <select
                      className={styles.formSelect}
                      value={hl1Icon}
                      onChange={(e) => setHl1Icon(e.target.value as any)}
                    >
                      <option value="ielts">Icon Khiên / IELTS</option>
                      <option value="degree">Icon Bằng Cấp</option>
                      <option value="medal">Icon Huy Chương</option>
                    </select>
                    <input
                      type="text"
                      className={styles.formInput}
                      placeholder="Tiêu đề 1 (Ví dụ: 15/15 khiên)"
                      value={activeLangTab === 'vi' ? hl1Title : hl1TitleEn}
                      onChange={(e) =>
                        activeLangTab === 'vi' ? setHl1Title(e.target.value) : setHl1TitleEn(e.target.value)
                      }
                    />
                    <input
                      type="text"
                      className={styles.formInput}
                      placeholder="Mô tả 1 (Ví dụ: Flyers Cambridge)"
                      value={activeLangTab === 'vi' ? hl1Sub : hl1SubEn}
                      onChange={(e) =>
                        activeLangTab === 'vi' ? setHl1Sub(e.target.value) : setHl1SubEn(e.target.value)
                      }
                    />
                  </div>

                  {/* Highlight 2 */}
                  <div className={styles.highlightCard}>
                    <select
                      className={styles.formSelect}
                      value={hl2Icon}
                      onChange={(e) => setHl2Icon(e.target.value as any)}
                    >
                      <option value="ielts">Icon Khiên / IELTS</option>
                      <option value="degree">Icon Bằng Cấp</option>
                      <option value="medal">Icon Huy Chương</option>
                    </select>
                    <input
                      type="text"
                      className={styles.formInput}
                      placeholder="Tiêu đề 2 (Ví dụ: Điểm Tuyệt Đối)"
                      value={activeLangTab === 'vi' ? hl2Title : hl2TitleEn}
                      onChange={(e) =>
                        activeLangTab === 'vi' ? setHl2Title(e.target.value) : setHl2TitleEn(e.target.value)
                      }
                    />
                    <input
                      type="text"
                      className={styles.formInput}
                      placeholder="Mô tả 2 (Ví dụ: Starters & Movers)"
                      value={activeLangTab === 'vi' ? hl2Sub : hl2SubEn}
                      onChange={(e) =>
                        activeLangTab === 'vi' ? setHl2Sub(e.target.value) : setHl2SubEn(e.target.value)
                      }
                    />
                  </div>

                  {/* Highlight 3 */}
                  <div className={styles.highlightCard}>
                    <select
                      className={styles.formSelect}
                      value={hl3Icon}
                      onChange={(e) => setHl3Icon(e.target.value as any)}
                    >
                      <option value="ielts">Icon Khiên / IELTS</option>
                      <option value="degree">Icon Bằng Cấp</option>
                      <option value="medal">Icon Huy Chương</option>
                    </select>
                    <input
                      type="text"
                      className={styles.formInput}
                      placeholder="Tiêu đề 3 (Ví dụ: Giải Nhất)"
                      value={activeLangTab === 'vi' ? hl3Title : hl3TitleEn}
                      onChange={(e) =>
                        activeLangTab === 'vi' ? setHl3Title(e.target.value) : setHl3TitleEn(e.target.value)
                      }
                    />
                    <input
                      type="text"
                      className={styles.formInput}
                      placeholder="Mô tả 3 (Ví dụ: Tiếng Anh cấp trường)"
                      value={activeLangTab === 'vi' ? hl3Sub : hl3SubEn}
                      onChange={(e) =>
                        activeLangTab === 'vi' ? setHl3Sub(e.target.value) : setHl3SubEn(e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button type="button" onClick={() => setIsModalOpen(false)} className={styles.cancelBtn}>
                  Hủy Bỏ
                </button>
                <button type="submit" className={styles.saveBtn}>
                  {editingStudent ? 'Lưu Cập Nhật' : 'Tạo Học Viên Mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MEDIA SELECTOR MODAL */}
      <MediaSelectorModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        onSelect={(assets) => {
          if (assets && assets.length > 0) {
            setImage(assets[0].public_url);
          }
          setIsMediaModalOpen(false);
        }}
        allowMultiple={false}
        filterType="image"
        title="Chọn Ảnh Học Viên Từ Thư Viện System"
      />
    </div>
  );
};
