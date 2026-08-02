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

interface Course {
  id: string;
  category: 'kids' | 'teens' | 'ielts' | 'comm' | 'online';
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

const coursesData: Course[] = [
  {
    id: 'kids-starter',
    category: 'kids',
    title: 'CAM Kids Starter',
    titleEn: 'CAM Kids Starter',
    badge: 'MẦM NON (4 - 6 TUỔI)',
    badgeEn: 'KINDERGARTEN (AGES 4 - 6)',
    age: '4 - 6 tuổi',
    ageEn: 'Ages 4 - 6',
    desc: 'Khơi dậy niềm đam mê tiếng Anh tự nhiên qua phương pháp Phonics, bài hát, trò chơi tương tác và hoạt động vận động.',
    descEn: 'Inspiring natural English passion through Phonics, songs, interactive games, and movement activities.',
    duration: '12 tháng / 3 khóa',
    durationEn: '12 months / 3 terms',
    level: 'Pre-A1 Starters',
    target: 'Phát âm chuẩn IPA, phản xạ tiếng Anh tự nhiên, tự tin giao tiếp từ câu đơn.',
    targetEn: 'IPA pronunciation, natural English reflexes, and confidence in simple sentences.',
    features: [
      'Phương pháp Phonics chuẩn Anh Quốc giúp đánh vần tiếng Anh như tiếng Việt',
      'Lớp học Smartboard tương tác trực quan với 100% hình ảnh sinh động',
      'Rèn luyện thói quen tự học và tự tin phát biểu trước đám đông'
    ],
    featuresEn: [
      'British Phonics method for spelling English like native speakers',
      'Smartboard interactive classrooms with 100% vivid visual materials',
      'Cultivating self-study habits and public speaking confidence'
    ],
    syllabus: [
      'Module 1: Ngữ âm Phonics cơ bản & Nhận diện bảng chữ cái',
      'Module 2: Từ vựng chủ đề GIA ĐÌNH, ĐỒ CHƠI, MÀU SẮC, ĐỘNG VẬT',
      'Module 3: Giao tiếp câu đơn & Phản xạ nghe nói tự nhiên',
      'Module 4: Thuyết trình dự án nhỏ & Thi lấy chứng chỉ CamKids'
    ],
    syllabusEn: [
      'Module 1: Basic Phonics & Alphabet Recognition',
      'Module 2: Vocabulary themes FAMILY, TOYS, COLORS, ANIMALS',
      'Module 3: Simple sentence communication & natural listening-speaking reflexes',
      'Module 4: Mini project presentation & CamKids certificate exam'
    ]
  },
  {
    id: 'juniors-master',
    category: 'kids',
    title: 'CAM Juniors Master',
    titleEn: 'CAM Juniors Master',
    badge: 'TIỂU HỌC (7 - 11 TUỔI)',
    badgeEn: 'PRIMARY (AGES 7 - 11)',
    age: '7 - 11 tuổi',
    ageEn: 'Ages 7 - 11',
    desc: 'Phát triển toàn diện 4 kỹ năng Nghe - Nói - Đọc - Viết theo phương pháp 4Ls + LETI và chinh phục chứng chỉ Cambridge Starters, Movers, Flyers.',
    descEn: 'Comprehensive 4-skill development (Listening, Speaking, Reading, Writing) with 4Ls + LETI methodology to conquer Cambridge Starters, Movers, Flyers.',
    duration: '24 tháng / 6 khóa',
    durationEn: '24 months / 6 terms',
    level: 'A1 - A2 (Cambridge)',
    target: 'Đạt 14-15 Khiên Cambridge, tự tin làm chủ 4Ls, rèn luyện tư duy tự học độc lập.',
    targetEn: 'Achieving 14-15 Cambridge Shields, mastering 4Ls, and fostering independent self-study mindsets.',
    features: [
      'Áp dụng mô hình 4Ls kết hợp LETI tương tác 2 chiều liên tục',
      'Giáo trình Anh Quốc chuẩn hóa với ứng dụng phần mềm thông minh',
      'Luyện thi Cambridge song song với nâng cao năng lực tiếng Anh thực tế'
    ],
    featuresEn: [
      'Continuous 2-way 4Ls + LETI interactive learning model',
      'Standardized British curriculum with smart software applications',
      'Cambridge exam prep combined with practical English mastery'
    ],
    syllabus: [
      'Module 1: Củng cố 4Ls & Ngữ pháp ứng dụng học thuật',
      'Module 2: Đọc hiểu văn bản & Phát triển vốn từ phong phú',
      'Module 3: Kỹ năng viết luận ngắn & Thuyết trình chủ đề',
      'Module 4: Luyện đề thi Cambridge Starters / Movers / Flyers'
    ],
    syllabusEn: [
      'Module 1: 4Ls consolidation & applied academic grammar',
      'Module 2: Text comprehension & rich vocabulary expansion',
      'Module 3: Short essay writing & thematic presentations',
      'Module 4: Cambridge Starters / Movers / Flyers mock exam training'
    ]
  },
  {
    id: 'teens-academic',
    category: 'teens',
    title: 'CAM Teens Academic',
    titleEn: 'CAM Teens Academic',
    badge: 'THIẾU NIÊN (12 - 15 TUỔI)',
    badgeEn: 'TEENS (AGES 12 - 15)',
    age: '12 - 15 tuổi',
    ageEn: 'Ages 12 - 15',
    desc: 'Bứt phá điểm số Tiếng Anh trên trường, xây dựng nền tảng ngữ pháp & từ vựng chuyên sâu và chuẩn bị hành trang chinh phục IELTS.',
    descEn: 'Boosting school grades, building advanced grammar & academic vocabulary, and laying foundations for IELTS success.',
    duration: '18 tháng / 4 khóa',
    durationEn: '18 months / 4 terms',
    level: 'A2 - B2 (KET / PET / IELTS 5.0+)',
    target: 'Làm chủ kỹ năng tự học độc lập, tư duy phản biện, sẵn sàng bước vào lộ trình IELTS.',
    targetEn: 'Mastering independent self-study, critical thinking, and readiness for IELTS pathways.',
    features: [
      'Rèn luyện tư duy phản biện (Critical Thinking) & kỹ năng thuyết trình',
      'Học qua dự án thực tế giúp ứng dụng kiến thức vào bài luận học thuật',
      'Tài liệu giảng dạy kết hợp đề thi chuyên & thi THPT Quốc gia'
    ],
    featuresEn: [
      'Critical Thinking training & presentation skills',
      'Project-based learning applied to academic essays',
      'Course materials integrating specialized & national high school exams'
    ],
    syllabus: [
      'Module 1: Ngữ pháp chuyên sâu & Viết đoạn văn nghị luận',
      'Module 2: Kỹ năng đọc nhanh (Skimming & Scanning) văn bản dài',
      'Module 3: Thảo luận nhóm & Thuyết trình chuyên đề bằng Tiếng Anh',
      'Module 4: Chinh phục đề thi KET / PET & Tiền IELTS'
    ],
    syllabusEn: [
      'Module 1: Advanced grammar & argumentative paragraph writing',
      'Module 2: Skimming & Scanning skills for long texts',
      'Module 3: Group discussion & thematic presentation in English',
      'Module 4: KET / PET & Pre-IELTS exam preparation'
    ]
  },
  {
    id: 'ielts-acceleration',
    category: 'ielts',
    title: 'Lộ Trình IELTS Bứt Tốc (4.5 - 7.5+)',
    titleEn: 'IELTS Acceleration Pathway (4.5 - 7.5+)',
    badge: 'IELTS ACCELERATION',
    badgeEn: 'IELTS ACCELERATION',
    age: 'Từ 13 tuổi trở lên',
    ageEn: 'Ages 13 and above',
    desc: 'Chương trình luyện thi IELTS cá nhân hóa với cam kết đầu ra bằng văn bản. Tập trung làm chủ chiến thuật 4 kỹ năng Nghe - Nói - Đọc - Viết.',
    descEn: 'Personalized IELTS exam preparation with written outcome contracts. Focus on 4-skill strategy mastery.',
    duration: '6 - 12 tháng',
    durationEn: '6 - 12 months',
    level: 'IELTS Target 6.5 - 7.5+',
    target: 'Đạt target IELTS cam kết, thành thạo tư duy học thuật và tự học nâng band điểm.',
    targetEn: 'Reaching guaranteed IELTS targets, mastering academic thinking for band score growth.',
    features: [
      'Chữa bài Speaking & Writing 1-1 chuyên sâu từ cựu giám khảo / Giáo viên 8.5+',
      'Hệ thống kho đề thi thử IELTS 3D Smartboard cập nhật hàng tuần',
      'Ký hợp đồng cam kết đầu ra bằng văn bản có giá trị pháp lý'
    ],
    featuresEn: [
      '1-on-1 intensive Speaking & Writing feedback from ex-examiners / 8.5+ tutors',
      '3D Smartboard IELTS mock exam question bank updated weekly',
      'Written output guarantee contract with legal value'
    ],
    syllabus: [
      'Module 1: IELTS Foundation - Củng cố nền tảng Ngữ âm & Từ vựng Band 5.0',
      'Module 2: IELTS Skill Builder - Chiếm lĩnh phương pháp làm bài Task 1 & Task 2',
      'Module 3: IELTS Intensive - Tăng tốc phản xạ Speaking & Listening nâng cao',
      'Module 4: IELTS Master Mock Test - Luyện đề thực chiến dưới áp lực phòng thi'
    ],
    syllabusEn: [
      'Module 1: IELTS Foundation - Phonetics & Band 5.0 vocabulary',
      'Module 2: IELTS Skill Builder - Task 1 & Task 2 methodology mastery',
      'Module 3: IELTS Intensive - Advanced Speaking & Listening reflexes',
      'Module 4: IELTS Master Mock Test - Real test pressure simulation'
    ]
  },
  {
    id: 'comm-practical',
    category: 'comm',
    title: 'Tiếng Anh Giao Tiếp Thực Chiến',
    titleEn: 'Practical Communication English',
    badge: 'PRACTICAL COMMUNICATION',
    badgeEn: 'PRACTICAL COMMUNICATION',
    age: 'Sinh viên & Người đi làm',
    ageEn: 'Students & Professionals',
    desc: 'Phương pháp LETI tập trung phản xạ giao tiếp hai chiều, chuẩn hóa phát âm IPA và ứng dụng trực tiếp trong công việc & môi trường quốc tế.',
    descEn: 'LETI methodology focusing on two-way communication reflexes, IPA pronunciation, and direct workplace application.',
    duration: '3 - 6 tháng',
    durationEn: '3 - 6 months',
    level: 'Giao tiếp thành thạo',
    target: 'Tự tin giao tiếp với người bản xứ, thuyết trình công việc và phỏng vấn tiếng Anh.',
    targetEn: 'Confident communication with native speakers, business presentations, and English job interviews.',
    features: [
      'Môi trường nhúng 100% tiếng Anh giúp kích hoạt phản xạ giao tiếp tự nhiên',
      'Luyện phỏng vấn xin việc, viết Email công việc & đàm phán hợp đồng',
      'Lịch học linh hoạt ca sáng/tối phù hợp cho người đi làm bận rộn'
    ],
    featuresEn: [
      '100% English immersion environment triggering natural reflexes',
      'Job interview prep, business email writing & contract negotiations',
      'Flexible morning/evening schedules for busy working adults'
    ],
    syllabus: [
      'Module 1: Chuẩn hóa phát âm IPA & Phản xạ nghe nói căn bản',
      'Module 2: Tiếng Anh công sở: Email, Cuộc họp & Tiếp đối tác',
      'Module 3: Thuyết trình dự án & Phỏng vấn tuyển dụng quốc tế',
      'Module 4: Giao tiếp thực chiến & Thảo luận tình huống thực tế'
    ],
    syllabusEn: [
      'Module 1: IPA pronunciation & basic speech reflexes',
      'Module 2: Workplace English: Emails, Meetings & Client Receptions',
      'Module 3: Project presentation & international job interviews',
      'Module 4: Real-world communication & scenario discussions'
    ]
  },
  {
    id: 'online-21st',
    category: 'online',
    title: 'iCAM Online Đa Trải Nghiệm',
    titleEn: 'iCAM Online 21st',
    badge: 'ONLINE MULTI-EXPERIENCE',
    badgeEn: 'ONLINE MULTI-EXPERIENCE',
    age: 'Mọi lứa tuổi',
    ageEn: 'All Ages',
    desc: 'Mô hình học trực tuyến thông minh với màn hình hologram & bảng tương tác hiện đại, giúp học viên học mọi lúc mọi nơi với hiệu quả tối ưu.',
    descEn: 'Smart online learning model with hologram displays & modern interactive boards, allowing flexible learning anytime anywhere.',
    duration: 'Linh hoạt theo lộ trình',
    durationEn: 'Flexible per pathway',
    level: 'Đa dạng cấp độ',
    target: 'Linh hoạt thời gian & Hiệu quả tương đương Offline',
    targetEn: 'Flexible schedule with effectiveness equal to Offline classes.',
    features: [
      'Tương tác trực tiếp 1-1 hoặc nhóm nhỏ với giáo viên',
      'Nền tảng học đa phương tiện Anh Quốc kiểm định',
      'Hệ thống theo dõi tiến độ học tập thông minh'
    ],
    featuresEn: [
      'Direct 1-on-1 or small group interaction with teachers',
      'Verified British multimedia learning platform',
      'Smart learning progress tracking system'
    ],
    syllabus: [
      'Module 1: Kiểm tra trình độ & cá nhân hóa lộ trình học',
      'Module 2: Học tương tác trực tiếp trên phần mềm iCAM',
      'Module 3: Bài tập rèn luyện tự học độc lập hàng ngày',
      'Module 4: Đánh giá năng lực định kỳ & cấp chứng chỉ'
    ],
    syllabusEn: [
      'Module 1: Proficiency assessment & personalized learning roadmap',
      'Module 2: Direct interactive learning on iCAM platform',
      'Module 3: Daily independent self-study exercises',
      'Module 4: Periodic evaluation & certificate issuance'
    ]
  }
];

export const Curriculum: React.FC = () => {
  const { language, t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const filteredCourses = activeCategory === 'all'
    ? coursesData
    : coursesData.filter(course => course.category === activeCategory);

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
