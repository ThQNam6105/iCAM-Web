import { mediaRepository } from './mediaRepository';
import {
  validateMediaFile,
  calculateFileHash,
  sanitizeSvgContent,
  getImageDimensions,
} from './mediaUploadService';
import type { MediaItem, MediaFilter, MediaUsage, MediaFolder, EntityType } from '../../types/media';

export interface UploadOptions {
  tags?: string[];
  folderId?: string | null;
  defaultAltVi?: string;
  defaultAltEn?: string;
  defaultCaption?: string;
  isPrivate?: boolean;
  onProgress?: (progress: number) => void;
  forceUploadDuplicate?: boolean;
}

export interface UploadResult {
  success: boolean;
  asset?: MediaItem;
  isDuplicate?: boolean;
  existingAsset?: MediaItem;
  error?: string;
}

export class MediaService {
  /**
   * Fetch all folders
   */
  async getFolders(): Promise<MediaFolder[]> {
    return mediaRepository.getFolders();
  }

  /**
   * Create a new folder
   */
  async createFolder(name: string, color?: string, parentId?: string | null): Promise<MediaFolder> {
    return mediaRepository.createFolder(name, color, parentId);
  }

  /**
   * Rename a folder
   */
  async renameFolder(id: string, newName: string, newColor?: string): Promise<MediaFolder> {
    return mediaRepository.renameFolder(id, newName, newColor);
  }

  /**
   * Delete a folder
   */
  async deleteFolder(id: string): Promise<void> {
    return mediaRepository.deleteFolder(id);
  }

  /**
   * Move items to a folder
   */
  async moveItemsToFolder(itemIds: string[], folderId: string | null): Promise<void> {
    return mediaRepository.moveItemsToFolder(itemIds, folderId);
  }

  /**
   * Main Upload Flow: Validate -> Hash -> Check Duplicate -> Sanitize SVG -> Dimensions -> Store -> Save Metadata
   */
  async uploadMedia(file: File, options: UploadOptions = {}): Promise<UploadResult> {
    // 0. Strict Folder Requirement Check
    if (!options.folderId) {
      return {
        success: false,
        error: 'Tệp truyền thông chỉ được phép tải lên bên trong một Thư mục cụ thể! Vui lòng chọn hoặc tạo một Thư mục trước khi tải tệp.',
      };
    }

    // 1. Validation
    const valResult = await validateMediaFile(file);
    if (!valResult.valid) {
      return { success: false, error: valResult.error };
    }

    options.onProgress?.(15);

    // 2. SHA-256 Hashing & Deduplication
    const contentHash = await calculateFileHash(file);
    options.onProgress?.(35);

    if (!options.forceUploadDuplicate) {
      const existingAsset = await mediaRepository.findByContentHash(contentHash);
      if (existingAsset) {
        return {
          success: false,
          isDuplicate: true,
          existingAsset,
          error: 'Tệp này đã tồn tại trong Thư viện Media!',
        };
      }
    }

    // 3. SVG Sanitization or File processing
    let uploadFileBlob: Blob = file;
    if (valResult.isSvg) {
      uploadFileBlob = await sanitizeSvgContent(file);
    }
    options.onProgress?.(50);

    // 4. Dimensions Extraction
    const dimensions = await getImageDimensions(file);
    options.onProgress?.(65);

    // 5. Storage Upload
    const { storagePath, publicUrl } = await mediaRepository.uploadFileToStorage(
      uploadFileBlob,
      file.name,
      options.isPrivate || false
    );
    options.onProgress?.(85);

    // 6. DB Record Creation
    const now = new Date().toISOString();
    const mediaRecord: MediaItem = {
      id: `media_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      original_filename: file.name,
      storage_path: storagePath,
      public_url: publicUrl,
      mime_type: file.type || 'application/octet-stream',
      file_size: file.size,
      width: dimensions.width,
      height: dimensions.height,
      content_hash: contentHash,
      status: 'active',
      is_private: options.isPrivate || false,
      is_animated: valResult.isAnimatedGif || false,
      default_alt_vi: options.defaultAltVi || file.name.replace(/\.[^/.]+$/, ''),
      default_alt_en: options.defaultAltEn || file.name.replace(/\.[^/.]+$/, ''),
      default_caption: options.defaultCaption || '',
      focal_x: 0.5,
      focal_y: 0.5,
      tags: options.tags || ['uncategorized'],
      folder_id: options.folderId || null,
      created_at: now,
      updated_at: now,
    };

    const savedAsset = await mediaRepository.saveMediaRecord(mediaRecord);
    options.onProgress?.(100);

    return {
      success: true,
      asset: savedAsset,
    };
  }

  /**
   * Fetch filtered & paginated DAM media items
   */
  async getMediaItems(filter: MediaFilter = {}): Promise<{ items: MediaItem[]; total: number }> {
    return mediaRepository.getMediaItems(filter);
  }

  /**
   * Update asset metadata (Alt texts, Caption, Focal Point, Tags, Folder)
   */
  async updateMediaMetadata(id: string, updates: Partial<MediaItem>): Promise<MediaItem> {
    const { items } = await mediaRepository.getMediaItems({ limit: 1000, usageStatus: 'all' });
    const item = items.find((i) => i.id === id);

    if (!item) {
      throw new Error(`Media asset with ID ${id} not found.`);
    }

    const updatedItem: MediaItem = {
      ...item,
      ...updates,
      updated_at: new Date().toISOString(),
    };

    return mediaRepository.saveMediaRecord(updatedItem);
  }

  /**
   * Save cropped/edited variant of an image asset
   */
  async saveEditedVariant(
    _originalAssetId: string,
    blob: Blob,
    filename: string,
    focalX = 0.5,
    focalY = 0.5
  ): Promise<MediaItem> {
    const file = new File([blob], filename, { type: blob.type });
    const result = await this.uploadMedia(file, {
      forceUploadDuplicate: true,
      defaultCaption: `Bản đã cắt cúp từ ${filename}`,
    });

    if (result.success && result.asset) {
      await this.updateMediaMetadata(result.asset.id, {
        focal_x: focalX,
        focal_y: focalY,
      });
      return result.asset;
    }

    throw new Error(result.error || 'Lỗi khi lưu bản chỉnh sửa hình ảnh.');
  }

  /**
   * Fetch usages for safe deletion check
   */
  async getMediaUsages(id: string): Promise<MediaUsage[]> {
    return mediaRepository.getMediaUsages(id);
  }

  /**
   * Register usage in a module
   */
  async registerUsage(
    mediaId: string,
    entityType: EntityType,
    entityId: string,
    entityTitle: string,
    altVi?: string,
    altEn?: string,
    caption?: string,
    focalX?: number,
    focalY?: number
  ): Promise<MediaUsage> {
    return mediaRepository.registerUsage(
      mediaId,
      entityType,
      entityId,
      entityTitle,
      altVi,
      altEn,
      caption,
      focalX,
      focalY
    );
  }

  /**
   * Unregister usage
   */
  async unregisterUsage(mediaId: string, entityType: EntityType, entityId: string): Promise<void> {
    return mediaRepository.unregisterUsage(mediaId, entityType, entityId);
  }

  /**
   * Archive media asset
   */
  async archiveMediaItem(id: string): Promise<void> {
    return mediaRepository.archiveMediaItem(id);
  }

  /**
   * Hard Delete with Usage Protection
   */
  async deleteMediaItem(id: string): Promise<{ success: boolean; error?: string }> {
    return mediaRepository.hardDeleteMediaItem(id);
  }
}

export const mediaService = new MediaService();
