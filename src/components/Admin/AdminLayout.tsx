import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { CategoryManagerModal } from './CategoryManagerModal';
import styles from './AdminLayout.module.css';

export interface AdminOutletContext {
  onOpenCategoryManager: () => void;
}

export const AdminLayout: React.FC = () => {
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const handleOpenCategoryManager = () => {
    setIsCategoryModalOpen(true);
  };

  return (
    <div className={styles.layoutWrapper}>
      <AdminSidebar onOpenCategoryManager={handleOpenCategoryManager} />
      <div className={styles.contentWrapper}>
        <main className={styles.mainContent}>
          <Outlet context={{ onOpenCategoryManager: handleOpenCategoryManager }} />
        </main>
      </div>

      <CategoryManagerModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
      />
    </div>
  );
};
