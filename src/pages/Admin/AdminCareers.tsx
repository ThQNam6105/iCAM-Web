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
} from 'lucide-react';
import {
  type CareersItem,
  type JobStatus,
  type DepartmentItem,
  getAllCareers,
  fetchCareersFromSupabase,
  createCareer,
  updateCareer,
  deleteCareer,
  getAllDepartments,
} from '../../services/careersService';
import { JobEditModal } from '../../components/Admin/JobEditModal';
import { DepartmentManagerModal } from '../../components/Admin/DepartmentManagerModal';
import { ConfirmModal } from '../../components/ConfirmModal/ConfirmModal';
import { useToast } from '../../components/Toast/Toast';
import { Button, Select } from '../../components/Admin/UI';
import styles from './AdminCareers.module.css';

export const AdminCareers: React.FC = () => {
  const { showToast } = useToast();

  const [allJobs, setAllJobs] = useState<CareersItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<JobStatus | 'all'>('all');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [departmentsList, setDepartmentsList] = useState<DepartmentItem[]>([]);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<CareersItem | null>(null);
  const [deleteCandidateId, setDeleteCandidateId] = useState<string | null>(null);

  const loadJobs = () => {
    setAllJobs(getAllCareers());
    setDepartmentsList(getAllDepartments());
  };

  useEffect(() => {
    loadJobs();
    fetchCareersFromSupabase().then(() => loadJobs());
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

  const stats = useMemo(() => {
    const total = allJobs.length;
    const openCount = allJobs.filter((j) => j.status === 'open').length;
    const closedCount = allJobs.filter((j) => j.status === 'closed').length;
    const totalApps = allJobs.reduce((acc, j) => acc + (j.applicationsCount || 0), 0);
    return { total, openCount, closedCount, totalApps };
  }, [allJobs]);

  const handleSaveJob = async (data: Partial<CareersItem>) => {
    if (editingJob) {
      await updateCareer(editingJob.id, data);
      showToast('Cập nhật vị trí tuyển dụng thành công! ✓', 'success');
    } else {
      await createCareer(
        data as Omit<CareersItem, 'id' | 'createdAt' | 'updatedAt' | 'applicationsCount'>
      );
      showToast('Tạo vị trí tuyển dụng mới thành công! ✓', 'success');
    }
    loadJobs();
  };

  const handleConfirmDelete = async () => {
    if (deleteCandidateId) {
      await deleteCareer(deleteCandidateId);
      showToast('Đã xóa vị trí tuyển dụng khỏi hệ thống!', 'info');
      setDeleteCandidateId(null);
      loadJobs();
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Quản lý tuyển dụng (Careers)</h1>
          <p className={styles.pageSubtitle}>
            Quản lý các vị trí tuyển dụng giáo viên, nhân viên, phòng ban & nhận hồ sơ ứng tuyển tại iCANCAM
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

      {/* Stat Cards */}
      <div className={styles.statsGrid}>
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
            <div className={styles.statLabel}>Tổng hồ sơ đã ứng tuyển</div>
          </div>
          <Users size={28} color="#3b82f6" />
        </div>
      </div>

      {/* Filters */}
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
                          <span style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.1rem' }}>
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
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: deptObj?.color || '#3b82f6' }} />
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
                  <td style={{ fontWeight: 700, color: '#F58220' }}>{job.applicationsCount} Hồ sơ</td>
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
        onDepartmentsChange={loadJobs}
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
    </div>
  );
};
