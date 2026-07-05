import React from 'react';
import { Terminal, Code, Sparkles } from 'lucide-react';
import styles from './About.module.css';

export const About: React.FC = () => {
  return (
    <div className="page-container">
      <div className={styles.container}>
        <div>
          <h1 className={`${styles.title} gradient-text`}>Giới thiệu dự án</h1>
          <p className={styles.description}>
            Khung sườn ứng dụng này được xây dựng nhằm cung cấp một khởi đầu vững chắc, nhanh chóng và
            đạt chuẩn cao nhất về mặt kỹ thuật cho dự án của bạn tại **iCAN 4life**.
          </p>
        </div>

        <section className={`${styles.section} glass`}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.5rem' }}>
            <Sparkles size={20} color="hsl(var(--secondary))" />
            Triết lý thiết kế
          </h2>
          <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.95rem' }}>
            Chúng tôi ưu tiên tối đa hiệu năng tải trang, khả năng mở rộng code và trải nghiệm phát
            triển. Mọi thành phần giao diện đều đi kèm với các micro-animations tinh tế cùng hiệu ứng
            kính mờ (glassmorphism) sang trọng để tạo ấn tượng thị giác mạnh mẽ ngay từ lần đầu tiên
            truy cập.
          </p>
        </section>

        <div>
          <h2
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '1.5rem',
              marginBottom: '1rem',
            }}
          >
            <Code size={20} color="hsl(var(--primary))" />
            Chi tiết Công nghệ sử dụng
          </h2>
          <div className={styles.techGrid}>
            <div className={styles.techItem}>
              <div className={styles.techName}>React 19</div>
              <div className={styles.techDetail}>Framework UI phổ biến bậc nhất thế giới</div>
            </div>
            <div className={styles.techItem}>
              <div className={styles.techName}>TypeScript</div>
              <div className={styles.techDetail}>Kiểm soát chặt chẽ kiểu dữ liệu đầu vào</div>
            </div>
            <div className={styles.techItem}>
              <div className={styles.techName}>Zustand</div>
              <div className={styles.techDetail}>Quản lý trạng thái siêu nhẹ & tối giản</div>
            </div>
            <div className={styles.techItem}>
              <div className={styles.techName}>React Router 7</div>
              <div className={styles.techDetail}>Định tuyến chuyển trang mượt mà không load lại</div>
            </div>
          </div>
        </div>

        <section className={`${styles.section} glass`}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.5rem' }}>
            <Terminal size={20} color="hsl(var(--accent))" />
            Làm thế nào để tùy biến?
          </h2>
          <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.95rem', lineHeight: '1.7' }}>
            Bạn có thể bắt đầu xây dựng giao diện của mình trực tiếp bằng cách sửa đổi nội dung tại:
            <br />
            <code
              style={{
                background: 'hsl(var(--bg-tertiary))',
                padding: '2px 6px',
                borderRadius: '4px',
                fontSize: '0.85rem',
              }}
            >
              src/pages/Home/Home.tsx
            </code>
            <br />
            Hoặc thêm các trang mới trong thư mục{' '}
            <code
              style={{
                background: 'hsl(var(--bg-tertiary))',
                padding: '2px 6px',
                borderRadius: '4px',
                fontSize: '0.85rem',
              }}
            >
              src/pages/
            </code>{' '}
            và cấu hình router tại{' '}
            <code
              style={{
                background: 'hsl(var(--bg-tertiary))',
                padding: '2px 6px',
                borderRadius: '4px',
                fontSize: '0.85rem',
              }}
            >
              src/routes/index.tsx
            </code>
            .
          </p>
        </section>
      </div>
    </div>
  );
};
