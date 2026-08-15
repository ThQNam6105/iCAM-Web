import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import {
  type CareersItem,
  type JobStatus,
  type JobType,
  getAllDepartments,
  type DepartmentItem,
} from '../../services/careersService';
import { Button, Select } from './UI';
import styles from './JobEditModal.module.css';

interface JobEditModalProps {
  isOpen: boolean;
  jobToEdit?: CareersItem | null;
  onSave: (data: Partial<CareersItem>) => void;
  onClose: () => void;
}

export const JobEditModal: React.FC<JobEditModalProps> = ({
  isOpen,
  jobToEdit,
  onSave,
  onClose,
}) => {
  const [departments, setDepartments] = useState<DepartmentItem[]>([]);

  // Form Fields
  const [title, setTitle] = useState(jobToEdit?.title || '');
  const [titleEn, setTitleEn] = useState(jobToEdit?.titleEn || '');
  const [department, setDepartment] = useState(jobToEdit?.department || 'Khối Đào Tạo');
  const [departmentEn, setDepartmentEn] = useState(jobToEdit?.departmentEn || '');
  const [location, setLocation] = useState(jobToEdit?.location || 'Cơ sở Hóc Môn & Quận 12');
  const [locationEn, setLocationEn] = useState(jobToEdit?.locationEn || 'Hoc Mon & District 12 Campuses');
  const [type, setType] = useState<JobType>(jobToEdit?.type || 'Full-time');
  const [salary, setSalary] = useState(jobToEdit?.salary || '12.000.000đ - 18.000.000đ');
  const [salaryEn, setSalaryEn] = useState(jobToEdit?.salaryEn || '12,000,000VND - 18,000,000VND');
  const [deadline, setDeadline] = useState(jobToEdit?.deadline || '30/09/2026');
  const [status, setStatus] = useState<JobStatus>(jobToEdit?.status || 'open');
  const [description, setDescription] = useState(jobToEdit?.description || '');
  const [descriptionEn, setDescriptionEn] = useState(jobToEdit?.descriptionEn || '');
  const [requirements, setRequirements] = useState(jobToEdit?.requirements || '');
  const [requirementsEn, setRequirementsEn] = useState(jobToEdit?.requirementsEn || '');
  const [benefits, setBenefits] = useState(jobToEdit?.benefits || '');
  const [benefitsEn, setBenefitsEn] = useState(jobToEdit?.benefitsEn || '');

  useEffect(() => {
    const depts = getAllDepartments();
    setDepartments(depts);
    if (!jobToEdit && depts.length > 0) {
      setDepartment(depts[0].name);
      setDepartmentEn(depts[0].nameEn || depts[0].name);
    }
  }, [jobToEdit, isOpen]);

  if (!isOpen) return null;

  const handleDepartmentChange = (selectedName: string) => {
    setDepartment(selectedName);
    const found = departments.find((d) => d.name === selectedName);
    if (found && found.nameEn) {
      setDepartmentEn(found.nameEn);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      titleEn,
      department,
      departmentEn: departmentEn || department,
      location,
      locationEn: locationEn || location,
      type,
      salary,
      salaryEn: salaryEn || salary,
      deadline,
      status,
      description,
      descriptionEn,
      requirements,
      requirementsEn,
      benefits,
      benefitsEn,
    });
    onClose();
  };

  const handleKeyDownAutoBullet = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
    currentVal: string,
    setter: (val: string) => void
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const selectionStart = e.currentTarget.selectionStart;
      const selectionEnd = e.currentTarget.selectionEnd;

      const before = currentVal.substring(0, selectionStart);
      const after = currentVal.substring(selectionEnd);
      const newVal = `${before}\n• ${after}`;
      setter(newVal);

      setTimeout(() => {
        if (e.currentTarget) {
          e.currentTarget.selectionStart = selectionStart + 3;
          e.currentTarget.selectionEnd = selectionStart + 3;
        }
      }, 0);
    }
  };

  const handleFocusAutoBullet = (
    currentVal: string,
    setter: (val: string) => void
  ) => {
    if (!currentVal.trim()) {
      setter('• ');
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.header}>
          <h3 className={styles.title}>
            {jobToEdit ? 'Chỉnh sửa vị trí tuyển dụng' : 'Tạo vị trí tuyển dụng mới'}
          </h3>
          <button type="button" onClick={onClose} className={styles.closeBtn}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.formGrid}>
          {/* Job Titles (VI & EN) */}
          <div className={styles.rowTwo}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>
                Chức danh công việc (Tiếng Việt) <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                required
                placeholder="VD: Giáo viên Tiếng Anh Trẻ Em..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Chức danh công việc (English)</label>
              <input
                type="text"
                placeholder="VD: Kids English Teacher..."
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                className={styles.input}
              />
            </div>
          </div>

          {/* Department & Type */}
          <div className={styles.rowTwo}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>
                Phòng ban / Khối <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <Select
                options={departments.map((d) => ({
                  value: d.name,
                  label: d.nameEn ? `${d.name} (${d.nameEn})` : d.name,
                }))}
                value={department}
                onChange={handleDepartmentChange}
                fullWidth
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>
                Loại hình công việc <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <Select
                options={[
                  { value: 'Full-time', label: 'Full-time (Toàn thời gian)' },
                  { value: 'Part-time', label: 'Part-time (Bán thời gian)' },
                  { value: 'Internship', label: 'Internship (Thực tập sinh)' },
                ]}
                value={type}
                onChange={(val) => setType(val as JobType)}
                fullWidth
              />
            </div>
          </div>

          {/* Salary & Deadline */}
          <div className={styles.rowTwo}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>
                Mức lương dự kiến (Tiếng Việt) <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                required
                placeholder="VD: 12.000.000đ - 18.000.000đ hoặc Thỏa thuận"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Mức lương dự kiến (English)</label>
              <input
                type="text"
                placeholder="VD: 12,000,000VND - 18,000,000VND"
                value={salaryEn}
                onChange={(e) => setSalaryEn(e.target.value)}
                className={styles.input}
              />
            </div>
          </div>

          {/* Location (VI & EN) */}
          <div className={styles.rowTwo}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>
                Địa điểm làm việc (Tiếng Việt) <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Cơ sở Hóc Môn & Quận 12"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Địa điểm làm việc (English)</label>
              <input
                type="text"
                placeholder="Hoc Mon & District 12 Campuses"
                value={locationEn}
                onChange={(e) => setLocationEn(e.target.value)}
                className={styles.input}
              />
            </div>
          </div>

          {/* Deadline & Status */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Hạn nộp hồ sơ & Trạng thái</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                required
                placeholder="30/09/2026"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className={styles.input}
                style={{ flex: 1 }}
              />
              <Select
                options={[
                  { value: 'open', label: 'Đang tuyển (Open)' },
                  { value: 'closed', label: 'Đã đóng (Closed)' },
                  { value: 'draft', label: 'Bản nháp (Draft)' },
                ]}
                value={status}
                onChange={(val) => setStatus(val as JobStatus)}
              />
            </div>
          </div>

          {/* SECTION 1: MÔ TẢ CÔNG VIỆC */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Mô tả công việc (Tiếng Việt)</label>
            <textarea
              rows={4}
              placeholder="Nhập mô tả công việc (tự động chèn • khi bấm Enter xuống dòng)..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onFocus={() => handleFocusAutoBullet(description, setDescription)}
              onKeyDown={(e) => handleKeyDownAutoBullet(e, description, setDescription)}
              className={styles.textarea}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Mô tả công việc (Tiếng Anh)</label>
            <textarea
              rows={4}
              placeholder="Enter job description in English (auto-inserts • on Enter)..."
              value={descriptionEn}
              onChange={(e) => setDescriptionEn(e.target.value)}
              onFocus={() => handleFocusAutoBullet(descriptionEn, setDescriptionEn)}
              onKeyDown={(e) => handleKeyDownAutoBullet(e, descriptionEn, setDescriptionEn)}
              className={styles.textarea}
            />
          </div>

          {/* SECTION 2: YÊU CẦU ỨNG VIÊN */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Yêu cầu ứng viên (Tiếng Việt)</label>
            <textarea
              rows={4}
              placeholder="Nhập yêu cầu ứng viên (tự động chèn • khi bấm Enter xuống dòng)..."
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              onFocus={() => handleFocusAutoBullet(requirements, setRequirements)}
              onKeyDown={(e) => handleKeyDownAutoBullet(e, requirements, setRequirements)}
              className={styles.textarea}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Yêu cầu ứng viên (Tiếng Anh)</label>
            <textarea
              rows={4}
              placeholder="Enter candidate requirements in English (auto-inserts • on Enter)..."
              value={requirementsEn}
              onChange={(e) => setRequirementsEn(e.target.value)}
              onFocus={() => handleFocusAutoBullet(requirementsEn, setRequirementsEn)}
              onKeyDown={(e) => handleKeyDownAutoBullet(e, requirementsEn, setRequirementsEn)}
              className={styles.textarea}
            />
          </div>

          {/* SECTION 3: QUYỀN LỢI ĐƯỢC HƯỞNG */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Quyền lợi được hưởng (Tiếng Việt)</label>
            <textarea
              rows={4}
              placeholder="Nhập quyền lợi được hưởng (tự động chèn • khi bấm Enter xuống dòng)..."
              value={benefits}
              onChange={(e) => setBenefits(e.target.value)}
              onFocus={() => handleFocusAutoBullet(benefits, setBenefits)}
              onKeyDown={(e) => handleKeyDownAutoBullet(e, benefits, setBenefits)}
              className={styles.textarea}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Quyền lợi được hưởng (Tiếng Anh)</label>
            <textarea
              rows={4}
              placeholder="Enter job benefits in English (auto-inserts • on Enter)..."
              value={benefitsEn}
              onChange={(e) => setBenefitsEn(e.target.value)}
              onFocus={() => handleFocusAutoBullet(benefitsEn, setBenefitsEn)}
              onKeyDown={(e) => handleKeyDownAutoBullet(e, benefitsEn, setBenefitsEn)}
              className={styles.textarea}
            />
          </div>

          <div className={styles.actions}>
            <Button type="button" variant="secondary" size="md" onClick={onClose}>
              Hủy bỏ
            </Button>
            <Button type="submit" variant="primary" size="md" icon={<Save size={16} />}>
              {jobToEdit ? 'Lưu thay đổi' : 'Đăng vị trí mới'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
