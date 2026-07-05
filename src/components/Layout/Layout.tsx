import logoImg from '../../assets/ican.png'; // Thay thế đuôi file tương ứng (.svg, .png)
import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { User, LogOut, Menu, X } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import styles from './Layout.module.css';

export const Layout: React.FC = () => {
  const { user, logout } = useAppStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [lang, setLang] = useState<'VI' | 'EN'>('VI');

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'VI' ? 'EN' : 'VI'));
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <nav className={styles.navContainer}>
          {/* Logo */}
          <a href="/" className={styles.logo} onClick={closeMenu}>
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
                GIỚI THIỆU
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/curriculum"
                className={({ isActive }) =>
                  isActive ? `${styles.navLink} ${styles.activeNavLink}` : styles.navLink
                }
              >
                CHƯƠNG TRÌNH HỌC
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/news"
                className={({ isActive }) =>
                  isActive ? `${styles.navLink} ${styles.activeNavLink}` : styles.navLink
                }
              >
                TIN TỨC - SỰ KIỆN
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/faq"
                className={({ isActive }) =>
                  isActive ? `${styles.navLink} ${styles.activeNavLink}` : styles.navLink
                }
              >
                HỎI ĐÁP
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/careers"
                className={({ isActive }) =>
                  isActive ? `${styles.navLink} ${styles.activeNavLink}` : styles.navLink
                }
              >
                TUYỂN DỤNG
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  isActive ? `${styles.navLink} ${styles.activeNavLink}` : styles.navLink
                }
              >
                LIÊN HỆ
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
                  <span className={styles.userName}>Chào, {user.name}</span>
                  <button onClick={logout} className={styles.logoutBtn} title="Đăng xuất">
                    <LogOut size={14} />
                  </button>
                </div>
              )}
            </div>

            {/* Language Toggle Button */}
            <button
              onClick={toggleLanguage}
              className={styles.langToggleCircleBtn}
              title={lang === 'VI' ? 'Switch to English' : 'Chuyển sang Tiếng Việt'}
            >
              {lang === 'VI' ? (
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
              GIỚI THIỆU
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
              CHƯƠNG TRÌNH HỌC
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
              TIN TỨC - SỰ KIỆN
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
              HỎI ĐÁP
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
              TUYỂN DỤNG
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
              LIÊN HỆ
            </NavLink>
          </li>
          {user && (
            <li className={styles.mobileUserSection}>
              <div className={styles.userBadge}>
                <User size={14} />
                <span>Chào, {user.name}</span>
              </div>
              <button
                onClick={() => {
                  logout();
                  closeMenu();
                }}
                className="btn-secondary"
                style={{ width: '100%', marginTop: '1rem', justifyContent: 'center' }}
              >
                <LogOut size={14} /> Đăng xuất
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
        <div className={styles.footerContent}>
          <div className={styles.footerLinks}>
            <NavLink to="/about" className={styles.footerLink} onClick={closeMenu}>
              GIỚI THIỆU
            </NavLink>
            <NavLink to="/curriculum" className={styles.footerLink} onClick={closeMenu}>
              CHƯƠNG TRÌNH HỌC
            </NavLink>
            <NavLink to="/news" className={styles.footerLink} onClick={closeMenu}>
              TIN TỨC - SỰ KIỆN
            </NavLink>
            <NavLink to="/faq" className={styles.footerLink} onClick={closeMenu}>
              HỎI ĐÁP
            </NavLink>
            <NavLink to="/careers" className={styles.footerLink} onClick={closeMenu}>
              TUYỂN DỤNG
            </NavLink>
            <NavLink to="/contact" className={styles.footerLink} onClick={closeMenu}>
              LIÊN HỆ
            </NavLink>
          </div>
          <p style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            THIEUNAM iCAM © {new Date().getFullYear()}
          </p>
        </div>
      </footer>

      {/* Floating Contact Shortcut Widget */}
      <div className={styles.floatingContactWidget}>
        {/* Zalo Shortcut */}
        <a
          href="https://zalo.me/0909090909"
          target="_blank"
          rel="noopener noreferrer"
          className={`${styles.contactShortcutBtn} ${styles.zaloBtn}`}
          data-tooltip="Chat Zalo"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="36" height="36">
            <text x="50" y="62" fontFamily="'Plus Jakarta Sans', Arial, sans-serif" fontWeight="900" fontSize="28" fill="#FFFFFF" textAnchor="middle">Zalo</text>
          </svg>
        </a>

        {/* Messenger Shortcut */}
        <a
          href="https://m.me/icam"
          target="_blank"
          rel="noopener noreferrer"
          className={`${styles.contactShortcutBtn} ${styles.messengerBtn}`}
          data-tooltip="Chat Messenger"
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

        {/* Gmail Shortcut */}
        <a
          href="mailto:info@icam.edu.vn"
          className={`${styles.contactShortcutBtn} ${styles.gmailBtn}`}
          data-tooltip="Gửi Email"
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
