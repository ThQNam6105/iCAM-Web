import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Crop, ZoomIn, ZoomOut, RotateCcw, Save, X, Move } from 'lucide-react';
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
  const [zoom, setZoom] = useState<number>(100);
  const [panX, setPanX] = useState<number>(Math.round((asset?.focal_x ?? 0.5) * 100));
  const [panY, setPanY] = useState<number>(Math.round((asset?.focal_y ?? 0.5) * 100));
  const [prevAssetId, setPrevAssetId] = useState<string | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number; startPanX: number; startPanY: number }>({
    x: 0,
    y: 0,
    startPanX: 50,
    startPanY: 50,
  });
  const previewBoxRef = useRef<HTMLDivElement>(null);

  if (asset && asset.id !== prevAssetId) {
    setPrevAssetId(asset.id);
    setPanX(Math.round((asset.focal_x ?? 0.5) * 100));
    setPanY(Math.round((asset.focal_y ?? 0.5) * 100));
    setZoom(100);
  }

  const handleDragStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    dragStartRef.current = {
      x: clientX,
      y: clientY,
      startPanX: panX,
      startPanY: panY,
    };
  };

  const handleDragMove = useCallback(
    (clientX: number, clientY: number) => {
      if (!isDragging || !previewBoxRef.current) return;
      const rect = previewBoxRef.current.getBoundingClientRect();
      const deltaX = clientX - dragStartRef.current.x;
      const deltaY = clientY - dragStartRef.current.y;

      const sensitivity = (zoom / 100) * 0.8;
      const newPanX = Math.min(
        100,
        Math.max(0, dragStartRef.current.startPanX - (deltaX / rect.width) * 100 * sensitivity)
      );
      const newPanY = Math.min(
        100,
        Math.max(0, dragStartRef.current.startPanY - (deltaY / rect.height) * 100 * sensitivity)
      );

      setPanX(Math.round(newPanX));
      setPanY(Math.round(newPanY));
    },
    [isDragging, zoom]
  );

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    const onGlobalMouseMove = (e: MouseEvent) => handleDragMove(e.clientX, e.clientY);
    const onGlobalMouseUp = () => handleDragEnd();
    const onGlobalTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) handleDragMove(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onGlobalTouchEnd = () => handleDragEnd();

    if (isDragging) {
      window.addEventListener('mousemove', onGlobalMouseMove);
      window.addEventListener('mouseup', onGlobalMouseUp);
      window.addEventListener('touchmove', onGlobalTouchMove);
      window.addEventListener('touchend', onGlobalTouchEnd);
    }
    return () => {
      window.removeEventListener('mousemove', onGlobalMouseMove);
      window.removeEventListener('mouseup', onGlobalMouseUp);
      window.removeEventListener('touchmove', onGlobalTouchMove);
      window.removeEventListener('touchend', onGlobalTouchEnd);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  if (!isOpen || !asset) return null;

  const handleReset = () => {
    setZoom(100);
    setPanX(50);
    setPanY(50);
    setAspectRatio('16:9');
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

      const naturalAspect = img.naturalWidth / img.naturalHeight;
      const targetAspect = targetW / targetH;

      let srcW = img.naturalWidth;
      let srcH = img.naturalHeight;

      if (naturalAspect > targetAspect) {
        srcW = Math.round(img.naturalHeight * targetAspect);
      } else {
        srcH = Math.round(img.naturalWidth / targetAspect);
      }

      const zoomFactor = Math.max(1, zoom / 100);
      srcW = Math.round(srcW / zoomFactor);
      srcH = Math.round(srcH / zoomFactor);

      const maxSrcX = img.naturalWidth - srcW;
      const maxSrcY = img.naturalHeight - srcH;

      const srcX = Math.max(0, Math.min(maxSrcX, Math.round(maxSrcX * (panX / 100))));
      const srcY = Math.max(0, Math.min(maxSrcY, Math.round(maxSrcY * (panY / 100))));

      ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, targetW, targetH);

      canvas.toBlob((blob) => {
        if (blob) {
          const nameParts = asset.original_filename.split('.');
          const ext = nameParts.pop();
          const croppedName = `${nameParts.join('.')}_crop_${aspectRatio.replace(':', 'x')}.${ext}`;
          const normalizedFocalX = Number((panX / 100).toFixed(2));
          const normalizedFocalY = Number((panY / 100).toFixed(2));
          onSave(blob, croppedName, normalizedFocalX, normalizedFocalY);
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
            <Crop size={20} color="#F58220" /> Cắt ảnh & điều chỉnh tâm điểm hiển thị
          </h3>
          <button type="button" onClick={onClose} className={styles.closeBtn}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.modalBody}>
          {/* Aspect Ratio Toolbar */}
          <div className={styles.aspectRatioBar}>
            <span className={styles.ratioLabel}>Tỉ lệ cắt (Aspect ratio):</span>
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
          </div>

          {/* Interactive Drag & Zoom Canvas (Matching Cover Image Cropper) */}
          <div
            ref={previewBoxRef}
            onMouseDown={(e) => handleDragStart(e.clientX, e.clientY)}
            onTouchStart={(e) => e.touches[0] && handleDragStart(e.touches[0].clientX, e.touches[0].clientY)}
            onWheel={(e) => {
              e.preventDefault();
              setZoom((prev) => Math.min(300, Math.max(100, prev + (e.deltaY < 0 ? 10 : -10))));
            }}
            className={`${styles.cropCanvasArea} ${isDragging ? styles.cropCanvasAreaDragging : ''}`}
            title="Nhấn giữ & kéo chuột để di chuyển ảnh (Lăn chuột để Zoom)"
          >
            <img
              src={asset.public_url}
              alt="Crop preview"
              className={styles.previewImg}
              style={{
                objectFit: 'cover',
                objectPosition: `${panX}% ${panY}%`,
                transform: `scale(${zoom / 100})`,
                transformOrigin: `${panX}% ${panY}%`,
              }}
            />
            <div className={styles.dragHelpBadge}>
              <Move size={13} /> Nhấn giữ & kéo chuột di chuyển | Zoom: {zoom}%
            </div>
          </div>

          {/* Zoom Slider Controls (Matching Cover Image Cropper) */}
          <div className={styles.zoomControlRow}>
            <span className={styles.zoomLabel}>
              <ZoomIn size={14} /> Phóng to / thu nhỏ:
            </span>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(100, z - 10))}
              className={styles.alignBtn}
              title="Thu nhỏ 10%"
            >
              <ZoomOut size={13} />
            </button>
            <input
              type="range"
              min="100"
              max="300"
              step="5"
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className={styles.zoomSlider}
            />
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(300, z + 10))}
              className={styles.alignBtn}
              title="Phóng to 10%"
            >
              <ZoomIn size={13} />
            </button>
            <span className={styles.zoomValue}>{zoom}%</span>
            <button
              type="button"
              onClick={handleReset}
              className={styles.alignBtn}
              title="Đặt lại mặc định"
            >
              <RotateCcw size={13} /> Đặt lại
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={styles.actionRow}>
          <button type="button" onClick={handleReset} className={styles.resetBtn}>
            <RotateCcw size={16} /> Đặt lại mặc định
          </button>

          <div className={styles.saveGroup}>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>
              Hủy bỏ
            </button>
            <button type="button" onClick={handleApplyCrop} className={styles.saveBtn}>
              <Save size={16} /> Áp dụng & lưu tệp mới
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
