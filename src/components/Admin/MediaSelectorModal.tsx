import React, { useState, useEffect } from 'react';
import {
  FolderTree,
  Search,
  Check,
  X,
  FileText,
  ArrowLeft,
  Folder,
  Trash2,
} from 'lucide-react';
import type { MediaItem, MediaFolder } from '../../types/media';
import { mediaService } from '../../services/media/mediaService';
import { Button, Select } from './UI';
import styles from './MediaSelectorModal.module.css';

interface MediaSelectorModalProps {
  isOpen: boolean;
  onSelect: (selectedAssets: MediaItem[]) => void;
  onClose: () => void;
  allowMultiple?: boolean;
  filterType?: 'all' | 'image' | 'svg' | 'gif' | 'pdf';
  title?: string;
}

export const MediaSelectorModal: React.FC<MediaSelectorModalProps> = ({
  isOpen,
  onSelect,
  onClose,
  allowMultiple = false,
  filterType = 'all',
  title = 'Chọn tài nguyên từ Thư viện hệ thống',
}) => {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [folders, setFolders] = useState<MediaFolder[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [prevFilterType, setPrevFilterType] = useState(filterType);
  const [selectedFileType, setSelectedFileType] = useState<string>(filterType);

  if (filterType !== prevFilterType) {
    setPrevFilterType(filterType);
    setSelectedFileType(filterType);
  }

  const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>([]);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  const [folderSearchQuery, setFolderSearchQuery] = useState('');

  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (!isOpen) {
      setSelectedFolderId(null);
      setSelectedAssetIds([]);
      setSearchQuery('');
      setFolderSearchQuery('');
    }
  }

  useEffect(() => {
    let isMounted = true;
    if (isOpen) {
      mediaService.getFolders().then((f) => {
        if (isMounted) {
          setFolders(f);
        }
      });
      // Fetch items list for folder counts and asset grid
      mediaService.getMediaItems({
        searchQuery: selectedFolderId ? searchQuery : '',
        fileType: selectedFolderId ? selectedFileType : 'all',
        folderId: selectedFolderId || 'all',
        limit: 200,
      }).then((res) => {
        if (isMounted) setItems(res.items);
      });
    }
    return () => {
      isMounted = false;
    };
  }, [isOpen, searchQuery, selectedFileType, selectedFolderId]);

  if (!isOpen) return null;

  const handleToggleSelect = (item: MediaItem) => {
    if (allowMultiple) {
      setSelectedAssetIds((prev) =>
        prev.includes(item.id) ? prev.filter((id) => id !== item.id) : [...prev, item.id]
      );
    } else {
      setSelectedAssetIds([item.id]);
    }
  };

  const handleConfirmSelection = () => {
    const selected = items.filter((i) => selectedAssetIds.includes(i.id));
    if (selected.length > 0) {
      onSelect(selected);
      onClose();
    }
  };

  const handleDeleteAsset = async (item: MediaItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const usages = await mediaService.getMediaUsages(item.id);
    if (usages.length > 0) {
      alert(`Không thể xóa! Tệp "${item.original_filename}" đang được sử dụng ở ${usages.length} vị trí trên website.`);
      return;
    }
    if (window.confirm(`Bạn có chắc chắn muốn xóa vĩnh viễn tệp "${item.original_filename}"?`)) {
      const res = await mediaService.deleteMediaItem(item.id);
      if (res.success) {
        setItems((prev) => prev.filter((i) => i.id !== item.id));
        setSelectedAssetIds((prev) => prev.filter((id) => id !== item.id));
      } else {
        alert(res.error || 'Không thể xóa tệp.');
      }
    }
  };

  const currentFolderName = selectedFolderId === 'root'
    ? 'Thư mục gốc'
    : (folders.find((f) => f.id === selectedFolderId)?.name || 'Thư mục');

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>
            <FolderTree size={22} color="#F58220" /> {title}
          </h3>
          <button type="button" onClick={onClose} className={styles.closeBtn}>
            <X size={20} />
          </button>
        </div>

        {!selectedFolderId ? (
          /* LEVEL 1: FOLDER DIRECTORY SELECTION */
          <>
            <div className={styles.toolbar}>
              <div className={styles.searchBox}>
                <Search size={16} className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Tìm kiếm thư mục..."
                  value={folderSearchQuery}
                  onChange={(e) => setFolderSearchQuery(e.target.value)}
                  className={styles.searchInput}
                />
              </div>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.folderGrid}>
                {(() => {
                  const uncategorizedCount = items.filter((i) => !i.folder_id && i.status !== 'archived').length;
                  const rootFolder: MediaFolder = {
                    id: 'root',
                    name: 'Thư mục gốc',
                    slug: 'root',
                    color: '#94a3b8',
                    item_count: uncategorizedCount,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                  };
                  const q = folderSearchQuery.toLowerCase().trim();
                  const displayFolders = [rootFolder, ...folders].filter((f) =>
                    f.name.toLowerCase().includes(q)
                  );

                  return displayFolders.map((f) => (
                    <div
                      key={f.id}
                      className={styles.folderCard}
                      onClick={() => setSelectedFolderId(f.id)}
                    >
                      <Folder color={f.color || '#F58220'} size={32} />
                      <div>
                        <div className={styles.folderName}>{f.name}</div>
                        <div className={styles.folderCount}>{f.item_count || 0} tệp</div>
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </div>
          </>
        ) : (
          /* LEVEL 2: ASSET SELECTION INSIDE SELECTED FOLDER */
          <>
            {/* Toolbar */}
            <div className={styles.toolbar}>
              <button
                type="button"
                onClick={() => {
                  setSelectedFolderId(null);
                  setSelectedAssetIds([]);
                }}
                className={styles.backBtn}
              >
                <ArrowLeft size={16} /> Đổi thư mục
              </button>

              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#F58220', whiteSpace: 'nowrap' }}>
                📁 {currentFolderName}
              </div>

              <div className={styles.searchBox}>
                <Search size={16} className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Tìm kiếm file..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.searchInput}
                />
              </div>

              <Select
                options={[
                  { value: 'all', label: 'Tất cả định dạng' },
                  { value: 'image', label: 'Hình ảnh (JPG, PNG, WEBP)' },
                  { value: 'svg', label: 'Vector SVG' },
                  { value: 'gif', label: 'Ảnh động GIF' },
                  { value: 'pdf', label: 'Tài liệu PDF / Word' },
                ]}
                value={selectedFileType}
                onChange={setSelectedFileType}
                triggerStyle={{ minWidth: '200px' }}
              />
            </div>

            {/* Assets Grid */}
            <div className={styles.modalBody}>
              <div className={styles.grid}>
                {items
                  .filter((item) => {
                    if (selectedFolderId === 'root') return !item.folder_id;
                    return item.folder_id === selectedFolderId;
                  })
                  .map((item) => {
                    const isSelected = selectedAssetIds.includes(item.id);
                    const isDoc = item.mime_type.includes('pdf') || item.mime_type.includes('word') || item.original_filename.endsWith('.docx') || item.original_filename.endsWith('.doc');

                    return (
                      <div
                        key={item.id}
                        onClick={() => handleToggleSelect(item)}
                        className={`${styles.assetCard} ${isSelected ? styles.assetCardSelected : ''}`}
                      >
                        <div className={styles.thumbWrapper}>
                          {isDoc ? (
                            <FileText size={40} color="#F58220" />
                          ) : (
                            <img src={item.public_url} alt={item.default_alt_vi || item.original_filename} className={styles.thumbImg} />
                          )}
                          <button
                            type="button"
                            className={styles.modalDeleteBtn}
                            title="Xóa tệp này"
                            onClick={(e) => handleDeleteAsset(item, e)}
                          >
                            <Trash2 size={13} />
                          </button>
                          {isSelected && (
                            <div className={styles.checkBadge}>
                              <Check size={16} />
                            </div>
                          )}
                        </div>

                        <div className={styles.assetDetails}>
                          <div className={styles.filename} title={item.original_filename}>
                            {item.original_filename}
                          </div>
                          <div className={styles.metaSub}>
                            {(item.file_size / 1024).toFixed(0)} KB • {item.width ? `${item.width}x${item.height}` : 'Doc'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Footer */}
            <div className={styles.modalFooter}>
              <span className={styles.selectedCount}>
                Đã chọn: <strong>{selectedAssetIds.length}</strong> tệp
              </span>

              <Button
                variant="primary"
                size="md"
                disabled={selectedAssetIds.length === 0}
                onClick={handleConfirmSelection}
                icon={<Check size={18} />}
              >
                Sử dụng tệp đã chọn
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
