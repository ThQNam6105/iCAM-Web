import React, { useState, useRef } from 'react';
import { Crop, ZoomIn, RotateCcw, Save, X, Move, Target } from 'lucide-react';
import type { MediaItem } from '../../types/media';
import styles from './ImageCropperModal.module.css';

interface ImageCropperModalProps {
  isOpen: boolean;
  asset: MediaItem | null;
  onSave: (croppedBlob: Blob, newFilename: string, focalX: number, focalY: number) => void;
  onClose: () => void;
}

type AspectRatioOption = 'free' | '16:9' | '4:3' | '1:1';

export const ImageCropperModal: React.FC<ImageCropperModalProps> = ({
  isOpen,
  asset,
  onSave,
  onClose,
}) => {
  const [aspectRatio, setAspectRatio] = useState<AspectRatioOption>('16:9');
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [focalX, setFocalX] = useState(asset?.focal_x ?? 0.5);
  const [focalY, setFocalY] = useState(asset?.focal_y ?? 0.5);
  const [isFocalMode, setIsFocalMode] = useState(false);

  const canvasAreaRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !asset) return null;

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isFocalMode || !canvasAreaRef.current) return;
    const rect = canvasAreaRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setFocalX(Math.min(1, Math.max(0, Number(x.toFixed(2)))));
    setFocalY(Math.min(1, Math.max(0, Number(y.toFixed(2)))));
  };

  const handleReset = () => {
    setZoom(100);
    setRotation(0);
    setFocalX(0.5);
    setFocalY(0.5);
    setAspectRatio('16:9');
    setIsFocalMode(false);
  };

  const handleApplyCrop = async () => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const targetW = img.naturalWidth;
      let targetH = img.naturalHeight;

      if (aspectRatio === '16:9') {
        targetH = Math.round(targetW * (9 / 16));
      } else if (aspectRatio === '4:3') {
        targetH = Math.round(targetW * (3 / 4));
      } else if (aspectRatio === '1:1') {
        targetH = targetW;
      }

      canvas.width = targetW;
      canvas.height = targetH;

      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(zoom / 100, zoom / 100);

      // Draw relative to focal point
      const drawX = -targetW / 2;
      const drawY = -targetH / 2;
      ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, drawX, drawY, targetW, targetH);
      ctx.restore();

      canvas.toBlob((blob) => {
        if (blob) {
          const nameParts = asset.original_filename.split('.');
          const ext = nameParts.pop();
          const croppedName = `${nameParts.join('.')}_crop_${aspectRatio.replace(':', 'x')}.${ext}`;
          onSave(blob, croppedName, focalX, focalY);
        }
      }, asset.mime_type || 'image/jpeg', 0.92);
    };
    img.src = asset.public_url;
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>
            <Crop size={20} color="#F58220" /> Chỉnh Sửa Tỉ Lệ & Tâm Điểm Ảnh (Crop & Focal Point)
          </h3>
          <button type="button" onClick={onClose} className={styles.closeBtn}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.modalBody}>
          {/* Aspect Ratio Toolbar */}
          <div className={styles.aspectRatioBar}>
            <span className={styles.ratioLabel}>Tỉ lệ cắt (Aspect Ratio):</span>
            {(['16:9', '4:3', '1:1', 'free'] as AspectRatioOption[]).map((ratio) => (
              <button
                key={ratio}
                type="button"
                className={`${styles.ratioBtn} ${aspectRatio === ratio ? styles.ratioBtnActive : ''}`}
                onClick={() => setAspectRatio(ratio)}
              >
                {ratio === 'free' ? 'Tự do' : ratio}
              </button>
            ))}

            <button
              type="button"
              className={`${styles.ratioBtn} ${isFocalMode ? styles.ratioBtnActive : ''}`}
              onClick={() => setIsFocalMode(!isFocalMode)}
              style={{ marginLeft: 'auto' }}
              title="Bật tính năng chọn tâm điểm hiển thị (Focal Point)"
            >
              <Target size={15} /> {isFocalMode ? 'Đang chọn Tâm Điểm' : 'Đặt Tâm Điểm (Focal Point)'}
            </button>
          </div>

          {/* Interactive Canvas Area */}
          <div
            ref={canvasAreaRef}
            onClick={handleCanvasClick}
            className={styles.cropCanvasArea}
            title={isFocalMode ? 'Nhấp chuột vào ảnh để đặt vị trí Tâm điểm' : 'Xem trước hiệu ứng cắt cúp'}
          >
            <img
              src={asset.public_url}
              alt="Crop preview"
              className={styles.previewImg}
              style={{
                transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                objectPosition: `${focalX * 100}% ${focalY * 100}%`,
              }}
            />

            {/* Focal Point Indicator Indicator */}
            <div
              className={styles.focalPointDot}
              style={{
                left: `${focalX * 100}%`,
                top: `${focalY * 100}%`,
              }}
              title={`Focal Point: (${Math.round(focalX * 100)}%, ${Math.round(focalY * 100)}%)`}
            >
              <div className={styles.focalPointDotInner} />
            </div>
          </div>

          {/* Controls Sliders */}
          <div className={styles.controlsGrid}>
            <div className={styles.controlGroup}>
              <div className={styles.controlLabel}>
                <span><ZoomIn size={14} /> Phóng to (Zoom):</span>
                <span>{zoom}%</span>
              </div>
              <input
                type="range"
                min="100"
                max="300"
                step="5"
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className={styles.slider}
              />
            </div>

            <div className={styles.controlGroup}>
              <div className={styles.controlLabel}>
                <span><Move size={14} /> Xoay hình (Rotation):</span>
                <span>{rotation}°</span>
              </div>
              <input
                type="range"
                min="-180"
                max="180"
                step="5"
                value={rotation}
                onChange={(e) => setRotation(Number(e.target.value))}
                className={styles.slider}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={styles.actionRow}>
          <button type="button" onClick={handleReset} className={styles.resetBtn}>
            <RotateCcw size={16} /> Đặt lại
          </button>

          <div className={styles.saveGroup}>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>
              Hủy bỏ
            </button>
            <button type="button" onClick={handleApplyCrop} className={styles.saveBtn}>
              <Save size={16} /> Áp Dụng & Lưu Tệp Mới
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
