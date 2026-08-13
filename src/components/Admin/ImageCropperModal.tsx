import React from 'react';
import { X } from 'lucide-react';
import type { MediaItem } from '../../types/media';
import { ImageEditorCore } from './ImageEditorCore';
import styles from './ImageCropperModal.module.css';

interface ImageCropperModalProps {
  isOpen: boolean;
  asset: MediaItem | null;
  onSave: (croppedBlob: Blob, newFilename: string, focalX: number, focalY: number) => void;
  onClose: () => void;
}

export const ImageCropperModal: React.FC<ImageCropperModalProps> = ({
  isOpen,
  asset,
  onSave,
  onClose,
}) => {
  if (!isOpen || !asset) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()} style={{ maxWidth: '850px', padding: '1.25rem' }}>
        <div className={styles.modalHeader} style={{ marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <h3 className={styles.modalTitle} style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: '#ffffff' }}>
            Trình chỉnh sửa hình ảnh (Media Library Editor)
          </h3>
          <button type="button" onClick={onClose} className={styles.closeBtn} aria-label="Đóng modal">
            <X size={20} />
          </button>
        </div>

        <ImageEditorCore
          mode="full"
          imageSrc={asset.public_url}
          initialFocalX={asset.focal_x ?? 0.5}
          initialFocalY={asset.focal_y ?? 0.5}
          filename={asset.original_filename}
          mimeType={asset.mime_type || 'image/jpeg'}
          hasOriginalVariant={Boolean(asset.focal_x !== undefined || asset.original_filename.includes('_crop_') || asset.original_filename.includes('_edit_'))}
          onSave={(croppedBlob, newFilename, focalX, focalY) => {
            onSave(croppedBlob, newFilename, focalX, focalY);
            onClose();
          }}
          onClose={onClose}
        />
      </div>
    </div>
  );
};
