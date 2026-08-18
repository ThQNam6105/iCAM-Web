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
  FolderPlus,
  FolderTree,
} from 'lucide-react';
import {
  fetchCoursesFromSupabase,
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseCategories,
  fetchCourseCategoriesFromSupabase,
  createCourseCategory,
  updateCourseCategory,
  deleteCourseCategory,
  type CourseItem,
  type CourseCategory,
  type CourseStatus,
  type CourseCategoryItem,
} from '../../services/courseService';
import { ConfirmModal } from '../../components/ConfirmModal/ConfirmModal';
import { useToast } from '../../components/Toast/Toast';
import { Select, type SelectOption } from '../../components/Admin/UI';
import { MediaSelectorModal } from '../../components/Admin/MediaSelectorModal';
import styles from './AdminCourses.module.css';

const statusFilterOptions: SelectOption[] = [
  { value: 'all', label: 'Tất cả trạng thái' },
  { value: 'active', label: 'Đang tuyển sinh' },
  { value: 'paused', label: 'Tạm ngưng' },
  { value: 'draft', label: 'Bản nháp' },
];

const formStatusOptions: SelectOption[] = [
  { value: 'active', label: 'Đang mở tuyển sinh' },
  { value: 'paused', label: 'Tạm ngưng' },
  { value: 'draft', label: 'Bản nháp' },
];

