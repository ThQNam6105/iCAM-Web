import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Crop,
  RotateCcw,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  ZoomIn,
  ZoomOut,
  Undo2,
  Redo2,
  Sliders,
  Sparkles,
  Maximize2,
  Sun,
  Contrast,
  Target,
  Eye,
  RefreshCw,
  Save,
  Check,
  Move,
  Lock,
  Unlock,
  ChevronDown,
  Monitor,
  Smartphone,
  Tablet,
  LayoutGrid,
} from 'lucide-react';
import styles from './ImageEditorCore.module.css';

export interface ImageEditorState {
  zoom: number; // 100 to 300
  panX: number; // 0 to 100
  panY: number; // 0 to 100
  aspectRatio: string; // 'free' | 'original' | '16:9' | '4:3' | '3:2' | '1:1' | '9:16' | 'custom'
  customWidth?: number;
  customHeight?: number;
  rotation: number; // 0, 90, 180, 270
  straighten: number; // -45 to 45
  flipH: boolean;
  flipV: boolean;
  brightness: number; // 0 to 200 (default 100)
  contrast: number; // 0 to 200 (default 100)
  saturation: number; // 0 to 200 (default 100)
  sharpness: number; // 0 to 100 (default 0)
  filterPreset: 'none' | 'grayscale' | 'warm' | 'cool' | 'contrast' | 'vintage' | 'vivid';
  resizeWidth?: number;
  resizeHeight?: number;
  lockResizeRatio: boolean;
  focalX: number; // 0 to 1 (default 0.5)
  focalY: number; // 0 to 1 (default 0.5)
  focalMode: boolean;
}

export interface ImageEditorCoreProps {
  imageSrc: string;
  mode?: 'quick' | 'full'; // 'quick' = Cover Image Quick Edit, 'full' = Media Library Full Edit
  initialFocalX?: number;
  initialFocalY?: number;
  initialPanX?: number;
  initialPanY?: number;
  initialZoom?: number;
  initialAspectRatio?: string;
  filename?: string;
  mimeType?: string;
  hasOriginalVariant?: boolean;
  onSave?: (editedBlob: Blob, newFilename: string, focalX: number, focalY: number, isNewAsset: boolean) => void;
  onQuickChange?: (state: ImageEditorState) => void;
  onClose?: () => void;
  onRestoreOriginal?: () => void;
}

const DEFAULT_STATE: ImageEditorState = {
  zoom: 100,
  panX: 50,
  panY: 50,
  aspectRatio: '16:9',
  rotation: 0,
  straighten: 0,
  flipH: false,
  flipV: false,
  brightness: 100,
  contrast: 100,
  saturation: 100,
  sharpness: 0,
  filterPreset: 'none',
  lockResizeRatio: true,
  focalX: 0.5,
  focalY: 0.5,
  focalMode: false,
};

const ASPECT_RATIOS = [
  { id: 'free', label: 'Tự do' },
  { id: 'original', label: 'Gốc' },
  { id: '16:9', label: '16:9' },
  { id: '4:3', label: '4:3' },
  { id: '3:2', label: '3:2' },
  { id: '1:1', label: '1:1' },
  { id: '9:16', label: '9:16' },
];

const FILTER_PRESETS = [
  { id: 'none', label: 'Gốc', css: 'none' },
  { id: 'grayscale', label: 'Trắng đen', css: 'grayscale(100%)' },
  { id: 'warm', label: 'Ấm áp', css: 'sepia(30%) saturate(140%)' },
  { id: 'cool', label: 'Tươi mát', css: 'hue-rotate(30deg) saturate(120%)' },
  { id: 'contrast', label: 'Tương phản', css: 'contrast(150%)' },
  { id: 'vintage', label: 'Cổ điển', css: 'sepia(50%) contrast(110%)' },
  { id: 'vivid', label: 'Rực rỡ', css: 'saturate(200%) brightness(105%)' },
] as const;

