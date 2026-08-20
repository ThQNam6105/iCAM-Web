import { getStoredItems } from './media/mediaRepository';
import type { MediaItem } from '../types/media';
import { getAllNewsPosts } from './newsService';
import { getAllTeachers } from './teacherService';
import { getAllStudents } from './studentService';
import { getAllParents } from './parentService';
import { getAllCareers } from './careersService';
import { getAllCourses } from './courseService';
import { getAllFaqs } from './faqService';
import { settingsService } from './settingsService';

export type UsageMatchType =
  | 'media_id'
  | 'storage_path'
  | 'public_url'
  | 'normalized_url'
  | 'rich_text_html';

export type UsageVerificationState = 'IN_USE' | 'NOT_IN_USE' | 'UNKNOWN';

export interface MediaUsageLocation {
  module: string;
  moduleLabel: string;
  recordId: string;
  recordTitle: string;
  field: string;
  label: string;
  route?: string;
  matchType: UsageMatchType;
  originalReference?: string;
  normalizedReference?: string;
}

export interface MediaUsageResult {
  mediaId: string;
  usageCount: number; // MUST equal locations.length
  locations: MediaUsageLocation[];
  state: UsageVerificationState;
  error?: string;
}

export interface MediaUsageAuditDiagnostic {
  mediaId: string;
  mediaItem?: MediaItem;
  verificationState: UsageVerificationState;
  usageCount: number;
  locations: MediaUsageLocation[];
  scannedModulesCount: number;
  evaluatedAt: string;
}

/**
 * Conservative URL Normalizer
 * Allowed:
 * - Strip query parameters (?width=1200) and hash anchors (#top)
 * - Normalize domain/protocol prefixes (https://domain.com/)
 * - Normalize known storage bucket prefixes (/storage/v1/object/public/...)
 * FORBIDDEN:
 * - Removing Vite/build hashes
 * - Filename-only matching
 * - Fuzzy/partial filename matching
 */
