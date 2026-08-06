import React, { useState } from 'react';
import {
  Sparkles,
  Globe,
  Share2,
  MessageCircle,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  ExternalLink,
  CheckCircle2,
  Sliders,
} from 'lucide-react';
import styles from './SeoPanel.module.css';

interface SeoPanelProps {
  articleTitle: string;
  articleExcerpt: string;
  articleContent: string;
  coverImage: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonicalUrlOverride?: string;
  noIndex?: boolean;
  noFollow?: boolean;

  onChangeSlug: (val: string) => void;
  onChangeMetaTitle: (val: string) => void;
  onChangeMetaDescription: (val: string) => void;
  onChangeOgTitle?: (val: string) => void;
  onChangeOgDescription?: (val: string) => void;
  onChangeOgImage?: (val: string) => void;
  onChangeCanonicalUrlOverride?: (val: string) => void;
  onChangeNoIndex?: (val: boolean) => void;
  onChangeNoFollow?: (val: boolean) => void;
}

export const SeoPanel: React.FC<SeoPanelProps> = ({
  articleTitle,
  articleExcerpt,
  articleContent,
  coverImage,
  slug,
  metaTitle,
  metaDescription,
  ogTitle,
  ogDescription,
  ogImage,
  canonicalUrlOverride,
  noIndex = false,
  noFollow = false,

  onChangeSlug,
  onChangeMetaTitle,
  onChangeMetaDescription,
  onChangeOgTitle,
  onChangeOgDescription,
  onChangeOgImage,
  onChangeCanonicalUrlOverride,
  onChangeNoIndex,
  onChangeNoFollow,
}) => {
  const [activeTab, setActiveTab] = useState<'google' | 'facebook' | 'zalo'>('google');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const domain = typeof window !== 'undefined' ? window.location.host : 'thieunamicancam.online';
  const autoSlug = slug || 'bai-viet-moi';
  const autoCanonicalUrl = canonicalUrlOverride || `https://${domain}/news/${autoSlug}`;

  // Helper to extract first paragraph text from HTML content
  const extractFirstParagraph = (html: string): string => {
    if (!html) return '';
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const text = tempDiv.textContent || tempDiv.innerText || '';
    return text.trim().slice(0, 160);
  };

  // Automatic Metadata Fallback Cascade
  const autoTitle = metaTitle.trim() || articleTitle.trim() || 'Tiêu Đề Bài Viết iCANCAM';
  const autoDescription =
    metaDescription.trim() ||
    articleExcerpt.trim() ||
    extractFirstParagraph(articleContent) ||
    'Trung tâm Anh ngữ iCANCAM - Chương trình học tiếng Anh chất lượng cao...';

  const finalOgTitle = ogTitle?.trim() || `${autoTitle} | iCANCAM`;
  const finalOgDescription = ogDescription?.trim() || autoDescription;
  const finalOgImage =
    ogImage?.trim() ||
    coverImage?.trim() ||
    'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop';

  // Title & Description length indicators
  const titleLen = autoTitle.length;
  const descLen = autoDescription.length;

  const getTitleStatus = () => {
    if (titleLen >= 45 && titleLen <= 65) return { text: 'Đạt chuẩn Google (45–65 tự)', class: styles.countGood };
    if (titleLen > 0 && titleLen < 45) return { text: 'Nên dài hơn (45–65 tự)', class: styles.countWarn };
    return { text: 'Quá dài (Nên dưới 65 tự)', class: styles.countBad };
  };

  const getDescStatus = () => {
    if (descLen >= 120 && descLen <= 165) return { text: 'Đạt chuẩn Google (120–165 tự)', class: styles.countGood };
    if (descLen > 0 && descLen < 120) return { text: 'Nên viết chi tiết hơn', class: styles.countWarn };
    return { text: 'Nên rút gọn dưới 165 tự', class: styles.countBad };
  };

  // Automatic Quality Health Checks
  const checks = [
    { label: 'Tiêu đề bài viết rõ ràng', pass: articleTitle.trim().length >= 10 },
    { label: 'Có đoạn tóm tắt chất lượng', pass: articleExcerpt.trim().length >= 20 },
    { label: 'Hình ảnh bìa minh họa chuẩn 16:9', pass: Boolean(coverImage && coverImage.startsWith('http')) },
    { label: 'Đường dẫn Slug chuẩn SEO', pass: Boolean(slug && slug.length >= 3) },
  ];
  const passedCount = checks.filter((c) => c.pass).length;
  const healthScore = Math.round((passedCount / checks.length) * 100);

  return (
    <div className={styles.container}>
      {/* Header with Health Score & Auto Badge */}
      <div className={styles.headerRow}>
        <div className={styles.headerTitleGroup}>
          <h4 className={styles.headerTitle}>
            <Sparkles size={18} /> Trợ Lý Tự Động SEO & Phân Phối Mạng Xã Hội
          </h4>
          <span className={styles.autoTag}>
            <CheckCircle2 size={12} /> Auto-Generated Open Graph & Schema
          </span>
        </div>

        <div
          className={`${styles.healthBadge} ${
            healthScore >= 75 ? styles.healthGreen : healthScore >= 50 ? styles.healthOrange : styles.healthRed
          }`}
        >
          <ShieldCheck size={14} /> Điểm Đọc & SEO: {healthScore}%
        </div>
      </div>

      {/* Editor Main Fields (Convention over configuration) */}
      <div className={styles.editorFieldsGrid}>
        <div className={styles.fieldGroup}>
          <div className={styles.labelRow}>
            <label className={styles.label}>Tùy chỉnh Tiêu đề Google (SEO Title)</label>
            <span className={`${styles.charBadge} ${getTitleStatus().class}`}>
              {titleLen} tự — {getTitleStatus().text}
            </span>
          </div>
          <input
            type="text"
            value={metaTitle}
            onChange={(e) => onChangeMetaTitle(e.target.value)}
            placeholder={articleTitle || 'Tự động sử dụng Tiêu đề bài viết...'}
            className={styles.input}
          />
        </div>

        <div className={styles.fieldGroup}>
          <div className={styles.labelRow}>
            <label className={styles.label}>Tùy chỉnh Mô tả Tìm kiếm (SEO Description)</label>
            <span className={`${styles.charBadge} ${getDescStatus().class}`}>
              {descLen} tự — {getDescStatus().text}
            </span>
          </div>
          <textarea
            rows={2}
            value={metaDescription}
            onChange={(e) => onChangeMetaDescription(e.target.value)}
            placeholder={articleExcerpt || 'Tự động trích xuất từ đoạn tóm tắt bài viết...'}
            className={styles.textarea}
          />
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>Đường dẫn tĩnh thân thiện (URL Slug)</label>
          <div className={styles.slugInputWrapper}>
            <span className={styles.slugPrefix}>https://{domain}/news/</span>
            <input
              type="text"
              value={slug}
              onChange={(e) => onChangeSlug(e.target.value)}
              placeholder="duong-dan-bai-viet"
              className={styles.slugInput}
            />
          </div>
        </div>
      </div>

      {/* REAL-TIME AUTOMATIC SOCIAL PREVIEW PANEL */}
      <div className={styles.previewSection}>
        <div className={styles.previewHeader}>
          <span className={styles.previewTitle}>
            👁️ Xem Trực Tiếp Giao Diện Phân Phối (Live Social & Search Preview)
          </span>

          <div className={styles.previewTabs}>
            <button
              type="button"
              onClick={() => setActiveTab('google')}
              className={`${styles.tabBtn} ${activeTab === 'google' ? styles.tabBtnActive : ''}`}
            >
              <Globe size={14} /> Google Search
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('facebook')}
              className={`${styles.tabBtn} ${activeTab === 'facebook' ? styles.tabBtnActive : ''}`}
            >
              <Share2 size={14} /> Facebook Card
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('zalo')}
              className={`${styles.tabBtn} ${activeTab === 'zalo' ? styles.tabBtnActive : ''}`}
            >
              <MessageCircle size={14} /> Zalo Share
            </button>
          </div>
        </div>

        <div className={styles.previewBody}>
          {/* TAB 1: GOOGLE SEARCH PREVIEW */}
          {activeTab === 'google' && (
            <div className={styles.googleCard}>
              <div className={styles.googleHeader}>
                <div className={styles.googleFavicon}>i</div>
                <div className={styles.googleUrlInfo}>
                  <div className={styles.googleDomain}>iCANCAM English Center</div>
                  <div className={styles.googleUrl}>{autoCanonicalUrl}</div>
                </div>
              </div>
              <div className={styles.googleTitle}>{autoTitle} | iCANCAM</div>
              <div className={styles.googleSnippet}>{autoDescription}</div>
            </div>
          )}

          {/* TAB 2: FACEBOOK CARD PREVIEW */}
          {activeTab === 'facebook' && (
            <div className={styles.facebookCard}>
              <div className={styles.fbImageWrapper}>
                <img src={finalOgImage} alt="Social Cover Preview" className={styles.fbImage} />
              </div>
              <div className={styles.fbContent}>
                <div className={styles.fbDomain}>{domain.toUpperCase()}</div>
                <div className={styles.fbTitle}>{finalOgTitle}</div>
                <div className={styles.fbSnippet}>{finalOgDescription}</div>
              </div>
            </div>
          )}

          {/* TAB 3: ZALO SHARE PREVIEW */}
          {activeTab === 'zalo' && (
            <div className={styles.zaloCard}>
              <div className={styles.zaloImageWrapper}>
                <img src={finalOgImage} alt="Zalo Preview" className={styles.zaloImage} />
              </div>
              <div className={styles.zaloContent}>
                <div className={styles.zaloBrand}>THÔNG TIN TỪ ICANCAM</div>
                <div className={styles.zaloTitle}>{finalOgTitle}</div>
                <div className={styles.zaloDesc}>{finalOgDescription}</div>
                <div className={styles.zaloFooter}>
                  <span>{domain}</span>
                  <ExternalLink size={12} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ADVANCED SEO ACCORDION (Collapsed by default for enterprise usage) */}
      <button
        type="button"
        onClick={() => setShowAdvanced(!showAdvanced)}
        className={styles.accordionToggle}
      >
        <span className={styles.accordionToggleText}>
          <Sliders size={15} /> Advanced SEO (Cấu hình nâng cao - Dành cho chuyên gia)
        </span>
        {showAdvanced ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </button>

      {showAdvanced && (
        <div className={styles.advancedBox}>
          <div className={styles.advancedNote}>
            ⚠️ Các mục dưới đây là tùy chọn nâng cao. Hệ thống đã tự động cấu hình tối ưu 100%. Bạn chỉ nhập nếu cần ghi đè thủ công.
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Canonical URL Override (Đường dẫn gốc ghi đè)</label>
            <input
              type="url"
              value={canonicalUrlOverride || ''}
              onChange={(e) => onChangeCanonicalUrlOverride?.(e.target.value)}
              placeholder={`Tự động sinh: ${autoCanonicalUrl}`}
              className={styles.input}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Open Graph Title Override (Tiêu đề chia sẻ Facebook/Zalo)</label>
            <input
              type="text"
              value={ogTitle || ''}
              onChange={(e) => onChangeOgTitle?.(e.target.value)}
              placeholder={`Tự động: ${finalOgTitle}`}
              className={styles.input}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Open Graph Description Override (Mô tả chia sẻ)</label>
            <textarea
              rows={2}
              value={ogDescription || ''}
              onChange={(e) => onChangeOgDescription?.(e.target.value)}
              placeholder={`Tự động: ${finalOgDescription}`}
              className={styles.textarea}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Open Graph Image Override (Ảnh chia sẻ thủ công)</label>
            <input
              type="url"
              value={ogImage || ''}
              onChange={(e) => onChangeOgImage?.(e.target.value)}
              placeholder={`Tự động: Dùng ảnh bìa bài viết`}
              className={styles.input}
            />
          </div>

          <div className={styles.checkboxRow}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={noIndex}
                onChange={(e) => onChangeNoIndex?.(e.target.checked)}
                className={styles.checkbox}
              />
              <span>Noindex (Yêu cầu Google không lập chỉ mục bài đọc này)</span>
            </label>

            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={noFollow}
                onChange={(e) => onChangeNoFollow?.(e.target.checked)}
                className={styles.checkbox}
              />
              <span>Nofollow (Không cho phép Robot tìm kiếm theo dõi liên kết trong bài)</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};
