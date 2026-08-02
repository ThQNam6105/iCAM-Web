import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Search,
  ChevronDown,
  ChevronUp,
  PhoneCall,
  Send,
  Zap,
  Award,
  ShieldCheck,
  X
} from 'lucide-react';
import styles from './FAQ.module.css';
import { useLanguage } from '../../contexts/LanguageContext';
import { SectionTransition } from '../../components/SectionTransition/SectionTransition';

interface FAQItem {
  id: number;
  category: 'method' | 'curriculum' | 'tuition' | 'location';
  categoryLabelVi: string;
  categoryLabelEn: string;
  questionVi: string;
  questionEn: string;
  answerVi: string;
  answerEn: string;
}

const faqData: FAQItem[] = [
  {
    id: 1,
    category: 'method',
    categoryLabelVi: 'PHƯƠNG PHÁP & LỚP HỌC',
    categoryLabelEn: 'METHOD & CLASSROOMS',
    questionVi: 'Phương pháp 4Ls + LETI tại iCANCAM là gì?',
    questionEn: 'What is the 4Ls + LETI methodology at iCANCAM?',
    answerVi: '4Ls đại diện cho 4 kỹ năng cốt lõi: Listening (Nghe), Speaking (Nói), Reading (Đọc), Writing (Viết). LETI (Learning English Through Interactions) là phương pháp giúp học viên học qua tương tác hai chiều, thảo luận nhóm, bài tập tình huống và trải nghiệm thực tế thay vì học thuộc lòng thụ động.',
    answerEn: '4Ls represents 4 core skills: Listening, Speaking, Reading, Writing. LETI (Learning English Through Interactions) is a method enabling students to learn through two-way interactions, group discussions, scenario tasks, and practical experiences rather than passive memorization.'
  },
  {
    id: 2,
    category: 'method',
    categoryLabelVi: 'PHƯƠNG PHÁP & LỚP HỌC',
    categoryLabelEn: 'METHOD & CLASSROOMS',
    questionVi: 'Lớp học 21st tại iCANCAM có điểm gì khác biệt?',
    questionEn: 'What makes the 21st Smart Classroom at iCANCAM unique?',
    answerVi: '100% phòng học được trang bị Bảng tương tác thông minh (Smartboard), sử dụng giáo trình và phần mềm Anh Quốc kết hợp đa phương tiện multimedia. Học viên được nhúng trong môi trường 100% tiếng Anh giúp kích hoạt phản xạ giao tiếp tự nhiên.',
    answerEn: '100% of classrooms are equipped with interactive touchscreens (Smartboards), using British curriculum software and multimedia. Students are immersed in a 100% English environment triggering natural speech reflexes.'
  },
  {
    id: 3,
    category: 'curriculum',
    categoryLabelVi: 'LỘ TRÌNH & CAM KẾT',
    categoryLabelEn: 'PATHWAY & GUARANTEES',
    questionVi: 'iCANCAM có cam kết đầu ra bằng văn bản không?',
    questionEn: 'Does iCANCAM provide written outcome guarantees?',
    answerVi: 'Có. Tất cả học viên đăng ký lộ trình học tại iCANCAM đều được ký hợp đồng cam kết đầu ra bằng văn bản pháp lý. Nếu học viên tham gia đầy đủ lịch học và làm bài tập theo quy định nhưng chưa đạt target, trung tâm sẽ tài trợ 100% học phí học lại.',
    answerEn: 'Yes. All students enrolling in iCANCAM pathways receive a legal written output contract. If a student attends required sessions and completes assignments but falls short of targets, the center sponsors 100% tuition for re-taking.'
  },
  {
    id: 4,
    category: 'curriculum',
    categoryLabelVi: 'LỘ TRÌNH & CAM KẾT',
    categoryLabelEn: 'PATHWAY & GUARANTEES',
    questionVi: 'Trung tâm có các khóa học dành cho những độ tuổi nào?',
    questionEn: 'Which age groups do iCANCAM courses cater to?',
    answerVi: 'iCANCAM cung cấp các chương trình đào tạo đa dạng: CAM Kids Starter (4-6 tuổi), CAM Juniors (7-11 tuổi), CAM Teens Master (12-15 tuổi), Lộ trình IELTS Bứt Tốc (4.5 – 7.5+) và Tiếng Anh Giao Tiếp Thực Chiến cho sinh viên & người đi làm.',
    answerEn: 'iCANCAM provides diverse programs: CAM Kids Starter (ages 4-6), CAM Juniors (ages 7-11), CAM Teens Master (ages 12-15), IELTS Acceleration (4.5–7.5+), and Practical Communication for students and working professionals.'
  },
  {
    id: 5,
    category: 'curriculum',
    categoryLabelVi: 'LỘ TRÌNH & CAM KẾT',
    categoryLabelEn: 'PATHWAY & GUARANTEES',
    questionVi: 'Làm thế nào để biết con tôi phù hợp với khóa học nào?',
    questionEn: 'How can I know which course is right for my child?',
    answerVi: 'Trước khi nhập học, học viên sẽ được tham gia bài kiểm tra đánh giá năng lực 4 kỹ năng hoàn toàn miễn phí để xác định chính xác trình độ và nhận tư vấn lộ trình cá nhân hóa.',
    answerEn: 'Before enrollment, students take a 100% free 4-skill proficiency assessment to accurately identify levels and receive a personalized learning roadmap.'
  },
  {
    id: 6,
    category: 'tuition',
    categoryLabelVi: 'HỌC PHÍ & ƯU ĐÃI',
    categoryLabelEn: 'TUITION & DISCOUNTS',
    questionVi: 'Học phí tại iCANCAM có chính sách hỗ trợ trả góp không?',
    questionEn: 'Does iCANCAM offer tuition installment support?',
    answerVi: 'Trung tâm hỗ trợ các phương thức thanh toán linh hoạt, bao gồm trả góp 0% lãi suất qua thẻ tín dụng hoặc chia nhỏ học phí theo từng đợt đóng để tạo điều kiện thuận lợi nhất cho phụ huynh.',
    answerEn: 'We support flexible payment options including 0% interest credit card installments or split payments to create the best convenience for parents.'
  },
  {
    id: 7,
    category: 'tuition',
    categoryLabelVi: 'HỌC PHÍ & ƯU ĐÃI',
    categoryLabelEn: 'TUITION & DISCOUNTS',
    questionVi: 'Khi đăng ký nhóm hoặc học nhiều khóa có được ưu đãi không?',
    questionEn: 'Are there discounts for group enrollments or multi-course signups?',
    answerVi: 'iCANCAM áp dụng các chương trình ưu đãi dành riêng cho học viên đăng ký theo nhóm gia đình, anh chị em cùng học hoặc đăng ký trọn gói lộ trình dài hạn.',
    answerEn: 'iCANCAM applies dedicated discounts for family group signups, siblings studying together, or full long-term pathway packages.'
  },
  {
    id: 8,
    category: 'location',
    categoryLabelVi: 'CƠ SỞ & LỊCH HỌC',
    categoryLabelEn: 'CAMPUSES & SCHEDULE',
    questionVi: 'Địa điểm các cơ sở của iCANCAM ở đâu?',
    questionEn: 'Where are iCANCAM campuses located?',
    answerVi: 'iCANCAM hiện có các cơ sở đào tạo hiện đại tại khu vực Hóc Môn và Quận 12, TP. Hồ Chí Minh với hệ thống phòng học chuẩn 21st (344 A Tổ 13 KP 1, Trung Mỹ Tây, HCM).',
    answerEn: 'iCANCAM currently operates modern campuses in Hoc Mon & District 12, HCMC with 21st smart classrooms (344 A To 13 KP 1, Trung My Tay, HCMC).'
  },
  {
    id: 9,
    category: 'location',
    categoryLabelVi: 'CƠ SỞ & LỊCH HỌC',
    categoryLabelEn: 'CAMPUSES & SCHEDULE',
    questionVi: 'Lịch học tại trung tâm được sắp xếp như thế nào?',
    questionEn: 'How are class schedules arranged at the center?',
    answerVi: 'Lịch học linh hoạt từ Thứ 2 đến Chủ nhật với các ca sáng, chiều và tối (từ 17h30 - 19h00 hoặc 19h00 - 20h30). Học viên có thể linh hoạt sắp xếp học bù nếu bận đột xuất.',
    answerEn: 'Class schedules are flexible from Monday to Sunday with morning, afternoon, and evening shifts (17:30–19:00 or 19:00–20:30). Students can makeup missed classes easily.'
  },
  {
    id: 10,
    category: 'method',
    categoryLabelVi: 'PHƯƠNG PHÁP & LỚP HỌC',
    categoryLabelEn: 'METHOD & CLASSROOMS',
    questionVi: 'Trẻ mầm non 4-6 tuổi mới bắt đầu học tiếng Anh có theo kịp không?',
    questionEn: 'Can kindergarten children aged 4-6 keep up when starting English?',
    answerVi: 'Chương trình CAM Kids được thiết kế riêng qua phương pháp Phonics, trò chơi và âm nhạc giúp trẻ thẩm thấu ngôn ngữ hoàn toàn tự nhiên mà không cảm thấy áp lực.',
    answerEn: 'The CAM Kids program is custom-tailored with Phonics, games, and music so young children acquire English naturally without stress.'
  }
];

