import React, { useState } from 'react';
import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Send,
  Sparkles,
  Award,
  Users,
  CheckCircle2,
  ChevronRight,
  X,
  FileText,
  Star,
  Zap,
  GraduationCap
} from 'lucide-react';
import styles from './Careers.module.css';

interface Job {
  id: number;
  category: 'academic' | 'sales' | 'ops';
  categoryLabel: string;
  title: string;
  department: string;
  type: string;
  location: string;
  salary: string;
  desc: string;
  requirements: string[];
  benefits: string[];
}

const jobsData: Job[] = [
  {
    id: 1,
    category: 'academic',
    categoryLabel: 'HỌC THUẬT',
    title: 'Giáo Viên Tiếng Anh (Full-time / Part-time)',
    department: 'Bộ Phận Học Thuật',
    type: 'Full-time hoặc Part-time',
    location: 'Hóc Môn & Quận 12, TP.HCM',
    salary: '15.000.000đ – 25.000.000đ / tháng',
    desc: 'Giảng dạy các chương trình tiếng Anh trẻ em, thiếu niên và lộ trình IELTS theo phương pháp 4Ls + LETI tại hệ thống phòng học thông minh Smartboard.',
    requirements: [
      'Tốt nghiệp Đại học chuyên ngành Sư phạm Anh / Ngôn ngữ Anh hoặc chứng chỉ IELTS 7.5+ / TESOL / CELTA',
      'Có tối thiểu 1 năm kinh nghiệm đứng lớp giảng dạy tiếng Anh',
      'Yêu trẻ, năng động, phát âm chuẩn và giàu nhiệt huyết giáo dục'
    ],
    benefits: [
      'Thu nhập cạnh tranh + Thưởng chất lượng giảng dạy theo tháng/quý',
      'Được tập huấn định kỳ về phương pháp 4Ls + LETI từ các chuyên gia',
      'Môi trường làm việc quốc tế 100% tiếng Anh chuyên nghiệp'
    ]
  },
  {
    id: 2,
    category: 'academic',
    categoryLabel: 'HỌC THUẬT',
    title: 'Trợ Giảng Tiếng Anh (Teaching Assistant / Tutor)',
    department: 'Bộ Phận Học Thuật',
    type: 'Part-time (Linh hoạt theo ca)',
    location: 'Hóc Môn & Quận 12, TP.HCM',
    salary: '35.000đ – 60.000đ / giờ + Thưởng',
    desc: 'Hỗ trợ giáo viên trong các buổi học, theo sát tiến độ học tập của từng học viên và tương tác kết nối cùng phụ huynh.',
    requirements: [
      'Sinh viên chuyên ngành Ngôn Ngữ Anh / Sư Phạm hoặc đạt chứng chỉ IELTS 6.5+',
      'Giao tiếp tiếng Anh tự tin, nhiệt tình, có trách nhiệm cao',
      'Ưu tiên ứng viên có kinh nghiệm làm việc với trẻ em'
    ],
    benefits: [
      'Mức lương theo giờ hấp dẫn + Thưởng đánh giá từ phụ huynh',
      'Cơ hội rèn luyện kỹ năng sư phạm và thăng tiến lên Giáo viên chính thức',
      'Cấp giấy chứng nhận thực tập/làm việc tại ANH NGỮ CAM'
    ]
  },
  {
    id: 3,
    category: 'sales',
    categoryLabel: 'KINH DOANH & TƯ VẤN',
    title: 'Chuyên Viên Tư Vấn Tuyển Sinh (Academic Consultant)',
    department: 'Bộ Phận Tuyển Sinh',
    type: 'Full-time',
    location: 'Hóc Môn & Quận 12, TP.HCM',
    salary: '9.000.000đ – 20.000.000đ+ (Lương cứng + % Hoa hồng)',
    desc: 'Tư vấn lộ trình học phù hợp cho phụ huynh và học viên, tham gia các hoạt động tuyển sinh và chăm sóc học viên đăng ký.',
    requirements: [
      'Tốt nghiệp Cao đẳng / Đại học, ưu tiên ngành Khối kinh tế, Giao tiếp hoặc Ngôn ngữ',
      'Kỹ năng giao tiếp và lắng nghe tốt, giọng nói truyền cảm',
      'Yêu thích ngành giáo dục, tác phong chuyên nghiệp, cầu tiến'
    ],
    benefits: [
      'Lương cứng ổn định + Hoa hồng doanh số cao + Thưởng KPI vượt trội',
      'Được đào tạo bài bản kỹ năng tư vấn tâm lý khách hàng & dịch vụ',
      'Chế độ bảo hiểm, du lịch hàng năm và quà tặng sinh nhật'
    ]
  },
  {
    id: 4,
    category: 'ops',
    categoryLabel: 'VẬN HÀNH & DỊCH VỤ',
    title: 'Chuyên Viên Vận Hành Lớp Học & Dịch Vụ Khách Hàng',
    department: 'Bộ Phận Vận Hành',
    type: 'Full-time',
    location: 'Hóc Môn & Quận 12, TP.HCM',
    salary: '10.000.000đ – 15.000.000đ / tháng',
    desc: 'Quản lý vận hành lớp học, phối hợp xếp lịch giảng dạy, chuẩn bị thiết bị Smartboard và đón tiếp phụ huynh học viên tại cơ sở.',
    requirements: [
      'Tốt nghiệp Cao đẳng / Đại học chuyên ngành liên quan',
      'Kỹ năng tổ chức công việc tốt, cẩn thận, chu đáo và thân thiện',
      'Thành thạo tin học văn phòng và các phần mềm quản lý cơ bản'
    ],
    benefits: [
      'Môi trường làm việc năng động, văn minh và cởi mở',
      'Đầy đủ các chế độ BHXH, BHYT, BHTN theo quy định nhà nước',
      'Ưu đãi 50% - 100% học phí các khóa học tiếng Anh cho người thân'
    ]
  }
];

