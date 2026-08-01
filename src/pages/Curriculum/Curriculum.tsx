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
  badge: string;
  age: string;
  desc: string;
  duration: string;
  level: string;
  target: string;
  features: string[];
  syllabus: string[];
}

const coursesData: Course[] = [
  {
    id: 'kids-starter',
    category: 'kids',
    title: 'CAM Kids Starter',
    badge: 'MẦM NON (4 - 6 TUỔI)',
    age: '4 - 6 tuổi',
    desc: 'Khơi dậy niềm đam mê tiếng Anh tự nhiên qua phương pháp Phonics, bài hát, trò chơi tương tác và hoạt động vận động.',
    duration: '12 tháng / 3 khóa',
    level: 'Pre-A1 Starters',
    target: 'Phát âm chuẩn IPA, phản xạ tiếng Anh tự nhiên, tự tin giao tiếp từ câu đơn.',
    features: [
      'Phương pháp Phonics chuẩn Anh Quốc giúp đánh vần tiếng Anh như tiếng Việt',
      'Lớp học Smartboard tương tác trực quan với 100% hình ảnh sinh động',
      'Rèn luyện thói quen tự học và tự tin phát biểu trước đám đông'
    ],
    syllabus: [
      'Module 1: Ngữ âm Phonics cơ bản & Nhận diện bảng chữ cái',
      'Module 2: Từ vựng chủ đề GIA ĐÌNH, ĐỒ CHƠI, MÀU SẮC, ĐỘNG VẬT',
      'Module 3: Giao tiếp câu đơn & Phản xạ nghe nói tự nhiên',
      'Module 4: Thuyết trình dự án nhỏ & Thi lấy chứng chỉ CamKids'
    ]
  },
  {
    id: 'juniors-master',
    category: 'kids',
    title: 'CAM Juniors Master',
    badge: 'TIEU HOC (7 - 11 TUOI)',
    age: '7 - 11 tuổi',
    desc: 'Phát triển toàn diện 4 kỹ năng Nghe - Nói - Đọc - Viết theo phương pháp 4Ls + LETI và chinh phục chứng chỉ Cambridge Starters, Movers, Flyers.',
    duration: '24 tháng / 6 khóa',
    level: 'A1 - A2 (Cambridge)',
    target: 'Đạt 14-15 Khiên Cambridge, tự tin làm chủ 4Ls, rèn luyện tư duy tự học độc lập.',
    features: [
      'Áp dụng mô hình 4Ls kết hợp LETI tương tác 2 chiều liên tục',
      'Giáo trình Anh Quốc chuẩn hóa với ứng dụng phần mềm thông minh',
      'Luyện thi Cambridge song song với nâng cao năng lực tiếng Anh thực tế'
    ],
    syllabus: [
      'Module 1: Củng cố 4Ls & Ngữ pháp ứng dụng học thuật',
      'Module 2: Đọc hiểu văn bản & Phát triển vốn từ phong phú',
      'Module 3: Kỹ năng viết luận ngắn & Thuyết trình chủ đề',
      'Module 4: Luyện đề thi Cambridge Starters / Movers / Flyers'
    ]
  },
  {
    id: 'teens-academic',
    category: 'teens',
    title: 'CAM Teens Academic',
    badge: 'THIEU NIEN (12 - 15 TUOI)',
    age: '12 - 15 tuổi',
    desc: 'Bứt phá điểm số Tiếng Anh trên trường, xây dựng nền tảng ngữ pháp & từ vựng chuyên sâu và chuẩn bị hành trang chinh phục IELTS.',
    duration: '18 tháng / 4 khóa',
    level: 'A2 - B2 (KET / PET / IELTS 5.0+)',
    target: 'Làm chủ kỹ năng tự học độc lập, tư duy phản biện, sẵn sàng bước vào lộ trình IELTS.',
    features: [
      'Rèn luyện tư duy phản biện (Critical Thinking) & kỹ năng thuyết trình',
      'Học qua dự án thực tế giúp ứng dụng kiến thức vào bài luận học thuật',
      'Tài liệu giảng dạy kết hợp đề thi chuyên & thi THPT Quốc gia'
    ],
    syllabus: [
      'Module 1: Ngữ pháp chuyên sâu & Viết đoạn văn nghị luận',
      'Module 2: Kỹ năng đọc nhanh (Skimming & Scanning) văn bản dài',
      'Module 3: Thảo luận nhóm & Thuyết trình chuyên đề bằng Tiếng Anh',
      'Module 4: Chinh phục đề thi KET / PET & Tiền IELTS'
    ]
  },
  {
    id: 'ielts-acceleration',
    category: 'ielts',
    title: 'Lộ Trình IELTS Bứt Tốc (4.5 - 7.5+)',
    badge: 'IELTS ACCELERATION',
    age: 'Từ 13 tuổi trở lên',
    desc: 'Chương trình luyện thi IELTS cá nhân hóa với cam kết đầu ra bằng văn bản. Tập trung làm chủ chiến thuật 4 kỹ năng Nghe - Nói - Đọc - Viết.',
    duration: '6 - 12 tháng',
    level: 'IELTS Target 6.5 - 7.5+',
    target: 'Đạt target IELTS cam kết, thành thạo tư duy học thuật và tự học nâng band điểm.',
    features: [
      'Chữa bài Speaking & Writing 1-1 chuyên sâu từ cựu giám khảo / Giáo viên 8.5+',
      'Hệ thống kho đề thi thử IELTS 3D Smartboard cập nhật hàng tuần',
      'Ký hợp đồng cam kết đầu ra bằng văn bản có giá trị pháp lý'
    ],
    syllabus: [
      'Module 1: IELTS Foundation - Củng cố nền tảng Ngữ âm & Từ vựng Band 5.0',
      'Module 2: IELTS Skill Builder - Chiếm lĩnh phương pháp làm bài Task 1 & Task 2',
      'Module 3: IELTS Intensive - Tăng tốc phản xạ Speaking & Listening nâng cao',
      'Module 4: IELTS Master Mock Test - Luyện đề thực chiến dưới áp lực phòng thi'
    ]
  },
  {
    id: 'comm-practical',
    category: 'comm',
    title: 'Tiếng Anh Giao Tiếp Thực Chiến',
    badge: 'PRACTICAL COMMUNICATION',
    age: 'Sinh viên & Người đi làm',
    desc: 'Phương pháp LETI tập trung phản xạ giao tiếp hai chiều, chuẩn hóa phát âm IPA và ứng dụng trực tiếp trong công việc & môi trường quốc tế.',
    duration: '3 - 6 tháng',
    level: 'Giao tiếp thành thạo',
    target: 'Tự tin giao tiếp với người bản xứ, thuyết trình công việc và phỏng vấn tiếng Anh.',
    features: [
      'Môi trường nhúng 100% tiếng Anh giúp kích hoạt phản xạ giao tiếp tự nhiên',
      'Luyện phỏng vấn xin việc, viết Email công việc & đàm phán hợp đồng',
      'Lịch học linh hoạt ca sáng/tối phù hợp cho người đi làm bận rộn'
    ],
    syllabus: [
      'Module 1: Chuẩn hóa phát âm IPA & Phản xạ nghe nói căn bản',
      'Module 2: Tiếng Anh công sở: Email, Cuộc họp & Tiếp đối tác',
      'Module 3: Thuyết trình dự án & Phỏng vấn tuyển dụng quốc tế',
      'Module 4: Giao tiếp thực chiến & Thảo luận tình huống thực tế'
    ]
  },
  {
    id: 'online-21st',
    category: 'online',
    title: 'iCAM Online Đa Trải Nghiệm',
    badge: 'ONLINE MULTI-EXPERIENCE',
    age: 'Mọi lứa tuổi',
    desc: 'Mô hình học trực tuyến thông minh với màn hình hologram & bảng tương tác hiện đại, giúp học viên học mọi lúc mọi nơi với hiệu quả tối ưu.',
    duration: 'Linh hoạt theo lộ trình',
    level: 'Đa dạng cấp độ',
    target: 'Linh hoạt thời gian & Hiệu quả tương đương Offline',
    features: [
      'Tương tác trực tiếp 1-1 hoặc nhóm nhỏ với giáo viên',
      'Nền tảng học đa phương tiện Anh Quốc kiểm định',
      'Hệ thống theo dõi tiến độ học tập thông minh'
    ],
    syllabus: [
      'Module 1: Kiểm tra trình độ & cá nhân hóa lộ trình học',
      'Module 2: Học tương tác trực tiếp trên phần mềm iCAM',
      'Module 3: Bài tập rèn luyện tự học độc lập hàng ngày',
      'Module 4: Đánh giá năng lực định kỳ & cấp chứng chỉ'
    ]
  }
];

