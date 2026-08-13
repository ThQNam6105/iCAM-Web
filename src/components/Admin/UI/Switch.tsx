import React from 'react';
import styles from './Switch.module.css';

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
  className = '',
  id,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onChange(!checked);
    }
  };

  return (
    <label
      className={`${styles.switchLabel} ${disabled ? styles.switchDisabled : ''} ${className}`}
      id={id}
    >
      <div
        tabIndex={disabled ? -1 : 0}
        role="switch"
        aria-checked={checked}
        onKeyDown={handleKeyDown}
        onClick={() => !disabled && onChange(!checked)}
        className={`${styles.switchTrack} ${checked ? styles.switchTrackChecked : ''}`}
      >
        <div className={`${styles.switchThumb} ${checked ? styles.switchThumbChecked : ''}`} />
      </div>
      {label && <span className={styles.switchText}>{label}</span>}
    </label>
  );
};
