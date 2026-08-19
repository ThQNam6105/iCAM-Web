import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Target,
  Award,
  Sparkles,
  ArrowRight,
  GraduationCap,
  Star,
  X,
  Zap,
  Monitor,
  Lightbulb,
  FileText
} from 'lucide-react';
import styles from './Curriculum.module.css';
import { useLanguage } from '../../contexts/LanguageContext';
import { SectionTransition } from '../../components/SectionTransition/SectionTransition';
import { fetchCoursesFromSupabase, fetchCourseCategoriesFromSupabase, getAllCourses, type CourseCategoryItem, type CourseItem } from '../../services/courseService';

interface Course {
  id: string;
  category: string;
  title: string;
  titleEn?: string;
  badge: string;
  badgeEn?: string;
  age: string;
  ageEn?: string;
  desc: string;
  descEn?: string;
  duration: string;
  durationEn?: string;
  level: string;
  levelEn?: string;
  target: string;
  targetEn?: string;
  features: string[];
  featuresEn?: string[];
  syllabus: string[];
  syllabusEn?: string[];
}

const mapCourseItemToCourse = (c: CourseItem): Course => ({
  id: c.id,
  category: c.category,
  title: c.titleVi,
  titleEn: c.titleEn || c.titleVi,
  badge: c.badgeVi || c.courseCode,
  badgeEn: c.badgeEn || c.courseCode,
  age: c.targetAgeVi,
  ageEn: c.targetAgeEn || c.targetAgeVi,
  desc: c.descriptionVi,
  descEn: c.descriptionEn || c.descriptionVi,
  duration: c.durationVi,
  durationEn: c.durationEn || c.durationVi,
  level: c.levelVi,
  levelEn: c.levelEn || c.levelVi,
  target: c.targetOutputVi,
  targetEn: c.targetOutputEn || c.targetOutputVi,
  features: c.featuresVi,
  featuresEn: c.featuresEn && c.featuresEn.length ? c.featuresEn : c.featuresVi,
  syllabus: c.syllabusVi,
  syllabusEn: c.syllabusEn && c.syllabusEn.length ? c.syllabusEn : c.syllabusVi,
});

