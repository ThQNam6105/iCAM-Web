import React, { useState, useEffect, useMemo } from 'react';
import {
  Briefcase,
  CheckCircle,
  Clock,
  Plus,
  Search,
  Edit2,
  Trash2,
  Users,
  FolderTree,
  Globe,
  FileText,
  Download,
  RotateCcw,
  Archive,
  UserCheck,
  UserX,
  X,
} from 'lucide-react';
import {
  type CareersItem,
  type JobStatus,
  type DepartmentItem,
  type JobApplication,
  type ApplicationStatus,
  type JobType,
  getAllCareers,
  fetchCareersFromSupabase,
  createCareer,
  updateCareer,
  deleteCareer,
  getAllDepartments,
  getAllApplications,
  fetchApplicationsFromSupabase,
  updateApplicationStatus,
  deleteApplication,
} from '../../services/careersService';
import { JobEditModal } from '../../components/Admin/JobEditModal';
import { DepartmentManagerModal } from '../../components/Admin/DepartmentManagerModal';
import { ConfirmModal } from '../../components/ConfirmModal/ConfirmModal';
import { useToast } from '../../components/Toast/Toast';
import { Button, Select } from '../../components/Admin/UI';
import styles from './AdminCareers.module.css';

export const AdminCareers: React.FC = () => {
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'jobs' | 'applications'>('jobs');
  const [allJobs, setAllJobs] = useState<CareersItem[]>([]);
  const [applicationsList, setApplicationsList] = useState<JobApplication[]>([]);
  const [departmentsList, setDepartmentsList] = useState<DepartmentItem[]>([]);

  // Job Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<JobStatus | 'all'>('all');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');

  // Application Filters
  const [appSearchQuery, setAppSearchQuery] = useState('');
  const [selectedAppDepartment, setSelectedAppDepartment] = useState<string>('all');
  const [selectedAppJobType, setSelectedAppJobType] = useState<JobType | 'all'>('all');
  const [selectedAppStatus, setSelectedAppStatus] = useState<ApplicationStatus | 'all'>('all');

  // Modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<CareersItem | null>(null);
  const [deleteCandidateId, setDeleteCandidateId] = useState<string | null>(null);
  const [deleteAppId, setDeleteAppId] = useState<string | null>(null);
  const [pdfPreviewApp, setPdfPreviewApp] = useState<JobApplication | null>(null);

  const loadData = () => {
    setAllJobs(getAllCareers());
    setDepartmentsList(getAllDepartments());
    setApplicationsList(getAllApplications());
  };

  useEffect(() => {
    loadData();
    fetchCareersFromSupabase().then(() => loadData());
    fetchApplicationsFromSupabase().then(() => loadData());
  }, []);

  const filteredJobs = useMemo(() => {
    return allJobs.filter((job) => {
      const matchSearch =
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (job.titleEn && job.titleEn.toLowerCase().includes(searchQuery.toLowerCase())) ||
        job.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = selectedStatus === 'all' || job.status === selectedStatus;
      const matchDept = selectedDepartment === 'all' || job.department === selectedDepartment;
      return matchSearch && matchStatus && matchDept;
    });
  }, [allJobs, searchQuery, selectedStatus, selectedDepartment]);

  const filteredApplications = useMemo(() => {
    return applicationsList.filter((app) => {
      const matchSearch =
        app.fullName.toLowerCase().includes(appSearchQuery.toLowerCase()) ||
        app.email.toLowerCase().includes(appSearchQuery.toLowerCase()) ||
        app.phone.includes(appSearchQuery) ||
        app.jobTitle.toLowerCase().includes(appSearchQuery.toLowerCase());
      const matchDept = selectedAppDepartment === 'all' || app.department === selectedAppDepartment;
      const matchType = selectedAppJobType === 'all' || app.jobType === selectedAppJobType;
      const matchStatus = selectedAppStatus === 'all' || app.status === selectedAppStatus;
      return matchSearch && matchDept && matchType && matchStatus;
    });
  }, [applicationsList, appSearchQuery, selectedAppDepartment, selectedAppJobType, selectedAppStatus]);

  const stats = useMemo(() => {
    const total = allJobs.length;
    const openCount = allJobs.filter((j) => j.status === 'open').length;
    const closedCount = allJobs.filter((j) => j.status === 'closed').length;
    const totalApps = applicationsList.length;
    const pendingApps = applicationsList.filter((a) => a.status === 'pending').length;
    const acceptedApps = applicationsList.filter((a) => a.status === 'accepted').length;
    const rejectedApps = applicationsList.filter((a) => a.status === 'rejected').length;
    return { total, openCount, closedCount, totalApps, pendingApps, acceptedApps, rejectedApps };
  }, [allJobs, applicationsList]);

  const handleSaveJob = async (data: Partial<CareersItem>): Promise<boolean> => {
    if (editingJob) {
      const res = await updateCareer(editingJob.id, data);
      if (!res.success) {
        showToast(`⚠️ Không thể lưu Supabase Database: ${res.error || 'Lỗi kết nối'}`, 'error');
        return false;
      }
      showToast('Cập nhật vị trí tuyển dụng thành công lên Supabase Database! ✓', 'success');
    } else {
      const res = await createCareer(
        data as Omit<CareersItem, 'id' | 'createdAt' | 'updatedAt' | 'applicationsCount'>
      );
      if (!res.success) {
        showToast(`⚠️ Không thể tạo vị trí tuyển dụng: ${res.error || 'Lỗi kết nối'}`, 'error');
        return false;
      }
      showToast('Tạo vị trí tuyển dụng mới thành công lên Supabase Database! ✓', 'success');
    }
    loadData();
    return true;
  };

  const handleConfirmDelete = async () => {
    if (deleteCandidateId) {
      const res = await deleteCareer(deleteCandidateId);
      if (!res.success) {
        showToast(`⚠️ Lỗi xóa trên Supabase Database: ${res.error || 'Lỗi kết nối'}`, 'error');
        return;
      }
      showToast('Đã xóa vị trí tuyển dụng thành công!', 'info');
      setDeleteCandidateId(null);
      loadData();
    }
  };

  const handleUpdateAppStatus = async (id: string, newStatus: ApplicationStatus) => {
    const res = await updateApplicationStatus(id, newStatus);
    if (res.success) {
      const msg =
        newStatus === 'accepted'
          ? 'Đã duyệt & nhận ứng viên vào danh sách thành công! ✓'
          : newStatus === 'rejected'
          ? 'Đã chuyển ứng viên vào mục Từ chối (Tự động xóa vĩnh viễn sau 3 ngày).'
          : newStatus === 'archived'
          ? 'Đã chuyển ứng viên vào mục Lưu trữ hồ sơ.'
          : 'Đã hoàn tác khôi phục hồ sơ ứng viên trở lại danh sách chờ duyệt! ✓';
      showToast(msg, 'success');
      loadData();
    } else {
      showToast(`⚠️ Không thể cập nhật trạng thái: ${res.error}`, 'error');
    }
  };

  const handleConfirmDeleteApp = async () => {
    if (deleteAppId) {
      const res = await deleteApplication(deleteAppId);
      if (res.success) {
        showToast('Đã xóa hồ sơ ứng viên thành công!', 'info');
        setDeleteAppId(null);
        loadData();
      } else {
        showToast(`⚠️ Lỗi xóa hồ sơ: ${res.error}`, 'error');
      }
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Quản lý tuyển dụng</h1>
          <p className={styles.pageSubtitle}>
            Quản lý vị trí tuyển dụng, tiếp nhận & xét duyệt hồ sơ ứng viên
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Button
            variant="secondary"
            size="md"
            icon={<FolderTree size={17} />}
            onClick={() => setIsDeptModalOpen(true)}
          >
            Quản lý phòng ban
          </Button>

          <Button
            variant="primary"
            size="md"
            icon={<Plus size={18} />}
            onClick={() => {
              setEditingJob(null);
              setIsEditModalOpen(true);
            }}
          >
            Thêm vị trí mới
          </Button>
        </div>
      </div>

      {/* Tab Switcher Navigation */}
      <div className={styles.navTabWrapper}>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === 'jobs' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('jobs')}
        >
          <Briefcase size={18} />
          <span>Vị trí tuyển dụng</span>
          <span className={styles.tabBadge}>{allJobs.length}</span>
        </button>

        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === 'applications' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('applications')}
        >
          <Users size={18} />
          <span>Danh sách ứng viên</span>
          <span className={styles.tabBadge} style={{ background: stats.pendingApps > 0 ? '#ef4444' : undefined }}>
            {applicationsList.length} {stats.pendingApps > 0 && `(${stats.pendingApps} mới)`}
          </span>
        </button>
      </div>

      {/* Stat Cards */}
      <div className={styles.statsGrid}>
        {activeTab === 'jobs' ? (
          <>
            <div className={styles.statCard}>
              <div>
                <div className={styles.statVal}>{stats.total}</div>
                <div className={styles.statLabel}>Tổng vị trí tuyển dụng</div>
              </div>
              <Briefcase size={28} color="#F58220" />
            </div>

            <div className={styles.statCard}>
              <div>
                <div className={styles.statVal}>{stats.openCount}</div>
                <div className={styles.statLabel}>Đang tuyển</div>
              </div>
              <CheckCircle size={28} color="#22c55e" />
            </div>

            <div className={styles.statCard}>
              <div>
                <div className={styles.statVal}>{stats.closedCount}</div>
                <div className={styles.statLabel}>Đã đóng</div>
              </div>
              <Clock size={28} color="#ef4444" />
            </div>

            <div className={styles.statCard}>
              <div>
                <div className={styles.statVal}>{stats.totalApps}</div>
                <div className={styles.statLabel}>Hồ sơ ứng viên</div>
              </div>
              <Users size={28} color="#3b82f6" />
            </div>
          </>
        ) : (
          <>
            <div className={styles.statCard}>
              <div>
                <div className={styles.statVal}>{stats.totalApps}</div>
                <div className={styles.statLabel}>Tổng số hồ sơ</div>
              </div>
              <Users size={28} color="#3b82f6" />
            </div>

            <div className={styles.statCard}>
              <div>
                <div className={styles.statVal}>{stats.pendingApps}</div>
                <div className={styles.statLabel}>Đang chờ duyệt</div>
              </div>
              <Clock size={28} color="#eab308" />
            </div>

            <div className={styles.statCard}>
              <div>
                <div className={styles.statVal}>{stats.acceptedApps}</div>
                <div className={styles.statLabel}>Đã tuyển</div>
              </div>
              <UserCheck size={28} color="#22c55e" />
            </div>

            <div className={styles.statCard}>
              <div>
                <div className={styles.statVal}>{stats.rejectedApps}</div>
                <div className={styles.statLabel}>Từ chối</div>
              </div>
              <UserX size={28} color="#ef4444" />
            </div>
          </>
        )}
      </div>

      {/* VIEW TAB 1: JOB POSTINGS */}
      {activeTab === 'jobs' && (
        <>
          {/* Job Filters */}
          <div className={styles.filterCard}>
            <div className={styles.searchBox}>
              <Search size={16} className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Tìm kiếm vị trí tuyển dụng, địa điểm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>

            <Select
              options={[
                { value: 'all', label: 'Tất cả phòng ban' },
                ...departmentsList.map((d) => ({
                  value: d.name,
                  label: d.nameEn ? `${d.name} (${d.nameEn})` : d.name,
                })),
              ]}
              value={selectedDepartment}
              onChange={setSelectedDepartment}
              triggerStyle={{ minWidth: '220px' }}
            />

            <Select
              options={[
                { value: 'all', label: 'Tất cả trạng thái' },
                { value: 'open', label: 'Đang tuyển' },
                { value: 'closed', label: 'Đã đóng' },
                { value: 'draft', label: 'Bản nháp' },
              ]}
              value={selectedStatus}
              onChange={(val) => setSelectedStatus(val as JobStatus | 'all')}
              triggerStyle={{ minWidth: '170px' }}
            />
          </div>

          {/* Job Table */}
          <div className={styles.tableCard}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Chức danh & địa điểm</th>
                  <th>Phòng ban</th>
                  <th>Mức lương</th>
                  <th>Hạn nộp</th>
                  <th>Trạng thái</th>
                  <th>Hồ sơ</th>
                  <th>Thao tác</th>
                </tr>
              </thead>

              <tbody>
                {filteredJobs.map((job) => {
                  const deptObj = departmentsList.find((d) => d.name === job.department);
                  return (
                    <tr key={job.id}>
                      <td>
                        <div className={styles.jobTitleCell}>
                          <span className={styles.jobTitleText}>
                            {job.title}
                            {job.titleEn && (
                              <span
                                style={{
                                  fontSize: '0.78rem',
                                  color: '#94a3b8',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.25rem',
                                  marginTop: '0.1rem',
                                }}
                              >
                                <Globe size={12} /> {job.titleEn}
                              </span>
                            )}
                          </span>
                          <span className={styles.jobMetaText}>
                            {job.type} • {job.location}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span
                          style={{
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            padding: '0.25rem 0.65rem',
                            borderRadius: '999px',
                            background: `${deptObj?.color || '#3b82f6'}20`,
                            color: deptObj?.color || '#3b82f6',
                            border: `1px solid ${deptObj?.color || '#3b82f6'}40`,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                          }}
                        >
                          <span
                            style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              background: deptObj?.color || '#3b82f6',
                            }}
                          />
                          {job.department}
                        </span>
                      </td>
                      <td>{job.salary}</td>
                      <td>{job.deadline}</td>
                      <td>
                        <span
                          className={`${styles.badge} ${
                            job.status === 'open'
                              ? styles.statusOpen
                              : job.status === 'closed'
                              ? styles.statusClosed
                              : styles.statusDraft
                          }`}
                        >
                          {job.status === 'open' ? 'Đang tuyển' : job.status === 'closed' ? 'Đã đóng' : 'Bản nháp'}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          style={{
                            background: 'none',
                            border: 'none',
                            fontWeight: 700,
                            color: '#F58220',
                            cursor: 'pointer',
                            textDecoration: 'underline',
                          }}
                          onClick={() => {
                            setAppSearchQuery(job.title);
                            setActiveTab('applications');
                          }}
                        >
                          {applicationsList.filter((a) => a.jobId === job.id || a.jobTitle === job.title).length} Hồ sơ
                        </button>
                      </td>
                      <td>
                        <div className={styles.actionsCell}>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingJob(job);
                              setIsEditModalOpen(true);
                            }}
                            className={styles.actionBtn}
                            title="Sửa vị trí"
                          >
                            <Edit2 size={15} /> Sửa
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeleteCandidateId(job.id)}
                            className={`${styles.actionBtn} ${styles.actionDelete}`}
                            title="Xóa vị trí"
                          >
                            <Trash2 size={15} /> Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* VIEW TAB 2: CANDIDATE APPLICATIONS */}
      {activeTab === 'applications' && (
        <>
          {/* Applications Filters */}
          <div className={styles.filterCard}>
            <div className={styles.searchBox}>
              <Search size={16} className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Tìm tên ứng viên, email, số điện thoại, vị trí..."
                value={appSearchQuery}
                onChange={(e) => setAppSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>

            <Select
              options={[
                { value: 'all', label: 'Tất cả phòng ban' },
                ...departmentsList.map((d) => ({
                  value: d.name,
                  label: d.name,
                })),
              ]}
              value={selectedAppDepartment}
              onChange={setSelectedAppDepartment}
              triggerStyle={{ minWidth: '200px' }}
            />

            <Select
              options={[
                { value: 'all', label: 'Tất cả loại hình' },
                { value: 'Full-time', label: 'Full-time' },
                { value: 'Part-time', label: 'Part-time' },
                { value: 'Internship', label: 'Internship' },
              ]}
              value={selectedAppJobType}
              onChange={(val) => setSelectedAppJobType(val as JobType | 'all')}
              triggerStyle={{ minWidth: '160px' }}
            />

            <Select
              options={[
                { value: 'all', label: 'Tất cả trạng thái' },
                { value: 'pending', label: 'Đang chờ duyệt' },
                { value: 'accepted', label: 'Đã tuyển' },
                { value: 'rejected', label: 'Từ chối' },
                { value: 'archived', label: 'Lưu trữ hồ sơ' },
              ]}
              value={selectedAppStatus}
              onChange={(val) => setSelectedAppStatus(val as ApplicationStatus | 'all')}
              triggerStyle={{ minWidth: '210px' }}
            />
          </div>

          {/* Applications Table */}
          <div className={styles.tableCard}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Thông tin ứng viên</th>
                  <th>Vị trí ứng tuyển & Phòng ban</th>
                  <th>Tệp CV</th>
                  <th>Thời gian nộp</th>
                  <th>Trạng thái xét duyệt</th>
                  <th>Thao tác</th>
                </tr>
              </thead>

              <tbody>
                {filteredApplications.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                      Chưa có hồ sơ ứng viên nào phù hợp với bộ lọc tìm kiếm.
                    </td>
                  </tr>
                ) : (
                  filteredApplications.map((app) => {
                    const deptObj = departmentsList.find((d) => d.name === app.department);
                    return (
                      <tr key={app.id}>
                        <td>
                          <div className={styles.jobTitleCell}>
                            <span className={styles.jobTitleText}>{app.fullName}</span>
                            <span className={styles.jobMetaText}>
                              {app.phone} • {app.email}
                            </span>
                          </div>
                        </td>
                        <td>
                          <div className={styles.jobTitleCell}>
                            <span className={styles.jobTitleText} style={{ fontSize: '0.9rem' }}>
                              {app.jobTitle}
                            </span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem' }}>
                              <span
                                style={{
                                  fontSize: '0.75rem',
                                  fontWeight: 600,
                                  padding: '0.15rem 0.5rem',
                                  borderRadius: '999px',
                                  background: `${deptObj?.color || '#3b82f6'}20`,
                                  color: deptObj?.color || '#3b82f6',
                                  border: `1px solid ${deptObj?.color || '#3b82f6'}40`,
                                }}
                              >
                                {app.department}
                              </span>
                              <span style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>{app.jobType}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <button
                            type="button"
                            onClick={() => setPdfPreviewApp(app)}
                            className={styles.cvViewBtn}
                            title="Bấm để xem và tải về bản CV PDF"
                          >
                            <FileText size={15} />
                            <span>{app.cvFileName || 'CV_Candidate.pdf'}</span>
                          </button>
                        </td>
                        <td style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                          {new Date(app.createdAt).toLocaleDateString('vi-VN')} {new Date(app.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td>
                          <span
                            className={`${styles.badge} ${
                              app.status === 'pending'
                                ? styles.statusPending
                                : app.status === 'accepted'
                                ? styles.statusAccepted
                                : app.status === 'rejected'
                                ? styles.statusRejected
                                : styles.statusArchived
                            }`}
                          >
                            {app.status === 'pending'
                              ? 'Đang chờ duyệt'
                              : app.status === 'accepted'
                              ? 'Đã tuyển'
                              : app.status === 'rejected'
                              ? 'Từ chối'
                              : 'Lưu trữ hồ sơ'}
                          </span>
                        </td>
                        <td>
                          <div className={styles.actionsCell}>
                            {app.status === 'pending' && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateAppStatus(app.id, 'accepted')}
                                  className={`${styles.actionBtn} ${styles.btnAccept}`}
                                  title="Duyệt & Nhận ứng viên"
                                >
                                  <UserCheck size={15} /> Nhận
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateAppStatus(app.id, 'rejected')}
                                  className={`${styles.actionBtn} ${styles.btnReject}`}
                                  title="Từ chối ứng viên (Chuyển mục từ chối tự xóa sau 3 ngày)"
                                >
                                  <UserX size={15} /> Từ chối
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateAppStatus(app.id, 'archived')}
                                  className={`${styles.actionBtn} ${styles.btnArchive}`}
                                  title="Lưu trữ hồ sơ"
                                >
                                  <Archive size={15} /> Lưu trữ
                                </button>
                              </>
                            )}

                            {app.status !== 'pending' && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateAppStatus(app.id, 'pending')}
                                  className={`${styles.actionBtn} ${styles.btnRestore}`}
                                  title="Hoàn tác - Khôi phục trở lại danh sách ứng tuyển chờ duyệt"
                                >
                                  <RotateCcw size={15} /> Hoàn tác
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDeleteAppId(app.id)}
                                  className={`${styles.actionBtn} ${styles.actionDelete}`}
                                  title="Xóa vĩnh viễn hồ sơ này"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* MODAL VIEW PDF CV */}
      {pdfPreviewApp && (
        <div className={styles.pdfModalOverlay} onClick={() => setPdfPreviewApp(null)}>
          <div className={styles.pdfModalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.pdfModalHeader}>
              <h3>
                <FileText size={22} color="#F58220" />
                <span>Xem bản CV — {pdfPreviewApp.fullName} ({pdfPreviewApp.jobTitle})</span>
              </h3>
              <button
                type="button"
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                onClick={() => setPdfPreviewApp(null)}
              >
                <X size={24} />
              </button>
            </div>

            <div className={styles.pdfModalBody}>
              <iframe
                src={pdfPreviewApp.cvFileData}
                title={pdfPreviewApp.cvFileName}
                width="100%"
                height="520px"
                style={{ border: 'none', borderRadius: '12px' }}
              />
            </div>

            <div className={styles.pdfModalFooter}>
              <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                Họ tên: <strong style={{ color: '#fff' }}>{pdfPreviewApp.fullName}</strong> • SĐT: <strong style={{ color: '#fff' }}>{pdfPreviewApp.phone}</strong> • Email: <strong style={{ color: '#fff' }}>{pdfPreviewApp.email}</strong>
              </span>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <a
                  href={pdfPreviewApp.cvFileData}
                  download={pdfPreviewApp.cvFileName || 'CV_Candidate.pdf'}
                  className={styles.downloadPdfBtn}
                >
                  <Download size={16} /> Tải về CV PDF
                </a>
                <Button variant="secondary" size="md" onClick={() => setPdfPreviewApp(null)}>
                  Đóng
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <JobEditModal
        key={editingJob ? editingJob.id : 'new_job'}
        isOpen={isEditModalOpen}
        jobToEdit={editingJob}
        onSave={handleSaveJob}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingJob(null);
        }}
      />

      <DepartmentManagerModal
        isOpen={isDeptModalOpen}
        onClose={() => setIsDeptModalOpen(false)}
        onDepartmentsChange={loadData}
      />

      <ConfirmModal
        isOpen={deleteCandidateId !== null}
        title="Xác nhận xóa vị trí tuyển dụng"
        message="Hành động này sẽ xóa vị trí tuyển dụng khỏi hệ thống và không thể hoàn tác. Bạn có chắc chắn muốn xóa?"
        confirmLabel="Xóa vĩnh viễn"
        cancelLabel="Hủy bỏ"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteCandidateId(null)}
      />

      <ConfirmModal
        isOpen={deleteAppId !== null}
        title="Xác nhận xóa hồ sơ ứng viên"
        message="Hành động này sẽ xóa vĩnh viễn hồ sơ ứng tuyển này khỏi hệ thống. Bạn có chắc chắn muốn xóa?"
        confirmLabel="Xóa hồ sơ"
        cancelLabel="Hủy bỏ"
        onConfirm={handleConfirmDeleteApp}
        onCancel={() => setDeleteAppId(null)}
      />
    </div>
  );
};
