import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  FolderPlus,
  Folder,
  FolderOpen,
  Upload,
  Search,
  Grid,
  List,
  Copy,
  Trash2,
  Archive,
  Edit2,
  FileText,
  HardDrive,
  Layers,
  Eye,
  X,
  Save,
  Tag,
  ShieldAlert,
  ArrowLeft,
  Download,
  Music,
  Video,
  FolderInput,
} from 'lucide-react';
import type { MediaItem, MediaUsage, MediaFolder, MediaFilter } from '../../types/media';
import { mediaService } from '../../services/media/mediaService';
import { ImageCropperModal } from '../../components/Admin/ImageCropperModal';
import { ConfirmModal } from '../../components/ConfirmModal/ConfirmModal';
import { useToast } from '../../components/Toast/Toast';
import { Button, Select } from '../../components/Admin/UI';
import styles from './AdminMediaLibrary.module.css';

const COLOR_OPTIONS = ['#F58220', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899', '#f59e0b'];

export const AdminMediaLibrary: React.FC = () => {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Explorer Hierarchy View State: null = Root Directory, MediaFolder = Inside Specific Folder
  const [currentFolder, setCurrentFolder] = useState<MediaFolder | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<MediaFolder | null>(null);

  // View Mode for Files Inside Folder
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Data State
  const [folders, setFolders] = useState<MediaFolder[]>([]);
  const [items, setItems] = useState<MediaItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(1);

  // Filters & Search Inside Folder
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

  // Folder CRUD Modals
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [editingFolder, setEditingFolder] = useState<MediaFolder | null>(null);
  const [folderNameInput, setFolderNameInput] = useState('');
  const [folderColorInput, setFolderColorInput] = useState('#F58220');
  const [folderSearchQuery, setFolderSearchQuery] = useState('');
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
    const filterFolderId = currentFolder ? currentFolder.id : 'all';
    const filter: MediaFilter = {
      searchQuery: debouncedSearch,
      fileType,
      folderId: filterFolderId,
      usageStatus,
      sortBy,
      page,
      limit: 100,
    };
    const res = await mediaService.getMediaItems(filter);
    setItems(res.items);
    setTotalItems(res.total);
    await refreshFolders();
  }, [currentFolder, debouncedSearch, fileType, usageStatus, sortBy, page, refreshFolders]);

  useEffect(() => {
    let isMounted = true;
    const filterFolderId = currentFolder ? currentFolder.id : 'all';
    const filter: MediaFilter = {
      searchQuery: debouncedSearch,
      fileType,
      folderId: filterFolderId,
      usageStatus,
      sortBy,
      page,
      limit: 100,
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
  }, [currentFolder, debouncedSearch, fileType, usageStatus, sortBy, page]);

  // Folder Operations
  const handleOpenCreateFolderModal = () => {
    setEditingFolder(null);
    setFolderNameInput('');
    setFolderColorInput('#F58220');
    setIsFolderModalOpen(true);
  };

  const handleOpenEditFolderModal = (folder: MediaFolder, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
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
      const updated = await mediaService.renameFolder(editingFolder.id, folderNameInput.trim(), folderColorInput);
      showToast(`Đã đổi tên thư mục thành "${folderNameInput.trim()}"! ✓`, 'success');
      if (currentFolder?.id === editingFolder.id) {
        setCurrentFolder(updated);
      }
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
    showToast(`Đã xóa thư mục "${deleteFolderCandidate.name}". Các tệp đã được chuyển về Thư mục Gốc an toàn.`, 'info');

    if (currentFolder?.id === deleteFolderCandidate.id) {
      setCurrentFolder(null);
    }
    if (selectedFolder?.id === deleteFolderCandidate.id) {
      setSelectedFolder(null);
    }
    setDeleteFolderCandidate(null);
    await refreshMediaList();
  };

  const handleDownloadFolder = async (folder: MediaFolder) => {
    const res = await mediaService.getMediaItems({ folderId: folder.id, limit: 200 });
    if (res.items.length === 0) {
      showToast(`Thư mục "${folder.name}" trống, không có tệp nào để tải xuống!`, 'info');
      return;
    }
    showToast(`Đang bắt đầu tải xuống ${res.items.length} tệp từ thư mục "${folder.name}"...`, 'info');
    await mediaService.downloadFolderFiles(folder.name, res.items);
  };

  // Upload handler direct into current folder
  const handleUploadFiles = async (files: FileList | File[]) => {
    if (!currentFolder) {
      showToast('Vui lòng mở một Thư mục trước khi tải tệp lên!', 'error');
      return;
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const res = await mediaService.uploadMedia(file, { folderId: currentFolder.id });

      if (res.isDuplicate && res.existingAsset) {
        setDuplicateWarning({ file, existingAsset: res.existingAsset });
        break;
      } else if (res.success) {
        showToast(`Tải lên ${file.name} vào "${currentFolder.name}" thành công! ✓`, 'success');
      } else {
        showToast(`Lỗi khi tải ${file.name}: ${res.error}`, 'error');
      }
    }
    await refreshMediaList();
  };

  // Open Side Drawer
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

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    showToast('Đã sao chép liên kết CDN vào bộ nhớ tạm! ✓', 'success');
  };

  const handleArchive = async (item: MediaItem) => {
    await mediaService.archiveMediaItem(item.id);
    showToast(`Đã lưu trữ file ${item.original_filename}`, 'info');
    if (activeDrawerAsset?.id === item.id) {
      setActiveDrawerAsset(null);
    }
    await refreshMediaList();
  };

  const handleRequestDelete = async (item: MediaItem) => {
    const usages = await mediaService.getMediaUsages(item.id);
    if (usages.length > 0) {
      showToast(`Không thể xóa! Tệp này đang được sử dụng ở ${usages.length} vị trí trên website.`, 'error');
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

  const handleMoveSelectedToFolder = async (targetFolderId: string | null) => {
    if (selectedIds.length === 0) return;
    await mediaService.moveItemsToFolder(selectedIds, targetFolderId);
    showToast(`Đã chuyển ${selectedIds.length} tệp vào thư mục! ✓`, 'success');
    setSelectedIds([]);
    await refreshMediaList();
  };

  // Computations
  const totalSizeMB = items.reduce((acc, i) => acc + (i.file_size || 0), 0) / (1024 * 1024);
  const imageCount = items.filter((i) => i.mime_type.includes('image')).length;
  const audioCount = items.filter((i) => i.mime_type.includes('audio')).length;
  const videoCount = items.filter((i) => i.mime_type.includes('video')).length;
  const pdfCount = items.filter((i) => i.mime_type.includes('pdf')).length;

  return (
    <div className={styles.container}>
      {/* LEVEL 1: ROOT FOLDERS DIRECTORY VIEW */}
      {!currentFolder ? (
        <>
          {/* Header */}
          <div className={styles.pageHeader}>
            <div>
              <h1 className={styles.pageTitle}>
                <FolderOpen color="#F58220" size={28} /> Thư viện hệ thống
              </h1>
              <p className={styles.pageSubtitle}>
                Quản lý thư mục và tài nguyên hệ thống
              </p>
            </div>
          </div>

          {/* Root Statistics Bar - ONLY 2 STATS */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div>
                <div className={styles.statValue}>{totalSizeMB.toFixed(1)} MB</div>
                <div className={styles.statLabel}>Dung lượng sử dụng</div>
              </div>
              <Layers size={32} color="#3b82f6" />
            </div>

            <div className={styles.statCard}>
              <div>
                <div className={styles.statValue}>{folders.length}</div>
                <div className={styles.statLabel}>Số lượng thư mục</div>
              </div>
              <Folder size={32} color="#F58220" />
            </div>
          </div>

            {/* Root Folders Section */}
          <div className={styles.folderSection}>
            <div className={styles.folderSectionHeader}>
              {/* TOP LEFT BUTTON & SEARCH */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                <button type="button" onClick={handleOpenCreateFolderModal} className={styles.createFolderBtn}>
                  <FolderPlus size={18} /> Thư Mục Mới
                </button>

                <div className={styles.searchBox} style={{ maxWidth: '260px' }}>
                  <Search size={15} className={styles.searchIcon} />
                  <input
                    type="text"
                    placeholder="Tìm kiếm thư mục..."
                    value={folderSearchQuery}
                    onChange={(e) => setFolderSearchQuery(e.target.value)}
                    className={styles.searchInput}
                  />
                </div>
              </div>

              {/* TOP RIGHT BUTTONS */}
              <div className={styles.folderRightActions}>
                {selectedFolder && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleDownloadFolder(selectedFolder)}
                      className={styles.actionPillBtn}
                      title="Tải toàn bộ tệp trong thư mục về máy"
                    >
                      <Download size={15} /> Tải xuống
                    </button>
                    {selectedFolder.id !== 'root' && (
                      <>
                        <button
                          type="button"
                          onClick={(e) => handleOpenEditFolderModal(selectedFolder, e)}
                          className={styles.actionPillBtn}
                          title="Đổi tên & sửa màu thư mục"
                        >
                          <Edit2 size={15} /> Đổi tên
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteFolderCandidate(selectedFolder);
                          }}
                          className={styles.actionPillBtn}
                          style={{ color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                          title="Xóa thư mục"
                        >
                          <Trash2 size={15} /> Xóa
                        </button>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Folders Grid Cards */}
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

                return displayFolders.map((folder) => {
                  const isSelected = selectedFolder?.id === folder.id;
                  const isRoot = folder.id === 'root';
                  return (
                    <div
                      key={folder.id}
                      className={`${styles.folderCard} ${isSelected ? styles.folderCardActive : ''}`}
                      onClick={() => setSelectedFolder(folder)}
                      onDoubleClick={() => {
                        setCurrentFolder(folder);
                        setPage(1);
                      }}
                    >
                      <div className={styles.folderInfo}>
                        <div className={styles.folderIcon}>
                          <Folder color={folder.color || '#F58220'} size={24} />
                        </div>
                        <div>
                          <div className={styles.folderName} title={folder.name}>
                            {folder.name}
                          </div>
                          <div className={styles.folderCount}>{folder.item_count || 0} tệp</div>
                        </div>
                      </div>

                      {!isRoot && (
                        <div className={styles.folderActions}>
                          <button
                            type="button"
                            onClick={(e) => handleOpenEditFolderModal(folder, e)}
                            className={styles.folderActionBtn}
                            title="Đổi tên"
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
                            title="Xóa"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </>
      ) : (
        /* LEVEL 2: INSIDE SPECIFIC FOLDER VIEW */
        <>
          {/* Back & Breadcrumb Header */}
          <div className={styles.folderBreadcrumbHeader}>
            <button
              type="button"
              onClick={() => {
                setCurrentFolder(null);
                setSearchQuery('');
                setPage(1);
              }}
              className={styles.backBtn}
            >
              <ArrowLeft size={18} /> Quay lại danh sách thư mục
            </button>
            <div className={styles.currentFolderTitle}>
              <Folder color={currentFolder.color || '#F58220'} size={24} /> Thư mục: {currentFolder.name}
            </div>
          </div>

          {/* Folder Internal Statistics Bar */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div>
                <div className={styles.statValue}>{totalSizeMB.toFixed(1)} MB</div>
                <div className={styles.statLabel}>Dung lượng thư mục</div>
              </div>
              <HardDrive size={32} color="#F58220" />
            </div>

            <div className={styles.statCard}>
              <div>
                <div className={styles.statValue}>{totalItems} Tệp</div>
                <div className={styles.statLabel}>
                  {imageCount} Ảnh • {videoCount} Video • {audioCount} Audio • {pdfCount} PDF
                </div>
              </div>
              <Layers size={32} color="#10b981" />
            </div>
          </div>

          {/* File Action Bar: Top-Left + Add File, Top-Right + Edit / Delete / Download Folder */}
          <div className={styles.folderActionToolbar}>
            {/* TOP LEFT BUTTON */}
            <div className={styles.toolbarLeft}>
              <input
                type="file"
                ref={fileInputRef}
                multiple
                accept="image/*,video/*,audio/*,.pdf,.svg"
                onChange={(e) => e.target.files && handleUploadFiles(e.target.files)}
                style={{ display: 'none' }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={styles.uploadTriggerBtn}
              >
                <Upload size={18} /> Tải tệp lên từ máy
              </button>
            </div>

            {/* TOP RIGHT BUTTONS */}
            <div className={styles.toolbarRight}>
              <button
                type="button"
                onClick={() => handleDownloadFolder(currentFolder)}
                className={styles.actionPillBtn}
              >
                <Download size={16} /> Tải xuống thư mục
              </button>
              {currentFolder.id !== 'root' && (
                <>
                  <button
                    type="button"
                    onClick={() => handleOpenEditFolderModal(currentFolder)}
                    className={styles.actionPillBtn}
                  >
                    <Edit2 size={16} /> Chỉnh sửa thư mục
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteFolderCandidate(currentFolder)}
                    className={styles.actionPillBtn}
                    style={{ color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.4)' }}
                  >
                    <Trash2 size={16} /> Xóa thư mục
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Dropzone area for dragging files directly inside this folder */}
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
              Kéo & thả tệp tại đây (jpg, mp4, mp3,...)
            </div>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              Tối đa 10MB/tệp
            </div>
          </div>

          {/* Files Filters & Search */}
          <div className={styles.toolbarCard}>
            <div className={styles.topFilterRow}>
              <div className={styles.searchBox}>
                <Search size={18} className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Tìm kiếm file trong thư mục này..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.searchInput}
                />
              </div>

              <div className={styles.filterControls}>
                <Select
                  options={[
                    { value: 'all', label: 'Tất cả loại tệp' },
                    { value: 'image', label: 'Hình ảnh (JPG, PNG, WEBP)' },
                    { value: 'svg', label: 'Vector SVG' },
                    { value: 'gif', label: 'Ảnh động GIF' },
                    { value: 'pdf', label: 'Tài liệu PDF' },
                  ]}
                  value={fileType}
                  onChange={(val) => {
                    setFileType(val);
                    setPage(1);
                  }}
                  triggerStyle={{ minWidth: '175px' }}
                />

                <Select
                  options={[
                    { value: 'all', label: 'Tất cả trạng thái' },
                    { value: 'used', label: 'Đang được sử dụng' },
                    { value: 'unused', label: 'Chưa sử dụng' },
                    { value: 'archived', label: 'Đã lưu trữ' },
                  ]}
                  value={usageStatus}
                  onChange={(val) => {
                    setUsageStatus(val as 'all' | 'used' | 'unused' | 'archived');
                    setPage(1);
                  }}
                  triggerStyle={{ minWidth: '170px' }}
                />

                <Select
                  options={[
                    { value: 'newest', label: 'Mới nhất trước' },
                    { value: 'oldest', label: 'Cũ nhất trước' },
                    { value: 'name-asc', label: 'Tên A-Z' },
                    { value: 'name-desc', label: 'Tên Z-A' },
                    { value: 'size-desc', label: 'Dung lượng lớn trước' },
                  ]}
                  value={sortBy}
                  onChange={(val) =>
                    setSortBy(
                      val as
                        | 'newest'
                        | 'oldest'
                        | 'name-asc'
                        | 'name-desc'
                        | 'size-desc'
                        | 'size-asc'
                    )
                  }
                  triggerStyle={{ minWidth: '170px' }}
                />

                <div className={styles.viewToggleGroup}>
                  <button
                    type="button"
                    className={`${styles.viewToggleBtn} ${viewMode === 'grid' ? styles.viewToggleActive : ''}`}
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid size={16} /> Lưới
                  </button>
                  <button
                    type="button"
                    className={`${styles.viewToggleBtn} ${viewMode === 'list' ? styles.viewToggleActive : ''}`}
                    onClick={() => setViewMode('list')}
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
                  <Select
                    options={[
                      { value: '', label: '📁 Chuyển sang thư mục khác...' },
                      { value: 'root', label: '📁 Chuyển về Thư mục gốc' },
                      ...folders
                        .filter((f) => f.id !== currentFolder.id)
                        .map((f) => ({ value: f.id, label: `📁 ${f.name}` })),
                    ]}
                    value=""
                    onChange={(val) => {
                      if (!val) return;
                      const targetF = val === 'root' ? null : val;
                      handleMoveSelectedToFolder(targetF);
                    }}
                    placeholder="📁 Chuyển sang thư mục..."
                    triggerStyle={{ minWidth: '220px' }}
                  />

                  <Button variant="secondary" size="sm" icon={<Archive size={15} />} onClick={handleBulkArchive}>
                    Lưu trữ
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Workspace Files Grid vs List */}
          {viewMode === 'grid' ? (
            <div className={styles.gridWorkspace}>
              {items.map((item) => {
                const isSelected = selectedIds.includes(item.id);
                const isPdf = item.mime_type.includes('pdf');
                const isAudio = item.mime_type.includes('audio');
                const isVideo = item.mime_type.includes('video');

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
                      ) : isAudio ? (
                        <Music size={48} color="#8b5cf6" />
                      ) : isVideo ? (
                        <Video size={48} color="#3b82f6" />
                      ) : (
                        <img
                          src={item.public_url}
                          alt={item.default_alt_vi || item.original_filename}
                          className={styles.cardImg}
                        />
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
                        <span>{item.width ? `${item.width}x${item.height}` : item.mime_type.split('/')[1]?.toUpperCase()}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
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
                    <th>Xem trước</th>
                    <th>Tên tệp</th>
                    <th>Định dạng</th>
                    <th>Kích thước</th>
                    <th>Dung lượng</th>
                    <th>Sử dụng</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => {
                    const isSelected = selectedIds.includes(item.id);
                    const isPdf = item.mime_type.includes('pdf');
                    const isAudio = item.mime_type.includes('audio');
                    const isVideo = item.mime_type.includes('video');

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
                            <FileText size={28} color="#F58220" />
                          ) : isAudio ? (
                            <Music size={28} color="#8b5cf6" />
                          ) : isVideo ? (
                            <Video size={28} color="#3b82f6" />
                          ) : (
                            <img src={item.public_url} alt={item.original_filename} className={styles.listThumb} />
                          )}
                        </td>
                        <td>
                          <div style={{ fontWeight: 700 }}>{item.original_filename}</div>
                        </td>
                        <td>{item.mime_type.split('/')[1]?.toUpperCase()}</td>
                        <td>{item.width ? `${item.width}x${item.height}px` : 'N/A'}</td>
                        <td>{(item.file_size / 1024).toFixed(0)} KB</td>
                        <td>
                          <span style={{ color: (item.usage_count || 0) > 0 ? '#10b981' : '#94a3b8', fontWeight: 600 }}>
                            {item.usage_count || 0} vị trí
                          </span>
                        </td>
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
        </>
      )}

      {/* Side Drawer Asset Details Panel */}
      {activeDrawerAsset && (
        <div className={styles.drawerOverlay} onClick={() => setActiveDrawerAsset(null)}>
          <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
            <div className={styles.drawerHeader}>
              <h3 className={styles.drawerTitle}>Chi tiết & metadata tài nguyên</h3>
              <button type="button" onClick={() => setActiveDrawerAsset(null)} className={styles.closeBtn}>
                <X size={20} />
              </button>
            </div>

            <div className={styles.drawerBody}>
              <div className={styles.drawerPreviewBox}>
                {activeDrawerAsset.mime_type.includes('pdf') ? (
                  <FileText size={64} color="#F58220" />
                ) : activeDrawerAsset.mime_type.includes('audio') ? (
                  <Music size={64} color="#8b5cf6" />
                ) : activeDrawerAsset.mime_type.includes('video') ? (
                  <Video size={64} color="#3b82f6" />
                ) : (
                  <img
                    src={activeDrawerAsset.public_url}
                    alt={activeDrawerAsset.default_alt_vi || activeDrawerAsset.original_filename}
                    className={styles.drawerImg}
                  />
                )}
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  fullWidth
                  icon={<Copy size={15} />}
                  onClick={() => handleCopyUrl(activeDrawerAsset.public_url)}
                >
                  Sao chép URL CDN
                </Button>

                {activeDrawerAsset.mime_type.includes('image') && (
                  <Button
                    type="button"
                    variant="primary"
                    size="md"
                    fullWidth
                    icon={<Edit2 size={15} />}
                    onClick={() => {
                      setCropperCandidate(activeDrawerAsset);
                      setIsCropperOpen(true);
                    }}
                  >
                    Cắt & tâm điểm
                  </Button>
                )}
              </div>

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
                      : activeDrawerAsset.mime_type.toUpperCase()}
                  </span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaKey}>Dung lượng:</span>
                  <span className={styles.metaVal}>
                    {(activeDrawerAsset.file_size / 1024).toFixed(0)} KB
                  </span>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <FolderInput size={15} /> Thư mục lưu trữ:
                </label>
                <Select
                  options={[
                    { value: '', label: '📁 Thư mục gốc (Uncategorized)' },
                    ...folders.map((f) => ({ value: f.id, label: `📁 ${f.name}` })),
                  ]}
                  value={editFolderId || ''}
                  onChange={(val) => setEditFolderId(val ? val : null)}
                  fullWidth
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Default Alt Text (tiếng Việt) *</label>
                <input
                  type="text"
                  value={editAltVi}
                  onChange={(e) => setEditAltVi(e.target.value)}
                  className={styles.input}
                  placeholder="Mô tả hình ảnh bằng tiếng Việt cho Google SEO..."
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Default Alt Text (tiếng Anh)</label>
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

              <div className={styles.usageBox}>
                <div className={styles.usageHeader}>
                  <Eye size={16} /> Lịch sử sử dụng ({activeAssetUsages.length} vị trí)
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
              <Button
                variant="danger"
                size="md"
                icon={<Trash2 size={16} />}
                onClick={() => handleRequestDelete(activeDrawerAsset)}
              >
                Xóa vĩnh viễn
              </Button>

              <Button
                variant="primary"
                size="md"
                icon={<Save size={16} />}
                onClick={handleSaveMetadata}
              >
                Lưu Metadata
              </Button>
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
                <FolderPlus size={20} color="#F58220" /> {editingFolder ? 'Đổi tên thư mục' : 'Tạo thư mục media mới'}
              </h3>
              <button type="button" onClick={() => setIsFolderModalOpen(false)} className={styles.closeBtn}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveFolder} className={styles.drawerBody}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Tên thư mục *</label>
                <input
                  type="text"
                  value={folderNameInput}
                  onChange={(e) => setFolderNameInput(e.target.value)}
                  className={styles.input}
                  placeholder="VD: Bài viết tin tức, ảnh giáo viên..."
                  autoFocus
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Màu nhận diện thư mục</label>
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
                  Hủy bỏ
                </button>
                <button type="submit" className={styles.uploadTriggerBtn}>
                  <Save size={16} /> {editingFolder ? 'Lưu đổi tên' : 'Tạo thư mục'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Folder Confirm Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteFolderCandidate)}
        title="Xác nhận xóa thư mục"
        message={`Bạn có chắc chắn muốn xóa thư mục "${deleteFolderCandidate?.name}"? Các tệp bên trong sẽ được chuyển về Thư mục Gốc an toàn.`}
        confirmLabel="Xóa thư mục"
        cancelLabel="Hủy bỏ"
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
                <ShieldAlert size={20} /> Phát hiện tệp trùng lặp (Deduplication)
              </h3>
            </div>

            <div className={styles.drawerBody}>
              <p style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: 1.6 }}>
                Tệp <strong>{duplicateWarning.file.name}</strong> trùng 100% SHA-256 với tệp{' '}
                <strong>{duplicateWarning.existingAsset.original_filename}</strong> trong Thư viện.
              </p>
            </div>

            <div className={styles.drawerFooter}>
              <button type="button" onClick={() => setDuplicateWarning(null)} className={styles.resetBtn}>
                Hủy bỏ tải lên
              </button>
              <button
                type="button"
                onClick={() => {
                  handleOpenDrawer(duplicateWarning.existingAsset);
                  setDuplicateWarning(null);
                }}
                className={styles.uploadTriggerBtn}
              >
                Sử dụng tệp có sẵn
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteCandidate)}
        title="Xác nhận xóa vĩnh viễn tệp media"
        message={`Bạn có chắc chắn muốn xóa vĩnh viễn tệp "${deleteCandidate?.original_filename}" khỏi hệ thống?`}
        confirmLabel="Xóa vĩnh viễn"
        cancelLabel="Hủy bỏ"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteCandidate(null)}
      />
    </div>
  );
};
