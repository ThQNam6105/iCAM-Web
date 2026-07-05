import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import styles from './NotFound.module.css';

export const NotFound: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.errorCode}>404</h1>
      <h2 className={styles.title}>Không tìm thấy trang</h2>
      <p className={styles.message}>
        Đường dẫn bạn truy cập không tồn tại hoặc đã được chuyển sang địa chỉ khác. Vui lòng quay
        lại Trang chủ.
      </p>
      <Link to="/" className="btn-primary" style={{ marginTop: '1rem' }}>
        <ArrowLeft size={18} />
        Quay lại Trang chủ
      </Link>
    </div>
  );
};
