import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Target,
  Compass,
  BookOpen,
  Headphones,
  Mic,
  Book,
  PenTool,
  Users,
  MessageSquare,
  Zap,
  CheckCircle2,
  ArrowRight,
  Monitor,
  Globe,
  Lightbulb,
  HeartHandshake,
  TrendingUp,
  Cpu,
  Layers,
  Award,
  ChevronRight
} from 'lucide-react';
import styles from './About.module.css';
import { SectionTransition } from '../../components/SectionTransition/SectionTransition';

export const About: React.FC = () => {
  const [activeMethodTab, setActiveMethodTab] = useState<'4ls' | 'leti'>('4ls');
  const [activeComparison, setActiveComparison] = useState<'traditional' | 'cam'>('cam');

  return (
    <div className={styles.aboutWrapper}>
      {/* SECTION 1: HERO BANNER */}
      <section className={styles.heroSection}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContainer}>
          <div className={styles.heroBadge}>
            <Sparkles size={16} />
            <span>ICANCAM — HÓC MÔN & QUẬN 12</span>
          </div>

          <h1 className={styles.heroTitle}>
            Mô Hình Giáo Dục Tiếng Anh <span className={styles.orangeHighlight}>Thế Kỷ 21</span>
          </h1>

          <p className={styles.heroTagline}>
            Tự tin giao tiếp • Học tập độc lập • Làm chủ ngôn ngữ
          </p>

          <p className={styles.heroDescription}>
            ICANCAM tiên phong áp dụng mô hình giáo dục hiện đại, kết hợp phương pháp <strong>4Ls</strong> và <strong>LETI</strong> giúp học sinh không chỉ học tiếng Anh mà còn chủ động làm chủ và tự học suốt đời.
          </p>

          <div className={styles.heroActions}>
            <a href="#methodology" className={styles.primaryHeroBtn}>
              Khám Phá Phương Pháp <ArrowRight size={18} />
            </a>
            <Link to="/contact" className={styles.secondaryHeroBtn}>
              Đăng Ký Tư Vấn
            </Link>
          </div>
        </div>
      </section>

      {/* Transition: Hero (Navy) -> Mission (White) */}
      <SectionTransition variant="navy-to-white" />

      {/* SECTION 2: MISSION & 3 CORE DECLARATIONS */}
      <section className={styles.missionSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTag}>
              <Target size={16} />
              <span>SỨ MỆNH CỦA ICANCAM</span>
            </div>
            <h2 className={styles.sectionTitle}>
              Khai Mở Năng Lực <span className={styles.orangeText}>Tự Học Độc Lập</span>
            </h2>
            <p className={styles.sectionSubtitle}>
              Sứ mệnh của ICANCAM không chỉ dừng lại ở việc truyền đạt kiến thức, mà là đồng hành biến học sinh thành người sử dụng tiếng Anh tự tin, độc lập và có khả năng tự phát triển tri thức suốt đời.
            </p>
          </div>

          {/* 3 Core Declarations Cards */}
          <div className={styles.declarationsGrid}>
            <div className={styles.declarationCard}>
              <div className={styles.cardHeader}>
                <div className={styles.quoteBadge}>1</div>
                <MessageSquare size={24} className={styles.cardIcon} />
              </div>
              <h3 className={styles.declarationQuote}>
                "I can communicate in English."
              </h3>
              <p className={styles.declarationSub}>
                Tôi có thể giao tiếp Tiếng Anh tự tin
              </p>
              <p className={styles.declarationDesc}>
                Tự tin biểu đạt ý tưởng, giao tiếp tự nhiên và không rào cản trong mọi tình huống giao tiếp đời sống.
              </p>
            </div>

            <div className={`${styles.declarationCard} ${styles.highlightCard}`}>
              <div className={styles.cardHeader}>
                <div className={styles.quoteBadge}>2</div>
                <Award size={24} className={styles.cardIcon} />
              </div>
              <h3 className={styles.declarationQuote}>
                "I can master English."
              </h3>
              <p className={styles.declarationSub}>
                Tôi có thể làm chủ Tiếng Anh
              </p>
              <p className={styles.declarationDesc}>
                Làm chủ cả 4 kỹ năng Nghe - Nói - Đọc - Viết và chủ động ứng dụng ngôn ngữ linh hoạt theo mục tiêu cá nhân.
              </p>
            </div>

            <div className={styles.declarationCard}>
              <div className={styles.cardHeader}>
                <div className={styles.quoteBadge}>3</div>
                <Lightbulb size={24} className={styles.cardIcon} />
              </div>
              <h3 className={styles.declarationQuote}>
                "I can learn English independently."
              </h3>
              <p className={styles.declarationSub}>
                Tôi có thể tự học Tiếng Anh độc lập
              </p>
              <p className={styles.declarationDesc}>
                Sở hữu phương pháp tự học hiệu quả, có khả năng tự tìm tòi, mở rộng tri thức ngôn ngữ mà không phụ thuộc.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Transition: Mission (White) -> Core Values (Soft Orange) */}
      <SectionTransition variant="white-to-soft-orange" />

      {/* SECTION 3: CORE VALUES */}
      <section className={styles.valuesSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTag}>
              <Layers size={16} />
              <span>GIÁ TRỊ CỐT LÕI</span>
            </div>
            <h2 className={styles.sectionTitle}>
              4 Trụ Cột Năng Lực Học Viên
            </h2>
          </div>

          <div className={styles.valuesGrid}>
            <div className={styles.valueCard}>
              <div className={styles.valueIconBox}>
                <HeartHandshake size={28} />
              </div>
              <h3>Tự Tin Giao Tiếp</h3>
              <p>
                Loại bỏ sự e ngại, giúp học sinh chủ động đặt câu hỏi, thảo luận và bày tỏ quan điểm bằng tiếng Anh.
              </p>
            </div>

            <div className={styles.valueCard}>
              <div className={styles.valueIconBox}>
                <BookOpen size={28} />
              </div>
              <h3>Tự Học Độc Lập</h3>
              <p>
                Trang bị tư duy tự nghiên cứu, giúp học sinh chủ động tiếp cận nguồn tri thức mới mà không bị động.
              </p>
            </div>

            <div className={styles.valueCard}>
              <div className={styles.valueIconBox}>
                <Award size={28} />
              </div>
              <h3>Làm Chủ Ngôn Ngữ</h3>
              <p>
                Hiểu sâu bản chất ngôn ngữ để sử dụng tự nhiên như công cụ tư duy thay vì học thuộc lòng công thức.
              </p>
            </div>

            <div className={styles.valueCard}>
              <div className={styles.valueIconBox}>
                <TrendingUp size={28} />
              </div>
              <h3>Phát Triển Bền Vững</h3>
              <p>
                Tạo nền tảng vững chắc để học sinh tiếp tục tự học và nâng cao trình độ trong suốt hành trình tương lai.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Transition: Core Values (Soft Orange) -> Comparison (White) */}
      <SectionTransition variant="soft-orange-to-white" />

      {/* SECTION 4: WHY CHOOSE US (COMPARISON) */}
      <section className={styles.whyUsSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTag}>
              <Zap size={16} />
              <span>SỰ KHÁC BIỆT</span>
            </div>
            <h2 className={styles.sectionTitle}>
              Học Qua Tương Tác Thay Vì Ghi Nhớ Thụ Động
            </h2>
            <p className={styles.sectionSubtitle}>
              ICANCAM thay thế lối học vẹt rập khuôn bằng môi trường chủ động tương tác và ứng dụng thực tế.
            </p>
          </div>

          {/* Interactive Toggle Switch */}
          <div className={styles.toggleContainer}>
            <button
              className={`${styles.toggleBtn} ${activeComparison === 'traditional' ? styles.activeToggle : ''}`}
              onClick={() => setActiveComparison('traditional')}
            >
              Học Truyền Thống
            </button>
            <button
              className={`${styles.toggleBtn} ${activeComparison === 'cam' ? styles.activeToggleOrange : ''}`}
              onClick={() => setActiveComparison('cam')}
            >
              Mô Hình ICANCAM ★
            </button>
          </div>

          {/* Comparison Matrix */}
          <div className={styles.comparisonGrid}>
            <div className={`${styles.comparisonCard} ${styles.traditionalSide} ${activeComparison === 'traditional' ? styles.highlightedSide : ''}`}>
              <div className={styles.comparisonHeader}>
                <h3>Học Tiếng Anh Truyền Thống</h3>
                <span className={styles.badgeDanger}>Ghi nhớ thụ động</span>
              </div>
              <ul className={styles.comparisonList}>
                <li>
                  <span className={styles.crossIcon}>✕</span>
                  <span>Học thuộc lòng từ vựng và công thức ngữ pháp khô khan.</span>
                </li>
                <li>
                  <span className={styles.crossIcon}>✕</span>
                  <span>Nghe giảng một chiều, ít cơ hội thực hành giao tiếp.</span>
                </li>
                <li>
                  <span className={styles.crossIcon}>✕</span>
                  <span>Học để đối phó bài kiểm tra, thiếu tính ứng dụng đời sống.</span>
                </li>
                <li>
                  <span className={styles.crossIcon}>✕</span>
                  <span>Bị động phụ thuộc vào giáo viên, thiếu phương pháp tự học.</span>
                </li>
              </ul>
            </div>

            <div className={`${styles.comparisonCard} ${styles.camSide} ${activeComparison === 'cam' ? styles.highlightedSide : ''}`}>
              <div className={styles.comparisonHeader}>
                <h3>Phương Pháp ICANCAM</h3>
                <span className={styles.badgeSuccess}>4Ls + LETI Tương tác</span>
              </div>
              <ul className={styles.comparisonList}>
                <li>
                  <span className={styles.checkIcon}><CheckCircle2 size={18} /></span>
                  <span>Học qua tương tác, thảo luận nhóm và trải nghiệm tình huống thực tế.</span>
                </li>
                <li>
                  <span className={styles.checkIcon}><CheckCircle2 size={18} /></span>
                  <span>Môi trường 100% tiếng Anh giúp kích hoạt phản xạ tự nhiên.</span>
                </li>
                <li>
                  <span className={styles.checkIcon}><CheckCircle2 size={18} /></span>
                  <span>Rèn luyện tư duy phản biện, kỹ năng làm việc nhóm và giải quyết vấn đề.</span>
                </li>
                <li>
                  <span className={styles.checkIcon}><CheckCircle2 size={18} /></span>
                  <span>Hình thành năng lực tự học độc lập và tự duy trì tri thức lâu dài.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Transition: Comparison (White) -> Teaching Method (Soft Orange) */}
      <SectionTransition variant="white-to-soft-orange" />

      {/* SECTION 5: TEACHING METHOD (4Ls + LETI) */}
      <section id="methodology" className={styles.methodSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTag}>
              <BookOpen size={16} />
              <span>PHƯƠNG PHÁP GIẢNG DẠY</span>
            </div>
            <h2 className={styles.sectionTitle}>
              Sự Kết Hợp Đột Phá <span className={styles.orangeText}>4Ls & LETI</span>
            </h2>
            <p className={styles.sectionSubtitle}>
              Mô hình giáo dục tiếng Anh thế kỷ 21 kết hợp hoàn thiện 4 kỹ năng ngôn ngữ cốt lõi với phương pháp học qua tương tác.
            </p>
          </div>

          {/* Method Tabs Navigation */}
          <div className={styles.methodTabs}>
            <button
              className={`${styles.methodTab} ${activeMethodTab === '4ls' ? styles.activeTab : ''}`}
              onClick={() => setActiveMethodTab('4ls')}
            >
              <Layers size={18} />
              <span>Mô Hình 4Ls (Kỹ Năng Cốt Lõi)</span>
            </button>
            <button
              className={`${styles.methodTab} ${activeMethodTab === 'leti' ? styles.activeTab : ''}`}
              onClick={() => setActiveMethodTab('leti')}
            >
              <Cpu size={18} />
              <span>Phương Pháp LETI (Tương Tác)</span>
            </button>
          </div>

          {/* Tab 1 Content: 4Ls */}
          {activeMethodTab === '4ls' && (
            <div className={styles.tabContentFade}>
              <div className={styles.fourLsGrid}>
                <div className={styles.lsCard}>
                  <div className={styles.lsIcon}><Headphones size={24} /></div>
                  <h4>Listening (Nghe)</h4>
                  <p>Luyện nghe đa dạng ngữ điệu, tiếp thu thông tin chủ động và phản xạ nhanh.</p>
                </div>

                <div className={styles.lsCard}>
                  <div className={styles.lsIcon}><Mic size={24} /></div>
                  <h4>Speaking (Nói)</h4>
                  <p>Phát âm chuẩn xác, diễn đạt ý tưởng trôi chảy và tự tin trước đám đông.</p>
                </div>

                <div className={styles.lsCard}>
                  <div className={styles.lsIcon}><Book size={24} /></div>
                  <h4>Reading (Đọc)</h4>
                  <p>Đọc hiểu chuyên sâu, phân tích ngữ cảnh và tích lũy vốn từ phong phú.</p>
                </div>

                <div className={styles.lsCard}>
                  <div className={styles.lsIcon}><PenTool size={24} /></div>
                  <h4>Writing (Viết)</h4>
                  <p>Tư duy logic, cấu trúc câu mạch lạc và biểu đạt văn bản hiệu quả.</p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2 Content: LETI */}
          {activeMethodTab === 'leti' && (
            <div className={styles.tabContentFade}>
              <div className={styles.letiBanner}>
                <h3>LETI — Learning English Through Interactions</h3>
                <p>Học Tiếng Anh Thông Qua Tương Tác Trực Tiếp & Trải Nghiệm Đa Dạng</p>
              </div>

              <div className={styles.letiGrid}>
                <div className={styles.letiCard}>
                  <Users size={22} className={styles.letiIcon} />
                  <div>
                    <h5>Interaction (Tương Tác)</h5>
                    <p>Tương tác hai chiều liên tục giữa giáo viên và học viên trong lớp.</p>
                  </div>
                </div>

                <div className={styles.letiCard}>
                  <MessageSquare size={22} className={styles.letiIcon} />
                  <div>
                    <h5>Communication (Giao Tiếp)</h5>
                    <p>Thực hành trao đổi, trình bày quan điểm bằng tiếng Anh tự nhiên.</p>
                  </div>
                </div>

                <div className={styles.letiCard}>
                  <Zap size={22} className={styles.letiIcon} />
                  <div>
                    <h5>Application (Ứng Dụng)</h5>
                    <p>Đưa kiến thức học được vào giải quyết các bài toán thực tế.</p>
                  </div>
                </div>

                <div className={styles.letiCard}>
                  <Lightbulb size={22} className={styles.letiIcon} />
                  <div>
                    <h5>Discussion (Thảo Luận)</h5>
                    <p>Thảo luận nhóm phát triển tư duy phản biện và làm việc đồng đội.</p>
                  </div>
                </div>

                <div className={styles.letiCard}>
                  <CheckCircle2 size={22} className={styles.letiIcon} />
                  <div>
                    <h5>Practice (Thực Hành)</h5>
                    <p>Luyện tập liên tục qua các bài tập tình huống và dự án học tập.</p>
                  </div>
                </div>

                <div className={styles.letiCard}>
                  <Globe size={22} className={styles.letiIcon} />
                  <div>
                    <h5>Real-Life Activities (Hoạt Động Thực Tế)</h5>
                    <p>Trải nghiệm ngôn ngữ trong môi trường giao tiếp thực sự.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Transition: Teaching Method (Soft Orange) -> Smart Classrooms (Navy) */}
      <SectionTransition variant="soft-orange-to-navy" />

      {/* SECTION 6: 21ST CENTURY CLASSROOM */}
      <section className={styles.classroomSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTag}>
              <Monitor size={16} />
              <span>MÔI TRƯỜNG HỌC TẬP</span>
            </div>
            <h2 className={styles.sectionTitle}>
              Lớp Học Thông Minh Thế Kỷ 21
            </h2>
            <p className={styles.sectionSubtitle}>
              Không gian học tập tích hợp công nghệ hiện đại mang lại trải nghiệm tương tác trực quan sống động.
            </p>
          </div>

          <div className={styles.classroomGrid}>
            <div className={styles.classroomCard}>
              <div className={styles.classIcon}><Monitor size={32} /></div>
              <h3>Bảng Tương Tác Thông Minh</h3>
              <p>Smart Interactive Boards giúp bài học trở nên sinh động, cho phép học sinh trực tiếp thao tác và tương tác với nội dung giảng dạy.</p>
            </div>

            <div className={styles.classroomCard}>
              <div className={styles.classIcon}><BookOpen size={32} /></div>
              <h3>Phần Mềm Giáo Dục Anh Quốc</h3>
              <p>British Educational Software chuẩn quốc tế cung cấp nguồn tài nguyên học tập đa dạng, phong phú và tương tác cao.</p>
            </div>

            <div className={styles.classroomCard}>
              <div className={styles.classIcon}><Cpu size={32} /></div>
              <h3>Học Tập Đa Phương Tiện</h3>
              <p>Multimedia & Technology-Enhanced Education kết hợp hình ảnh, âm thanh và công nghệ giúp kích hoạt tối đa khả năng ghi nhớ.</p>
            </div>

            <div className={styles.classroomCard}>
              <div className={styles.classIcon}><MessageSquare size={32} /></div>
              <h3>Môi Trường 100% Tiếng Anh</h3>
              <p>100% English-Speaking Environment tạo không gian "tắm ngôn ngữ" hoàn toàn, kích thích phản xạ giao tiếp tự nhiên.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Transition: Smart Classrooms (Navy) -> Student Journey (White) */}
      <SectionTransition variant="navy-to-white" />

      {/* SECTION 7: STUDENT JOURNEY */}
      <section className={styles.journeySection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTag}>
              <TrendingUp size={16} />
              <span>HÀNH TRÌNH HỌC VIÊN</span>
            </div>
            <h2 className={styles.sectionTitle}>
              4 Bước Phát Triển Năng Lực Ngôn Ngữ
            </h2>
          </div>

          <div className={styles.journeySteps}>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>01</div>
              <h4>Khai Mở & Tiếp Cận</h4>
              <p>Tiếp xúc với môi trường 100% tiếng Anh và tiếp cận phương pháp học qua tương tác LETI.</p>
            </div>

            <div className={styles.stepConnector}><ChevronRight size={24} /></div>

            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>02</div>
              <h4>Tương Tác & Giao Tiếp</h4>
              <p>Thực hành liên tục 4Ls qua thảo luận nhóm, hoạt động thực tế và phản hồi hai chiều.</p>
            </div>

            <div className={styles.stepConnector}><ChevronRight size={24} /></div>

            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>03</div>
              <h4>Tự Tin & Làm Chủ</h4>
              <p>Hình thành phản xạ tự nhiên, tự tin trình bày ý tưởng và làm chủ cả 4 kỹ năng tiếng Anh.</p>
            </div>

            <div className={styles.stepConnector}><ChevronRight size={24} /></div>

            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>04</div>
              <h4>Tự Học Độc Lập</h4>
              <p>Làm chủ phương pháp tự học, tự duy trì và tiếp tục mở rộng tri thức suốt đời.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Transition: Student Journey (White) -> Student Outcomes (Soft Orange) */}
      <SectionTransition variant="white-to-soft-orange" />

      {/* SECTION 8: STUDENT OUTCOMES */}
      <section className={styles.outcomesSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTag}>
              <Award size={16} />
              <span>GIÁ TRỊ NHẬN ĐƯỢC</span>
            </div>
            <h2 className={styles.sectionTitle}>
              6 Năng Lực Toàn Diện Sau Khóa Học
            </h2>
          </div>

          <div className={styles.outcomesGrid}>
            <div className={styles.outcomeItem}>
              <CheckCircle2 size={24} color="#F58220" />
              <div>
                <h4>Tự Tin (Confidence)</h4>
                <p>Mạnh dạn thể hiện bản thân và giao tiếp tự nhiên.</p>
              </div>
            </div>

            <div className={styles.outcomeItem}>
              <CheckCircle2 size={24} color="#F58220" />
              <div>
                <h4>Kỹ Năng Giao Tiếp (Communication)</h4>
                <p>Biểu đạt suy nghĩ rõ ràng và lắng nghe thấu hiểu.</p>
              </div>
            </div>

            <div className={styles.outcomeItem}>
              <CheckCircle2 size={24} color="#F58220" />
              <div>
                <h4>Khả Năng Tự Học Độc Lập (Independent Learning)</h4>
                <p>Chủ động tìm tòi và phát triển tri thức không phụ thuộc.</p>
              </div>
            </div>

            <div className={styles.outcomeItem}>
              <CheckCircle2 size={24} color="#F58220" />
              <div>
                <h4>Tư Duy Phản Biện (Critical Thinking)</h4>
                <p>Phân tích thông tin và giải quyết vấn đề logic.</p>
              </div>
            </div>

            <div className={styles.outcomeItem}>
              <CheckCircle2 size={24} color="#F58220" />
              <div>
                <h4>Tiếng Anh Thực Tiễn (Practical English)</h4>
                <p>Ứng dụng hiệu quả vào đời sống và học tập.</p>
              </div>
            </div>

            <div className={styles.outcomeItem}>
              <CheckCircle2 size={24} color="#F58220" />
              <div>
                <h4>Tư Duy Toàn Cầu (Global Mindset)</h4>
                <p>Sẵn sàng hội nhập và kết nối với thế giới.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Transition: Outcomes (Soft Orange) -> Story (Navy) */}
      <SectionTransition variant="soft-orange-to-navy" />

      {/* SECTION 9: INNOVATION STORY */}
      <section className={styles.storySection}>
        <div className={styles.container}>
          <div className={styles.storyBox}>
            <div className={styles.storyContent}>
              <div className={styles.sectionTagLight}>
                <Compass size={16} />
                <span>HÀNH TRÌNH ĐỔI MỚI</span>
              </div>
              <h2>Tiên Phong Giáo Dục Tại Hóc Môn & Quận 12</h2>
              <p>
                Với kinh nghiệm tích lũy trong giảng dạy tiếng Anh, ICANCAM không ngừng nghiên cứu và đổi mới nhằm mang mô hình giáo dục tiên phong thế kỷ 21 tới học sinh tại Hóc Môn và Quận 12.
              </p>
              <p>
                Chúng tôi tin rằng mỗi học sinh đều có tiềm năng lớn để trở thành một người sử dụng tiếng Anh thành thạo và tự lập. Bằng sự kết hợp giữa <strong>4Ls + LETI</strong> và công nghệ lớp học thông minh, ICANCAM cam kết xây dựng môi trường học tập cảm hứng nhất.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Transition: Story (Navy) -> CTA (Soft Orange) */}
      <SectionTransition variant="navy-to-soft-orange" />

      {/* SECTION 10: CALL TO ACTION (CTA) */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaCard}>
            <h2>Sẵn Sàng Cùng ICANCAM Làm Chủ Tiếng Anh?</h2>
            <p>
              Hãy để con bạn trải nghiệm mô hình giáo dục hiện đại, kích hoạt khả năng tự học độc lập và tự tin giao tiếp ngay hôm nay.
            </p>
            <div className={styles.ctaButtons}>
              <Link to="/contact" className={styles.primaryCtaBtn}>
                Đăng Ký Tư Vấn Ngay <ArrowRight size={18} />
              </Link>
              <Link to="/curriculum" className={styles.secondaryCtaBtn}>
                Xem Chương Trình Học
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
