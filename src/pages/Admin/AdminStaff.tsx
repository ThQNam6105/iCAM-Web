import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  UserCheck,
  Clock,
  Archive,
  Search,
  Plus,
  Edit2,
  Trash2,
  RotateCcw,
  FileText,
  ShieldAlert,
  DollarSign,
  History,
  Lock,
  Upload,
  ExternalLink,
  X,
  AlertTriangle,
} from 'lucide-react';
import { Button, Select } from '../../components/Admin/UI';
import { useToast } from '../../components/Toast/Toast';
import { getAllDepartments, type DepartmentItem } from '../../services/careersService';
import {
  type StaffMember,
  type StaffStatus,
  type EmploymentType,
  type StaffDocument,
  type DocumentType,
  type EmploymentHistoryItem,
  type CompensationItem,
  type StaffAuditLog,
  INITIAL_CAMPUSES,
  fetchStaffFromSupabase,
  createStaffMember,
  updateStaffMember,
  restoreStaffMember,
  deleteStaffMember,
  getAllStaffDocuments,
  uploadStaffDocument,
  generateDocumentSignedUrl,
  deleteStaffDocument,
  getAllEmploymentHistory,
  getAllCompensation,
  getAllAuditLogs,
} from '../../services/staffService';
import styles from './AdminStaff.module.css';

