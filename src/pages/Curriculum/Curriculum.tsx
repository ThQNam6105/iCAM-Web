import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Clock,
  Target,
  Award,
  Users,
  ArrowRight,
  ChevronRight,
  Star,
  Zap,
  Monitor,
  Lightbulb,
  X
} from 'lucide-react';
import styles from './Curriculum.module.css';

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
    title: 'CAM Kids Starter (4 – 6 tuổi)',
    badge: 'KIDS ENGLISH',
    age: '4 – 6 tuổi',
    desc: 'Phương pháp Phonics chuẩn Anh Quốc giúp trẻ khơi gợi niềm yêu thích tiếng Anh, thẩm thấu ngữ âm tự nhiên và phát âm chuẩn bản xứ ngay từ nhỏ.',
    duration: '24 buổi / khóa',
    level: 'Mầm non (Mới bắt đầu)',
    target: 'Phát âm chuẩn Phonics & Tự tin phản xạ đơn giản',
    features: [
      'Học qua trò chơi trí tuệ & bài hát tương tác',
      'Môi trường 100% tiếng Anh thẩm thấu tự nhiên',
      'Lớp học Smartboard trực quan sinh động'
    ],
    syllabus: [
      'Module 1: Nhận diện bảng chữ cái & Ngữ âm Phonics chuẩn',
      'Module 2: Từ vựng chủ đề gia đình, trường học & đồ chơi',
      'Module 3: Phản xạ hội thoại chào hỏi & câu hỏi ngắn',
      'Module 4: Tự tin biểu diễn bài hát & kể chuyện tiếng Anh'
    ]
  },
  {
    id: 'juniors-cambridge',
    category: 'kids',
    title: 'CAM Juniors (7 – 11 tuổi)',
    badge: 'CAMBRIDGE STARTERS / MOVERS / FLYERS',
    age: '7 – 11 tuổi',
    desc: 'Phát triển toàn diện 4 kỹ năng Nghe - Nói - Đọc - Viết qua phương pháp LETI tương tác, chuẩn bị nền tảng vững chắc cho chứng chỉ Cambridge.',
    duration: '36 buổi / khóa',
    level: 'Tiểu học (Starters - Flyers)',
    target: 'Đạt khiên Cambridge tối đa & Tự tin giao tiếp',
    features: [
      'Phương pháp LETI tương tác thảo luận nhóm',
      'Rèn luyện tư duy phản biện & thuyết trình',
      'Cam kết đầu ra chuẩn chứng chỉ Cambridge'
    ],
    syllabus: [
      'Module 1: Củng cố từ vựng & cấu trúc câu chuẩn Cambridge',
      'Module 2: Luyện kỹ năng Đọc hiểu & Viết đoạn văn ngắn',
      'Module 3: Phản xạ Nghe hiểu hội thoại tốc độ tự nhiên',
      'Module 4: Kỹ năng thuyết trình đề tài cá nhân trước lớp'
    ]
  },
  {
    id: 'teens-master',
    category: 'teens',
    title: 'CAM Teens Master (12 – 15 tuổi)',
    badge: 'TEENS ACADEMIC',
    age: '12 – 15 tuổi',
    desc: 'Nâng cao tư duy ngôn ngữ học thuật, làm chủ kỹ năng tự học độc lập và đặt nền tảng vững chắc cho các kỳ thi học sinh giỏi & IELTS.',
    duration: '36 buổi / khóa',
    level: 'THCS (A2 – B1)',
    target: 'Tự học độc lập & Sẵn sàng lộ trình IELTS',
    features: [
      'Tập trung phát triển tư duy phản biện & luận điểm',
      'Kỹ năng viết essay & thảo luận chuyên sâu',
      'Mô hình 4Ls kết hợp công nghệ multimedia'
    ],
    syllabus: [
      'Module 1: Từ vựng học thuật & Ngữ pháp nâng cao',
      'Module 2: Kỹ năng đọc phân tích & tổng hợp thông tin',
      'Module 3: Kỹ năng tranh luận (Debate) & phản biện',
      'Module 4: Viết luận Academic Essay đúng tiêu chuẩn'
    ]
  },
  {
    id: 'ielts-booster',
    category: 'ielts',
    title: 'Lộ Trình IELTS Bứt Tốc (4.5 – 7.5+)',
    badge: 'IELTS PREPARATION',
    age: '14+ & Người lớn',
    desc: 'Lộ trình cá nhân hóa tối ưu 4 kỹ năng Nghe-Nói-Đọc-Viết. Cam kết đầu ra bằng văn bản pháp lý, luyện đề thi thật liên tục với chuyên gia.',
    duration: '48 buổi (4 tháng)',
    level: 'Pre-IELTS trở lên',
    target: 'Bứt tốc target 6.5 – 7.5+ IELTS',
    features: [
      'Sửa bài chi tiết 1-1 cho Speaking & Writing',
      'Chiến thuật giải đề IELTS sát thực tế 100%',
      'Cam kết đầu ra bằng hợp đồng đào tạo'
    ],
    syllabus: [
      'Module 1: Xây dựng bộ tư duy & từ vựng IELTS Band 6.0+',
      'Module 2: Chiến thuật Listening & Reading chọn lọc đáp án',
      'Module 3: IELTS Speaking Part 1, 2, 3 chuyên sâu',
      'Module 4: Writing Task 1 (Biểu đồ) & Task 2 (Nghị luận)'
    ]
  },
  {
    id: 'comm-practical',
    category: 'comm',
    title: 'Tiếng Anh Giao Tiếp Thực Chiến',
    badge: 'COMMUNICATION',
    age: 'Sinh viên & Người đi làm',
    desc: 'Phương pháp phản xạ nhanh, tập trung 80% thời lượng vào luyện nói tự nhiên và phát âm chuẩn bản xứ, giúp tự tin giao tiếp sau 3 tháng.',
    duration: '36 buổi (3 tháng)',
    level: 'Mọi cấp độ',
    target: 'Phản xạ tự nhiên & Tự tin giao tiếp công việc',
    features: [
      'Thực hành 80% thời lượng nghe nói thực tế',
      'Xóa bỏ tâm lý e ngại, sợ sai khi giao tiếp',
      'Ứng dụng ngay vào môi trường công sở & du lịch'
    ],
    syllabus: [
      'Module 1: Chuẩn hóa ngữ âm & phát âm IPA chuẩn',
      'Module 2: Phản xạ hỏi đáp tự nhiên trong giao tiếp',
      'Module 3: Tiếng Anh công sở (Họp, Email, Thuyết trình)',
      'Module 4: Xử lý tình huống giao tiếp đời sống & du lịch'
    ]
  },
  {
    id: 'online-experience',
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
            <span>LỘ TRÌNH ĐÀO TẠO CHUẨN QUỐC TẾ</span>
          </div>

          <h1 className={styles.heroTitle}>
            Chương Trình Đào Tạo <span className={styles.orangeHighlight}>ANH NGỮ CAM</span>
          </h1>

          <p className={styles.heroSubtitle}>
            Lộ trình học tối ưu kết hợp mô hình <strong>4Ls + LETI</strong> và công nghệ 21st, giúp học viên phát triển toàn diện 4 kỹ năng và khả năng tự học độc lập suốt đời.
          </p>

          {/* Quick Category Filter Pills */}
          <div className={styles.filterBar}>
            <button
              className={`${styles.filterBtn} ${activeCategory === 'all' ? styles.activeFilter : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              Tất Cả Chương Trình
            </button>
            <button
              className={`${styles.filterBtn} ${activeCategory === 'kids' ? styles.activeFilter : ''}`}
              onClick={() => setActiveCategory('kids')}
            >
              Trẻ Em & Mầm Non (4-11t)
            </button>
            <button
              className={`${styles.filterBtn} ${activeCategory === 'teens' ? styles.activeFilter : ''}`}
              onClick={() => setActiveCategory('teens')}
            >
              Thiếu Niên (12-15t)
            </button>
            <button
              className={`${styles.filterBtn} ${activeCategory === 'ielts' ? styles.activeFilter : ''}`}
              onClick={() => setActiveCategory('ielts')}
            >
              Luyện Thi IELTS
            </button>
            <button
              className={`${styles.filterBtn} ${activeCategory === 'comm' ? styles.activeFilter : ''}`}
              onClick={() => setActiveCategory('comm')}
            >
              Giao Tiếp Thực Chiến
            </button>
            <button
              className={`${styles.filterBtn} ${activeCategory === 'online' ? styles.activeFilter : ''}`}
              onClick={() => setActiveCategory('online')}
            >
              iCAM Online
            </button>
          </div>
        </div>
      </section>

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

                {/* Key Features List */}
                <div className={styles.featureList}>
                  {course.features.map((feat, idx) => (
                    <div key={idx} className={styles.featureItem}>
                      <CheckCircle2 size={16} color="#F58220" className={styles.checkIcon} />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Course Meta Info */}
                <div className={styles.courseMeta}>
                  <div className={styles.metaRow}>
                    <div className={styles.metaLabel}>
                      <Clock size={15} />
                      <span>Thời lượng:</span>
                    </div>
                    <span className={styles.metaValue}>{course.duration}</span>
                  </div>

                  <div className={styles.metaRow}>
                    <div className={styles.metaLabel}>
                      <Users size={15} />
                      <span>Đối tượng:</span>
                    </div>
                    <span className={styles.metaValue}>{course.level}</span>
                  </div>

                  <div className={styles.metaRow}>
                    <div className={styles.metaLabel}>
                      <Target size={15} />
                      <span>Cam kết đầu ra:</span>
                    </div>
                    <span className={styles.targetValue}>{course.target}</span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className={styles.cardActions}>
                  <button
                    className={styles.detailBtn}
                    onClick={() => setSelectedCourse(course)}
                  >
                    Xem Chi Tiết Lộ Trình <ChevronRight size={16} />
                  </button>

                  <Link to="/contact" className={styles.registerBtn}>
                    <GraduationCap size={18} /> Đăng Ký Tư Vấn
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY OUR CURRICULUM WORKS */}
      <section className={styles.whyCurriculumSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTag}>
              <Zap size={16} />
              <span>ƯU ĐIỂM VƯỢT TRỘI</span>
            </div>
            <h2 className={styles.sectionTitle}>
              Tại Sao Lộ Trình Đào Tạo Tại ANH NGỮ CAM Hiệu Quả?
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

      {/* CTA SECTION */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaCard}>
            <h2>Chưa Biết Khóa Học Nào Phù Hợp Với Con?</h2>
            <p>
              Đăng ký kiểm tra trình độ Tiếng Anh miễn phí và nhận lộ trình học cá nhân hóa từ các chuyên gia ANH NGỮ CAM ngay hôm nay.
            </p>
            <div className={styles.ctaButtons}>
              <Link to="/contact" className={styles.primaryCtaBtn}>
                Đăng Ký Test Trình Độ Miễn Phí <ArrowRight size={18} />
              </Link>
              <a href="tel:0909090909" className={styles.secondaryCtaBtn}>
                Hotline Tư Vấn Trực Tiếp
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
