import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  FolderTree,
  Upload,
  Search,
  Grid,
  List,
  Copy,
  Trash2,
  Archive,
  Edit2,
  FileText,
  Clock,
  Layers,
  HardDrive,
  Eye,
  X,
  Save,
  Tag,
  ShieldAlert,
  FolderPlus,
  Folder,
  FolderOpen,
  FolderInput,
} from 'lucide-react';
import type { MediaItem, MediaUsage, MediaFolder, MediaFilter } from '../../types/media';
import { mediaService } from '../../services/media/mediaService';
import { ImageCropperModal } from '../../components/Admin/ImageCropperModal';
import { ConfirmModal } from '../../components/ConfirmModal/ConfirmModal';
import { useToast } from '../../components/Toast/Toast';
import styles from './AdminMediaLibrary.module.css';

const COLOR_OPTIONS = ['#F58220', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899', '#f59e0b'];

export const AdminMediaLibrary: React.FC = () => {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // View Mode
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Asset list & pagination
  const [items, setItems] = useState<MediaItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(1);

  // Folders state
  const [folders, setFolders] = useState<MediaFolder[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string>('all');

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [fileType, setFileType] = useState('all');
  const [usageStatus, setUsageStatus] = useState<'all' | 'used' | 'unused' | 'archived'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name-asc' | 'name-desc' | 'size-desc' | 'size-asc'>('newest');

  // Selected Assets for Bulk Action
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Asset Details Side Drawer
  const [activeDrawerAsset, setActiveDrawerAsset] = useState<MediaItem | null>(null);
  const [activeAssetUsages, setActiveAssetUsages] = useState<MediaUsage[]>([]);

  // Editing Metadata state inside drawer
  const [editAltVi, setEditAltVi] = useState('');
  const [editAltEn, setEditAltEn] = useState('');
  const [editCaption, setEditCaption] = useState('');
  const [editTagsStr, setEditTagsStr] = useState('');
  const [editFolderId, setEditFolderId] = useState<string | null>(null);

  // Folder Modals state
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [editingFolder, setEditingFolder] = useState<MediaFolder | null>(null);
  const [folderNameInput, setFolderNameInput] = useState('');
  const [folderColorInput, setFolderColorInput] = useState('#F58220');
  const [deleteFolderCandidate, setDeleteFolderCandidate] = useState<MediaFolder | null>(null);

  // Modals state
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [cropperCandidate, setCropperCandidate] = useState<MediaItem | null>(null);

  // Duplicate Warning Modal state
  const [duplicateWarning, setDuplicateWarning] = useState<{
    file: File;
    existingAsset: MediaItem;
  } | null>(null);

  // Delete Candidate
  const [deleteCandidate, setDeleteCandidate] = useState<MediaItem | null>(null);

  // Upload Destination Folder Prompt State
  const [uploadPendingFiles, setUploadPendingFiles] = useState<File[] | null>(null);
  const [selectedUploadFolderId, setSelectedUploadFolderId] = useState<string>('');

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const refreshFolders = useCallback(async () => {
    const fList = await mediaService.getFolders();
    setFolders(fList);
  }, []);

  const refreshMediaList = useCallback(async () => {
    const filter: MediaFilter = {
      searchQuery: debouncedSearch,
      fileType,
      folderId: selectedFolderId,
      usageStatus,
      sortBy,
      page,
      limit: 24,
    };
    const res = await mediaService.getMediaItems(filter);
    setItems(res.items);
    setTotalItems(res.total);
    await refreshFolders();
  }, [debouncedSearch, fileType, selectedFolderId, usageStatus, sortBy, page, refreshFolders]);

  useEffect(() => {
    let isMounted = true;
    const filter: MediaFilter = {
      searchQuery: debouncedSearch,
      fileType,
      folderId: selectedFolderId,
      usageStatus,
      sortBy,
      page,
      limit: 24,
    };
    mediaService.getFolders().then((f) => {
      if (isMounted) setFolders(f);
    });
    mediaService.getMediaItems(filter).then((res) => {
      if (isMounted) {
        setItems(res.items);
        setTotalItems(res.total);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [debouncedSearch, fileType, selectedFolderId, usageStatus, sortBy, page]);

  // Load Drawer details
  const handleOpenDrawer = async (item: MediaItem) => {
    setActiveDrawerAsset(item);
    setEditAltVi(item.default_alt_vi || '');
    setEditAltEn(item.default_alt_en || '');
    setEditCaption(item.default_caption || '');
    setEditTagsStr((item.tags || []).join(', '));
    setEditFolderId(item.folder_id || null);

    const usages = await mediaService.getMediaUsages(item.id);
    setActiveAssetUsages(usages);
  };

  const handleSaveMetadata = async () => {
    if (!activeDrawerAsset) return;

    const tagsArray = editTagsStr
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    const updated = await mediaService.updateMediaMetadata(activeDrawerAsset.id, {
      default_alt_vi: editAltVi,
      default_alt_en: editAltEn,
      default_caption: editCaption,
      tags: tagsArray,
      folder_id: editFolderId,
    });

    setActiveDrawerAsset(updated);
    showToast('Đã lưu thông tin Metadata bài viết thành công! ✓', 'success');
    await refreshMediaList();
  };

  // Folder CRUD handlers
  const handleOpenCreateFolderModal = () => {
    setEditingFolder(null);
    setFolderNameInput('');
    setFolderColorInput('#F58220');
    setIsFolderModalOpen(true);
  };

  const handleOpenEditFolderModal = (folder: MediaFolder, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingFolder(folder);
    setFolderNameInput(folder.name);
    setFolderColorInput(folder.color || '#F58220');
    setIsFolderModalOpen(true);
  };

  const handleSaveFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!folderNameInput.trim()) {
      showToast('Vui lòng nhập tên thư mục!', 'error');
      return;
    }

    if (editingFolder) {
      await mediaService.renameFolder(editingFolder.id, folderNameInput.trim(), folderColorInput);
      showToast(`Đã đổi tên thư mục thành "${folderNameInput.trim()}"! ✓`, 'success');
    } else {
      await mediaService.createFolder(folderNameInput.trim(), folderColorInput);
      showToast(`Đã tạo thư mục mới "${folderNameInput.trim()}"! ✓`, 'success');
    }

    setIsFolderModalOpen(false);
    await refreshMediaList();
  };

  const handleConfirmDeleteFolder = async () => {
    if (!deleteFolderCandidate) return;

    await mediaService.deleteFolder(deleteFolderCandidate.id);
    showToast(`Đã xóa thư mục "${deleteFolderCandidate.name}". Các tệp bên trong đã được chuyển về Thư mục Gốc.`, 'info');

    if (selectedFolderId === deleteFolderCandidate.id) {
      setSelectedFolderId('all');
    }
    setDeleteFolderCandidate(null);
    await refreshMediaList();
  };

  const handleMoveSelectedToFolder = async (targetFolderId: string | null) => {
    if (selectedIds.length === 0) return;

    await mediaService.moveItemsToFolder(selectedIds, targetFolderId);
    showToast(`Đã chuyển ${selectedIds.length} tệp vào thư mục! ✓`, 'success');
    setSelectedIds([]);
    await refreshMediaList();
  };

  const executeUploadWithFolder = async (filesToUpload: File[], destFolderId: string) => {
    for (let i = 0; i < filesToUpload.length; i++) {
      const file = filesToUpload[i];
      const res = await mediaService.uploadMedia(file, { folderId: destFolderId });

      if (res.isDuplicate && res.existingAsset) {
        setDuplicateWarning({ file, existingAsset: res.existingAsset });
        break; // Stop further uploads until user chooses
      } else if (res.success) {
        showToast(`Tải lên ${file.name} thành công! ✓`, 'success');
      } else {
        showToast(`Lỗi khi tải ${file.name}: ${res.error}`, 'error');
      }
    }
    await refreshMediaList();
  };

  // Upload handler with Mandatory Folder Check & SHA-256 Duplicate detection
  const handleUploadFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    if (selectedFolderId !== 'all' && selectedFolderId !== 'root') {
      await executeUploadWithFolder(fileArray, selectedFolderId);
    } else {
      if (folders.length === 0) {
        showToast('Vui lòng tạo ít nhất một Thư mục trước khi tải tệp lên!', 'error');
        handleOpenCreateFolderModal();
        return;
      }
      setSelectedUploadFolderId(folders[0].id);
      setUploadPendingFiles(fileArray);
    }
  };

  const handleUseExistingDuplicate = () => {
    if (duplicateWarning) {
      handleOpenDrawer(duplicateWarning.existingAsset);
      setDuplicateWarning(null);
      showToast('Đã mở tệp trùng lặp có sẵn trong Thư viện!', 'info');
    }
  };

  // Copy Public URL
  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    showToast('Đã sao chép liên kết CDN vào bộ nhớ tạm! ✓', 'success');
  };

  // Archive asset
  const handleArchive = async (item: MediaItem) => {
    await mediaService.archiveMediaItem(item.id);
    showToast(`Đã lưu trữ file ${item.original_filename}`, 'info');
    if (activeDrawerAsset?.id === item.id) {
      setActiveDrawerAsset(null);
    }
    await refreshMediaList();
  };

  // Delete Safe check
  const handleRequestDelete = async (item: MediaItem) => {
    const usages = await mediaService.getMediaUsages(item.id);
    if (usages.length > 0) {
      showToast(
        `Không thể xóa! Tệp này đang được sử dụng ở ${usages.length} vị trí trên website.`,
        'error'
      );
      return;
    }
    setDeleteCandidate(item);
  };

  const handleConfirmDelete = async () => {
    if (!deleteCandidate) return;
    const res = await mediaService.deleteMediaItem(deleteCandidate.id);
    if (res.success) {
      showToast('Đã xóa vĩnh viễn tệp media khỏi hệ thống!', 'info');
      if (activeDrawerAsset?.id === deleteCandidate.id) {
        setActiveDrawerAsset(null);
      }
      setSelectedIds((prev) => prev.filter((id) => id !== deleteCandidate.id));
      await refreshMediaList();
    } else {
      showToast(res.error || 'Không thể xóa tệp.', 'error');
    }
    setDeleteCandidate(null);
  };

  // Bulk Actions
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(items.map((i) => i.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleBulkArchive = async () => {
    for (const id of selectedIds) {
      await mediaService.archiveMediaItem(id);
    }
    showToast(`Đã lưu trữ ${selectedIds.length} tệp được chọn!`, 'info');
    setSelectedIds([]);
    await refreshMediaList();
  };

  const totalSizeMB = items
    .reduce((acc, i) => acc + (i.file_size || 0), 0) / (1024 * 1024);

  return (
    <div className={styles.container}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>
            <FolderTree color="#F58220" size={28} /> Thư Viện Media CMS (Digital Asset Management)
          </h1>
          <p className={styles.pageSubtitle}>
            Hệ thống quản lý thư mục, tối ưu SEO ảnh, cắt cúp và theo dõi sử dụng tài nguyên truyền thông tập trung iCANCAM
          </p>
        </div>

        <div className={styles.headerActions}>
          <input
            type="file"
            ref={fileInputRef}
            multiple
            accept="image/*,.pdf,.svg"
            onChange={(e) => e.target.files && handleUploadFiles(e.target.files)}
            style={{ display: 'none' }}
          />

          <button
            type="button"
            onClick={handleOpenCreateFolderModal}
            className={styles.createFolderBtn}
            style={{ padding: '0.75rem 1.25rem', fontSize: '0.9rem' }}
          >
            <FolderPlus size={18} /> Tạo Thư Mục Mới
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={styles.uploadTriggerBtn}
          >
            <Upload size={18} /> Tải Tệp Mới Lên
          </button>
        </div>
      </div>

      {/* Quick Statistics */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div>
            <div className={styles.statValue}>{totalItems}</div>
            <div className={styles.statLabel}>Tổng Tài Nguyên</div>
          </div>
          <HardDrive size={28} color="#F58220" />
        </div>

        <div className={styles.statCard}>
          <div>
            <div className={styles.statValue}>{folders.length}</div>
            <div className={styles.statLabel}>Thư Mục Phân Loại</div>
          </div>
          <Folder size={28} color="#8b5cf6" />
        </div>

        <div className={styles.statCard}>
          <div>
            <div className={styles.statValue}>{totalSizeMB.toFixed(1)} MB</div>
            <div className={styles.statLabel}>Dung Lượng Sử Dụng</div>
          </div>
          <Layers size={28} color="#3b82f6" />
        </div>

        <div className={styles.statCard}>
          <div>
            <div className={styles.statValue}>
              {items.filter((i) => (i.usage_count || 0) > 0).length}
            </div>
            <div className={styles.statLabel}>Tài Nguyên Đang Dùng</div>
          </div>
          <Clock size={28} color="#10b981" />
        </div>
      </div>

      {/* Folder Management Section */}
      <div className={styles.folderSection}>
        <div className={styles.folderSectionHeader}>
          <div className={styles.folderSectionTitle}>
            <FolderOpen color="#F58220" size={20} /> Danh Sách Thư Mục Quản Lý Media
          </div>
          <button type="button" onClick={handleOpenCreateFolderModal} className={styles.createFolderBtn}>
            <FolderPlus size={15} /> + Thư Mục Mới
          </button>
        </div>

        <div className={styles.folderGrid}>
          {/* All items option */}
          <div
            className={`${styles.folderCard} ${selectedFolderId === 'all' ? styles.folderCardActive : ''}`}
            onClick={() => {
              setSelectedFolderId('all');
              setPage(1);
            }}
          >
            <div className={styles.folderInfo}>
              <div className={styles.folderIcon}>
                <FolderOpen color="#F58220" size={20} />
              </div>
              <div>
                <div className={styles.folderName}>Tất Cả Tệp</div>
                <div className={styles.folderCount}>{totalItems} tệp</div>
              </div>
            </div>
          </div>

          {/* Root Uncategorized option */}
          <div
            className={`${styles.folderCard} ${selectedFolderId === 'root' ? styles.folderCardActive : ''}`}
            onClick={() => {
              setSelectedFolderId('root');
              setPage(1);
            }}
          >
            <div className={styles.folderInfo}>
              <div className={styles.folderIcon}>
                <Folder color="#94a3b8" size={20} />
              </div>
              <div>
                <div className={styles.folderName}>Thư Mục Gốc</div>
                <div className={styles.folderCount}>Chưa phân mục</div>
              </div>
            </div>
          </div>

          {/* Custom folders list */}
          {folders.map((folder) => {
            const isSelected = selectedFolderId === folder.id;
            return (
              <div
                key={folder.id}
                className={`${styles.folderCard} ${isSelected ? styles.folderCardActive : ''}`}
                onClick={() => {
                  setSelectedFolderId(folder.id);
                  setPage(1);
                }}
              >
                <div className={styles.folderInfo}>
                  <div className={styles.folderIcon}>
                    <Folder color={folder.color || '#F58220'} size={20} />
                  </div>
                  <div>
                    <div className={styles.folderName} title={folder.name}>
                      {folder.name}
                    </div>
                    <div className={styles.folderCount}>{folder.item_count || 0} tệp</div>
                  </div>
                </div>

                <div className={styles.folderActions}>
                  <button
                    type="button"
                    onClick={(e) => handleOpenEditFolderModal(folder, e)}
                    className={styles.folderActionBtn}
                    title="Đổi tên / sửa màu"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteFolderCandidate(folder);
                    }}
                    className={styles.folderActionBtn}
                    style={{ color: '#f87171' }}
                    title="Xóa thư mục"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upload Dropzone */}
      <div
        className={styles.uploadDropzone}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (e.dataTransfer.files) handleUploadFiles(e.dataTransfer.files);
        }}
      >
        <Upload size={36} color="#F58220" />
        <div style={{ fontSize: '1.05rem', fontWeight: 700, marginTop: '0.5rem' }}>
          Kéo & Thả nhiều tệp vào đây hoặc nhấp để Tải Lên
        </div>
        <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
          Hỗ trợ JPG, PNG, WEBP, SVG, GIF, PDF (Tối đa 10MB/tệp • Tự động kiểm tra trùng lặp SHA-256)
        </div>
      </div>

      {/* Toolbar & Filters */}
      <div className={styles.toolbarCard}>
        <div className={styles.topFilterRow}>
          <div className={styles.searchBox}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên file, Alt text Tiếng Việt / Tiếng Anh, Thẻ tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.filterControls}>
            <select
              value={fileType}
              onChange={(e) => {
                setFileType(e.target.value);
                setPage(1);
              }}
              className={styles.selectFilter}
            >
              <option value="all">Tất cả Loại tệp</option>
              <option value="image">Hình ảnh (JPG, PNG, WEBP)</option>
              <option value="svg">Vector SVG</option>
              <option value="gif">Ảnh động GIF</option>
              <option value="pdf">Tài liệu PDF</option>
            </select>

            <select
              value={usageStatus}
              onChange={(e) => {
                setUsageStatus(e.target.value as 'all' | 'used' | 'unused' | 'archived');
                setPage(1);
              }}
              className={styles.selectFilter}
            >
              <option value="all">Tất cả Trạng thái</option>
              <option value="used">Đang được sử dụng</option>
              <option value="unused">Chưa sử dụng</option>
              <option value="archived">Đã lưu trữ (Archived)</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(
                  e.target.value as
                    | 'newest'
                    | 'oldest'
                    | 'name-asc'
                    | 'name-desc'
                    | 'size-desc'
                    | 'size-asc'
                )
              }
              className={styles.selectFilter}
            >
              <option value="newest">Mới nhất trước</option>
              <option value="oldest">Cũ nhất trước</option>
              <option value="name-asc">Tên A-Z</option>
              <option value="name-desc">Tên Z-A</option>
              <option value="size-desc">Dung lượng lớn trước</option>
              <option value="size-asc">Dung lượng nhỏ trước</option>
            </select>

            {/* View Mode Toggle */}
            <div className={styles.viewToggleGroup}>
              <button
                type="button"
                className={`${styles.viewToggleBtn} ${viewMode === 'grid' ? styles.viewToggleActive : ''}`}
                onClick={() => setViewMode('grid')}
                title="Hiển thị dạng Lưới"
              >
                <Grid size={16} /> Lưới
              </button>
              <button
                type="button"
                className={`${styles.viewToggleBtn} ${viewMode === 'list' ? styles.viewToggleActive : ''}`}
                onClick={() => setViewMode('list')}
                title="Hiển thị dạng Danh sách"
              >
                <List size={16} /> Danh sách
              </button>
            </div>
          </div>
        </div>

        {/* Bulk Action Bar */}
        {selectedIds.length > 0 && (
          <div className={styles.bulkBar}>
            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>
              Đã chọn <strong>{selectedIds.length}</strong> tệp
            </span>

            <div className={styles.bulkActions}>
              <select
                onChange={(e) => {
                  const targetFolder = e.target.value === 'root' ? null : e.target.value;
                  handleMoveSelectedToFolder(targetFolder);
                  e.target.value = '';
                }}
                defaultValue=""
                className={styles.selectFilter}
                style={{ background: 'rgba(9, 26, 54, 0.8)' }}
              >
                <option value="" disabled>
                  📁 Chuyển vào Thư Mục...
                </option>
                <option value="root">📁 Chuyển về Thư mục Gốc</option>
                {folders.map((f) => (
                  <option key={f.id} value={f.id}>
                    📁 {f.name}
                  </option>
                ))}
              </select>

              <button type="button" onClick={handleBulkArchive} className={styles.bulkBtn}>
                <Archive size={15} /> Lưu Trữ
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Workspace (Grid vs List) */}
      {viewMode === 'grid' ? (
        <div className={styles.gridWorkspace}>
          {items.map((item) => {
            const isSelected = selectedIds.includes(item.id);
            const isPdf = item.mime_type.includes('pdf');
            const itemFolder = folders.find((f) => f.id === item.folder_id);

            return (
              <div
                key={item.id}
                className={`${styles.gridCard} ${isSelected ? styles.gridCardSelected : ''}`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={(e) => {
                    if (e.target.checked) setSelectedIds([...selectedIds, item.id]);
                    else setSelectedIds(selectedIds.filter((id) => id !== item.id));
                  }}
                  className={styles.cardSelectCheckbox}
                />

                <div className={styles.cardThumbArea} onClick={() => handleOpenDrawer(item)}>
                  {isPdf ? (
                    <FileText size={48} color="#F58220" />
                  ) : (
                    <img src={item.public_url} alt={item.default_alt_vi || item.original_filename} className={styles.cardImg} />
                  )}

                  {(item.usage_count || 0) > 0 && (
                    <div className={styles.usageBadge} title={`Đang dùng ở ${item.usage_count} vị trí`}>
                      <Eye size={12} /> Dùng ({item.usage_count})
                    </div>
                  )}
                </div>

                <div className={styles.cardInfo}>
                  <div className={styles.cardTitle} title={item.original_filename}>
                    {item.original_filename}
                  </div>
                  <div className={styles.cardMetaRow}>
                    <span>{(item.file_size / 1024).toFixed(0)} KB</span>
                    <span>{item.width ? `${item.width}x${item.height}` : 'PDF'}</span>
                  </div>

                  <div>
                    {itemFolder && (
                      <span className={styles.tagPill} style={{ background: 'rgba(245, 130, 32, 0.2)', color: '#F58220' }}>
                        📁 {itemFolder.name}
                      </span>
                    )}
                    {(item.tags || []).map((tag) => (
                      <span key={tag} className={styles.tagPill}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View Table */
        <div className={styles.tableCard}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th style={{ width: '40px' }}>
                  <input
                    type="checkbox"
                    checked={selectedIds.length === items.length && items.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
                <th>Hình xem trước</th>
                <th>Tên Tệp Media</th>
                <th>Thư Mục</th>
                <th>Định Dạng</th>
                <th>Kích Thước</th>
                <th>Dung Lượng</th>
                <th>Sử Dụng</th>
                <th>Ngày Tải Lên</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const isSelected = selectedIds.includes(item.id);
                const isPdf = item.mime_type.includes('pdf');
                const itemFolder = folders.find((f) => f.id === item.folder_id);

                return (
                  <tr key={item.id} className={styles.tableRow}>
                    <td>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedIds([...selectedIds, item.id]);
                          else setSelectedIds(selectedIds.filter((id) => id !== item.id));
                        }}
                      />
                    </td>
                    <td>
                      {isPdf ? (
                        <FileText size={32} color="#F58220" />
                      ) : (
                        <img src={item.public_url} alt={item.original_filename} className={styles.listThumb} />
                      )}
                    </td>
                    <td>
                      <div style={{ fontWeight: 700 }}>{item.original_filename}</div>
                      <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                        {(item.tags || []).map((t) => `#${t}`).join(' ')}
                      </div>
                    </td>
                    <td>
                      {itemFolder ? (
                        <span style={{ fontSize: '0.82rem', color: itemFolder.color || '#F58220', fontWeight: 600 }}>
                          📁 {itemFolder.name}
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Gốc</span>
                      )}
                    </td>
                    <td>{item.mime_type.split('/')[1]?.toUpperCase()}</td>
                    <td>{item.width ? `${item.width}x${item.height}px` : 'PDF'}</td>
                    <td>{(item.file_size / 1024).toFixed(0)} KB</td>
                    <td>
                      <span style={{ color: (item.usage_count || 0) > 0 ? '#10b981' : '#94a3b8', fontWeight: 600 }}>
                        {item.usage_count || 0} vị trí
                      </span>
                    </td>
                    <td>{new Date(item.created_at).toLocaleDateString('vi-VN')}</td>
                    <td>
                      <div className={styles.actionCell}>
                        <button
                          type="button"
                          onClick={() => handleOpenDrawer(item)}
                          className={styles.iconBtn}
                          title="Chi tiết & Metadata"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCopyUrl(item.public_url)}
                          className={styles.iconBtn}
                          title="Sao chép URL"
                        >
                          <Copy size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleArchive(item)}
                          className={styles.iconBtn}
                          title="Lưu trữ"
                        >
                          <Archive size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRequestDelete(item)}
                          className={styles.iconBtn}
                          title="Xóa tệp"
                          style={{ color: '#f87171' }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Side Drawer Asset Details Panel */}
      {activeDrawerAsset && (
        <div className={styles.drawerOverlay} onClick={() => setActiveDrawerAsset(null)}>
          <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
            <div className={styles.drawerHeader}>
              <h3 className={styles.drawerTitle}>Chi Tiết & Metadata Tài Nguyên</h3>
              <button type="button" onClick={() => setActiveDrawerAsset(null)} className={styles.closeBtn}>
                <X size={20} />
              </button>
            </div>

            <div className={styles.drawerBody}>
              {/* Preview Box */}
              <div className={styles.drawerPreviewBox}>
                {activeDrawerAsset.mime_type.includes('pdf') ? (
                  <FileText size={64} color="#F58220" />
                ) : (
                  <img
                    src={activeDrawerAsset.public_url}
                    alt={activeDrawerAsset.default_alt_vi || activeDrawerAsset.original_filename}
                    className={styles.drawerImg}
                  />
                )}
              </div>

              {/* Quick Actions */}
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => handleCopyUrl(activeDrawerAsset.public_url)}
                  className={styles.resetBtn}
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  <Copy size={15} /> Sao Chép URL CDN
                </button>

                {!activeDrawerAsset.mime_type.includes('pdf') && (
                  <button
                    type="button"
                    onClick={() => {
                      setCropperCandidate(activeDrawerAsset);
                      setIsCropperOpen(true);
                    }}
                    className={styles.resetBtn}
                    style={{ background: '#F58220', color: '#fff', borderColor: '#F58220' }}
                  >
                    <Edit2 size={15} /> Cắt & Tâm Điểm
                  </button>
                )}
              </div>

              {/* Metadata Key-Value */}
              <div className={styles.metaGrid}>
                <div className={styles.metaItem}>
                  <span className={styles.metaKey}>Tên tệp gốc:</span>
                  <span className={styles.metaVal}>{activeDrawerAsset.original_filename}</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaKey}>Kích thước / Dạng:</span>
                  <span className={styles.metaVal}>
                    {activeDrawerAsset.width
                      ? `${activeDrawerAsset.width}x${activeDrawerAsset.height}px`
                      : 'PDF Document'}
                  </span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaKey}>Dung lượng:</span>
                  <span className={styles.metaVal}>
                    {(activeDrawerAsset.file_size / 1024).toFixed(0)} KB
                  </span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaKey}>Content Hash SHA-256:</span>
                  <span className={styles.metaVal} style={{ fontSize: '0.7rem' }}>
                    {activeDrawerAsset.content_hash.slice(0, 16)}...
                  </span>
                </div>
              </div>

              {/* Folder Selector */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <FolderInput size={15} /> Thư mục lưu trữ:
                </label>
                <select
                  value={editFolderId || ''}
                  onChange={(e) => setEditFolderId(e.target.value ? e.target.value : null)}
                  className={styles.input}
                >
                  <option value="">📁 Thư mục Gốc (Uncategorized)</option>
                  {folders.map((f) => (
                    <option key={f.id} value={f.id}>
                      📁 {f.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Edit SEO Alt & Caption Form */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Default Alt Text (Tiếng Việt) *</label>
                <input
                  type="text"
                  value={editAltVi}
                  onChange={(e) => setEditAltVi(e.target.value)}
                  className={styles.input}
                  placeholder="Mô tả hình ảnh bằng Tiếng Việt cho Google SEO..."
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Default Alt Text (Tiếng Anh)</label>
                <input
                  type="text"
                  value={editAltEn}
                  onChange={(e) => setEditAltEn(e.target.value)}
                  className={styles.input}
                  placeholder="English image alt description..."
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Chú thích hiển thị (Caption)</label>
                <textarea
                  rows={2}
                  value={editCaption}
                  onChange={(e) => setEditCaption(e.target.value)}
                  className={styles.textarea}
                  placeholder="Chú thích ảnh mặc định..."
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Thẻ nhãn phân loại (Tags, phân cách bằng dấu phẩy)</label>
                <input
                  type="text"
                  value={editTagsStr}
                  onChange={(e) => setEditTagsStr(e.target.value)}
                  className={styles.input}
                  placeholder="VD: banner, blog, teachers, classroom"
                />
              </div>

              {/* Usage Inspector List */}
              <div className={styles.usageBox}>
                <div className={styles.usageHeader}>
                  <Eye size={16} /> Lịch Sử Sử Dụng ({activeAssetUsages.length} Vị Trí)
                </div>
                {activeAssetUsages.length === 0 ? (
                  <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                    Tệp này chưa được liên kết sử dụng ở mô-đun nào. Có thể xóa an toàn.
                  </div>
                ) : (
                  <div className={styles.usageList}>
                    {activeAssetUsages.map((u) => (
                      <div key={u.id} className={styles.usageItem}>
                        <Tag size={13} color="#F58220" />
                        <span>
                          [{u.entity_type.toUpperCase()}] <strong>{u.entity_title}</strong>
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className={styles.drawerFooter}>
              <button
                type="button"
                onClick={() => handleRequestDelete(activeDrawerAsset)}
                className={styles.resetBtn}
                style={{ color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.4)' }}
              >
                <Trash2 size={16} /> Xóa Vĩnh Viễn
              </button>

              <button type="button" onClick={handleSaveMetadata} className={styles.uploadTriggerBtn}>
                <Save size={16} /> Lưu Metadata
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Cropper Modal */}
      <ImageCropperModal
        isOpen={isCropperOpen}
        asset={cropperCandidate}
        onClose={() => setIsCropperOpen(false)}
        onSave={async (croppedBlob, newFilename, focalX, focalY) => {
          if (!cropperCandidate) return;
          const newAsset = await mediaService.saveEditedVariant(
            cropperCandidate.id,
            croppedBlob,
            newFilename,
            focalX,
            focalY
          );
          setIsCropperOpen(false);
          showToast('Đã tạo bản cropped mới thành công! ✓', 'success');
          handleOpenDrawer(newAsset);
          await refreshMediaList();
        }}
      />

      {/* Folder Creation / Editing Modal */}
      {isFolderModalOpen && (
        <div className={styles.drawerOverlay} onClick={() => setIsFolderModalOpen(false)}>
          <div
            className={styles.drawer}
            style={{ position: 'relative', margin: 'auto', maxWidth: '450px', height: 'auto', borderRadius: '20px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.drawerHeader}>
              <h3 className={styles.drawerTitle}>
                <FolderPlus size={20} color="#F58220" /> {editingFolder ? 'Đổi Tên Thư Mục' : 'Tạo Thư Mục Media Mới'}
              </h3>
              <button type="button" onClick={() => setIsFolderModalOpen(false)} className={styles.closeBtn}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveFolder} className={styles.drawerBody}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Tên Thư Mục *</label>
                <input
                  type="text"
                  value={folderNameInput}
                  onChange={(e) => setFolderNameInput(e.target.value)}
                  className={styles.input}
                  placeholder="VD: Bài Viết Khai Giảng, Ảnh Giáo Viên..."
                  autoFocus
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Màu Nhận Diện Thư Mục</label>
                <div className={styles.colorPickerRow}>
                  {COLOR_OPTIONS.map((c) => (
                    <div
                      key={c}
                      className={`${styles.colorOption} ${folderColorInput === c ? styles.colorOptionSelected : ''}`}
                      style={{ background: c }}
                      onClick={() => setFolderColorInput(c)}
                    />
                  ))}
                </div>
              </div>

              <div className={styles.drawerFooter} style={{ padding: '1rem 0 0 0', border: 'none', background: 'transparent' }}>
                <button type="button" onClick={() => setIsFolderModalOpen(false)} className={styles.resetBtn}>
                  Hủy Bỏ
                </button>
                <button type="submit" className={styles.uploadTriggerBtn}>
                  <Save size={16} /> {editingFolder ? 'Lưu Đổi Tên' : 'Tạo Thư Mục'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Folder Confirm Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteFolderCandidate)}
        title="Xác Nhận Xóa Thư Mục"
        message={`Bạn có chắc chắn muốn xóa thư mục "${deleteFolderCandidate?.name}"? Các tệp truyền thông bên trong sẽ được chuyển về Thư mục Gốc an toàn mà không bị mất.`}
        confirmLabel="Xóa Thư Mục"
        cancelLabel="Hủy Bỏ"
        onConfirm={handleConfirmDeleteFolder}
        onCancel={() => setDeleteFolderCandidate(null)}
      />

      {/* Duplicate Asset Warning Modal */}
      {duplicateWarning && (
        <div className={styles.drawerOverlay}>
          <div
            className={styles.drawer}
            style={{ position: 'relative', margin: 'auto', maxWidth: '500px', height: 'auto' }}
          >
            <div className={styles.drawerHeader}>
              <h3 className={styles.drawerTitle} style={{ color: '#F58220', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldAlert size={20} /> Phát Hiện Tệp Trùng Lặp (Deduplication)
              </h3>
            </div>

            <div className={styles.drawerBody}>
              <p style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: 1.6 }}>
                Tệp <strong>{duplicateWarning.file.name}</strong> có mã băm SHA-256 trùng khớp 100% với tệp{' '}
                <strong>{duplicateWarning.existingAsset.original_filename}</strong> đã có sẵn trong Thư viện Media.
              </p>

              <div style={{ background: '#091a36', padding: '1rem', borderRadius: '12px', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <img
                  src={duplicateWarning.existingAsset.public_url}
                  alt="Existing"
                  style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{duplicateWarning.existingAsset.original_filename}</div>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                    Tải lên ngày: {new Date(duplicateWarning.existingAsset.created_at).toLocaleDateString('vi-VN')}
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.drawerFooter}>
              <button
                type="button"
                onClick={() => setDuplicateWarning(null)}
                className={styles.resetBtn}
              >
                Hủy Bỏ Upload
              </button>

              <button
                type="button"
                onClick={handleUseExistingDuplicate}
                className={styles.uploadTriggerBtn}
              >
                Sử Dụng Tệp Có Sẵn
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteCandidate)}
        title="Xác Nhận Xóa Vĩnh Viễn Tệp Media"
        message={`Bạn có chắc chắn muốn xóa vĩnh viễn tệp "${deleteCandidate?.original_filename}" khỏi hệ thống?`}
        confirmLabel="Xóa Vĩnh Viễn"
        cancelLabel="Hủy Bỏ"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteCandidate(null)}
      />

      {/* Mandatory Upload Folder Destination Selection Modal */}
      {uploadPendingFiles && (
        <div className={styles.drawerOverlay} onClick={() => setUploadPendingFiles(null)}>
          <div
            className={styles.drawer}
            style={{ position: 'relative', margin: 'auto', maxWidth: '480px', height: 'auto', borderRadius: '20px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.drawerHeader}>
              <h3 className={styles.drawerTitle} style={{ color: '#F58220', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FolderOpen size={20} /> Chọn Thư Mục Lưu Trữ Cho Tệp Mới
              </h3>
              <button type="button" onClick={() => setUploadPendingFiles(null)} className={styles.closeBtn}>
                <X size={20} />
              </button>
            </div>

            <div className={styles.drawerBody}>
              <p style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: 1.6 }}>
                Hệ thống yêu cầu mọi tệp media phải được phân loại vào một Thư mục cụ thể. Vui lòng chọn thư mục lưu trữ cho{' '}
                <strong>{uploadPendingFiles.length} tệp</strong> sắp tải lên:
              </p>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Thư Mục Đích *</label>
                <select
                  value={selectedUploadFolderId}
                  onChange={(e) => setSelectedUploadFolderId(e.target.value)}
                  className={styles.input}
                >
                  {folders.map((f) => (
                    <option key={f.id} value={f.id}>
                      📁 {f.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.drawerFooter}>
              <button type="button" onClick={() => setUploadPendingFiles(null)} className={styles.resetBtn}>
                Hủy Bỏ
              </button>
              <button
                type="button"
                onClick={async () => {
                  const filesToUpload = uploadPendingFiles;
                  const targetFId = selectedUploadFolderId || folders[0]?.id;
                  setUploadPendingFiles(null);
                  if (filesToUpload && targetFId) {
                    await executeUploadWithFolder(filesToUpload, targetFId);
                  }
                }}
                className={styles.uploadTriggerBtn}
              >
                <Upload size={16} /> Tải Vào Thư Mục
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
