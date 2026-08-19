import { sanitizeHtml } from '../sanitizerService';

export interface FileValidationResult {
  valid: boolean;
  error?: string;
  isSvg?: boolean;
  isGif?: boolean;
  isAnimatedGif?: boolean;
  isPdf?: boolean;
  isDoc?: boolean;
}

export const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'image/x-icon',
  'image/vnd.microsoft.icon',
  'image/ico',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
  'audio/mpeg',
  'audio/wav',
  'video/mp4',
  'video/webm',
]);

export const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB

/**
 * Validates file MIME type, extension, size, and content
 */
export const validateMediaFile = async (file: File): Promise<FileValidationResult> => {
  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  const allowedExts = new Set([
    'jpg', 'jpeg', 'png', 'webp', 'gif', 'svg', 'ico', 'icon',
    'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt',
    'mp4', 'webm', 'mp3', 'wav', 'm4a', 'ogg'
  ]);

  if (!allowedExts.has(ext)) {
    return { valid: false, error: `Định dạng file .${ext} không được hệ thống hỗ trợ.` };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { valid: false, error: `Dung lượng tệp (${(file.size / (1024 * 1024)).toFixed(1)}MB) vượt quá giới hạn tối đa 50MB.` };
  }

  const mime = file.type.toLowerCase();
  const isSvg = ext === 'svg' || mime.includes('svg');
  const isPdf = ext === 'pdf' || mime.includes('pdf');
  const isGif = ext === 'gif' || mime.includes('gif');
  const isDoc = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'].includes(ext) ||
                mime.includes('word') || mime.includes('document') || mime.includes('excel') || mime.includes('powerpoint') || mime.includes('text');

  let isAnimatedGif = false;
  if (isGif) {
    try {
      const buffer = await file.arrayBuffer();
      const arr = new Uint8Array(buffer);
      // Basic animated GIF detection
      let gceCount = 0;
      for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] === 0x21 && arr[i + 1] === 0xf9) {
          gceCount++;
          if (gceCount > 1) {
            isAnimatedGif = true;
            break;
          }
        }
      }
    } catch {
      // Fallback
    }
  }

  return {
    valid: true,
    isSvg,
    isGif,
    isAnimatedGif,
    isPdf,
    isDoc,
  };
};

/**
 * Calculates SHA-256 content hash of file for deduplication
 */
export const calculateFileHash = async (file: File): Promise<string> => {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
};

/**
 * Sanitizes SVG file text to prevent XSS / script injection
 */
export const sanitizeSvgContent = async (file: File): Promise<Blob> => {
  const text = await file.text();
  const cleanXml = sanitizeHtml(text);
  return new Blob([cleanXml], { type: 'image/svg+xml' });
};

/**
 * Extracts width and height for image assets
 */
export const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve) => {
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    if (file.type === 'application/pdf' || ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'].includes(ext)) {
      resolve({ width: 0, height: 0 });
      return;
    }

    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.naturalWidth || img.width, height: img.naturalHeight || img.height });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({ width: 0, height: 0 });
    };
    img.src = url;
  });
};