export const Curriculum: React.FC = () => {
  const { language, t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [liveCourses, setLiveCourses] = useState<Course[]>(() => {
    return getAllCourses().map(mapCourseItemToCourse);
  });
  const [categoriesList, setCategoriesList] = useState<CourseCategoryItem[]>([]);

  React.useEffect(() => {
    fetchCourseCategoriesFromSupabase().then((cats) => {
      if (cats && cats.length > 0) {
        setCategoriesList(cats);
      }
    });

    fetchCoursesFromSupabase().then((data) => {
      if (data) {
        const mapped: Course[] = data
          .filter((c) => c.status === 'active')
          .map(mapCourseItemToCourse);
        setLiveCourses(mapped);
      }
    });
  }, []);

  const filteredCourses = activeCategory === 'all'
    ? liveCourses
    : liveCourses.filter(course => course.category === activeCategory);

  return (
    <div className={styles.curriculumWrapper}>
      {/* HERO SECTION */}
      <section className={styles.heroSection}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContainer}>
          <div className={styles.heroBadge}>
            <Sparkles size={16} />
            <span>{t.curriculum.heroBadge}</span>
          </div>

          <h1 className={styles.heroTitle}>
            {t.curriculum.heroTitle}
          </h1>

          <p className={styles.heroSubtitle}>
            {t.curriculum.heroSubtitle}
          </p>

          {/* Quick Category Filter Pills */}
          <div className={styles.filterBar}>
            <button
              className={`${styles.filterBtn} ${activeCategory === 'all' ? styles.activeFilter : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              {t.curriculum.filterAll}
            </button>
            {categoriesList.length > 0 ? (
              categoriesList.map((cat) => (
                <button
                  key={cat.id}
                  className={`${styles.filterBtn} ${activeCategory === cat.id ? styles.activeFilter : ''}`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  {language === 'en' ? (cat.nameEn || cat.nameVi) : cat.nameVi}
                </button>
              ))
            ) : (
              <>
                <button
                  className={`${styles.filterBtn} ${activeCategory === 'kids' ? styles.activeFilter : ''}`}
                  onClick={() => setActiveCategory('kids')}
                >
                  {t.curriculum.filterKids}
                </button>
                <button
                  className={`${styles.filterBtn} ${activeCategory === 'teens' ? styles.activeFilter : ''}`}
                  onClick={() => setActiveCategory('teens')}
                >
                  {t.curriculum.filterTeens}
                </button>
                <button
                  className={`${styles.filterBtn} ${activeCategory === 'ielts' ? styles.activeFilter : ''}`}
                  onClick={() => setActiveCategory('ielts')}
                >
                  {t.curriculum.filterIelts}
                </button>
                <button
                  className={`${styles.filterBtn} ${activeCategory === 'comm' ? styles.activeFilter : ''}`}
                  onClick={() => setActiveCategory('comm')}
                >
                  {t.curriculum.filterComm}
                </button>
                <button
                  className={`${styles.filterBtn} ${activeCategory === 'online' ? styles.activeFilter : ''}`}
                  onClick={() => setActiveCategory('online')}
                >
                  {t.curriculum.filterOnline}
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Transition: Hero (Navy) -> Courses Grid (Soft Orange) */}
      <SectionTransition variant="navy-to-soft-orange" />

      {/* MAIN COURSES GRID SECTION */}
      <section className={styles.coursesSection}>
        <div className={styles.container}>
          <div className={styles.coursesGrid}>
            {filteredCourses.map((course) => (
              <div key={course.id} className={styles.courseCard}>
                <div className={styles.cardHeader}>
                  <span className={styles.badge}>
                    {language === 'en' ? (course.badgeEn || course.badge) : course.badge}
                  </span>
                  <span className={styles.ageBadge}>
                    {language === 'en' ? (course.ageEn || course.age) : course.age}
                  </span>
                </div>

                <h3 className={styles.courseTitle}>
                  {language === 'en' ? (course.titleEn || course.title) : course.title}
                </h3>
                <p className={styles.courseDesc}>
                  {language === 'en' ? (course.descEn || course.desc) : course.desc}
                </p>

                <div className={styles.infoMeta}>
                  <div className={styles.metaItem}>
                    <Clock size={16} color="#F58220" />
                    <span>
                      <strong>{t.curriculum.durationLabel}</strong>{' '}
                      {language === 'en' ? (course.durationEn || course.duration) : course.duration}
                    </span>
                  </div>
                  <div className={styles.metaItem}>
                    <Target size={16} color="#F58220" />
                    <span>
                      <strong>{t.curriculum.commitmentLabel}</strong>{' '}
                      {language === 'en' ? (course.targetEn || course.target) : course.target}
                    </span>
                  </div>
                </div>

                <div className={styles.featureList}>
                  {(language === 'en' ? (course.featuresEn || course.features) : course.features).map((feat, idx) => (
                    <div key={idx} className={styles.featureItem}>
                      <CheckCircle2 size={16} color="#F58220" className={styles.checkIcon} />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <div className={styles.cardActions}>
                  <button
                    className={styles.syllabusBtn}
                    onClick={() => setSelectedCourse(course)}
                  >
                    <FileText size={16} /> {t.curriculum.viewSyllabusBtn}
                  </button>
                  <Link to="/contact" className={styles.registerBtn}>
                    <GraduationCap size={18} /> {t.curriculum.registerBtn}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Transition: Courses Grid (Soft Orange) -> Why Curriculum Works (White) */}
      <SectionTransition variant="soft-orange-to-white" />

      {/* WHY OUR CURRICULUM WORKS */}
      <section className={styles.whyCurriculumSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTag}>
              <Zap size={16} />
              <span>{t.curriculum.whyTag}</span>
            </div>
            <h2 className={styles.sectionTitle}>
              {t.curriculum.whyTitle}
            </h2>
          </div>

          <div className={styles.highlightsGrid}>
            <div className={styles.highlightCard}>
              <div className={styles.highlightIcon}>
                <BookOpen size={28} />
              </div>
              <h4>{t.curriculum.whyCard1Title}</h4>
              <p>{t.curriculum.whyCard1Desc}</p>
            </div>

            <div className={styles.highlightCard}>
              <div className={styles.highlightIcon}>
                <Monitor size={28} />
              </div>
              <h4>{t.curriculum.whyCard2Title}</h4>
              <p>{t.curriculum.whyCard2Desc}</p>
            </div>

            <div className={styles.highlightCard}>
              <div className={styles.highlightIcon}>
                <Award size={28} />
              </div>
              <h4>{t.curriculum.whyCard3Title}</h4>
              <p>{t.curriculum.whyCard3Desc}</p>
            </div>

            <div className={styles.highlightCard}>
              <div className={styles.highlightIcon}>
                <Lightbulb size={28} />
              </div>
              <h4>{t.curriculum.whyCard4Title}</h4>
              <p>{t.curriculum.whyCard4Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Transition: Why Curriculum Works (White) -> CTA (Navy) */}
      <SectionTransition variant="white-to-navy" />

      {/* CTA SECTION */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaCard}>
            <h2>{t.curriculum.ctaTitle}</h2>
            <p>
              {t.curriculum.ctaDesc}
            </p>
            <div className={styles.ctaButtons}>
              <Link to="/contact" className={styles.primaryCtaBtn}>
                {t.curriculum.ctaPrimaryBtn} <ArrowRight size={18} />
              </Link>
              <a href="tel:0909123456" className={styles.secondaryCtaBtn}>
                {t.curriculum.ctaSecondaryBtn}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* COURSE DETAIL MODAL */}
      {selectedCourse && (
        <div className={styles.modalOverlay} onClick={() => setSelectedCourse(null)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setSelectedCourse(null)}>
              <X size={24} />
            </button>

            <div className={styles.modalHeader}>
              <span className={styles.badge}>
                {language === 'en' ? (selectedCourse.badgeEn || selectedCourse.badge) : selectedCourse.badge}
              </span>
              <h2>
                {language === 'en' ? (selectedCourse.titleEn || selectedCourse.title) : selectedCourse.title}
              </h2>
              <p className={styles.modalDesc}>
                {language === 'en' ? (selectedCourse.descEn || selectedCourse.desc) : selectedCourse.desc}
              </p>
            </div>

            <div className={styles.modalSyllabus}>
              <h3><BookOpen size={20} color="#F58220" /> {t.curriculum.modalSyllabusTitle}</h3>
              <div className={styles.syllabusList}>
                {(language === 'en' ? (selectedCourse.syllabusEn || selectedCourse.syllabus) : selectedCourse.syllabus).map((moduleItem, i) => (
                  <div key={i} className={styles.syllabusItem}>
                    <Star size={16} color="#F58220" className={styles.starIcon} />
                    <span>{moduleItem}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.modalFooter}>
              <Link
                to="/contact"
                className={styles.modalRegisterBtn}
                onClick={() => setSelectedCourse(null)}
              >
                <GraduationCap size={20} /> {t.curriculum.modalRegisterBtn}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Curriculum;
