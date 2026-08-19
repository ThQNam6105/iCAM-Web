import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import footerLogo from '../../assets/footer-logo.jpg';
import { authService } from '../../services/authService';
import styles from './AdminLogin.module.css';

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await authService.login(email, password);
    setLoading(false);

    if (res.success) {
      navigate('/admin');
    } else {
      setError(res.error || 'Đăng nhập không thành công.');
    }
  };

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.loginCard}>
        <img src={footerLogo} alt="iCANCAM Logo" className={styles.logoImg} />
        <h1 className={styles.title}>Quản trị viên iCANCAM</h1>
        <p className={styles.subtitle}>Đăng nhập Supabase Auth để quản trị hệ thống</p>

        <form onSubmit={handleLogin} className={styles.form}>
          {error && <div className={styles.errorAlert}>{error}</div>}

          <div className={styles.inputGroup}>
            <label className={styles.label}>Admin Email</label>
            <input
              type="email"
              placeholder="Nhập email quản trị..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              required
              autoFocus
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Admin Password</label>
            <input
              type="password"
              placeholder="Nhập mật khẩu..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              required
            />
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Đang xác thực...' : 'Đăng nhập quản trị'}
          </button>
        </form>

        <Link to="/" className={styles.backHomeLink}>
          ← Quay về trang chủ
        </Link>
      </div>
    </div>
  );
};
