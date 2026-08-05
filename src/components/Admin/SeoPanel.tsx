import React from 'react';
import { Search } from 'lucide-react';
import styles from './SeoPanel.module.css';

interface SeoPanelProps {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
  canonicalUrl: string;
  onChangeMetaTitle: (val: string) => void;
  onChangeMetaDescription: (val: string) => void;
  onChangeOgImage: (val: string) => void;
  onChangeCanonicalUrl: (val: string) => void;
}

export const SeoPanel: React.FC<SeoPanelProps> = ({
  slug,
  metaTitle,
  metaDescription,
  ogImage,
  canonicalUrl,
  onChangeMetaTitle,
  onChangeMetaDescription,
  onChangeOgImage,
  onChangeCanonicalUrl,
}) => {
  const displayTitle = metaTitle || 'Tiêu đề bài viết iCANCAM English Center';
  const displaySnippet =
    metaDescription || 'Tóm tắt bài viết hỗ trợ tối ưu tìm kiếm Google Search và chia sẻ trên Facebook/Zalo...';

  return (
    <div className={styles.seoContainer}>
      <h4 className={styles.seoTitle}>
        <Search size={18} /> Cấu Hình SEO & Open Graph Social Media
      </h4>

      <div className={styles.seoGrid}>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>SEO Meta Title (Tiêu đề tìm kiếm)</label>
          <input
            type="text"
            value={metaTitle}
            onChange={(e) => onChangeMetaTitle(e.target.value)}
            placeholder="Mặc định lấy từ tiêu đề bài viết..."
            className={styles.input}
          />
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>Open Graph Image (Ảnh chia sẻ MXH)</label>
          <input
            type="text"
            value={ogImage}
            onChange={(e) => onChangeOgImage(e.target.value)}
            placeholder="URL ảnh bìa chia sẻ Facebook/Zalo..."
            className={styles.input}
          />
        </div>

        <div className={styles.fieldGroup} style={{ gridColumn: 'span 2' }}>
          <label className={styles.label}>SEO Meta Description (Mô tả tìm kiếm - tối đa 160 ký tự)</label>
          <textarea
            rows={2}
            value={metaDescription}
            onChange={(e) => onChangeMetaDescription(e.target.value)}
            placeholder="Mô tả bài viết xuất hiện trên kết quả Google..."
            className={styles.textarea}
          />
        </div>

        <div className={styles.fieldGroup} style={{ gridColumn: 'span 2' }}>
          <label className={styles.label}>Canonical URL (Đường dẫn gốc)</label>
          <input
            type="url"
            value={canonicalUrl}
            onChange={(e) => onChangeCanonicalUrl(e.target.value)}
            placeholder={`https://thieunamicancam.online/news#${slug}`}
            className={styles.input}
          />
        </div>
      </div>

      {/* Google Live Search Result Card */}
      <div className={styles.googlePreviewCard}>
        <div className={styles.previewDomain}>
          https://thieunamicancam.online › news › {slug || 'bai-viet'}
        </div>
        <div className={styles.previewTitle}>{displayTitle} | iCANCAM English Center</div>
        <div className={styles.previewSnippet}>{displaySnippet}</div>
      </div>
    </div>
  );
};
