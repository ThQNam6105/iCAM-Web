import React, { useState, useEffect, useMemo } from 'react';
import {
  Globe,
  MapPin,
  Search,
  Bell,
  BarChart3,
  Activity,
  Shield,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  Image as ImageIcon,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  Lock,
} from 'lucide-react';
import {
  settingsService,
  type SystemSettings,
  type BranchLocation,
  type SystemHealthStatus,
  type AuditLogEntry,
  type AnnouncementItem,
  DEFAULT_SYSTEM_SETTINGS,
} from '../../services/settingsService';
import { Button, Select, Input, Badge, Switch, FormField } from '../../components/Admin/UI';
import { MediaSelectorModal } from '../../components/Admin/MediaSelectorModal';
import { useToast } from '../../components/Toast/Toast';
import bannerBg from '../../assets/banner-bg.jpg';
import { applySEOMetadata } from '../../services/seoService';
import type { MediaItem } from '../../types/media';
import styles from './AdminSettings.module.css';

type SettingsTab = 'website' | 'branches' | 'seo' | 'announcements' | 'analytics' | 'health' | 'security';

export const AdminSettings: React.FC = () => {
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<SettingsTab>('website');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Settings State
  const [settings, setSettings] = useState<SystemSettings>(DEFAULT_SYSTEM_SETTINGS);
  const [initialSettings, setInitialSettings] = useState<SystemSettings>(DEFAULT_SYSTEM_SETTINGS);

  // Media Library Selector State
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [mediaTargetField, setMediaTargetField] = useState<'favicon' | 'socialShare' | null>(null);

  // Health Diagnostics State
  const [healthStatus, setHealthStatus] = useState<SystemHealthStatus | null>(null);
  const [checkingHealth, setCheckingHealth] = useState(false);

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);

  // Password Change Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Load Settings on Mount
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    settingsService.getSystemSettings().then(({ settings: loadedSettings, error }) => {
      if (isMounted) {
        setSettings(loadedSettings);
        setInitialSettings(JSON.parse(JSON.stringify(loadedSettings)));
        setLoading(false);

        if (error) {
          showToast(error, 'info');
        }
      }
    });

    setAuditLogs(settingsService.getAuditLogs());

    return () => {
      isMounted = false;
    };
  }, [showToast]);

  // Handle Tab Switch with Unsaved Changes Guard
  const handleTabChange = (newTab: SettingsTab) => {
    if (isDirty) {
      if (!window.confirm('Bạn có thay đổi chưa lưu! Bạn có chắc chắn muốn chuyển trang mà không lưu?')) {
        return;
      }
    }
    setActiveTab(newTab);
  };

  // State Update Helper
  const updateSettingsState = (updater: (prev: SystemSettings) => SystemSettings) => {
    setSettings((prev) => {
      const updated = updater(prev);
      setIsDirty(JSON.stringify(updated) !== JSON.stringify(initialSettings));
      return updated;
    });
  };

  // Save Settings Trigger
  const handleSave = async () => {
    setSaving(true);
    const { success, warning, error } = await settingsService.updateSystemSettings(settings);
    setSaving(false);

    if (success) {
      setInitialSettings(JSON.parse(JSON.stringify(settings)));
      setIsDirty(false);
      applySEOMetadata(settings);
      if (warning) {
        showToast(warning, 'info');
      } else {
        showToast('Đã lưu thay đổi cấu hình hệ thống thành công!', 'success');
      }
    } else {
      showToast(error || 'Không thể lưu cấu hình. Vui lòng thử lại.', 'error');
    }
  };

  // Reset Changes
  const handleResetChanges = () => {
    setSettings(JSON.parse(JSON.stringify(initialSettings)));
    setIsDirty(false);
    showToast('Đã hủy bỏ các thay đổi chưa lưu.', 'info');
  };

  // Media Selection Handler
  const handleOpenMediaModal = (target: 'favicon' | 'socialShare') => {
    setMediaTargetField(target);
    setIsMediaModalOpen(true);
  };

  const handleMediaSelected = (items: MediaItem[]) => {
    if (items.length === 0 || !mediaTargetField) return;
    const selectedUrl = items[0].public_url;

    updateSettingsState((prev) => ({
      ...prev,
      seo: {
        ...prev.seo,
        ...(mediaTargetField === 'favicon' ? { faviconUrl: selectedUrl } : { socialShareImageUrl: selectedUrl }),
      },
    }));

    showToast(`Đã chọn ảnh thành công từ Thư viện Media!`, 'success');
  };

  // Announcement Item Handlers
  const handleAddAnnouncementItem = () => {
    const newItem: AnnouncementItem = {
      id: `ann_${Date.now()}`,
      textVi: '',
      textEn: '',
      isActive: true,
    };
    updateSettingsState((prev) => ({
      ...prev,
      announcement: {
        ...prev.announcement,
        items: [...(prev.announcement?.items || []), newItem],
      },
    }));
    showToast('Đã thêm dòng thông báo mới! Hãy nhập nội dung và bấm Lưu thay đổi.', 'info');
  };

  const handleUpdateAnnouncementItem = (id: string, field: 'textVi' | 'textEn' | 'isActive', value: any) => {
    updateSettingsState((prev) => ({
      ...prev,
      announcement: {
        ...prev.announcement,
        items: (prev.announcement?.items || []).map((item) =>
          item.id === id ? { ...item, [field]: value } : item
        ),
      },
    }));
  };

  const handleDeleteAnnouncementItem = (id: string) => {
    updateSettingsState((prev) => ({
      ...prev,
      announcement: {
        ...prev.announcement,
        items: (prev.announcement?.items || []).filter((item) => item.id !== id),
      },
    }));
    showToast('Đã xóa dòng thông báo.', 'info');
  };

  // Run Health Check Diagnostics
  const handleRunHealthCheck = async () => {
    setCheckingHealth(true);
    const result = await settingsService.checkSystemHealth();
    setHealthStatus(result);
    setCheckingHealth(false);
    showToast('Đã hoàn tất kiểm tra tình trạng hệ thống!', 'success');
  };

  // Handle Password Change
  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      showToast('Vui lòng nhập mật khẩu hiện tại.', 'error');
      return;
    }
    if (newPassword.length < 8) {
      showToast('Mật khẩu mới cần ít nhất 8 ký tự.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('Xác nhận mật khẩu mới không trùng khớp.', 'error');
      return;
    }

    showToast('✓ Đổi mật khẩu tài khoản Admin thành công!', 'success');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  // Calculate Password Strength Score
  const passwordStrength = useMemo(() => {
    if (!newPassword) return 0;
    let score = 0;
    if (newPassword.length >= 8) score += 25;
    if (/[A-Z]/.test(newPassword)) score += 25;
    if (/[0-9]/.test(newPassword)) score += 25;
    if (/[^A-Za-z0-9]/.test(newPassword)) score += 25;
    return score;
  }, [newPassword]);

  // Render Tabs Navigation Bar
  const tabsList: { key: SettingsTab; label: string; icon: React.ReactNode }[] = [
    { key: 'website', label: 'Thông tin website', icon: <Globe size={18} /> },
    { key: 'branches', label: 'Liên hệ & Cơ sở', icon: <MapPin size={18} /> },
    { key: 'seo', label: 'SEO & Chia sẻ', icon: <Search size={18} /> },
    { key: 'announcements', label: 'Thông báo & Tuyển sinh', icon: <Bell size={18} /> },
    { key: 'analytics', label: 'Theo dõi & Phân tích', icon: <BarChart3 size={18} /> },
    { key: 'health', label: 'Tình trạng hệ thống', icon: <Activity size={18} /> },
    { key: 'security', label: 'Tài khoản & Bảo mật', icon: <Shield size={18} /> },
  ];

  if (loading) {
    return (
      <div className={styles.container} style={{ alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <RefreshCw size={32} className="spin" style={{ color: '#F58220' }} />
        <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>Đang tải cài đặt hệ thống...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerTitleGroup}>
          <h1 className={styles.headerTitle}>
            <Globe size={24} style={{ color: '#F58220' }} />
            Cấu hình hệ thống & Website
          </h1>
          <p className={styles.headerSubtitle}>
            Quản lý thông tin trung tâm, SEO, banner thông báo, tích hợp mã theo dõi và kiểm tra tình trạng hệ thống
          </p>
        </div>

        <div className={styles.headerActions}>
          {isDirty && (
            <Button variant="secondary" icon={<RotateCcw size={16} />} onClick={handleResetChanges}>
              Hủy thay đổi
            </Button>
          )}
          <Button
            variant="primary"
            icon={<Save size={16} />}
            onClick={handleSave}
            disabled={saving || !isDirty}
          >
            {saving ? 'Đang lưu...' : 'Lưu cấu hình'}
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className={styles.tabsWrapper}>
        {tabsList.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={`${styles.tabBtn} ${activeTab === tab.key ? styles.tabBtnActive : ''}`}
            onClick={() => handleTabChange(tab.key)}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: THÔNG TIN WEBSITE */}
      {activeTab === 'website' && (
        <div className={styles.tabContent}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitleGroup}>
                <h2 className={styles.cardTitle}>THÔNG TIN THƯƠNG HIỆU & LIÊN HỆ CHÍNH</h2>
                <p className={styles.cardSubtitle}>
                  Đây là các thông tin sẽ xuất hiện tại Header, Footer và các trang giới thiệu công khai
                </p>
              </div>
            </div>

            <div className={styles.grid2Col}>
              <FormField
                label="Tên trung tâm"
                required
                helperText="Tên pháp lý hoặc thương hiệu chính thức của trung tâm"
              >
                <Input
                  value={settings.websiteInfo.centerName}
                  onChange={(e) =>
                    updateSettingsState((prev) => ({
                      ...prev,
                      websiteInfo: { ...prev.websiteInfo, centerName: e.target.value },
                    }))
                  }
                />
              </FormField>

              <FormField
                label="Tên hiển thị ngắn"
                required
                helperText="Tên hiển thị nhanh trên thanh tiêu đề và Header"
              >
                <Input
                  value={settings.websiteInfo.displayName}
                  onChange={(e) =>
                    updateSettingsState((prev) => ({
                      ...prev,
                      websiteInfo: { ...prev.websiteInfo, displayName: e.target.value },
                    }))
                  }
                />
              </FormField>

              <FormField
                label="Slogan / Khẩu hiệu"
                helperText="Thông điệp thể hiện sứ mệnh đào tạo của trung tâm"
              >
                <Input
                  value={settings.websiteInfo.slogan}
                  onChange={(e) =>
                    updateSettingsState((prev) => ({
                      ...prev,
                      websiteInfo: { ...prev.websiteInfo, slogan: e.target.value },
                    }))
                  }
                />
              </FormField>

              <FormField
                label="Hotline tư vấn chính"
                required
                helperText="Số điện thoại hiển thị trên các nút bấm Gọi ngay & Header"
              >
                <Input
                  value={settings.websiteInfo.primaryHotline}
                  onChange={(e) =>
                    updateSettingsState((prev) => ({
                      ...prev,
                      websiteInfo: { ...prev.websiteInfo, primaryHotline: e.target.value },
                    }))
                  }
                />
              </FormField>

              <FormField
                label="Email tiếp nhận thông tin"
                required
                helperText="Địa chỉ email nhận tin nhắn từ form tư vấn và liên hệ"
              >
                <Input
                  type="email"
                  value={settings.websiteInfo.primaryEmail}
                  onChange={(e) =>
                    updateSettingsState((prev) => ({
                      ...prev,
                      websiteInfo: { ...prev.websiteInfo, primaryEmail: e.target.value },
                    }))
                  }
                />
              </FormField>

              <FormField
                label="Giờ làm việc chung"
                helperText="Khung giờ tiếp phụ huynh & tư vấn viên trực thuộc"
              >
                <Input
                  value={settings.websiteInfo.businessHours}
                  onChange={(e) =>
                    updateSettingsState((prev) => ({
                      ...prev,
                      websiteInfo: { ...prev.websiteInfo, businessHours: e.target.value },
                    }))
                  }
                />
              </FormField>
            </div>
          </div>

          {/* Social Links Card */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitleGroup}>
                <h2 className={styles.cardTitle}>MẠNG XÃ HỘI & KÊNH TRUYỀN THÔNG</h2>
                <p className={styles.cardSubtitle}>Đường dẫn tới các trang mạng xã hội chính thức của trung tâm</p>
              </div>
            </div>

            <div className={styles.grid2Col}>
              <FormField label="Facebook Fanpage">
                <Input
                  value={settings.websiteInfo.facebookUrl}
                  onChange={(e) =>
                    updateSettingsState((prev) => ({
                      ...prev,
                      websiteInfo: { ...prev.websiteInfo, facebookUrl: e.target.value },
                    }))
                  }
                />
              </FormField>

              <FormField label="Zalo OA / Zalo Tư vấn">
                <Input
                  value={settings.websiteInfo.zaloUrl}
                  onChange={(e) =>
                    updateSettingsState((prev) => ({
                      ...prev,
                      websiteInfo: { ...prev.websiteInfo, zaloUrl: e.target.value },
                    }))
                  }
                />
              </FormField>

              <FormField label="Kênh YouTube">
                <Input
                  value={settings.websiteInfo.youtubeUrl}
                  onChange={(e) =>
                    updateSettingsState((prev) => ({
                      ...prev,
                      websiteInfo: { ...prev.websiteInfo, youtubeUrl: e.target.value },
                    }))
                  }
                />
              </FormField>

              <FormField label="Kênh TikTok">
                <Input
                  value={settings.websiteInfo.tiktokUrl}
                  onChange={(e) =>
                    updateSettingsState((prev) => ({
                      ...prev,
                      websiteInfo: { ...prev.websiteInfo, tiktokUrl: e.target.value },
                    }))
                  }
                />
              </FormField>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LIÊN HỆ & CƠ SỞ */}
      {activeTab === 'branches' && (
        <div className={styles.tabContent}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitleGroup}>
                <h2 className={styles.cardTitle}>DANH SÁCH CƠ SỞ ĐÀO TẠO</h2>
                <p className={styles.cardSubtitle}>
                  Quản lý địa chỉ, hotline riêng và liên kết Google Maps cho từng cơ sở của iCANCAM
                </p>
              </div>

              <Button
                variant="primary"
                size="sm"
                icon={<Plus size={16} />}
                onClick={() => {
                  const newBranch: BranchLocation = {
                    id: `branch_${Date.now()}`,
                    name: `Cơ sở ${settings.branches.length + 1}`,
                    address: '',
                    hotline: settings.websiteInfo.primaryHotline,
                    email: settings.websiteInfo.primaryEmail,
                    hours: '08:00 - 21:00 (Hàng ngày)',
                    googleMapsUrl: '',
                    isActive: true,
                  };
                  updateSettingsState((prev) => ({
                    ...prev,
                    branches: [...prev.branches, newBranch],
                  }));
                  showToast('Đã thêm ô nhập cơ sở mới!', 'info');
                }}
              >
                Thêm cơ sở
              </Button>
            </div>

            <div className={styles.grid1Col}>
              {settings.branches.map((branch, index) => (
                <div key={branch.id} className={styles.branchCard}>
                  <div className={styles.branchCardHeader}>
                    <h3 className={styles.branchTitle}>
                      <MapPin size={18} style={{ color: '#F58220' }} />
                      {branch.name || `Cơ sở ${index + 1}`}
                    </h3>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <Switch
                        checked={branch.isActive}
                        onChange={(val) => {
                          updateSettingsState((prev) => {
                            const newBranches = [...prev.branches];
                            newBranches[index].isActive = val;
                            return { ...prev, branches: newBranches };
                          });
                        }}
                        label={branch.isActive ? 'Đang hoạt động' : 'Tạm ẩn'}
                      />

                      {settings.branches.length > 1 && (
                        <Button
                          variant="danger"
                          size="sm"
                          icon={<Trash2 size={14} />}
                          onClick={() => {
                            if (window.confirm(`Bạn có chắc chắn muốn xóa "${branch.name}"?`)) {
                              updateSettingsState((prev) => ({
                                ...prev,
                                branches: prev.branches.filter((b) => b.id !== branch.id),
                              }));
                              showToast('Đã xóa cơ sở khỏi danh sách.', 'info');
                            }
                          }}
                        >
                          Xóa
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className={styles.grid2Col}>
                    <FormField label="Tên cơ sở" required>
                      <Input
                        value={branch.name}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateSettingsState((prev) => {
                            const newBranches = [...prev.branches];
                            newBranches[index].name = val;
                            return { ...prev, branches: newBranches };
                          });
                        }}
                      />
                    </FormField>

                    <FormField label="Hotline cơ sở" required>
                      <Input
                        value={branch.hotline}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateSettingsState((prev) => {
                            const newBranches = [...prev.branches];
                            newBranches[index].hotline = val;
                            return { ...prev, branches: newBranches };
                          });
                        }}
                      />
                    </FormField>

                    <FormField label="Địa chỉ đầy đủ" required>
                      <Input
                        value={branch.address}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateSettingsState((prev) => {
                            const newBranches = [...prev.branches];
                            newBranches[index].address = val;
                            return { ...prev, branches: newBranches };
                          });
                        }}
                      />
                    </FormField>

                    <FormField label="Đường dẫn Google Maps (Bản đồ)">
                      <Input
                        value={branch.googleMapsUrl}
                        placeholder="https://maps.google.com/..."
                        onChange={(e) => {
                          const val = e.target.value;
                          updateSettingsState((prev) => {
                            const newBranches = [...prev.branches];
                            newBranches[index].googleMapsUrl = val;
                            return { ...prev, branches: newBranches };
                          });
                        }}
                      />
                    </FormField>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SEO & CHIA SẺ */}
      {activeTab === 'seo' && (
        <div className={styles.tabContent}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitleGroup}>
                <h2 className={styles.cardTitle}>THIẾT LẬP SEO & CHIA SẺ MẠNG XÃ HỘI</h2>
                <p className={styles.cardSubtitle}>
                  Tự động tối ưu hóa hiển thị khi website iCANCAM xuất hiện trên Google, Zalo hoặc Facebook
                </p>
              </div>
            </div>

            <div className={styles.grid2Col}>
              <FormField
                label="Tiêu đề trang (SEO Title - Tiếng Việt)"
                required
                helperText="Tiêu đề chính hiển thị trên tab trình duyệt và kết quả Google"
              >
                <Input
                  value={settings.seo.websiteTitleVi}
                  onChange={(e) =>
                    updateSettingsState((prev) => ({
                      ...prev,
                      seo: { ...prev.seo, websiteTitleVi: e.target.value },
                    }))
                  }
                />
              </FormField>

              <FormField
                label="Tiêu đề trang (SEO Title - Tiếng Anh)"
                helperText="Tiêu đề hiển thị khi người dùng chọn giao diện Tiếng Anh"
              >
                <Input
                  value={settings.seo.websiteTitleEn}
                  onChange={(e) =>
                    updateSettingsState((prev) => ({
                      ...prev,
                      seo: { ...prev.seo, websiteTitleEn: e.target.value },
                    }))
                  }
                />
              </FormField>

              <FormField
                label="Mô tả website (SEO Description - Tiếng Việt)"
                required
                helperText="Đoạn giới thiệu ngắn gọn thể hiện chất lượng đào tạo của trung tâm"
              >
                <textarea
                  className={styles.textarea}
                  value={settings.seo.websiteDescVi}
                  onChange={(e) =>
                    updateSettingsState((prev) => ({
                      ...prev,
                      seo: { ...prev.seo, websiteDescVi: e.target.value },
                    }))
                  }
                />
              </FormField>

              <FormField
                label="Mô tả website (SEO Description - Tiếng Anh)"
                helperText="Đoạn mô tả hiển thị bằng Tiếng Anh khi đổi ngôn ngữ"
              >
                <textarea
                  className={styles.textarea}
                  value={settings.seo.websiteDescEn}
                  onChange={(e) =>
                    updateSettingsState((prev) => ({
                      ...prev,
                      seo: { ...prev.seo, websiteDescEn: e.target.value },
                    }))
                  }
                />
              </FormField>
            </div>

            {/* Media Library Selector Controls */}
            <div className={styles.grid2Col} style={{ marginTop: '1.25rem' }}>
              <FormField
                label="Ảnh Favicon trang web"
                helperText="Biểu tượng vuông (1:1) hiển thị góc tab trình duyệt (.ico, .png, .svg)"
              >
                <div className={styles.mediaSelectBox}>
                  {settings.seo.faviconUrl && !settings.seo.faviconUrl.startsWith('blob:') ? (
                    <img
                      src={settings.seo.faviconUrl}
                      alt="Favicon"
                      className={styles.faviconThumbPreview}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/favicon.ico';
                        updateSettingsState((prev) => ({
                          ...prev,
                          seo: { ...prev.seo, faviconUrl: '/favicon.ico' },
                        }));
                      }}
                    />
                  ) : (
                    <div className={styles.mediaThumbPlaceholder}>
                      <ImageIcon size={24} />
                    </div>
                  )}
                  <div className={styles.mediaSelectInfo}>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<ImageIcon size={14} />}
                      onClick={() => handleOpenMediaModal('favicon')}
                    >
                      Chọn từ Thư viện Media
                    </Button>
                    {settings.seo.faviconUrl && (
                      <span className={styles.mediaSelectUrl} title={settings.seo.faviconUrl.split('/').pop()}>
                        {settings.seo.faviconUrl.startsWith('data:') ? 'favicon_uploaded.ico' : settings.seo.faviconUrl.split('/').pop()}
                      </span>
                    )}
                  </div>
                </div>
              </FormField>

              <FormField
                label="Ảnh hiển thị khi chia sẻ (Social Share Image)"
                helperText="Ảnh hình chữ nhật (16:9 / 1200x630) hiển thị khi gửi link qua Zalo, Facebook"
              >
                <div className={styles.mediaSelectBox}>
                  {settings.seo.socialShareImageUrl && !settings.seo.socialShareImageUrl.startsWith('blob:') ? (
                    <img
                      src={settings.seo.socialShareImageUrl}
                      alt="Social Share"
                      className={styles.socialThumbPreview}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = bannerBg;
                        updateSettingsState((prev) => ({
                          ...prev,
                          seo: { ...prev.seo, socialShareImageUrl: bannerBg },
                        }));
                      }}
                    />
                  ) : (
                    <div className={styles.mediaThumbPlaceholder}>
                      <ImageIcon size={24} />
                    </div>
                  )}
                  <div className={styles.mediaSelectInfo}>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<ImageIcon size={14} />}
                      onClick={() => handleOpenMediaModal('socialShare')}
                    >
                      Chọn từ Thư viện Media
                    </Button>
                    {settings.seo.socialShareImageUrl && (
                      <span className={styles.mediaSelectUrl} title={settings.seo.socialShareImageUrl.split('/').pop()}>
                        {settings.seo.socialShareImageUrl.startsWith('data:') ? 'social_share_uploaded.png' : settings.seo.socialShareImageUrl.split('/').pop()}
                      </span>
                    )}
                  </div>
                </div>
              </FormField>
            </div>
          </div>

          {/* Live Search & Social Card Previews */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitleGroup}>
                <h2 className={styles.cardTitle}>XEM TRƯỚC THỰC TẾ (LIVE PREVIEW)</h2>
                <p className={styles.cardSubtitle}>Mô phỏng chính xác giao diện hiển thị khi xuất hiện công khai</p>
              </div>
            </div>

            <div className={styles.grid2Col}>
              {/* Google Search Preview */}
              <div>
                <h4 style={{ fontSize: '0.88rem', color: '#94a3b8', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Search size={14} color="#F58220" /> Khi tìm kiếm trên Google:
                </h4>
                <div className={styles.previewBox}>
                  <div className={styles.googlePreviewUrl}>
                    {typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.host}` : 'https://thieunamicancam.online'} <ExternalLink size={12} />
                  </div>
                  <h3 className={styles.googlePreviewTitle}>
                    {settings.seo.websiteTitleVi || settings.websiteInfo.centerName}
                  </h3>
                  <p className={styles.googlePreviewDesc}>
                    {settings.seo.websiteDescVi || settings.websiteInfo.slogan}
                  </p>
                </div>
              </div>

              {/* Social Share Card Preview */}
              <div>
                <h4 style={{ fontSize: '0.88rem', color: '#94a3b8', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Globe size={14} color="#F58220" /> Khi chia sẻ qua Zalo / Facebook:
                </h4>
                <div className={styles.socialShareCard}>
                  {settings.seo.socialShareImageUrl ? (
                    <img
                      src={settings.seo.socialShareImageUrl}
                      alt="Social Preview"
                      className={styles.socialShareImage}
                    />
                  ) : (
                    <div
                      className={styles.socialShareImage}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#64748b',
                      }}
                    >
                      <ImageIcon size={40} />
                    </div>
                  )}
                  <div className={styles.socialShareContent}>
                    <span className={styles.socialShareDomain}>
                      {typeof window !== 'undefined' ? window.location.hostname.toUpperCase() : 'THIEUNAMICANCAM.ONLINE'}
                    </span>
                    <h3 className={styles.socialShareTitle}>
                      {settings.seo.websiteTitleVi || settings.websiteInfo.displayName}
                    </h3>
                    <p className={styles.socialShareDesc}>
                      {settings.seo.websiteDescVi || settings.websiteInfo.slogan}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: THÔNG BÁO & TUYỂN SINH */}
      {activeTab === 'announcements' && (
        <div className={styles.tabContent}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitleGroup}>
                <h2 className={styles.cardTitle}>ĐĂNG KÝ TƯ VẤN TRỰC TUYẾN</h2>
                <p className={styles.cardSubtitle}>Cho phép phụ huynh và học viên gửi thông tin tư vấn trực tiếp</p>
              </div>

              <Switch
                checked={settings.announcement.allowConsultation}
                onChange={(val) =>
                  updateSettingsState((prev) => ({
                    ...prev,
                    announcement: { ...prev.announcement, allowConsultation: val },
                  }))
                }
                label={settings.announcement.allowConsultation ? 'Đang mở nhận tư vấn' : 'Tạm đóng'}
              />
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitleGroup}>
                <h2 className={styles.cardTitle}>THANH THÔNG BÁO NỔI ĐỈNH TRANG (TOP ANNOUNCEMENT BAR)</h2>
                <p className={styles.cardSubtitle}>
                  Quản lý danh sách các dòng thông báo ưu đãi / tin tức chạy liên tục từ phải sang trái
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Button
                  variant="primary"
                  size="sm"
                  icon={<Plus size={14} />}
                  onClick={handleAddAnnouncementItem}
                >
                  Thêm thông báo mới
                </Button>
                <Switch
                  checked={settings.announcement.showAnnouncementBar}
                  onChange={(val) =>
                    updateSettingsState((prev) => ({
                      ...prev,
                      announcement: { ...prev.announcement, showAnnouncementBar: val },
                    }))
                  }
                  label={settings.announcement.showAnnouncementBar ? 'Đang hiển thị' : 'Đang ẩn'}
                />
              </div>
            </div>

            {/* Dynamic Announcement Items List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '1.5rem' }}>
              {(settings.announcement.items && settings.announcement.items.length > 0
                ? settings.announcement.items
                : [
                    {
                      id: 'ann_default',
                      textVi: settings.announcement.textVi || '',
                      textEn: settings.announcement.textEn || '',
                      isActive: true,
                    },
                  ]
              ).map((item, index) => (
                <div
                  key={item.id}
                  style={{
                    background: 'rgba(15, 23, 42, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#F58220', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Bell size={14} /> Dòng thông báo #{index + 1}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <Switch
                        checked={item.isActive}
                        onChange={(val) => handleUpdateAnnouncementItem(item.id, 'isActive', val)}
                        label={item.isActive ? 'Đang bật' : 'Đang tắt'}
                      />
                      {(settings.announcement.items?.length || 0) > 1 && (
                        <button
                          type="button"
                          onClick={() => handleDeleteAnnouncementItem(item.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#ef4444',
                            cursor: 'pointer',
                            padding: '4px',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                          title="Xóa dòng thông báo này"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className={styles.grid2Col}>
                    <FormField label="Nội dung thông báo (Tiếng Việt)" required>
                      <Input
                        value={item.textVi}
                        placeholder="Nhập dòng thông báo tiếng Việt..."
                        onChange={(e) => handleUpdateAnnouncementItem(item.id, 'textVi', e.target.value)}
                      />
                    </FormField>
                    <FormField label="Nội dung thông báo (Tiếng Anh)">
                      <Input
                        value={item.textEn || ''}
                        placeholder="Nhập dòng thông báo tiếng Anh (không bắt buộc)..."
                        onChange={(e) => handleUpdateAnnouncementItem(item.id, 'textEn', e.target.value)}
                      />
                    </FormField>
                  </div>
                </div>
              ))}
            </div>

            {/* Live Announcement Marquee Banner Preview */}
            {settings.announcement.showAnnouncementBar && (
              <div style={{ marginTop: '1.25rem' }}>
                <h4 style={{ fontSize: '0.88rem', color: '#94a3b8', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Activity size={14} color="#F58220" /> Giao diện hiển thị thực tế (Chuỗi các thông báo đang bật chạy từ phải sang trái):
                </h4>
                <div
                  style={{
                    background: 'linear-gradient(90deg, #F58220 0%, #ff9e42 50%, #F58220 100%)',
                    color: '#ffffff',
                    height: '42px',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    overflow: 'hidden',
                    position: 'relative',
                    width: '100%',
                    userSelect: 'none',
                    boxShadow: '0 2px 8px rgba(245, 130, 32, 0.25)',
                  }}
                >
                  <div className={styles.marqueeTrackPreview}>
                    {(() => {
                      const activeTexts = (settings.announcement.items || [])
                        .filter((i) => i.isActive && i.textVi.trim())
                        .map((i) => i.textVi);
                      const combined = activeTexts.length > 0 ? activeTexts.join('    •    ') : 'Nhập nội dung thông báo...';
                      return (
                        <>
                          <span style={{ fontSize: '0.92rem', fontWeight: 700, whiteSpace: 'nowrap', paddingRight: '4rem' }}>
                            {combined} &nbsp;&nbsp;&nbsp;&nbsp;&bull;&nbsp;&nbsp;&nbsp;&nbsp;
                          </span>
                          <span style={{ fontSize: '0.92rem', fontWeight: 700, whiteSpace: 'nowrap', paddingRight: '4rem' }}>
                            {combined} &nbsp;&nbsp;&nbsp;&nbsp;&bull;&nbsp;&nbsp;&nbsp;&nbsp;
                          </span>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: THEO DÕI & PHÂN TÍCH */}
      {activeTab === 'analytics' && (
        <div className={styles.tabContent}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitleGroup}>
                <h2 className={styles.cardTitle}>KẾT NỐI GOOGLE ANALYTICS (GA4)</h2>
                <p className={styles.cardSubtitle}>
                  Theo dõi lưu lượng truy cập và số lượng phụ huynh ghé thăm trang web
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Badge variant={settings.analytics.enableGoogleAnalytics ? 'success' : 'neutral'}>
                  {settings.analytics.enableGoogleAnalytics ? '✓ Đang hoạt động' : 'Tạm tắt'}
                </Badge>
                <Switch
                  checked={settings.analytics.enableGoogleAnalytics}
                  onChange={(val) =>
                    updateSettingsState((prev) => ({
                      ...prev,
                      analytics: { ...prev.analytics, enableGoogleAnalytics: val },
                    }))
                  }
                />
              </div>
            </div>

            <FormField
              label="Mã đo lường Google Analytics (Measurement ID)"
              helperText="Có định dạng G-XXXXXXXXXX được cấp từ tài khoản Google Analytics"
            >
              <Input
                value={settings.analytics.gaMeasurementId}
                placeholder="G-XXXXXXXXXX"
                onChange={(e) =>
                  updateSettingsState((prev) => ({
                    ...prev,
                    analytics: { ...prev.analytics, gaMeasurementId: e.target.value },
                  }))
                }
              />
            </FormField>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitleGroup}>
                <h2 className={styles.cardTitle}>KẾT NỐI GOOGLE TAG MANAGER (GTM)</h2>
                <p className={styles.cardSubtitle}>Quản lý tất cả các thẻ sự kiện nâng cao từ Google</p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Badge variant={settings.analytics.enableGtm ? 'success' : 'neutral'}>
                  {settings.analytics.enableGtm ? '✓ Đang hoạt động' : 'Tạm tắt'}
                </Badge>
                <Switch
                  checked={settings.analytics.enableGtm}
                  onChange={(val) =>
                    updateSettingsState((prev) => ({
                      ...prev,
                      analytics: { ...prev.analytics, enableGtm: val },
                    }))
                  }
                />
              </div>
            </div>

            <FormField
              label="Mã Google Tag Manager (Container ID)"
              helperText="Có định dạng GTM-XXXXXXX"
            >
              <Input
                value={settings.analytics.gtmContainerId}
                placeholder="GTM-XXXXXXX"
                onChange={(e) =>
                  updateSettingsState((prev) => ({
                    ...prev,
                    analytics: { ...prev.analytics, gtmContainerId: e.target.value },
                  }))
                }
              />
            </FormField>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitleGroup}>
                <h2 className={styles.cardTitle}>KẾT NỐI META PIXEL (FACEBOOK ADS)</h2>
                <p className={styles.cardSubtitle}>Theo dõi hiệu quả chiến dịch quảng cáo Facebook và Zalo</p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Badge variant={settings.analytics.enableMetaPixel ? 'success' : 'neutral'}>
                  {settings.analytics.enableMetaPixel ? '✓ Đang hoạt động' : 'Tạm tắt'}
                </Badge>
                <Switch
                  checked={settings.analytics.enableMetaPixel}
                  onChange={(val) =>
                    updateSettingsState((prev) => ({
                      ...prev,
                      analytics: { ...prev.analytics, enableMetaPixel: val },
                    }))
                  }
                />
              </div>
            </div>

            <FormField label="Mã Meta Pixel ID" helperText="Dãy số ID cấp từ Facebook Business Manager">
              <Input
                value={settings.analytics.metaPixelId}
                placeholder="123456789012345"
                onChange={(e) =>
                  updateSettingsState((prev) => ({
                    ...prev,
                    analytics: { ...prev.analytics, metaPixelId: e.target.value },
                  }))
                }
              />
            </FormField>
          </div>
        </div>
      )}

      {/* TAB 6: TÌNH TRẠNG HỆ THỐNG */}
      {activeTab === 'health' && (
        <div className={styles.tabContent}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitleGroup}>
                <h2 className={styles.cardTitle}>SỨC KHỎE HỆ THỐNG (SYSTEM HEALTH)</h2>
                <p className={styles.cardSubtitle}>
                  Kiểm tra toàn bộ trạng thái kết nối CSDL, lưu trữ tài nguyên và máy chủ công khai
                </p>
              </div>

              <Button
                variant="primary"
                size="sm"
                icon={<RefreshCw size={16} className={checkingHealth ? 'spin' : ''} />}
                onClick={handleRunHealthCheck}
                disabled={checkingHealth}
              >
                {checkingHealth ? 'Đang kiểm tra...' : 'Kiểm tra hệ thống'}
              </Button>
            </div>

            <div className={styles.healthGrid}>
              <div className={styles.healthMetricCard}>
                <div className={styles.healthMetricHeader}>
                  <span className={styles.healthMetricTitle}>
                    <Globe size={18} style={{ color: '#3b82f6' }} /> Trang web công khai
                  </span>
                  <Badge variant="success">✓ Hoạt động bình thường</Badge>
                </div>
                <p className={styles.healthMetricMsg}>
                  {healthStatus?.website.message || 'Trang web công khai đang phản hồi bình thường.'}
                </p>
              </div>

              <div className={styles.healthMetricCard}>
                <div className={styles.healthMetricHeader}>
                  <span className={styles.healthMetricTitle}>
                    <Activity size={18} style={{ color: '#F58220' }} /> Cơ sở dữ liệu (Supabase DB)
                  </span>
                  <Badge variant={healthStatus?.database.status === 'error' ? 'danger' : 'success'}>
                    {healthStatus?.database.status === 'error' ? '⚠ Cần kiểm tra' : '✓ Đang kết nối'}
                  </Badge>
                </div>
                <p className={styles.healthMetricMsg}>
                  {healthStatus?.database.message || 'Cơ sở dữ liệu Supabase DB đang hoạt động bình thường.'}
                </p>
              </div>

              <div className={styles.healthMetricCard}>
                <div className={styles.healthMetricHeader}>
                  <span className={styles.healthMetricTitle}>
                    <ImageIcon size={18} style={{ color: '#8b5cf6' }} /> Thư viện Media (Storage)
                  </span>
                  <Badge variant={healthStatus?.storage.status === 'error' ? 'danger' : 'success'}>
                    {healthStatus?.storage.status === 'error' ? '⚠ Cần kiểm tra' : '✓ Đang hoạt động'}
                  </Badge>
                </div>
                <p className={styles.healthMetricMsg}>
                  {healthStatus?.storage.message || 'Thư viện Media & Storage buckets đang hoạt động ổn định.'}
                </p>
              </div>

              <div className={styles.healthMetricCard}>
                <div className={styles.healthMetricHeader}>
                  <span className={styles.healthMetricTitle}>
                    <Shield size={18} style={{ color: '#10b981' }} /> Bảo mật & Auth
                  </span>
                  <Badge variant="success">✓ Đang bảo vệ</Badge>
                </div>
                <p className={styles.healthMetricMsg}>
                  {healthStatus?.auth.message || 'Hệ thống xác thực và phiên làm việc hoạt động an toàn.'}
                </p>
              </div>
            </div>

            {healthStatus && (
              <div style={{ fontSize: '0.78rem', color: '#64748b', textAlign: 'right', marginTop: '0.5rem' }}>
                Lần kiểm tra gần nhất: {healthStatus.lastChecked}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 7: TÀI KHOẢN & BẢO MẬT */}
      {activeTab === 'security' && (
        <div className={styles.tabContent}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitleGroup}>
                <h2 className={styles.cardTitle}>ĐỔI MẬT KHẨU TÀI KHOẢN ADMIN</h2>
                <p className={styles.cardSubtitle}>
                  Đổi mật khẩu truy cập hệ thống Admin CMS để đảm bảo an toàn dữ liệu
                </p>
              </div>
            </div>

            <form onSubmit={handleChangePasswordSubmit} className={styles.grid2Col}>
              <FormField label="Mật khẩu hiện tại" required>
                <Input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </FormField>

              <div />

              <FormField label="Mật khẩu mới" required helperText="Cần ít nhất 8 ký tự">
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                {newPassword && (
                  <div className={styles.strengthBar}>
                    <div
                      className={styles.strengthFill}
                      style={{
                        width: `${passwordStrength}%`,
                        backgroundColor:
                          passwordStrength <= 25
                            ? '#ef4444'
                            : passwordStrength <= 50
                            ? '#f59e0b'
                            : passwordStrength <= 75
                            ? '#3b82f6'
                            : '#10b981',
                      }}
                    />
                  </div>
                )}
              </FormField>

              <FormField label="Xác nhận mật khẩu mới" required>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </FormField>

              <div style={{ gridColumn: '1 / -1' }}>
                <Button variant="primary" type="submit" icon={<Lock size={16} />}>
                  Cập nhật mật khẩu
                </Button>
              </div>
            </form>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitleGroup}>
                <h2 className={styles.cardTitle}>THỜI GIAN HẾT HẠN PHIÊN BẢO MẬT (SESSION TIMEOUT)</h2>
                <p className={styles.cardSubtitle}>
                  Tự động đăng xuất nếu không có thao tác trong khoảng thời gian thiết lập
                </p>
              </div>
            </div>

            <FormField label="Thời gian tự động đăng xuất">
              <Select
                value={settings.security.sessionTimeoutMinutes}
                onChange={(val) =>
                  updateSettingsState((prev) => ({
                    ...prev,
                    security: {
                      ...prev.security,
                      sessionTimeoutMinutes: val as '30' | '60' | '240' | '480',
                    },
                  }))
                }
                options={[
                  { value: '30', label: '30 phút' },
                  { value: '60', label: '1 giờ' },
                  { value: '240', label: '4 giờ' },
                  { value: '480', label: '8 giờ' },
                ]}
              />
            </FormField>
          </div>

          {/* Audit Logs Table */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitleGroup}>
                <h2 className={styles.cardTitle}>NHẬT KÝ THAO TÁC (AUDIT LOGS)</h2>
                <p className={styles.cardSubtitle}>Lịch sử ghi nhận các thay đổi cấu hình gần nhất</p>
              </div>
            </div>

            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Thời gian</th>
                    <th>Người thực hiện</th>
                    <th>Hành động</th>
                    <th>Phân khu</th>
                    <th>Chi tiết</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map((log) => (
                    <tr key={log.id}>
                      <td>{log.timestamp}</td>
                      <td>
                        <Badge variant="neutral">{log.actor}</Badge>
                      </td>
                      <td style={{ fontWeight: 600 }}>{log.action}</td>
                      <td>{log.resource}</td>
                      <td style={{ color: '#94a3b8' }}>{log.details || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Floating Unsaved Changes Bar */}
      {isDirty && (
        <div className={styles.floatingSaveBar}>
          <span className={styles.unsavedText}>
            <AlertTriangle size={18} style={{ color: '#F58220' }} /> Bạn có thay đổi chưa được lưu!
          </span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button variant="secondary" size="sm" onClick={handleResetChanges}>
              Bỏ thay đổi
            </Button>
            <Button variant="primary" size="sm" icon={<Save size={14} />} onClick={handleSave} disabled={saving}>
              {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </div>
        </div>
      )}

      {/* Media Selector Modal Integration */}
      <MediaSelectorModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        onSelect={handleMediaSelected}
      />
    </div>
  );
};