export const Careers: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isApplySubmitted, setIsApplySubmitted] = useState<boolean>(false);

  const filteredJobs = activeCategory === 'all'
    ? jobsData
    : jobsData.filter(j => j.category === activeCategory);

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsApplySubmitted(true);
    setTimeout(() => {
      setIsApplySubmitted(false);
      setSelectedJob(null);
    }, 3000);
  };

  return (
    <div className={styles.careersWrapper}>
      {/* HERO SECTION */}
      <section className={styles.heroSection}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContainer}>
          <div className={styles.heroBadge}>
            <Sparkles size={16} />
            <span>GIA NHẬP ĐỘI NGŨ ANH NGỮ CAM</span>
          </div>

          <h1 className={styles.heroTitle}>
            Cơ Hội Nghề Nghiệp <span className={styles.orangeHighlight}>Bứt Phá Tiềm Năng</span>
          </h1>

          <p className={styles.heroSubtitle}>
            Cùng ANH NGỮ CAM kiến tạo môi trường giáo dục 21st hiện đại tại Hóc Môn & Quận 12, chắp cánh cho thế hệ trẻ tự tin làm chủ ngôn ngữ và tự học suốt đời.
          </p>

          {/* Category Filter Pills */}
          <div className={styles.filterBar}>
            <button
              className={`${styles.filterBtn} ${activeCategory === 'all' ? styles.activeFilter : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              Tất Cả Vị Trí
            </button>
            <button
              className={`${styles.filterBtn} ${activeCategory === 'academic' ? styles.activeFilter : ''}`}
              onClick={() => setActiveCategory('academic')}
            >
              Khối Học Thuật (Giáo Viên & Trợ Giảng)
            </button>
            <button
              className={`${styles.filterBtn} ${activeCategory === 'sales' ? styles.activeFilter : ''}`}
              onClick={() => setActiveCategory('sales')}
            >
              Tư Vấn & Tuyển Sinh
            </button>
            <button
              className={`${styles.filterBtn} ${activeCategory === 'ops' ? styles.activeFilter : ''}`}
              onClick={() => setActiveCategory('ops')}
            >
              Vận Hành & Dịch Vụ
            </button>
          </div>
        </div>
      </section>

      {/* WHY JOIN US / BENEFITS SECTION */}
      <section className={styles.cultureSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTag}>
              <Zap size={16} />
              <span>MÔI TRƯỜNG LÀM VIỆC CƠ HỘI</span>
            </div>
            <h2 className={styles.sectionTitle}>
              Tại Sao Bạn NÊN Đồng Hành Cùng ANH NGỮ CAM?
            </h2>
          </div>

          <div className={styles.benefitsGrid}>
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}><DollarSign size={28} /></div>
              <h4>Thu Nhập & Đãi Ngộ Hấp Dẫn</h4>
              <p>Chính sách lương thưởng cạnh tranh, xét tăng lương định kỳ và thưởng hiệu quả công việc vượt trội.</p>
            </div>

            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}><GraduationCap size={28} /></div>
              <h4>Đào Tạo & Phát Triển Năng Lực</h4>
              <p>Được tập huấn hàng tháng về phương pháp 4Ls + LETI và kỹ năng quản trị cùng các chuyên gia hàng đầu.</p>
            </div>

            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}><Award size={28} /></div>
              <h4>Môi Trường Quốc Tế 21st</h4>
              <p>Làm việc trong không gian 100% tiếng Anh, trang bị Bảng thông minh Smartboard và văn hóa cởi mở.</p>
            </div>

            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}><Users size={28} /></div>
              <h4>Phúc Lợi Bền Vững</h4>
              <p>Đầy đủ bảo hiểm xã hội, du lịch nghỉ dưỡng hàng năm, teambuilding và học phí ưu đãi cho người thân.</p>
            </div>
          </div>
        </div>
      </section>

      {/* JOBS LIST SECTION */}
      <section className={styles.jobsSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTag}>
              <Briefcase size={16} />
              <span>VỊ TRÍ ĐANG TUYỂN DỤNG</span>
            </div>
            <h2 className={styles.sectionTitle}>Các Vị Trí Đang Mở Đợt Tuyển Dụng</h2>
          </div>

          <div className={styles.jobsList}>
            {filteredJobs.map((job) => (
              <div key={job.id} className={styles.jobCard}>
                <div className={styles.cardHeader}>
                  <span className={styles.categoryBadge}>{job.categoryLabel}</span>
                  <span className={styles.typeBadge}>{job.type}</span>
                </div>

                <h3 className={styles.jobTitle}>{job.title}</h3>
                <p className={styles.jobDesc}>{job.desc}</p>

                <div className={styles.jobMetaGrid}>
                  <div className={styles.metaItem}>
                    <Briefcase size={15} className={styles.metaIcon} />
                    <span><strong>Phòng ban:</strong> {job.department}</span>
                  </div>

                  <div className={styles.metaItem}>
                    <MapPin size={15} className={styles.metaIcon} />
                    <span><strong>Địa điểm:</strong> {job.location}</span>
                  </div>

                  <div className={styles.metaItem}>
                    <Clock size={15} className={styles.metaIcon} />
                    <span><strong>Hình thức:</strong> {job.type}</span>
                  </div>

                  <div className={styles.metaItem}>
                    <DollarSign size={15} className={styles.salaryIcon} />
                    <span className={styles.salaryValue}>{job.salary}</span>
                  </div>
                </div>

                <div className={styles.cardActions}>
                  <button
                    className={styles.detailBtn}
                    onClick={() => setSelectedJob(job)}
                  >
                    Xem Chi Tiết & Yêu Cầu <ChevronRight size={16} />
                  </button>

                  <button
                    className={styles.applyBtn}
                    onClick={() => setSelectedJob(job)}
                  >
                    <Send size={16} /> Ứng Tuyển Ngay
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RECRUITMENT CTA SECTION */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaCard}>
            <h2>Bạn Chưa Tìm Thấy Vị Trí Phù Hợp Khả Năng?</h2>
            <p>
              Đừng ngần ngại gửi hồ sơ ứng tuyển tự do (Talent Pool) cho ANH NGỮ CAM. Chúng tôi luôn mở rộng cửa chào đón các nhân tố tài năng đồng hành lâu dài!
            </p>
            <div className={styles.ctaButtons}>
              <a href="mailto:tuyendung@icam.edu.vn" className={styles.primaryCtaBtn}>
                Gửi CV Ứng Tuyển Tự Do <Send size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* JOB DETAIL & APPLY MODAL */}
      {selectedJob && (
        <div className={styles.modalOverlay} onClick={() => setSelectedJob(null)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setSelectedJob(null)}>
              <X size={24} />
            </button>

            <div className={styles.modalHeader}>
              <span className={styles.categoryBadge}>{selectedJob.categoryLabel}</span>
              <h2>{selectedJob.title}</h2>
              <div className={styles.modalMetaRow}>
                <span><MapPin size={14} /> {selectedJob.location}</span>
                <span><Clock size={14} /> {selectedJob.type}</span>
                <span className={styles.salaryText}><DollarSign size={14} /> {selectedJob.salary}</span>
              </div>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.infoBlock}>
                <h3><FileText size={18} color="#F58220" /> Yêu Cầu Công Việc</h3>
                <div className={styles.bulletList}>
                  {selectedJob.requirements.map((req, i) => (
                    <div key={i} className={styles.bulletItem}>
                      <CheckCircle2 size={16} color="#F58220" className={styles.checkIcon} />
                      <span>{req}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.infoBlock}>
                <h3><Star size={18} color="#F58220" /> Quyền Lợi & Đãi Ngộ</h3>
                <div className={styles.bulletList}>
                  {selectedJob.benefits.map((ben, i) => (
                    <div key={i} className={styles.bulletItem}>
                      <CheckCircle2 size={16} color="#F58220" className={styles.checkIcon} />
                      <span>{ben}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form nộp hồ sơ */}
              <div className={styles.applyFormBlock}>
                <h3><Send size={18} color="#F58220" /> Form Ứng Tuyển Nhanh</h3>
                
                {isApplySubmitted ? (
                  <div className={styles.successAlert}>
                    🎉 Nộp hồ sơ thành công! Bộ phận Tuyển sinh ANH NGỮ CAM sẽ liên hệ với bạn trong vòng 48h làm việc.
                  </div>
                ) : (
                  <form onSubmit={handleApplySubmit} className={styles.applyForm}>
                    <div className={styles.formGrid}>
                      <div className={styles.formGroup}>
                        <label>Họ và tên *</label>
                        <input type="text" placeholder="Nhập họ tên của bạn..." required />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Số điện thoại *</label>
                        <input type="tel" placeholder="Nhập số điện thoại..." required />
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label>Email liên hệ *</label>
                      <input type="email" placeholder="Nhập địa chỉ email..." required />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Ghi chú / Link CV (Drive, LinkedIn...)</label>
                      <textarea placeholder="Dán link CV hoặc giới thiệu ngắn gọn bản thân..." rows={3}></textarea>
                    </div>

                    <button type="submit" className={styles.submitApplyBtn}>
                      <Send size={18} /> Gửi Hồ Sơ Ứng Tuyển
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Careers;
