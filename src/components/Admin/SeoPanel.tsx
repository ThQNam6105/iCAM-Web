import React, { useState } from 'react';
import { Sparkles, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';
import styles from './SeoPanel.module.css';

interface SeoPanelProps {
  articleTitle: string;
  articleExcerpt: string;
  coverImage: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  canonicalUrlOverride?: string;
  noIndex?: boolean;

  onChangeSlug: (val: string) => void;
  onChangeMetaTitle: (val: string) => void;
  onChangeMetaDescription: (val: string) => void;
  onChangeOgImage?: (val: string) => void;
  onChangeOgTitle?: (val: string) => void;
  onChangeOgDescription?: (val: string) => void;
  onChangeCanonicalUrlOverride?: (val: string) => void;
  onChangeNoIndex?: (val: boolean) => void;
}

export const SeoPanel: React.FC<SeoPanelProps> = ({
  articleTitle,
  articleExcerpt,
  coverImage,
  slug,
  metaTitle,
  metaDescription,
  ogImage,
  ogTitle,
  ogDescription,
  canonicalUrlOverride,
  noIndex = false,

  onChangeSlug,
  onChangeMetaTitle,
  onChangeMetaDescription,
  onChangeOgImage,
  onChangeOgTitle,
  onChangeOgDescription,
  onChangeCanonicalUrlOverride,
  onChangeNoIndex,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Automatic Fallbacks
  const displayTitle = metaTitle.trim() || articleTitle.trim() || 'Tiêu đề bài viết iCANCAM English Center';
  const displayDescription =
    metaDescription.trim() ||
    articleExcerpt.trim() ||
    'Tóm tắt bài viết tự động hỗ trợ tối ưu hóa kết quả tìm kiếm trên Google Search...';
  const displaySlug = slug || 'bai-viet-moi';
  const canonicalUrl = canonicalUrlOverride || `https://thieunamicancam.online/news#${displaySlug}`;

  // Character Counts & Recommendations
  const titleLen = displayTitle.length;
  const descLen = displayDescription.length;

  const getTitleCountClass = () => {
    if (titleLen >= 50 && titleLen <= 60) return styles.countGood;
    if (titleLen > 0 && titleLen < 50) return styles.countWarn;
    return styles.countBad;
  };

  const getDescCountClass = () => {
    if (descLen >= 140 && descLen <= 160) return styles.countGood;
    if (descLen > 0 && descLen < 140) return styles.countWarn;
    return styles.countBad;
  };

  // Smart SEO Quality Score (0 - 100%)
  const checks = [
    { label: 'Tiêu đề SEO đạt độ dài lý tưởng (50-60 tự)', pass: titleLen >= 40 && titleLen <= 65 },
    { label: 'Mô tả SEO đạt độ dài lý tưởng (140-160 tự)', pass: descLen >= 100 && descLen <= 170 },
    { label: 'Đường dẫn Slug chuẩn SEO', pass: Boolean(slug && slug.length >= 3) },
    { label: 'Ảnh bìa Open Graph mặc định', pass: Boolean(coverImage && coverImage.startsWith('http')) },
  ];
  const passedCount = checks.filter((c) => c.pass).length;
  const seoScore = Math.round((passedCount / checks.length) * 100);

  const getScoreBadgeClass = () => {
    if (seoScore >= 80) return styles.scoreGreen;
    if (seoScore >= 50) return styles.scoreOrange;
    return styles.scoreRed;
  };

  return (
    <div className={styles.smartSeoContainer}>
      <div className={styles.headerRow}>
        <h4 className={styles.title}>
          <Sparkles size={18} /> Smart SEO Panel (Tối Ưu Tìm Kiếm Tự Động)
        </h4>

        <div className={`${styles.scoreBadge} ${getScoreBadgeClass()}`}>
          <ShieldCheck size={15} /> Điểm SEO: {seoScore}%
        </div>
      </div>

      {/* 1. SEO Title */}
      <div className={styles.fieldGroup}>
        <div className={styles.labelRow}>
          <label className={styles.label}>SEO Title (Tiêu đề Google Search)</label>
          <span className={`${styles.charCount} ${getTitleCountClass()}`}>
            {titleLen} / 60 ký tự (Khuyên dùng: 50–60)
          </span>
        </div>
        <input
          type="text"
          value={metaTitle}
          onChange={(e) => onChangeMetaTitle(e.target.value)}
          placeholder={articleTitle || 'Mặc định tự dùng Tiêu đề bài viết...'}
          className={styles.input}
        />
      </div>

      {/* 2. Meta Description */}
      <div className={styles.fieldGroup}>
        <div className={styles.labelRow}>
          <label className={styles.label}>Meta Description (Mô tả tìm kiếm)</label>
          <span className={`${styles.charCount} ${getDescCountClass()}`}>
            {descLen} / 160 ký tự (Khuyên dùng: 140–160)
          </span>
        </div>
        <textarea
          rows={2}
          value={metaDescription}
          onChange={(e) => onChangeMetaDescription(e.target.value)}
          placeholder={articleExcerpt || 'Mặc định tự sinh từ đoạn tóm tắt bài viết...'}
          className={styles.textarea}
        />
      </div>

      {/* 3. SEO Slug */}
      <div className={styles.fieldGroup}>
        <label className={styles.label}>SEO Slug (Đường dẫn thân thiện URL)</label>
        <input
          type="text"
          value={slug}
          onChange={(e) => onChangeSlug(e.target.value)}
          placeholder="chua-co-slug"
          className={styles.input}
        />
      </div>

      {/* 4. Realistic Google Search Live Preview */}
      <div className={styles.googlePreviewCard}>
        <div className={styles.previewDomain}>
          {canonicalUrl}
        </div>
        <div className={styles.previewTitle}>{displayTitle} | iCANCAM English Center</div>
        <div className={styles.previewSnippet}>{displayDescription}</div>
      </div>

      {/* 5. Collapsed Advanced SEO Accordion */}
      <button
        type="button"
        onClick={() => setShowAdvanced(!showAdvanced)}
        className={styles.accordionToggle}
      >
        <span>⚙️ Advanced SEO (Cấu hình SEO Nâng cao - Dành cho chuyên gia)</span>
        {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {showAdvanced && (
        <div className={styles.advancedBox}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Canonical URL (Đường dẫn gốc ghi đè)</label>
            <input
              type="url"
              value={canonicalUrlOverride || ''}
              onChange={(e) => onChangeCanonicalUrlOverride?.(e.target.value)}
              placeholder={`Tự động: ${canonicalUrl}`}
              className={styles.input}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Open Graph Image (Ảnh ghi đè cho Facebook/Zalo)</label>
            <input
              type="url"
              value={ogImage || ''}
              onChange={(e) => onChangeOgImage?.(e.target.value)}
              placeholder={`Tự động: Dùng ảnh bìa (${coverImage || 'Chưa có'})`}
              className={styles.input}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Open Graph Title (Tiêu đề ghi đè Facebook/Zalo)</label>
            <input
              type="text"
              value={ogTitle || ''}
              onChange={(e) => onChangeOgTitle?.(e.target.value)}
              placeholder={`Tự động: ${displayTitle}`}
              className={styles.input}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Open Graph Description (Mô tả ghi đè Facebook/Zalo)</label>
            <textarea
              rows={2}
              value={ogDescription || ''}
              onChange={(e) => onChangeOgDescription?.(e.target.value)}
              placeholder={`Tự động: ${displayDescription}`}
              className={styles.textarea}
            />
          </div>

          <div className={styles.fieldGroup} style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              id="noindex-check"
              checked={noIndex}
              onChange={(e) => onChangeNoIndex?.(e.target.checked)}
            />
            <label htmlFor="noindex-check" className={styles.label} style={{ cursor: 'pointer' }}>
              Chế độ Noindex / Nofollow (Yêu cầu Google KHÔNG lập chỉ mục bài viết này)
            </label>
          </div>
        </div>
      )}
    </div>
  );
};