export const AdminStaff: React.FC = () => {
  const { showToast } = useToast();

  // Primary State
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [departmentsList, setDepartmentsList] = useState<DepartmentItem[]>([]);
  const [documentsList, setDocumentsList] = useState<StaffDocument[]>([]);
  const [historyList, setHistoryList] = useState<EmploymentHistoryItem[]>([]);
  const [compensationList, setCompensationList] = useState<CompensationItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<StaffAuditLog[]>([]);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedCampus, setSelectedCampus] = useState('all');
  const [selectedJobType, setSelectedJobType] = useState<EmploymentType | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<StaffStatus | 'all'>('all');

  // RBAC & Current Admin User State
  const [currentUserRole] = useState<'Super Admin' | 'HR Manager' | 'Manager'>('Super Admin');
  const currentUserEmail = 'admin@icancam.edu.vn';

  // Selected Profile Modal State
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [activeProfileTab, setActiveProfileTab] = useState<'basic' | 'documents' | 'history' | 'compensation' | 'audit'>('basic');
  const [isEditMode, setIsEditMode] = useState(false);

  // Form State for Create / Edit
  const [formData, setFormData] = useState({
    fullName: '',
    workEmail: '',
    phone: '',
    departmentId: 'dept_1',
    jobTitle: '',
    employmentType: 'Full-time' as EmploymentType,
    campusIds: ['campus_hm'] as string[],
    joinedDate: new Date().toISOString().split('T')[0],
    probationEndDate: '',
    contractEndDate: '',
    qualification: '',
    status: 'probation' as StaffStatus,
  });

  // Modal Controls
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
  const [isDocUploadOpen, setIsDocUploadOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [pdfSignedUrlModal, setPdfSignedUrlModal] = useState<string | null>(null);
  const [targetRestoreStatus, setTargetRestoreStatus] = useState<'active' | 'probation'>('active');
  const [docUploadType, setDocUploadType] = useState<DocumentType>('contract');
  const [uploadingFile, setUploadingFile] = useState<File | null>(null);

  // Load Data
  const refreshAllData = async () => {
    const data = await fetchStaffFromSupabase();
    setStaffList(data);
    const depts = getAllDepartments();
    setDepartmentsList(depts);
    setDocumentsList(getAllStaffDocuments());
    setHistoryList(getAllEmploymentHistory());
    setCompensationList(getAllCompensation());
    setAuditLogs(getAllAuditLogs());
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  // Compute Dashboard Statistics
  const stats = useMemo(() => {
    const total = staffList.length;
    const active = staffList.filter((s) => s.status === 'active').length;
    const probation = staffList.filter((s) => s.status === 'probation').length;
    const archived = staffList.filter((s) => s.status === 'archived').length;
    const fullTime = staffList.filter((s) => s.employmentType === 'Full-time').length;
    const partTime = staffList.filter((s) => s.employmentType === 'Part-time').length;
    const intern = staffList.filter((s) => s.employmentType === 'Internship').length;

    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const contractExpiringSoon = staffList.filter((s) => {
      if (!s.contractEndDate) return false;
      const end = new Date(s.contractEndDate);
      return end >= now && end <= thirtyDaysFromNow;
    }).length;

    const probationEndingSoon = staffList.filter((s) => {
      if (!s.probationEndDate || s.status !== 'probation') return false;
      const end = new Date(s.probationEndDate);
      return end >= now && end <= thirtyDaysFromNow;
    }).length;

    const incompleteProfiles = staffList.filter((s) => s.profileCompleteness < 100).length;

    return {
      total,
      active,
      probation,
      archived,
      fullTime,
      partTime,
      intern,
      contractExpiringSoon,
      probationEndingSoon,
      incompleteProfiles,
    };
  }, [staffList]);

  // Multi-Criteria Filtered Staff List
  const filteredStaff = useMemo(() => {
    return staffList.filter((staff) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = staff.fullName.toLowerCase().includes(q);
        const matchCode = staff.employeeCode.toLowerCase().includes(q);
        const matchEmail = staff.workEmail.toLowerCase().includes(q);
        const matchPhone = staff.phone.includes(q);
        if (!matchName && !matchCode && !matchEmail && !matchPhone) return false;
      }
      if (selectedDept !== 'all' && staff.departmentId !== selectedDept) return false;
      if (selectedCampus !== 'all' && !staff.campusIds.includes(selectedCampus)) return false;
      if (selectedJobType !== 'all' && staff.employmentType !== selectedJobType) return false;
      if (selectedStatus !== 'all' && staff.status !== selectedStatus) return false;
      return true;
    });
  }, [staffList, searchQuery, selectedDept, selectedCampus, selectedJobType, selectedStatus]);

  // Form Handlers
  const handleOpenCreateModal = () => {
    setFormData({
      fullName: '',
      workEmail: '',
      phone: '',
      departmentId: departmentsList[0]?.id || 'dept_1',
      jobTitle: '',
      employmentType: 'Full-time',
      campusIds: ['campus_hm'],
      joinedDate: new Date().toISOString().split('T')[0],
      probationEndDate: '',
      contractEndDate: '',
      qualification: '',
      status: 'probation',
    });
    setIsCreateModalOpen(true);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const deptObj = departmentsList.find((d: DepartmentItem) => d.id === formData.departmentId);
    const departmentName = deptObj ? deptObj.name : 'Khối Hành Chính & Nhân Sự';

    const res = await createStaffMember(
      {
        ...formData,
        departmentName,
      },
      currentUserEmail
    );

    if (res.success) {
      showToast('Thêm hồ sơ nhân sự mới thành công!', 'success');
      setIsCreateModalOpen(false);
      refreshAllData();
    } else {
      showToast(`Không thể tạo hồ sơ: ${res.error}`, 'error');
    }
  };

  const handleOpenProfileModal = (staff: StaffMember) => {
    setSelectedStaff(staff);
    setActiveProfileTab('basic');
    setIsEditMode(false);
    setFormData({
      fullName: staff.fullName,
      workEmail: staff.workEmail,
      phone: staff.phone,
      departmentId: staff.departmentId,
      jobTitle: staff.jobTitle,
      employmentType: staff.employmentType,
      campusIds: staff.campusIds,
      joinedDate: staff.joinedDate,
      probationEndDate: staff.probationEndDate || '',
      contractEndDate: staff.contractEndDate || '',
      qualification: staff.qualification || '',
      status: staff.status,
    });
  };

  const handleSaveProfileEdit = async () => {
    if (!selectedStaff) return;
    const deptObj = departmentsList.find((d: DepartmentItem) => d.id === formData.departmentId);
    const departmentName = deptObj ? deptObj.name : selectedStaff.departmentName;

    const res = await updateStaffMember(
      selectedStaff.id,
      {
        ...formData,
        departmentName,
      },
      currentUserEmail
    );

    if (res.success && res.data) {
      showToast('Cập nhật hồ sơ nhân sự thành công!', 'success');
      setSelectedStaff(res.data);
      setIsEditMode(false);
      refreshAllData();
    } else {
      showToast(`Lỗi cập nhật: ${res.error}`, 'error');
    }
  };

  const handleArchiveStaff = async (staff: StaffMember) => {
    const res = await updateStaffMember(staff.id, { status: 'archived' }, currentUserEmail);
    if (res.success) {
      showToast(`Đã lưu trữ hồ sơ nhân sự: ${staff.fullName}`, 'success');
      refreshAllData();
    }
  };

  const handleConfirmRestore = async () => {
    if (!selectedStaff) return;
    const res = await restoreStaffMember(selectedStaff.id, targetRestoreStatus, currentUserEmail);
    if (res.success) {
      showToast(`Đã khôi phục hồ sơ nhân sự: ${selectedStaff.fullName}`, 'success');
      setIsRestoreModalOpen(false);
      refreshAllData();
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedStaff) return;
    const res = await deleteStaffMember(selectedStaff.id, currentUserEmail);
    if (res.success) {
      showToast('Đã xóa hồ sơ khỏi hệ thống Supabase thành công!', 'success');
      setIsDeleteModalOpen(false);
      setSelectedStaff(null);
      refreshAllData();
    } else {
      showToast(`Không thể xóa: ${res.error}`, 'error');
    }
  };

  const handleUploadDocumentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaff || !uploadingFile) {
      showToast('Vui lòng chọn tập tin tài liệu PDF hoặc Ảnh!', 'error');
      return;
    }

    const res = await uploadStaffDocument(selectedStaff.id, docUploadType, uploadingFile, currentUserEmail);
    if (res.success) {
      showToast('Tải lên tài liệu bảo mật thành công!', 'success');
      setIsDocUploadOpen(false);
      setUploadingFile(null);
      setDocumentsList(getAllStaffDocuments());
    } else {
      showToast(`Lỗi tải lên tài liệu: ${res.error}`, 'error');
    }
  };

  const handleViewSignedDocument = async (doc: StaffDocument) => {
    const signedUrl = await generateDocumentSignedUrl(doc);
    setPdfSignedUrlModal(signedUrl);
  };

  const handleDeleteDocument = async (docId: string) => {
    await deleteStaffDocument(docId, currentUserEmail);
    showToast('Đã xóa tài liệu khỏi hệ thống', 'success');
    setDocumentsList(getAllStaffDocuments());
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Quản lý nhân sự</h1>
          <p className={styles.pageSubtitle}>
            Hệ thống quản lý hồ sơ điện tử, hợp đồng bảo mật & theo dõi nhân sự iCANCAM
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={<Plus size={18} />}
          onClick={handleOpenCreateModal}
        >
          Thêm hồ sơ nhân sự
        </Button>
      </div>

      {/* Dashboard Analytics Stat Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div>
            <div className={styles.statVal}>{stats.total}</div>
            <div className={styles.statLabel}>Tổng số nhân sự</div>
          </div>
          <Users size={28} color="#3b82f6" />
        </div>

        <div className={styles.statCard}>
          <div>
            <div className={styles.statVal}>{stats.active}</div>
            <div className={styles.statLabel}>Chính thức</div>
          </div>
          <UserCheck size={28} color="#22c55e" />
        </div>

        <div className={styles.statCard}>
          <div>
            <div className={styles.statVal}>{stats.probation}</div>
            <div className={styles.statLabel}>Đang thử việc</div>
          </div>
          <Clock size={28} color="#eab308" />
        </div>

        <div className={styles.statCard}>
          <div>
            <div className={styles.statVal}>{stats.archived}</div>
            <div className={styles.statLabel}>Đã lưu trữ / Nghỉ việc</div>
          </div>
          <Archive size={28} color="#94a3b8" />
        </div>
      </div>

      {/* Actionable Alerts Bar */}
      {(stats.contractExpiringSoon > 0 || stats.probationEndingSoon > 0 || stats.incompleteProfiles > 0) && (
        <div className={styles.alertsBar}>
          {stats.contractExpiringSoon > 0 && (
            <div
              className={styles.alertItem}
              onClick={() => {
                setSelectedStatus('active');
                showToast(`Đang hiển thị danh sách nhân sự chính thức`, 'info');
              }}
            >
              <AlertTriangle size={16} />
              <span>{stats.contractExpiringSoon} hợp đồng lao động sắp hết hạn (30 ngày)</span>
            </div>
          )}

          {stats.probationEndingSoon > 0 && (
            <div
              className={styles.alertItem}
              onClick={() => {
                setSelectedStatus('probation');
                showToast(`Đang lọc nhân sự thử việc`, 'info');
              }}
            >
              <Clock size={16} />
              <span>{stats.probationEndingSoon} nhân sự sắp hết hạn thử việc</span>
            </div>
          )}

          {stats.incompleteProfiles > 0 && (
            <div className={styles.alertItem} style={{ borderColor: 'rgba(59, 130, 246, 0.3)', color: '#60a5fa', background: 'rgba(59, 130, 246, 0.1)' }}>
              <FileText size={16} />
              <span>{stats.incompleteProfiles} hồ sơ cần hoàn thiện bổ sung thông tin</span>
            </div>
          )}
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className={styles.filterCard}>
        <div className={styles.searchBox}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Tìm theo Mã NV, Họ tên, Email, SĐT..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <Select
          options={[
            { value: 'all', label: 'Tất cả phòng ban' },
            ...departmentsList.map((d: DepartmentItem) => ({ value: d.id, label: d.name })),
          ]}
          value={selectedDept}
          onChange={setSelectedDept}
          triggerStyle={{ minWidth: '190px' }}
        />

        <Select
          options={[
            { value: 'all', label: 'Tất cả cơ sở' },
            ...INITIAL_CAMPUSES.map((c) => ({ value: c.id, label: c.name })),
          ]}
          value={selectedCampus}
          onChange={setSelectedCampus}
          triggerStyle={{ minWidth: '170px' }}
        />

        <Select
          options={[
            { value: 'all', label: 'Tất cả loại hình' },
            { value: 'Full-time', label: 'Full-time' },
            { value: 'Part-time', label: 'Part-time' },
            { value: 'Internship', label: 'Internship' },
          ]}
          value={selectedJobType}
          onChange={(val: string) => setSelectedJobType(val as EmploymentType | 'all')}
          triggerStyle={{ minWidth: '160px' }}
        />

        <Select
          options={[
            { value: 'all', label: 'Tất cả trạng thái' },
            { value: 'active', label: 'Chính thức' },
            { value: 'probation', label: 'Thử việc' },
            { value: 'archived', label: 'Lưu trữ / Nghỉ việc' },
          ]}
          value={selectedStatus}
          onChange={(val: string) => setSelectedStatus(val as StaffStatus | 'all')}
          triggerStyle={{ minWidth: '180px' }}
        />
      </div>

      {/* Staff Directory Table */}
      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nhân sự</th>
              <th>Chức danh & Phòng ban</th>
              <th>Phân công Cơ sở</th>
              <th>Loại hình</th>
              <th>Trạng thái</th>
              <th>Hoàn thiện</th>
              <th>Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {filteredStaff.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                  Không tìm thấy hồ sơ nhân sự nào phù hợp với bộ lọc.
                </td>
              </tr>
            ) : (
              filteredStaff.map((staff) => (
                <tr key={staff.id}>
                  <td>
                    <div className={styles.staffAvatarCell}>
                      <img
                        src={staff.avatarUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200'}
                        alt={staff.fullName}
                        className={styles.staffAvatarImg}
                      />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span className={styles.staffNameText}>{staff.fullName}</span>
                          <span className={styles.staffCodeTag}>{staff.employeeCode}</span>
                        </div>
                        <span className={styles.staffMetaText}>
                          {staff.phone} • {staff.workEmail}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <div>
                      <div className={styles.staffNameText} style={{ fontSize: '0.88rem' }}>{staff.jobTitle}</div>
                      <span className={styles.staffMetaText}>{staff.departmentName}</span>
                    </div>
                  </td>

                  <td>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                      {staff.campusIds.map((cid) => {
                        const campusObj = INITIAL_CAMPUSES.find((c) => c.id === cid);
                        return (
                          <span key={cid} className={styles.campusBadge}>
                            {campusObj ? campusObj.name : cid}
                          </span>
                        );
                      })}
                    </div>
                  </td>

                  <td>
                    <span style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>{staff.employmentType}</span>
                  </td>

                  <td>
                    <span
                      className={
                        staff.status === 'active'
                          ? styles.statusActive
                          : staff.status === 'probation'
                          ? styles.statusProbation
                          : styles.statusArchived
                      }
                    >
                      {staff.status === 'active' ? 'Chính thức' : staff.status === 'probation' ? 'Thử việc' : 'Đã lưu trữ'}
                    </span>
                  </td>

                  <td>
                    <div className={styles.completenessWrapper}>
                      <div className={styles.completenessBar}>
                        <div className={styles.completenessFill} style={{ width: `${staff.profileCompleteness}%` }} />
                      </div>
                      <span className={styles.completenessText}>{staff.profileCompleteness}% hoàn thiện</span>
                    </div>
                  </td>

                  <td>
                    <div className={styles.actionsCell}>
                      <button
                        type="button"
                        onClick={() => handleOpenProfileModal(staff)}
                        className={styles.actionBtn}
                        title="Xem chi tiết hồ sơ"
                      >
                        <FileText size={14} /> Hồ sơ
                      </button>

                      {staff.status === 'archived' ? (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedStaff(staff);
                            setIsRestoreModalOpen(true);
                          }}
                          className={`${styles.actionBtn} ${styles.actionRestore}`}
                          title="Khôi phục hồ sơ"
                        >
                          <RotateCcw size={14} /> Khôi phục
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleArchiveStaff(staff)}
                          className={styles.actionBtn}
                          title="Lưu trữ hồ sơ"
                        >
                          <Archive size={14} /> Lưu trữ
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* CREATE STAFF MODAL */}
      {isCreateModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.profileModal} style={{ maxWidth: '650px' }}>
            <div className={styles.modalHeader}>
              <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#fff' }}>Thêm Hồ Sơ Nhân Sự Mới</h2>
              <button onClick={() => setIsCreateModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit}>
              <div className={styles.modalBody}>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label>Họ và tên *</label>
                    <input
                      type="text"
                      required
                      placeholder="Nhập họ và tên..."
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className={styles.formInput}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Email công việc *</label>
                    <input
                      type="email"
                      required
                      placeholder="email@icancam.edu.vn"
                      value={formData.workEmail}
                      onChange={(e) => setFormData({ ...formData, workEmail: e.target.value })}
                      className={styles.formInput}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Số điện thoại *</label>
                    <input
                      type="text"
                      required
                      placeholder="0909..."
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={styles.formInput}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Phòng ban / Khối *</label>
                    <select
                      value={formData.departmentId}
                      onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                      className={styles.formInput}
                    >
                      {departmentsList.map((d: DepartmentItem) => (
                        <option key={d.id} value={d.id} style={{ background: '#0f1c3f' }}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Chức danh công việc *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: Chuyên viên Tư Vấn..."
                      value={formData.jobTitle}
                      onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                      className={styles.formInput}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Loại hình làm việc *</label>
                    <select
                      value={formData.employmentType}
                      onChange={(e) => setFormData({ ...formData, employmentType: e.target.value as EmploymentType })}
                      className={styles.formInput}
                    >
                      <option value="Full-time" style={{ background: '#0f1c3f' }}>Full-time</option>
                      <option value="Part-time" style={{ background: '#0f1c3f' }}>Part-time</option>
                      <option value="Internship" style={{ background: '#0f1c3f' }}>Internship</option>
                    </select>
                  </div>

                  <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                    <label>Phân công Cơ sở *</label>
                    <div className={styles.campusCheckboxes}>
                      {INITIAL_CAMPUSES.map((c) => (
                        <label key={c.id} className={styles.checkboxLabel}>
                          <input
                            type="checkbox"
                            checked={formData.campusIds.includes(c.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData({ ...formData, campusIds: [...formData.campusIds, c.id] });
                              } else {
                                setFormData({
                                  ...formData,
                                  campusIds: formData.campusIds.filter((id) => id !== c.id),
                                });
                              }
                            }}
                          />
                          <span>{c.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Ngày bắt đầu làm việc *</label>
                    <input
                      type="date"
                      required
                      value={formData.joinedDate}
                      onChange={(e) => setFormData({ ...formData, joinedDate: e.target.value })}
                      className={styles.formInput}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Hạn kết thúc thử việc</label>
                    <input
                      type="date"
                      value={formData.probationEndDate}
                      onChange={(e) => setFormData({ ...formData, probationEndDate: e.target.value })}
                      className={styles.formInput}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.modalFooter}>
                <Button variant="secondary" onClick={() => setIsCreateModalOpen(false)}>Hủy</Button>
                <Button variant="primary" type="submit">Lưu hồ sơ mới</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* STAFF PROFILE TABBED MODAL */}
      {selectedStaff && (
        <div className={styles.modalOverlay}>
          <div className={styles.profileModal}>
            <div className={styles.modalHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <img
                  src={selectedStaff.avatarUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200'}
                  alt={selectedStaff.fullName}
                  style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid #F58220' }}
                />
                <div>
                  <h2 style={{ margin: 0, fontSize: '1.1rem', color: '#fff' }}>{selectedStaff.fullName}</h2>
                  <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                    {selectedStaff.employeeCode} • {selectedStaff.jobTitle}
                  </span>
                </div>
              </div>

              <button onClick={() => setSelectedStaff(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className={styles.modalNavTabs}>
              <button
                type="button"
                className={`${styles.tabBtn} ${activeProfileTab === 'basic' ? styles.tabBtnActive : ''}`}
                onClick={() => setActiveProfileTab('basic')}
              >
                <Users size={16} /> Thông tin cá nhân & Công tác
              </button>

              <button
                type="button"
                className={`${styles.tabBtn} ${activeProfileTab === 'documents' ? styles.tabBtnActive : ''}`}
                onClick={() => setActiveProfileTab('documents')}
              >
                <FileText size={16} /> Hồ sơ & Tài liệu ({documentsList.filter((d) => d.staffId === selectedStaff.id).length})
              </button>

              <button
                type="button"
                className={`${styles.tabBtn} ${activeProfileTab === 'history' ? styles.tabBtnActive : ''}`}
                onClick={() => setActiveProfileTab('history')}
              >
                <History size={16} /> Lịch sử công tác
              </button>

              <button
                type="button"
                className={`${styles.tabBtn} ${activeProfileTab === 'compensation' ? styles.tabBtnActive : ''}`}
                onClick={() => setActiveProfileTab('compensation')}
              >
                <DollarSign size={16} /> Lương & Phụ cấp (Bảo mật)
              </button>

              <button
                type="button"
                className={`${styles.tabBtn} ${activeProfileTab === 'audit' ? styles.tabBtnActive : ''}`}
                onClick={() => setActiveProfileTab('audit')}
              >
                <ShieldAlert size={16} /> Nhật ký thay đổi
              </button>
            </div>

            <div className={styles.modalBody}>
              {/* TAB 1: BASIC INFORMATION */}
              {activeProfileTab === 'basic' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, fontSize: '1rem', color: '#F58220' }}>Thông tin hồ sơ</h3>
                    {!isEditMode ? (
                      <Button size="sm" variant="secondary" icon={<Edit2 size={14} />} onClick={() => setIsEditMode(true)}>
                        Chỉnh sửa
                      </Button>
                    ) : (
                      <Button size="sm" variant="primary" onClick={handleSaveProfileEdit}>
                        Lưu thay đổi
                      </Button>
                    )}
                  </div>

                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label>Mã nhân viên</label>
                      <input type="text" disabled value={selectedStaff.employeeCode} className={styles.formInput} style={{ opacity: 0.6 }} />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Họ và tên</label>
                      <input
                        type="text"
                        disabled={!isEditMode}
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className={styles.formInput}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Email công việc</label>
                      <input
                        type="email"
                        disabled={!isEditMode}
                        value={formData.workEmail}
                        onChange={(e) => setFormData({ ...formData, workEmail: e.target.value })}
                        className={styles.formInput}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Số điện thoại</label>
                      <input
                        type="text"
                        disabled={!isEditMode}
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className={styles.formInput}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Chức danh công việc</label>
                      <input
                        type="text"
                        disabled={!isEditMode}
                        value={formData.jobTitle}
                        onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                        className={styles.formInput}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Học vấn & Trình độ</label>
                      <input
                        type="text"
                        disabled={!isEditMode}
                        placeholder="Nhập bằng cấp, chứng chỉ..."
                        value={formData.qualification}
                        onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                        className={styles.formInput}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: PRIVATE DOCUMENTS */}
              {activeProfileTab === 'documents' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1rem', color: '#F58220' }}>Tài liệu nhân sự bảo mật</h3>
                      <p style={{ margin: '0.2rem 0 0', fontSize: '0.78rem', color: '#94a3b8' }}>
                        Lưu trữ trên Supabase Private Bucket. Xem qua Signed URL có thời hạn.
                      </p>
                    </div>
                    <Button size="sm" variant="primary" icon={<Upload size={14} />} onClick={() => setIsDocUploadOpen(true)}>
                      Tải lên tài liệu PDF
                    </Button>
                  </div>

                  {documentsList.filter((d) => d.staffId === selectedStaff.id).length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                      Chưa có tài liệu đính kèm nào cho nhân sự này.
                    </div>
                  ) : (
                    documentsList
                      .filter((d) => d.staffId === selectedStaff.id)
                      .map((doc) => (
                        <div key={doc.id} className={styles.docItemCard}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <FileText size={22} color="#F58220" />
                            <div>
                              <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.88rem' }}>{doc.fileName}</div>
                              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                                {doc.documentType.toUpperCase()} • {doc.fileSize} • {new Date(doc.uploadedAt).toLocaleDateString('vi-VN')}
                              </span>
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <Button size="sm" variant="secondary" icon={<ExternalLink size={13} />} onClick={() => handleViewSignedDocument(doc)}>
                              Xem tài liệu
                            </Button>
                            <Button size="sm" variant="secondary" style={{ color: '#f87171' }} onClick={() => handleDeleteDocument(doc.id)}>
                              Xóa
                            </Button>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              )}

              {/* TAB 3: EMPLOYMENT HISTORY */}
              {activeProfileTab === 'history' && (
                <div>
                  <h3 style={{ margin: '0 0 1rem', fontSize: '1rem', color: '#F58220' }}>Lịch sử công tác & Thăng tiến</h3>
                  {historyList.filter((h) => h.staffId === selectedStaff.id).length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                      Chưa có ghi nhận quá trình công tác nào.
                    </div>
                  ) : (
                    historyList
                      .filter((h) => h.staffId === selectedStaff.id)
                      .map((hist) => (
                        <div key={hist.id} className={styles.timelineItem}>
                          <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem' }}>{hist.jobTitle}</div>
                          <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                            {hist.departmentName} • {hist.campusSummary}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#F58220', marginTop: '0.2rem' }}>
                            Thời gian: {hist.startDate} {hist.endDate ? `đến ${hist.endDate}` : '(Hiện tại)'} — LÝ DO: {hist.changeReason}
                          </div>
                        </div>
                      ))
                  )}
                </div>
              )}

              {/* TAB 4: COMPENSATION (PERMISSIONS GATED) */}
              {activeProfileTab === 'compensation' && (
                <div>
                  {currentUserRole !== 'Super Admin' && currentUserRole !== 'HR Manager' ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#f87171' }}>
                      <Lock size={32} style={{ marginBottom: '0.5rem' }} />
                      <div>Bạn không có quyền xem thông tin lương & phụ cấp của nhân sự này.</div>
                    </div>
                  ) : (
                    <div>
                      <h3 style={{ margin: '0 0 1rem', fontSize: '1rem', color: '#F58220' }}>Thông tin Lương & Phụ cấp (Bảo mật HR)</h3>
                      {compensationList.filter((c) => c.staffId === selectedStaff.id).length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                          Chưa có thiết lập mức lương cho nhân sự này.
                        </div>
                      ) : (
                        compensationList
                          .filter((c) => c.staffId === selectedStaff.id)
                          .map((comp) => (
                            <div key={comp.id} className={styles.docItemCard} style={{ borderColor: 'rgba(34, 197, 94, 0.3)' }}>
                              <div>
                                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#4ade80' }}>
                                  Lương cứng: {comp.baseSalary.toLocaleString('vi-VN')} VNĐ / tháng
                                </div>
                                <div style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '0.25rem' }}>
                                  Phụ cấp trách nhiệm: {comp.allowance.toLocaleString('vi-VN')} VNĐ
                                </div>
                                {comp.notes && <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.2rem' }}>{comp.notes}</div>}
                              </div>
                              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Áp dụng từ: {comp.effectiveDate}</span>
                            </div>
                          ))
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: AUDIT TRAIL LOGS */}
              {activeProfileTab === 'audit' && (
                <div>
                  <h3 style={{ margin: '0 0 1rem', fontSize: '1rem', color: '#F58220' }}>Nhật ký thay đổi hồ sơ (Server Audit Trail)</h3>
                  {auditLogs.filter((a) => a.staffId === selectedStaff.id).length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                      Chưa có ghi nhận nhật ký thay đổi nào.
                    </div>
                  ) : (
                    auditLogs
                      .filter((a) => a.staffId === selectedStaff.id)
                      .map((log) => (
                        <div key={log.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '0.75rem', marginBottom: '0.5rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#F58220', fontWeight: 700 }}>
                            <span>{log.action}</span>
                            <span style={{ color: '#94a3b8', fontWeight: 400 }}>{new Date(log.timestamp).toLocaleString('vi-VN')}</span>
                          </div>
                          <div style={{ fontSize: '0.78rem', color: '#cbd5e1', marginTop: '0.2rem' }}>Thực hiện bởi: {log.actorEmail}</div>
                        </div>
                      ))
                  )}
                </div>
              )}
            </div>

            <div className={styles.modalFooter}>
              {selectedStaff.status === 'archived' && (
                <Button variant="secondary" style={{ color: '#60a5fa' }} icon={<RotateCcw size={14} />} onClick={() => setIsRestoreModalOpen(true)}>
                  Khôi phục hồ sơ
                </Button>
              )}

              {currentUserRole === 'Super Admin' && (
                <Button variant="secondary" style={{ color: '#f87171' }} icon={<Trash2 size={14} />} onClick={() => setIsDeleteModalOpen(true)}>
                  Xóa vĩnh viễn
                </Button>
              )}

              <Button variant="primary" onClick={() => setSelectedStaff(null)}>Đóng</Button>
            </div>
          </div>
        </div>
      )}

      {/* RESTORE STAFF MODAL */}
      {isRestoreModalOpen && selectedStaff && (
        <div className={styles.modalOverlay}>
          <div className={styles.profileModal} style={{ maxWidth: '450px' }}>
            <div className={styles.modalHeader}>
              <h3 style={{ margin: 0, color: '#fff', fontSize: '1.1rem' }}>Khôi phục hồ sơ nhân sự</h3>
              <button onClick={() => setIsRestoreModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8' }}>
                <X size={18} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <p style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>
                Khôi phục hồ sơ nhân sự <strong>{selectedStaff.fullName}</strong> trở lại danh sách hoạt động. Vui lòng chọn trạng thái khôi phục:
              </p>

              <div className={styles.formGroup}>
                <label>Trạng thái sau khi khôi phục *</label>
                <select
                  value={targetRestoreStatus}
                  onChange={(e) => setTargetRestoreStatus(e.target.value as 'active' | 'probation')}
                  className={styles.formInput}
                >
                  <option value="active" style={{ background: '#0f1c3f' }}>Chính thức (Active)</option>
                  <option value="probation" style={{ background: '#0f1c3f' }}>Thử việc (Probation)</option>
                </select>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <Button variant="secondary" onClick={() => setIsRestoreModalOpen(false)}>Hủy</Button>
              <Button variant="primary" onClick={handleConfirmRestore}>Xác nhận khôi phục</Button>
            </div>
          </div>
        </div>
      )}

      {/* DOCUMENT UPLOAD MODAL */}
      {isDocUploadOpen && selectedStaff && (
        <div className={styles.modalOverlay}>
          <div className={styles.profileModal} style={{ maxWidth: '500px' }}>
            <div className={styles.modalHeader}>
              <h3 style={{ margin: 0, color: '#fff', fontSize: '1.1rem' }}>Tải Lên Tài Liệu Bảo Mật</h3>
              <button onClick={() => setIsDocUploadOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUploadDocumentSubmit}>
              <div className={styles.modalBody}>
                <div className={styles.formGroup}>
                  <label>Loại tài liệu *</label>
                  <select
                    value={docUploadType}
                    onChange={(e) => setDocUploadType(e.target.value as DocumentType)}
                    className={styles.formInput}
                  >
                    <option value="contract" style={{ background: '#0f1c3f' }}>Hợp đồng lao động (Contract)</option>
                    <option value="cv" style={{ background: '#0f1c3f' }}>Sơ yếu lý lịch (CV)</option>
                    <option value="degree" style={{ background: '#0f1c3f' }}>Bằng cấp học vấn (Degree)</option>
                    <option value="certificate" style={{ background: '#0f1c3f' }}>Chứng chỉ chuyên môn (Certificate)</option>
                    <option value="identity" style={{ background: '#0f1c3f' }}>Giấy tờ định danh (Identity)</option>
                    <option value="other" style={{ background: '#0f1c3f' }}>Tài liệu khác</option>
                  </select>
                </div>

                <div className={styles.formGroup} style={{ marginTop: '1rem' }}>
                  <label>Chọn tệp đính kèm (PDF / Image) *</label>
                  <input
                    type="file"
                    required
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        setUploadingFile(e.target.files[0]);
                      }
                    }}
                    className={styles.formInput}
                  />
                </div>
              </div>

              <div className={styles.modalFooter}>
                <Button variant="secondary" onClick={() => setIsDocUploadOpen(false)}>Hủy</Button>
                <Button variant="primary" type="submit">Tải lên bảo mật</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE PERMANENT MODAL */}
      {isDeleteModalOpen && selectedStaff && (
        <div className={styles.modalOverlay}>
          <div className={styles.profileModal} style={{ maxWidth: '450px', border: '1px solid rgba(248, 113, 113, 0.4)' }}>
            <div className={styles.modalHeader}>
              <h3 style={{ margin: 0, color: '#f87171', fontSize: '1.1rem' }}>Xác nhận Xóa Vĩnh Viễn</h3>
              <button onClick={() => setIsDeleteModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8' }}>
                <X size={18} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <p style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>
                CẢNH BÁO BẢO MẬT: Bạn có chắc chắn muốn xóa vĩnh viễn hồ sơ nhân sự <strong>{selectedStaff.fullName}</strong> khỏi cơ sở dữ liệu Supabase không? Thao tác này sẽ ghi nhận vào Server Audit Trail.
              </p>
            </div>

            <div className={styles.modalFooter}>
              <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>Hủy</Button>
              <Button variant="primary" style={{ background: '#ef4444' }} onClick={handleConfirmDelete}>Xóa vĩnh viễn</Button>
            </div>
          </div>
        </div>
      )}

      {/* SIGNED URL PDF VIEWER MODAL */}
      {pdfSignedUrlModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.profileModal} style={{ maxWidth: '900px', height: '85vh' }}>
            <div className={styles.modalHeader}>
              <h3 style={{ margin: 0, color: '#fff', fontSize: '1.1rem' }}>Xem Tài Liệu Bảo Mật (Supabase Signed URL)</h3>
              <button onClick={() => setPdfSignedUrlModal(null)} style={{ background: 'none', border: 'none', color: '#94a3b8' }}>
                <X size={20} />
              </button>
            </div>

            <div className={styles.modalBody} style={{ padding: 0 }}>
              <iframe
                src={pdfSignedUrlModal}
                title="Tài liệu bảo mật"
                style={{ width: '100%', height: '100%', border: 'none' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
