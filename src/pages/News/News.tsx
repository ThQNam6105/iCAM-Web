import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useParams } from 'react-router-dom';
import {
  Sparkles,
  Calendar,
  ArrowRight,
  ChevronRight,
  X,
  Send,
  BookOpen,
  Share2,
  Copy,
  Check,
} from 'lucide-react';
import styles from './News.module.css';
import { articlesData, type Article } from '../../data/newsData';
import { useLanguage } from '../../contexts/LanguageContext';
import { SectionTransition } from '../../components/SectionTransition/SectionTransition';
import { getPublicNewsPosts, fetchPostsFromSupabase, type DynamicNewsItem } from '../../services/newsService';
import { generateTableOfContents } from '../../utils/tocGenerator';
import { TableOfContents } from '../../components/TableOfContents/TableOfContents';
import { useToast } from '../../components/Toast/Toast';

export const News: React.FC = () => {
  const { language, t } = useLanguage();
  const { showToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const params = useParams<{ slug?: string }>();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedArticle, setSelectedArticle] = useState<Article | DynamicNewsItem | null>(() => {
    const urlSlug = params.slug || new URLSearchParams(window.location.search).get('slug');
    if (urlSlug) {
      const dynamic = getPublicNewsPosts();
      const allArts = dynamic.length > 0 ? dynamic : articlesData;
      return allArts.find((a) => ('slug' in a && a.slug === urlSlug) || String(a.id) === urlSlug) || null;
    }
    return null;
  });
  const [copiedLink, setCopiedLink] = useState(false);

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [articles, setArticles] = useState<(Article | DynamicNewsItem)[]>(() => {
    const dynamic = getPublicNewsPosts();
    return dynamic.length > 0 ? dynamic : articlesData;
  });

  useEffect(() => {
    fetchPostsFromSupabase().then(() => {
      const dynamic = getPublicNewsPosts();
      if (dynamic.length > 0) {
        setArticles(dynamic);
      }
    });

    const handleFocus = () => {
      fetchPostsFromSupabase().then(() => {
        const dynamic = getPublicNewsPosts();
        if (dynamic.length > 0) {
          setArticles(dynamic);
        }
      });
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const handleSelectArticle = (art: Article | DynamicNewsItem | null) => {
    setSelectedArticle(art);
    if (art) {
      const slugVal = 'slug' in art ? art.slug : String(art.id);
      setSearchParams({ slug: slugVal }, { replace: true });
      document.title = `${art.title} | iCANCAM English Center`;
    } else {
      searchParams.delete('slug');
      setSearchParams(searchParams, { replace: true });
      document.title = 'Tin Tức & Sự Kiện | iCANCAM English Center';
    }
  };

  const filteredArticles = activeCategory === 'all'
    ? articles
    : articles.filter(art => art.category === activeCategory);

  const featuredArticle = filteredArticles[0] || articlesData[0];
  const remainingArticles = filteredArticles.length > 1 ? filteredArticles.slice(1) : filteredArticles;

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setSubscribed(true);
    setNewsletterEmail('');
    setTimeout(() => setSubscribed(false), 5000);
  };

  return (
    <div className={styles.newsWrapper}>
      {/* HERO SECTION */}
      <section className={styles.heroSection}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContainer}>
          <div className={styles.heroBadge}>
            <Sparkles size={16} />
            <span>{t.news.heroBadge}</span>
          </div>

          <h1 className={styles.heroTitle}>
            {t.news.heroTitlePrefix}
            <span className={styles.orangeHighlight}>
              {t.news.heroTitleHighlight}
            </span>
          </h1>

          <p className={styles.heroSubtitle}>
            {t.news.heroSubtitle}
          </p>

          {/* Category Filter Pills */}
          <div className={styles.filterBar}>
            <button
              className={`${styles.filterBtn} ${activeCategory === 'all' ? styles.activeFilter : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              {t.news.filterAll}
            </button>
            <button
              className={`${styles.filterBtn} ${activeCategory === 'events' ? styles.activeFilter : ''}`}
              onClick={() => setActiveCategory('events')}
            >
              {t.news.filterEvents}
            </button>
            <button
              className={`${styles.filterBtn} ${activeCategory === 'scholarship' ? styles.activeFilter : ''}`}
              onClick={() => setActiveCategory('scholarship')}
            >
              {t.news.filterScholarship}
            </button>
            <button
              className={`${styles.filterBtn} ${activeCategory === 'tips' ? styles.activeFilter : ''}`}
              onClick={() => setActiveCategory('tips')}
            >
              {t.news.filterTips}
            </button>
          </div>
        </div>
      </section>

      {/* Transition: Hero (Navy) -> Featured (White) */}
      <SectionTransition variant="navy-to-white" />

      {/* FEATURED STORY BANNER */}
      {featuredArticle && (
        <section className={styles.featuredSection}>
          <div className={styles.container}>
            <div className={styles.featuredCard} onClick={() => handleSelectArticle(featuredArticle)}>
              <div className={styles.featuredImageWrapper}>
                <img
                  src={featuredArticle.image}
                  alt={language === 'en' ? (featuredArticle.titleEn || featuredArticle.title) : featuredArticle.title}
                  className={styles.featuredImage}
                  style={{
                    objectFit: featuredArticle.imageFit || 'cover',
                    objectPosition: featuredArticle.panX !== undefined && featuredArticle.panY !== undefined
                      ? `${featuredArticle.panX}% ${featuredArticle.panY}%`
                      : (featuredArticle.imagePosition || 'center'),
                    transform: featuredArticle.imageZoom ? `scale(${featuredArticle.imageZoom / 100})` : undefined,
                    transformOrigin: featuredArticle.panX !== undefined && featuredArticle.panY !== undefined
                      ? `${featuredArticle.panX}% ${featuredArticle.panY}%`
                      : 'center',
                  }}
                />
                <div className={styles.featuredTag}>
                  {language === 'en' ? (featuredArticle.categoryLabelEn || featuredArticle.categoryLabel) : featuredArticle.categoryLabel}
                </div>
              </div>

              <div className={styles.featuredBody}>
                <div className={styles.metaRow}>
                  <span className={styles.dateLabel}>
                    <Calendar size={15} /> {featuredArticle.date}
                  </span>
                  <span className={styles.badgeHighlight}>{t.news.latestTag}</span>
                </div>

                <h2 className={styles.featuredTitle}>
                  {language === 'en' ? (featuredArticle.titleEn || featuredArticle.title) : featuredArticle.title}
                </h2>
                <p className={styles.featuredExcerpt}>
                  {language === 'en' ? (featuredArticle.excerptEn || featuredArticle.excerpt) : featuredArticle.excerpt}
                </p>

                <div className={styles.readMoreBtn}>
                  {t.news.readMoreBtn} <ArrowRight size={18} />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Transition: Featured (White) -> Articles Grid (Soft Orange) */}
      <SectionTransition variant="white-to-soft-orange" />

      {/* ARTICLES GRID SECTION */}
      <section className={styles.articlesGridSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionCategoryTag}>{t.news.gridTag}</span>
            <h2 className={styles.sectionGridTitle}>{t.news.gridTitle}</h2>
          </div>

          <div className={styles.articlesGrid}>
            {remainingArticles.map(article => (
              <div key={article.id} className={styles.articleCard} onClick={() => handleSelectArticle(article)}>
                <div className={styles.articleImageWrapper}>
                  <img
                    src={article.image}
                    alt={language === 'en' ? (article.titleEn || article.title) : article.title}
                    className={styles.articleImage}
                    style={{
                      objectFit: article.imageFit || 'cover',
                      objectPosition: article.panX !== undefined && article.panY !== undefined
                        ? `${article.panX}% ${article.panY}%`
                        : (article.imagePosition || 'center'),
                      transform: article.imageZoom ? `scale(${article.imageZoom / 100})` : undefined,
                      transformOrigin: article.panX !== undefined && article.panY !== undefined
                        ? `${article.panX}% ${article.panY}%`
                        : 'center',
                    }}
                  />
                  <div className={styles.articleCategoryBadge}>
                    {language === 'en' ? (article.categoryLabelEn || article.categoryLabel) : article.categoryLabel}
                  </div>
                </div>

                <div className={styles.articleBody}>
                  <span className={styles.articleDate}>
                    <Calendar size={14} /> {article.date}
                  </span>

                  <h3 className={styles.articleTitle}>
                    {language === 'en' ? (article.titleEn || article.title) : article.title}
                  </h3>

                  <p className={styles.articleExcerpt}>
                    {language === 'en' ? (article.excerptEn || article.excerpt) : article.excerpt}
                  </p>

                  <div className={styles.articleReadMoreLink}>
                    {t.news.readCardBtn} <ChevronRight size={16} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Transition: Articles Grid (Soft Orange) -> Newsletter (Navy) */}
      <SectionTransition variant="soft-orange-to-navy" />

      {/* NEWSLETTER CTA SECTION */}
      <section className={styles.newsletterSection}>
        <div className={styles.container}>
          <div className={styles.newsletterCard}>
            <h2>{t.news.newsletterTitle}</h2>
            <p>{t.news.newsletterDesc}</p>

            {subscribed && (
              <div className={styles.subscribeSuccessAlert}>
                {t.news.newsletterSuccess}
              </div>
            )}

            <form onSubmit={handleNewsletterSubmit} className={styles.newsletterForm}>
              <input
                type="email"
                required
                placeholder={t.news.newsletterInputPlaceholder}
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className={styles.newsletterInput}
              />
              <button type="submit" className={styles.newsletterSubmitBtn}>
                <Send size={18} /> {t.news.newsletterSubmitBtn}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ARTICLE READER MODAL */}
      {selectedArticle && (() => {
        const currentSlug = 'slug' in selectedArticle ? selectedArticle.slug : String(selectedArticle.id);
        const shareUrl = `${window.location.origin}/news/${currentSlug}`;

        const handleCopyLink = () => {
          navigator.clipboard.writeText(shareUrl);
          setCopiedLink(true);
          showToast('Đã sao chép đường dẫn bài viết! Bạn có thể dán để chia sẻ.', 'success');
          setTimeout(() => setCopiedLink(false), 3000);
        };

        const schemaTitle = language === 'en' ? (selectedArticle.titleEn || selectedArticle.title) : selectedArticle.title;
        const schemaExcerpt = language === 'en' ? (selectedArticle.excerptEn || selectedArticle.excerpt) : selectedArticle.excerpt;
        const schemaOgImage = 'ogImage' in selectedArticle && selectedArticle.ogImage ? selectedArticle.ogImage : selectedArticle.image;

        const newsArticleSchema = {
          '@context': 'https://schema.org',
          '@type': 'NewsArticle',
          'headline': schemaTitle,
          'description': schemaExcerpt,
          'image': [schemaOgImage],
          'datePublished': selectedArticle.date,
          'author': {
            '@type': 'Organization',
            'name': 'iCANCAM English Center',
            'url': window.location.origin
          },
          'publisher': {
            '@type': 'Organization',
            'name': 'iCANCAM English Center'
          },
          'mainEntityOfPage': {
            '@type': 'WebPage',
            '@id': shareUrl
          }
        };

        const breadcrumbSchema = {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          'itemListElement': [
            {
              '@type': 'ListItem',
              'position': 1,
              'name': 'Trang chủ',
              'item': window.location.origin
            },
            {
              '@type': 'ListItem',
              'position': 2,
              'name': 'Tin tức - Sự kiện',
              'item': `${window.location.origin}/news`
            },
            {
              '@type': 'ListItem',
              'position': 3,
              'name': schemaTitle,
              'item': shareUrl
            }
          ]
        };

        return (
          <div className={styles.modalOverlay} onClick={() => handleSelectArticle(null)}>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify([newsArticleSchema, breadcrumbSchema]) }}
            />
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
              <button className={styles.closeModalBtn} onClick={() => handleSelectArticle(null)}>
                <X size={24} />
              </button>

              <div className={styles.modalCategoryBadge}>
                {language === 'en' ? (selectedArticle.categoryLabelEn || selectedArticle.categoryLabel) : selectedArticle.categoryLabel}
              </div>

              <h2 className={styles.modalTitle}>
                {language === 'en' ? (selectedArticle.titleEn || selectedArticle.title) : selectedArticle.title}
              </h2>

              <div className={styles.modalMetaRow}>
                <span><Calendar size={15} /> {selectedArticle.date}</span>

                <div className={styles.shareBar}>
                  <span className={styles.shareLabel}><Share2 size={13} /> Chia sẻ:</span>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noreferrer"
                    className={`${styles.shareBtn} ${styles.shareFbBtn}`}
                  >
                    Facebook
                  </a>
                  <a
                    href={`https://sp.zalo.me/share_inline?url=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noreferrer"
                    className={`${styles.shareBtn} ${styles.shareZaloBtn}`}
                  >
                    Zalo
                  </a>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className={`${styles.shareBtn} ${styles.shareCopyBtn}`}
                  >
                    {copiedLink ? <Check size={14} color="#22c55e" /> : <Copy size={14} />} {copiedLink ? 'Đã sao chép' : 'Sao chép Link'}
                  </button>
                </div>
              </div>

              <div className={styles.modalImageWrapper}>
                <img
                  src={selectedArticle.image}
                  alt={language === 'en' ? (selectedArticle.titleEn || selectedArticle.title) : selectedArticle.title}
                  style={{
                    objectFit: selectedArticle.imageFit || 'cover',
                    objectPosition: selectedArticle.panX !== undefined && selectedArticle.panY !== undefined
                      ? `${selectedArticle.panX}% ${selectedArticle.panY}%`
                      : (selectedArticle.imagePosition || 'center'),
                    transform: selectedArticle.imageZoom ? `scale(${selectedArticle.imageZoom / 100})` : undefined,
                    transformOrigin: selectedArticle.panX !== undefined && selectedArticle.panY !== undefined
                      ? `${selectedArticle.panX}% ${selectedArticle.panY}%`
                      : 'center',
                  }}
                />
              </div>

              <div className={styles.modalBodyText}>
                <p className={styles.leadExcerpt}>
                  {language === 'en' ? (selectedArticle.excerptEn || selectedArticle.excerpt) : selectedArticle.excerpt}
                </p>
                {(() => {
                  const rawContent = language === 'en' ? (selectedArticle.contentEn || selectedArticle.content) : selectedArticle.content;
                  const { cleanHtml, toc } = generateTableOfContents(rawContent);
                  return (
                    <>
                      <TableOfContents toc={toc} />
                      <div
                        className={styles.articleFullContent}
                        dangerouslySetInnerHTML={{ __html: cleanHtml }}
                      />
                    </>
                  );
                })()}
              </div>

              <div className={styles.modalFooter}>
                <Link to="/contact" className={styles.modalActionBtn} onClick={() => handleSelectArticle(null)}>
                  <BookOpen size={18} /> {t.news.modalCourseConsultBtn}
                </Link>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default News;
