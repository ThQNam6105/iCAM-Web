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
      'Môi trường làm việc năng động, lộ trình thăng tiến Trưởng nhóm / Quản lý',
      'Được đào tạo bài bản kỹ năng tư vấn chuyên nghiệp'
    ],
    benefitsEn: [
      'Competitive base salary + Generous commission + KPI bonuses',
      'Dynamic environment, career track to Team Leader / Admissions Manager',
      'Comprehensive professional sales & consultation training'
    ]
  },
  {
    id: 4,
    category: 'ops',
    categoryLabelVi: 'VẬN HÀNH & DỊCH VỤ',
    categoryLabelEn: 'OPERATIONS & SERVICES',
    titleVi: 'Chuyên Viên Dịch Vụ Khách Hàng (Customer Care Officer)',
    titleEn: 'Customer Care & Academic Support Officer',
    departmentVi: 'Bộ Phận Vận Hành',
    departmentEn: 'Operations Department',
    typeVi: 'Full-time',
    typeEn: 'Full-time',
    locationVi: 'Hóc Môn & Quận 12, TP.HCM',
    locationEn: 'Hoc Mon & District 12, HCMC',
    salaryVi: '8.500.000đ – 14.000.000đ / tháng',
    salaryEn: '8,500,000VND – 14,000,000VND / month',
    descVi: 'Quản lý điểm danh, theo dõi lịch học, hỗ trợ giải đáp thắc mắc của phụ huynh và đảm bảo cơ sở vật chất phòng học.',
    descEn: 'Manage class attendance, track study schedules, assist parent inquiries, and oversee classroom facilities.',
    requirementsVi: [
      'Tốt nghiệp Cao đẳng / Đại học, khả năng bao quát công việc tốt',
      'Cẩn thận, chỉn chu, có trách nhiệm và kỹ năng xử lý tình huống tốt',
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

import { fetchCareersFromSupabase, getAllCareers, type CareersItem } from '../../services/careersService';

export const Careers: React.FC = () => {
  const { language, t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [applicantData, setApplicantData] = useState({
    fullName: '',
    phone: '',
    email: '',
    note: '',
  });

  const [dynamicJobs, setDynamicJobs] = useState<CareersItem[]>(() => {
    return getAllCareers().filter((j) => j.status === 'open');
  });

  React.useEffect(() => {
    fetchCareersFromSupabase().then(() => {
      const openJobs = getAllCareers().filter((j) => j.status === 'open');
      setDynamicJobs(openJobs);
    });
  }, []);

  const parseBulletItems = (input: string | string[]): string[] => {
    if (!input) return [];
    if (Array.isArray(input)) {
      return input.flatMap((item) =>
        item
          .split(/\n|•/)
          .map((s) => s.replace(/^[-•\s]+/, '').trim())
          .filter((s) => s.length > 0)
      );
    }
    return input
      .split(/\n|•/)
      .map((s) => s.replace(/^[-•\s]+/, '').trim())
      .filter((s) => s.length > 0);
  };

  const mappedDynamic: Job[] = dynamicJobs.map((j, idx) => ({
    id: 1000 + idx,
    category: j.department.includes('Đào Tạo') ? 'academic' : j.department.includes('Tuyển Sinh') ? 'sales' : 'ops',
    categoryLabelVi: j.department.toUpperCase(),
    categoryLabelEn: j.department.toUpperCase(),
    titleVi: j.title,
    titleEn: j.titleEn || j.title,
    departmentVi: j.department,
    departmentEn: j.department,
    typeVi: j.type,
    typeEn: j.type,
    locationVi: j.location,
    locationEn: j.location,
    salaryVi: j.salary,
    salaryEn: j.salary,
    descVi: j.description,
    descEn: j.description,
    requirementsVi: parseBulletItems(j.requirements),
    requirementsEn: parseBulletItems(j.requirements),
    benefitsVi: parseBulletItems(j.benefits),
    benefitsEn: parseBulletItems(j.benefits),
  }));

  const allCombinedJobs = mappedDynamic.length > 0 ? mappedDynamic : jobsData;

  const filteredJobs = activeCategory === 'all'
    ? allCombinedJobs
    : allCombinedJobs.filter(job => job.category === activeCategory);

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
            <span>{t.careers.heroBadge}</span>
          </div>

          <h1 className={styles.heroTitle}>
            {t.careers.heroTitlePrefix}
            <span className={styles.orangeHighlight}>
              {t.careers.heroTitleHighlight}
            </span>
          </h1>

          <p className={styles.heroSubtitle}>
            {t.careers.heroSubtitle}
          </p>

          {/* Category Filter Pills */}
          <div className={styles.filterBar}>
            <button
              className={`${styles.filterBtn} ${activeCategory === 'all' ? styles.activeFilter : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              {t.careers.filterAll}
            </button>
            <button
              className={`${styles.filterBtn} ${activeCategory === 'academic' ? styles.activeFilter : ''}`}
              onClick={() => setActiveCategory('academic')}
            >
              {t.careers.filterAcademic}
            </button>
            <button
              className={`${styles.filterBtn} ${activeCategory === 'sales' ? styles.activeFilter : ''}`}
              onClick={() => setActiveCategory('sales')}
            >
              {t.careers.filterSales}
            </button>
            <button
              className={`${styles.filterBtn} ${activeCategory === 'ops' ? styles.activeFilter : ''}`}
              onClick={() => setActiveCategory('ops')}
            >
              {t.careers.filterOps}
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
            <span className={styles.sectionTag}>{t.careers.cultureTag}</span>
            <h2 className={styles.sectionTitle}>{t.careers.cultureTitle}</h2>
          </div>

          <div className={styles.cultureGrid}>
            <div className={styles.cultureCard}>
              <Award size={32} color="#F58220" />
              <h3>{t.careers.cultureCard1Title}</h3>
              <p>{t.careers.cultureCard1Desc}</p>
            </div>

            <div className={styles.cultureCard}>
              <GraduationCap size={32} color="#F58220" />
              <h3>{t.careers.cultureCard2Title}</h3>
              <p>{t.careers.cultureCard2Desc}</p>
            </div>

            <div className={styles.cultureCard}>
              <Zap size={32} color="#F58220" />
              <h3>{t.careers.cultureCard3Title}</h3>
              <p>{t.careers.cultureCard3Desc}</p>
            </div>

            <div className={styles.cultureCard}>
              <Users size={32} color="#F58220" />
              <h3>{t.careers.cultureCard4Title}</h3>
              <p>{t.careers.cultureCard4Desc}</p>
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
                    <span><strong>{t.careers.deptLabel}</strong> {language === 'en' ? job.departmentEn : job.departmentVi}</span>
                  </div>
                  <div className={styles.jobMetaItem}>
                    <Clock size={15} color="#F58220" />
                    <span><strong>{t.careers.typeLabel}</strong> {language === 'en' ? job.typeEn : job.typeVi}</span>
                  </div>
                  <div className={styles.jobMetaItem}>
                    <MapPin size={15} color="#F58220" />
                    <span><strong>{t.careers.locLabel}</strong> {language === 'en' ? job.locationEn : job.locationVi}</span>
                  </div>
                </div>

                <div className={styles.jobActions}>
                  <button className={styles.viewJobBtn} onClick={() => setSelectedJob(job)}>
                    {t.careers.viewDetailBtn} <ChevronRight size={16} />
                  </button>
                  <button className={styles.applyNowBtn} onClick={() => setSelectedJob(job)}>
                    <Send size={16} /> {t.careers.applyNowBtn}
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
            <h2>{t.careers.ctaTitle}</h2>
            <p>{t.careers.ctaDesc}</p>
            <div className={styles.ctaButtons}>
              <a href="mailto:thieunam2005@gmail.com" className={styles.primaryCtaBtn}>
                {t.careers.ctaSendEmailBtn} <Send size={16} />
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
                {t.careers.successAlert}
              </div>
            ) : (
              <>
                <div className={styles.modalSection}>
                  <h3>{t.careers.modalReqTitle}</h3>
                  <ul className={styles.bulletList}>
                    {parseBulletItems(language === 'en' ? selectedJob.requirementsEn : selectedJob.requirementsVi).map((req, idx) => (
                      <li key={idx}><CheckCircle2 size={16} color="#F58220" /> <span>{req}</span></li>
                    ))}
                  </ul>
                </div>

                <div className={styles.modalSection}>
                  <h3>{t.careers.modalBenTitle}</h3>
                  <ul className={styles.bulletList}>
                    {parseBulletItems(language === 'en' ? selectedJob.benefitsEn : selectedJob.benefitsVi).map((ben, idx) => (
                      <li key={idx}><Star size={16} color="#F58220" /> <span>{ben}</span></li>
                    ))}
                  </ul>
                </div>

                <div className={styles.applyFormWrapper}>
                  <h3>{t.careers.modalFormTitle}</h3>
                  <form onSubmit={handleApplySubmit} className={styles.applyForm}>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label>{t.careers.fullNameLabel}</label>
                        <input
                          type="text"
                          required
                          placeholder={t.careers.fullNamePlaceholder}
                          value={applicantData.fullName}
                          onChange={e => setApplicantData({ ...applicantData, fullName: e.target.value })}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>{t.careers.phoneLabel}</label>
                        <input
                          type="tel"
                          required
                          placeholder={t.careers.phonePlaceholder}
                          value={applicantData.phone}
                          onChange={e => setApplicantData({ ...applicantData, phone: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label>{t.careers.emailLabel}</label>
                      <input
                        type="email"
                        required
                        placeholder="email@example.com..."
                        value={applicantData.email}
                        onChange={e => setApplicantData({ ...applicantData, email: e.target.value })}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>{t.careers.noteLabel}</label>
                      <textarea
                        rows={3}
                        placeholder={t.careers.notePlaceholder}
                        value={applicantData.note}
                        onChange={e => setApplicantData({ ...applicantData, note: e.target.value })}
                      />
                    </div>

                    <button type="submit" className={styles.submitApplyBtn}>
                      <Send size={18} /> {t.careers.submitApplyBtn}
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
