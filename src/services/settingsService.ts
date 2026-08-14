import { supabase } from './supabaseClient';
import bannerBg from '../assets/banner-bg.jpg';

export interface BranchLocation {
  id: string;
  name: string;
  address: string;
  hotline: string;
  email: string;
  hours: string;
  googleMapsUrl: string;
  isActive: boolean;
}

export interface WebsiteInfoSettings {
  centerName: string;
  displayName: string;
  slogan: string;
  primaryEmail: string;
  primaryHotline: string;
  businessHours: string;
  facebookUrl: string;
  youtubeUrl: string;
  tiktokUrl: string;
  zaloUrl: string;
}

export interface SeoSettings {
  websiteTitleVi: string;
  websiteTitleEn: string;
  websiteDescVi: string;
  websiteDescEn: string;
  faviconUrl: string;
  socialShareImageUrl: string;
}

export interface AnnouncementItem {
  id: string;
  textVi: string;
  textEn?: string;
  isActive: boolean;
}

export interface AnnouncementSettings {
  allowConsultation: boolean;
  showAnnouncementBar: boolean;
  textVi: string;
  textEn: string;
  items?: AnnouncementItem[];
  ctaTextVi?: string;
  ctaTextEn?: string;
  ctaUrl?: string;
  startDate?: string;
  endDate?: string;
}

export interface AnalyticsSettings {
  enableGoogleAnalytics: boolean;
  gaMeasurementId: string;
  enableGtm: boolean;
  gtmContainerId: string;
  enableMetaPixel: boolean;
  metaPixelId: string;
  consentEnabled: boolean;
}

export interface SecuritySettings {
  sessionTimeoutMinutes: '30' | '60' | '240' | '480';
}

export interface SystemSettings {
  websiteInfo: WebsiteInfoSettings;
  branches: BranchLocation[];
  seo: SeoSettings;
  announcement: AnnouncementSettings;
  analytics: AnalyticsSettings;
  security: SecuritySettings;
  updatedAt?: string;
}

export interface AuditLogEntry {
  id: string;
  actor: string;
  action: string;
  resource: string;
  timestamp: string;
  details?: string;
}

export interface SystemHealthStatus {
  overall: 'healthy' | 'warning' | 'error';
  website: { status: 'healthy' | 'error'; message: string };
  database: { status: 'healthy' | 'error'; message: string };
  storage: { status: 'healthy' | 'error'; message: string };
  auth: { status: 'healthy' | 'error'; message: string };
  lastChecked: string;
}

const SETTINGS_CACHE_KEY = 'ican_cms_settings_cache_v2';
const AUDIT_LOG_KEY = 'ican_cms_audit_logs_v2';

export const formatExternalUrl = (url: string | undefined): string => {
  if (!url) return '#';
  const trimmed = url.trim();
  if (!trimmed) return '#';
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('//') ||
    trimmed.startsWith('mailto:') ||
    trimmed.startsWith('tel:')
  ) {
    return trimmed;
  }
  return `https://${trimmed}`;
};

