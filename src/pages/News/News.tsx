import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './News.module.css';
import { articlesData } from '../../data/newsData';

const slidesData = [
  { id: 0, articles: articlesData.slice(0, 3) },
  { id: 1, articles: articlesData.slice(3, 6) },
  { id: 2, articles: articlesData.slice(6, 9) },
];

export const News: React.FC = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  const nextSlide = () => {
    if (activeSlide < slidesData.length - 1) {
      setActiveSlide(activeSlide + 1);
    } else {
      setActiveSlide(0); // Lặp lại từ đầu
    }
  };

  const prevSlide = () => {
    if (activeSlide > 0) {
      setActiveSlide(activeSlide - 1);
    } else {
      setActiveSlide(slidesData.length - 1); // Trở về slide cuối
    }
  };

  return (
    <div className="page-container">
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={`${styles.title} gradient-text`}>TIN TỨC & SỰ KIỆN</h1>
          <p className={styles.subtitle}>
            Cập nhật những hoạt động nổi bật, chương trình học bổng Toán và Khoa học, cùng cẩm nang
            học tập dành cho học sinh.
          </p>
        </div>

        <div className={styles.sliderViewport}>
          {/* Left Arrow */}
          <button
            onClick={prevSlide}
            className={`${styles.arrowBtn} ${styles.prevBtn}`}
            aria-label="Previous Slide"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Slider viewport box */}
          <div className={styles.sliderContainer}>
            <div
              className={styles.sliderTrack}
              style={{ transform: `translate3d(-${activeSlide * 33.3333}%, 0px, 0px)` }}
            >
              {slidesData.map((slide) => (
                <div key={slide.id} className={styles.slideItem}>
                  {slide.articles.map((article) => (
                    <a
                      href={article.url}
                      key={article.id}
                      className={`${styles.card} glass-interactive`}
                    >
                      <img
                        src={article.image}
                        alt={article.title}
                        className={styles.cardImage}
                      />

                      <div className={styles.cardBody}>
                        <h5 className={styles.cardTitle}>{article.title}</h5>
                        <div className={styles.cardText}>{article.excerpt}</div>
                        <div className={`btn-primary ${styles.cardBtn}`}>Chi tiết</div>
                      </div>
                    </a>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Right Arrow */}
          <button
            onClick={nextSlide}
            className={`${styles.arrowBtn} ${styles.nextBtn}`}
            aria-label="Next Slide"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Dots Indicator */}
        <div className={styles.dotsContainer}>
          {slidesData.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={() => setActiveSlide(idx)}
              className={`${styles.dot} ${activeSlide === idx ? styles.activeDot : ''}`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default News;
