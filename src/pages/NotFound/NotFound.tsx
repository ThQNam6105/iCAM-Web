import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import styles from './NotFound.module.css';
import { useLanguage } from '../../contexts/LanguageContext';

export const NotFound: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className={styles.container}>
      <h1 className={styles.errorCode}>404</h1>
      <h2 className={styles.title}>{t.notFound.title}</h2>
      <p className={styles.message}>{t.notFound.subtitle}</p>
      <Link to="/" className={styles.backBtn}>
        <ArrowLeft size={18} />
        {t.notFound.backHomeBtn}
      </Link>
    </div>
  );
};
