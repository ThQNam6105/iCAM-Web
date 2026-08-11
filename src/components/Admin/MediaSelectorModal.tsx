import React, { useState, useEffect, useRef } from 'react';
import {
  FolderTree,
  Upload,
  Search,
  Check,
  X,
  FileText,
  Plus,
} from 'lucide-react';
import type { MediaItem, MediaFolder } from '../../types/media';
import { mediaService } from '../../services/media/mediaService';
import { useToast } from '../Toast/Toast';
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
  title = 'Chọn Tài Nguyên từ Thư Viện Media',
}) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'library' | 'upload'>('library');
  const [items, setItems] = useState<MediaItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [folders, setFolders] = useState<MediaFolder[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string>('all');
  const [selectedFileType, setSelectedFileType] = useState<string>(filterType);
  const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const refreshMediaList = async () => {
    const res = await mediaService.getMediaItems({
      searchQuery,
      fileType: selectedFileType,
      folderId: selectedFolderId,
      limit: 100,
    });
    setItems(res.items);
  };

  useEffect(() => {
    let isMounted = true;
    if (isOpen) {
      mediaService.getFolders().then((f) => {
        if (isMounted) setFolders(f);
      });
      mediaService.getMediaItems({
        searchQuery,
        fileType: selectedFileType,
        folderId: selectedFolderId,
        limit: 100,
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
        prev.includes(item.id) ? prev.filter((id) => id !== id) : [...prev, item.id]
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

  const handleDirectFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const uploadedAssets: MediaItem[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const res = await mediaService.uploadMedia(file);

      if (res.success && res.asset) {
        uploadedAssets.push(res.asset);
        showToast(`Tải lên ${file.name} thành công! ✓`, 'success');
      } else if (res.isDuplicate && res.existingAsset) {
        uploadedAssets.push(res.existingAsset);
        showToast(`Đã chọn tệp trùng lặp có sẵn: ${res.existingAsset.original_filename}`, 'info');
      } else {
        showToast(`Lỗi: ${res.error}`, 'error');
      }
    }

    setIsUploading(false);
    await refreshMediaList();

    if (uploadedAssets.length > 0) {
      onSelect(uploadedAssets);
      onClose();
    }
  };

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

        {/* Navigation Tabs */}
        <div className={styles.modalTabs}>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === 'library' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('library')}
          >
            <FolderTree size={16} /> Thư Viện Đã Có ({items.length})
          </button>

          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === 'upload' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('upload')}
          >
            <Upload size={16} /> Tải Tệp Mới Lên
          </button>
        </div>

        {activeTab === 'library' ? (
          <>
            {/* Toolbar */}
            <div className={styles.toolbar}>
              <div className={styles.searchBox}>
                <Search size={16} className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên file, alt text, tag..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.searchInput}
                />
              </div>

              <select
                value={selectedFolderId}
                onChange={(e) => setSelectedFolderId(e.target.value)}
                className={styles.selectFilter}
              >
                <option value="all">Tất cả Thư mục</option>
                <option value="root">📁 Thư mục gốc</option>
                {folders.map((f) => (
                  <option key={f.id} value={f.id}>
                    📁 {f.name} ({f.item_count || 0})
                  </option>
                ))}
              </select>

              <select
                value={selectedFileType}
                onChange={(e) => setSelectedFileType(e.target.value)}
                className={styles.selectFilter}
              >
                <option value="all">Tất cả định dạng</option>
                <option value="image">Hình ảnh (JPG, PNG, WEBP)</option>
                <option value="svg">Vector SVG</option>
                <option value="gif">Ảnh động GIF</option>
                <option value="pdf">Tài liệu PDF</option>
              </select>
            </div>

            {/* Assets Grid */}
            <div className={styles.modalBody}>
              <div className={styles.grid}>
                {items.map((item) => {
                  const isSelected = selectedAssetIds.includes(item.id);
                  const isPdf = item.mime_type.includes('pdf');

                  return (
                    <div
                      key={item.id}
                      onClick={() => handleToggleSelect(item)}
                      className={`${styles.assetCard} ${isSelected ? styles.assetCardSelected : ''}`}
                    >
                      <div className={styles.thumbWrapper}>
                        {isPdf ? (
                          <FileText size={40} color="#F58220" />
                        ) : (
                          <img src={item.public_url} alt={item.default_alt_vi || item.original_filename} className={styles.thumbImg} />
                        )}
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
                          {(item.file_size / 1024).toFixed(0)} KB • {item.width ? `${item.width}x${item.height}` : 'PDF'}
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

              <button
                type="button"
                disabled={selectedAssetIds.length === 0}
                onClick={handleConfirmSelection}
                className={styles.confirmBtn}
              >
                <Check size={18} /> Sử Dụng Tệp Đã Chọn
              </button>
            </div>
          </>
        ) : (
          /* Direct Upload Tab */
          <div className={styles.modalBody}>
            <input
              type="file"
              ref={fileInputRef}
              multiple={allowMultiple}
              accept="image/*,.pdf,.svg"
              onChange={handleDirectFileUpload}
              style={{ display: 'none' }}
            />

            <div className={styles.dropzone} onClick={() => fileInputRef.current?.click()}>
              <Upload size={48} className={styles.uploadIcon} />
              <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                {isUploading ? 'Đang tải lên và xử lý...' : 'Bấm vào đây để chọn tệp từ máy tính'}
              </div>
              <div style={{ fontSize: '0.88rem', color: '#94a3b8' }}>
                Hỗ trợ PNG, JPG, WEBP, SVG, GIF, PDF (Tối đa 10MB/tệp)
              </div>
              <button type="button" className={styles.confirmBtn} style={{ marginTop: '1rem' }}>
                <Plus size={18} /> Chọn Tệp Máy Tính
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
