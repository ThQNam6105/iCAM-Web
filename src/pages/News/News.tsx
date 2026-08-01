import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Calendar,
  ArrowRight,
  ChevronRight,
  X,
  Send,
  BookOpen
} from 'lucide-react';
import styles from './News.module.css';
import { articlesData, type Article } from '../../data/newsData';
import { useLanguage } from '../../contexts/LanguageContext';
import { SectionTransition } from '../../components/SectionTransition/SectionTransition';

export const News: React.FC = () => {
  const { language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const filteredArticles = activeCategory === 'all'
    ? articlesData
    : articlesData.filter(art => art.category === activeCategory);

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
            <span>TIN TỨC & SỰ KIỆN ICANCAM</span>
          </div>

          <h1 className={styles.heroTitle}>
            Cập Nhật Tin Tức & <span className={styles.orangeHighlight}>Sự Kiện Nổi Bật</span>
          </h1>

          <p className={styles.heroSubtitle}>
            Theo dõi các hoạt động giáo dục, đấu trường trí tuệ, thông tin học bổng cùng cẩm nang nuôi dạy con thời đại số từ ICANCAM.
          </p>

          {/* Category Filter Pills */}
          <div className={styles.filterBar}>
            <button
              className={`${styles.filterBtn} ${activeCategory === 'all' ? styles.activeFilter : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              Tất Cả Tin Tức
            </button>
            <button
              className={`${styles.filterBtn} ${activeCategory === 'events' ? styles.activeFilter : ''}`}
              onClick={() => setActiveCategory('events')}
            >
              Sự Kiện & Đấu Trường
            </button>
            <button
              className={`${styles.filterBtn} ${activeCategory === 'scholarship' ? styles.activeFilter : ''}`}
              onClick={() => setActiveCategory('scholarship')}
            >
              Chương Trình Học Bổng
            </button>
            <button
              className={`${styles.filterBtn} ${activeCategory === 'tips' ? styles.activeFilter : ''}`}
              onClick={() => setActiveCategory('tips')}
            >
              Cẩm Nang Phụ Huynh
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
            <div className={styles.featuredCard} onClick={() => setSelectedArticle(featuredArticle)}>
              <div className={styles.featuredImageWrapper}>
                <img
                  src={featuredArticle.image}
                  alt={language === 'en' ? (featuredArticle.titleEn || featuredArticle.title) : featuredArticle.title}
                  className={styles.featuredImage}
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
                  <span className={styles.badgeHighlight}>MỚI NHẤT</span>
                </div>

                <h2 className={styles.featuredTitle}>
                  {language === 'en' ? (featuredArticle.titleEn || featuredArticle.title) : featuredArticle.title}
                </h2>
                <p className={styles.featuredExcerpt}>
                  {language === 'en' ? (featuredArticle.excerptEn || featuredArticle.excerpt) : featuredArticle.excerpt}
                </p>

                <div className={styles.readMoreBtn}>
                  Đọc Chi Tiết Bài Viết <ArrowRight size={18} />
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
            <span className={styles.sectionCategoryTag}>DANH SÁCH BÀI VIẾT</span>
            <h2 className={styles.sectionGridTitle}>Tin Tức Giáo Dục & Hoạt Động Mới Nhất</h2>
          </div>

          <div className={styles.articlesGrid}>
            {remainingArticles.map(article => (
              <div key={article.id} className={styles.articleCard} onClick={() => setSelectedArticle(article)}>
                <div className={styles.articleImageWrapper}>
                  <img
                    src={article.image}
                    alt={language === 'en' ? (article.titleEn || article.title) : article.title}
                    className={styles.articleImage}
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
                    Đọc bài viết <ChevronRight size={16} />
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
            <h2>Nhận Bản Tin Giáo Dục & Thông Tin Học Bổng</h2>
            <p>Đăng ký email để không bỏ lỡ các kỳ thi đấu trường trí tuệ, cơ hội học bổng và bí quyết học giỏi tiếng Anh từ ICANCAM.</p>

            {subscribed && (
              <div className={styles.subscribeSuccessAlert}>
                Đăng ký thành công! Cảm ơn bạn đã đăng ký nhận bản tin ICANCAM.
              </div>
            )}

            <form onSubmit={handleNewsletterSubmit} className={styles.newsletterForm}>
              <input
                type="email"
                required
                placeholder="Nhập email của bạn..."
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className={styles.newsletterInput}
              />
              <button type="submit" className={styles.newsletterSubmitBtn}>
                <Send size={18} /> Đăng Ký
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ARTICLE READER MODAL */}
      {selectedArticle && (
        <div className={styles.modalOverlay} onClick={() => setSelectedArticle(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.closeModalBtn} onClick={() => setSelectedArticle(null)}>
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
            </div>

            <div className={styles.modalImageWrapper}>
              <img
                src={selectedArticle.image}
                alt={language === 'en' ? (selectedArticle.titleEn || selectedArticle.title) : selectedArticle.title}
              />
            </div>

            <div className={styles.modalBodyText}>
              <p className={styles.leadExcerpt}>
                {language === 'en' ? (selectedArticle.excerptEn || selectedArticle.excerpt) : selectedArticle.excerpt}
              </p>
              <p>
                {language === 'en' ? (selectedArticle.contentEn || selectedArticle.content) : selectedArticle.content}
              </p>
            </div>

            <div className={styles.modalFooter}>
              <Link to="/contact" className={styles.modalActionBtn} onClick={() => setSelectedArticle(null)}>
                <BookOpen size={18} /> Đăng Ký Tư Vấn Khóa Học
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default News;
