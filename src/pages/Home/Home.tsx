import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from './Home.module.css';
import { articlesData } from '../../data/newsData';
import { teachersData } from '../../data/teacherData';
import { studentsData } from '../../data/studentData';
import { parentsData } from '../../data/parentData';
import bannerBg from '../../assets/banner-bg.jpg';
import bannerBgMobile from '../../assets/banner-bg-mobile.jpg';
import studentHologram from '../../assets/student_hologram.png';
import achievementTeacher from '../../assets/achievement_teacher.png';
import achievementSmartboard from '../../assets/achievement_smartboard.png';
import achievementSchool from '../../assets/achievement_school.png';

const renderHighlightIcon = (type: 'ielts' | 'degree' | 'medal') => {
  switch (type) {
    case 'ielts':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      );
    case 'degree':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
        </svg>
      );
    case 'medal':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="7" />
          <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
        </svg>
      );
  }
};

export const Home: React.FC = () => {
  // State for News Overview
  const [currentIndex, setCurrentIndex] = useState(0);
  const [disableTransition, setDisableTransition] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [cardsToShow, setCardsToShow] = useState(3);

  // State for Teachers Slider
  const [teacherIndex, setTeacherIndex] = useState(0);
  const [disableTeacherTransition, setDisableTeacherTransition] = useState(false);
  const [isTeacherPaused, setIsTeacherPaused] = useState(false);
  const [teachersToShow, setTeachersToShow] = useState(4);

  // State for Students Slider
  const [studentIndex, setStudentIndex] = useState(0);
  const [disableStudentTransition, setDisableStudentTransition] = useState(false);
  const [isStudentPaused, setIsStudentPaused] = useState(false);
  const [studentsToShow, setStudentsToShow] = useState(3);

  // State for Parents Slider
  const [parentIndex, setParentIndex] = useState(0);
  const [disableParentTransition, setDisableParentTransition] = useState(false);
  const [isParentPaused, setIsParentPaused] = useState(false);
  const [parentsToShow, setParentsToShow] = useState(3);

  // General States
  const [isTabActive, setIsTabActive] = useState(true);
  const [currentBanner, setCurrentBanner] = useState(bannerBg);
  const [activeAchievementIdx, setActiveAchievementIdx] = useState(0);

  // Form State for registration section
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    childAge: '',
    city: '',
  });

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Đăng ký tư vấn thành công! Đội ngũ iCAM sẽ liên hệ Quý phụ huynh trong thời gian sớm nhất.');
    setFormData({
      fullName: '',
      phone: '',
      email: '',
      childAge: '',
      city: '',
    });
  };

  // Cập nhật số thẻ hiển thị và ảnh banner dựa theo chiều rộng màn hình (để đồng bộ với CSS)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setCardsToShow(1);
        setTeachersToShow(1);
        setStudentsToShow(1);
        setParentsToShow(1);
        setCurrentBanner(bannerBgMobile);
      } else if (window.innerWidth <= 1024) {
        setCardsToShow(2);
        setTeachersToShow(2);
        setStudentsToShow(2);
        setParentsToShow(2);
        setCurrentBanner(bannerBg);
      } else {
        setCardsToShow(3);
        setTeachersToShow(4);
        setStudentsToShow(3);
        setParentsToShow(3);
        setCurrentBanner(bannerBg);
      }
    };

    handleResize(); // Chạy lần đầu
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Theo dõi trạng thái hoạt động của Tab trình duyệt (tránh lỗi khi chuyển Tab)
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabActive(!document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Achievement image auto rotation timer
  useEffect(() => {
    if (!isTabActive) return;
    const timer = setInterval(() => {
      setActiveAchievementIdx((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(timer);
  }, [isTabActive]);

  // ==========================================================================
  // Slider News - Nhân bản các phần tử đầu/cuối để làm vòng lặp vô hạn
  // ==========================================================================
  const clonedBefore = articlesData.slice(-cardsToShow);
  const clonedAfter = articlesData.slice(0, cardsToShow);
  const extendedArticles = [...clonedBefore, ...articlesData, ...clonedAfter];

  const nextSlide = () => {
    if (disableTransition) return;
    setCurrentIndex((prev) => prev + 1);
  };

  const prevSlide = () => {
    if (disableTransition) return;
    setCurrentIndex((prev) => prev - 1);
  };

  useEffect(() => {
    if (isPaused || disableTransition || !isTabActive) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 3000);
    return () => clearInterval(timer);
  }, [isPaused, disableTransition, isTabActive]);

  const handleTransitionEnd = () => {
    if (currentIndex === -1) {
      setDisableTransition(true);
      setCurrentIndex(articlesData.length - 1);
    } else if (currentIndex === articlesData.length) {
      setDisableTransition(true);
      setCurrentIndex(0);
    }
  };

  useEffect(() => {
    if (currentIndex >= articlesData.length + 1) {
      const timer = setTimeout(() => {
        setDisableTransition(true);
        setCurrentIndex(0);
      }, 0);
      return () => clearTimeout(timer);
    } else if (currentIndex <= -2) {
      const timer = setTimeout(() => {
        setDisableTransition(true);
        setCurrentIndex(articlesData.length - 1);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [currentIndex]);

  useEffect(() => {
    if (disableTransition) {
      const timer = setTimeout(() => {
        setDisableTransition(false);
      }, 30);
      return () => clearTimeout(timer);
    }
  }, [disableTransition]);

  // ==========================================================================
  // Slider Teachers - Nhân bản các phần tử đầu/cuối để làm vòng lặp vô hạn
  // ==========================================================================
  const clonedTeachersBefore = teachersData.slice(-teachersToShow);
  const clonedTeachersAfter = teachersData.slice(0, teachersToShow);
  const extendedTeachers = [...clonedTeachersBefore, ...teachersData, ...clonedTeachersAfter];

  const nextTeacherSlide = () => {
    if (disableTeacherTransition) return;
    setTeacherIndex((prev) => prev + 1);
  };

  const prevTeacherSlide = () => {
    if (disableTeacherTransition) return;
    setTeacherIndex((prev) => prev - 1);
  };

  useEffect(() => {
    if (isTeacherPaused || disableTeacherTransition || !isTabActive) return;
    const timer = setInterval(() => {
      setTeacherIndex((prev) => prev + 1);
    }, 3000);
    return () => clearInterval(timer);
  }, [isTeacherPaused, disableTeacherTransition, isTabActive]);

  const handleTeacherTransitionEnd = () => {
    if (teacherIndex === -1) {
      setDisableTeacherTransition(true);
      setTeacherIndex(teachersData.length - 1);
    } else if (teacherIndex === teachersData.length) {
      setDisableTeacherTransition(true);
      setTeacherIndex(0);
    }
  };

  useEffect(() => {
    if (teacherIndex >= teachersData.length + 1) {
      const timer = setTimeout(() => {
        setDisableTeacherTransition(true);
        setTeacherIndex(0);
      }, 0);
      return () => clearTimeout(timer);
    } else if (teacherIndex <= -2) {
      const timer = setTimeout(() => {
        setDisableTeacherTransition(true);
        setTeacherIndex(teachersData.length - 1);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [teacherIndex]);

  useEffect(() => {
    if (disableTeacherTransition) {
      const timer = setTimeout(() => {
        setDisableTeacherTransition(false);
      }, 30);
      return () => clearTimeout(timer);
    }
  }, [disableTeacherTransition]);

  // ==========================================================================
  // Slider Students - Nhân bản các phần tử đầu/cuối để làm vòng lặp vô hạn
  // ==========================================================================
  const clonedStudentsBefore = studentsData.slice(-studentsToShow);
  const clonedStudentsAfter = studentsData.slice(0, studentsToShow);
  const extendedStudents = [...clonedStudentsBefore, ...studentsData, ...clonedStudentsAfter];

  const nextStudentSlide = () => {
    if (disableStudentTransition) return;
    setStudentIndex((prev) => prev + 1);
  };

  const prevStudentSlide = () => {
    if (disableStudentTransition) return;
    setStudentIndex((prev) => prev - 1);
  };

  useEffect(() => {
    if (isStudentPaused || disableStudentTransition || !isTabActive) return;
    const timer = setInterval(() => {
      setStudentIndex((prev) => prev + 1);
    }, 3000);
    return () => clearInterval(timer);
  }, [isStudentPaused, disableStudentTransition, isTabActive]);

  const handleStudentTransitionEnd = () => {
    if (studentIndex === -1) {
      setDisableStudentTransition(true);
      setStudentIndex(studentsData.length - 1);
    } else if (studentIndex === studentsData.length) {
      setDisableStudentTransition(true);
      setStudentIndex(0);
    }
  };

  useEffect(() => {
    if (studentIndex >= studentsData.length + 1) {
      const timer = setTimeout(() => {
        setDisableStudentTransition(true);
        setStudentIndex(0);
      }, 0);
      return () => clearTimeout(timer);
    } else if (studentIndex <= -2) {
      const timer = setTimeout(() => {
        setDisableStudentTransition(true);
        setStudentIndex(studentsData.length - 1);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [studentIndex]);

  useEffect(() => {
    if (disableStudentTransition) {
      const timer = setTimeout(() => {
        setDisableStudentTransition(false);
      }, 30);
      return () => clearTimeout(timer);
    }
  }, [disableStudentTransition]);

  // ==========================================================================
  // Slider Parents - Nhân bản các phần tử đầu/cuối để làm vòng lặp vô hạn
  // ==========================================================================
  const clonedParentsBefore = parentsData.slice(-parentsToShow);
  const clonedParentsAfter = parentsData.slice(0, parentsToShow);
  const extendedParents = [...clonedParentsBefore, ...parentsData, ...clonedParentsAfter];

  const nextParentSlide = () => {
    if (disableParentTransition) return;
    setParentIndex((prev) => prev + 1);
  };

  const prevParentSlide = () => {
    if (disableParentTransition) return;
    setParentIndex((prev) => prev - 1);
  };

  useEffect(() => {
    if (isParentPaused || disableParentTransition || !isTabActive) return;
    const timer = setInterval(() => {
      setParentIndex((prev) => prev + 1);
    }, 3000);
    return () => clearInterval(timer);
  }, [isParentPaused, disableParentTransition, isTabActive]);

  const handleParentTransitionEnd = () => {
    if (parentIndex === -1) {
      setDisableParentTransition(true);
      setParentIndex(parentsData.length - 1);
    } else if (parentIndex === parentsData.length) {
      setDisableParentTransition(true);
      setParentIndex(0);
    }
  };

  useEffect(() => {
    if (parentIndex >= parentsData.length + 1) {
      const timer = setTimeout(() => {
        setDisableParentTransition(true);
        setParentIndex(0);
      }, 0);
      return () => clearTimeout(timer);
    } else if (parentIndex <= -2) {
      const timer = setTimeout(() => {
        setDisableParentTransition(true);
        setParentIndex(parentsData.length - 1);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [parentIndex]);

  useEffect(() => {
    if (disableParentTransition) {
      const timer = setTimeout(() => {
        setDisableParentTransition(false);
      }, 30);
      return () => clearTimeout(timer);
    }
  }, [disableParentTransition]);

  return (
    <div style={{ width: '100%' }}>
      {/* Banner Section */}
      <section className={styles.banner} style={{ backgroundImage: `url(${currentBanner})` }}>
        {/* Background image overlay (subtle bottom shadow to make button stand out) */}
        <div className={styles.overlay} />

        {/* Register button at bottom center */}
        <div className={styles.buttonContainer}>
          <Link to="/contact" className={`btn-primary ${styles.registerBtn}`}>
            ĐĂNG KÝ NGAY
          </Link>
        </div>
      </section>

      {/* News Overview Section */}
      <section className={styles.newsSection}>
        <div className={styles.newsContainer}>
          {/* Top Label */}
          <div className={styles.newsTopLabelContainer}>
            <div className={styles.newsTopLabel}>
              <span>TỔNG QUAN TIN TỨC & SỰ KIỆN</span>
            </div>
          </div>

          {/* Slider Row Wrapper */}
          <div
            className={styles.newsSliderWrapper}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Navigation Left Button */}
            <button onClick={prevSlide} className={styles.navBtn} aria-label="Previous News">
              <ChevronLeft size={36} />
            </button>

            {/* Slider viewport */}
            <div className={styles.sliderContainer}>
              <div
                className={styles.sliderTrack}
                onTransitionEnd={handleTransitionEnd}
                style={{
                  transform: `translate3d(-${(currentIndex + cardsToShow) * (100 / cardsToShow)}%, 0px, 0px)`,
                  transition: disableTransition ? 'none' : 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)',
                }}
              >
                {extendedArticles.map((article, index) => (
                  <div
                    key={`${article.id}-${index}`}
                    className={styles.cardWrapper}
                    style={{ width: `${100 / cardsToShow}%` }}
                  >
                    <Link to="/news" className={styles.newsCard}>
                      <div className={styles.imageWrapper}>
                        <img src={article.image} alt={article.title} className={styles.newsImg} />
                      </div>
                      <h4 className={styles.newsTitle}>{article.title}</h4>
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Right Button */}
            <button onClick={nextSlide} className={styles.navBtn} aria-label="Next News">
              <ChevronRight size={36} />
            </button>
          </div>
        </div>
      </section>

      {/* Number Talk / Stats Section */}
      <section className={styles.numberTalkSection}>
        <div className={styles.numberTalkInner}>
          {/* Top Label */}
          <div className={styles.numberTalkTopLabelContainer}>
            <div className={styles.numberTalkTopLabel}>
              <span>THÀNH TỰU NỔI BẬT CỦA ICAM</span>
            </div>
          </div>

          {/* Main Content Layout */}
          <div className={styles.numberTalkMainContent}>
            {/* Left: Morphing Theme Images */}
            <div className={styles.numberTalkImageWrapper}>
              <img
                src={achievementTeacher}
                alt="iCAM English Training Excellence"
                className={`${styles.numberTalkImg} ${activeAchievementIdx === 0 ? styles.activeImg : ''}`}
              />
              <img
                src={studentHologram}
                alt="iCAM Interactive Learning Method"
                className={`${styles.numberTalkImg} ${activeAchievementIdx === 1 ? styles.activeImg : ''}`}
              />
              <img
                src={achievementSmartboard}
                alt="iCAM Smart Classroom Whiteboard"
                className={`${styles.numberTalkImg} ${activeAchievementIdx === 2 ? styles.activeImg : ''}`}
              />
              <img
                src={achievementSchool}
                alt="iCAM Partner School Alliance"
                className={`${styles.numberTalkImg} ${activeAchievementIdx === 3 ? styles.activeImg : ''}`}
              />
            </div>

            {/* Right: Grid */}
            <div className={styles.numberTalkContent}>
              <div className={styles.numberTalkGrid}>
                {/* Item 1 */}
                <div className={styles.numberTalkItem}>
                  <h3 className={styles.numberTalkItemTitle}>
                    10 <span className={styles.numberTalkItemSup}>năm</span>
                  </h3>
                  <div className={styles.numberTalkItemText}>
                    kinh nghiệm đào tạo tiếng Anh
                  </div>
                </div>

                {/* Item 2 */}
                <div className={styles.numberTalkItem}>
                  <h3 className={styles.numberTalkItemTitle} style={{ fontSize: '2rem' }}>
                    4Ls & L.E.T.I
                  </h3>
                  <div className={styles.numberTalkItemText}>
                    ứng dụng phương pháp học tiếng Anh ứng dụng và tương tác
                  </div>
                </div>

                {/* Item 3 */}
                <div className={styles.numberTalkItem}>
                  <h3 className={styles.numberTalkItemTitle}>
                    100 <span className={styles.numberTalkItemSup}>%</span>
                  </h3>
                  <div className={styles.numberTalkItemText}>
                    lớp học thông minh với bảng tương tác hiện đại
                  </div>
                </div>

                {/* Item 4 */}
                <div className={styles.numberTalkItem}>
                  <h3 className={styles.numberTalkItemTitle}>
                    Hơn 20 <span className={styles.numberTalkItemSup}>trường</span>
                  </h3>
                  <div className={styles.numberTalkItemText}>
                    đang liên kết giảng dạy trên địa bàn quận 12 và tỉnh Bình Dương
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Teachers Section */}
      <section className={styles.teachersSection}>
        <div className={styles.teachersInner}>
          {/* Top Label */}
          <div className={styles.teachersTopLabelContainer}>
            <div className={styles.teachersTopLabel}>
              <span>GIÁO VIÊN ICAM TIÊU BIỂU</span>
            </div>
          </div>

          {/* Teachers Slider Wrapper */}
          <div
            className={styles.teachersSliderWrapper}
            onMouseEnter={() => setIsTeacherPaused(true)}
            onMouseLeave={() => setIsTeacherPaused(false)}
          >
            {/* Navigation Left Button */}
            <button onClick={prevTeacherSlide} className={styles.navBtn} aria-label="Previous Teacher">
              <ChevronLeft size={36} />
            </button>

            {/* Viewport */}
            <div className={styles.teachersSliderContainer}>
              <div
                className={styles.teachersSliderTrack}
                onTransitionEnd={handleTeacherTransitionEnd}
                style={{
                  transform: `translate3d(-${(teacherIndex + teachersToShow) * (100 / teachersToShow)}%, 0px, 0px)`,
                  transition: disableTeacherTransition ? 'none' : 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)',
                }}
              >
                {extendedTeachers.map((teacher, index) => (
                  <div
                    key={`${teacher.id}-${index}`}
                    className={styles.teacherCardWrapper}
                    style={{ width: `${100 / teachersToShow}%` }}
                  >
                    <div className={styles.teacherCard}>
                      {/* Photo and hover overlay */}
                      <div className={styles.teacherImageContainer}>
                        <img src={teacher.image} alt={teacher.name} className={styles.teacherImg} />
                        
                        {/* Default Badge */}
                        <div className={styles.defaultBadge}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                          <span>{teacher.mainHighlight}</span>
                        </div>

                        {/* Hover Overlay */}
                        <div className={styles.hoverOverlay}>
                          <div className={styles.highlightsList}>
                            {teacher.highlights.map((hl, hlIdx) => (
                              <div key={hlIdx} className={styles.highlightItem}>
                                <div className={styles.highlightIcon}>
                                  {renderHighlightIcon(hl.iconType)}
                                </div>
                                <div className={styles.highlightTextWrapper}>
                                  <p className={styles.highlightTitle}>{hl.title}</p>
                                  <p className={styles.highlightSubText}>{hl.subText}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Info */}
                      <div className={styles.teacherInfo}>
                        <div className={styles.teacherNameWrapper}>
                          <span className={styles.teacherName}>{teacher.name}</span>
                          <span className={styles.verifiedIcon}>
                            <svg width="18" height="18" viewBox="0 0 31 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M3.5 13.6826C3.5 7.0552 8.87258 1.68262 15.5 1.68262C22.1274 1.68262 27.5 7.0552 27.5 13.6826C27.5 20.31 22.1274 25.6826 15.5 25.6826C8.87258 25.6826 3.5 20.31 3.5 13.6826Z" fill="url(#paint0_linear_teachers)"></path>
                              <path fillRule="evenodd" clipRule="evenodd" d="M18.1841 12.4323C18.5638 12.2346 18.7113 11.7664 18.5135 11.3867C18.3158 11.007 17.8476 10.8595 17.4679 11.0573C16.361 11.6338 15.4578 12.7375 14.8611 13.6078C14.6929 13.853 14.5434 14.0882 14.4149 14.3007C14.3271 14.2264 14.2425 14.1597 14.1644 14.1009C13.9975 13.9752 13.8474 13.8761 13.7378 13.8077L13.5461 13.6944L13.5448 13.6937C13.1686 13.4894 12.698 13.6287 12.4936 14.0049C12.2893 14.381 12.4288 14.8517 12.8048 15.0561C12.9163 15.1266 13.1577 15.2819 13.2318 15.3394C13.4904 15.5341 13.7539 15.7786 13.9137 16.0331C14.0639 16.2722 14.3322 16.4107 14.6141 16.3947C14.8959 16.3787 15.1468 16.2106 15.269 15.9562C15.3087 15.8763 15.4093 15.6789 15.4948 15.528C15.646 15.256 15.8659 14.8839 16.1397 14.4845C16.7058 13.6591 17.4306 12.8248 18.1841 12.4323Z" fill="#FFE100"></path>
                              <defs>
                                <linearGradient id="paint0_linear_teachers" x1="3.5" y1="6.04625" x2="27.5" y2="21.319" gradientUnits="userSpaceOnUse">
                                  <stop stop-color="#FF7B7D"></stop>
                                  <stop offset="1" stop-color="#F7390E"></stop>
                                </linearGradient>
                              </defs>
                            </svg>
                          </span>
                        </div>
                        <p className={styles.teacherRole}>{teacher.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Right Button */}
            <button onClick={nextTeacherSlide} className={styles.navBtn} aria-label="Next Teacher">
              <ChevronRight size={36} />
            </button>
          </div>

        </div>
      </section>

      {/* Students Section */}
      <section className={styles.studentsSection}>
        <div className={styles.studentsInner}>
          {/* Top Label */}
          <div className={styles.studentsTopLabelContainer}>
            <div className={styles.studentsTopLabel}>
              <span>HỌC VIÊN XUẤT SẮC ĐANG THEO HỌC TẠI ICAM</span>
            </div>
          </div>

          {/* Students Slider Wrapper */}
          <div
            className={styles.studentsSliderWrapper}
            onMouseEnter={() => setIsStudentPaused(true)}
            onMouseLeave={() => setIsStudentPaused(false)}
          >
            {/* Navigation Left Button */}
            <button onClick={prevStudentSlide} className={styles.navBtn} aria-label="Previous Student">
              <ChevronLeft size={36} />
            </button>

            {/* Viewport */}
            <div className={styles.studentsSliderContainer}>
              <div
                className={styles.studentsSliderTrack}
                onTransitionEnd={handleStudentTransitionEnd}
                style={{
                  transform: `translate3d(-${(studentIndex + studentsToShow) * (100 / studentsToShow)}%, 0px, 0px)`,
                  transition: disableStudentTransition ? 'none' : 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)',
                }}
              >
                {extendedStudents.map((student, index) => (
                  <div
                    key={`${student.id}-${index}`}
                    className={styles.studentCardWrapper}
                    style={{ width: `${100 / studentsToShow}%` }}
                  >
                    <div className={styles.studentCard}>
                      {/* Photo and hover overlay */}
                      <div className={styles.studentImageContainer}>
                        <img src={student.image} alt={student.name} className={styles.studentImg} />
                        
                        {/* Default Badge */}
                        <div className={styles.defaultBadge}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                          <span>{student.mainHighlight}</span>
                        </div>

                        {/* Hover Overlay */}
                        <div className={styles.hoverOverlay}>
                          <div className={styles.highlightsList}>
                            {student.highlights.map((hl, hlIdx) => (
                              <div key={hlIdx} className={styles.highlightItem}>
                                <div className={styles.highlightIcon}>
                                  {renderHighlightIcon(hl.iconType)}
                                </div>
                                <div className={styles.highlightTextWrapper}>
                                  <h5 className={styles.highlightTitle}>{hl.title}</h5>
                                  <p className={styles.highlightSubText}>{hl.subText}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Info */}
                      <div className={styles.studentInfo}>
                        <div className={styles.studentNameWrapper}>
                          <span className={styles.studentName}>{student.name}</span>
                          <span className={styles.verifiedIcon} title="Đã xác minh bởi iCAM">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 16.5L6 12.5L7.41 11.09L10 13.67L16.59 7.09L18 8.5L10 16.5Z" fill="url(#paint0_linear_students)" />
                              <defs>
                                <linearGradient id="paint0_linear_students" x1="3.5" y1="6.04625" x2="27.5" y2="21.319" gradientUnits="userSpaceOnUse">
                                  <stop stop-color="#FF7B7D"></stop>
                                  <stop offset="1" stop-color="#F7390E"></stop>
                                </linearGradient>
                              </defs>
                            </svg>
                          </span>
                        </div>
                        <p className={styles.studentRole}>{student.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Right Button */}
            <button onClick={nextStudentSlide} className={styles.navBtn} aria-label="Next Student">
              <ChevronRight size={36} />
            </button>
          </div>


        </div>
      </section>

      {/* Parents Testimonials Section */}
      <section className={styles.parentsSection}>
        <div className={styles.parentsInner}>
          {/* Top Label */}
          <div className={styles.parentsTopLabelContainer}>
            <div className={styles.parentsTopLabel}>
              <span>Nhận xét từ phụ huynh</span>
            </div>
          </div>

          {/* Parents Slider Wrapper */}
          <div
            className={styles.parentsSliderWrapper}
            onMouseEnter={() => setIsParentPaused(true)}
            onMouseLeave={() => setIsParentPaused(false)}
          >
            {/* Navigation Left Button */}
            <button onClick={prevParentSlide} className={styles.navBtn} aria-label="Previous Parent">
              <ChevronLeft size={36} />
            </button>

            {/* Viewport */}
            <div className={styles.parentsSliderContainer}>
              <div
                className={styles.parentsSliderTrack}
                onTransitionEnd={handleParentTransitionEnd}
                style={{
                  transform: `translate3d(-${(parentIndex + parentsToShow) * (100 / parentsToShow)}%, 0px, 0px)`,
                  transition: disableParentTransition ? 'none' : 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)',
                }}
              >
                {extendedParents.map((parent, index) => (
                  <div
                    key={`${parent.id}-${index}`}
                    className={styles.parentCardWrapper}
                    style={{ width: `${100 / parentsToShow}%` }}
                  >
                    <div className={styles.parentCard}>
                      {/* Photo Container */}
                      <div className={styles.parentImageContainer}>
                        <img src={parent.image} alt={parent.childName} className={styles.parentImg} />
                        
                        {/* Companion Badge */}
                        <div className={styles.parentBadge}>
                          <span className={styles.parentBadgeNumber}>+{parent.years}</span>
                          <span className={styles.parentBadgeText}>năm đồng hành</span>
                        </div>
                      </div>

                      {/* Info & Feedback */}
                      <div className={styles.parentInfo}>
                        <span className={styles.parentLabel}>Phụ huynh</span>
                        <h4 className={styles.parentChildName}>{parent.childName}</h4>
                        <div className={styles.parentDivider}></div>
                        <p className={styles.parentFeedback}>"{parent.feedback}"</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Right Button */}
            <button onClick={nextParentSlide} className={styles.navBtn} aria-label="Next Parent">
              <ChevronRight size={36} />
            </button>
          </div>
        </div>
      </section>

      {/* iCAM Online / Registration Section */}
      <section className={styles.registerSection}>
        {/* Wave Divider */}
        <div className={styles.waveDivider}>
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className={styles.waveSvg}>
            <path d="M0,0V60Q360,120,720,60T1440,60V0Z" fill="#F7941E"></path>
          </svg>
        </div>

        <div className={styles.registerInner}>
          {/* Heading */}
          <div className={styles.registerHeading}>
            <h2 className={styles.registerTitleSolo}>
              Trở thành học viên của <span className={styles.registerHighlight}>iCAM</span> ngay bây giờ
            </h2>
          </div>

          {/* Main Grid Layout */}
          <div className={styles.registerGrid}>
            {/* Left Column: Promotion Cards */}
            <div className={styles.registerLeftCards}>
              {/* Card 1 */}
              <div className={styles.promoCard}>
                <h3 className={styles.promoTitle}>GIẢM 30% HỌC PHÍ</h3>
                <p className={styles.promoText}>
                  Cho học viên lần đầu đăng ký trở thành học viên iCAM
                </p>
                <Link to="/contact" className={styles.promoBtn}>
                  NHẬN NGAY
                </Link>
              </div>

              {/* Card 2 */}
              <div className={styles.promoCard}>
                <h3 className={styles.promoTitle}>
                  ĐÁNH GIÁ NĂNG LỰC TIẾNG ANH CHUẨN QUỐC TẾ MIỄN PHÍ
                </h3>
                <Link to="/contact" className={styles.promoBtn}>
                  ĐĂNG KÝ NGAY
                </Link>
              </div>
            </div>

            {/* Right Column: Registration Form Card */}
            <div className={styles.formCard}>
              <h3 className={styles.formTitle}>ĐĂNG KÝ TƯ VẤN</h3>
              <form onSubmit={handleRegisterSubmit} className={styles.registerForm}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <input
                      type="text"
                      required
                      placeholder="*Họ và tên"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className={styles.formInput}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <input
                      type="tel"
                      required
                      placeholder="*Điện thoại"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={styles.formInput}
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <input
                      type="email"
                      required
                      placeholder="*Email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={styles.formInput}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <input
                      type="text"
                      required
                      placeholder="*Tuổi của bé"
                      value={formData.childAge}
                      onChange={(e) => setFormData({ ...formData, childAge: e.target.value })}
                      className={styles.formInput}
                    />
                  </div>
                </div>

                <div className={styles.formGroupFull}>
                  <select
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className={styles.formSelect}
                  >
                    <option value="">Tỉnh / Thành phố*</option>
                    <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                    <option value="TP. Hà Nội">TP. Hà Nội</option>
                    <option value="Tỉnh Bình Dương">Tỉnh Bình Dương</option>
                    <option value="Tỉnh Đồng Nai">Tỉnh Đồng Nai</option>
                    <option value="Tỉnh Bà Rịa - Vũng Tàu">Tỉnh Bà Rịa - Vũng Tàu</option>
                    <option value="Tỉnh Long An">Tỉnh Long An</option>
                    <option value="Tỉnh Tiền Giang">Tỉnh Tiền Giang</option>
                    <option value="Tỉnh Bến Tre">Tỉnh Bến Tre</option>
                    <option value="Tỉnh Tây Ninh">Tỉnh Tây Ninh</option>
                    <option value="TP. Cần Thơ">TP. Cần Thơ</option>
                    <option value="Khác">Tỉnh / Thành phố khác</option>
                  </select>
                </div>

                <div className={styles.formSubmitContainer}>
                  <button type="submit" className={styles.formSubmitBtn}>
                    ĐĂNG KÝ
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
