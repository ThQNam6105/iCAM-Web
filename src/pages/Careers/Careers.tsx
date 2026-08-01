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
  Star,
  Zap,
  GraduationCap
} from 'lucide-react';
import styles from './Careers.module.css';
import { useLanguage } from '../../contexts/LanguageContext';
import { SectionTransition } from '../../components/SectionTransition/SectionTransition';

interface Job {
  id: number;
  category: 'academic' | 'sales' | 'ops';
  categoryLabelVi: string;
  categoryLabelEn: string;
  titleVi: string;
  titleEn: string;
  departmentVi: string;
  departmentEn: string;
  typeVi: string;
  typeEn: string;
  locationVi: string;
  locationEn: string;
  salaryVi: string;
  salaryEn: string;
  descVi: string;
  descEn: string;
  requirementsVi: string[];
  requirementsEn: string[];
  benefitsVi: string[];
  benefitsEn: string[];
}

const jobsData: Job[] = [
  {
    id: 1,
    category: 'academic',
    categoryLabelVi: 'HỌC THUẬT',
    categoryLabelEn: 'ACADEMIC',
    titleVi: 'Giáo Viên Tiếng Anh (Full-time / Part-time)',
    titleEn: 'English Teacher (Full-time / Part-time)',
    departmentVi: 'Bộ Phận Học Thuật',
    departmentEn: 'Academic Department',
    typeVi: 'Full-time hoặc Part-time',
    typeEn: 'Full-time or Part-time',
    locationVi: 'Hóc Môn & Quận 12, TP.HCM',
    locationEn: 'Hoc Mon & District 12, HCMC',
    salaryVi: '15.000.000đ – 25.000.000đ / tháng',
    salaryEn: '15,000,000VND – 25,000,000VND / month',
    descVi: 'Giảng dạy các chương trình tiếng Anh trẻ em, thiếu niên và lộ trình IELTS theo phương pháp 4Ls + LETI tại hệ thống phòng học thông minh Smartboard.',
    descEn: 'Teach Kids, Teens, and IELTS acceleration programs using 4Ls + LETI frameworks in 21st Smartboard classrooms.',
    requirementsVi: [
      'Tốt nghiệp Đại học chuyên ngành Sư phạm Anh / Ngôn ngữ Anh hoặc chứng chỉ IELTS 7.5+ / TESOL / CELTA',
      'Có tối thiểu 1 năm kinh nghiệm đứng lớp giảng dạy tiếng Anh',
      'Yêu trẻ, năng động, phát âm chuẩn và giàu nhiệt huyết giáo dục'
    ],
    requirementsEn: [
      'Bachelor in English Pedagogy/Linguistics or IELTS 7.5+ / TESOL / CELTA credentials',
      'Minimum 1 year classroom English teaching experience',
      'Love children, dynamic demeanor, standard pronunciation, and educational passion'
    ],
    benefitsVi: [
      'Thu nhập cạnh tranh + Thưởng chất lượng giảng dạy theo tháng/quý',
      'Được tập huấn định kỳ về phương pháp 4Ls + LETI từ các chuyên gia',
      'Môi trường làm việc quốc tế 100% tiếng Anh chuyên nghiệp'
    ],
    benefitsEn: [
      'Competitive income + Monthly/Quarterly teaching quality bonuses',
      'Regular 4Ls + LETI masterclass training from expert trainers',
      'Professional 100% English international workplace'
    ]
  },
  {
    id: 2,
    category: 'academic',
    categoryLabelVi: 'HỌC THUẬT',
    categoryLabelEn: 'ACADEMIC',
    titleVi: 'Trợ Giảng Tiếng Anh (Teaching Assistant / Tutor)',
    titleEn: 'Teaching Assistant / Tutor (Part-time)',
    departmentVi: 'Bộ Phận Học Thuật',
    departmentEn: 'Academic Department',
    typeVi: 'Part-time (Linh hoạt theo ca)',
    typeEn: 'Part-time (Flexible shifts)',
    locationVi: 'Hóc Môn & Quận 12, TP.HCM',
    locationEn: 'Hoc Mon & District 12, HCMC',
    salaryVi: '35.000đ – 60.000đ / giờ + Thưởng',
    salaryEn: '35,000VND – 60,000VND / hour + Bonuses',
    descVi: 'Hỗ trợ giáo viên trong các buổi học, theo sát tiến độ học tập của từng học viên và tương tác kết nối cùng phụ huynh.',
    descEn: 'Support lead teachers in classes, monitor individual student progress, and connect proactively with parents.',
    requirementsVi: [
      'Sinh viên chuyên ngành Ngôn Ngữ Anh / Sư Phạm hoặc đạt chứng chỉ IELTS 6.5+',
      'Giao tiếp tiếng Anh tự tin, nhiệt tình, có trách nhiệm cao',
      'Ưu tiên ứng viên có kinh nghiệm làm việc với trẻ em'
    ],
    requirementsEn: [
      'University students majoring in English/Pedagogy or IELTS 6.5+',
      'Confident spoken English, enthusiastic, highly responsible',
      'Prior experience working with children preferred'
    ],
    benefitsVi: [
      'Mức lương theo giờ hấp dẫn + Thưởng đánh giá từ phụ huynh',
      'Cơ hội rèn luyện kỹ năng sư phạm và thăng tiến lên Giáo viên chính thức',
      'Cấp giấy chứng nhận thực tập/làm việc tại ICANCAM'
    ],
    benefitsEn: [
      'Attractive hourly rate + Parent evaluation bonuses',
      'Pedagogical skill building & career path to full Lead Teacher',
      'Official internship/employment certificate from ICANCAM'
    ]
  },
  {
    id: 3,
    category: 'sales',
    categoryLabelVi: 'KINH DOANH & TƯ VẤN',
    categoryLabelEn: 'SALES & CONSULTATION',
    titleVi: 'Chuyên Viên Tư Vấn Tuyển Sinh (Academic Consultant)',
    titleEn: 'Academic Admissions Consultant',
    departmentVi: 'Bộ Phận Tuyển Sinh',
    departmentEn: 'Admissions Department',
    typeVi: 'Full-time',
    typeEn: 'Full-time',
    locationVi: 'Hóc Môn & Quận 12, TP.HCM',
    locationEn: 'Hoc Mon & District 12, HCMC',
    salaryVi: '9.000.000đ – 20.000.000đ+ (Lương cứng + % Hoa hồng)',
    salaryEn: '9,000,000VND – 20,000,000VND+ (Base + Commission)',
    descVi: 'Tư vấn lộ trình học phù hợp cho phụ huynh và học viên, tham gia các hoạt động tuyển sinh và chăm sóc học viên đăng ký.',
    descEn: 'Advise parents and students on optimal learning roadmaps, participate in enrollment drives and student care.',
    requirementsVi: [
      'Tốt nghiệp Cao đẳng / Đại học, ưu tiên ngành Khối kinh tế, Giao tiếp hoặc Ngôn ngữ',
      'Kỹ năng giao tiếp và lắng nghe tốt, giọng nói truyền cảm',
      'Yêu thích ngành giáo dục, tác phong chuyên nghiệp, cầu tiến'
    ],
    requirementsEn: [
      'College/University graduate, business or language major preferred',
      'Strong listening & communication skills',
      'Passion for education, professional etiquette, growth mindset'
    ],
    benefitsVi: [
      'Lương cứng ổn định + Hoa hồng doanh số cao + Thưởng KPI vượt trội',
      'Được đào tạo bài bản kỹ năng tư vấn tâm lý khách hàng & dịch vụ',
      'Chế độ bảo hiểm, du lịch hàng năm và quà tặng sinh nhật'
    ],
    benefitsEn: [
      'Solid base salary + High sales commission + Overachievement KPI bonuses',
      'Structured training on customer psychology & educational service',
      'Social insurance, annual retreats, and birthday gifts'
    ]
  },
  {
    id: 4,
    category: 'ops',
    categoryLabelVi: 'VẬN HÀNH & DỊCH VỤ',
    categoryLabelEn: 'OPERATIONS & SERVICE',
    titleVi: 'Chuyên Viên Vận Hành Lớp Học & Dịch Vụ Khách Hàng',
    titleEn: 'Classroom Operations & Customer Service Specialist',
    departmentVi: 'Bộ Phận Vận Hành',
    departmentEn: 'Operations Department',
    typeVi: 'Full-time',
    typeEn: 'Full-time',
    locationVi: 'Hóc Môn & Quận 12, TP.HCM',
    locationEn: 'Hoc Mon & District 12, HCMC',
    salaryVi: '8.000.000đ – 14.000.000đ / tháng',
    salaryEn: '8,000,000VND – 14,000,000VND / month',
    descVi: 'Quản lý vận hành phòng học thông minh Smartboard, theo dõi lịch học, hỗ trợ phụ huynh và quản lý cơ sở vật chất trung tâm.',
    descEn: 'Manage Smartboard classroom operations, schedule tracking, parent support, and campus facility care.',
    requirementsVi: [
      'Tốt nghiệp Cao đẳng / Đại học, có kỹ năng quản lý công việc tốt',
      'Cẩn thận, chỉn chu, có trách nhiệm và giải quyết vấn đề nhanh nhẹn',
      'Thành thạo tin học văn phòng và các phần mềm quản lý'
    ],
    requirementsEn: [
      'College/University graduate with strong task management',
      'Detail-oriented, responsible, agile problem solver',
      'Proficient in MS Office and educational management tools'
    ],
    benefitsVi: [
      'Thu nhập ổn định + Thưởng hiệu quả vận hành cơ sở',
      'Môi trường làm việc thân thiện, văn hóa tôn trọng & gắn kết',
      'Lộ trình thăng tiến rõ ràng lên Quản lý Cơ sở (Center Manager)'
    ],
    benefitsEn: [
      'Stable income + Campus operation performance bonuses',
      'Friendly workplace with respectful & cohesive team culture',
      'Clear career progression pathway to Center Manager'
    ]
  }
];