export const FAQ: React.FC = () => {
  const { language, t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openIds, setOpenIds] = useState<number[]>([]);

  const toggleAccordion = (id: number) => {
    if (openIds.includes(id)) {
      setOpenIds(openIds.filter(item => item !== id));
    } else {
      setOpenIds([...openIds, id]);
    }
  };

  const filteredFaqs = faqData.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const qText = language === 'en' ? item.questionEn : item.questionVi;
    const aText = language === 'en' ? item.answerEn : item.answerVi;
    const matchesSearch = searchQuery.trim() === '' ||
      qText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      aText.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className={styles.faqWrapper}>
      {/* HERO SECTION */}
      <section className={styles.heroSection}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContainer}>
          <div className={styles.heroBadge}>
            <Sparkles size={16} />
            <span>{t.faq.heroBadge}</span>
          </div>

          <h1 className={styles.heroTitle}>
            {t.faq.heroTitlePrefix}
            <span className={styles.orangeHighlight}>
              {t.faq.heroTitleHighlight}
            </span>
          </h1>

          <p className={styles.heroSubtitle}>
            {t.faq.heroSubtitle}
          </p>

          {/* Search Box */}
          <div className={styles.searchBoxWrapper}>
            <Search size={20} className={styles.searchIcon} />
            <input
              type="text"
              placeholder={t.faq.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
            {searchQuery && (
              <button
                className={styles.clearSearchBtn}
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className={styles.filterBar}>
            <button
              className={`${styles.filterBtn} ${activeCategory === 'all' ? styles.activeFilter : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              {t.faq.filterAll}
            </button>
            <button
              className={`${styles.filterBtn} ${activeCategory === 'method' ? styles.activeFilter : ''}`}
              onClick={() => setActiveCategory('method')}
            >
              {t.faq.filterMethod}
            </button>
            <button
              className={`${styles.filterBtn} ${activeCategory === 'curriculum' ? styles.activeFilter : ''}`}
              onClick={() => setActiveCategory('curriculum')}
            >
              {t.faq.filterCurriculum}
            </button>
            <button
              className={`${styles.filterBtn} ${activeCategory === 'tuition' ? styles.activeFilter : ''}`}
              onClick={() => setActiveCategory('tuition')}
            >
              {t.faq.filterTuition}
            </button>
            <button
              className={`${styles.filterBtn} ${activeCategory === 'location' ? styles.activeFilter : ''}`}
              onClick={() => setActiveCategory('location')}
            >
              {t.faq.filterLocation}
            </button>
          </div>
        </div>
      </section>

      {/* Transition: Hero (Navy) -> Accordion List (Soft Orange) */}
      <SectionTransition variant="navy-to-soft-orange" />

      {/* ACCORDION FAQ SECTION */}
      <section className={styles.accordionSection}>
        <div className={styles.container}>
          {filteredFaqs.length === 0 ? (
            <div className={styles.noResultsCard}>
              <h3>{t.faq.noResultsTitle}</h3>
              <p>{t.faq.noResultsDesc}</p>
            </div>
          ) : (
            <div className={styles.accordionList}>
              {filteredFaqs.map(item => {
                const isOpen = openIds.includes(item.id);
                return (
                  <div key={item.id} className={`${styles.accordionItem} ${isOpen ? styles.itemOpen : ''}`}>
                    <button
                      className={styles.accordionHeader}
                      onClick={() => toggleAccordion(item.id)}
                      aria-expanded={isOpen}
                    >
                      <div className={styles.questionMeta}>
                        <span className={styles.badgeCategory}>
                          {language === 'en' ? item.categoryLabelEn : item.categoryLabelVi}
                        </span>
                        <span className={styles.questionText}>
                          {language === 'en' ? item.questionEn : item.questionVi}
                        </span>
                      </div>
                      <div className={styles.toggleIconWrap}>
                        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    </button>

                    {isOpen && (
                      <div className={styles.accordionBody}>
                        <p>{language === 'en' ? item.answerEn : item.answerVi}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Transition: Accordion List (Soft Orange) -> Support Pillars (White) */}
      <SectionTransition variant="soft-orange-to-white" />

      {/* SUPPORT PILLARS */}
      <section className={styles.pillarsSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTag}>
              <ShieldCheck size={16} />
              <span>{t.faq.guaranteeTag}</span>
            </div>
            <h2 className={styles.sectionTitle}>
              {t.faq.guaranteeTitle}
            </h2>
          </div>

          <div className={styles.pillarsGrid}>
            <div className={styles.pillarCard}>
              <PhoneCall size={32} color="#F58220" />
              <h3>{t.faq.pillar1Title}</h3>
              <p>{t.faq.pillar1Desc}</p>
            </div>

            <div className={styles.pillarCard}>
              <Award size={32} color="#F58220" />
              <h3>{t.faq.pillar2Title}</h3>
              <p>{t.faq.pillar2Desc}</p>
            </div>

            <div className={styles.pillarCard}>
              <Zap size={32} color="#F58220" />
              <h3>{t.faq.pillar3Title}</h3>
              <p>{t.faq.pillar3Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Transition: Support Pillars (White) -> CTA (Navy) */}
      <SectionTransition variant="white-to-navy" />

      {/* CONSULTATION CTA */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaCard}>
            <h2>{t.faq.ctaTitle}</h2>
            <p>{t.faq.ctaDesc}</p>
            <div className={styles.ctaButtons}>
              <Link to="/contact" className={styles.primaryCtaBtn}>
                <Send size={18} /> {t.faq.ctaPrimaryBtn}
              </Link>
              <a href="tel:0909123456" className={styles.secondaryCtaBtn}>
                <PhoneCall size={18} /> {t.faq.ctaSecondaryBtn}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;