export const ImageEditorCore: React.FC<ImageEditorCoreProps> = ({
  imageSrc,
  mode = 'full',
  initialFocalX = 0.5,
  initialFocalY = 0.5,
  initialPanX = 50,
  initialPanY = 50,
  initialZoom = 100,
  initialAspectRatio = '16:9',
  filename = 'image.jpg',
  mimeType = 'image/jpeg',
  hasOriginalVariant = false,
  onSave,
  onQuickChange,
  onClose,
  onRestoreOriginal,
}) => {
  // Main State & Undo/Redo History
  const [state, setState] = useState<ImageEditorState>(() => ({
    ...DEFAULT_STATE,
    zoom: initialZoom,
    panX: initialPanX,
    panY: initialPanY,
    aspectRatio: initialAspectRatio,
    focalX: initialFocalX,
    focalY: initialFocalY,
  }));

  const [history, setHistory] = useState<ImageEditorState[]>([
    {
      ...DEFAULT_STATE,
      zoom: initialZoom,
      panX: initialPanX,
      panY: initialPanY,
      aspectRatio: initialAspectRatio,
      focalX: initialFocalX,
      focalY: initialFocalY,
    },
  ]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Tabs for Full Editor Mode
  const [activeTab, setActiveTab] = useState<'crop' | 'transform' | 'adjust' | 'filter' | 'resize'>('crop');

  // Interactive Drag & Canvas Refs
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number; startPanX: number; startPanY: number }>({
    x: 0,
    y: 0,
    startPanX: 50,
    startPanY: 50,
  });
  const previewBoxRef = useRef<HTMLDivElement>(null);

  // Before / After Press-and-Hold Preview State
  const [isShowingBefore, setIsShowingBefore] = useState(false);

  // Reset Confirmation Popover
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Save Menu Dropdown State
  const [showSaveMenu, setShowSaveMenu] = useState(false);

  // Context Preview Tab in Quick Editor Mode
  const [contextFrame, setContextFrame] = useState<'banner' | 'card' | 'thumb' | 'mobile'>('banner');

  // Push new state into history stack
  const updateState = useCallback(
    (updater: (prev: ImageEditorState) => ImageEditorState) => {
      setState((prev) => {
        const next = updater(prev);
        setHistory((prevHist) => {
          const newHist = prevHist.slice(0, historyIndex + 1);
          return [...newHist, next];
        });
        setHistoryIndex((prevIdx) => prevIdx + 1);
        if (onQuickChange) onQuickChange(next);
        return next;
      });
    },
    [historyIndex, onQuickChange]
  );

  const undo = () => {
    if (historyIndex > 0) {
      const prevIdx = historyIndex - 1;
      const targetState = history[prevIdx];
      setHistoryIndex(prevIdx);
      setState(targetState);
      if (onQuickChange) onQuickChange(targetState);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const nextIdx = historyIndex + 1;
      const targetState = history[nextIdx];
      setHistoryIndex(nextIdx);
      setState(targetState);
      if (onQuickChange) onQuickChange(targetState);
    }
  };

  // Canvas Mouse Dragging for Pan Position & Focal Point Placement
  const handleDragStart = (clientX: number, clientY: number) => {
    if (state.focalMode && previewBoxRef.current) {
      const rect = previewBoxRef.current.getBoundingClientRect();
      const clickX = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const clickY = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
      const newPanX = Math.round(clickX * 100);
      const newPanY = Math.round(clickY * 100);

      updateState((prev) => ({
        ...prev,
        focalX: Number(clickX.toFixed(2)),
        focalY: Number(clickY.toFixed(2)),
        panX: newPanX,
        panY: newPanY,
      }));
      return;
    }

    setIsDragging(true);
    dragStartRef.current = {
      x: clientX,
      y: clientY,
      startPanX: state.panX,
      startPanY: state.panY,
    };
  };

  const handleDragMove = useCallback(
    (clientX: number, clientY: number) => {
      if (!isDragging || !previewBoxRef.current || state.focalMode) return;
      const rect = previewBoxRef.current.getBoundingClientRect();
      const deltaX = clientX - dragStartRef.current.x;
      const deltaY = clientY - dragStartRef.current.y;

      const sensitivity = (state.zoom / 100) * 0.8;
      const newPanX = Math.min(
        100,
        Math.max(0, dragStartRef.current.startPanX - (deltaX / rect.width) * 100 * sensitivity)
      );
      const newPanY = Math.min(
        100,
        Math.max(0, dragStartRef.current.startPanY - (deltaY / rect.height) * 100 * sensitivity)
      );

      setState((prev) => {
        const next = {
          ...prev,
          panX: Math.round(newPanX),
          panY: Math.round(newPanY),
          focalX: Number((newPanX / 100).toFixed(2)),
          focalY: Number((newPanY / 100).toFixed(2)),
        };
        if (onQuickChange) onQuickChange(next);
        return next;
      });
    },
    [isDragging, state.focalMode, state.zoom, onQuickChange]
  );

  const handleDragEnd = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      // Record finalized pan in history
      setHistory((prevHist) => {
        const newHist = prevHist.slice(0, historyIndex + 1);
        return [...newHist, state];
      });
      setHistoryIndex((prevIdx) => prevIdx + 1);
    }
  }, [isDragging, historyIndex, state]);

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

  // Compute CSS filter string for live preview
  const getCssFilter = useCallback(() => {
    if (isShowingBefore) return 'none';
    let filterStr = `brightness(${state.brightness}%) contrast(${state.contrast}%) saturate(${state.saturation}%)`;
    const preset = FILTER_PRESETS.find((f) => f.id === state.filterPreset);
    if (preset && preset.css !== 'none') {
      filterStr += ` ${preset.css}`;
    }
    return filterStr;
  }, [state, isShowingBefore]);

  // Compute CSS transform string for live preview
  const getCssTransform = useCallback(() => {
    if (isShowingBefore) return 'none';
    const totalRotation = state.rotation + state.straighten;
    const scaleX = state.flipH ? -1 : 1;
    const scaleY = state.flipV ? -1 : 1;
    const zoomScale = state.zoom / 100;
    return `rotate(${totalRotation}deg) scale(${scaleX * zoomScale}, ${scaleY * zoomScale})`;
  }, [state, isShowingBefore]);

  // Handle Export Canvas rendering to Blob
  const handleExportBlob = (isNewAsset: boolean) => {
    if (!onSave) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      let targetW = img.naturalWidth;
      let targetH = img.naturalHeight;

      if (state.aspectRatio === '16:9') targetH = Math.round(targetW * (9 / 16));
      else if (state.aspectRatio === '4:3') targetH = Math.round(targetW * (3 / 4));
      else if (state.aspectRatio === '3:2') targetH = Math.round(targetW * (2 / 3));
      else if (state.aspectRatio === '1:1') targetH = targetW;
      else if (state.aspectRatio === '9:16') targetH = Math.round(targetW * (16 / 9));

      if (state.resizeWidth && state.resizeHeight) {
        targetW = state.resizeWidth;
        targetH = state.resizeHeight;
      }

      canvas.width = targetW;
      canvas.height = targetH;

      ctx.save();
      ctx.filter = getCssFilter();

      // Position & crop region
      const naturalAspect = img.naturalWidth / img.naturalHeight;
      const targetAspect = targetW / targetH;
      let srcW = img.naturalWidth;
      let srcH = img.naturalHeight;

      if (naturalAspect > targetAspect) {
        srcW = Math.round(img.naturalHeight * targetAspect);
      } else {
        srcH = Math.round(img.naturalWidth / targetAspect);
      }

      const zoomFactor = Math.max(1, state.zoom / 100);
      srcW = Math.round(srcW / zoomFactor);
      srcH = Math.round(srcH / zoomFactor);

      const maxSrcX = img.naturalWidth - srcW;
      const maxSrcY = img.naturalHeight - srcH;

      const srcX = Math.max(0, Math.min(maxSrcX, Math.round(maxSrcX * (state.panX / 100))));
      const srcY = Math.max(0, Math.min(maxSrcY, Math.round(maxSrcY * (state.panY / 100))));

      // Apply Center Rotations / Flips on canvas
      ctx.translate(canvas.width / 2, canvas.height / 2);
      const totalRad = ((state.rotation + state.straighten) * Math.PI) / 180;
      ctx.rotate(totalRad);
      ctx.scale(state.flipH ? -1 : 1, state.flipV ? -1 : 1);
      ctx.drawImage(img, srcX, srcY, srcW, srcH, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
      ctx.restore();

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const nameParts = filename.split('.');
            const ext = nameParts.pop() || 'jpg';
            const suffix = isNewAsset ? `_edit_${Date.now()}` : `_crop_${state.aspectRatio.replace(':', 'x')}`;
            const outName = `${nameParts.join('.')}${suffix}.${ext}`;
            onSave(blob, outName, state.focalX, state.focalY, isNewAsset);
          }
        },
        mimeType,
        0.92
      );
    };
    img.src = imageSrc;
  };

  const handleResetState = () => {
    updateState(() => ({
      ...DEFAULT_STATE,
      zoom: initialZoom,
      panX: initialPanX,
      panY: initialPanY,
      aspectRatio: initialAspectRatio,
      focalX: initialFocalX,
      focalY: initialFocalY,
    }));
    setShowResetConfirm(false);
  };

  return (
    <div className={styles.editorContainer}>
      {/* Editor Header: Title, History (Undo/Redo), Focal Toggle */}
      <div className={styles.editorHeader}>
        <div className={styles.modeTitle}>
          <Crop size={18} color="#F58220" />
          <span>{mode === 'quick' ? 'Cắt & căn chỉnh ảnh bìa' : 'Chỉnh sửa hình ảnh'}</span>
        </div>

        <div className={styles.historyGroup}>
          <button
            type="button"
            onClick={undo}
            disabled={historyIndex <= 0}
            className={styles.iconBtn}
            title="Hoàn tác (Undo)"
            aria-label="Undo"
          >
            <Undo2 size={15} /> ↶
          </button>
          <button
            type="button"
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            className={styles.iconBtn}
            title="Làm lại (Redo)"
            aria-label="Redo"
          >
            <Redo2 size={15} /> ↷
          </button>

          {/* Before / After Press & Hold Button */}
          <button
            type="button"
            onMouseDown={() => setIsShowingBefore(true)}
            onMouseUp={() => setIsShowingBefore(false)}
            onTouchStart={() => setIsShowingBefore(true)}
            onTouchEnd={() => setIsShowingBefore(false)}
            className={`${styles.iconBtn} ${isShowingBefore ? styles.iconBtnActive : ''}`}
            title="Nhấn giữ để so sánh ảnh gốc (Before / After)"
            aria-label="Before / After comparison"
          >
            <Eye size={15} /> So sánh
          </button>
        </div>
      </div>

      {/* Mode Switcher / Tab Bar for Full Mode */}
      {mode === 'full' && (
        <div className={styles.tabNav}>
          <button
            type="button"
            onClick={() => setActiveTab('crop')}
            className={`${styles.tabBtn} ${activeTab === 'crop' ? styles.tabBtnActive : ''}`}
            aria-label="Crop tab"
          >
            <Crop size={15} /> Crop
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('transform')}
            className={`${styles.tabBtn} ${activeTab === 'transform' ? styles.tabBtnActive : ''}`}
            aria-label="Transform tab"
          >
            <RotateCcw size={15} /> Xoay & lật
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('adjust')}
            className={`${styles.tabBtn} ${activeTab === 'adjust' ? styles.tabBtnActive : ''}`}
            aria-label="Adjustments tab"
          >
            <Sliders size={15} /> Chỉnh màu
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('filter')}
            className={`${styles.tabBtn} ${activeTab === 'filter' ? styles.tabBtnActive : ''}`}
            aria-label="Filters tab"
          >
            <Sparkles size={15} /> Bộ lọc
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('resize')}
            className={`${styles.tabBtn} ${activeTab === 'resize' ? styles.tabBtnActive : ''}`}
            aria-label="Resize tab"
          >
            <Maximize2 size={15} /> Kích thước
          </button>
        </div>
      )}

      {/* Main Preview Canvas Area */}
      <div
        ref={previewBoxRef}
        onMouseDown={(e) => handleDragStart(e.clientX, e.clientY)}
        onTouchStart={(e) => e.touches[0] && handleDragStart(e.touches[0].clientX, e.touches[0].clientY)}
        onWheel={(e) => {
          e.preventDefault();
          updateState((prev) => ({
            ...prev,
            zoom: Math.min(300, Math.max(100, prev.zoom + (e.deltaY < 0 ? 10 : -10))),
          }));
        }}
        className={`${styles.canvasWrapper} ${isDragging ? styles.canvasWrapperDragging : ''} ${
          mode === 'quick' && contextFrame === 'card'
            ? styles.contextCardFrame
            : mode === 'quick' && contextFrame === 'thumb'
            ? styles.contextThumbFrame
            : mode === 'quick' && contextFrame === 'mobile'
            ? styles.contextMobileFrame
            : ''
        }`}
        title="Nhấn giữ & kéo chuột để di chuyển ảnh (Lăn chuột để Zoom)"
      >
        {isShowingBefore && <div className={styles.beforeAfterBadge}>Ảnh gốc</div>}

        <img
          src={imageSrc}
          alt="Preview Canvas"
          className={styles.previewImg}
          style={{
            objectFit: state.aspectRatio === 'free' ? 'contain' : 'cover',
            objectPosition: `${state.panX}% ${state.panY}%`,
            transform: getCssTransform(),
            transformOrigin: `${state.panX}% ${state.panY}%`,
            filter: getCssFilter(),
          }}
        />

        {/* Interactive Focal Point Overlay Marker */}
        <div
          className={styles.focalMarker}
          style={{ left: `${state.focalX * 100}%`, top: `${state.focalY * 100}%` }}
          title={`Tâm điểm focal point: ${Math.round(state.focalX * 100)}%, ${Math.round(state.focalY * 100)}%`}
        >
          <div className={styles.focalDot} />
        </div>

        {/* Canvas Control Hints Badge */}
        <div className={styles.badgeOverlay}>
          <Move size={13} /> {state.focalMode ? 'Bấm vị trí bất kỳ trên ảnh để đặt tâm điểm' : 'Kéo chuột di chuyển'} | Zoom: {state.zoom}%
        </div>
      </div>

      {/* Sub Toolbars Depending on Mode / Active Tab */}

      {/* 1. CROP & RATIO BAR */}
      {(mode === 'quick' || activeTab === 'crop') && (
        <div className={styles.subControlBar}>
          <div className={styles.subGroup}>
            <span className={styles.controlLabel}>Tỉ lệ:</span>
            <div className={styles.ratioGrid}>
              {ASPECT_RATIOS.map((ratio) => (
                <button
                  key={ratio.id}
                  type="button"
                  className={`${styles.ratioPill} ${state.aspectRatio === ratio.id ? styles.ratioPillActive : ''}`}
                  onClick={() => updateState((prev) => ({ ...prev, aspectRatio: ratio.id }))}
                  aria-label={`Ratio ${ratio.label}`}
                >
                  {ratio.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Zoom Controls */}
          <div className={styles.subGroup}>
            <button
              type="button"
              onClick={() => updateState((prev) => ({ ...prev, zoom: Math.max(100, prev.zoom - 10) }))}
              className={styles.iconBtn}
              title="Thu nhỏ (-)"
              aria-label="Zoom out"
            >
              <ZoomOut size={14} /> −
            </button>
            <span className={styles.sliderValue}>{state.zoom}%</span>
            <button
              type="button"
              onClick={() => updateState((prev) => ({ ...prev, zoom: Math.min(300, prev.zoom + 10) }))}
              className={styles.iconBtn}
              title="Phóng to (+)"
              aria-label="Zoom in"
            >
              <ZoomIn size={14} /> +
            </button>

            {/* Focal Mode Toggle */}
            <button
              type="button"
              onClick={() => updateState((prev) => ({ ...prev, focalMode: !prev.focalMode }))}
              className={`${styles.iconBtn} ${state.focalMode ? styles.iconBtnActive : ''}`}
              title="Bật/Tắt chế độ đặt tâm điểm (Focal Point)"
              aria-label="Focal point mode"
            >
              <Target size={14} /> Tâm điểm
            </button>
          </div>
        </div>
      )}

      {/* 2. TRANSFORM BAR (ROTATE, STRAIGHTEN, FLIP) */}
      {(mode === 'quick' || activeTab === 'transform') && (
        <div className={styles.subControlBar}>
          <div className={styles.subGroup}>
            <span className={styles.controlLabel}>Xoay & lật:</span>
            <button
              type="button"
              onClick={() => updateState((prev) => ({ ...prev, rotation: (prev.rotation - 90 + 360) % 360 }))}
              className={styles.iconBtn}
              title="Xoay trái 90°"
              aria-label="Rotate left"
            >
              <RotateCcw size={14} /> ↺
            </button>
            <button
              type="button"
              onClick={() => updateState((prev) => ({ ...prev, rotation: (prev.rotation + 90) % 360 }))}
              className={styles.iconBtn}
              title="Xoay phải 90°"
              aria-label="Rotate right"
            >
              <RotateCw size={14} /> ↻
            </button>
            <button
              type="button"
              onClick={() => updateState((prev) => ({ ...prev, flipH: !prev.flipH }))}
              className={`${styles.iconBtn} ${state.flipH ? styles.iconBtnActive : ''}`}
              title="Lật ngang (Flip horizontal)"
              aria-label="Flip horizontal"
            >
              <FlipHorizontal size={14} /> ↔
            </button>
            <button
              type="button"
              onClick={() => updateState((prev) => ({ ...prev, flipV: !prev.flipV }))}
              className={`${styles.iconBtn} ${state.flipV ? styles.iconBtnActive : ''}`}
              title="Lật dọc (Flip vertical)"
              aria-label="Flip vertical"
            >
              <FlipVertical size={14} /> ↕
            </button>
          </div>

          <div className={styles.sliderRow}>
            <span className={styles.controlLabel}>Cân nghiêng:</span>
            <input
              type="range"
              min="-45"
              max="45"
              step="0.5"
              value={state.straighten}
              onChange={(e) => updateState((prev) => ({ ...prev, straighten: Number(e.target.value) }))}
              className={styles.sliderInput}
            />
            <span className={styles.sliderValue}>{state.straighten}°</span>
          </div>
        </div>
      )}

      {/* 3. COLOR ADJUSTMENTS BAR */}
      {mode === 'full' && activeTab === 'adjust' && (
        <div className={styles.subControlBar}>
          <div className={styles.sliderRow}>
            <Sun size={15} color="#F58220" />
            <span className={styles.controlLabel}>Độ sáng:</span>
            <input
              type="range"
              min="0"
              max="200"
              value={state.brightness}
              onChange={(e) => updateState((prev) => ({ ...prev, brightness: Number(e.target.value) }))}
              className={styles.sliderInput}
            />
            <span className={styles.sliderValue}>{state.brightness}%</span>
          </div>

          <div className={styles.sliderRow}>
            <Contrast size={15} color="#3b82f6" />
            <span className={styles.controlLabel}>Độ tương phản:</span>
            <input
              type="range"
              min="0"
              max="200"
              value={state.contrast}
              onChange={(e) => updateState((prev) => ({ ...prev, contrast: Number(e.target.value) }))}
              className={styles.sliderInput}
            />
            <span className={styles.sliderValue}>{state.contrast}%</span>
          </div>

          <div className={styles.sliderRow}>
            <Sliders size={15} color="#10b981" />
            <span className={styles.controlLabel}>Độ bão hòa:</span>
            <input
              type="range"
              min="0"
              max="200"
              value={state.saturation}
              onChange={(e) => updateState((prev) => ({ ...prev, saturation: Number(e.target.value) }))}
              className={styles.sliderInput}
            />
            <span className={styles.sliderValue}>{state.saturation}%</span>
          </div>
        </div>
      )}

      {/* 4. FILTER PRESETS CARDS */}
      {mode === 'full' && activeTab === 'filter' && (
        <div className={styles.subControlBar}>
          <div className={styles.filterGrid}>
            {FILTER_PRESETS.map((preset) => (
              <div
                key={preset.id}
                className={`${styles.filterCard} ${state.filterPreset === preset.id ? styles.filterCardActive : ''}`}
                onClick={() => updateState((prev) => ({ ...prev, filterPreset: preset.id as any }))}
              >
                <img
                  src={imageSrc}
                  alt={preset.label}
                  className={styles.filterThumb}
                  style={{ filter: preset.css }}
                />
                <span className={styles.filterName}>{preset.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. RESIZE BAR */}
      {mode === 'full' && activeTab === 'resize' && (
        <div className={styles.subControlBar}>
          <div className={styles.subGroup}>
            <span className={styles.controlLabel}>Rộng (px):</span>
            <input
              type="number"
              value={state.resizeWidth || ''}
              placeholder="Auto"
              onChange={(e) => {
                const val = Number(e.target.value);
                updateState((prev) => ({
                  ...prev,
                  resizeWidth: val || undefined,
                  resizeHeight: prev.lockResizeRatio && val ? Math.round(val * (9 / 16)) : prev.resizeHeight,
                }));
              }}
              className={styles.numInput}
            />

            <button
              type="button"
              onClick={() => updateState((prev) => ({ ...prev, lockResizeRatio: !prev.lockResizeRatio }))}
              className={`${styles.iconBtn} ${state.lockResizeRatio ? styles.iconBtnActive : ''}`}
              title="Khoá / Mở tỉ lệ hình ảnh"
              aria-label="Lock aspect ratio"
            >
              {state.lockResizeRatio ? <Lock size={14} /> : <Unlock size={14} />}
            </button>

            <span className={styles.controlLabel}>Cao (px):</span>
            <input
              type="number"
              value={state.resizeHeight || ''}
              placeholder="Auto"
              onChange={(e) => {
                const val = Number(e.target.value);
                updateState((prev) => ({
                  ...prev,
                  resizeHeight: val || undefined,
                  resizeWidth: prev.lockResizeRatio && val ? Math.round(val * (16 / 9)) : prev.resizeWidth,
                }));
              }}
              className={styles.numInput}
            />
          </div>

          <div className={styles.subGroup}>
            <span className={styles.controlLabel}>Presets:</span>
            {[
              { label: 'FHD', w: 1920, h: 1080 },
              { label: 'HD', w: 1280, h: 720 },
              { label: 'Square', w: 1080, h: 1080 },
            ].map((p) => (
              <button
                key={p.label}
                type="button"
                className={styles.ratioPill}
                onClick={() => updateState((prev) => ({ ...prev, resizeWidth: p.w, resizeHeight: p.h }))}
              >
                {p.label} ({p.w}x{p.h})
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quick Mode Article Cover Context Preview Tabs */}
      {mode === 'quick' && (
        <div className={styles.subControlBar}>
          <span className={styles.controlLabel}>Xem trước khung hiển thị:</span>
          <div className={styles.contextTabs}>
            <button
              type="button"
              className={`${styles.contextBtn} ${contextFrame === 'banner' ? styles.contextBtnActive : ''}`}
              onClick={() => setContextFrame('banner')}
              aria-label="Banner preview"
            >
              <Monitor size={13} /> Banner bài viết (16:9)
            </button>
            <button
              type="button"
              className={`${styles.contextBtn} ${contextFrame === 'card' ? styles.contextBtnActive : ''}`}
              onClick={() => setContextFrame('card')}
              aria-label="Card preview"
            >
              <LayoutGrid size={13} /> Card tin tức
            </button>
            <button
              type="button"
              className={`${styles.contextBtn} ${contextFrame === 'thumb' ? styles.contextBtnActive : ''}`}
              onClick={() => setContextFrame('thumb')}
              aria-label="Thumbnail preview"
            >
              <Tablet size={13} /> Avatar / Vuông
            </button>
            <button
              type="button"
              className={`${styles.contextBtn} ${contextFrame === 'mobile' ? styles.contextBtnActive : ''}`}
              onClick={() => setContextFrame('mobile')}
              aria-label="Mobile preview"
            >
              <Smartphone size={13} /> Mobile feed
            </button>
          </div>
        </div>
      )}

      {/* Footer Action Bar: Reset, Restore Original, Cancel & Save Menu Dropdown */}
      <div className={styles.editorFooter}>
        <div className={styles.resetGroup}>
          {!showResetConfirm ? (
            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              className={styles.iconBtn}
              title="Đặt lại tất cả thay đổi"
              aria-label="Reset all changes"
            >
              <RefreshCw size={14} /> Đặt lại
            </button>
          ) : (
            <div className={styles.confirmPopover}>
              <span className={styles.confirmText}>Khôi phục lại từ đầu?</span>
              <button type="button" onClick={handleResetState} className={styles.iconBtnActive}>
                Đồng ý
              </button>
              <button type="button" onClick={() => setShowResetConfirm(false)} className={styles.iconBtn}>
                Hủy
              </button>
            </div>
          )}

          {hasOriginalVariant && onRestoreOriginal && (
            <button
              type="button"
              onClick={onRestoreOriginal}
              className={styles.iconBtn}
              title="Khôi phục tệp ảnh gốc chưa chỉnh sửa"
              aria-label="Restore original image"
            >
              <Undo2 size={14} /> Khôi phục ảnh gốc
            </button>
          )}
        </div>

        <div className={styles.actionGroup}>
          {onClose && (
            <button type="button" onClick={onClose} className={styles.iconBtn} aria-label="Cancel editing">
              Hủy bỏ
            </button>
          )}

          {onSave && (
            <div className={styles.saveMenuWrapper}>
              <button
                type="button"
                onClick={() => handleExportBlob(false)}
                className={`${styles.iconBtn} ${styles.iconBtnActive}`}
                title="Lưu thay đổi trực tiếp lên tệp"
                aria-label="Save changes"
              >
                <Save size={15} /> Lưu thay đổi
              </button>

              <button
                type="button"
                onClick={() => setShowSaveMenu(!showSaveMenu)}
                className={`${styles.iconBtn} ${styles.iconBtnActive}`}
                style={{ paddingLeft: '0.4rem', paddingRight: '0.4rem' }}
                title="Tùy chọn lưu nâng cao"
                aria-label="More save options"
              >
                <ChevronDown size={14} />
              </button>

              {showSaveMenu && (
                <div className={styles.saveMenuDropdown}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowSaveMenu(false);
                      handleExportBlob(false);
                    }}
                    className={styles.saveMenuItem}
                  >
                    <Save size={14} /> Lưu tệp này (Save)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowSaveMenu(false);
                      handleExportBlob(true);
                    }}
                    className={styles.saveMenuItem}
                  >
                    <Check size={14} /> Lưu thành tệp mới (Save as new)
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
