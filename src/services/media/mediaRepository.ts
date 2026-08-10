import { supabase } from '../supabaseClient';
import type { MediaItem, MediaUsage, MediaFilter, EntityType } from '../../types/media';

const PUBLIC_BUCKET = 'cms-public-media';
const PRIVATE_BUCKET = 'cms-private-media';
const LOCAL_STORAGE_KEY = 'ican_cms_media_items_v2';
const LOCAL_USAGE_KEY = 'ican_cms_media_usages_v2';

// In-memory / Persistence fallback for initial table bootstrap
const getStoredItems = (): MediaItem[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // Ignore
  }
  return DEFAULT_INITIAL_MEDIA;
};

const saveStoredItems = (items: MediaItem[]) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Ignore
  }
};

const getStoredUsages = (): MediaUsage[] => {
  try {
    const raw = localStorage.getItem(LOCAL_USAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // Ignore
  }
  return DEFAULT_INITIAL_USAGES;
};

const saveStoredUsages = (usages: MediaUsage[]) => {
  try {
    localStorage.setItem(LOCAL_USAGE_KEY, JSON.stringify(usages));
  } catch {
    // Ignore
  }
};

export class MediaRepository {
  /**
   * Search for an existing asset by SHA-256 content hash (Deduplication)
   */
  async findByContentHash(hash: string): Promise<MediaItem | null> {
    try {
      const { data, error } = await supabase
        .from('media_items')
        .select('*')
        .eq('content_hash', hash)
        .neq('status', 'archived')
        .maybeSingle();

      if (!error && data) {
        return data as MediaItem;
      }
    } catch {
      // Supabase table not created yet or offline
    }

    const items = getStoredItems();
    return items.find((item) => item.content_hash === hash && item.status !== 'archived') || null;
  }

  /**
   * Upload physical file to Supabase Storage
   */
  async uploadFileToStorage(
    file: Blob | File,
    filename: string,
    isPrivate = false
  ): Promise<{ storagePath: string; publicUrl: string }> {
    const bucket = isPrivate ? PRIVATE_BUCKET : PUBLIC_BUCKET;
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const safeName = filename.toLowerCase().replace(/[^a-z0-9._-]/g, '_');
    const storagePath = `uploads/${year}/${month}/${Date.now()}_${safeName}`;

    try {
      const { error } = await supabase.storage.from(bucket).upload(storagePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

      if (!error) {
        const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(storagePath);
        return {
          storagePath,
          publicUrl: publicUrlData.publicUrl,
        };
      }
    } catch {
      // Fallback
    }

    // Fallback URL generation
    const objectUrl = URL.createObjectURL(file instanceof File ? file : new File([file], filename));
    return {
      storagePath,
      publicUrl: objectUrl,
    };
  }

  /**
   * Save media asset metadata record to DB
   */
  async saveMediaRecord(item: MediaItem): Promise<MediaItem> {
    try {
      const { data, error } = await supabase.from('media_items').upsert(item).select().single();

      if (!error && data) {
        return data as MediaItem;
      }
    } catch {
      // Fallback
    }

    const items = getStoredItems();
    const idx = items.findIndex((i) => i.id === item.id);
    if (idx >= 0) {
      items[idx] = { ...item, updated_at: new Date().toISOString() };
    } else {
      items.unshift(item);
    }
    saveStoredItems(items);
    return item;
  }

  /**
   * Fetch media assets with filtering, debounced search, tags, and pagination
   */
  async getMediaItems(filter: MediaFilter = {}): Promise<{ items: MediaItem[]; total: number }> {
    let items = getStoredItems();

    try {
      const { data, error } = await supabase.from('media_items').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        items = data as MediaItem[];
        saveStoredItems(items);
      }
    } catch {
      // Fallback to local cache
    }

    const usages = getStoredUsages();

    // Attach current usage count
    items = items.map((item) => {
      const count = usages.filter((u) => u.media_id === item.id).length;
      return { ...item, usage_count: count };
    });

    // Apply Filter & Search
    if (filter.searchQuery) {
      const q = filter.searchQuery.toLowerCase().trim();
      items = items.filter(
        (i) =>
          i.original_filename.toLowerCase().includes(q) ||
          i.default_alt_vi?.toLowerCase().includes(q) ||
          i.default_alt_en?.toLowerCase().includes(q) ||
          i.default_caption?.toLowerCase().includes(q) ||
          i.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (filter.fileType && filter.fileType !== 'all') {
      if (filter.fileType === 'image') {
        items = items.filter((i) => i.mime_type.startsWith('image/') && !i.mime_type.includes('svg') && !i.mime_type.includes('gif'));
      } else if (filter.fileType === 'svg') {
        items = items.filter((i) => i.mime_type.includes('svg'));
      } else if (filter.fileType === 'gif') {
        items = items.filter((i) => i.mime_type.includes('gif'));
      } else if (filter.fileType === 'pdf') {
        items = items.filter((i) => i.mime_type.includes('pdf'));
      }
    }

    if (filter.categoryTag && filter.categoryTag !== 'all') {
      items = items.filter((i) => i.tags?.includes(filter.categoryTag!));
    }

    if (filter.usageStatus && filter.usageStatus !== 'all') {
      if (filter.usageStatus === 'used') {
        items = items.filter((i) => (i.usage_count || 0) > 0);
      } else if (filter.usageStatus === 'unused') {
        items = items.filter((i) => (i.usage_count || 0) === 0);
      } else if (filter.usageStatus === 'archived') {
        items = items.filter((i) => i.status === 'archived');
      }
    }

    // Default exclude archived unless filter explicitly asks for archived
    if (filter.usageStatus !== 'archived') {
      items = items.filter((i) => i.status !== 'archived');
    }

    // Sorting
    if (filter.sortBy) {
      switch (filter.sortBy) {
        case 'oldest':
          items.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
          break;
        case 'name-asc':
          items.sort((a, b) => a.original_filename.localeCompare(b.original_filename));
          break;
        case 'name-desc':
          items.sort((a, b) => b.original_filename.localeCompare(a.original_filename));
          break;
        case 'size-desc':
          items.sort((a, b) => b.file_size - a.file_size);
          break;
        case 'size-asc':
          items.sort((a, b) => a.file_size - b.file_size);
          break;
        case 'newest':
        default:
          items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          break;
      }
    }

    const total = items.length;
    const page = filter.page || 1;
    const limit = filter.limit || 24;
    const paginated = items.slice((page - 1) * limit, page * limit);

    return { items: paginated, total };
  }

  /**
   * Fetch usage details for a given media asset
   */
  async getMediaUsages(mediaId: string): Promise<MediaUsage[]> {
    const usages = getStoredUsages();
    return usages.filter((u) => u.media_id === mediaId);
  }

  /**
   * Register or update a media usage (e.g. News article referencing image)
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
    const usages = getStoredUsages();
    const existingIdx = usages.findIndex((u) => u.media_id === mediaId && u.entity_type === entityType && u.entity_id === entityId);

    const now = new Date().toISOString();
    const usageRecord: MediaUsage = {
      id: existingIdx >= 0 ? usages[existingIdx].id : `usage_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      media_id: mediaId,
      entity_type: entityType,
      entity_id: entityId,
      entity_title: entityTitle,
      alt_vi: altVi,
      alt_en: altEn,
      caption,
      focal_x: focalX,
      focal_y: focalY,
      created_at: existingIdx >= 0 ? usages[existingIdx].created_at : now,
      updated_at: now,
    };

    if (existingIdx >= 0) {
      usages[existingIdx] = usageRecord;
    } else {
      usages.push(usageRecord);
    }
    saveStoredUsages(usages);
    return usageRecord;
  }

  /**
   * Remove media usage reference
   */
  async unregisterUsage(mediaId: string, entityType: EntityType, entityId: string): Promise<void> {
    const usages = getStoredUsages();
    const filtered = usages.filter((u) => !(u.media_id === mediaId && u.entity_type === entityType && u.entity_id === entityId));
    saveStoredUsages(filtered);
  }

  /**
   * Archive media asset (Soft delete)
   */
  async archiveMediaItem(id: string): Promise<void> {
    const items = getStoredItems();
    const item = items.find((i) => i.id === id);
    if (item) {
      item.status = 'archived';
      item.updated_at = new Date().toISOString();
      await this.saveMediaRecord(item);
    }
  }

  /**
   * Hard Delete media asset if usage count is 0
   */
  async hardDeleteMediaItem(id: string): Promise<{ success: boolean; error?: string }> {
    const usages = await this.getMediaUsages(id);
    if (usages.length > 0) {
      return {
        success: false,
        error: `Không thể xóa vĩnh viễn! File này đang được sử dụng ở ${usages.length} vị trí trên website.`,
      };
    }

    const items = getStoredItems();
    const filtered = items.filter((i) => i.id !== id);
    saveStoredItems(filtered);

    try {
      await supabase.from('media_items').delete().eq('id', id);
    } catch {
      // Ignore
    }

    return { success: true };
  }
}

export const mediaRepository = new MediaRepository();

// Pre-populated default seed media assets for instant rich DAM experience
const DEFAULT_INITIAL_MEDIA: MediaItem[] = [
  {
    id: 'asset_hero_banner',
    original_filename: 'banner-bg.jpg',
    storage_path: 'uploads/2026/08/banner-bg.jpg',
    public_url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop',
    mime_type: 'image/jpeg',
    file_size: 1980000,
    width: 1920,
    height: 1080,
    content_hash: 'hash_hero_banner_001',
    status: 'active',
    default_alt_vi: 'Lớp học tiếng Anh hiện đại iCANCAM',
    default_alt_en: 'Modern English Classroom at iCANCAM',
    default_caption: 'Không gian học tập chuẩn quốc tế tại Hóc Môn & Quận 12',
    focal_x: 0.5,
    focal_y: 0.5,
    tags: ['banner', 'classroom', 'facilities'],
    created_at: '2026-08-01T10:00:00Z',
    updated_at: '2026-08-01T10:00:00Z',
    usage_count: 2,
  },
  {
    id: 'asset_teacher_sarah',
    original_filename: 'teacher_sarah.png',
    storage_path: 'uploads/2026/08/teacher_sarah.png',
    public_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop',
    mime_type: 'image/png',
    file_size: 598000,
    width: 800,
    height: 800,
    content_hash: 'hash_teacher_sarah_002',
    status: 'active',
    default_alt_vi: 'Cô Sarah Connor - Trưởng khoa Anh văn Trẻ em',
    default_alt_en: 'Ms. Sarah Connor - Head of Young Learners',
    default_caption: 'Chuyên gia đào tạo phương pháp 4Ls & LETI',
    focal_x: 0.5,
    focal_y: 0.35,
    tags: ['teachers', 'staff'],
    created_at: '2026-08-02T11:00:00Z',
    updated_at: '2026-08-02T11:00:00Z',
    usage_count: 1,
  },
  {
    id: 'asset_news_competition',
    original_filename: 'news_arena.png',
    storage_path: 'uploads/2026/08/news_arena.png',
    public_url: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800&auto=format&fit=crop',
    mime_type: 'image/png',
    file_size: 940000,
    width: 1200,
    height: 675,
    content_hash: 'hash_news_arena_003',
    status: 'active',
    default_alt_vi: 'Cuộc thi Rung Chuông Vàng Tiếng Anh 2026',
    default_alt_en: 'English Arena Competition 2026',
    default_caption: 'Học sinh iCANCAM tự tin tranh tài',
    focal_x: 0.5,
    focal_y: 0.5,
    tags: ['news', 'events', 'students'],
    created_at: '2026-08-05T09:30:00Z',
    updated_at: '2026-08-05T09:30:00Z',
    usage_count: 1,
  },
  {
    id: 'asset_pdf_brochure',
    original_filename: 'iCANCAM_Curriculum_2026.pdf',
    storage_path: 'uploads/2026/08/iCANCAM_Curriculum_2026.pdf',
    public_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    mime_type: 'application/pdf',
    file_size: 2450000,
    width: 0,
    height: 0,
    content_hash: 'hash_pdf_curriculum_004',
    status: 'active',
    default_alt_vi: 'Tài liệu Chương trình Học iCANCAM 2026',
    default_alt_en: 'iCANCAM Curriculum Brochure 2026',
    default_caption: 'Bản mềm PDF tổng quan lộ trình 4Ls + LETI',
    tags: ['courses', 'brochure'],
    created_at: '2026-08-06T14:00:00Z',
    updated_at: '2026-08-06T14:00:00Z',
    usage_count: 1,
  },
];

const DEFAULT_INITIAL_USAGES: MediaUsage[] = [
  {
    id: 'usage_1',
    media_id: 'asset_hero_banner',
    entity_type: 'homepage',
    entity_id: 'home_hero',
    entity_title: 'Trang Chủ - Banner Chính',
    created_at: '2026-08-01T10:00:00Z',
    updated_at: '2026-08-01T10:00:00Z',
  },
  {
    id: 'usage_2',
    media_id: 'asset_hero_banner',
    entity_type: 'news',
    entity_id: 'post_1',
    entity_title: 'Tin Tức: Khám phá Mô hình 4Ls',
    created_at: '2026-08-02T10:00:00Z',
    updated_at: '2026-08-02T10:00:00Z',
  },
  {
    id: 'usage_3',
    media_id: 'asset_teacher_sarah',
    entity_type: 'teachers',
    entity_id: 'teacher_sarah',
    entity_title: 'Đội Ngũ Giáo Viên - Cô Sarah',
    created_at: '2026-08-02T11:00:00Z',
    updated_at: '2026-08-02T11:00:00Z',
  },
  {
    id: 'usage_4',
    media_id: 'asset_news_competition',
    entity_type: 'news',
    entity_id: 'post_arena',
    entity_title: 'Tin Tức: Rung Chuông Vàng 2026',
    created_at: '2026-08-05T09:30:00Z',
    updated_at: '2026-08-05T09:30:00Z',
  },
  {
    id: 'usage_5',
    media_id: 'asset_pdf_brochure',
    entity_type: 'courses',
    entity_id: 'course_overview',
    entity_title: 'Chương Trình Học - Tải Brochure',
    created_at: '2026-08-06T14:00:00Z',
    updated_at: '2026-08-06T14:00:00Z',
  },
];
