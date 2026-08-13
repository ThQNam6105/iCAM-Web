import React, { useState } from 'react';
import { X, Save, List } from 'lucide-react';
import { type CareersItem, type JobStatus, type JobType } from '../../services/careersService';
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
  const [title, setTitle] = useState(jobToEdit?.title || '');
  const [department, setDepartment] = useState(jobToEdit?.department || 'Khối Đào Tạo');
  const [location, setLocation] = useState(jobToEdit?.location || 'Cơ sở Hóc Môn & Quận 12');
  const [type, setType] = useState<JobType>(jobToEdit?.type || 'Full-time');
  const [salary, setSalary] = useState(jobToEdit?.salary || '10.000.000đ - 15.000.000đ');
  const [deadline, setDeadline] = useState(jobToEdit?.deadline || '30/09/2026');
  const [status, setStatus] = useState<JobStatus>(jobToEdit?.status || 'open');
  const [description, setDescription] = useState(jobToEdit?.description || '');
  const [requirements, setRequirements] = useState(jobToEdit?.requirements || '');
  const [benefits, setBenefits] = useState(jobToEdit?.benefits || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      department,
      location,
      type,
      salary,
      deadline,
      status,
      description,
      requirements,
      benefits,
    });
    onClose();
  };

  const addBulletPoint = (currentVal: string, setter: (val: string) => void) => {
    const prefix = currentVal && !currentVal.endsWith('\n') ? '\n• ' : '• ';
    setter(currentVal + prefix);
  };

  const handleKeyDownBullet = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
    currentVal: string,
    setter: (val: string) => void
  ) => {
    if (e.key === 'Enter') {
      const lines = currentVal.split('\n');
      const lastLine = lines[lines.length - 1];
      if (lastLine.startsWith('• ')) {
        e.preventDefault();
        setter(currentVal + '\n• ');
      }
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
          <div className={styles.inputGroup}>
            <label className={styles.label}>
              Chức danh công việc (Tiêu đề vị trí) <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="text"
              required
              placeholder="VD: Giáo viên tiếng Anh trẻ em..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={styles.input}
            />
          </div>

          <div className={styles.rowTwo}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>
                Phòng ban <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <Select
                options={[
                  { value: 'Khối Đào Tạo', label: 'Khối đào tạo' },
                  { value: 'Khối Tư Vấn & Tuyển Sinh', label: 'Khối tư vấn & tuyển sinh' },
                  { value: 'Khối Marketing', label: 'Khối Marketing' },
                  { value: 'Khối Hành Chính & Nhân Sự', label: 'Khối hành chính & nhân sự' },
                ]}
                value={department}
                onChange={setDepartment}
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

          <div className={styles.rowTwo}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>
                Mức lương dự kiến <span style={{ color: '#ef4444' }}>*</span>
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
              <label className={styles.label}>
                Hạn nộp hồ sơ <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                required
                placeholder="30/09/2026"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.rowTwo}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>
                Địa điểm làm việc <span style={{ color: '#ef4444' }}>*</span>
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
              <label className={styles.label}>Trạng thái tuyển dụng</label>
              <Select
                options={[
                  { value: 'open', label: 'Đang tuyển (Open - hiện trên web)' },
                  { value: 'closed', label: 'Đã đóng (Closed - tạm dừng)' },
                  { value: 'draft', label: 'Bản nháp (Draft - ẩn trên web)' },
                ]}
                value={status}
                onChange={(val) => setStatus(val as JobStatus)}
                fullWidth
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.labelHeader}>
              <label className={styles.label}>Mô tả công việc (Job description)</label>
              <button
                type="button"
                className={styles.bulletBtn}
                onClick={() => addBulletPoint(description, setDescription)}
                title="Tự động chèn gạch đầu dòng"
              >
                <List size={14} /> • Thêm gạch đầu dòng
              </button>
            </div>
            <textarea
              rows={4}
              placeholder="Mô tả chi tiết nhiệm vụ (bấm 'Thêm gạch đầu dòng' hoặc gõ '• ')..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onKeyDown={(e) => handleKeyDownBullet(e, description, setDescription)}
              className={styles.textarea}
            />
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.labelHeader}>
              <label className={styles.label}>Yêu cầu ứng viên (Requirements)</label>
              <button
                type="button"
                className={styles.bulletBtn}
                onClick={() => addBulletPoint(requirements, setRequirements)}
                title="Tự động chèn gạch đầu dòng"
              >
                <List size={14} /> • Thêm gạch đầu dòng
              </button>
            </div>
            <textarea
              rows={4}
              placeholder="Bằng cấp, kỹ năng, kinh nghiệm (bấm 'Thêm gạch đầu dòng' hoặc gõ '• ')..."
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              onKeyDown={(e) => handleKeyDownBullet(e, requirements, setRequirements)}
              className={styles.textarea}
            />
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.labelHeader}>
              <label className={styles.label}>Quyền lợi được hưởng (Benefits)</label>
              <button
                type="button"
                className={styles.bulletBtn}
                onClick={() => addBulletPoint(benefits, setBenefits)}
                title="Tự động chèn gạch đầu dòng"
              >
                <List size={14} /> • Thêm gạch đầu dòng
              </button>
            </div>
            <textarea
              rows={4}
              placeholder="Chế độ bảo hiểm, thưởng (bấm 'Thêm gạch đầu dòng' hoặc gõ '• ')..."
              value={benefits}
              onChange={(e) => setBenefits(e.target.value)}
              onKeyDown={(e) => handleKeyDownBullet(e, benefits, setBenefits)}
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