export const Curriculum: React.FC = () => {
  const { t } = useLanguage();
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
                  <span className={styles.badge}>{course.badge}</span>
                  <span className={styles.ageBadge}>{course.age}</span>
                </div>

                <h3 className={styles.courseTitle}>{course.title}</h3>
                <p className={styles.courseDesc}>{course.desc}</p>

                <div className={styles.infoMeta}>
                  <div className={styles.metaItem}>
                    <Clock size={16} color="#F58220" />
                    <span><strong>{t.curriculum.durationLabel}</strong> {course.duration}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <Target size={16} color="#F58220" />
                    <span><strong>{t.curriculum.commitmentLabel}</strong> {course.target}</span>
                  </div>
                </div>

                <div className={styles.featureList}>
                  {course.features.map((feat, idx) => (
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
              <h4>Mô Hình 4Ls + LETI Tương Tác</h4>
              <p>Kết hợp 4 kỹ năng cốt lõi với phương pháp học qua tương tác hai chiều, thảo luận và hoạt động thực tế.</p>
            </div>

            <div className={styles.highlightCard}>
              <div className={styles.highlightIcon}>
                <Monitor size={28} />
              </div>
              <h4>Lớp Học Thông Minh 21st</h4>
              <p>Trang bị Bảng tương tác Smartboard, giáo trình Anh Quốc và ứng dụng công nghệ đa phương tiện trực quan.</p>
            </div>

            <div className={styles.highlightCard}>
              <div className={styles.highlightIcon}>
                <Award size={28} />
              </div>
              <h4>Cam Kết Output Rõ Ràng</h4>
              <p>Lộ trình từng bước cá nhân hóa, đo lường sự tiến bộ định kỳ và cam kết kết quả bằng văn bản.</p>
            </div>

            <div className={styles.highlightCard}>
              <div className={styles.highlightIcon}>
                <Lightbulb size={28} />
              </div>
              <h4>Khai Mở Năng Lực Tự Học</h4>
              <p>Giúp học sinh làm chủ phương pháp tự nghiên cứu độc lập để tự tin phát triển tri thức lâu dài.</p>
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
              <span className={styles.badge}>{selectedCourse.badge}</span>
              <h2>{selectedCourse.title}</h2>
              <p className={styles.modalDesc}>{selectedCourse.desc}</p>
            </div>

            <div className={styles.modalSyllabus}>
              <h3><BookOpen size={20} color="#F58220" /> Chi Tiết Lộ Trình Đào Tạo</h3>
              <div className={styles.syllabusList}>
                {selectedCourse.syllabus.map((moduleItem, i) => (
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
                <GraduationCap size={20} /> Đăng Ký Tư Vấn Khóa Học Phù Hợp
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Curriculum;
