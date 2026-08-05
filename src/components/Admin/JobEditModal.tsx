import React, { useState } from 'react';
import { X, Save, List } from 'lucide-react';
import { type CareersItem, type JobStatus, type JobType } from '../../services/careersService';
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
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3 className={styles.title}>
            {jobToEdit ? 'Chỉnh Sửa Vị Trí Tuyển Dụng' : 'Tạo Vị Trí Tuyển Dụng Mới'}
          </h3>
          <button type="button" onClick={onClose} className={styles.closeBtn}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.formGrid}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Chức danh công việc (Tiêu đề vị trí) *</label>
            <input
              type="text"
              required
              placeholder="VD: Giáo Viên Tiếng Anh Trẻ Em..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={styles.input}
            />
          </div>

          <div className={styles.rowTwo}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Phòng ban *</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className={styles.select}
              >
                <option value="Khối Đào Tạo">Khối Đào Tạo</option>
                <option value="Khối Tư Vấn & Tuyển Sinh">Khối Tư Vấn & Tuyển Sinh</option>
                <option value="Khối Marketing">Khối Marketing</option>
                <option value="Khối Hành Chính & Nhân Sự">Khối Hành Chính & Nhân Sự</option>
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Loại hình công việc *</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as JobType)}
                className={styles.select}
              >
                <option value="Full-time">Full-time (Toàn thời gian)</option>
                <option value="Part-time">Part-time (Bán thời gian)</option>
                <option value="Internship">Internship (Thực tập sinh)</option>
              </select>
            </div>
          </div>

          <div className={styles.rowTwo}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Mức lương dự kiến *</label>
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
              <label className={styles.label}>Hạn nộp hồ sơ *</label>
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
              <label className={styles.label}>Địa điểm làm việc *</label>
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
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as JobStatus)}
                className={styles.select}
              >
                <option value="open">Đang Tuyển (Open - Hiện trên web)</option>
                <option value="closed">Đã Đóng (Closed - Tạm dừng)</option>
                <option value="draft">Bản Nháp (Draft - Ẩn trên web)</option>
              </select>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.labelHeader}>
              <label className={styles.label}>Mô tả công việc (Job Description)</label>
              <button
                type="button"
                className={styles.bulletBtn}
                onClick={() => addBulletPoint(description, setDescription)}
                title="Tự động chèn gạch đầu dòng"
              >
                <List size={14} /> • Thêm Gạch Đầu Dòng
              </button>
            </div>
            <textarea
              rows={4}
              placeholder="Mô tả chi tiết nhiệm vụ (Bấm 'Thêm Gạch Đầu Dòng' hoặc gõ '• ')..."
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
                <List size={14} /> • Thêm Gạch Đầu Dòng
              </button>
            </div>
            <textarea
              rows={4}
              placeholder="Bằng cấp, kỹ năng, kinh nghiệm (Bấm 'Thêm Gạch Đầu Dòng' hoặc gõ '• ')..."
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
                <List size={14} /> • Thêm Gạch Đầu Dòng
              </button>
            </div>
            <textarea
              rows={4}
              placeholder="Chế độ bảo hiểm, thưởng (Bấm 'Thêm Gạch Đầu Dòng' hoặc gõ '• ')..."
              value={benefits}
              onChange={(e) => setBenefits(e.target.value)}
              onKeyDown={(e) => handleKeyDownBullet(e, benefits, setBenefits)}
              className={styles.textarea}
            />
          </div>

          <div className={styles.actions}>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>
              Hủy Bỏ
            </button>
            <button type="submit" className={styles.saveBtn}>
              <Save size={16} /> {jobToEdit ? 'Lưu Thay Đổi' : 'Đăng Vị Trí Mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
