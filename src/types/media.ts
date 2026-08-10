export type MediaStatus = 'active' | 'archived' | 'processing' | 'failed';
export type EntityType = 'news' | 'careers' | 'homepage' | 'courses' | 'teachers' | 'faq' | 'settings';

export interface MediaItem {
  id: string;
  original_filename: string;
  storage_path: string;
  public_url: string;
  mime_type: string;
  file_size: number;
  width: number;
  height: number;
  content_hash: string;
  status: MediaStatus;
  is_private?: boolean;
  is_animated?: boolean;
  default_alt_vi?: string;
  default_alt_en?: string;
  default_caption?: string;
  focal_x?: number; // Normalized 0.0 to 1.0
  focal_y?: number; // Normalized 0.0 to 1.0
  tags?: string[];
  created_by?: string;
  created_at: string;
  updated_at: string;
  usage_count?: number;
}

export interface MediaUsage {
  id: string;
  media_id: string;
  entity_type: EntityType;
  entity_id: string;
  entity_title: string;
  alt_vi?: string;
  alt_en?: string;
  caption?: string;
  focal_x?: number;
  focal_y?: number;
  variant?: string;
  created_at: string;
  updated_at: string;
}

export interface MediaTag {
  id: string;
  name: string;
  slug: string;
}

export interface MediaVariant {
  id: string;
  media_id: string;
  preset_name: 'thumbnail' | 'small' | 'medium' | 'large';
  width: number;
  height: number;
  public_url: string;
  storage_path: string;
}

export interface MediaFilter {
  searchQuery?: string;
  fileType?: string; // 'all' | 'image' | 'svg' | 'gif' | 'pdf'
  categoryTag?: string; // 'all' | tag name
  usageStatus?: 'all' | 'used' | 'unused' | 'archived';
  sortBy?: 'newest' | 'oldest' | 'name-asc' | 'name-desc' | 'size-desc' | 'size-asc';
  page?: number;
  limit?: number;
}

export interface UploadProgress {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'hashing' | 'duplicate_check' | 'success' | 'error';
  errorMsg?: string;
  duplicateAsset?: MediaItem;
}
