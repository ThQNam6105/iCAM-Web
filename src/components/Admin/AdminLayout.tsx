import React from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { ToastProvider } from '../Toast/Toast';
import styles from './AdminLayout.module.css';

export const AdminLayout: React.FC = () => {
  return (
    <ToastProvider>
      <div className={styles.layoutWrapper}>
        <AdminSidebar />
        <div className={styles.contentWrapper}>
          <main className={styles.mainContent}>
            <Outlet />
          </main>
        </div>
      </div>
    </ToastProvider>
  );
};
