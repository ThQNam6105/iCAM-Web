import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Newspaper,
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

export const News: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const filteredArticles = activeCategory === 'all'
    ? articlesData
    : articlesData.filter(art => art.category === activeCategory);

  const featuredArticle = filteredArticles[0] || articlesData[0];
  const remainingArticles = filteredArticles.length > 1 ? filteredArticles.slice(1) : filteredArticles;

  return (
    <div className={styles.newsWrapper}>
      {/* HERO SECTION */}
      <section className={styles.heroSection}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContainer}>
          <div className={styles.heroBadge}>
            <Sparkles size={16} />
            <span>TIN TỨC & SỰ KIỆN ICAM</span>
          </div>

          <h1 className={styles.heroTitle}>
            Cập Nhật Tin Tức & <span className={styles.orangeHighlight}>Sự Kiện Nổi Bật</span>
          </h1>

          <p className={styles.heroSubtitle}>
            Theo dõi các hoạt động giáo dục, đấu trường trí tuệ, thông tin học bổng cùng cẩm nang nuôi dạy con thời đại số từ ANH NGỮ CAM.
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

      {/* FEATURED STORY BANNER */}
      {featuredArticle && (
        <section className={styles.featuredSection}>
          <div className={styles.container}>
            <div className={styles.featuredCard} onClick={() => setSelectedArticle(featuredArticle)}>
              <div className={styles.featuredImageWrapper}>
                <img src={featuredArticle.image} alt={featuredArticle.title} className={styles.featuredImage} />
                <div className={styles.featuredTag}>{featuredArticle.categoryLabel}</div>
              </div>

              <div className={styles.featuredBody}>
                <div className={styles.metaRow}>
                  <span className={styles.dateLabel}>
                    <Calendar size={15} /> {featuredArticle.date}
                  </span>
                  <span className={styles.badgeHighlight}>MỚI NHẤT</span>
                </div>

                <h2 className={styles.featuredTitle}>{featuredArticle.title}</h2>
                <p className={styles.featuredExcerpt}>{featuredArticle.excerpt}</p>

                <div className={styles.readMoreBtn}>
                  Đọc Chi Tiết Bài Viết <ArrowRight size={18} />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ARTICLES GRID SECTION */}
      <section className={styles.gridSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTag}>
              <Newspaper size={16} />
              <span>DANH SÁCH BÀI VIẾT</span>
            </div>
            <h2 className={styles.sectionTitle}>Bài Viết & Tin Tức Khác</h2>
          </div>

          <div className={styles.articlesGrid}>
            {remainingArticles.map((article) => (
              <div key={article.id} className={styles.articleCard} onClick={() => setSelectedArticle(article)}>
                <div className={styles.cardImageWrapper}>
                  <img src={article.image} alt={article.title} className={styles.cardImage} />
                  <span className={styles.categoryBadge}>{article.categoryLabel}</span>
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.cardMeta}>
                    <Calendar size={14} />
                    <span>{article.date}</span>
                  </div>

                  <h3 className={styles.cardTitle}>{article.title}</h3>
                  <p className={styles.cardExcerpt}>{article.excerpt}</p>

                  <div className={styles.cardFooter}>
                    <span className={styles.actionText}>
                      Đọc bài viết <ChevronRight size={16} />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA NEWSLETTER SECTION */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaCard}>
            <h2>Nhận Thông Tin Học Bổng & Sự Kiện Mới Nhất</h2>
            <p>
              Đăng ký email để không bỏ lỡ các kỳ thi đấu trường trí tuệ, cơ hội học bổng và bí quyết học giỏi tiếng Anh từ ANH NGỮ CAM.
            </p>
            <div className={styles.subscribeBox}>
              <input
                type="email"
                placeholder="Nhập địa chỉ email của bạn..."
                className={styles.emailInput}
              />
              <button
                className={styles.subscribeBtn}
                onClick={() => alert('Cảm ơn bạn đã đăng ký nhận thông báo tin tức từ iCAM!')}
              >
                Đăng Ký Ngay <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ARTICLE READER MODAL */}
      {selectedArticle && (
        <div className={styles.modalOverlay} onClick={() => setSelectedArticle(null)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setSelectedArticle(null)}>
              <X size={24} />
            </button>

            <div className={styles.modalHeader}>
              <div className={styles.modalMeta}>
                <span className={styles.categoryBadge}>{selectedArticle.categoryLabel}</span>
                <span className={styles.modalDate}>
                  <Calendar size={14} /> {selectedArticle.date}
                </span>
              </div>
              <h2 className={styles.modalTitle}>{selectedArticle.title}</h2>
            </div>

            <div className={styles.modalImageContainer}>
              <img src={selectedArticle.image} alt={selectedArticle.title} className={styles.modalImage} />
            </div>

            <div className={styles.modalBody}>
              <p className={styles.modalLead}>{selectedArticle.excerpt}</p>
              <div className={styles.modalDivider} />
              <p className={styles.modalContent}>{selectedArticle.content}</p>
            </div>

            <div className={styles.modalFooter}>
              <Link
                to="/contact"
                className={styles.modalActionBtn}
                onClick={() => setSelectedArticle(null)}
              >
                <BookOpen size={18} /> Đăng Ký Tư Vấn Khóa Học iCAM
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default News;
