import React from 'react';
import { History, X, RotateCcw } from 'lucide-react';
import { type PostRevision } from '../../services/revisionService';
import styles from './RevisionHistoryModal.module.css';

interface RevisionHistoryModalProps {
  isOpen: boolean;
  revisions: PostRevision[];
  onRestore: (revision: PostRevision) => void;
  onClose: () => void;
}

export const RevisionHistoryModal: React.FC<RevisionHistoryModalProps> = ({
  isOpen,
  revisions,
  onRestore,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3 className={styles.title}>
            <History size={20} color="#F58220" /> Lịch sử phiên bản & khôi phục (Revision History)
          </h3>
          <button type="button" onClick={onClose} className={styles.closeBtn}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.body}>
          {revisions.length === 0 ? (
            <div className={styles.emptyText}>Chưa có lịch sử phiên bản nào được ghi lại cho bài viết này.</div>
          ) : (
            revisions.map((rev) => (
              <div key={rev.id} className={styles.revisionCard}>
                <div className={styles.revMeta}>
                  <span className={styles.revVersion}>Phiên bản v{rev.versionNumber} ({rev.status})</span>
                  <span className={styles.revTime}>Đã lưu lúc: {rev.timestamp}</span>
                </div>

                <button
                  type="button"
                  onClick={() => onRestore(rev)}
                  className={styles.restoreBtn}
                >
                  <RotateCcw size={14} style={{ display: 'inline', marginRight: '4px' }} /> Khôi phục bản này
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
