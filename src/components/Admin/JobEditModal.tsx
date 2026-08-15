import React, { useState, useEffect } from 'react';
import { X, Save, List, Plus, Sparkles } from 'lucide-react';
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

const BENEFIT_PRESETS = [
  { vi: 'Bảo hiểm xã hội & Y tế 100% theo quy định', en: '100% Full social & health insurance per regulations' },
  { vi: 'Thưởng hiệu suất công việc hàng tháng & thưởng Lễ Tết', en: 'Monthly performance bonuses & Holiday bonuses' },
  { vi: 'Khóa tập huấn Masterclass 4Ls + LETI hàng năm từ chuyên gia', en: 'Annual 4Ls + LETI Masterclass training from experts' },
  { vi: 'Cơ hội thăng tiến rõ ràng lên Trưởng nhóm / Quản lý', en: 'Clear career advancement path to Team Lead / Manager' },
  { vi: 'Du lịch nghỉ dưỡng & Teambuilding hàng năm cùng công ty', en: 'Annual company vacation & Teambuilding trips' },
  { vi: 'Phụ cấp ăn trưa & hỗ trợ vé xe đầy đủ', en: 'Lunch allowance & full parking support' },
  { vi: 'Ưu đãi 50%-100% học phí các khóa Tiếng Anh & IELTS cho người thân', en: '50%-100% tuition discount for English & IELTS courses for relatives' },
];

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

  // Custom Benefit Quick-Add Input
  const [customBenefitVi, setCustomBenefitVi] = useState('');
  const [customBenefitEn, setCustomBenefitEn] = useState('');

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

  const handleAddPresetBenefit = (preset: { vi: string; en: string }) => {
    // Add to VI
    const viPrefix = benefits && !benefits.endsWith('\n') ? '\n• ' : '• ';
    const updatedVi = benefits ? `${benefits}${viPrefix}${preset.vi}` : `• ${preset.vi}`;
    setBenefits(updatedVi);

    // Add to EN
    const enPrefix = benefitsEn && !benefitsEn.endsWith('\n') ? '\n• ' : '• ';
    const updatedEn = benefitsEn ? `${benefitsEn}${enPrefix}${preset.en}` : `• ${preset.en}`;
    setBenefitsEn(updatedEn);
  };

  const handleAddCustomBenefit = () => {
    if (!customBenefitVi.trim()) return;

    const viPrefix = benefits && !benefits.endsWith('\n') ? '\n• ' : '• ';
    setBenefits(benefits ? `${benefits}${viPrefix}${customBenefitVi.trim()}` : `• ${customBenefitVi.trim()}`);

    if (customBenefitEn.trim()) {
      const enPrefix = benefitsEn && !benefitsEn.endsWith('\n') ? '\n• ' : '• ';
      setBenefitsEn(benefitsEn ? `${benefitsEn}${enPrefix}${customBenefitEn.trim()}` : `• ${customBenefitEn.trim()}`);
    }

    setCustomBenefitVi('');
    setCustomBenefitEn('');
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

          {/* SECTION 1: MÔ TẢ CÔNG VIỆC (JOB DESCRIPTION - VI & EN SIDE-BY-SIDE) */}
          <div className={styles.rowTwo}>
            <div className={styles.inputGroup}>
              <div className={styles.labelHeader}>
                <label className={styles.label}>🇻🇳 Mô tả công việc (Tiếng Việt)</label>
                <button
                  type="button"
                  className={styles.bulletBtn}
                  onClick={() => addBulletPoint(description, setDescription)}
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
                <label className={styles.label}>🇬🇧 Job Description (English)</label>
                <button
                  type="button"
                  className={styles.bulletBtn}
                  onClick={() => addBulletPoint(descriptionEn, setDescriptionEn)}
                >
                  <List size={14} /> • Add Bullet Point
                </button>
              </div>
              <textarea
                rows={4}
                placeholder="Detailed duties and responsibilities in English..."
                value={descriptionEn}
                onChange={(e) => setDescriptionEn(e.target.value)}
                onKeyDown={(e) => handleKeyDownBullet(e, descriptionEn, setDescriptionEn)}
                className={styles.textarea}
              />
            </div>
          </div>

          {/* SECTION 2: YÊU CẦU ỨNG VIÊN (REQUIREMENTS - VI & EN SIDE-BY-SIDE) */}
          <div className={styles.rowTwo}>
            <div className={styles.inputGroup}>
              <div className={styles.labelHeader}>
                <label className={styles.label}>🇻🇳 Yêu cầu ứng viên (Tiếng Việt)</label>
                <button
                  type="button"
                  className={styles.bulletBtn}
                  onClick={() => addBulletPoint(requirements, setRequirements)}
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
                <label className={styles.label}>🇬🇧 Candidate Requirements (English)</label>
                <button
                  type="button"
                  className={styles.bulletBtn}
                  onClick={() => addBulletPoint(requirementsEn, setRequirementsEn)}
                >
                  <List size={14} /> • Add Bullet Point
                </button>
              </div>
              <textarea
                rows={4}
                placeholder="Degrees, skills, language certificates, and experience in English..."
                value={requirementsEn}
                onChange={(e) => setRequirementsEn(e.target.value)}
                onKeyDown={(e) => handleKeyDownBullet(e, requirementsEn, setRequirementsEn)}
                className={styles.textarea}
              />
            </div>
          </div>

          {/* SECTION 3: QUYỀN LỢI ĐƯỢC HƯỞNG (BENEFITS - VI & EN SIDE-BY-SIDE) */}
          <div className={styles.rowTwo}>
            <div className={styles.inputGroup}>
              <div className={styles.labelHeader}>
                <label className={styles.label}>🇻🇳 Quyền lợi được hưởng (Tiếng Việt)</label>
                <button
                  type="button"
                  className={styles.bulletBtn}
                  onClick={() => addBulletPoint(benefits, setBenefits)}
                >
                  <List size={14} /> • Thêm gạch đầu dòng
                </button>
              </div>
              <textarea
                rows={4}
                placeholder="Chế độ bảo hiểm, thưởng, nghỉ mát (bấm các mẫu bên dưới để chèn nhanh)..."
                value={benefits}
                onChange={(e) => setBenefits(e.target.value)}
                onKeyDown={(e) => handleKeyDownBullet(e, benefits, setBenefits)}
                className={styles.textarea}
              />
            </div>

            <div className={styles.inputGroup}>
              <div className={styles.labelHeader}>
                <label className={styles.label}>🇬🇧 Job Benefits (English)</label>
                <button
                  type="button"
                  className={styles.bulletBtn}
                  onClick={() => addBulletPoint(benefitsEn, setBenefitsEn)}
                >
                  <List size={14} /> • Add Bullet Point
                </button>
              </div>
              <textarea
                rows={4}
                placeholder="Insurances, performance bonuses, training roadmaps in English..."
                value={benefitsEn}
                onChange={(e) => setBenefitsEn(e.target.value)}
                onKeyDown={(e) => handleKeyDownBullet(e, benefitsEn, setBenefitsEn)}
                className={styles.textarea}
              />
            </div>
          </div>

          {/* Quick Benefit Adder Presets */}
          <div className={styles.benefitPresets}>
            <span className={styles.presetTitle}>
              <Sparkles size={14} /> Chèn nhanh quyền lợi mẫu (Tự động điền đồng thời cả khung Tiếng Việt & Tiếng Anh):
            </span>
            {BENEFIT_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                className={styles.presetPill}
                onClick={() => handleAddPresetBenefit(preset)}
                title={`Thêm: ${preset.vi}`}
              >
                <Plus size={13} /> {preset.vi}
              </button>
            ))}
          </div>

          {/* Quick Custom Benefit Adder Input */}
          <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#F58220', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
              <Plus size={14} /> Thêm quyền lợi mới (Custom Benefit Adder)
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '0.5rem', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="Quyền lợi (Tiếng Việt)..."
                value={customBenefitVi}
                onChange={(e) => setCustomBenefitVi(e.target.value)}
                className={styles.input}
              />
              <input
                type="text"
                placeholder="Benefit (English optional)..."
                value={customBenefitEn}
                onChange={(e) => setCustomBenefitEn(e.target.value)}
                className={styles.input}
              />
              <Button type="button" variant="secondary" size="sm" onClick={handleAddCustomBenefit}>
                + Thêm
              </Button>
            </div>
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
