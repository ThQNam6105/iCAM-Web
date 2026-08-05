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
        <span className={styles.navSectionTitle}>Nội Dung & Tin Tức</span>

        <NavLink
          to="/admin"
          end
          className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
        >
          <FileText size={18} />
          <span>Quản lý Bài viết & Dashboard</span>
        </NavLink>

        <div className={`${styles.navItem} ${styles.disabledNavItem}`} title="Tính năng phát triển trong tương lai">
          <FolderTree size={18} />
          <span>Danh mục (Categories)</span>
        </div>

        <div className={`${styles.navItem} ${styles.disabledNavItem}`} title="Thư viện Media phát triển ở bản sau">
          <ImageIcon size={18} />
          <span>Media Library</span>
        </div>

        <span className={styles.navSectionTitle} style={{ marginTop: '1rem' }}>
          Đào Tạo & Tuyển Sinh (Sắp ra mắt)
        </span>

        <div className={`${styles.navItem} ${styles.disabledNavItem}`}>
          <GraduationCap size={18} />
          <span>Khóa Học (Courses)</span>
        </div>

        <div className={`${styles.navItem} ${styles.disabledNavItem}`}>
          <Users size={18} />
          <span>Giáo Viên & Nhân Sự</span>
        </div>

        <div className={`${styles.navItem} ${styles.disabledNavItem}`}>
          <HelpCircle size={18} />
          <span>Hỏi Đáp (FAQ)</span>
        </div>

        <NavLink
          to="/admin/careers"
          className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
        >
          <Briefcase size={18} />
          <span>Tuyển Dụng (Careers)</span>
        </NavLink>

        <div className={`${styles.navItem} ${styles.disabledNavItem}`}>
          <Settings size={18} />
          <span>Cấu Hình Hệ Thống</span>
        </div>
      </nav>

      <div className={styles.userFooter}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>A</div>
          <div>
            <div className={styles.userName}>iCANCAM Admin</div>
            <div className={styles.userRole}>Super Administrator</div>
          </div>
        </div>
        <button type="button" onClick={handleLogout} className={styles.logoutBtn} title="Đăng xuất">
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  );
};
