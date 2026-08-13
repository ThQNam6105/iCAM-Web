export interface EducationBlockType {
  id: string;
  name: string;
  icon: string;
  html: string;
}

export const EDUCATION_BLOCKS: EducationBlockType[] = [
  {
    id: 'grammar-tip',
    name: '💡 Mẹo ngữ pháp (Grammar Tip)',
    icon: '💡',
    html: `
      <blockquote class="edu-block edu-grammar-tip">
        <strong>💡 GRAMMAR TIP:</strong> Nhớ sử dụng thì Hiện Tại Hoàn Thành khi diễn tả hành động kéo dài từ quá khứ đến hiện tại!
      </blockquote>
    `,
  },
  {
    id: 'vocabulary-box',
    name: '📚 Từ vựng mới (Vocabulary Box)',
    icon: '📚',
    html: `
      <blockquote class="edu-block edu-vocabulary-box">
        <strong>📚 TỪ VỰNG MỚI:</strong><br/>
        • <em>Perseverance (n):</em> Sự kiên trì, bền bỉ.<br/>
        • <em>Fluency (n):</em> Sự trôi chảy trong giao tiếp.
      </blockquote>
    `,
  },
  {
    id: 'ielts-strategy',
    name: '🎯 Chiến thuật IELTS (IELTS Strategy)',
    icon: '🎯',
    html: `
      <blockquote class="edu-block edu-ielts-strategy">
        <strong>🎯 STRATEGY FOR IELTS SPEAKING PART 2:</strong> Áp dụng công thức PPF (Past - Present - Future) để mở rộng ý tưởng trả lời linh hoạt!
      </blockquote>
    `,
  },
  {
    id: 'common-mistakes',
    name: '⚠️ Lỗi thường gặp (Common Mistakes)',
    icon: '⚠️',
    html: `
      <blockquote class="edu-block edu-common-mistakes">
        <strong>⚠️ COMMON MISTAKE:</strong> Tránh nói ❌ <em>"I am agree"</em>. Hãy nói đúng là ✔️ <em>"I agree"</em> hoặc <em>"I am in agreement"</em>.
      </blockquote>
    `,
  },
  {
    id: 'practice-exercise',
    name: '📝 Bài tập luyện tập (Practice Exercise)',
    icon: '📝',
    html: `
      <blockquote class="edu-block edu-practice-exercise">
        <strong>📝 PRACTICE EXERCISE:</strong> Hãy điền dạng đúng của từ trong ngoặc:<br/>
        1. She speaks English ____________ (fluent).<br/>
        2. Practice makes ____________ (perfect).
      </blockquote>
    `,
  },
  {
    id: 'learning-objective',
    name: '🎯 Mục tiêu bài học (Learning Objective)',
    icon: '🎯',
    html: `
      <blockquote class="edu-block edu-learning-objective">
        <strong>🎯 MỤC TIÊU BÀI HỌC:</strong> Nắm vững 5 cấu trúc câu bứt phá điểm Listening và tự tin áp dụng trong môi trường học thuật 21st Century.
      </blockquote>
    `,
  },
  {
    id: 'success-story',
    name: '🏆 Câu chuyện thành công (Success Story)',
    icon: '🏆',
    html: `
      <blockquote class="edu-block edu-success-story">
        <strong>🏆 SUCCESS STORY:</strong> Học viên Nam Trần đạt 8.0 IELTS Reading chỉ sau 3 tháng luyện tập theo phương pháp 4Ls + LETI tại iCANCAM!
      </blockquote>
    `,
  },
  {
    id: 'call-to-action',
    name: '🚀 Đăng ký tư vấn (Call to Action)',
    icon: '🚀',
    html: `
      <blockquote class="edu-block edu-call-to-action">
        <strong>🚀 ĐĂNG KÝ HỌC THỬ MIỄN PHÍ:</strong> Liên hệ ngay Hotline 0909 123 456 hoặc đăng ký kiểm tra trình độ 4 kỹ năng miễn phí tại cơ sở iCANCAM Hóc Môn & Quận 12!
      </blockquote>
    `,
  },
];
