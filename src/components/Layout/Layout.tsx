import logoImg from '../../assets/ican.png';
import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { User, LogOut, Menu, X } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useLanguage } from '../../contexts/LanguageContext';
import styles from './Layout.module.css';

export const Layout: React.FC = () => {
  const { user, logout } = useAppStore();
  const { language, toggleLanguage, t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname } = useLocation();

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

  return (
    <div className={styles.layout}>
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
            <li className={styles.mobileUserSection}>
              <div className={styles.userBadge}>
                <User size={14} />
                <span>{t.nav.welcome}, {user.name}</span>
              </div>
              <button
                onClick={() => {
                  logout();
                  closeMenu();
                }}
                className="btn-secondary"
                style={{ width: '100%', marginTop: '1rem', justifyContent: 'center' }}
              >
                <LogOut size={14} /> {t.nav.logout}
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
          <p style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <a
              href="https://github.com/ThQNam6105"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseOver={(e) => (e.currentTarget.style.color = 'hsl(var(--primary))')}
              onMouseOut={(e) => (e.currentTarget.style.color = 'inherit')}
            >
              {t.footer.copyright} {new Date().getFullYear()}
            </a>
          </p>
        </div>
      </footer>

      {/* Floating Contact Shortcut Widget */}
      <div className={styles.floatingContactWidget}>
        {/* Zalo Shortcut */}
        <a
          href="http://zaloapp.com/qr/p/1eek3rblfox15"
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
          href="https://m.me/tqnam6105"
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

        {/* Gmail Shortcut */}
        <a
          href="mailto:thieunam2005@gmail.com"
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

