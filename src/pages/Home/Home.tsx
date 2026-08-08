import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Home.module.css';
import { articlesData } from '../../data/newsData';
import { teachersData } from '../../data/teacherData';
import { studentsData } from '../../data/studentData';
import { parentsData } from '../../data/parentData';
import bannerBg from '../../assets/banner-bg.jpg';
import bannerBgMobile from '../../assets/banner-bg-mobile.jpg';
import enBannerBg from '../../assets/en_banner-bg.jpg';
import enBannerBgMobile from '../../assets/en_banner-bg-mobile.jpg';
import studentHologram from '../../assets/student_hologram.png';
import achievementTeacher from '../../assets/achievement_teacher.png';
import achievementSmartboard from '../../assets/achievement_smartboard.png';
import achievementSchool from '../../assets/achievement_school.png';
import { useLanguage } from '../../contexts/LanguageContext';

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
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  // State for News Overview
  const [currentIndex, setCurrentIndex] = useState(0);
  const [disableTransition, setDisableTransition] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [cardsToShow, setCardsToShow] = useState(3);

  // Mouse & Touch Drag State for News Slider
  const [isDraggingNews, setIsDraggingNews] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const dragMovedRef = React.useRef(false);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);
  const [showCursorTooltip, setShowCursorTooltip] = useState(false);

  // State for Teachers Slider
  const [teacherIndex, setTeacherIndex] = useState(0);
  const [disableTeacherTransition, setDisableTeacherTransition] = useState(false);
  const [isTeacherPaused, setIsTeacherPaused] = useState(false);
  const [teachersToShow, setTeachersToShow] = useState(4);

  // Mouse & Touch Drag State for Teachers Slider
  const [isDraggingTeacher, setIsDraggingTeacher] = useState(false);
  const [teacherDragStartX, setTeacherDragStartX] = useState(0);
  const [teacherDragOffset, setTeacherDragOffset] = useState(0);
  const teacherDragMovedRef = React.useRef(false);
  const [teacherCursorPos, setTeacherCursorPos] = useState<{ x: number; y: number } | null>(null);
  const [showTeacherCursorTooltip, setShowTeacherCursorTooltip] = useState(false);

  // State for Students Slider
  const [studentIndex, setStudentIndex] = useState(0);
  const [disableStudentTransition, setDisableStudentTransition] = useState(false);
  const [isStudentPaused, setIsStudentPaused] = useState(false);
  const [studentsToShow, setStudentsToShow] = useState(3);

  // Mouse & Touch Drag State for Students Slider
  const [isDraggingStudent, setIsDraggingStudent] = useState(false);
  const [studentDragStartX, setStudentDragStartX] = useState(0);
  const [studentDragOffset, setStudentDragOffset] = useState(0);
  const studentDragMovedRef = React.useRef(false);
  const [studentCursorPos, setStudentCursorPos] = useState<{ x: number; y: number } | null>(null);
  const [showStudentCursorTooltip, setShowStudentCursorTooltip] = useState(false);

  // State for Parents Slider
  const [parentIndex, setParentIndex] = useState(0);
  const [disableParentTransition, setDisableParentTransition] = useState(false);
  const [isParentPaused, setIsParentPaused] = useState(false);
  const [parentsToShow, setParentsToShow] = useState(3);

  // Mouse & Touch Drag State for Parents Slider
  const [isDraggingParent, setIsDraggingParent] = useState(false);
  const [parentDragStartX, setParentDragStartX] = useState(0);
  const [parentDragOffset, setParentDragOffset] = useState(0);
  const parentDragMovedRef = React.useRef(false);
  const [parentCursorPos, setParentCursorPos] = useState<{ x: number; y: number } | null>(null);
  const [showParentCursorTooltip, setShowParentCursorTooltip] = useState(false);

  // General States
  const [isTabActive, setIsTabActive] = useState(true);
  const [currentBanner, setCurrentBanner] = useState(bannerBg);
  const [activeAchievementIdx, setActiveAchievementIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveAchievementIdx((prev) => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

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
    alert(language === 'en' ? 'Thank you! iCANCAM team will contact you soon.' : 'Cảm ơn bạn đã đăng ký! iCANCAM sẽ liên hệ tư vấn sớm nhất.');
    setFormData({ fullName: '', phone: '', email: '', childAge: '', city: '' });
  };

  // Check screen width for responsiveness & banner image switching (Bilingual support)
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const isMobile = width <= 768;

      if (language === 'en') {
        setCurrentBanner(isMobile ? enBannerBgMobile : enBannerBg);
      } else {
        setCurrentBanner(isMobile ? bannerBgMobile : bannerBg);
      }

      if (width < 640) {
        setCardsToShow(1);
        setTeachersToShow(1);
        setStudentsToShow(1);
        setParentsToShow(1);
      } else if (width < 1024) {
        setCardsToShow(2);
        setTeachersToShow(2);
        setStudentsToShow(2);
        setParentsToShow(2);
      } else {
        setCardsToShow(3);
        setTeachersToShow(4);
        setStudentsToShow(3);
        setParentsToShow(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [language]);

  // Page visibility check for auto-play sliders
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabActive(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // ==========================================================================
  // Slider News - Infinite loop logic
  // ==========================================================================
  const clonedArticlesBefore = articlesData.slice(-cardsToShow);
  const clonedArticlesAfter = articlesData.slice(0, cardsToShow);
  const extendedArticles = [...clonedArticlesBefore, ...articlesData, ...clonedArticlesAfter];

  const nextSlide = () => {
    if (disableTransition) return;
    setCurrentIndex((prev) => prev + 1);
  };

  const prevSlide = () => {
    if (disableTransition) return;
    setCurrentIndex((prev) => prev - 1);
  };

  const handleMouseDownNews = (e: React.MouseEvent) => {
    // Chỉ kích hoạt khi nhấn giữ CHUỘT TRÁI (e.button === 0)
    if (e.button !== 0) return;
    e.preventDefault();
    setIsDraggingNews(true);
    setDragStartX(e.clientX);
    setDragOffset(0);
    dragMovedRef.current = false;
    setIsPaused(true);
  };

  useEffect(() => {
    if (!isDraggingNews) return;

    const handleGlobalMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - dragStartX;
      if (Math.abs(deltaX) > 5) {
        dragMovedRef.current = true;
      }
      setDragOffset(deltaX);
    };

    const handleGlobalMouseUp = (e: MouseEvent) => {
      if (e.button === 0 || e.buttons === 0) {
        setIsDraggingNews(false);
        setIsPaused(false);
        setDragOffset((currentOffset) => {
          if (currentOffset < -40) {
            if (!disableTransition) setCurrentIndex((prev) => prev + 1);
          } else if (currentOffset > 40) {
            if (!disableTransition) setCurrentIndex((prev) => prev - 1);
          }
          return 0;
        });
      }
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDraggingNews, dragStartX, disableTransition]);

  const handleTouchStartNews = (e: React.TouchEvent) => {
    setIsDraggingNews(true);
    setDragStartX(e.touches[0].clientX);
    setDragOffset(0);
    dragMovedRef.current = false;
    setIsPaused(true);
  };

  const handleTouchMoveNews = (e: React.TouchEvent) => {
    if (!isDraggingNews) return;
    const deltaX = e.touches[0].clientX - dragStartX;
    if (Math.abs(deltaX) > 5) {
      dragMovedRef.current = true;
    }
    setDragOffset(deltaX);
  };

  const handleTouchEndNews = () => {
    if (!isDraggingNews) return;
    setIsDraggingNews(false);
    setIsPaused(false);
    if (dragOffset < -40) {
      nextSlide();
    } else if (dragOffset > 40) {
      prevSlide();
    }
    setDragOffset(0);
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
  // Slider Teachers - Infinite loop logic
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

  // Drag Handlers for Teachers Slider
  const handleMouseDownTeacher = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDraggingTeacher(true);
    setTeacherDragStartX(e.clientX);
    setTeacherDragOffset(0);
    teacherDragMovedRef.current = false;
    setIsTeacherPaused(true);
  };

  useEffect(() => {
    if (!isDraggingTeacher) return;

    const handleGlobalMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - teacherDragStartX;
      if (Math.abs(deltaX) > 5) {
        teacherDragMovedRef.current = true;
      }
      setTeacherDragOffset(deltaX);
    };

    const handleGlobalMouseUp = (e: MouseEvent) => {
      if (e.button === 0 || e.buttons === 0) {
        setIsDraggingTeacher(false);
        setIsTeacherPaused(false);
        setTeacherDragOffset((currentOffset) => {
          if (currentOffset < -40) {
            if (!disableTeacherTransition) setTeacherIndex((prev) => prev + 1);
          } else if (currentOffset > 40) {
            if (!disableTeacherTransition) setTeacherIndex((prev) => prev - 1);
          }
          return 0;
        });
      }
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDraggingTeacher, teacherDragStartX, disableTeacherTransition]);

  const handleTouchStartTeacher = (e: React.TouchEvent) => {
    setIsDraggingTeacher(true);
    setTeacherDragStartX(e.touches[0].clientX);
    setTeacherDragOffset(0);
    teacherDragMovedRef.current = false;
    setIsTeacherPaused(true);
  };

  const handleTouchMoveTeacher = (e: React.TouchEvent) => {
    if (!isDraggingTeacher) return;
    const deltaX = e.touches[0].clientX - teacherDragStartX;
    if (Math.abs(deltaX) > 5) {
      teacherDragMovedRef.current = true;
    }
    setTeacherDragOffset(deltaX);
  };

  const handleTouchEndTeacher = () => {
    if (!isDraggingTeacher) return;
    setIsDraggingTeacher(false);
    setIsTeacherPaused(false);
    if (teacherDragOffset < -40) {
      nextTeacherSlide();
    } else if (teacherDragOffset > 40) {
      prevTeacherSlide();
    }
    setTeacherDragOffset(0);
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
  // Slider Students - Infinite loop logic
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

  // Drag Handlers for Students Slider
  const handleMouseDownStudent = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDraggingStudent(true);
    setStudentDragStartX(e.clientX);
    setStudentDragOffset(0);
    studentDragMovedRef.current = false;
    setIsStudentPaused(true);
  };

  useEffect(() => {
    if (!isDraggingStudent) return;

    const handleGlobalMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - studentDragStartX;
      if (Math.abs(deltaX) > 5) {
        studentDragMovedRef.current = true;
      }
      setStudentDragOffset(deltaX);
    };

    const handleGlobalMouseUp = (e: MouseEvent) => {
      if (e.button === 0 || e.buttons === 0) {
        setIsDraggingStudent(false);
        setIsStudentPaused(false);
        setStudentDragOffset((currentOffset) => {
          if (currentOffset < -40) {
            if (!disableStudentTransition) setStudentIndex((prev) => prev + 1);
          } else if (currentOffset > 40) {
            if (!disableStudentTransition) setStudentIndex((prev) => prev - 1);
          }
          return 0;
        });
      }
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDraggingStudent, studentDragStartX, disableStudentTransition]);

  const handleTouchStartStudent = (e: React.TouchEvent) => {
    setIsDraggingStudent(true);
    setStudentDragStartX(e.touches[0].clientX);
    setStudentDragOffset(0);
    studentDragMovedRef.current = false;
    setIsStudentPaused(true);
  };

  const handleTouchMoveStudent = (e: React.TouchEvent) => {
    if (!isDraggingStudent) return;
    const deltaX = e.touches[0].clientX - studentDragStartX;
    if (Math.abs(deltaX) > 5) {
      studentDragMovedRef.current = true;
    }
    setStudentDragOffset(deltaX);
  };

  const handleTouchEndStudent = () => {
    if (!isDraggingStudent) return;
    setIsDraggingStudent(false);
    setIsStudentPaused(false);
    if (studentDragOffset < -40) {
      nextStudentSlide();
    } else if (studentDragOffset > 40) {
      prevStudentSlide();
    }
    setStudentDragOffset(0);
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
  // Slider Parents - Infinite loop logic
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

  // Drag Handlers for Parents Slider
  const handleMouseDownParent = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDraggingParent(true);
    setParentDragStartX(e.clientX);
    setParentDragOffset(0);
    parentDragMovedRef.current = false;
    setIsParentPaused(true);
  };

  useEffect(() => {
    if (!isDraggingParent) return;

    const handleGlobalMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - parentDragStartX;
      if (Math.abs(deltaX) > 5) {
        parentDragMovedRef.current = true;
      }
      setParentDragOffset(deltaX);
    };

    const handleGlobalMouseUp = (e: MouseEvent) => {
      if (e.button === 0 || e.buttons === 0) {
        setIsDraggingParent(false);
        setIsParentPaused(false);
        setParentDragOffset((currentOffset) => {
          if (currentOffset < -40) {
            if (!disableParentTransition) setParentIndex((prev) => prev + 1);
          } else if (currentOffset > 40) {
            if (!disableParentTransition) setParentIndex((prev) => prev - 1);
          }
          return 0;
        });
      }
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDraggingParent, parentDragStartX, disableParentTransition]);

  const handleTouchStartParent = (e: React.TouchEvent) => {
    setIsDraggingParent(true);
    setParentDragStartX(e.touches[0].clientX);
    setParentDragOffset(0);
    parentDragMovedRef.current = false;
    setIsParentPaused(true);
  };

  const handleTouchMoveParent = (e: React.TouchEvent) => {
    if (!isDraggingParent) return;
    const deltaX = e.touches[0].clientX - parentDragStartX;
    if (Math.abs(deltaX) > 5) {
      parentDragMovedRef.current = true;
    }
    setParentDragOffset(deltaX);
  };

  const handleTouchEndParent = () => {
    if (!isDraggingParent) return;
    setIsDraggingParent(false);
    setIsParentPaused(false);
    if (parentDragOffset < -40) {
      nextParentSlide();
    } else if (parentDragOffset > 40) {
      prevParentSlide();
    }
    setParentDragOffset(0);
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
        {/* Background image overlay */}
        <div className={styles.overlay} />

        {/* Register button at bottom center */}
        <div className={styles.buttonContainer}>
          <Link to="/contact" className={`btn-primary ${styles.registerBtn}`}>
            {t.home.registerNow}
          </Link>
        </div>
      </section>

      {/* News Overview Section */}
      <section className={styles.newsSection}>
        <div className={styles.newsContainer}>
          {/* Top Label */}
          <div className={styles.newsTopLabelContainer}>
            <div className={styles.newsTopLabel}>
              <span>{t.home.newsOverviewLabel}</span>
            </div>
          </div>

          {/* Slider Row Wrapper with Drag to Scroll & Floating Tooltip */}
          <div
            className={`${styles.newsSliderWrapper} ${isDraggingNews ? styles.isDragging : ''}`}
            onMouseEnter={() => {
              setIsPaused(true);
              setShowCursorTooltip(true);
            }}
            onMouseLeave={() => {
              setIsPaused(false);
              setShowCursorTooltip(false);
            }}
            onMouseMove={(e) => {
              setCursorPos({ x: e.clientX, y: e.clientY });
            }}
            onMouseDown={handleMouseDownNews}
            onTouchStart={handleTouchStartNews}
            onTouchMove={handleTouchMoveNews}
            onTouchEnd={handleTouchEndNews}
          >
            {/* Floating Mouse Cursor Drag Tooltip */}
            {showCursorTooltip && cursorPos && (
              <div
                className={`${styles.cursorDragBadge} ${isDraggingNews ? styles.isDraggingBadge : ''}`}
                style={{
                  left: `${cursorPos.x + 14}px`,
                  top: `${cursorPos.y + 18}px`,
                }}
              >
                {isDraggingNews
                  ? (language === 'en' ? 'Dragging...' : 'Đang kéo...')
                  : (language === 'en' ? 'Hold & Drag' : 'Giữ và kéo')}
              </div>
            )}
            {/* Slider viewport */}
            <div className={styles.sliderContainer}>
              <div
                className={styles.sliderTrack}
                onTransitionEnd={handleTransitionEnd}
                style={{
                  transform: `translate3d(calc(-${(currentIndex + cardsToShow) * (100 / cardsToShow)}% + ${dragOffset}px), 0px, 0px)`,
                  transition: disableTransition || isDraggingNews ? 'none' : 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)',
                }}
              >
                {extendedArticles.map((article, index) => (
                  <div
                    key={`${article.id}-${index}`}
                    className={styles.cardWrapper}
                    style={{ width: `${100 / cardsToShow}%` }}
                  >
                    <div
                      className={styles.newsCard}
                      onClick={(e) => {
                        e.preventDefault();
                        if (!dragMovedRef.current) {
                          navigate('/news');
                        }
                      }}
                    >
                      <div className={styles.imageWrapper}>
                        <img
                          src={article.image}
                          alt={language === 'en' ? (article.titleEn || article.title) : article.title}
                          className={styles.newsImg}
                          draggable={false}
                        />
                      </div>
                      <h4 className={styles.newsTitle}>
                        {language === 'en' ? (article.titleEn || article.title) : article.title}
                      </h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Number Talk / Stats Section */}
      <section className={styles.numberTalkSection}>
        <div className={styles.numberTalkInner}>
          {/* Top Label */}
          <div className={styles.numberTalkTopLabelContainer}>
            <div className={styles.numberTalkTopLabel}>
              <span>{t.home.achievementsLabel}</span>
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
                    10 <span className={styles.numberTalkItemSup}>{language === 'en' ? 'years' : 'năm'}</span>
                  </h3>
                  <div className={styles.numberTalkItemText}>
                    {t.home.yearsExpDesc}
                  </div>
                </div>

                {/* Item 2 */}
                <div className={styles.numberTalkItem}>
                  <h3 className={styles.numberTalkItemTitle} style={{ fontSize: '2rem' }}>
                    4Ls & L.E.T.I
                  </h3>
                  <div className={styles.numberTalkItemText}>
                    {language === 'en' ? 'interactive learning methods applied' : 'ứng dụng phương pháp học tiếng Anh ứng dụng và tương tác'}
                  </div>
                </div>

                {/* Item 3 */}
                <div className={styles.numberTalkItem}>
                  <h3 className={styles.numberTalkItemTitle}>
                    100 <span className={styles.numberTalkItemSup}>%</span>
                  </h3>
                  <div className={styles.numberTalkItemText}>
                    {t.home.teachersCountDesc}
                  </div>
                </div>

                {/* Item 4 */}
                <div className={styles.numberTalkItem}>
                  <h3 className={styles.numberTalkItemTitle}>
                    {language === 'en' ? 'Over 20' : 'Hơn 20'} <span className={styles.numberTalkItemSup}>{language === 'en' ? 'schools' : 'trường'}</span>
                  </h3>
                  <div className={styles.numberTalkItemText}>
                    {language === 'en' ? 'partner schools across Hoc Mon & District 12' : 'đang liên kết giảng dạy trên địa bàn quận 12 và tỉnh Bình Dương'}
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
              <span>{t.home.teachersLabel}</span>
            </div>
          </div>

          {/* Teachers Slider Wrapper */}
          <div
            className={`${styles.teachersSliderWrapper} ${isDraggingTeacher ? styles.isDragging : ''}`}
            onMouseEnter={() => {
              setIsTeacherPaused(true);
              setShowTeacherCursorTooltip(true);
            }}
            onMouseLeave={() => {
              setIsTeacherPaused(false);
              setShowTeacherCursorTooltip(false);
            }}
            onMouseMove={(e) => {
              setTeacherCursorPos({ x: e.clientX, y: e.clientY });
            }}
            onMouseDown={handleMouseDownTeacher}
            onTouchStart={handleTouchStartTeacher}
            onTouchMove={handleTouchMoveTeacher}
            onTouchEnd={handleTouchEndTeacher}
          >
            {/* Floating Mouse Cursor Drag Tooltip */}
            {showTeacherCursorTooltip && teacherCursorPos && (
              <div
                className={`${styles.cursorDragBadge} ${isDraggingTeacher ? styles.isDraggingBadge : ''}`}
                style={{
                  left: `${teacherCursorPos.x + 14}px`,
                  top: `${teacherCursorPos.y + 18}px`,
                }}
              >
                {isDraggingTeacher
                  ? (language === 'en' ? 'Dragging...' : 'Đang kéo...')
                  : (language === 'en' ? 'Hold & Drag' : 'Giữ và kéo')}
              </div>
            )}

            {/* Viewport */}
            <div className={styles.teachersSliderContainer}>
              <div
                className={styles.teachersSliderTrack}
                onTransitionEnd={handleTeacherTransitionEnd}
                style={{
                  transform: `translate3d(calc(-${(teacherIndex + teachersToShow) * (100 / teachersToShow)}% + ${teacherDragOffset}px), 0px, 0px)`,
                  transition: disableTeacherTransition || isDraggingTeacher ? 'none' : 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)',
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
                        <img src={teacher.image} alt={teacher.name} className={styles.teacherImg} draggable={false} />
                        
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
                                  <p className={styles.highlightTitle}>
                                    {language === 'en' ? (hl.titleEn || hl.title) : hl.title}
                                  </p>
                                  <p className={styles.highlightSubText}>
                                    {language === 'en' ? (hl.subTextEn || hl.subText) : hl.subText}
                                  </p>
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
                        <p className={styles.teacherRole}>
                          {language === 'en' ? (teacher.roleEn || teacher.role) : teacher.role}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Students Section */}
      <section className={styles.studentsSection}>
        <div className={styles.studentsInner}>
          {/* Top Label */}
          <div className={styles.studentsTopLabelContainer}>
            <div className={styles.studentsTopLabel}>
              <span>{t.home.studentsLabel}</span>
            </div>
          </div>

          {/* Students Slider Wrapper */}
          <div
            className={`${styles.studentsSliderWrapper} ${isDraggingStudent ? styles.isDragging : ''}`}
            onMouseEnter={() => {
              setIsStudentPaused(true);
              setShowStudentCursorTooltip(true);
            }}
            onMouseLeave={() => {
              setIsStudentPaused(false);
              setShowStudentCursorTooltip(false);
            }}
            onMouseMove={(e) => {
              setStudentCursorPos({ x: e.clientX, y: e.clientY });
            }}
            onMouseDown={handleMouseDownStudent}
            onTouchStart={handleTouchStartStudent}
            onTouchMove={handleTouchMoveStudent}
            onTouchEnd={handleTouchEndStudent}
          >
            {/* Floating Mouse Cursor Drag Tooltip */}
            {showStudentCursorTooltip && studentCursorPos && (
              <div
                className={`${styles.cursorDragBadge} ${isDraggingStudent ? styles.isDraggingBadge : ''}`}
                style={{
                  left: `${studentCursorPos.x + 14}px`,
                  top: `${studentCursorPos.y + 18}px`,
                }}
              >
                {isDraggingStudent
                  ? (language === 'en' ? 'Dragging...' : 'Đang kéo...')
                  : (language === 'en' ? 'Hold & Drag' : 'Giữ và kéo')}
              </div>
            )}

            {/* Viewport */}
            <div className={styles.studentsSliderContainer}>
              <div
                className={styles.studentsSliderTrack}
                onTransitionEnd={handleStudentTransitionEnd}
                style={{
                  transform: `translate3d(calc(-${(studentIndex + studentsToShow) * (100 / studentsToShow)}% + ${studentDragOffset}px), 0px, 0px)`,
                  transition: disableStudentTransition || isDraggingStudent ? 'none' : 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)',
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
                        <img src={student.image} alt={student.name} className={styles.studentImg} draggable={false} />
                        
                        {/* Default Badge */}
                        <div className={styles.defaultBadge}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                          <span>{language === 'en' ? (student.mainHighlightEn || student.mainHighlight) : student.mainHighlight}</span>
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
                                  <h5 className={styles.highlightTitle}>
                                    {language === 'en' ? (hl.titleEn || hl.title) : hl.title}
                                  </h5>
                                  <p className={styles.highlightSubText}>
                                    {language === 'en' ? (hl.subTextEn || hl.subText) : hl.subText}
                                  </p>
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
                          <span className={styles.verifiedIcon} title={language === 'en' ? 'Verified by ICANCAM' : 'Đã xác minh bởi ICANCAM'}>
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
                        <p className={styles.studentRole}>
                          {language === 'en' ? (student.roleEn || student.role) : student.role}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Parents Testimonials Section */}
      <section className={styles.parentsSection}>
        <div className={styles.parentsInner}>
          {/* Top Label */}
          <div className={styles.parentsTopLabelContainer}>
            <div className={styles.parentsTopLabel}>
              <span>{t.home.parentsLabel}</span>
            </div>
          </div>

          {/* Parents Slider Wrapper */}
          <div
            className={`${styles.parentsSliderWrapper} ${isDraggingParent ? styles.isDragging : ''}`}
            onMouseEnter={() => {
              setIsParentPaused(true);
              setShowParentCursorTooltip(true);
            }}
            onMouseLeave={() => {
              setIsParentPaused(false);
              setShowParentCursorTooltip(false);
            }}
            onMouseMove={(e) => {
              setParentCursorPos({ x: e.clientX, y: e.clientY });
            }}
            onMouseDown={handleMouseDownParent}
            onTouchStart={handleTouchStartParent}
            onTouchMove={handleTouchMoveParent}
            onTouchEnd={handleTouchEndParent}
          >
            {/* Floating Mouse Cursor Drag Tooltip */}
            {showParentCursorTooltip && parentCursorPos && (
              <div
                className={`${styles.cursorDragBadge} ${isDraggingParent ? styles.isDraggingBadge : ''}`}
                style={{
                  left: `${parentCursorPos.x + 14}px`,
                  top: `${parentCursorPos.y + 18}px`,
                }}
              >
                {isDraggingParent
                  ? (language === 'en' ? 'Dragging...' : 'Đang kéo...')
                  : (language === 'en' ? 'Hold & Drag' : 'Giữ và kéo')}
              </div>
            )}

            {/* Viewport */}
            <div className={styles.parentsSliderContainer}>
              <div
                className={styles.parentsSliderTrack}
                onTransitionEnd={handleParentTransitionEnd}
                style={{
                  transform: `translate3d(calc(-${(parentIndex + parentsToShow) * (100 / parentsToShow)}% + ${parentDragOffset}px), 0px, 0px)`,
                  transition: disableParentTransition || isDraggingParent ? 'none' : 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)',
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
                        <img src={parent.image} alt={parent.childName} className={styles.parentImg} draggable={false} />
                        
                        {/* Companion Badge */}
                        <div className={styles.parentBadge}>
                          <span className={styles.parentBadgeNumber}>+{parent.years}</span>
                          <span className={styles.parentBadgeText}>{language === 'en' ? 'years with us' : 'năm đồng hành'}</span>
                        </div>
                      </div>

                      {/* Info & Feedback */}
                      <div className={styles.parentInfo}>
                        <span className={styles.parentLabel}>{language === 'en' ? 'Parent' : 'Phụ huynh'}</span>
                        <h4 className={styles.parentChildName}>{parent.childName}</h4>
                        <div className={styles.parentDivider}></div>
                        <p className={styles.parentFeedback}>
                          "{language === 'en' ? (parent.feedbackEn || parent.feedback) : parent.feedback}"
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
              {language === 'en' ? 'Become an ' : 'Trở thành học viên của '}
              <span className={styles.registerHighlight}>iCANCAM</span>
              {language === 'en' ? ' student today' : ' ngay bây giờ'}
            </h2>
          </div>

          {/* Main Grid Layout */}
          <div className={styles.registerGrid}>
            {/* Left Column: Promotion Cards */}
            <div className={styles.registerLeftCards}>
              {/* Card 1 */}
              <div className={styles.promoCard}>
                <h3 className={styles.promoTitle}>
                  {language === 'en' ? '30% TUITION DISCOUNT' : 'GIẢM 30% HỌC PHÍ'}
                </h3>
                <p className={styles.promoText}>
                  {language === 'en' ? 'For students enrolling in September' : 'Cho học viên đăng ký trong tháng 9'}
                </p>
                <Link to="/contact" className={styles.promoBtn}>
                  {language === 'en' ? 'CLAIM NOW' : 'NHẬN NGAY'}
                </Link>
              </div>

              {/* Card 2 */}
              <div className={styles.promoCard}>
                <h3 className={styles.promoTitle}>
                  {language === 'en' ? 'FREE INTERNATIONAL ENGLISH ASSESSMENT' : 'ĐÁNH GIÁ NĂNG LỰC TIẾNG ANH CHUẨN QUỐC TẾ MIỄN PHÍ'}
                </h3>
                <Link to="/contact" className={styles.promoBtn}>
                  {t.home.registerNow}
                </Link>
              </div>
            </div>

            {/* Right Column: Registration Form Card */}
            <div className={styles.formCard}>
              <h3 className={styles.formTitle}>
                {language === 'en' ? 'BOOK CONSULTATION' : 'ĐÁNH GIÁ & TƯ VẤN'}
              </h3>
              <form onSubmit={handleRegisterSubmit} className={styles.registerForm}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <input
                      type="text"
                      required
                      placeholder={t.home.regNamePlaceholder}
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className={styles.formInput}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <input
                      type="tel"
                      required
                      placeholder={t.home.regPhonePlaceholder}
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
                      placeholder={t.home.regEmailPlaceholder}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={styles.formInput}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <input
                      type="text"
                      required
                      placeholder={t.home.regAgePlaceholder}
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
                    <option value="">{language === 'en' ? 'City / Province*' : 'Tỉnh / Thành phố*'}</option>
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
                    <option value="Khác">{language === 'en' ? 'Other Region' : 'Tỉnh / Thành phố khác'}</option>
                  </select>
                </div>

                <div className={styles.formSubmitContainer}>
                  <button type="submit" className={styles.formSubmitBtn}>
                    {t.home.registerNow}
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

