import logoImg from '../../assets/ican.png';
import footerLogo from '../../assets/footer-logo.jpg';
import React, { useState, useEffect } from 'react';
import { NavLink, Link, Outlet, useLocation } from 'react-router-dom';
import { User, LogOut, Menu, X, ChevronUp, MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useLanguage } from '../../contexts/LanguageContext';
import { settingsService, type SystemSettings, DEFAULT_SYSTEM_SETTINGS } from '../../services/settingsService';
import styles from './Layout.module.css';
import { ProjectInfoBadge } from '../ProjectInfoBadge/ProjectInfoBadge';

export const Layout: React.FC = () => {
  const { user, logout } = useAppStore();
  const { language, toggleLanguage, t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [settings, setSettings] = useState<SystemSettings>(DEFAULT_SYSTEM_SETTINGS);
  const { pathname } = useLocation();

  useEffect(() => {
    let isMounted = true;
    settingsService.getSystemSettings().then(({ settings: loadedSettings }) => {
      if (isMounted) {
        setSettings(loadedSettings);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  React.useLayoutEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 0);

    return () => clearTimeout(timer);
  }, [pathname]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const base = import.meta.env.BASE_URL;
  const homepageUrl = base.endsWith('/') ? base : `${base}/`;

  const activeBranchAddress =
    settings.branches.find((b) => b.isActive)?.address ||
    settings.branches[0]?.address ||
    '344 A Tổ 13 KP 1, Trung Mỹ Tây, Hóc Môn & Quận 12, TP.HCM';

  return (
    <div className={styles.layout}>
      {/* Fixed Internship Project Info Badge */}
      <ProjectInfoBadge />

      {/* Top Announcement Bar from System Settings */}
      {settings.announcement.showAnnouncementBar && (
        <div className={styles.topAnnouncementBar}>
          <span>
            {language === 'en'
              ? settings.announcement.textEn || settings.announcement.textVi
              : settings.announcement.textVi}
          </span>
          {settings.announcement.ctaTextVi && (
            <Link to={settings.announcement.ctaUrl || '/contact'} className={styles.topAnnouncementCta}>
              {language === 'en'
                ? settings.announcement.ctaTextEn || settings.announcement.ctaTextVi
                : settings.announcement.ctaTextVi}
            </Link>
          )}
        </div>
      )}

      <header className={styles.header}>
        <nav className={styles.navContainer}>
          {/* Logo */}
          <a href={homepageUrl} className={styles.logo} onClick={closeMenu}>
            <img
              src={logoImg}
              alt="Logo iCAM"
              style={{ height: '64px', width: 'auto', display: 'block' }}
            />
          </a>

          {/* Desktop Navigation Links */}
          <ul className={styles.navLinks}>
            <li>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  isActive ? `${styles.navLink} ${styles.activeNavLink}` : styles.navLink
                }
              >
                {t.nav.about}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/curriculum"
                className={({ isActive }) =>
                  isActive ? `${styles.navLink} ${styles.activeNavLink}` : styles.navLink
                }
              >
                {t.nav.curriculum}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/news"
                className={({ isActive }) =>
                  isActive ? `${styles.navLink} ${styles.activeNavLink}` : styles.navLink
                }
              >
                {t.nav.news}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/faq"
                className={({ isActive }) =>
                  isActive ? `${styles.navLink} ${styles.activeNavLink}` : styles.navLink
                }
              >
                {t.nav.faq}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/careers"
                className={({ isActive }) =>
                  isActive ? `${styles.navLink} ${styles.activeNavLink}` : styles.navLink
                }
              >
                {t.nav.careers}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  isActive ? `${styles.navLink} ${styles.activeNavLink}` : styles.navLink
                }
              >
                {t.nav.contact}
              </NavLink>
            </li>
          </ul>

          {/* Header Right Group */}
          <div className={styles.headerRight}>
            {/* Desktop Actions */}
            <div className={styles.navActions}>
              {user && (
                <div className={styles.userBadge}>
                  <User size={14} />
                  <span className={styles.userName}>{t.nav.welcome}, {user.name}</span>
                  <button onClick={logout} className={styles.logoutBtn} title={t.nav.logout}>
                    <LogOut size={14} />
                  </button>
                </div>
              )}
            </div>

            {/* Language Toggle Button with Flag Icons */}
            <button
              onClick={toggleLanguage}
              className={styles.langToggleCircleBtn}
              title={language === 'vi' ? 'Switch to English' : 'Chuyển sang Tiếng Việt'}
              aria-label={language === 'vi' ? 'Switch to English' : 'Chuyển sang Tiếng Việt'}
            >
              {language === 'vi' ? (
                /* Vietnam Flag */
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20" className={styles.flagSvg} preserveAspectRatio="xMidYMid slice">
                  <rect width="30" height="20" fill="#da251d"/>
                  <polygon points="15,4 16.2,8.2 20.6,8.2 17.1,10.8 18.4,15 15,12.4 11.6,15 12.9,10.8 9.4,8.2 13.8,8.2" fill="#ffff00"/>
                </svg>
              ) : (
                /* UK Flag */
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 30" className={styles.flagSvg} preserveAspectRatio="xMidYMid slice">
                  <rect width="50" height="30" fill="#012169"/>
                  <path d="M0,0 L50,30 M50,0 L0,30" stroke="#fff" strokeWidth="6"/>
                  <path d="M0,0 L50,30 M50,0 L0,30" stroke="#c8102e" strokeWidth="4"/>
                  <path d="M25,0 v30 M0,15 h50" stroke="#fff" strokeWidth="10"/>
                  <path d="M25,0 v30 M0,15 h50" stroke="#c8102e" strokeWidth="6"/>
                </svg>
              )}
            </button>

            {/* Hamburger Button for Mobile */}
            <button className={styles.hamburger} onClick={toggleMenu} aria-label="Toggle Menu">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer Navigation */}
      <div className={`${styles.mobileDrawer} ${isMenuOpen ? styles.mobileDrawerOpen : ''}`}>
        <ul className={styles.mobileNavLinks}>
          <li>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive
                  ? `${styles.mobileNavLink} ${styles.activeMobileNavLink}`
                  : styles.mobileNavLink
              }
              onClick={closeMenu}
            >
              {t.nav.about}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/curriculum"
              className={({ isActive }) =>
                isActive
                  ? `${styles.mobileNavLink} ${styles.activeMobileNavLink}`
                  : styles.mobileNavLink
              }
              onClick={closeMenu}
            >
              {t.nav.curriculum}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/news"
              className={({ isActive }) =>
                isActive
                  ? `${styles.mobileNavLink} ${styles.activeMobileNavLink}`
                  : styles.mobileNavLink
              }
              onClick={closeMenu}
            >
              {t.nav.news}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/faq"
              className={({ isActive }) =>
                isActive
                  ? `${styles.mobileNavLink} ${styles.activeMobileNavLink}`
                  : styles.mobileNavLink
              }
              onClick={closeMenu}
            >
              {t.nav.faq}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/careers"
              className={({ isActive }) =>
                isActive
                  ? `${styles.mobileNavLink} ${styles.activeMobileNavLink}`
                  : styles.mobileNavLink
              }
              onClick={closeMenu}
            >
              {t.nav.careers}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                isActive
                  ? `${styles.mobileNavLink} ${styles.activeMobileNavLink}`
                  : styles.mobileNavLink
              }
              onClick={closeMenu}
            >
              {t.nav.contact}
            </NavLink>
          </li>

          {user && (
            <li className={styles.mobileUserItem}>
              <div className={styles.mobileUserInfo}>
                <User size={16} />
                <span>{user.name}</span>
              </div>
              <button onClick={logout} className={styles.mobileLogoutBtn}>
                <LogOut size={16} />
                <span>{t.nav.logout}</span>
              </button>
            </li>
          )}
        </ul>
      </div>

      {/* Backdrop overlay when mobile menu is open */}
      {isMenuOpen && <div className={styles.backdrop} onClick={closeMenu} />}

      <main className={styles.main}>
        <Outlet />
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          {/* Main Footer Row */}
          <div className={styles.footerMainRow}>
            {/* LEFT SECTION */}
            <div className={styles.footerLeftSection}>
              {/* Logo */}
              <NavLink to="/" className={styles.footerLogoLink} onClick={closeMenu}>
                <img src={footerLogo} alt="iCANCAM Logo" className={styles.footerLogoImg} />
              </NavLink>

              {/* Slogan */}
              <p className={styles.footerSlogan}>{settings.websiteInfo.slogan || 'PASSION FOR SUCCESS'}</p>

              {/* Company Description */}
              <p className={styles.footerDescription}>
                {language === 'en'
                  ? 'Empowering learners through practical English education and independent learning for the 21st century.'
                  : 'Truyền cảm hứng học tập qua giáo dục Tiếng Anh thực tiễn và phát triển năng lực tự học độc lập cho thế kỷ 21.'}
              </p>

              {/* Company Information with Brand Orange Icons */}
              <div className={styles.footerCompanyInfo}>
                <div className={styles.infoItem}>
                  <MapPin className={styles.infoIcon} size={18} />
                  <span>{activeBranchAddress}</span>
                </div>
                <div className={styles.infoItem}>
                  <Phone className={styles.infoIcon} size={18} />
                  <span>{settings.websiteInfo.primaryHotline || '0903 123 456'}</span>
                </div>
                <div className={styles.infoItem}>
                  <Mail className={styles.infoIcon} size={18} />
                  <span>{settings.websiteInfo.primaryEmail || 'info@icancam.edu.vn'}</span>
                </div>
                <div className={styles.infoItem}>
                  <Clock className={styles.infoIcon} size={18} />
                  <div className={styles.hoursText}>
                    <span style={{ fontWeight: 600 }}>
                      {language === 'en' ? 'Monday – Sunday' : 'Thứ 2 – Chủ Nhật'}
                    </span>
                    <span className={styles.hoursDetail}>
                      {settings.websiteInfo.businessHours || '08:00 – 21:00'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Social Media Row (Dynamic Clickable External Links) */}
              <div className={styles.socialRow}>
                <a
                  href={settings.websiteInfo.facebookUrl || 'https://facebook.com/icancam.edu.vn'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialIconBtn}
                  aria-label="Facebook"
                  data-tooltip="Facebook"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a
                  href={settings.websiteInfo.youtubeUrl || 'https://youtube.com/@icancam'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialIconBtn}
                  aria-label="YouTube"
                  data-tooltip="YouTube"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
                <a
                  href={settings.websiteInfo.tiktokUrl || 'https://tiktok.com/@icancam.english'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialIconBtn}
                  aria-label="TikTok"
                  data-tooltip="TikTok"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-5.2-1.74 2.89 2.89 0 0 1 2.31-1.37V9.11a6.34 6.34 0 1 0 6.34 6.34V9.67a8.16 8.16 0 0 0 4.77 1.52V7.74a4.85 4.85 0 0 1-1-1.05z"/>
                  </svg>
                </a>
                <a
                  href={settings.websiteInfo.zaloUrl || 'https://zalo.me/0903123456'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialIconBtn}
                  aria-label="Zalo OA"
                  data-tooltip="Zalo OA"
                >
                  <span style={{ fontWeight: 800, fontSize: '11px', letterSpacing: '-0.5px' }}>Zalo</span>
                </a>
              </div>
            </div>

            {/* RIGHT SECTION */}
            <div className={styles.footerRightSection}>
              {/* Quick Links Block */}
              <div className={styles.quickLinksBlock}>
                <h4 className={styles.footerColTitle}>
                  {language === 'en' ? 'Quick Links' : 'Liên Kết Nhanh'}
                </h4>
                <div className={styles.footerNavGrid}>
                  <NavLink to="/about" className={styles.footerLink} onClick={closeMenu}>
                    {t.nav.about}
                  </NavLink>
                  <NavLink to="/curriculum" className={styles.footerLink} onClick={closeMenu}>
                    {t.nav.curriculum}
                  </NavLink>
                  <NavLink to="/news" className={styles.footerLink} onClick={closeMenu}>
                    {t.nav.news}
                  </NavLink>
                  <NavLink to="/faq" className={styles.footerLink} onClick={closeMenu}>
                    {t.nav.faq}
                  </NavLink>
                  <NavLink to="/careers" className={styles.footerLink} onClick={closeMenu}>
                    {t.nav.careers}
                  </NavLink>
                  <NavLink to="/contact" className={styles.footerLink} onClick={closeMenu}>
                    {t.nav.contact}
                  </NavLink>
                </div>
              </div>

              {/* Call to Action Card */}
              <div className={styles.ctaCard}>
                <p className={styles.ctaText}>
                  {language === 'en'
                    ? 'Ready to start your English journey?'
                    : 'Sẵn sàng bắt đầu hành trình Tiếng Anh?'}
                </p>
                <Link to="/contact" className={styles.ctaBtn} onClick={closeMenu}>
                  {language === 'en' ? 'Book Free Assessment' : 'Đánh Giá Miễn Phí'}
                </Link>
              </div>
            </div>
          </div>

          {/* BOTTOM BAR */}
          <div className={styles.footerBottomBar}>
            <div className={styles.bottomCopyright}>
              © 2026 iCANCAM Language School.{' '}
              {language === 'en' ? 'Designed by ' : 'Thiết kế bởi '}
              <a
                href="https://www.facebook.com/tqnam6105"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.designerCreditLink}
              >
                THIEUNAM
              </a>.
            </div>
            <div className={styles.bottomLegalLinks}>
              <Link to="/contact" className={styles.legalLink} onClick={closeMenu}>
                {language === 'en' ? 'Privacy Policy' : 'Chính sách bảo mật'}
              </Link>
              <span className={styles.legalSeparator}>|</span>
              <Link to="/contact" className={styles.legalLink} onClick={closeMenu}>
                {language === 'en' ? 'Terms of Service' : 'Điều khoản dịch vụ'}
              </Link>
              <span className={styles.legalSeparator}>|</span>
              <Link to="/contact" className={styles.legalLink} onClick={closeMenu}>
                {language === 'en' ? 'Cookie Policy' : 'Chính sách cookie'}
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Contact Shortcut Widget */}
      <div className={styles.floatingContactWidget}>
        {/* Scroll To Top Button (Only visible on scroll down) */}
        {showScrollTop && (
          <button
            type="button"
            onClick={scrollToTop}
            className={`${styles.contactShortcutBtn} ${styles.scrollTopBtn}`}
            data-tooltip={t.shortcuts.scrollTop}
            aria-label="Back to Top"
          >
            <ChevronUp size={28} color="#ffffff" strokeWidth={2.8} />
          </button>
        )}

        {/* Zalo Shortcut */}
        <a
          href={settings.websiteInfo.zaloUrl || 'https://zalo.me/0903123456'}
          target="_blank"
          rel="noopener noreferrer"
          className={`${styles.contactShortcutBtn} ${styles.zaloBtn}`}
          data-tooltip={t.shortcuts.zalo}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="36" height="36">
            <text x="50" y="62" fontFamily="'Plus Jakarta Sans', Arial, sans-serif" fontWeight="900" fontSize="28" fill="#FFFFFF" textAnchor="middle">Zalo</text>
          </svg>
        </a>

        {/* Messenger Shortcut */}
        <a
          href={settings.websiteInfo.facebookUrl || 'https://facebook.com/icancam.edu.vn'}
          target="_blank"
          rel="noopener noreferrer"
          className={`${styles.contactShortcutBtn} ${styles.messengerBtn}`}
          data-tooltip={t.shortcuts.messenger}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" height="30">
            <defs>
              <linearGradient id="messengerGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0066ff"/>
                <stop offset="50%" stopColor="#a100ff"/>
                <stop offset="100%" stopColor="#ff007f"/>
              </linearGradient>
            </defs>
            <path fill="url(#messengerGradient)" d="M12 2C6.36 2 2 6.13 2 11.5c0 2.9 1.25 5.5 3.25 7.37V22l3.03-1.66c1.17.32 2.42.5 3.72.5 5.64 0 10-4.13 10-9.5S17.64 2 12 2zm1.22 12.04l-2.42-2.58-4.73 2.58 5.2-5.52 2.47 2.58 4.68-2.58-5.2 5.52z"/>
          </svg>
        </a>

        {/* Gmail / Primary Email Shortcut */}
        <a
          href={`mailto:${settings.websiteInfo.primaryEmail || 'info@icancam.edu.vn'}`}
          className={`${styles.contactShortcutBtn} ${styles.gmailBtn}`}
          data-tooltip={t.shortcuts.email}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="#ffffff" fill="none" strokeWidth="2" />
            <polyline points="22,6 12,13 2,6" stroke="#ffffff" strokeWidth="2" />
          </svg>
        </a>
      </div>

      {/* SVG Gradient definition */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--primary))" />
          <stop offset="100%" stopColor="hsl(var(--accent))" />
        </linearGradient>
      </svg>
    </div>
  );
};

export default Layout;
