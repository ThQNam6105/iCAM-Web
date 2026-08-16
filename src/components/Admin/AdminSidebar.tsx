import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  FileText,
  FolderTree,
  Image as ImageIcon,
  BookOpen,
  HelpCircle,
  Briefcase,
  Settings,
  LogOut
} from 'lucide-react';
import footerLogo from '../../assets/footer-logo.jpg';
import { authService } from '../../services/authService';
import styles from './AdminSidebar.module.css';

export const AdminSidebar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate('/admin/login');
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brandHeader}>
        <img src={footerLogo} alt="iCANCAM Logo" className={styles.logoImg} />
        <div className={styles.brandText}>
          <span className={styles.brandTitle}>iCANCAM Portal</span>
          <span className={styles.brandSubtitle}>CMS Admin System</span>
        </div>
      </div>

      <nav className={styles.nav}>
        <span className={styles.sectionLabel}>Tổng quan</span>
        <NavLink
          to="/admin"
          end
          className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
        >
          <FileText size={18} />
          <span>Bài viết tin tức</span>
        </NavLink>

        <NavLink
          to="/admin/categories"
          className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
        >
          <FolderTree size={18} />
          <span>Danh mục tin tức</span>
        </NavLink>

        <NavLink
          to="/admin/media"
          className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
        >
          <ImageIcon size={18} />
          <span>Thư viện Media</span>
        </NavLink>

        <span className={styles.sectionLabel} style={{ marginTop: '1.25rem' }}>
          Đào tạo & tuyển sinh
        </span>

        <NavLink
          to="/admin/courses"
          className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
        >
          <BookOpen size={18} />
          <span>Quản lý khóa học</span>
        </NavLink>

        <NavLink
          to="/admin/faq"
          className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
        >
          <HelpCircle size={18} />
          <span>Hỏi đáp & Hộp thư</span>
        </NavLink>

        <NavLink
          to="/admin/careers"
          className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
        >
          <Briefcase size={18} />
          <span>Tuyển dụng</span>
        </NavLink>

        <NavLink
          to="/admin/settings"
          className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
        >
          <Settings size={18} />
          <span>Cấu hình hệ thống</span>
        </NavLink>
      </nav>

      <div className={styles.userFooter}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>A</div>
          <div className={styles.userDetails}>
            <span className={styles.userName}>Administrator</span>
            <span className={styles.userRole}>Super Admin</span>
          </div>
        </div>

        <button onClick={handleLogout} className={styles.logoutBtn} title="Đăng xuất">
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
};