export const AdminCourses: React.FC = () => {
  const { showToast } = useToast();
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [categoriesList, setCategoriesList] = useState<CourseCategoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CourseCategory | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<CourseStatus | 'all'>('all');

  // Course Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [mediaTargetField, setMediaTargetField] = useState<'thumbnail' | 'banner'>('thumbnail');
  const [editingCourse, setEditingCourse] = useState<CourseItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Category Manager Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<CourseCategoryItem | null>(null);
  const [catFormData, setCatFormData] = useState<{
    id: string;
    nameVi: string;
    nameEn: string;
    badgeColor: string;
  }>({
    id: '',
    nameVi: '',
    nameEn: '',
    badgeColor: '#F58220',
  });

  // Course Form State
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
    featuresVi: [],
    featuresEn: [],
    syllabusVi: [],
    syllabusEn: [],
    status: 'active',
  });

  const [activeLangTab, setActiveLangTab] = useState<'vi' | 'en'>('vi');
  const [featuresTextVi, setFeaturesTextVi] = useState('');
  const [featuresTextEn, setFeaturesTextEn] = useState('');
  const [syllabusTextVi, setSyllabusTextVi] = useState('');
  const [syllabusTextEn, setSyllabusTextEn] = useState('');

  const loadData = async () => {
    setIsLoading(true);
    const catsData = await fetchCourseCategoriesFromSupabase();
    setCategoriesList(catsData);
    const data = await fetchCoursesFromSupabase();
    setCourses(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Compute options dynamically from categoriesList
  const categoryFilterOptions: SelectOption[] = useMemo(() => {
    return [
      { value: 'all', label: 'Tất cả chương trình' },
      ...categoriesList.map((cat) => ({
        value: cat.id,
        label: cat.nameVi,
      })),
    ];
  }, [categoriesList]);

  const formCategoryOptions: SelectOption[] = useMemo(() => {
    return categoriesList.map((cat) => ({
      value: cat.id,
      label: cat.nameVi,
    }));
  }, [categoriesList]);

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
    return {
      total: courses.length,
      active: courses.filter((c) => c.status === 'active').length,
      paused: courses.filter((c) => c.status !== 'active').length,
    };
  }, [courses]);

  const handleOpenCreate = () => {
    setEditingCourse(null);
    setActiveLangTab('vi');
    const defaultCat = categoriesList.length > 0 ? categoriesList[0].id : 'kids';
    setFormData({
      courseCode: `ICAM-COURSE-${courses.length + 1}`,
      category: defaultCat,
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
      featuresVi: [],
      featuresEn: [],
      syllabusVi: [],
      syllabusEn: [],
      status: 'active',
    });
    setFeaturesTextVi('');
    setFeaturesTextEn('');
    setSyllabusTextVi('');
    setSyllabusTextEn('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (course: CourseItem) => {
    setEditingCourse(course);
    setActiveLangTab('vi');
    setFormData({
      courseCode: course.courseCode,
      category: course.category,
      titleVi: course.titleVi,
      titleEn: course.titleEn || course.titleVi,
      badgeVi: course.badgeVi,
      badgeEn: course.badgeEn || course.badgeVi,
      targetAgeVi: course.targetAgeVi,
      targetAgeEn: course.targetAgeEn || course.targetAgeVi,
      descriptionVi: course.descriptionVi,
      descriptionEn: course.descriptionEn || course.descriptionVi,
      durationVi: course.durationVi,
      durationEn: course.durationEn || course.durationVi,
      levelVi: course.levelVi,
      levelEn: course.levelEn || course.levelVi,
      targetOutputVi: course.targetOutputVi,
      targetOutputEn: course.targetOutputEn || course.targetOutputVi,
      featuresVi: course.featuresVi,
      featuresEn: course.featuresEn && course.featuresEn.length ? course.featuresEn : course.featuresVi,
      syllabusVi: course.syllabusVi,
      syllabusEn: course.syllabusEn && course.syllabusEn.length ? course.syllabusEn : course.syllabusVi,
      status: course.status,
    });
    setFeaturesTextVi(course.featuresVi.join('\n'));
    setFeaturesTextEn((course.featuresEn && course.featuresEn.length ? course.featuresEn : course.featuresVi).join('\n'));
    setSyllabusTextVi(course.syllabusVi.join('\n'));
    setSyllabusTextEn((course.syllabusEn && course.syllabusEn.length ? course.syllabusEn : course.syllabusVi).join('\n'));
    setIsModalOpen(true);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedFeaturesVi = featuresTextVi
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    const parsedFeaturesEn = featuresTextEn
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    const parsedSyllabusVi = syllabusTextVi
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    const parsedSyllabusEn = syllabusTextEn
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      ...formData,
      titleEn: formData.titleEn || formData.titleVi,
      targetAgeEn: formData.targetAgeEn || formData.targetAgeVi,
      durationEn: formData.durationEn || formData.durationVi,
      targetOutputEn: formData.targetOutputEn || formData.targetOutputVi,
      descriptionEn: formData.descriptionEn || formData.descriptionVi,
      featuresVi: parsedFeaturesVi,
      featuresEn: parsedFeaturesEn.length ? parsedFeaturesEn : parsedFeaturesVi,
      syllabusVi: parsedSyllabusVi,
      syllabusEn: parsedSyllabusEn.length ? parsedSyllabusEn : parsedSyllabusVi,
    };

    if (editingCourse) {
      const res = await updateCourse(editingCourse.id, payload);
      if (res.success) {
        showToast('Cập nhật khóa học thành công! ✓', 'success');
      } else {
        showToast(res.error || 'Cập nhật thất bại', 'error');
      }
    } else {
      const res = await createCourse(payload);
      if (res.success) {
        showToast('Tạo mới khóa học thành công! ✓', 'success');
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

  // Category Manager Handlers
  const handleOpenCreateCategory = () => {
    setEditingCat(null);
    setCatFormData({ id: '', nameVi: '', nameEn: '', badgeColor: '#F58220' });
  };

  const handleOpenEditCategory = (cat: CourseCategoryItem) => {
    setEditingCat(cat);
    setCatFormData({
      id: cat.id,
      nameVi: cat.nameVi,
      nameEn: cat.nameEn || cat.nameVi,
      badgeColor: cat.badgeColor || '#F58220',
    });
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catFormData.nameVi.trim()) {
      showToast('Vui lòng nhập tên loại chương trình', 'error');
      return;
    }

    if (editingCat) {
      const res = await updateCourseCategory(editingCat.id, {
        nameVi: catFormData.nameVi,
        nameEn: catFormData.nameEn,
        badgeColor: catFormData.badgeColor,
      });
      if (res.success) {
        showToast('Cập nhật loại chương trình thành công! ✓', 'success');
        setCategoriesList(getCourseCategories());
        handleOpenCreateCategory();
      } else {
        showToast(res.error || 'Cập nhật thất bại', 'error');
      }
    } else {
      const res = await createCourseCategory({
        id: catFormData.id || undefined,
        nameVi: catFormData.nameVi,
        nameEn: catFormData.nameEn,
        badgeColor: catFormData.badgeColor,
      });
      if (res.success) {
        showToast('Tạo loại chương trình mới thành công! ✓', 'success');
        setCategoriesList(getCourseCategories());
        handleOpenCreateCategory();
      } else {
        showToast(res.error || 'Tạo mới thất bại', 'error');
      }
    }
  };

  const handleDeleteCategory = async (catId: string) => {
    const res = await deleteCourseCategory(catId);
    if (res.success) {
      showToast('Đã xóa loại chương trình thành công', 'success');
      setCategoriesList(getCourseCategories());
    } else {
      showToast(res.error || 'Xóa thất bại', 'error');
    }
  };

  const getCategoryLabel = (catId: string) => {
    const found = categoriesList.find((c) => c.id === catId);
    if (found) return found.nameVi;
    switch (catId) {
      case 'kids': return 'Tiếng Anh Mầm Non / Tiểu Học';
      case 'teens': return 'Tiếng Anh THCS / THPT';
      case 'ielts': return 'Luyện Thi IELTS';
      case 'comm': return 'Tiếng Anh Giao Tiếp';
      case 'online': return 'Khóa Học Online';
      default: return catId;
    }
  };

  const getCategoryBadgeClass = (cat: CourseCategory) => {
    switch (cat) {
      case 'kids':
        return styles.catKids;
      case 'teens':
        return styles.catTeens;
      case 'ielts':
        return styles.catIelts;
      case 'comm':
        return styles.catComm;
      default:
        return styles.catKids;
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
          <button
            className={styles.secondaryBtn}
            onClick={() => {
              handleOpenCreateCategory();
              setIsCategoryModalOpen(true);
            }}
          >
            <FolderPlus size={18} /> Quản Lý Loại Chương Trình
          </button>
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
              <th>Trạng Thái</th>
              <th>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} className={styles.emptyState}>
                  Đang tải dữ liệu khóa học từ hệ thống...
                </td>
              </tr>
            ) : filteredCourses.length === 0 ? (
              <tr>
                <td colSpan={7} className={styles.emptyState}>
                  Không tìm thấy khóa học nào phù hợp.
                </td>
              </tr>
            ) : (
              filteredCourses.map((course) => (
                <tr key={course.id}>
                  <td className={styles.codeCell}>{course.courseCode}</td>
                  <td>
                    <div className={styles.titleCell}>
                      <span className={styles.titleMain}>{course.titleVi}</span>
                      {course.titleEn && <span className={styles.titleSub}>{course.titleEn}</span>}
                    </div>
                  </td>
                  <td>
                    <span className={`${styles.categoryBadge} ${getCategoryBadgeClass(course.category)}`}>
                      {getCategoryLabel(course.category)}
                    </span>
                  </td>
                  <td>{course.targetAgeVi}</td>
                  <td>{course.durationVi}</td>
                  <td>
                    <button
                      className={`${styles.statusBadge} ${
                        course.status === 'active'
                          ? styles.statusActive
                          : course.status === 'paused'
                          ? styles.statusPaused
                          : styles.statusDraft
                      }`}
                      style={{ border: 'none', cursor: 'pointer' }}
                      onClick={() => handleToggleStatus(course)}
                      title="Nhấn để đổi nhanh trạng thái tuyển sinh"
                    >
                      {course.status === 'active' ? (
                        <>
                          <CheckCircle2 size={12} /> Đang mở
                        </>
                      ) : (
                        <>
                          <PauseCircle size={12} /> Tạm ngưng
                        </>
                      )}
                    </button>
                  </td>
                  <td>
                    <div className={styles.actionsCell}>
                      <button
                        className={styles.actionBtn}
                        onClick={() => handleOpenEdit(course)}
                        title="Chỉnh sửa khóa học"
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
                <div className={styles.formGrid} style={{ marginBottom: '1.25rem' }}>
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

                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label>Trạng thái tuyển sinh</label>
                    <Select
                      options={formStatusOptions}
                      value={formData.status}
                      onChange={(val) => setFormData({ ...formData, status: val as CourseStatus })}
                      fullWidth
                    />
                  </div>

                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label>Ảnh Khóa Học / Thumbnail</label>
                    <div className={styles.imagePickerWrapper}>
                      <div className={styles.mediaPickerGroup}>
                        <input
                          type="text"
                          className={styles.formInput}
                          placeholder="Dán URL ảnh hoặc chọn từ thư viện..."
                          value={formData.thumbnailUrl || ''}
                          onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                          style={{ flex: 1 }}
                        />
                        <button
                          type="button"
                          className={styles.selectMediaBtn}
                          onClick={() => {
                            setMediaTargetField('thumbnail');
                            setIsMediaModalOpen(true);
                          }}
                        >
                          <FolderTree size={16} />
                          <span>Thư Viện Hệ Thống</span>
                        </button>
                      </div>
                      {formData.thumbnailUrl && (
                        <div className={styles.imagePreviewBox}>
                          <img src={formData.thumbnailUrl} alt="Preview" className={styles.imagePreviewImg} />
                          <div className={styles.imagePreviewInfo} style={{ flex: 1 }}>
                            <strong>Xem trước ảnh khóa học</strong>
                            <div style={{ color: '#94a3b8', fontSize: '0.82rem', marginTop: '2px' }}>
                              {formData.thumbnailUrl.startsWith('data:image/')
                                ? `📷 Tệp ảnh ${formData.thumbnailUrl.split(';')[0].replace('data:image/', '').toUpperCase()} từ Thư viện Media`
                                : formData.thumbnailUrl.length > 55
                                ? `${formData.thumbnailUrl.substring(0, 52)}...`
                                : formData.thumbnailUrl}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, thumbnailUrl: '' })}
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

                {/* BILINGUAL LANGUAGE TABS */}
                <div className={styles.langTabGroup}>
                  <button
                    type="button"
                    className={`${styles.langTab} ${activeLangTab === 'vi' ? styles.langTabActive : ''}`}
                    onClick={() => setActiveLangTab('vi')}
                  >
                    Nội Dung Tiếng Việt
                  </button>
                  <button
                    type="button"
                    className={`${styles.langTab} ${activeLangTab === 'en' ? styles.langTabActive : ''}`}
                    onClick={() => setActiveLangTab('en')}
                  >
                    Nội Dung Tiếng Anh
                  </button>
                </div>

                {activeLangTab === 'vi' ? (
                  <div className={styles.formGrid}>
                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
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
                      <label>Độ tuổi mục tiêu (Tiếng Việt) *</label>
                      <input
                        type="text"
                        required
                        className={styles.formInput}
                        placeholder="Ví dụ: 4 - 6 tuổi..."
                        value={formData.targetAgeVi}
                        onChange={(e) => setFormData({ ...formData, targetAgeVi: e.target.value })}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Thời lượng học (Tiếng Việt)</label>
                      <input
                        type="text"
                        className={styles.formInput}
                        placeholder="Ví dụ: 12 tháng / 3 khóa..."
                        value={formData.durationVi}
                        onChange={(e) => setFormData({ ...formData, durationVi: e.target.value })}
                      />
                    </div>

                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                      <label>Cam kết chuẩn đầu ra (Tiếng Việt) *</label>
                      <input
                        type="text"
                        required
                        className={styles.formInput}
                        placeholder="Ví dụ: Cam kết đạt 12-15 khiên Cambridge / IELTS 6.5+..."
                        value={formData.targetOutputVi}
                        onChange={(e) => setFormData({ ...formData, targetOutputVi: e.target.value })}
                      />
                    </div>

                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                      <label>Mô tả ngắn khóa học (Tiếng Việt)</label>
                      <textarea
                        className={styles.formTextarea}
                        placeholder="Nhập mô tả tổng quan tiếng Việt về khóa học..."
                        value={formData.descriptionVi}
                        onChange={(e) => setFormData({ ...formData, descriptionVi: e.target.value })}
                      />
                    </div>

                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                      <label>Điểm nổi bật khóa học (Tiếng Việt) - Mỗi dòng 1 ý</label>
                      <textarea
                        className={styles.formTextarea}
                        placeholder="Ví dụ:&#10;Phương pháp Phonics chuẩn Mỹ&#10;100% Giáo viên nước ngoài"
                        value={featuresTextVi}
                        onChange={(e) => setFeaturesTextVi(e.target.value)}
                      />
                    </div>

                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                      <label>Khung chương trình 4Ls + LETI (Tiếng Việt) - Mỗi dòng 1 Module</label>
                      <textarea
                        className={styles.formTextarea}
                        placeholder="Ví dụ:&#10;Module 1: Phonics & Alphabet Discovery&#10;Module 2: Family & Colors"
                        value={syllabusTextVi}
                        onChange={(e) => setSyllabusTextVi(e.target.value)}
                      />
                    </div>
                  </div>
                ) : (
                  <div className={styles.formGrid}>
                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
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
                      <label>Độ tuổi mục tiêu (Tiếng Anh)</label>
                      <input
                        type="text"
                        className={styles.formInput}
                        placeholder="Ví dụ: Ages 4 - 6..."
                        value={formData.targetAgeEn}
                        onChange={(e) => setFormData({ ...formData, targetAgeEn: e.target.value })}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Thời lượng học (Tiếng Anh)</label>
                      <input
                        type="text"
                        className={styles.formInput}
                        placeholder="Ví dụ: 12 months / 3 terms..."
                        value={formData.durationEn}
                        onChange={(e) => setFormData({ ...formData, durationEn: e.target.value })}
                      />
                    </div>

                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                      <label>Cam kết chuẩn đầu ra (Tiếng Anh)</label>
                      <input
                        type="text"
                        className={styles.formInput}
                        placeholder="Ví dụ: Guaranteed 12-15 Cambridge Shields / IELTS 6.5+..."
                        value={formData.targetOutputEn}
                        onChange={(e) => setFormData({ ...formData, targetOutputEn: e.target.value })}
                      />
                    </div>

                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                      <label>Mô tả ngắn khóa học (Tiếng Anh)</label>
                      <textarea
                        className={styles.formTextarea}
                        placeholder="Nhập mô tả tổng quan bằng tiếng Anh về khóa học..."
                        value={formData.descriptionEn}
                        onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                      />
                    </div>

                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                      <label>Điểm nổi bật khóa học (Tiếng Anh) - Mỗi dòng 1 ý</label>
                      <textarea
                        className={styles.formTextarea}
                        placeholder="Ví dụ:&#10;US Standard Phonics method&#10;100% Native English Teachers"
                        value={featuresTextEn}
                        onChange={(e) => setFeaturesTextEn(e.target.value)}
                      />
                    </div>

                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                      <label>Khung chương trình 4Ls + LETI (Tiếng Anh) - Mỗi dòng 1 Module</label>
                      <textarea
                        className={styles.formTextarea}
                        placeholder="Ví dụ:&#10;Module 1: Phonics & Alphabet Discovery&#10;Module 2: Family & Colors"
                        value={syllabusTextEn}
                        onChange={(e) => setSyllabusTextEn(e.target.value)}
                      />
                    </div>
                  </div>
                )}
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

      {/* MANAGE COURSE CATEGORIES MODAL */}
      {isCategoryModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsCategoryModalOpen(false)}>
          <div className={styles.modalContent} style={{ maxWidth: '650px' }} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <FolderTree size={20} color="#F58220" /> Quản Lý Loại Chương Trình Đào Tạo
              </h2>
              <button className={styles.closeModalBtn} onClick={() => setIsCategoryModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <div className={styles.modalBody}>
              {/* Form Add / Edit Category */}
              <form onSubmit={handleSaveCategory} style={{ background: 'rgba(0,0,0,0.15)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: '#F58220', fontWeight: 700 }}>
                  {editingCat ? `Sửa Loại Chương Trình: ${editingCat.nameVi}` : '+ Thêm Loại Chương Trình Mới'}
                </h3>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label>Tên Chương Trình (Tiếng Việt) *</label>
                    <input
                      type="text"
                      required
                      placeholder="Tiếng Anh Hè Bứt Phá..."
                      className={styles.formInput}
                      value={catFormData.nameVi}
                      onChange={(e) => setCatFormData({ ...catFormData, nameVi: e.target.value })}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Tên Chương Trình (Tiếng Anh)</label>
                    <input
                      type="text"
                      placeholder="Summer English Booster..."
                      className={styles.formInput}
                      value={catFormData.nameEn}
                      onChange={(e) => setCatFormData({ ...catFormData, nameEn: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                  {editingCat && (
                    <button type="button" className={styles.cancelBtn} onClick={handleOpenCreateCategory}>
                      Hủy Sửa
                    </button>
                  )}
                  <button type="submit" className={styles.saveBtn}>
                    {editingCat ? 'Cập Nhật Danh Mục' : 'Lưu Danh Mục Mới'}
                  </button>
                </div>
              </form>

              {/* Categories Table List */}
              <div style={{ marginTop: '1.5rem' }}>
                <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.95rem', color: '#94a3b8' }}>
                  Danh sách loại chương trình hiện có ({categoriesList.length}):
                </h4>
                <div style={{ maxHeight: '250px', overflowY: 'auto', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', background: '#0d1733' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ background: 'rgba(0,0,0,0.3)', color: '#94a3b8', fontSize: '0.8rem' }}>
                        <th style={{ padding: '0.75rem 1rem' }}>Tên Chương Trình (Tiếng Việt)</th>
                        <th style={{ padding: '0.75rem 1rem' }}>Tên Tiếng Anh</th>
                        <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Thao Tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categoriesList.map((cat) => (
                        <tr key={cat.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                          <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#ffffff' }}>
                            {cat.nameVi}
                          </td>
                          <td style={{ padding: '0.75rem 1rem', color: '#94a3b8' }}>
                            {cat.nameEn || cat.nameVi}
                          </td>
                          <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                              <button
                                className={styles.actionBtn}
                                onClick={() => handleOpenEditCategory(cat)}
                                title="Sửa danh mục này"
                              >
                                <Edit2 size={14} />
                              </button>
                              <button
                                className={`${styles.actionBtn} ${styles.deleteBtn}`}
                                onClick={() => handleDeleteCategory(cat.id)}
                                title="Xóa danh mục này"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button type="button" className={styles.cancelBtn} onClick={() => setIsCategoryModalOpen(false)}>
                Đóng
              </button>
            </div>
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
      {/* MEDIA SELECTOR MODAL */}
      <MediaSelectorModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        onSelect={(assets) => {
          if (assets && assets.length > 0) {
            if (mediaTargetField === 'thumbnail') {
              setFormData({ ...formData, thumbnailUrl: assets[0].public_url });
            } else {
              setFormData({ ...formData, bannerUrl: assets[0].public_url });
            }
          }
          setIsMediaModalOpen(false);
        }}
        allowMultiple={false}
        filterType="image"
        title="Chọn Tài Nguyên Từ Thư Viện Hệ Thống"
      />
    </div>
  );
};
