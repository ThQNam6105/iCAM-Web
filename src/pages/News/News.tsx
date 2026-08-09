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
  Inbox,
  Share2,
  Copy,
  Check,
} from 'lucide-react';
import styles from './News.module.css';
import { articlesData, type Article } from '../../data/newsData';
import { useLanguage } from '../../contexts/LanguageContext';
import { SectionTransition } from '../../components/SectionTransition/SectionTransition';
import { getPublicNewsPosts, fetchPostsFromSupabase, generateSlug, type DynamicNewsItem } from '../../services/newsService';
import { getCategories, fetchCategoriesFromSupabase, getCategoryColor, getCategoryDisplayLabel } from '../../services/categoryService';
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
    fetchCategoriesFromSupabase();

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

  const isCategoryMatch = (articleCat?: string, activeCatIdOrSlug?: string) => {
    if (!articleCat || !activeCatIdOrSlug) return false;
    if (activeCatIdOrSlug === 'all') return true;

    const artNorm = articleCat.toLowerCase().trim();
    const activeNorm = activeCatIdOrSlug.toLowerCase().trim();

    if (artNorm === activeNorm) return true;
    if (generateSlug(artNorm) === generateSlug(activeNorm)) return true;

    const allCats = getCategories();
    const activeCatObj = allCats.find(
      (c) => c.id.toLowerCase() === activeNorm || c.slug.toLowerCase() === activeNorm
    );

    if (activeCatObj) {
      const catId = activeCatObj.id.toLowerCase();
      const catSlug = activeCatObj.slug.toLowerCase();
      const catViSlug = generateSlug(activeCatObj.nameVi);
      const catEnSlug = generateSlug(activeCatObj.nameEn);

      return (
        artNorm === catId ||
        artNorm === catSlug ||
        generateSlug(artNorm) === catViSlug ||
        generateSlug(artNorm) === catEnSlug
      );
    }

    return false;
  };

  const filteredArticles = activeCategory === 'all'
    ? articles
    : articles.filter(art => isCategoryMatch(art.category, activeCategory));

  const featuredArticle = filteredArticles.length > 0 ? filteredArticles[0] : null;
  const remainingArticles = filteredArticles.length > 1 ? filteredArticles.slice(1) : [];

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
            {getCategories().map((cat) => (
              <button
                key={cat.id}
                className={`${styles.filterBtn} ${activeCategory === (cat.id || cat.slug) ? styles.activeFilter : ''}`}
                onClick={() => setActiveCategory(cat.id || cat.slug)}
              >
                {language === 'en' ? cat.nameEn : cat.nameVi}
              </button>
            ))}
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
                <div
                  className={styles.featuredTag}
                  style={{ backgroundColor: getCategoryColor(featuredArticle.category, featuredArticle.categoryLabel) }}
                >
                  {getCategoryDisplayLabel(featuredArticle.category, featuredArticle.categoryLabel, featuredArticle.categoryLabelEn, language)}
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
            <span className={styles.sectionCategoryTag}>
              {activeCategory === 'all'
                ? t.news.gridTag
                : `${language === 'en' ? 'CATEGORY' : 'DANH MỤC'}: ${
                    getCategories().find((c) => c.id === activeCategory || c.slug === activeCategory)?.nameVi || activeCategory
                  }`}
            </span>
            <h2 className={styles.sectionGridTitle}>
              {activeCategory === 'all'
                ? t.news.gridTitle
                : (language === 'en'
                    ? `Articles in ${getCategories().find((c) => c.id === activeCategory || c.slug === activeCategory)?.nameEn || activeCategory}`
                    : `Tin Tức & Bài Viết - ${getCategories().find((c) => c.id === activeCategory || c.slug === activeCategory)?.nameVi || activeCategory}`)}
            </h2>
          </div>

          {filteredArticles.length === 0 ? (
            <div className={styles.emptyCategoryCard}>
              <Inbox size={48} className={styles.emptyIcon} />
              <h3>{language === 'en' ? 'No articles in this category yet' : 'Chưa có bài viết nào thuộc danh mục này'}</h3>
              <p>
                {language === 'en'
                  ? 'New articles will be published soon. Please check back later or explore all news.'
                  : 'Các bài viết mới sẽ được cập nhật sớm. Bạn có thể xem tất cả bài viết khác của iCANCAM.'}
              </p>
              <button
                type="button"
                className={styles.resetCategoryBtn}
                onClick={() => setActiveCategory('all')}
              >
                {language === 'en' ? 'View All News' : 'Xem Tất Cả Bài Viết'}
              </button>
            </div>
          ) : (
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
                    <div
                      className={styles.articleCategoryBadge}
                      style={{ backgroundColor: getCategoryColor(article.category, article.categoryLabel) }}
                    >
                      {getCategoryDisplayLabel(article.category, article.categoryLabel, article.categoryLabelEn, language)}
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
          )}
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

              <div
                className={styles.modalCategoryBadge}
                style={{ backgroundColor: getCategoryColor(selectedArticle.category, selectedArticle.categoryLabel) }}
              >
                {getCategoryDisplayLabel(selectedArticle.category, selectedArticle.categoryLabel, selectedArticle.categoryLabelEn, language)}
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