export const normalizeUrlConservatively = (url?: string): string => {
  if (!url) return '';
  // 1. Strip query string and fragment
  let clean = url.split('?')[0].split('#')[0].trim();
  // 2. Strip protocol and domain
  clean = clean.replace(/^https?:\/\/[^\/]+/, '');
  // 3. Strip Supabase storage bucket public prefix
  clean = clean.replace(/^\/storage\/v1\/object\/public\/[^\/]+\//, '');
  clean = clean.replace(/^cms-private-media\//, '');
  clean = clean.replace(/^\/?assets\//, '');
  return clean.toLowerCase();
};

/**
 * Evaluates whether a field value references a specific MediaItem.
 * Uses 4-Tier Identity Priority:
 * 1. Direct media_id match
 * 2. Exact storage_path match
 * 3. Exact public_url match
 * 4. Conservative normalized_url match
 */
export const evaluateFieldReference = (
  mediaItem: MediaItem,
  fieldValue?: string,
  isHtml: boolean = false
): UsageMatchType | null => {
  if (!fieldValue || typeof fieldValue !== 'string') return null;

  const rawVal = fieldValue.trim();
  if (!rawVal) return null;

  // Tier 1: Direct media_id Match
  if (rawVal === mediaItem.id) {
    return 'media_id';
  }

  // Tier 2: Exact Public URL Match
  if (mediaItem.public_url && rawVal === mediaItem.public_url) {
    return 'public_url';
  }

  // Tier 3: Exact Storage Path Match
  if (mediaItem.storage_path && rawVal.includes(mediaItem.storage_path)) {
    return isHtml ? 'rich_text_html' : 'storage_path';
  }

  // Tier 4: Conservative Normalized URL Match
  const normField = normalizeUrlConservatively(rawVal);
  const normPublic = normalizeUrlConservatively(mediaItem.public_url);

  if (normField && normPublic && normField === normPublic) {
    return 'normalized_url';
  }

  // HTML Rich-Text Specific Inspection
  if (isHtml) {
    // Check data-media-id="UUID"
    if (rawVal.includes(`data-media-id="${mediaItem.id}"`)) {
      return 'media_id';
    }
    // Check normalized URL in HTML content
    if (normPublic && normPublic.length > 5 && rawVal.toLowerCase().includes(normPublic)) {
      return 'rich_text_html';
    }
  }

  // NO FILENAME-ONLY MATCHING IS EVER ALLOWED.
  return null;
};

class MediaUsageService {
  private cachedIndex: Map<string, MediaUsageResult> | null = null;

  /**
   * Invalidates the in-memory usage index so next fetch re-calculates authoritatively.
   */
  invalidateCache(): void {
    this.cachedIndex = null;
  }

  /**
   * Batch fetches all CMS records across ALL statuses and builds an in-memory MediaUsageResult index.
   */
  async getAllMediaUsages(): Promise<Map<string, MediaUsageResult>> {
    if (this.cachedIndex) {
      return this.cachedIndex;
    }

    try {
      // Batch fetch all CMS records concurrently
      const [posts, teachers, students, parents, careers, courses, faqs, settingsRes] = await Promise.all([
        Promise.resolve(getAllNewsPosts() || []),
        Promise.resolve(getAllTeachers() || []),
        Promise.resolve(getAllStudents() || []),
        Promise.resolve(getAllParents() || []),
        Promise.resolve(getAllCareers() || []),
        Promise.resolve(getAllCourses() || []),
        Promise.resolve(getAllFaqs() || []),
        settingsService.getSystemSettings().catch(() => ({ settings: null })),
      ]);

      const settings = settingsRes?.settings || null;

      const mediaItems = getStoredItems() || [];
      const index = new Map<string, MediaUsageResult>();

      for (const media of mediaItems) {
        const locations = this.resolveLocationsForMedia(media, {
          posts,
          teachers,
          students,
          parents,
          careers,
          courses,
          faqs,
          settings,
        });

        // INVARIANT: usageCount MUST equal locations.length
        const usageCount = locations.length;
        const state: UsageVerificationState = usageCount > 0 ? 'IN_USE' : 'NOT_IN_USE';

        index.set(media.id, {
          mediaId: media.id,
          usageCount,
          locations,
          state,
        });
      }

      this.cachedIndex = index;
      return index;
    } catch (err: any) {
      console.error('[MediaUsageService] Error constructing batch usage index:', err);
      return this.buildUnknownFallbackIndex();
    }
  }

  /**
   * Resolves media usage for a single media asset on-demand.
   */
  async getMediaUsage(mediaId: string): Promise<MediaUsageResult> {
    const index = await this.getAllMediaUsages();
    const result = index.get(mediaId);

    if (result) {
      return result;
    }

    // Fallback if mediaId was not in batch index
    const items = getStoredItems();
    const mediaItem = items.find((i: MediaItem) => i.id === mediaId);

    if (!mediaItem) {
      return {
        mediaId,
        usageCount: 0,
        locations: [],
        state: 'NOT_IN_USE',
      };
    }

    try {
      const [posts, teachers, students, parents, careers, courses, faqs, settingsRes] = await Promise.all([
        Promise.resolve(getAllNewsPosts() || []),
        Promise.resolve(getAllTeachers() || []),
        Promise.resolve(getAllStudents() || []),
        Promise.resolve(getAllParents() || []),
        Promise.resolve(getAllCareers() || []),
        Promise.resolve(getAllCourses() || []),
        Promise.resolve(getAllFaqs() || []),
        settingsService.getSystemSettings().catch(() => ({ settings: null })),
      ]);

      const settings = settingsRes?.settings || null;

      const locations = this.resolveLocationsForMedia(mediaItem, {
        posts,
        teachers,
        students,
        parents,
        careers,
        courses,
        faqs,
        settings,
      });

      const usageCount = locations.length;
      const state: UsageVerificationState = usageCount > 0 ? 'IN_USE' : 'NOT_IN_USE';

      return { mediaId, usageCount, locations, state };
    } catch (err: any) {
      return {
        mediaId,
        usageCount: 0,
        locations: [],
        state: 'UNKNOWN',
        error: err?.message || 'Verification failed',
      };
    }
  }

  /**
   * Fast helper: checks if media is currently in use.
   */
  async isMediaInUse(mediaId: string): Promise<{ inUse: boolean; state: UsageVerificationState; usageResult: MediaUsageResult }> {
    const usageResult = await this.getMediaUsage(mediaId);
    const inUse = usageResult.state === 'IN_USE' || usageResult.state === 'UNKNOWN';
    return { inUse, state: usageResult.state, usageResult };
  }

  /**
   * Diagnostic function for audit and debugging.
   */
  async auditMediaUsage(mediaId: string): Promise<MediaUsageAuditDiagnostic> {
    const mediaItem = getStoredItems().find((i: MediaItem) => i.id === mediaId);
    const usageResult = await this.getMediaUsage(mediaId);

    return {
      mediaId,
      mediaItem,
      verificationState: usageResult.state,
      usageCount: usageResult.usageCount,
      locations: usageResult.locations,
      scannedModulesCount: 8,
      evaluatedAt: new Date().toISOString(),
    };
  }

  /**
   * Core evaluator scanning all CMS records and distinct field locations.
   */
  private resolveLocationsForMedia(
    media: MediaItem,
    data: {
      posts: any[];
      teachers: any[];
      students: any[];
      parents: any[];
      careers: any[];
      courses: any[];
      faqs: any[];
      settings: any;
    }
  ): MediaUsageLocation[] {
    const locations: MediaUsageLocation[] = [];

    // Helper to push distinct location per (module, recordId, field)
    const addLocation = (loc: MediaUsageLocation) => {
      const exists = locations.some(
        (l) => l.module === loc.module && l.recordId === loc.recordId && l.field === loc.field
      );
      if (!exists) {
        locations.push(loc);
      }
    };

    // 1. News Posts (image, imageEn, ogImage, content, contentEn) - SCANS ALL STATUSES
    for (const p of data.posts) {
      const title = p.title || `Bài viết #${p.id}`;
      const recId = String(p.id);

      // Field 1: image (Cover Vi)
      const matchImage = evaluateFieldReference(media, p.image, false);
      if (matchImage) {
        addLocation({
          module: 'news',
          moduleLabel: 'Tin tức',
          recordId: recId,
          recordTitle: title,
          field: 'image',
          label: 'Ảnh bìa chính (Tiếng Việt)',
          route: `/admin/news?edit=${recId}`,
          matchType: matchImage,
          originalReference: p.image,
        });
      }

      // Field 2: imageEn (Cover En)
      const matchImageEn = evaluateFieldReference(media, p.imageEn, false);
      if (matchImageEn) {
        addLocation({
          module: 'news',
          moduleLabel: 'Tin tức',
          recordId: recId,
          recordTitle: title,
          field: 'imageEn',
          label: 'Ảnh bìa chính (Tiếng Anh)',
          route: `/admin/news?edit=${recId}`,
          matchType: matchImageEn,
          originalReference: p.imageEn,
        });
      }

      // Field 3: ogImage
      const matchOg = evaluateFieldReference(media, p.ogImage, false);
      if (matchOg) {
        addLocation({
          module: 'news',
          moduleLabel: 'Tin tức',
          recordId: recId,
          recordTitle: title,
          field: 'ogImage',
          label: 'Ảnh thẻ chia sẻ MXH (OG Image)',
          route: `/admin/news?edit=${recId}`,
          matchType: matchOg,
          originalReference: p.ogImage,
        });
      }

      // Field 4: content (HTML)
      const matchContent = evaluateFieldReference(media, p.content, true);
      if (matchContent) {
        addLocation({
          module: 'news',
          moduleLabel: 'Tin tức',
          recordId: recId,
          recordTitle: title,
          field: 'content',
          label: 'Ảnh trong nội dung bài viết (Tiếng Việt)',
          route: `/admin/news?edit=${recId}`,
          matchType: matchContent,
        });
      }

      // Field 5: contentEn (HTML)
      const matchContentEn = evaluateFieldReference(media, p.contentEn, true);
      if (matchContentEn) {
        addLocation({
          module: 'news',
          moduleLabel: 'Tin tức',
          recordId: recId,
          recordTitle: title,
          field: 'contentEn',
          label: 'Ảnh trong nội dung bài viết (Tiếng Anh)',
          route: `/admin/news?edit=${recId}`,
          matchType: matchContentEn,
        });
      }
    }

    // 2. Teachers (image) - SCANS ALL STATUSES
    for (const t of data.teachers) {
      const match = evaluateFieldReference(media, t.image, false);
      if (match) {
        addLocation({
          module: 'teachers',
          moduleLabel: 'Giáo viên',
          recordId: String(t.id),
          recordTitle: t.name || `Giáo viên #${t.id}`,
          field: 'image',
          label: 'Ảnh đại diện giáo viên',
          route: '/admin/teachers',
          matchType: match,
          originalReference: t.image,
        });
      }
    }

    // 3. Students (image) - SCANS ALL STATUSES
    for (const s of data.students) {
      const match = evaluateFieldReference(media, s.image, false);
      if (match) {
        addLocation({
          module: 'students',
          moduleLabel: 'Học viên',
          recordId: String(s.id),
          recordTitle: s.name || `Học viên #${s.id}`,
          field: 'image',
          label: 'Ảnh học viên vinh danh',
          route: '/admin/students',
          matchType: match,
          originalReference: s.image,
        });
      }
    }

    // 4. Parents (image) - SCANS ALL STATUSES
    for (const p of data.parents) {
      const match = evaluateFieldReference(media, p.image, false);
      if (match) {
        addLocation({
          module: 'parents',
          moduleLabel: 'Phụ huynh',
          recordId: String(p.id),
          recordTitle: p.childName ? `Phụ huynh bé ${p.childName}` : `Phụ huynh #${p.id}`,
          field: 'image',
          label: 'Ảnh phụ huynh cảm nhận',
          route: '/admin/parents',
          matchType: match,
          originalReference: p.image,
        });
      }
    }

    // 5. Careers (description, descriptionEn, requirements, requirementsEn, benefits, benefitsEn)
    for (const c of data.careers) {
      const title = c.title || `Vị trí #${c.id}`;
      const recId = String(c.id);

      const fieldsToCheck: { name: string; val?: string; label: string }[] = [
        { name: 'description', val: c.description, label: 'Mô tả vị trí tuyển dụng (Việt)' },
        { name: 'descriptionEn', val: c.descriptionEn, label: 'Mô tả vị trí tuyển dụng (Anh)' },
        { name: 'requirements', val: c.requirements, label: 'Yêu cầu công việc (Việt)' },
        { name: 'requirementsEn', val: c.requirementsEn, label: 'Yêu cầu công việc (Anh)' },
        { name: 'benefits', val: c.benefits, label: 'Quyền lợi ứng viên (Việt)' },
        { name: 'benefitsEn', val: c.benefitsEn, label: 'Quyền lợi ứng viên (Anh)' },
      ];

      for (const f of fieldsToCheck) {
        const match = evaluateFieldReference(media, f.val, true);
        if (match) {
          addLocation({
            module: 'careers',
            moduleLabel: 'Tuyển dụng',
            recordId: recId,
            recordTitle: title,
            field: f.name,
            label: f.label,
            route: '/admin/careers',
            matchType: match,
          });
        }
      }
    }

    // 6. Courses (thumbnailUrl, bannerUrl, descriptionVi, descriptionEn)
    for (const cr of data.courses) {
      const title = cr.titleVi || cr.titleEn || `Khóa học #${cr.id}`;
      const recId = String(cr.id);

      const matchThumb = evaluateFieldReference(media, cr.thumbnailUrl, false);
      if (matchThumb) {
        addLocation({
          module: 'courses',
          moduleLabel: 'Khóa học',
          recordId: recId,
          recordTitle: title,
          field: 'thumbnailUrl',
          label: 'Ảnh thu nhỏ khóa học',
          route: '/admin/courses',
          matchType: matchThumb,
          originalReference: cr.thumbnailUrl,
        });
      }

      const matchBanner = evaluateFieldReference(media, cr.bannerUrl, false);
      if (matchBanner) {
        addLocation({
          module: 'courses',
          moduleLabel: 'Khóa học',
          recordId: recId,
          recordTitle: title,
          field: 'bannerUrl',
          label: 'Ảnh banner trang khóa học',
          route: '/admin/courses',
          matchType: matchBanner,
          originalReference: cr.bannerUrl,
        });
      }

      const matchDescVi = evaluateFieldReference(media, cr.descriptionVi, true);
      if (matchDescVi) {
        addLocation({
          module: 'courses',
          moduleLabel: 'Khóa học',
          recordId: recId,
          recordTitle: title,
          field: 'descriptionVi',
          label: 'Ảnh trong mô tả khóa học (Việt)',
          route: '/admin/courses',
          matchType: matchDescVi,
        });
      }

      const matchDescEn = evaluateFieldReference(media, cr.descriptionEn, true);
      if (matchDescEn) {
        addLocation({
          module: 'courses',
          moduleLabel: 'Khóa học',
          recordId: recId,
          recordTitle: title,
          field: 'descriptionEn',
          label: 'Ảnh trong mô tả khóa học (Anh)',
          route: '/admin/courses',
          matchType: matchDescEn,
        });
      }
    }

    // 7. FAQ (answerVi, answerEn)
    for (const f of data.faqs) {
      const title = f.questionVi || `FAQ #${f.id}`;
      const recId = String(f.id);

      const matchAnsVi = evaluateFieldReference(media, f.answerVi, true);
      if (matchAnsVi) {
        addLocation({
          module: 'faq',
          moduleLabel: 'Hỏi đáp (FAQ)',
          recordId: recId,
          recordTitle: title,
          field: 'answerVi',
          label: 'Ảnh trong câu trả lời FAQ (Việt)',
          route: '/admin/settings',
          matchType: matchAnsVi,
        });
      }

      const matchAnsEn = evaluateFieldReference(media, f.answerEn, true);
      if (matchAnsEn) {
        addLocation({
          module: 'faq',
          moduleLabel: 'Hỏi đáp (FAQ)',
          recordId: recId,
          recordTitle: title,
          field: 'answerEn',
          label: 'Ảnh trong câu trả lời FAQ (Anh)',
          route: '/admin/settings',
          matchType: matchAnsEn,
        });
      }
    }

    // 8. Settings (faviconUrl, socialShareImageUrl)
    if (data.settings?.seo) {
      const seo = data.settings.seo;
      const matchFavicon = evaluateFieldReference(media, seo.faviconUrl, false);
      if (matchFavicon) {
        addLocation({
          module: 'settings',
          moduleLabel: 'Cấu hình Website',
          recordId: 'main_config_seo',
          recordTitle: 'Cấu hình SEO & Thương hiệu',
          field: 'faviconUrl',
          label: 'Biểu tượng website (Favicon)',
          route: '/admin/settings',
          matchType: matchFavicon,
          originalReference: seo.faviconUrl,
        });
      }

      const matchOgShare = evaluateFieldReference(media, seo.socialShareImageUrl, false);
      if (matchOgShare) {
        addLocation({
          module: 'settings',
          moduleLabel: 'Cấu hình Website',
          recordId: 'main_config_seo',
          recordTitle: 'Cấu hình SEO & Thương hiệu',
          field: 'socialShareImageUrl',
          label: 'Ảnh chia sẻ mạng xã hội mặc định',
          route: '/admin/settings',
          matchType: matchOgShare,
          originalReference: seo.socialShareImageUrl,
        });
      }
    }

    return locations;
  }

  private buildUnknownFallbackIndex(): Map<string, MediaUsageResult> {
    const items = getStoredItems() || [];
    const index = new Map<string, MediaUsageResult>();
    for (const media of items) {
      index.set(media.id, {
        mediaId: media.id,
        usageCount: 0,
        locations: [],
        state: 'UNKNOWN',
        error: 'Database/Network timeout occurred during verification',
      });
    }
    return index;
  }
}

export const mediaUsageService = new MediaUsageService();