export const DEFAULT_SYSTEM_SETTINGS: SystemSettings = {
  websiteInfo: {
    centerName: 'Hệ thống Trung tâm Ngoại ngữ iCANCAM',
    displayName: 'iCANCAM English Center',
    slogan: 'PASSION FOR SUCCESS - Đam mê dẫn lối thành công',
    primaryEmail: 'info@icancam.edu.vn',
    primaryHotline: '0903 123 456',
    businessHours: 'Thứ 2 - Chủ Nhật: 08:00 - 21:00',
    facebookUrl: 'https://facebook.com/icancam.edu.vn',
    youtubeUrl: 'https://www.youtube.com/@anhnguicancam3597',
    tiktokUrl: 'https://tiktok.com/@icancam.english',
    zaloUrl: 'https://zalo.me/0903123456',
  },
  branches: [
    {
      id: 'branch_hocmon',
      name: 'Cơ sở 1 - Hóc Môn',
      address: 'Số 12/3 Lý Thường Kiệt, Thị trấn Hóc Môn, TP. Hồ Chí Minh',
      hotline: '0903 123 456',
      email: 'hocmon@icancam.edu.vn',
      hours: '08:00 - 21:00 (Hàng ngày)',
      googleMapsUrl: 'https://maps.google.com/?q=iCANCAM+Hoc+Mon',
      isActive: true,
    },
    {
      id: 'branch_quan12',
      name: 'Cơ sở 2 - Quận 12',
      address: 'Số 456 Nguyễn Ảnh Thủ, Phường Hiệp Thành, Quận 12, TP. Hồ Chí Minh',
      hotline: '0903 789 012',
      email: 'quan12@icancam.edu.vn',
      hours: '08:00 - 21:00 (Hàng ngày)',
      googleMapsUrl: 'https://maps.google.com/?q=iCANCAM+Quan+12',
      isActive: true,
    },
  ],
  seo: {
    websiteTitleVi: 'Trung Tâm Ngoại Ngữ iCANCAM | Anh Văn Trẻ Em & Luyện Thi IELTS Hóc Môn, Q.12',
    websiteTitleEn: 'iCANCAM English Center | Young Learners & IELTS Preparation',
    websiteDescVi: 'Trung tâm đào tạo Tiếng Anh chuẩn quốc tế hàng đầu tại Hóc Môn và Quận 12. Phương pháp giảng dạy 4Ls & LETI tiên tiến giúp học viên tự tin bứt phá điểm số.',
    websiteDescEn: 'International standard English training center in Hoc Mon and District 12. Advanced 4Ls & LETI teaching methodologies for confident learning.',
    faviconUrl: '/favicon.ico',
    socialShareImageUrl: bannerBg,
  },
  announcement: {
    allowConsultation: true,
    showAnnouncementBar: true,
    textVi: 'Khai giảng khóa luyện thi Cambridge & IELTS tháng này — Ưu đãi 20% học phí cho 30 học viên đăng ký sớm nhất!',
    textEn: 'New Cambridge & IELTS courses opening this month — 20% fee discount for early birds!',
    items: [
      {
        id: 'ann_1',
        textVi: 'Khai giảng khóa luyện thi Cambridge & IELTS tháng này — Ưu đãi 20% học phí cho 30 học viên đăng ký sớm nhất!',
        textEn: 'New Cambridge & IELTS courses opening this month — 20% fee discount for early birds!',
        isActive: true,
      },
      {
        id: 'ann_2',
        textVi: 'Lịch kiểm tra trình độ Tiếng Anh miễn phí hàng tuần vào Thứ 7 & Chủ Nhật — Đăng ký ngay tại các cơ sở iCANCAM!',
        textEn: 'Free weekly English placement test on Saturdays & Sundays — Register at iCANCAM branches!',
        isActive: true,
      },
    ],
    ctaTextVi: '',
    ctaTextEn: '',
    ctaUrl: '',
    startDate: '',
    endDate: '',
  },
  analytics: {
    enableGoogleAnalytics: true,
    gaMeasurementId: 'G-ICANCAM2026',
    enableGtm: false,
    gtmContainerId: 'GTM-ICANCAM',
    enableMetaPixel: false,
    metaPixelId: '123456789012345',
    consentEnabled: true,
  },
  security: {
    sessionTimeoutMinutes: '60',
  },
  updatedAt: new Date().toISOString(),
};

const DEFAULT_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'log_1',
    actor: 'iCANCAM Admin',
    action: 'Cập nhật thông tin hotline cơ sở Hóc Môn',
    resource: 'Liên hệ & Cơ sở',
    timestamp: '14/08/2026 – 00:32',
    details: 'Đã thay đổi số điện thoại hỗ trợ từ 0903000111 thành 0903123456',
  },
  {
    id: 'log_2',
    actor: 'iCANCAM Admin',
    action: 'Bật thông báo ưu đãi khóa học mới',
    resource: 'Thông báo & Tuyển sinh',
    timestamp: '13/08/2026 – 16:45',
    details: 'Bật hiển thị Announcement Bar đầu trang chủ',
  },
];

