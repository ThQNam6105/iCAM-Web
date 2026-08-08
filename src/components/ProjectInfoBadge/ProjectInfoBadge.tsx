import React, { useState, useEffect, useRef } from 'react';
import { Info, ExternalLink, X } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import styles from './ProjectInfoBadge.module.css';

export const ProjectInfoBadge: React.FC = () => {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(true);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startHideTimer = () => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
    }
    hideTimerRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 5000);
  };

  // Initial Auto-hide after 5 seconds on page load
  useEffect(() => {
    startHideTimer();
    return () => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
    };
  }, []);

  const handleInteraction = () => {
    setIsOpen(true);
    startHideTimer();
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
    }
    setIsOpen(false);
  };

  return (
    <div className={styles.badgeWrapper}>
      {/* Icon Trigger */}
      <button
        type="button"
        className={`${styles.infoIconBtn} ${isOpen ? styles.activeBtn : ''}`}
        onMouseEnter={handleInteraction}
        onTouchStart={handleInteraction}
        aria-label={language === 'en' ? 'Project info' : 'Thông tin dự án'}
      >
        <Info size={20} className={styles.infoIcon} />
        <span className={styles.iconPulse} />
      </button>

      {/* Pop-up Card */}
      {isOpen && (
        <div
          className={styles.popupCard}
          onMouseEnter={handleInteraction}
          onTouchStart={handleInteraction}
        >
          <button
            type="button"
            className={styles.closeBtn}
            onClick={handleClose}
            aria-label={language === 'en' ? 'Close' : 'Đóng'}
          >
            <X size={14} />
          </button>

          <div className={styles.popupHeader}>
            <Info size={16} className={styles.popupHeaderIcon} />
            <span className={styles.popupHeaderTitle}>
              {language === 'en' ? 'PROJECT INFO' : 'THÔNG TIN DỰ ÁN'}
            </span>
          </div>

          <p className={styles.popupText}>
            {language === 'en' ? (
              <>
                This is an internship project by <strong>Thieu Nam da goat</strong> for iCANCAM English Center. The official website of iCANCAM English Center is{' '}
              </>
            ) : (
              <>
                Đây là dự án thực tập của <strong>Thiều Nam da goat</strong> cho trung tâm ngoại ngữ iCANCAM. Trang web chính chủ của trung tâm ngoại ngữ iCANCAM là{' '}
              </>
            )}
            <a
              href="https://ngoaingucam.vn/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.officialLink}
            >
              https://ngoaingucam.vn/ <ExternalLink size={12} className={styles.linkIcon} />
            </a>
          </p>
        </div>
      )}
    </div>
  );
};
