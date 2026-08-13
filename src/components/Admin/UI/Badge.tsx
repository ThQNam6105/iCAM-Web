import React from 'react';
import styles from './Badge.module.css';

export interface BadgeProps {
  variant?: 'published' | 'draft' | 'archived' | 'success' | 'warning' | 'danger' | 'neutral';
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  icon,
  children,
  className = '',
  style,
}) => {
  return (
    <span className={`${styles.badge} ${styles[variant]} ${className}`} style={style}>
      {icon}
      {children}
    </span>
  );
};
