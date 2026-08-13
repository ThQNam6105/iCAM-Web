import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  FileText,
  FolderTree,
  Image as ImageIcon,
  GraduationCap,
  Users,
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
          <h2 className={styles.brandTitle}>iCANCAM CMS</h2>
          <span className={styles.brandSubtitle}>Admin Portal v2.0</span>
        </div>
      </div>

      <nav className={styles.navGroup}>
        <span className={styles.navSectionTitle}>Nội dung & tin tức</span>

        <NavLink
          to="/admin"
          end
          className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
        >
          <FileText size={18} />
          <span>Quản lý bài viết & Dashboard</span>
        </NavLink>

        <NavLink
          to="/admin/categories"
          className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
        >
          <FolderTree size={18} />
          <span>Danh mục</span>
        </NavLink>

        <NavLink
          to="/admin/media"
          className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
        >
          <ImageIcon size={18} />
          <span>Thư viện hệ thống</span>
        </NavLink>

        <span className={styles.navSectionTitle} style={{ marginTop: '1rem' }}>
          Đào tạo & tuyển sinh
        </span>

        <div className={`${styles.navItem} ${styles.disabledNavItem}`}>
          <GraduationCap size={18} />
          <span>Khóa học</span>
        </div>

        <div className={`${styles.navItem} ${styles.disabledNavItem}`}>
          <Users size={18} />
          <span>Giáo viên & nhân sự</span>
        </div>

        <div className={`${styles.navItem} ${styles.disabledNavItem}`}>
          <HelpCircle size={18} />
          <span>Hỏi đáp</span>
        </div>

        <NavLink
          to="/admin/careers"
          className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
        >
          <Briefcase size={18} />
          <span>Tuyển dụng</span>
        </NavLink>

        <div className={`${styles.navItem} ${styles.disabledNavItem}`}>
          <Settings size={18} />
          <span>Cấu hình hệ thống</span>
        </div>
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
