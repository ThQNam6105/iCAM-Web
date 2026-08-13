import React from 'react';
import styles from './Input.module.css';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  wrapperClassName?: string;
}

export const Input: React.FC<InputProps> = ({
  leftIcon,
  rightIcon,
  className = '',
  wrapperClassName = '',
  ...props
}) => {
  const combinedInputClassName = [
    styles.input,
    leftIcon ? styles.inputWithLeftIcon : '',
    rightIcon ? styles.inputWithRightIcon : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={`${styles.inputWrapper} ${wrapperClassName}`}>
      {leftIcon && <span className={styles.leftIcon}>{leftIcon}</span>}
      <input className={combinedInputClassName} {...props} />
      {rightIcon && <span className={styles.rightIcon}>{rightIcon}</span>}
    </div>
  );
};
