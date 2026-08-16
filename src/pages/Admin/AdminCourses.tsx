import React, { useState, useEffect, useMemo } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  PauseCircle,
  X,
  RefreshCw,
} from 'lucide-react';
import {
  fetchCoursesFromSupabase,
  createCourse,
  updateCourse,
  deleteCourse,
  type CourseItem,
  type CourseCategory,
  type CourseStatus,
} from '../../services/courseService';
import { ConfirmModal } from '../../components/ConfirmModal/ConfirmModal';
import { useToast } from '../../components/Toast/Toast';
import { Select, type SelectOption } from '../../components/Admin/UI';
import styles from './AdminCourses.module.css';

const categoryFilterOptions: SelectOption[] = [
  { value: 'all', label: 'Tất cả chương trình' },
  { value: 'kids', label: 'Tiếng Anh Mầm Non / Tiểu Học' },
  { value: 'teens', label: 'Tiếng Anh THCS / THPT' },
  { value: 'ielts', label: 'Luyện Thi IELTS' },
  { value: 'comm', label: 'Tiếng Anh Giao Tiếp' },
];

const statusFilterOptions: SelectOption[] = [
  { value: 'all', label: 'Tất cả trạng thái' },
  { value: 'active', label: 'Đang tuyển sinh' },
  { value: 'paused', label: 'Tạm ngưng' },
  { value: 'draft', label: 'Bản nháp' },
];

const formCategoryOptions: SelectOption[] = [
  { value: 'kids', label: 'Tiếng Anh Mầm Non / Tiểu Học' },
  { value: 'teens', label: 'Tiếng Anh THCS / THPT' },
  { value: 'ielts', label: 'Luyện Thi IELTS' },
  { value: 'comm', label: 'Tiếng Anh Giao Tiếp' },
];

const formStatusOptions: SelectOption[] = [
  { value: 'active', label: 'Đang mở tuyển sinh' },
  { value: 'paused', label: 'Tạm ngưng' },
  { value: 'draft', label: 'Bản nháp' },
];

