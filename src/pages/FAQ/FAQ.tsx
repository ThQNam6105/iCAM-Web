import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import styles from './FAQ.module.css';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    id: 1,
    question: 'Trung tâm iCAM có cam kết đầu ra bằng văn bản không?',
    answer:
      'Có. Tất cả học viên đăng ký lộ trình học tại iCAM đều được ký kết hợp đồng cam kết đầu ra bằng văn bản pháp lý. Nếu học viên đi học đầy đủ và làm bài tập theo yêu cầu nhưng không đạt đầu ra, iCAM sẽ tài trợ 100% học phí học lại.',
  },
  {
    id: 2,
    question: 'Học phí tại iCAM có thể đóng trả góp không?',
    answer:
      'Để hỗ trợ học viên, iCAM liên kết với các ngân hàng uy tín hỗ trợ trả góp học phí 0% lãi suất qua thẻ tín dụng. Hoặc học viên có thể chia nhỏ học phí thành 2-3 đợt đóng trong suốt khóa học.',
  },
  {
    id: 3,
    question: 'Lịch học tại trung tâm như thế nào? Có linh hoạt không?',
    answer:
      'iCAM có các ca học linh hoạt từ Thứ 2 đến Chủ nhật, bao gồm các ca sáng, ca chiều và ca tối (từ 18h - 19h30 hoặc 19h30 - 21h). Học viên có thể đăng ký học bù chéo ca nếu bận đột xuất.',
  },
  {
    id: 4,
    question: 'Đội ngũ giáo viên tại iCAM có bằng cấp gì?',
    answer:
      '100% giáo viên bản xứ tại iCAM đều sở hữu chứng chỉ giảng dạy quốc tế (TESOL, CELTA) và bằng đại học. Giáo viên Việt Nam đều đạt IELTS tối thiểu 8.0+ và có trên 3 năm kinh nghiệm đứng lớp.',
  },
];

export const FAQ: React.FC = () => {
  const [openId, setOpenId] = useState<number | null>(1); // Mặc định mở câu đầu tiên

  const toggleOpen = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="page-container">
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={`${styles.title} gradient-text`}>Hỏi Đáp - FAQ</h1>
          <p className={styles.subtitle}>
            Giải đáp nhanh các câu hỏi thắc mắc thường gặp nhất từ phía quý phụ huynh và các bạn học
            viên.
          </p>
        </div>

        <div className={styles.faqList}>
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div key={faq.id} className={`${styles.faqItem} glass`}>
                <button className={styles.questionContainer} onClick={() => toggleOpen(faq.id)}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <HelpCircle size={18} color="hsl(var(--primary))" />
                    {faq.question}
                  </span>
                  {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>

                {isOpen && (
                  <div className={styles.answerContainer}>
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default FAQ;
