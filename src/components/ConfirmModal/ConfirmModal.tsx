import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { Button } from '../Admin/UI';
import styles from './ConfirmModal.module.css';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Xóa vĩnh viễn',
  cancelLabel = 'Hủy bỏ',
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <div className={styles.iconWrapper}>
          <AlertTriangle size={28} />
        </div>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.message}>{message}</p>
        <div className={styles.actions}>
          <Button type="button" variant="secondary" size="md" fullWidth onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant="danger"
            size="md"
            fullWidth
            icon={<Trash2 size={16} />}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};
