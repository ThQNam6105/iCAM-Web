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

  const [dynamicJobs, setDynamicJobs] = useState<CareersItem[]>([]);

  const loadData = () => {
    const publishedOnly = getAllCareers().filter((j) => j.status === 'open');
    setDynamicJobs(publishedOnly);
  };

  React.useEffect(() => {
    loadData();
    fetchCareersFromSupabase().then(() => loadData());

    const interval = setInterval(() => {
      fetchCareersFromSupabase().then(() => loadData());
    }, 10000);

    return () => clearInterval(interval);
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

  const mappedDynamic: Job[] = dynamicJobs.map((j, idx) => {
    const deptEn = j.departmentEn || (
      j.department.includes('Đào Tạo') ? 'Academic Department' :
      j.department.includes('Tuyển Sinh') ? 'Admissions & Course Consultants' :
      j.department.includes('Marketing') ? 'Marketing Department' :
      j.department.includes('Hành Chính') ? 'Admin & HR Department' :
      j.department.includes('Vận Hành') ? 'Operations Department' : j.department
    );

    return {
      id: 1000 + idx,
      category: j.department.includes('Đào Tạo') ? 'academic' : j.department.includes('Tuyển Sinh') ? 'sales' : 'ops',
      categoryLabelVi: j.department.toUpperCase(),
      categoryLabelEn: deptEn.toUpperCase(),
      titleVi: j.title,
      titleEn: j.titleEn || j.title,
      departmentVi: j.department,
      departmentEn: deptEn,
      typeVi: j.type,
      typeEn: j.type,
      locationVi: j.location,
      locationEn: j.locationEn || j.location,
      salaryVi: j.salary,
      salaryEn: j.salaryEn || j.salary,
      descVi: j.description,
      descEn: j.descriptionEn || j.description,
      requirementsVi: parseBulletItems(j.requirements),
      requirementsEn: parseBulletItems(j.requirementsEn && j.requirementsEn.trim().length > 0 ? j.requirementsEn : j.requirements),
      benefitsVi: parseBulletItems(j.benefits),
      benefitsEn: parseBulletItems(j.benefitsEn && j.benefitsEn.trim().length > 0 ? j.benefitsEn : j.benefits),
    };
  });

  const allCombinedJobs = mappedDynamic;

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
                {(() => {
                  const descText = language === 'en' ? job.descEn : job.descVi;
                  const bullets = parseBulletItems(descText);
                  if (bullets.length > 1) {
                    return (
                      <ul className={styles.cardBulletList}>
                        {bullets.map((item, idx) => (
                          <li key={idx}>• {item}</li>
                        ))}
                      </ul>
                    );
                  }
                  return <p className={styles.jobDesc}>{descText}</p>;
                })()}

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
