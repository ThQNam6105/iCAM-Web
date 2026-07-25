import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HelpCircle,
  Sparkles,
  Search,
  ChevronDown,
  ChevronUp,
  PhoneCall,
  Send,
  Zap,
  Compass,
  Award
} from 'lucide-react';
import styles from './FAQ.module.css';

interface FAQItem {
  id: number;
  category: 'method' | 'curriculum' | 'tuition' | 'location';
  categoryLabel: string;
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    id: 1,
    category: 'method',
    categoryLabel: 'PHƯƠNG PHÁP & LỚP HỌC',
    question: 'Phương pháp 4Ls + LETI tại ANH NGỮ CAM là gì?',
    answer: '4Ls đại diện cho 4 kỹ năng cốt lõi: Listening (Nghe), Speaking (Nói), Reading (Đọc), Writing (Viết). LETI (Learning English Through Interactions) là phương pháp giúp học viên học qua tương tác hai chiều, thảo luận nhóm, bài tập tình huống và trải nghiệm thực tế thay vì học thuộc lòng thụ động.'
  },
  {
    id: 2,
    category: 'method',
    categoryLabel: 'PHƯƠNG PHÁP & LỚP HỌC',
    question: 'Lớp học 21st tại ANH NGỮ CAM có điểm gì khác biệt?',
    answer: '100% phòng học được trang bị Bảng tương tác thông minh (Smartboard), sử dụng giáo trình và phần mềm Anh Quốc kết hợp đa phương tiện multimedia. Học viên được nhúng trong môi trường 100% tiếng Anh giúp kích hoạt phản xạ giao tiếp tự nhiên.'
  },
  {
    id: 3,
    category: 'curriculum',
    categoryLabel: 'LỘ TRÌNH & CAM KẾT',
    question: 'ANH NGỮ CAM có cam kết đầu ra bằng văn bản không?',
    answer: 'Có. Tất cả học viên đăng ký lộ trình học tại ANH NGỮ CAM đều được ký hợp đồng cam kết đầu ra bằng văn bản pháp lý. Nếu học viên tham gia đầy đủ lịch học và làm bài tập theo quy định nhưng chưa đạt target, trung tâm sẽ tài trợ 100% học phí học lại.'
  },
  {
    id: 4,
    category: 'curriculum',
    categoryLabel: 'LỘ TRÌNH & CAM KẾT',
    question: 'Trung tâm có các khóa học dành cho những độ tuổi nào?',
    answer: 'ANH NGỮ CAM cung cấp các chương trình đào tạo đa dạng: CAM Kids Starter (4-6 tuổi), CAM Juniors (7-11 tuổi), CAM Teens Master (12-15 tuổi), Lộ trình IELTS Bứt Tốc (4.5 – 7.5+) và Tiếng Anh Giao Tiếp Thực Chiến cho sinh viên & người đi làm.'
  },
  {
    id: 5,
    category: 'curriculum',
    categoryLabel: 'LỘ TRÌNH & CAM KẾT',
    question: 'Làm thế nào để biết con tôi phù hợp với khóa học nào?',
    answer: 'Trước khi nhập học, học viên sẽ được tham gia bài kiểm tra đánh giá năng lực 4 kỹ năng hoàn toàn miễn phí để xác định chính xác trình độ và nhận tư vấn lộ trình cá nhân hóa.'
  },
  {
    id: 6,
    category: 'tuition',
    categoryLabel: 'HỌC PHÍ & ƯU ĐÃI',
    question: 'Học phí tại ANH NGỮ CAM có chính sách hỗ trợ trả góp không?',
    answer: 'Trung tâm hỗ trợ các phương thức thanh toán linh hoạt, bao gồm trả góp 0% lãi suất qua thẻ tín dụng hoặc chia nhỏ học phí theo từng đợt đóng để tạo điều kiện thuận lợi nhất cho phụ huynh.'
  },
  {
    id: 7,
    category: 'tuition',
    categoryLabel: 'HỌC PHÍ & ƯU ĐÃI',
    question: 'Khi đăng ký nhóm hoặc học nhiều khóa có được ưu đãi không?',
    answer: 'ANH NGỮ CAM áp dụng các chương trình ưu đãi dành riêng cho học viên đăng ký theo nhóm gia đình, anh chị em cùng học hoặc đăng ký trọn gói lộ trình dài hạn.'
  },
  {
    id: 8,
    category: 'location',
    categoryLabel: 'CƠ SỞ & LỊCH HỌC',
    question: 'Địa điểm các cơ sở của ANH NGỮ CAM ở đâu?',
    answer: 'ANH NGỮ CAM hiện có các cơ sở đào tạo hiện đại tại khu vực Hóc Môn và Quận 12, TP. Hồ Chí Minh với hệ thống phòng học chuẩn 21st.'
  },
  {
    id: 9,
    category: 'location',
    categoryLabel: 'CƠ SỞ & LỊCH HỌC',
    question: 'Lịch học tại trung tâm được sắp xếp như thế nào?',
    answer: 'Lịch học linh hoạt từ Thứ 2 đến Chủ nhật với các ca sáng, chiều và tối (từ 17h30 - 19h00 hoặc 19h00 - 20h30). Học viên có thể linh hoạt sắp xếp học bù nếu bận đột xuất.'
  },
  {
    id: 10,
    category: 'method',
    categoryLabel: 'PHƯƠNG PHÁP & LỚP HỌC',
    question: 'Trẻ mầm non 4-6 tuổi mới bắt đầu học tiếng Anh có theo kịp không?',
    answer: 'Chương trình CAM Kids được thiết kế riêng qua phương pháp Phonics, trò chơi và âm nhạc giúp trẻ thẩm thấu ngôn ngữ hoàn toàn tự nhiên mà không cảm thấy áp lực.'
  }
];