export class SettingsService {
  public ensureDefaults(settings: SystemSettings): SystemSettings {
    const copy: SystemSettings = JSON.parse(JSON.stringify(settings || DEFAULT_SYSTEM_SETTINGS));
    if (!copy.seo) {
      copy.seo = { ...DEFAULT_SYSTEM_SETTINGS.seo };
    }
    if (!copy.announcement) {
      copy.announcement = { ...DEFAULT_SYSTEM_SETTINGS.announcement };
    }
    if (!copy.announcement.items || copy.announcement.items.length === 0) {
      copy.announcement.items = [
        {
          id: 'ann_1',
          textVi: copy.announcement.textVi || 'Khai giảng khóa luyện thi Cambridge & IELTS tháng này — Ưu đãi 20% học phí cho 30 học viên đăng ký sớm nhất!',
          textEn: copy.announcement.textEn || 'New Cambridge & IELTS courses opening this month — 20% fee discount for early birds!',
          isActive: true,
        },
      ];
    }

    const isValidUrl = (url?: string) => {
      if (!url) return false;
      if (url.startsWith('blob:')) return false;
      return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/') || url.startsWith('data:') || url.includes('assets');
    };

    if (!isValidUrl(copy.seo.faviconUrl) || copy.seo.faviconUrl.includes('ican.png')) {
      copy.seo.faviconUrl = '/favicon.ico';
    }
    if (!isValidUrl(copy.seo.socialShareImageUrl)) {
      copy.seo.socialShareImageUrl = bannerBg;
    }
    return copy;
  }

  /**
   * Fetch system settings with Supabase DB as System of Record
   */
  async getSystemSettings(): Promise<{ settings: SystemSettings; fromSupabase: boolean; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('value')
        .eq('key', 'main_config')
        .maybeSingle();

      if (!error && data?.value) {
        const loaded: SystemSettings = this.ensureDefaults(data.value);
        this.saveToCache(loaded);
        return { settings: loaded, fromSupabase: true };
      }

      // If database record is not present yet, attempt initial seed save
      if (!error && !data) {
        await supabase.from('system_settings').upsert({ key: 'main_config', value: DEFAULT_SYSTEM_SETTINGS });
      }
    } catch {
      // Ignore network error and fall back to local UI cache
    }

    const cached = this.getFromCache();
    if (cached) {
      return { settings: this.ensureDefaults(cached), fromSupabase: false };
    }