export const Careers: React.FC = () => {
  const { language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [applicantData, setApplicantData] = useState({
    fullName: '',
    phone: '',
    email: '',
    note: '',
  });

  const filteredJobs = activeCategory === 'all'
    ? jobsData
    : jobsData.filter(job => job.category === activeCategory);

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setApplicantData({ fullName: '', phone: '', email: '', note: '' });
    setTimeout(() => {
      setSubmitted(false);
      setSelectedJob(null);
    }, 4000);
  };

  return (
    <div className={styles.careersWrapper}>
      {/* HERO SECTION */}
      <section className={styles.heroSection}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContainer}>
          <div className={styles.heroBadge}>
            <Sparkles size={16} />
            <span>GIA NHẬP ĐỘI NGŨ ICANCAM</span>
          </div>

          <h1 className={styles.heroTitle}>
            Cơ Hội Nghề Nghiệp & <span className={styles.orangeHighlight}>Phát Triển Sự Nghiệp</span>
          </h1>

          <p className={styles.heroSubtitle}>
            Cùng ICANCAM kiến tạo môi trường giáo dục 21st hiện đại tại Hóc Môn & Quận 12, chắp cánh cho thế hệ trẻ tự tin làm chủ ngôn ngữ và tự học suốt đời.
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
              Khối Học Thuật & Giáo Viên
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

      {/* Transition: Hero (Navy) -> Culture (White) */}
      <SectionTransition variant="navy-to-white" />

      {/* WORKPLACE CULTURE & BENEFITS */}
      <section className={styles.cultureSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>VĂN HÓA LÀM VIỆC</span>
            <h2 className={styles.sectionTitle}>Tại Sao Bạn NÊN Đồng Hành Cùng ICANCAM?</h2>
          </div>

          <div className={styles.cultureGrid}>
            <div className={styles.cultureCard}>
              <Award size={32} color="#F58220" />
              <h3>Thu Nhập & Thưởng Cạnh Tranh</h3>
              <p>Mức lương thưởng xứng đáng theo năng lực, thưởng KPI và chất lượng giảng dạy hàng tháng/quý.</p>
            </div>

            <div className={styles.cultureCard}>
              <GraduationCap size={32} color="#F58220" />
              <h3>Đào Tạo Chuyên Chức Định Kỳ</h3>
              <p>Tập huấn phương pháp 4Ls + LETI & kỹ năng ứng dụng công nghệ Smartboard cùng chuyên gia.</p>
            </div>

            <div className={styles.cultureCard}>
              <Zap size={32} color="#F58220" />
              <h3>Lộ Trình Thăng Tiến Rõ Ràng</h3>
              <p>Cơ hội thăng tiến lên Trưởng bộ phận, Quản lý chuyên môn & Giám đốc cơ sở theo đánh giá minh bạch.</p>
            </div>

            <div className={styles.cultureCard}>
              <Users size={32} color="#F58220" />
              <h3>Môi Trường Trẻ Trung & Gắn Kết</h3>
              <p>Đồng nghiệp nhiệt huyết, văn hóa tôn trọng, hỗ trợ lẫn nhau cùng các hoạt động Teambuilding hàng năm.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Transition: Culture (White) -> Job Openings (Soft Orange) */}
      <SectionTransition variant="white-to-soft-orange" />

      {/* JOB OPENINGS LISTING SECTION */}
      <section className={styles.jobsSection}>
        <div className={styles.container}>
          <div className={styles.jobsGrid}>
            {filteredJobs.map(job => (
              <div key={job.id} className={styles.jobCard}>
                <div className={styles.jobCardTop}>
                  <span className={styles.jobCategoryBadge}>
                    {language === 'en' ? job.categoryLabelEn : job.categoryLabelVi}
                  </span>
                  <span className={styles.salaryTag}>
                    <DollarSign size={15} /> {language === 'en' ? job.salaryEn : job.salaryVi}
                  </span>
                </div>

                <h3 className={styles.jobTitle}>
                  {language === 'en' ? job.titleEn : job.titleVi}
                </h3>
                <p className={styles.jobDesc}>
                  {language === 'en' ? job.descEn : job.descVi}
                </p>

                <div className={styles.jobMetaList}>
                  <div className={styles.jobMetaItem}>
                    <Briefcase size={15} color="#F58220" />
                    <span><strong>Phong ban:</strong> {language === 'en' ? job.departmentEn : job.departmentVi}</span>
                  </div>
                  <div className={styles.jobMetaItem}>
                    <Clock size={15} color="#F58220" />
                    <span><strong>Hình thức:</strong> {language === 'en' ? job.typeEn : job.typeVi}</span>
                  </div>
                  <div className={styles.jobMetaItem}>
                    <MapPin size={15} color="#F58220" />
                    <span><strong>Địa điểm:</strong> {language === 'en' ? job.locationEn : job.locationVi}</span>
                  </div>
                </div>

                <div className={styles.jobActions}>
                  <button className={styles.viewJobBtn} onClick={() => setSelectedJob(job)}>
                    Xem Chi Tiết <ChevronRight size={16} />
                  </button>
                  <button className={styles.applyNowBtn} onClick={() => setSelectedJob(job)}>
                    <Send size={16} /> Ứng Tuyển Ngay
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Transition: Job Openings (Soft Orange) -> CTA (Navy) */}
      <SectionTransition variant="soft-orange-to-navy" />

      {/* RECRUITMENT CTA SECTION */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaCard}>
            <h2>Chưa Tìm Thấy Vị Trí Phù Hợp Nào?</h2>
            <p>Đừng ngần ngại gửi hồ sơ ứng tuyển tự do (Talent Pool) cho ICANCAM. Chúng tôi luôn mở cửa chào đón các nhân tố tài năng đồng hành lâu dài!</p>
            <div className={styles.ctaButtons}>
              <a href="mailto:thieunam2005@gmail.com" className={styles.primaryCtaBtn}>
                Gửi CV Qua Email <Send size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* JOB APPLICATION MODAL */}
      {selectedJob && (
        <div className={styles.modalOverlay} onClick={() => setSelectedJob(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.closeModalBtn} onClick={() => setSelectedJob(null)}>
              <X size={24} />
            </button>

            <div className={styles.modalHeader}>
              <Briefcase size={28} color="#F58220" />
              <div>
                <h2>{language === 'en' ? selectedJob.titleEn : selectedJob.titleVi}</h2>
                <span className={styles.modalMetaTag}>
                  {language === 'en' ? selectedJob.departmentEn : selectedJob.departmentVi} • {language === 'en' ? selectedJob.locationEn : selectedJob.locationVi}
                </span>
              </div>
            </div>

            {submitted ? (
              <div className={styles.successAlert}>
                🎉 Nộp hồ sơ thành công! Bộ phận Tuyển sinh ICANCAM sẽ liên hệ với bạn trong vòng 48h làm việc.
              </div>
            ) : (
              <>
                <div className={styles.modalSection}>
                  <h3>Yêu Cầu Công Việc</h3>
                  <ul className={styles.bulletList}>
                    {(language === 'en' ? selectedJob.requirementsEn : selectedJob.requirementsVi).map((req, idx) => (
                      <li key={idx}><CheckCircle2 size={16} color="#F58220" /> <span>{req}</span></li>
                    ))}
                  </ul>
                </div>

                <div className={styles.modalSection}>
                  <h3>Quyền Lợi Đãi Ngộ</h3>
                  <ul className={styles.bulletList}>
                    {(language === 'en' ? selectedJob.benefitsEn : selectedJob.benefitsVi).map((ben, idx) => (
                      <li key={idx}><Star size={16} color="#F58220" /> <span>{ben}</span></li>
                    ))}
                  </ul>
                </div>

                <div className={styles.applyFormWrapper}>
                  <h3>Form Nộp Hồ Sơ Nhanh</h3>
                  <form onSubmit={handleApplySubmit} className={styles.applyForm}>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label>Họ và tên *</label>
                        <input
                          type="text"
                          required
                          placeholder="Nhập họ và tên..."
                          value={applicantData.fullName}
                          onChange={e => setApplicantData({ ...applicantData, fullName: e.target.value })}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Số điện thoại *</label>
                        <input
                          type="tel"
                          required
                          placeholder="Nhập số điện thoại..."
                          value={applicantData.phone}
                          onChange={e => setApplicantData({ ...applicantData, phone: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label>Email *</label>
                      <input
                        type="email"
                        required
                        placeholder="email@example.com..."
                        value={applicantData.email}
                        onChange={e => setApplicantData({ ...applicantData, email: e.target.value })}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Link CV / Ghi chú thêm</label>
                      <textarea
                        rows={3}
                        placeholder="Dán link Google Drive CV hoặc ghi chú kinh nghiệm..."
                        value={applicantData.note}
                        onChange={e => setApplicantData({ ...applicantData, note: e.target.value })}
                      />
                    </div>

                    <button type="submit" className={styles.submitApplyBtn}>
                      <Send size={18} /> Gửi Hồ Sơ Ứng Tuyển
                    </button>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Careers;