export const AdminCourses: React.FC = () => {
  const { showToast } = useToast();
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CourseCategory | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<CourseStatus | 'all'>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<CourseItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Omit<CourseItem, 'id' | 'createdAt' | 'updatedAt'>>({
    courseCode: '',
    category: 'kids',
    titleVi: '',
    titleEn: '',
    badgeVi: '',
    badgeEn: '',
    targetAgeVi: '',
    targetAgeEn: '',
    descriptionVi: '',
    descriptionEn: '',
    durationVi: '',
    durationEn: '',
    levelVi: '',
    levelEn: '',
    targetOutputVi: '',
    targetOutputEn: '',
    tuitionFee: 0,
    discountFee: 0,
    featuresVi: [],
    featuresEn: [],
    syllabusVi: [],
    syllabusEn: [],
    status: 'active',
  });

  const [featuresTextVi, setFeaturesTextVi] = useState('');
  const [syllabusTextVi, setSyllabusTextVi] = useState('');

  const loadData = async () => {
    setIsLoading(true);
    const data = await fetchCoursesFromSupabase();
    setCourses(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const matchSearch =
        c.titleVi.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.courseCode.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = selectedCategory === 'all' || c.category === selectedCategory;
      const matchStatus = selectedStatus === 'all' || c.status === selectedStatus;
      return matchSearch && matchCategory && matchStatus;
    });
  }, [courses, searchQuery, selectedCategory, selectedStatus]);

  const stats = useMemo(() => {
    const total = courses.length;
    const active = courses.filter((c) => c.status === 'active').length;
    const paused = courses.filter((c) => c.status === 'paused').length;
    const kids = courses.filter((c) => c.category === 'kids').length;
    const ielts = courses.filter((c) => c.category === 'ielts').length;
    return { total, active, paused, kids, ielts };
  }, [courses]);

  const handleOpenCreate = () => {
    setEditingCourse(null);
    setFormData({
      courseCode: `ICAM-CRS-${Date.now().toString().slice(-4)}`,
      category: 'kids',
      titleVi: '',
      titleEn: '',
      badgeVi: 'MẦM NON',
      badgeEn: 'KINDERGARTEN',
      targetAgeVi: '4 - 6 tuổi',
      targetAgeEn: 'Ages 4 - 6',
      descriptionVi: '',
      descriptionEn: '',
      durationVi: '12 tháng / 3 khóa',
      durationEn: '12 months / 3 terms',
      levelVi: 'Pre-A1 Starters',
      levelEn: 'Pre-A1 Starters',
      targetOutputVi: '',
      targetOutputEn: '',
      tuitionFee: 3500000,
      discountFee: 3000000,
      featuresVi: [],
      featuresEn: [],
      syllabusVi: [],
      syllabusEn: [],
      status: 'active',
    });
    setFeaturesTextVi('');
    setSyllabusTextVi('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (course: CourseItem) => {
    setEditingCourse(course);
    setFormData({
      courseCode: course.courseCode,
      category: course.category,
      titleVi: course.titleVi,
      titleEn: course.titleEn,
      badgeVi: course.badgeVi,
      badgeEn: course.badgeEn,
      targetAgeVi: course.targetAgeVi,
      targetAgeEn: course.targetAgeEn,
      descriptionVi: course.descriptionVi,
      descriptionEn: course.descriptionEn,
      durationVi: course.durationVi,
      durationEn: course.durationEn,
      levelVi: course.levelVi,
      levelEn: course.levelEn,
      targetOutputVi: course.targetOutputVi,
      targetOutputEn: course.targetOutputEn,
      tuitionFee: course.tuitionFee,
      discountFee: course.discountFee || 0,
      featuresVi: course.featuresVi,
      featuresEn: course.featuresEn,
      syllabusVi: course.syllabusVi,
      syllabusEn: course.syllabusEn,
      status: course.status,
    });
    setFeaturesTextVi(course.featuresVi.join('\n'));
    setSyllabusTextVi(course.syllabusVi.join('\n'));
    setIsModalOpen(true);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.titleVi.trim()) {
      showToast('Vui lòng nhập tên khóa học (Tiếng Việt)', 'error');
      return;
    }

    const parsedFeatures = featuresTextVi
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    const parsedSyllabus = syllabusTextVi
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      ...formData,
      featuresVi: parsedFeatures,
      featuresEn: parsedFeatures,
      syllabusVi: parsedSyllabus,
      syllabusEn: parsedSyllabus,
    };

    if (editingCourse) {
      const res = await updateCourse(editingCourse.id, payload);
      if (res.success) {
        showToast('Cập nhật khóa học thành công!', 'success');
      } else {
        showToast(res.error || 'Cập nhật thất bại', 'error');
      }
    } else {
      const res = await createCourse(payload);
      if (res.success) {
        showToast('Tạo mới khóa học thành công!', 'success');
      } else {
        showToast(res.error || 'Tạo mới thất bại', 'error');
      }
    }

    setIsModalOpen(false);
    loadData();
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    const res = await deleteCourse(deleteId);
    if (res.success) {
      showToast('Đã xóa khóa học thành công', 'success');
    } else {
      showToast('Xóa khóa học thất bại', 'error');
    }
    setDeleteId(null);
    loadData();
  };

  const handleToggleStatus = async (course: CourseItem) => {
    const nextStatus: CourseStatus = course.status === 'active' ? 'paused' : 'active';
    await updateCourse(course.id, { status: nextStatus });
    showToast(`Đã đổi trạng thái khóa học sang ${nextStatus === 'active' ? 'Tuyển sinh' : 'Tạm ngưng'}`, 'info');
    loadData();
  };

  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const getCategoryLabel = (cat: CourseCategory) => {
    switch (cat) {
      case 'kids':
        return 'Tiếng Anh Mầm Non / Tiều Học';
      case 'teens':
        return 'Tiếng Anh THCS / THPT';
      case 'ielts':
        return 'Luyện Thi IELTS';
      case 'comm':
        return 'Tiếng Anh Giao Tiếp';
      case 'online':
        return 'Khóa Học Online';
      default:
        return cat;
    }
  };

  return (
    <div className={styles.adminCoursesContainer}>
      {/* PAGE HEADER */}
      <div className={styles.pageHeader}>
        <div className={styles.headerTitleArea}>
          <h1>Quản Lý Khóa Học & Lộ Trình Đào Tạo</h1>
          <p>Cập nhật danh mục khóa học, học phí, cam kết đầu ra & đồng bộ Supabase PostgreSQL</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.createCourseBtn} onClick={handleOpenCreate}>
            <Plus size={18} /> Tạo Khóa Học Mới
          </button>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className={styles.statGrid}>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.iconTotal}`}>
            <BookOpen size={24} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>Tổng số khóa học</span>
            <span className={styles.statValue}>{stats.total}</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.iconActive}`}>
            <CheckCircle2 size={24} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>Đang tuyển sinh</span>
            <span className={styles.statValue}>{stats.active}</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.iconPaused}`}>
            <PauseCircle size={24} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>Tạm ngưng / Nháp</span>
            <span className={styles.statValue}>{stats.paused}</span>
          </div>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className={styles.filterCard}>
        <div className={styles.searchBox}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Tìm theo Mã khóa học, Tên khóa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className={styles.filterGroup}>
          <Select
            options={categoryFilterOptions}
            value={selectedCategory}
            onChange={(val) => setSelectedCategory(val as any)}
          />

          <Select
            options={statusFilterOptions}
            value={selectedStatus}
            onChange={(val) => setSelectedStatus(val as any)}
          />

          <button className={styles.actionBtn} onClick={loadData} title="Tải lại dữ liệu">
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* COURSE DIRECTORY TABLE */}
      <div className={styles.tableContainer}>
        <table className={styles.coursesTable}>
          <thead>
            <tr>
              <th>Mã KH</th>
              <th>Tên Khóa Học</th>
              <th>Phân Loại</th>
              <th>Độ Tuổi</th>
              <th>Thời Lượng</th>
              <th>Cam Kết Đầu Ra</th>
              <th>Học Phí Gốc</th>
              <th>Trạng Thái</th>
              <th>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <tr key={course.id}>
                  <td className={styles.codeCell}>{course.courseCode}</td>
                  <td>
                    <div className={styles.titleCell}>
                      <span className={styles.titleMain}>{course.titleVi}</span>
                      <span className={styles.titleSub}>{course.titleEn}</span>
                    </div>
                  </td>
                  <td>
                    <span
                      className={`${styles.categoryBadge} ${
                        course.category === 'kids'
                          ? styles.catKids
                          : course.category === 'teens'
                          ? styles.catTeens
                          : course.category === 'ielts'
                          ? styles.catIelts
                          : styles.catComm
                      }`}
                    >
                      {getCategoryLabel(course.category)}
                    </span>
                  </td>
                  <td>{course.targetAgeVi}</td>
                  <td>{course.durationVi}</td>
                  <td style={{ maxWidth: 220 }}>{course.targetOutputVi}</td>
                  <td className={styles.feeCell}>{formatVND(course.tuitionFee)}</td>
                  <td>
                    <span
                      className={`${styles.statusBadge} ${
                        course.status === 'active'
                          ? styles.statusActive
                          : course.status === 'paused'
                          ? styles.statusPaused
                          : styles.statusDraft
                      }`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleToggleStatus(course)}
                    >
                      {course.status === 'active' ? 'Đang mở' : course.status === 'paused' ? 'Tạm ngưng' : 'Nháp'}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actionsCell}>
                      <button
                        className={styles.actionBtn}
                        onClick={() => handleOpenEdit(course)}
                        title="Chỉnh sửa thông tin"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        className={`${styles.actionBtn} ${styles.deleteBtn}`}
                        onClick={() => setDeleteId(course.id)}
                        title="Xóa khóa học"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className={styles.emptyState}>
                  {isLoading ? 'Đang tải dữ liệu khóa học...' : 'Không tìm thấy khóa học nào phù hợp'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* CREATE / EDIT COURSE MODAL */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>{editingCourse ? 'Chỉnh Sửa Khóa Học' : 'Tạo Khóa Học Mới'}</h2>
              <button className={styles.closeModalBtn} onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitForm}>
              <div className={styles.modalBody}>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label>Mã khóa học *</label>
                    <input
                      type="text"
                      required
                      className={styles.formInput}
                      value={formData.courseCode}
                      onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Phân loại chương trình *</label>
                    <Select
                      options={formCategoryOptions}
                      value={formData.category}
                      onChange={(val) => setFormData({ ...formData, category: val as CourseCategory })}
                      fullWidth
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Tên khóa học (Tiếng Việt) *</label>
                    <input
                      type="text"
                      required
                      className={styles.formInput}
                      placeholder="Ví dụ: CAM Kids Starter..."
                      value={formData.titleVi}
                      onChange={(e) => setFormData({ ...formData, titleVi: e.target.value })}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Tên khóa học (Tiếng Anh)</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      placeholder="Ví dụ: CAM Kids Starter..."
                      value={formData.titleEn}
                      onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Độ tuổi học viên</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      placeholder="Ví dụ: 4 - 6 tuổi..."
                      value={formData.targetAgeVi}
                      onChange={(e) => setFormData({ ...formData, targetAgeVi: e.target.value, targetAgeEn: e.target.value })}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Thời lượng học</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      placeholder="Ví dụ: 12 tháng / 3 khóa..."
                      value={formData.durationVi}
                      onChange={(e) => setFormData({ ...formData, durationVi: e.target.value, durationEn: e.target.value })}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Học phí niêm yết (VNĐ) *</label>
                    <input
                      type="number"
                      required
                      className={styles.formInput}
                      value={formData.tuitionFee}
                      onChange={(e) => setFormData({ ...formData, tuitionFee: Number(e.target.value) })}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Học phí ưu đãi (VNĐ)</label>
                    <input
                      type="number"
                      className={styles.formInput}
                      value={formData.discountFee || ''}
                      onChange={(e) => setFormData({ ...formData, discountFee: Number(e.target.value) })}
                    />
                  </div>

                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label>Cam kết chuẩn đầu ra *</label>
                    <input
                      type="text"
                      required
                      className={styles.formInput}
                      placeholder="Ví dụ: Cam kết đạt 12-15 khiên Cambridge / IELTS 6.5+..."
                      value={formData.targetOutputVi}
                      onChange={(e) => setFormData({ ...formData, targetOutputVi: e.target.value, targetOutputEn: e.target.value })}
                    />
                  </div>

                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label>Mô tả ngắn khóa học</label>
                    <textarea
                      className={styles.formTextarea}
                      placeholder="Nhập mô tả tổng quan về khóa học..."
                      value={formData.descriptionVi}
                      onChange={(e) => setFormData({ ...formData, descriptionVi: e.target.value, descriptionEn: e.target.value })}
                    />
                  </div>

                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label>Điểm nổi bật khóa học (Mỗi dòng 1 ý)</label>
                    <textarea
                      className={styles.formTextarea}
                      placeholder="Ví dụ:&#10;Phương pháp Phonics chuẩn Mỹ&#10;100% Giáo viên nước ngoài"
                      value={featuresTextVi}
                      onChange={(e) => setFeaturesTextVi(e.target.value)}
                    />
                  </div>

                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label>Khung chương trình 4Ls + LETI (Mỗi dòng 1 Module)</label>
                    <textarea
                      className={styles.formTextarea}
                      placeholder="Ví dụ:&#10;Module 1: Phonics & Alphabet Discovery&#10;Module 2: Family & Colors"
                      value={syllabusTextVi}
                      onChange={(e) => setSyllabusTextVi(e.target.value)}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Trạng thái tuyển sinh</label>
                    <Select
                      options={formStatusOptions}
                      value={formData.status}
                      onChange={(val) => setFormData({ ...formData, status: val as CourseStatus })}
                      fullWidth
                    />
                  </div>
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button type="button" className={styles.cancelBtn} onClick={() => setIsModalOpen(false)}>
                  Hủy
                </button>
                <button type="submit" className={styles.saveBtn}>
                  {editingCourse ? 'Lưu Thay Đổi' : 'Tạo Khóa Học'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      <ConfirmModal
        isOpen={!!deleteId}
        title="Xác Nhận Xóa Khóa Học"
        message="Bạn có chắc chắn muốn xóa khóa học này khỏi hệ thống? Thao tác này sẽ đồng bộ trên Supabase."
        confirmLabel="Xóa Khóa Học"
        cancelLabel="Hủy"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};
