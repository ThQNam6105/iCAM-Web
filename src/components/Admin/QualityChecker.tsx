import React from 'react';
import { CheckCircle2, XCircle, ShieldCheck } from 'lucide-react';
import styles from './QualityChecker.module.css';

interface QualityCheckerProps {
  title: string;
  excerpt: string;
  content: string;
  image: string;
  metaDescription: string;
}

export const QualityChecker: React.FC<QualityCheckerProps> = ({
  title,
  excerpt,
  content,
  image,
  metaDescription,
}) => {
  const wordCount = content.replace(/<[^>]*>/g, '').trim().split(/\s+/).filter(Boolean).length;
  const hasHeadings = /<h[23][^>]*>/i.test(content);

  const checks = [
    { label: 'Ảnh bìa chuẩn (khuyên dùng 1200 x 630 px, tỷ lệ 16:9)', pass: Boolean(image && (image.startsWith('http') || image.startsWith('data:image/'))) },
    { label: 'Tiêu đề đầy đủ (>= 5 ký tự)', pass: Boolean(title && title.trim().length >= 5) },
    { label: 'Tóm tắt bài viết (>= 10 ký tự)', pass: Boolean(excerpt && excerpt.trim().length >= 10) },
    { label: 'Độ dài nội dung (>= 50 từ)', pass: wordCount >= 50 },
    { label: 'Cấu trúc bài viết (H2/H3)', pass: hasHeadings },
    { label: 'Mô tả tìm kiếm SEO (Meta Description >= 10 ký tự)', pass: Boolean(metaDescription && metaDescription.trim().length >= 10) },
  ];

  const passedCount = checks.filter((c) => c.pass).length;
  const scorePercent = Math.round((passedCount / checks.length) * 100);

  const getScoreClass = () => {
    if (scorePercent >= 80) return styles.scoreHigh;
    if (scorePercent >= 50) return styles.scoreMedium;
    return styles.scoreLow;
  };

  return (
    <div className={styles.checkerCard}>
      <div className={styles.header}>
        <div className={styles.title}>
          <ShieldCheck size={18} color="#F58220" /> Kiểm tra chất lượng đăng bài (Publishing Readiness)
        </div>

        <div className={`${styles.scoreBadge} ${getScoreClass()}`}>
          Điểm SEO & xuất bản: {scorePercent}%
        </div>
      </div>

      <div className={styles.checklist}>
        {checks.map((item, idx) => (
          <div key={idx} className={`${styles.checkItem} ${item.pass ? styles.passed : styles.failed}`}>
            {item.pass ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