export const FAQ: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openId, setOpenId] = useState<number | null>(1); // Mặc định mở câu đầu tiên

  const toggleAccordion = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  const filteredFaqs = faqData.filter((faq) => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
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
            <span>HỎI ĐÁP & THẮC MẮC THƯỜNG GẶP</span>
          </div>

          <h1 className={styles.heroTitle}>
            Giải Đáp Thắc Mắc <span className={styles.orangeHighlight}>ANH NGỮ CAM</span>
          </h1>

          <p className={styles.heroSubtitle}>
            Tổng hợp câu hỏi thường gặp nhất từ Quý phụ huynh và học viên về phương pháp 4Ls + LETI, lộ trình học, cam kết đầu ra và học phí tại Hóc Môn & Quận 12.
          </p>

          {/* Interactive Search Box */}
          <div className={styles.searchBox}>
            <Search size={20} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Nhập từ khóa tìm kiếm (ví dụ: học phí, cam kết, 4Ls, lịch học...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
            {searchQuery && (
              <button className={styles.clearSearchBtn} onClick={() => setSearchQuery('')}>
                Xóa
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className={styles.filterBar}>
            <button
              className={`${styles.filterBtn} ${activeCategory === 'all' ? styles.activeFilter : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              Tất Cả Thắc Mắc
            </button>
            <button
              className={`${styles.filterBtn} ${activeCategory === 'method' ? styles.activeFilter : ''}`}
              onClick={() => setActiveCategory('method')}
            >
              Phương Pháp & Lớp Học
            </button>
            <button
              className={`${styles.filterBtn} ${activeCategory === 'curriculum' ? styles.activeFilter : ''}`}
              onClick={() => setActiveCategory('curriculum')}
            >
              Lộ Trình & Cam Kết
            </button>
            <button
              className={`${styles.filterBtn} ${activeCategory === 'tuition' ? styles.activeFilter : ''}`}
              onClick={() => setActiveCategory('tuition')}
            >
              Học Phí & Ưu Đãi
            </button>
            <button
              className={`${styles.filterBtn} ${activeCategory === 'location' ? styles.activeFilter : ''}`}
              onClick={() => setActiveCategory('location')}
            >
              Cơ Sở & Lịch Học
            </button>
          </div>
        </div>
      </section>

      {/* ACCORDION FAQ LIST SECTION */}
      <section className={styles.faqListSection}>
        <div className={styles.container}>
          {filteredFaqs.length > 0 ? (
            <div className={styles.faqAccordionList}>
              {filteredFaqs.map((faq) => {
                const isOpen = openId === faq.id;
                return (
                  <div
                    key={faq.id}
                    className={`${styles.faqCard} ${isOpen ? styles.activeCard : ''}`}
                  >
                    <button
                      className={styles.questionButton}
                      onClick={() => toggleAccordion(faq.id)}
                    >
                      <div className={styles.questionTitleGroup}>
                        <span className={styles.categoryBadge}>{faq.categoryLabel}</span>
                        <h3 className={styles.questionText}>{faq.question}</h3>
                      </div>
                      <div className={styles.toggleIcon}>
                        {isOpen ? <ChevronUp size={22} color="#F58220" /> : <ChevronDown size={22} />}
                      </div>
                    </button>

                    {isOpen && (
                      <div className={styles.answerBody}>
                        <div className={styles.answerContent}>
                          <p>{faq.answer}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className={styles.noResultsBox}>
              <HelpCircle size={48} color="#cbd5e1" />
              <h3>Không tìm thấy câu hỏi phù hợp</h3>
              <p>Thử tìm kiếm với từ khóa khác hoặc gửi câu hỏi trực tiếp cho đội ngũ tư vấn ANH NGỮ CAM.</p>
            </div>
          )}
        </div>
      </section>

      {/* FAQ HIGHLIGHT PILLARS */}
      <section className={styles.pillarsSection}>
        <div className={styles.container}>
          <div className={styles.pillarsGrid}>
            <div className={styles.pillarCard}>
              <div className={styles.pillarIcon}><Zap size={28} /></div>
              <h4>Hỏi Đáp Trực Tiếp</h4>
              <p>Tư vấn viên sẵn sàng hỗ trợ giải đáp chi tiết mọi thắc mắc qua Hotline & Zalo 24/7.</p>
            </div>

            <div className={styles.pillarCard}>
              <div className={styles.pillarIcon}><Award size={28} /></div>
              <h4>Cam Kết Bằng Văn Bản</h4>
              <p>Mọi chính sách và đầu ra đào tạo đều được ký kết hợp đồng pháp lý minh bạch.</p>
            </div>

            <div className={styles.pillarCard}>
              <div className={styles.pillarIcon}><Compass size={28} /></div>
              <h4>Test Trình Độ Miễn Phí</h4>
              <p>Đánh giá năng lực 4 kỹ năng miễn phí trước khi tư vấn lộ trình học phù hợp nhất.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CONSULTATION CTA SECTION */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaCard}>
            <h2>Bạn Vẫn Còn Thắc Mắc Cần Giải Đáp Trực Tiếp?</h2>
            <p>
              Đừng ngần ngại gửi câu hỏi cho ANH NGỮ CAM. Đội ngũ chuyên viên tư vấn tại Hóc Môn & Quận 12 sẽ liên hệ hỗ trợ bạn nhanh nhất.
            </p>
            <div className={styles.ctaButtons}>
              <Link to="/contact" className={styles.primaryCtaBtn}>
                Gửi Câu Hỏi Tư Vấn <Send size={16} />
              </Link>
              <a href="tel:0909090909" className={styles.secondaryCtaBtn}>
                <PhoneCall size={16} /> Hotline Trực Tiếp
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;
