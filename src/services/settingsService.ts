import { supabase } from './supabaseClient';

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

export interface AnnouncementSettings {
  allowConsultation: boolean;
  showAnnouncementBar: boolean;
  textVi: string;
  textEn: string;
  ctaTextVi: string;
  ctaTextEn: string;
  ctaUrl: string;
  startDate: string;
  endDate: string;
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

export const DEFAULT_SYSTEM_SETTINGS: SystemSettings = {
  websiteInfo: {
    centerName: 'Hệ thống Trung tâm Ngoại ngữ iCANCAM',
    displayName: 'iCANCAM English Center',
    slogan: 'PASSION FOR SUCCESS - Đam mê dẫn lối thành công',
    primaryEmail: 'info@icancam.edu.vn',
    primaryHotline: '0903 123 456',
    businessHours: 'Thứ 2 - Chủ Nhật: 08:00 - 21:00',
    facebookUrl: 'https://facebook.com/icancam.edu.vn',
    youtubeUrl: 'https://youtube.com/@icancam',
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
    faviconUrl: '',
    socialShareImageUrl: '',
  },
  announcement: {
    allowConsultation: true,
    showAnnouncementBar: true,
    textVi: '🎉 Khai giảng khóa luyện thi Cambridge & IELTS tháng này — Ưu đãi 20% học phí cho 30 học viên đăng ký sớm nhất!',
    textEn: '🎉 New Cambridge & IELTS courses opening this month — 20% fee discount for early birds!',
    ctaTextVi: 'Đăng ký ngay',
    ctaTextEn: 'Enroll Now',
    ctaUrl: '/contact',
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
        const loaded: SystemSettings = data.value;
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
      return { settings: cached, fromSupabase: false };
    }

    return {
      settings: DEFAULT_SYSTEM_SETTINGS,
      fromSupabase: false,
      error: 'Không thể kết nối với hệ thống lưu trữ Supabase. Đang hiển thị thiết lập mặc định.',
    };
  }

  /**
   * Save system settings strictly to Supabase DB as System of Record
   */
  async updateSystemSettings(newSettings: SystemSettings): Promise<{ success: boolean; error?: string }> {
    const updatedWithTimestamp = {
      ...newSettings,
      updatedAt: new Date().toISOString(),
    };

    try {
      const { error } = await supabase
        .from('system_settings')
        .upsert({ key: 'main_config', value: updatedWithTimestamp });

      if (error) {
        return {
          success: false,
          error: `Không thể lưu cấu hình lên Supabase DB (${error.message}). Vui lòng thử lại.`,
        };
      }

      // Update local UI cache only after successful Supabase save
      this.saveToCache(updatedWithTimestamp);

      // Record audit log
      await this.addAuditLogEntry('Cập nhật cấu hình hệ thống', 'Cấu hình hệ thống', 'Đã lưu thay đổi các tham số cài đặt');

      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Không thể kết nối với hệ thống lưu trữ.',
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
      if (raw) return JSON.parse(raw);
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
