import React, { useState } from 'react';
import { Info } from 'lucide-react';
import styles from './FormField.module.css';

export interface FormFieldProps {
  label?: string;
  required?: boolean;
  helperText?: string;
  error?: string;
  technicalDetails?: string;
  children: React.ReactNode;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  required = false,
  helperText,
  error,
  technicalDetails,
  children,
  className = '',
}) => {
  const [showTechDetails, setShowTechDetails] = useState(false);

  return (
    <div className={`${styles.fieldContainer} ${className}`}>
      {(label || technicalDetails) && (
        <div className={styles.fieldHeader}>
          {label && (
            <label className={styles.label}>
              {label}
              {required && <span className={styles.requiredStar}>*</span>}
            </label>
          )}
          {technicalDetails && (
            <button
              type="button"
              className={styles.techToggleBtn}
              onClick={() => setShowTechDetails(!showTechDetails)}
            >
              <Info size={12} />
              {showTechDetails ? 'Ẩn chi tiết kỹ thuật' : 'Xem chi tiết kỹ thuật'}
            </button>
          )}
        </div>
      )}

      {helperText && <p className={styles.helperText}>{helperText}</p>}

      {children}

      {error && <p className={styles.errorMessage}>{error}</p>}

      {showTechDetails && technicalDetails && (
        <div className={styles.techDetailsDrawer}>{technicalDetails}</div>
      )}
    </div>
  );
};
