import React from 'react';
import styles from './SectionTransition.module.css';

export type TransitionVariant =
  | 'navy-to-white'
  | 'white-to-soft-orange'
  | 'soft-orange-to-white'
  | 'white-to-navy'
  | 'soft-orange-to-navy'
  | 'navy-to-soft-orange';

interface SectionTransitionProps {
  variant: TransitionVariant;
  className?: string;
}

export const SectionTransition: React.FC<SectionTransitionProps> = ({ variant, className = '' }) => {
  const renderSvg = () => {
    switch (variant) {
      case 'navy-to-white':
        // Deep Navy (#09265F) fill top, transitioning into White (#ffffff) below
        return (
          <div className={`${styles.transitionWrapper} ${styles.navyToWhite} ${className}`} aria-hidden="true">
            <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className={styles.transitionSvg}>
              <path
                d="M0,0 L1440,0 L1440,30 C1080,75 720,10 360,65 L0,25 Z"
                fill="#09265F"
              />
            </svg>
          </div>
        );

      case 'white-to-soft-orange':
        // White (#ffffff) fill top, transitioning into Soft Orange (#FFF8F0) below
        return (
          <div className={`${styles.transitionWrapper} ${styles.whiteToSoftOrange} ${className}`} aria-hidden="true">
            <svg viewBox="0 0 1440 70" preserveAspectRatio="none" className={styles.transitionSvg}>
              <path
                d="M0,0 L1440,0 L1440,20 C1000,65 440,15 0,55 Z"
                fill="#ffffff"
              />
            </svg>
          </div>
        );

      case 'soft-orange-to-white':
        // Soft Orange (#FFF8F0) fill top, transitioning into White (#ffffff) below
        return (
          <div className={`${styles.transitionWrapper} ${styles.softOrangeToWhite} ${className}`} aria-hidden="true">
            <svg viewBox="0 0 1440 70" preserveAspectRatio="none" className={styles.transitionSvg}>
              <path
                d="M0,0 L1440,0 L1440,35 C960,10 480,65 0,25 Z"
                fill="#FFF8F0"
              />
            </svg>
          </div>
        );

      case 'white-to-navy':
        // White (#ffffff) fill top, transitioning into Deep Navy (#09265F) below
        return (
          <div className={`${styles.transitionWrapper} ${styles.whiteToNavy} ${className}`} aria-hidden="true">
            <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className={styles.transitionSvg}>
              <path
                d="M0,80 L1440,80 L1440,50 C1080,5 720,70 360,15 L0,55 Z"
                fill="#09265F"
              />
            </svg>
          </div>
        );

      case 'soft-orange-to-navy':
        // Soft Orange (#FFF8F0) fill top, transitioning into Deep Navy (#09265F) below
        return (
          <div className={`${styles.transitionWrapper} ${styles.softOrangeToNavy} ${className}`} aria-hidden="true">
            <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className={styles.transitionSvg}>
              <path
                d="M0,80 L1440,80 L1440,40 C980,5 460,75 0,30 Z"
                fill="#09265F"
              />
            </svg>
          </div>
        );

      case 'navy-to-soft-orange':
        // Deep Navy (#09265F) top, White (#ffffff) breathing layer, into Soft Orange (#FFF8F0)
        return (
          <div className={`${styles.transitionWrapper} ${styles.navyToSoftOrange} ${className}`} aria-hidden="true">
            <svg viewBox="0 0 1440 90" preserveAspectRatio="none" className={styles.transitionSvg}>
              {/* White breathing layer */}
              <path
                d="M0,0 L1440,0 L1440,65 C1020,95 420,40 0,85 Z"
                fill="#ffffff"
              />
              {/* Navy top wave */}
              <path
                d="M0,0 L1440,0 L1440,35 C1080,75 720,15 360,60 L0,20 Z"
                fill="#09265F"
              />
            </svg>
          </div>
        );

      default:
        return null;
    }
  };

  return renderSvg();
};

export default SectionTransition;
