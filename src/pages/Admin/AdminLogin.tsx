import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import footerLogo from '../../assets/footer-logo.jpg';
import { authService } from '../../services/authService';
import styles from './AdminLogin.module.css';

export const AdminLogin: React.FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (authService.login(password)) {
      setError('');
      navigate('/admin');
    } else {
      setError('Mật khẩu không chính xác');
    }
  };

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.loginCard}>
        <img src={footerLogo} alt="iCANCAM Logo" className={styles.logoImg} />
        <h1 className={styles.title}>Quản Trị viên iCANCAM</h1>
        <p className={styles.subtitle}>Đăng nhập để quản lý bài viết tin tức & sự kiện</p>

        <form onSubmit={handleLogin} className={styles.form}>
          {error && <div className={styles.errorAlert}>{error}</div>}

          <div className={styles.inputGroup}>
            <label className={styles.label}>Mật khẩu Quản trị (Admin Password)</label>
            <input
              type="password"
              placeholder="Nhập mật khẩu Quản trị..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              required
              autoFocus
            />
          </div>

          <button type="submit" className={styles.submitBtn}>
            Đăng Nhập Quản Trị
          </button>
        </form>

        <Link to="/" className={styles.backHomeLink}>
          ← Quay về Trang chủ
        </Link>
      </div>
    </div>
  );
};
