import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronDown,
  FileText,
  Search,
  Image as ImageIcon,
  TrendingUp,
  Wand2,
  Sparkles,
} from 'lucide-react';
import styles from './QualityChecker.module.css';

export interface QualityCheckerProps {
  title: string;
  titleEn?: string;
  excerpt: string;
  content: string;
  image: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;

  // Quick-fix callbacks
  onFixMetaDescription?: (val: string) => void;
  onFixSlug?: (val: string) => void;
  onFixContent?: (val: string) => void;
  onBlockersChange?: (blockersCount: number) => void;
}

export const QualityChecker: React.FC<QualityCheckerProps> = ({
  title,
  titleEn = '',
  excerpt,
  content,
  image,
  slug,
  metaTitle,
  metaDescription,
  onFixMetaDescription,
  onFixSlug,
  onFixContent,
  onBlockersChange,
}) => {
  // Accordion state
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    content: true,
    seo: false,
    media: false,
    conversion: true,
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // --- CALCULATIONS & ANALYSIS ---
  const cleanText = content.replace(/<[^>]*>/g, '').trim();
  const wordCount = cleanText ? cleanText.split(/\s+/).filter(Boolean).length : 0;
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  // Paragraph length check
  const paragraphs = content.split(/<\/p>/i).filter((p) => p.replace(/<[^>]*>/g, '').trim().length > 0);
  const longParagraphs = paragraphs.filter((p) => {
    const pText = p.replace(/<[^>]*>/g, '').trim();
    return pText.split(/\s+/).filter(Boolean).length > 150;
  });

  // Headings check
  const h2Matches = (content.match(/<h2[^>]*>/gi) || []).length;
  const h3Matches = (content.match(/<h3[^>]*>/gi) || []).length;

  // Internal Links check
  const linkMatches = (content.match(/<a\s+[^>]*href=["']([^"']+)["']/gi) || []).length;

  // Images & ALT tags check
  const imgMatches = content.match(/<img\s+[^>]*>/gi) || [];
  const missingAltImgs = imgMatches.filter((img) => !/alt=["']([^"']+)["']/i.test(img) || /alt=["']\s*["']/i.test(img)).length;

  // Conversion Indicators (iCANCAM English Center)
  const lowerContent = content.toLowerCase();
  const hasCtaBanner = lowerContent.includes('tư vấn') || lowerContent.includes('đăng ký') || lowerContent.includes('dieu-tu-van') || lowerContent.includes('cta');
  const hasCourseLink = lowerContent.includes('curriculum') || lowerContent.includes('khóa học') || lowerContent.includes('ielts') || lowerContent.includes('toeic');
  const hasContactInfo = lowerContent.includes('hotline') || lowerContent.includes('0909') || lowerContent.includes('contact') || lowerContent.includes('địa chỉ');

  // --- 1. CONTENT QUALITY (40% Weight) ---
  const checkViTitle = Boolean(title && title.trim().length >= 5);
  const checkEnTitle = Boolean(titleEn && titleEn.trim().length >= 5);
  const checkExcerpt = Boolean(excerpt && excerpt.trim().length >= 10);
  const checkLength = wordCount >= 50;
  const checkHeadings = h2Matches >= 1;
  const checkNoLongParagraphs = longParagraphs.length === 0;

  let contentPts = 0;
  if (checkViTitle) contentPts += 7;
  if (checkEnTitle) contentPts += 6;
  if (checkExcerpt) contentPts += 7;
  if (checkLength) contentPts += 8;
  if (checkHeadings) contentPts += 6;
  if (checkNoLongParagraphs) contentPts += 6;
  const contentScorePercent = Math.min(100, Math.round((contentPts / 40) * 100));

  // --- 2. SEO (30% Weight) ---
  const titleLen = (metaTitle || title || '').trim().length;
  const descLen = (metaDescription || excerpt || '').trim().length;

  const checkSeoTitle = titleLen >= 10 && titleLen <= 70;
  const checkMetaDesc = descLen >= 100 && descLen <= 170;
  const checkSlug = Boolean(slug && slug.trim().length >= 3 && !/\s/.test(slug));
  const checkInternalLinks = linkMatches >= 1;
  const checkImageAlt = missingAltImgs === 0;
  const checkCoverImage = Boolean(image && (image.startsWith('http') || image.startsWith('data:image/')));

  let seoPts = 0;
  if (checkSeoTitle) seoPts += 5;
  if (checkMetaDesc) seoPts += 6;
  if (checkSlug) seoPts += 6;
  if (checkInternalLinks) seoPts += 4;
  if (checkImageAlt) seoPts += 4;
  if (checkCoverImage) seoPts += 5;
  const seoScorePercent = Math.min(100, Math.round((seoPts / 30) * 100));

  // --- 3. MEDIA (15% Weight) ---
  const checkCoverRes = Boolean(image && (image.startsWith('http') || image.startsWith('data:image/')));
  const checkInlineImgs = imgMatches.length >= 1;

  let mediaPts = 0;
  if (checkCoverRes) mediaPts += 8;
  if (checkInlineImgs) mediaPts += 4;
  if (checkImageAlt) mediaPts += 3;
  const mediaScorePercent = Math.min(100, Math.round((mediaPts / 15) * 100));

  // --- 4. CONVERSION (15% Weight) ---
  let conversionPts = 0;
  if (hasCtaBanner) conversionPts += 5;
  if (hasCourseLink) conversionPts += 4;
  if (hasContactInfo) conversionPts += 3;
  if (hasCtaBanner || lowerContent.includes('tư vấn')) conversionPts += 3;
  const conversionScorePercent = Math.min(100, Math.round((conversionPts / 15) * 100));

  // --- OVERALL WEIGHTED SCORE ---
  const totalScore = Math.min(100, Math.round(contentPts + seoPts + mediaPts + conversionPts));

  // --- PUBLISHING BLOCKERS ---
  const blockers: string[] = [];
  if (!title || title.trim().length < 5) blockers.push('Tiêu đề Tiếng Việt cần có ít nhất 5 ký tự.');
  if (!content || cleanText.length < 20) blockers.push('Nội dung bài viết chưa đủ độ dài tối thiểu (ít nhất 20 ký tự).');
  if (!slug || slug.trim().length < 3) blockers.push('Thiếu đường dẫn SEO Slug hợp lệ.');
  if (!image) blockers.push('Chưa chọn Ảnh bìa bài viết.');

  // Notify parent of blockers count
  React.useEffect(() => {
    onBlockersChange?.(blockers.length);
  }, [blockers.length, onBlockersChange]);

  // Status Level Helper
  const getStatusLevel = (score: number) => {
    if (score >= 91) return { label: 'Xuất Sắc (Excellent)', badgeClass: styles.statusBlue, strokeColor: '#3b82f6' };
    if (score >= 71) return { label: 'Sẵn Sàng Xuất Bản (Ready)', badgeClass: styles.statusGreen, strokeColor: '#22c55e' };
    if (score >= 41) return { label: 'Gần Hoàn Thiện (Almost Ready)', badgeClass: styles.statusOrange, strokeColor: '#f59e0b' };
    return { label: 'Cần Cải Thiện (Needs Work)', badgeClass: styles.statusRed, strokeColor: '#ef4444' };
  };

  const statusInfo = getStatusLevel(totalScore);

  // Quick Fix Handlers
  const handleAutoGenerateMetaDesc = () => {
    const generated = excerpt.trim() || cleanText.substring(0, 155).trim() + '...';
    onFixMetaDescription?.(generated);
  };

  const handleAutoGenerateSlug = () => {
    const generatedSlug = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
    onFixSlug?.(generatedSlug);
  };

  const handleAutoInsertCtaBanner = () => {
    const ctaBannerHtml = `
<div style="background: linear-gradient(135deg, #09265F 0%, #1e3a8a 100%); color: #ffffff; padding: 2rem; border-radius: 16px; margin-top: 2.5rem; text-align: center; border: 1px solid rgba(245,130,32,0.3); box-shadow: 0 10px 30px rgba(0,0,0,0.15);">
  <h3 style="color: #F58220; margin-bottom: 0.5rem; font-size: 1.35rem; font-weight: 800;">Tư Vấn Khóa Học Tiếng Anh Chuẩn Quốc Tế iCANCAM</h3>
  <p style="color: #e2e8f0; margin-bottom: 1.25rem; font-size: 0.95rem;">Đăng ký ngay để nhận buổi kiểm tra trình độ & học thử 100% miễn phí cùng Đội ngũ Giáo viên Chuyên môn cao!</p>
  <a href="/contact" style="display: inline-block; background: #F58220; color: #ffffff; font-weight: 800; padding: 0.75rem 1.75rem; border-radius: 10px; text-decoration: none; font-size: 0.95rem;">Đăng Ký Đặt Lịch Tư Vấn Ngay</a>
</div>`;
    onFixContent?.(content + ctaBannerHtml);
  };

  // SVG Circle Stroke Dash Offset calculation
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (totalScore / 100) * circumference;

  return (
    <div className={styles.assistantContainer}>
      {/* 1. OVERALL PUBLISHING READINESS BANNER */}
      <div className={styles.overallCard}>
        <div className={styles.circularWrapper}>
          <svg className={styles.circularSvg} viewBox="0 0 80 80">
            <circle className={styles.circularBg} cx="40" cy="40" r={radius} />
            <circle
              className={styles.circularProgress}
              cx="40"
              cy="40"
              r={radius}
              stroke={statusInfo.strokeColor}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
            />
          </svg>
          <div className={styles.scoreTextWrapper}>
            <span className={styles.scoreNum}>{totalScore}</span>
            <span className={styles.scoreLabelMini}>ĐIỂM</span>
          </div>
        </div>

        <div className={styles.overallInfo}>
          <div className={styles.overallHeader}>
            <div className={styles.assistantTitle}>
              <ShieldCheck size={20} color="#F58220" /> Trợ Lý Đăng Bài & Chất Lượng Nội Dung
            </div>
            <div className={`${styles.statusBadge} ${statusInfo.badgeClass}`}>
              <Sparkles size={13} /> {statusInfo.label}
            </div>
          </div>

          <div className={styles.overallDesc}>
            Điểm chất lượng được tính tự động từ **Nội Dung (40%)**, **SEO (30%)**, **Hình Ảnh (15%)** và **Chuyển Đổi Khách Hàng (15%)**.
          </div>

          <div className={styles.mainProgressBarBg}>
            <div
              className={styles.mainProgressBarFill}
              style={{ width: `${totalScore}%`, background: statusInfo.strokeColor }}
            />
          </div>
        </div>
      </div>

      {/* 2. PUBLISHING BLOCKERS ALERT (IF ANY) */}
      {blockers.length > 0 && (
        <div className={styles.blockerAlert}>
          <div className={styles.blockerHeader}>
            <AlertTriangle size={18} /> ⚠️ Rào Cản Xuất Bản (Publishing Blockers - {blockers.length})
          </div>
          <div className={styles.blockerList}>
            {blockers.map((err, idx) => (
              <div key={idx} className={styles.blockerItem}>
                <XCircle size={14} color="#f87171" /> {err}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. 4 LOGICAL SECTIONS ACCORDION */}
      <div className={styles.sectionsGrid}>
        {/* SECTION 1: CONTENT QUALITY */}
        <div className={styles.sectionCard}>
          <button
            type="button"
            onClick={() => toggleSection('content')}
            className={styles.sectionHeaderBtn}
          >
            <div className={styles.sectionLeftTitle}>
              <div className={styles.sectionIconWrapper}>
                <FileText size={18} />
              </div>
              <div>
                <span className={styles.sectionName}>Chất Lượng Nội Dung</span>
                <span className={styles.sectionWeightTag}>(Trọng số 40%)</span>
              </div>
            </div>

            <div className={styles.sectionRightMeta}>
              <div className={styles.sectionProgressMini}>
                <span className={styles.sectionScoreNum}>{contentScorePercent}%</span>
                <div className={styles.sectionBarBg}>
                  <div
                    className={styles.sectionBarFill}
                    style={{ width: `${contentScorePercent}%`, background: contentScorePercent >= 70 ? '#4ade80' : '#fbbf24' }}
                  />
                </div>
              </div>
              <ChevronDown
                size={18}
                className={`${styles.chevronIcon} ${openSections.content ? styles.chevronOpen : ''}`}
              />
            </div>
          </button>

          {openSections.content && (
            <div className={styles.sectionBody}>
              <div className={styles.checkRow}>
                <div className={styles.checkRowHeader}>
                  <span className={`${styles.checkRowTitle} ${checkViTitle ? styles.checkPassed : styles.checkFailed}`}>
                    {checkViTitle ? <CheckCircle2 size={16} /> : <XCircle size={16} />} Tiêu đề Tiếng Việt
                  </span>
                  <span className={styles.checkValueTag}>{title.length} / 5+ ký tự</span>
                </div>
              </div>

              <div className={styles.checkRow}>
                <div className={styles.checkRowHeader}>
                  <span className={`${styles.checkRowTitle} ${checkEnTitle ? styles.checkPassed : styles.checkFailed}`}>
                    {checkEnTitle ? <CheckCircle2 size={16} /> : <XCircle size={16} />} Tiêu đề Tiếng Anh (Song ngữ)
                  </span>
                  <span className={styles.checkValueTag}>{titleEn.length} / 5+ ký tự</span>
                </div>
              </div>

              <div className={styles.checkRow}>
                <div className={styles.checkRowHeader}>
                  <span className={`${styles.checkRowTitle} ${checkExcerpt ? styles.checkPassed : styles.checkFailed}`}>
                    {checkExcerpt ? <CheckCircle2 size={16} /> : <XCircle size={16} />} Đoạn tóm tắt bài viết (Excerpt)
                  </span>
                  <span className={styles.checkValueTag}>{excerpt.length} / 10+ ký tự</span>
                </div>
              </div>

              <div className={styles.checkRow}>
                <div className={styles.checkRowHeader}>
                  <span className={`${styles.checkRowTitle} ${checkLength ? styles.checkPassed : styles.checkFailed}`}>
                    {checkLength ? <CheckCircle2 size={16} /> : <XCircle size={16} />} Độ dài văn bản bài viết
                  </span>
                  <span className={styles.checkValueTag}>{wordCount} từ (Ước tính đọc: ~{readingTimeMinutes} phút)</span>
                </div>
                {!checkLength && (
                  <div className={styles.checkSuggestion}>
                    Nội dung hiện tại khá ngắn. <span className={styles.recommendedText}>Khuyên dùng: từ 50 - 500 từ</span> giúp bài viết hấp dẫn hơn.
                  </div>
                )}
              </div>

              <div className={styles.checkRow}>
                <div className={styles.checkRowHeader}>
                  <span className={`${styles.checkRowTitle} ${checkHeadings ? styles.checkPassed : styles.checkFailed}`}>
                    {checkHeadings ? <CheckCircle2 size={16} /> : <XCircle size={16} />} Cấu trúc các thẻ Tiêu Đề (H2 / H3)
                  </span>
                  <span className={styles.checkValueTag}>{h2Matches} H2, {h3Matches} H3</span>
                </div>
                {!checkHeadings && (
                  <div className={styles.checkSuggestion}>
                    Bài viết nên có ít nhất 1 thẻ H2 để phân đoạn mạch lạc cho người đọc.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* SECTION 2: SEO */}
        <div className={styles.sectionCard}>
          <button
            type="button"
            onClick={() => toggleSection('seo')}
            className={styles.sectionHeaderBtn}
          >
            <div className={styles.sectionLeftTitle}>
              <div className={styles.sectionIconWrapper}>
                <Search size={18} />
              </div>
              <div>
                <span className={styles.sectionName}>Tối Ưu SEO Google</span>
                <span className={styles.sectionWeightTag}>(Trọng số 30%)</span>
              </div>
            </div>

            <div className={styles.sectionRightMeta}>
              <div className={styles.sectionProgressMini}>
                <span className={styles.sectionScoreNum}>{seoScorePercent}%</span>
                <div className={styles.sectionBarBg}>
                  <div
                    className={styles.sectionBarFill}
                    style={{ width: `${seoScorePercent}%`, background: seoScorePercent >= 70 ? '#4ade80' : '#fbbf24' }}
                  />
                </div>
              </div>
              <ChevronDown
                size={18}
                className={`${styles.chevronIcon} ${openSections.seo ? styles.chevronOpen : ''}`}
              />
            </div>
          </button>

          {openSections.seo && (
            <div className={styles.sectionBody}>
              <div className={styles.checkRow}>
                <div className={styles.checkRowHeader}>
                  <span className={`${styles.checkRowTitle} ${checkSeoTitle ? styles.checkPassed : styles.checkFailed}`}>
                    {checkSeoTitle ? <CheckCircle2 size={16} /> : <XCircle size={16} />} SEO Title (Tiêu đề Google Search)
                  </span>
                  <span className={styles.checkValueTag}>{titleLen} / 50–60 ký tự</span>
                </div>
              </div>

              <div className={styles.checkRow}>
                <div className={styles.checkRowHeader}>
                  <span className={`${styles.checkRowTitle} ${checkMetaDesc ? styles.checkPassed : styles.checkFailed}`}>
                    {checkMetaDesc ? <CheckCircle2 size={16} /> : <XCircle size={16} />} Meta Description (Mô tả tìm kiếm)
                  </span>
                  <span className={styles.checkValueTag}>{descLen} / 140–160 ký tự</span>
                </div>
                {!checkMetaDesc && onFixMetaDescription && (
                  <button type="button" onClick={handleAutoGenerateMetaDesc} className={styles.quickFixBtn}>
                    <Wand2 size={13} /> Tự động sinh Meta Description từ tóm tắt
                  </button>
                )}
              </div>

              <div className={styles.checkRow}>
                <div className={styles.checkRowHeader}>
                  <span className={`${styles.checkRowTitle} ${checkSlug ? styles.checkPassed : styles.checkFailed}`}>
                    {checkSlug ? <CheckCircle2 size={16} /> : <XCircle size={16} />} SEO Slug (Đường dẫn thân thiện)
                  </span>
                  <span className={styles.checkValueTag}>{slug || 'Chưa tạo'}</span>
                </div>
                {!checkSlug && onFixSlug && (
                  <button type="button" onClick={handleAutoGenerateSlug} className={styles.quickFixBtn}>
                    <Wand2 size={13} /> Tự động tạo SEO Slug từ tiêu đề
                  </button>
                )}
              </div>

              <div className={styles.checkRow}>
                <div className={styles.checkRowHeader}>
                  <span className={`${styles.checkRowTitle} ${checkInternalLinks ? styles.checkPassed : styles.checkFailed}`}>
                    {checkInternalLinks ? <CheckCircle2 size={16} /> : <XCircle size={16} />} Liên kết nội bộ (Internal Links)
                  </span>
                  <span className={styles.checkValueTag}>{linkMatches} liên kết</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 3: MEDIA */}
        <div className={styles.sectionCard}>
          <button
            type="button"
            onClick={() => toggleSection('media')}
            className={styles.sectionHeaderBtn}
          >
            <div className={styles.sectionLeftTitle}>
              <div className={styles.sectionIconWrapper}>
                <ImageIcon size={18} />
              </div>
              <div>
                <span className={styles.sectionName}>Hình Ảnh & Đa Phương Tiện</span>
                <span className={styles.sectionWeightTag}>(Trọng số 15%)</span>
              </div>
            </div>

            <div className={styles.sectionRightMeta}>
              <div className={styles.sectionProgressMini}>
                <span className={styles.sectionScoreNum}>{mediaScorePercent}%</span>
                <div className={styles.sectionBarBg}>
                  <div
                    className={styles.sectionBarFill}
                    style={{ width: `${mediaScorePercent}%`, background: mediaScorePercent >= 70 ? '#4ade80' : '#fbbf24' }}
                  />
                </div>
              </div>
              <ChevronDown
                size={18}
                className={`${styles.chevronIcon} ${openSections.media ? styles.chevronOpen : ''}`}
              />
            </div>
          </button>

          {openSections.media && (
            <div className={styles.sectionBody}>
              <div className={styles.checkRow}>
                <div className={styles.checkRowHeader}>
                  <span className={`${styles.checkRowTitle} ${checkCoverImage ? styles.checkPassed : styles.checkFailed}`}>
                    {checkCoverImage ? <CheckCircle2 size={16} /> : <XCircle size={16} />} Ảnh bìa bài viết chuẩn (1200 x 630 px, 16:9)
                  </span>
                  <span className={styles.checkValueTag}>{image ? 'Đã có' : 'Trống'}</span>
                </div>
              </div>

              <div className={styles.checkRow}>
                <div className={styles.checkRowHeader}>
                  <span className={`${styles.checkRowTitle} ${checkImageAlt ? styles.checkPassed : styles.checkFailed}`}>
                    {checkImageAlt ? <CheckCircle2 size={16} /> : <XCircle size={16} />} Mô tả ảnh Alt Text cho Google Image
                  </span>
                  <span className={styles.checkValueTag}>
                    {missingAltImgs === 0 ? 'Hoàn hảo' : `Thiếu ${missingAltImgs} thẻ Alt`}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 4: CONVERSION (iCANCAM English Center) */}
        <div className={styles.sectionCard}>
          <button
            type="button"
            onClick={() => toggleSection('conversion')}
            className={styles.sectionHeaderBtn}
          >
            <div className={styles.sectionLeftTitle}>
              <div className={styles.sectionIconWrapper}>
                <TrendingUp size={18} />
              </div>
              <div>
                <span className={styles.sectionName}>Chuyển Đổi & Tư Vấn Khóa Học (Conversion)</span>
                <span className={styles.sectionWeightTag}>(Trọng số 15%)</span>
              </div>
            </div>

            <div className={styles.sectionRightMeta}>
              <div className={styles.sectionProgressMini}>
                <span className={styles.sectionScoreNum}>{conversionScorePercent}%</span>
                <div className={styles.sectionBarBg}>
                  <div
                    className={styles.sectionBarFill}
                    style={{ width: `${conversionScorePercent}%`, background: conversionScorePercent >= 70 ? '#4ade80' : '#fbbf24' }}
                  />
                </div>
              </div>
              <ChevronDown
                size={18}
                className={`${styles.chevronIcon} ${openSections.conversion ? styles.chevronOpen : ''}`}
              />
            </div>
          </button>

          {openSections.conversion && (
            <div className={styles.sectionBody}>
              <div className={styles.checkRow}>
                <div className={styles.checkRowHeader}>
                  <span className={`${styles.checkRowTitle} ${hasCtaBanner ? styles.checkPassed : styles.checkFailed}`}>
                    {hasCtaBanner ? <CheckCircle2 size={16} /> : <XCircle size={16} />} Khung Kêu Gọi Đăng Ký Tư Vấn (CTA Banner)
                  </span>
                  <span className={styles.checkValueTag}>{hasCtaBanner ? 'Đã chèn' : 'Chưa có'}</span>
                </div>
                {!hasCtaBanner && onFixContent && (
                  <button type="button" onClick={handleAutoInsertCtaBanner} className={styles.quickFixBtn}>
                    <Wand2 size={13} /> Tự động chèn Banner Đăng Ký Tư Vấn iCANCAM ở cuối bài
                  </button>
                )}
              </div>

              <div className={styles.checkRow}>
                <div className={styles.checkRowHeader}>
                  <span className={`${styles.checkRowTitle} ${hasCourseLink ? styles.checkPassed : styles.checkFailed}`}>
                    {hasCourseLink ? <CheckCircle2 size={16} /> : <XCircle size={16} />} Liên kết Khóa Học Tiếng Anh liên quan
                  </span>
                  <span className={styles.checkValueTag}>{hasCourseLink ? 'Tốt' : 'Chưa gắn'}</span>
                </div>
              </div>

              <div className={styles.checkRow}>
                <div className={styles.checkRowHeader}>
                  <span className={`${styles.checkRowTitle} ${hasContactInfo ? styles.checkPassed : styles.checkFailed}`}>
                    {hasContactInfo ? <CheckCircle2 size={16} /> : <XCircle size={16} />} Thông tin Hotline / Liên hệ Đăng ký
                  </span>
                  <span className={styles.checkValueTag}>{hasContactInfo ? 'Đầy đủ' : 'Chưa có'}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QualityChecker;
