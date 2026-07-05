import React from 'react';
import { GraduationCap } from 'lucide-react';
import styles from './Curriculum.module.css';

interface Course {
  id: number;
  title: string;
  badge: string;
  desc: string;
  duration: string;
  level: string;
  target: string;
}

const courses: Course[] = [
  {
    id: 1,
    title: 'Tiếng Anh Giao Tiếp Thực Chiến',
    badge: 'COMMUNICATION',
    desc: 'Phương pháp phản xạ nhanh, tập trung 80% thời lượng vào luyện nói tự nhiên và phát âm chuẩn bản xứ, giúp tự tin giao tiếp sau 3 tháng.',
    duration: '36 buổi (3 tháng)',
    level: 'Mọi cấp độ',
    target: 'Tự tin nói tiếng Anh trôi chảy',
  },
  {
    id: 2,
    title: 'Lộ trình IELTS Bứt Tốc (4.5 - 7.5+)',
    badge: 'IELTS PREPARATION',
    desc: 'Lộ trình cá nhân hóa, tối ưu hóa 4 kỹ năng Nghe-Nói-Đọc-Viết. Cam kết đầu ra bằng văn bản pháp lý, luyện đề thực tế liên tục.',
    duration: '48 buổi (4 tháng)',
    level: 'Pre-IELTS trở lên',
    target: 'Đạt target 6.5 - 7.5+',
  },
  {
    id: 3,
    title: 'Tiếng Anh Trẻ Em Phát Triển Toàn Diện',
    badge: 'KIDS ENGLISH',
    desc: 'Chương trình học vui nhộn kết hợp trò chơi trí tuệ và phương pháp Phonics, giúp trẻ em từ 4-12 tuổi hình thành phản xạ ngôn ngữ tự nhiên.',
    duration: '24 buổi / khóa',
    level: '4 - 12 tuổi',
    target: 'Khơi gợi đam mê & phát âm chuẩn',
  },
];

export const Curriculum: React.FC = () => {
  return (
    <div className="page-container">
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={`${styles.title} gradient-text`}>Chương Trình Đào Tạo</h1>
          <p className={styles.subtitle}>
            Lộ trình học tối ưu được nghiên cứu bài bản, giúp học viên tiến bộ nhanh chóng và đạt kết
            quả mong muốn.
          </p>
        </div>

        <div className={styles.coursesGrid}>
          {courses.map((course) => (
            <div key={course.id} className={`${styles.courseCard} glass-interactive`}>
              <div className={styles.badge}>{course.badge}</div>
              <h2 className={styles.courseTitle}>{course.title}</h2>
              <p className={styles.courseDesc}>{course.desc}</p>

              <div className={styles.courseMeta}>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Thời lượng:</span>
                  <span className={styles.metaValue}>{course.duration}</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Trình độ đầu vào:</span>
                  <span className={styles.metaValue}>{course.level}</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Cam kết đầu ra:</span>
                  <span className={styles.metaValue} style={{ color: 'hsl(var(--primary))' }}>
                    {course.target}
                  </span>
                </div>
              </div>

              <button
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}
              >
                <GraduationCap size={18} /> Đăng ký tư vấn
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Curriculum;
