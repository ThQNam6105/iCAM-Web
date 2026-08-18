import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Award,
  GraduationCap,
  Sparkles,
  RefreshCw,
  FolderTree
} from 'lucide-react';
import styles from './AdminTeachers.module.css';
import {
  type Teacher,
  type TeacherHighlight,
  getAllTeachers,
  fetchTeachersFromSupabase,
  createTeacher,
  updateTeacher,
  deleteTeacher
} from '../../services/teacherService';
import { MediaSelectorModal } from '../../components/Admin/MediaSelectorModal';
import { useToast } from '../../components/Toast/Toast';

export const AdminTeachers: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

  const { showToast } = useToast();

  // Form states
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [roleEn, setRoleEn] = useState('');
  const [image, setImage] = useState('');
  const [mainHighlight, setMainHighlight] = useState('');

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

  const loadTeachers = async () => {
    try {
      const initial = getAllTeachers();
      if (initial && initial.length > 0) {
        setTeachers(initial);
      } else {
        setIsLoading(true);
      }
      const data = await fetchTeachersFromSupabase();
      if (data && data.length > 0) {
        setTeachers(data);
      }
    } catch (err) {
      console.warn('Error loading teachers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTeachers();
  }, []);

  const openCreateModal = () => {
    setEditingTeacher(null);
    setName('');
    setRole('Giáo viên tại iCANCAM');
    setRoleEn('Teacher at iCANCAM');
    setImage('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400');
    setMainHighlight('9.0 IELTS Overall');

    setHl1Icon('ielts');
    setHl1Title('9.0');
    setHl1TitleEn('9.0');
    setHl1Sub('IELTS Overall');
    setHl1SubEn('IELTS Overall');

    setHl2Icon('degree');
    setHl2Title('Thạc sĩ TESOL');
    setHl2TitleEn('MA in TESOL');
    setHl2Sub('Đại học Oxford');
    setHl2SubEn('University of Oxford');

    setHl3Icon('medal');
    setHl3Title('Senior Trainer');
    setHl3TitleEn('Senior Trainer');
    setHl3Sub('8+ năm kinh nghiệm');
    setHl3SubEn('8+ years experience');

    setIsModalOpen(true);
  };

  const openEditModal = (t: Teacher) => {
    setEditingTeacher(t);
    setName(t.name);
    setRole(t.role);
    setRoleEn(t.roleEn || t.role);
    setImage(t.image);
    setMainHighlight(t.mainHighlight);

    const hls = t.highlights || [];
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

    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, nameStr: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa giáo viên "${nameStr}"?`)) {
      const res = await deleteTeacher(id);
      if (res.success) {
        showToast(`Đã xóa giáo viên ${nameStr} thành công`, 'success');
        loadTeachers();
      } else {
        showToast(res.error || 'Có lỗi xảy ra', 'error');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Vui lòng nhập tên giáo viên', 'error');
      return;
    }

    const highlightsArr: TeacherHighlight[] = [
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
      image: image || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
      mainHighlight: mainHighlight || '8.5+ IELTS',
      highlights: highlightsArr,
    };

    if (editingTeacher) {
      const res = await updateTeacher(editingTeacher.id, payload);
      if (res.success) {
        showToast('Cập nhật thông tin giáo viên thành công', 'success');
        setIsModalOpen(false);
        loadTeachers();
      } else {
        showToast(res.error || 'Lỗi cập nhật', 'error');
      }
    } else {
      const res = await createTeacher(payload);
      if (res.success) {
        showToast('Thêm giáo viên tiêu biểu thành công', 'success');
        setIsModalOpen(false);
        loadTeachers();
      } else {
        showToast(res.error || 'Lỗi thêm mới', 'error');
      }
    }
  };

  const filteredTeachers = teachers.filter(
    (t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.mainHighlight.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Quản Lý Giáo Viên Tiêu Biểu</h1>
          <p className={styles.pageSubtitle}>
            Đăng & quản lý danh sách đội ngũ giảng viên nổi bật hiển thị trên trang chủ iCANCAM
          </p>
        </div>

        <button onClick={openCreateModal} className={styles.createBtn}>
          <Plus size={18} />
          <span>Thêm Giáo Viên Mới</span>
        </button>
      </div>

      {/* STATS SUMMARY */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div>
            <div className={styles.statVal}>{teachers.length}</div>
            <div className={styles.statLabel}>Giáo viên tiêu biểu</div>
          </div>
          <UserCheck size={28} color="#F58220" />
        </div>
        <div className={styles.statCard}>
          <div>
            <div className={styles.statVal}>100%</div>
            <div className={styles.statLabel}>Có chứng chỉ quốc tế</div>
          </div>
          <GraduationCap size={28} color="#3b82f6" />
        </div>
        <div className={styles.statCard}>
          <div>
            <div className={styles.statVal}>8.5+</div>
            <div className={styles.statLabel}>IELTS trung bình đội ngũ</div>
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
            placeholder="Tìm kiếm theo tên giáo viên, chức vụ, điểm IELTS..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button onClick={loadTeachers} className={styles.actionBtn} title="Tải lại dữ liệu">
          <RefreshCw size={18} />
        </button>
      </div>

      {/* TEACHERS DIRECTORY TABLE */}
      <div className={styles.tableContainer}>
        {isLoading ? (
          <div className={styles.emptyState}>Đang tải danh sách giáo viên...</div>
        ) : filteredTeachers.length === 0 ? (
          <div className={styles.emptyState}>Chưa có giáo viên nào khớp với tìm kiếm</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Giáo Viên</th>
                <th>Chức Vụ / Vai Trò</th>
                <th>Thành Tích Nổi Bật</th>
                <th style={{ textAlign: 'right' }}>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeachers.map((teacher) => (
                <tr key={teacher.id}>
                  <td>
                    <div className={styles.avatarCell}>
                      <img
                        src={teacher.image}
                        alt={teacher.name}
                        className={styles.avatarImg}
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <div>
                        <div className={styles.teacherName}>{teacher.name}</div>
                        <div className={styles.teacherRole}>{teacher.roleEn || teacher.role}</div>
                      </div>
                    </div>
                  </td>
                  <td>{teacher.role}</td>
                  <td>
                    <span className={styles.highlightBadge}>{teacher.mainHighlight}</span>
                  </td>
                  <td>
                    <div className={styles.actionsCell}>
                      <button
                        onClick={() => openEditModal(teacher)}
                        className={styles.actionBtn}
                        title="Chỉnh sửa"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(teacher.id, teacher.name)}
                        className={`${styles.actionBtn} ${styles.deleteBtn}`}
                        title="Xóa giáo viên"
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
              <h2>{editingTeacher ? 'Chỉnh Sửa Giáo Viên' : 'Thêm Giáo Viên Tiêu Biểu'}</h2>
              <button onClick={() => setIsModalOpen(false)} className={styles.closeModalBtn}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className={styles.modalBody}>
                <div className={styles.formGrid}>
                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label>Họ và Tên Giáo Viên *</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      placeholder="Ví dụ: James Harrison"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Thành Tích Nổi Bật Chính *</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      placeholder="Ví dụ: 9.0 IELTS Overall"
                      value={mainHighlight}
                      onChange={(e) => setMainHighlight(e.target.value)}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Chức Danh / Vai Trò (Tiếng Việt)</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      placeholder="Ví dụ: Academic Manager tại iCANCAM"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Chức Danh / Vai Trò (Tiếng Anh)</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      placeholder="Ví dụ: Academic Manager at iCANCAM"
                      value={roleEn}
                      onChange={(e) => setRoleEn(e.target.value)}
                    />
                  </div>

                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label>Ảnh Đại Diện Giáo Viên *</label>
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
                            <strong>Xem trước ảnh giáo viên</strong>
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

                {/* 3 HIGHLIGHTS CARDS SECTION FOR TEACHER OVERLAY */}
                <div className={styles.highlightSection} style={{ marginTop: '1.25rem' }}>
                  <div className={styles.highlightSectionTitle}>
                    <Sparkles size={16} style={{ display: 'inline', marginRight: '0.4rem' }} />
                    3 Điểm Thành Tích Góc Ảnh (Hiển thị đè lên ảnh trên Trang chủ)
                  </div>

                  {/* Highlight 1 */}
                  <div className={styles.highlightCard}>
                    <div style={{ fontWeight: 600, color: '#38bdf8', marginBottom: '0.4rem', fontSize: '0.85rem' }}>
                      Dòng 1 (Màn hình / IELTS)
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr 1fr', gap: '0.5rem', marginBottom: '0.4rem' }}>
                      <select
                        className={styles.formSelect}
                        value={hl1Icon}
                        onChange={(e) => setHl1Icon(e.target.value as any)}
                      >
                        <option value="ielts">Icon IELTS / Máy tính</option>
                        <option value="degree">Icon Mũ Bằng Cấp</option>
                        <option value="medal">Icon Huy Chương / Bằng</option>
                      </select>
                      <input
                        type="text"
                        className={styles.formInput}
                        placeholder="Tiêu đề VI (Ví dụ: 8.5)"
                        value={hl1Title}
                        onChange={(e) => setHl1Title(e.target.value)}
                      />
                      <input
                        type="text"
                        className={styles.formInput}
                        placeholder="Mô tả VI (Ví dụ: IELTS Overall)"
                        value={hl1Sub}
                        onChange={(e) => setHl1Sub(e.target.value)}
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <input
                        type="text"
                        className={styles.formInput}
                        placeholder="Tiêu đề EN (Ví dụ: 8.5)"
                        value={hl1TitleEn}
                        onChange={(e) => setHl1TitleEn(e.target.value)}
                      />
                      <input
                        type="text"
                        className={styles.formInput}
                        placeholder="Mô tả EN (Ví dụ: IELTS Overall)"
                        value={hl1SubEn}
                        onChange={(e) => setHl1SubEn(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Highlight 2 */}
                  <div className={styles.highlightCard}>
                    <div style={{ fontWeight: 600, color: '#38bdf8', marginBottom: '0.4rem', fontSize: '0.85rem' }}>
                      Dòng 2 (Học vị / Bằng cấp)
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr 1fr', gap: '0.5rem', marginBottom: '0.4rem' }}>
                      <select
                        className={styles.formSelect}
                        value={hl2Icon}
                        onChange={(e) => setHl2Icon(e.target.value as any)}
                      >
                        <option value="ielts">Icon IELTS / Máy tính</option>
                        <option value="degree">Icon Mũ Bằng Cấp</option>
                        <option value="medal">Icon Huy Chương / Bằng</option>
                      </select>
                      <input
                        type="text"
                        className={styles.formInput}
                        placeholder="Tiêu đề VI (Ví dụ: Thạc sĩ Ngôn ngữ)"
                        value={hl2Title}
                        onChange={(e) => setHl2Title(e.target.value)}
                      />
                      <input
                        type="text"
                        className={styles.formInput}
                        placeholder="Mô tả VI (Ví dụ: Đại học Edinburgh)"
                        value={hl2Sub}
                        onChange={(e) => setHl2Sub(e.target.value)}
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <input
                        type="text"
                        className={styles.formInput}
                        placeholder="Tiêu đề EN (Ví dụ: Master of Linguistics)"
                        value={hl2TitleEn}
                        onChange={(e) => setHl2TitleEn(e.target.value)}
                      />
                      <input
                        type="text"
                        className={styles.formInput}
                        placeholder="Mô tả EN (Ví dụ: University of Edinburgh)"
                        value={hl2SubEn}
                        onChange={(e) => setHl2SubEn(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Highlight 3 */}
                  <div className={styles.highlightCard}>
                    <div style={{ fontWeight: 600, color: '#38bdf8', marginBottom: '0.4rem', fontSize: '0.85rem' }}>
                      Dòng 3 (Chứng chỉ quốc tế)
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr 1fr', gap: '0.5rem', marginBottom: '0.4rem' }}>
                      <select
                        className={styles.formSelect}
                        value={hl3Icon}
                        onChange={(e) => setHl3Icon(e.target.value as any)}
                      >
                        <option value="ielts">Icon IELTS / Máy tính</option>
                        <option value="degree">Icon Mũ Bằng Cấp</option>
                        <option value="medal">Icon Huy Chương / Bằng</option>
                      </select>
                      <input
                        type="text"
                        className={styles.formInput}
                        placeholder="Tiêu đề VI (Ví dụ: Chứng chỉ CELTA)"
                        value={hl3Title}
                        onChange={(e) => setHl3Title(e.target.value)}
                      />
                      <input
                        type="text"
                        className={styles.formInput}
                        placeholder="Mô tả VI (Ví dụ: Đạt chuẩn Cambridge)"
                        value={hl3Sub}
                        onChange={(e) => setHl3Sub(e.target.value)}
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <input
                        type="text"
                        className={styles.formInput}
                        placeholder="Tiêu đề EN (Ví dụ: CELTA Certificate)"
                        value={hl3TitleEn}
                        onChange={(e) => setHl3TitleEn(e.target.value)}
                      />
                      <input
                        type="text"
                        className={styles.formInput}
                        placeholder="Mô tả EN (Ví dụ: Cambridge certified)"
                        value={hl3SubEn}
                        onChange={(e) => setHl3SubEn(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button type="button" onClick={() => setIsModalOpen(false)} className={styles.cancelBtn}>
                  Hủy Bỏ
                </button>
                <button type="submit" className={styles.saveBtn}>
                  {editingTeacher ? 'Lưu Cập Nhật' : 'Tạo Giáo Viên Mới'}
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
        title="Chọn Ảnh Đại Diện Giáo Viên Từ Thư Viện System"
      />
    </div>
  );
};
