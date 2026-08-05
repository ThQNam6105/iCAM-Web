import React from 'react';
import { ListTree } from 'lucide-react';
import { type TocItem } from '../../utils/tocGenerator';
import styles from './TableOfContents.module.css';

interface TableOfContentsProps {
  toc: TocItem[];
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({ toc }) => {
  if (!toc || toc.length === 0) return null;

  return (
    <div className={styles.tocCard}>
      <div className={styles.tocHeader}>
        <ListTree size={18} color="#F58220" /> Mục Lục Bài Viết (Table of Contents)
      </div>

      <ul className={styles.tocList}>
        {toc.map((item) => (
          <li key={item.id} className={item.level === 2 ? styles.level2 : styles.level3}>
            <a href={`#${item.id}`} className={styles.tocLink}>
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};
