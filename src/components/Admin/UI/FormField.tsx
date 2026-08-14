import React from 'react';
import styles from './FormField.module.css';

export interface FormFieldProps {
  label?: string;
  required?: boolean;
  helperText?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  required = false,
  helperText,
  error,
  children,
  className = '',
}) => {
  return (
    <div className={`${styles.fieldContainer} ${className}`}>
      {label && (
        <div className={styles.fieldHeader}>
          <label className={styles.label}>
            {label}
            {required && <span className={styles.requiredStar}>*</span>}
          </label>
        </div>
      )}

      {helperText && <p className={styles.helperText}>{helperText}</p>}

      {children}

      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  );
};