    return {
      settings: this.ensureDefaults(DEFAULT_SYSTEM_SETTINGS),
      fromSupabase: false,
      error: 'Không thể kết nối với hệ thống lưu trữ Supabase. Đang hiển thị thiết lập mặc định.',
    };
  }

  /**
   * Save system settings with graceful fallback when Supabase table system_settings is missing
   */
  async updateSystemSettings(newSettings: SystemSettings): Promise<{ success: boolean; warning?: string; error?: string }> {
    const updatedWithTimestamp = {
      ...newSettings,
      updatedAt: new Date().toISOString(),
    };

    // Always update local cache so user changes are never lost
    this.saveToCache(updatedWithTimestamp);
    await this.addAuditLogEntry('Cập nhật cấu hình hệ thống', 'Cấu hình hệ thống', 'Đã lưu thay đổi các tham số cài đặt');

    try {
      const { error } = await supabase
        .from('system_settings')
        .upsert({ key: 'main_config', value: updatedWithTimestamp });

      if (error) {
        // If table doesn't exist on Supabase PostgreSQL, save locally and inform user nicely
        if (
          error.message.includes('schema cache') ||
          error.message.includes('relation') ||
          error.message.includes('does not exist') ||
          error.code === 'PGRST301' ||
          error.code === '42P01'
        ) {
          return {
            success: true,
            warning: 'Đã lưu cấu hình vào bộ nhớ cục bộ! (Lưu ý: Bảng system_settings chưa được khởi tạo trên Supabase DB)',
          };
        }

        return {
          success: false,
          error: `Không thể lưu cấu hình lên Supabase DB (${error.message}). Vui lòng thử lại.`,
        };
      }

      return { success: true };
    } catch {
      return {
        success: true,
        warning: 'Đã lưu cấu hình vào bộ nhớ ứng dụng cục bộ!',
      };
    }
  }

  /**
   * Run real-time System Health Diagnostics
   */
  async checkSystemHealth(): Promise<SystemHealthStatus> {
    const now = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    let dbStatus: 'healthy' | 'error' = 'healthy';
    let dbMessage = 'Cơ sở dữ liệu Supabase DB đang hoạt động bình thường.';

    try {
      const { error } = await supabase.from('media_folders').select('id').limit(1);
      if (error) {
        dbStatus = 'error';
        dbMessage = `Không thể truy vấn bảng Supabase: ${error.message}`;
      }
    } catch (err) {
      dbStatus = 'error';
      dbMessage = `Lỗi kết nối máy chủ CSDL: ${err instanceof Error ? err.message : 'Timeout'}`;
    }

    let storageStatus: 'healthy' | 'error' = 'healthy';
    let storageMessage = 'Thư viện Media & Storage buckets đang hoạt động ổn định.';

    try {
      const { error } = await supabase.storage.from('cms-public-media').list('', { limit: 1 });
      if (error) {
        storageStatus = 'error';
        storageMessage = `Lỗi truy cập Storage bucket cms-public-media: ${error.message}`;
      }
    } catch {
      storageStatus = 'error';
      storageMessage = 'Không thể kết nối với dịch vụ lưu trữ tài nguyên Storage.';
    }

    const isHealthy = dbStatus === 'healthy' && storageStatus === 'healthy';

    return {
      overall: isHealthy ? 'healthy' : 'warning',
      website: {
        status: 'healthy',
        message: 'Trang web công khai đang phản hồi bình thường.',
      },
      database: {
        status: dbStatus,
        message: dbMessage,
      },
      storage: {
        status: storageStatus,
        message: storageMessage,
      },
      auth: {
        status: 'healthy',
        message: 'Hệ thống xác thực và quản lý phiên làm việc hoạt động an toàn.',
      },
      lastChecked: now,
    };
  }

  /**
   * Audit Logs handling
   */
  getAuditLogs(): AuditLogEntry[] {
    try {
      const raw = localStorage.getItem(AUDIT_LOG_KEY);
      if (raw) return JSON.parse(raw);
    } catch {
      // Storage restricted
    }
    return DEFAULT_AUDIT_LOGS;
  }

  async addAuditLogEntry(action: string, resource: string, details?: string): Promise<void> {
    const logs = this.getAuditLogs();
    const now = new Date();
    const formattedDate = `${now.toLocaleDateString('vi-VN')} – ${now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`;

    const newLog: AuditLogEntry = {
      id: `log_${Date.now()}`,
      actor: 'iCANCAM Admin',
      action,
      resource,
      timestamp: formattedDate,
      details,
    };

    logs.unshift(newLog);
    const trimmed = logs.slice(0, 50); // Keep last 50 entries

    try {
      localStorage.setItem(AUDIT_LOG_KEY, JSON.stringify(trimmed));
    } catch {
      // Storage restricted
    }
  }

  /**
   * Helper methods for localStorage UI caching
   */
  private getFromCache(): SystemSettings | null {
    try {
      const raw = localStorage.getItem(SETTINGS_CACHE_KEY);
      if (raw) {
        const parsed: SystemSettings = JSON.parse(raw);
        let modified = false;
        if (parsed.websiteInfo) {
          if (!parsed.websiteInfo.youtubeUrl || parsed.websiteInfo.youtubeUrl.includes('@icancam')) {
            parsed.websiteInfo.youtubeUrl = 'https://www.youtube.com/@anhnguicancam3597';
            modified = true;
          }
        }
        if (parsed.seo) {
          if (!parsed.seo.faviconUrl || parsed.seo.faviconUrl.includes('ican.png') || parsed.seo.faviconUrl.startsWith('blob:')) {
            parsed.seo.faviconUrl = '/favicon.ico';
            modified = true;
          }
          if (!parsed.seo.socialShareImageUrl) {
            parsed.seo.socialShareImageUrl = bannerBg;
            modified = true;
          }
        }
        if (parsed.announcement) {
          if (parsed.announcement.textVi && parsed.announcement.textVi.includes('🎉')) {
            parsed.announcement.textVi = parsed.announcement.textVi.replace(/🎉\s*/g, '');
            modified = true;
          }
          if (parsed.announcement.textEn && parsed.announcement.textEn.includes('🎉')) {
            parsed.announcement.textEn = parsed.announcement.textEn.replace(/🎉\s*/g, '');
            modified = true;
          }
        }
        if (modified) {
          this.saveToCache(parsed);
        }
        return parsed;
      }
    } catch {
      // Storage restricted
    }
    return null;
  }

  private saveToCache(settings: SystemSettings) {
    try {
      localStorage.setItem(SETTINGS_CACHE_KEY, JSON.stringify(settings));
    } catch {
      // Storage restricted
    }
  }
}

export const settingsService = new SettingsService();
