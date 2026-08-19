import React, { useState, useEffect, useMemo } from 'react';
import {
  FileText,
  CheckCircle,
  Clock,
  FolderTree,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  Inbox
} from 'lucide-react';
import {
  getAllNewsPosts,
  getFilteredNewsPosts,
  createNewsPost,
  updateNewsPost,
  deleteNewsPost,
  fetchPostsFromSupabase,
  syncAllLocalPostsToSupabase,
  type DynamicNewsItem,
  type PostStatus
} from '../../services/newsService';
import { getCategories, fetchCategoriesFromSupabase } from '../../services/categoryService';
import { PostEditModal } from '../../components/Admin/PostEditModal';
import { PostPreviewModal } from '../../components/Admin/PostPreviewModal';
import { ConfirmModal } from '../../components/ConfirmModal/ConfirmModal';
import { useToast } from '../../components/Toast/Toast';
import { Button, Select, type SelectOption } from '../../components/Admin/UI';
import styles from './AdminDashboard.module.css';

export const AdminDashboard: React.FC = () => {
  const { showToast } = useToast();

  const [refreshKey, setRefreshKey] = useState(0);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<PostStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'alphabetical'>('newest');

  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<DynamicNewsItem | null>(null);

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewPostData, setPreviewPostData] = useState<DynamicNewsItem | null>(null);

  const [deleteCandidateId, setDeleteCandidateId] = useState<string | number | null>(null);

  const loadPosts = () => {
    setRefreshKey((prev) => prev + 1);
  };

  useEffect(() => {
    fetchPostsFromSupabase().then(() => {
      setRefreshKey((prev) => prev + 1);
    });
    fetchCategoriesFromSupabase();
    syncAllLocalPostsToSupabase();
  }, []);

  const allRawPosts = useMemo(() => {
    return getAllNewsPosts();
  }, [refreshKey]);

  const posts = useMemo(() => {
    return getFilteredNewsPosts({
      searchQuery,
      category: selectedCategory,
      status: selectedStatus,
      sortBy,
    });
  }, [searchQuery, selectedCategory, selectedStatus, sortBy, refreshKey]);

  // Options for UI Selects
  const categoryOptions = useMemo<SelectOption[]>(() => {
    const cats = getCategories();
    return [
      { value: 'all', label: 'Tất cả danh mục' },
      ...cats.map((cat) => ({
        value: cat.id || cat.slug,
        label: cat.nameVi,
      })),
    ];
  }, [refreshKey]);

  const statusOptions: SelectOption[] = useMemo(
    () => [
      { value: 'all', label: 'Tất cả trạng thái' },
      { value: 'published', label: 'Đã xuất bản' },
      { value: 'draft', label: 'Bản nháp' },
      { value: 'archived', label: 'Lưu trữ' },
    ],
    []
  );

  const sortOptions: SelectOption[] = useMemo(
    () => [
      { value: 'newest', label: 'Mới nhất trước' },
      { value: 'oldest', label: 'Cũ nhất trước' },
      { value: 'alphabetical', label: 'Xếp theo A-Z' },
    ],
    []
  );

  // Statistics calculation
  const stats = useMemo(() => {
    const total = allRawPosts.length;
    const published = allRawPosts.filter((p) => p.status === 'published').length;
    const drafts = allRawPosts.filter((p) => p.status === 'draft').length;
    const categories = new Set(allRawPosts.map((p) => p.category)).size;
    return { total, published, drafts, categories };
  }, [allRawPosts]);

  // Create or Update handler
  const handleSavePost = (postData: Partial<DynamicNewsItem>) => {
    try {
      const statusLabel =
        postData.status === 'published'
          ? 'Đã xuất bản'
          : postData.status === 'draft'
          ? 'Bản nháp'
          : 'Lưu trữ';

      if (editingPost) {
        updateNewsPost(editingPost.id, postData);
        showToast(`Đã lưu thay đổi bài viết thành công (${statusLabel})! ✓`, 'success');
      } else {
        createNewsPost(postData as Omit<DynamicNewsItem, 'id' | 'createdAt' | 'updatedAt' | 'isCustom'>);
        showToast(`Đã lưu & tạo bài viết mới thành công (${statusLabel})! ✓`, 'success');
      }

      // Reset filter so the newly saved post is visible in the list regardless of previous filter
      setSelectedStatus('all');
      loadPosts();
    } catch (err) {
      console.error('Error in handleSavePost:', err);
      showToast('Có lỗi xảy ra khi lưu bài viết!', 'error');
    }
  };

  // Delete handler
  const handleConfirmDelete = () => {
    if (deleteCandidateId) {
      deleteNewsPost(deleteCandidateId);
      showToast('Đã xóa bài viết thành công!', 'info');
      loadPosts();
    }
    setDeleteCandidateId(null);
  };

  return (
    <div className={styles.container}>
      {/* Top Header Row */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Quản lý bài viết tin tức</h1>
          <p className={styles.pageSubtitle}>
            Tổng quan nội dung tin tức, bài viết hoạt động trung tâm iCANCAM
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={<Plus size={18} />}
          onClick={() => {
            setEditingPost(null);
            setIsEditModalOpen(true);
          }}
        >
          Tạo bài viết mới
        </Button>
      </div>

      {/* Summary KPI Cards Grid */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div>
            <div className={styles.statValue}>{stats.total}</div>
            <div className={styles.statLabel}>Tổng số bài viết</div>
          </div>
          <div className={styles.statIcon}>
            <FileText size={24} />
          </div>
        </div>

        <div className={styles.statCard}>
          <div>
            <div className={styles.statValue}>{stats.published}</div>
            <div className={styles.statLabel}>Đã xuất bản</div>
          </div>
          <div className={styles.statIcon} style={{ color: '#10b981' }}>
            <CheckCircle size={24} />
          </div>
        </div>

        <div className={styles.statCard}>
          <div>
            <div className={styles.statValue}>{stats.drafts}</div>
            <div className={styles.statLabel}>Bản nháp</div>
          </div>
          <div className={styles.statIcon} style={{ color: '#F58220' }}>
            <Clock size={24} />
          </div>
        </div>

        <div className={styles.statCard}>
          <div>
            <div className={styles.statValue}>{getCategories().length}</div>
            <div className={styles.statLabel}>Danh mục nổi bật</div>
          </div>
          <div className={styles.statIcon} style={{ color: '#8b5cf6' }}>
            <FolderTree size={24} />
          </div>
        </div>
      </div>

      {/* Toolbar Filters & Search */}
      <div className={styles.toolbarCard}>
        <div className={styles.searchBox}>
          <Search size={18} />
          <input
            type="text"
            placeholder="Tìm kiếm bài viết theo tiêu đề, slug, danh mục..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filterControls}>
          <Select
            options={categoryOptions}
            value={selectedCategory}
            onChange={setSelectedCategory}
            triggerStyle={{ minWidth: '180px' }}
          />

          <Select
            options={statusOptions}
            value={selectedStatus}
            onChange={(val) => setSelectedStatus(val as PostStatus | 'all')}
            triggerStyle={{ minWidth: '170px' }}
          />

          <Select
            options={sortOptions}
            value={sortBy}
            onChange={(val) => setSortBy(val as 'newest' | 'oldest' | 'alphabetical')}
            triggerStyle={{ minWidth: '170px' }}
          />
        </div>
      </div>

      {/* Posts Table or Empty State */}
      <div className={styles.tableCard}>
        {posts.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <Inbox size={32} />
            </div>
            <h3 className={styles.emptyTitle}>Chưa tìm thấy bài viết nào</h3>
            <p className={styles.emptyDesc}>
              Không có bài viết nào phù hợp với bộ lọc hiện tại. Vui lòng thử tìm kiếm từ khóa khác hoặc tạo bài viết mới.
            </p>
            <Button
              variant="primary"
              size="md"
              icon={<Plus size={18} />}
              onClick={() => {
                setEditingPost(null);
                setIsEditModalOpen(true);
              }}
            >
              Tạo bài viết đầu tiên
            </Button>
          </div>
        ) : (
          <table className={styles.postsTable}>
            <thead>
              <tr>
                <th>Hình ảnh</th>
                <th>Tiêu đề</th>
                <th>Danh mục</th>
                <th>Trạng thái</th>
                <th>Ngày cập nhật</th>
                <th style={{ textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id}>
                  <td>
                    <img
                      src={post.image || 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d'}
                      alt={post.title}
                      className={styles.postThumb}
                    />
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: '#ffffff' }}>{post.title}</div>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>/{post.slug}</div>
                  </td>
                  <td>
                    {(() => {
                      const allCats = getCategories();
                      const matchedCat = allCats.find(
                        (c) =>
                          c.id === post.category ||
                          c.slug === post.category ||
                          c.nameVi === post.categoryLabel
                      );
                      const displayLabel = matchedCat ? matchedCat.nameVi : (post.categoryLabel === 'SỰ KIỆN NỔI BẬT' ? 'SỰ KIỆN' : post.categoryLabel);
                      const displayColor = matchedCat?.color || '#F58220';

                      return (
                        <span
                          className={styles.badgeCategory}
                          style={{ backgroundColor: displayColor, color: '#ffffff' }}
                        >
                          {displayLabel || 'TIN TỨC'}
                        </span>
                      );
                    })()}
                  </td>
                  <td>
                    <span
                      className={`${styles.statusBadge} ${
                        post.status === 'published'
                          ? styles.statusPublished
                          : post.status === 'draft'
                          ? styles.statusDraft
                          : styles.statusArchived
                      }`}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                    {new Date(post.updatedAt || post.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td>
                    <div className={styles.actionsCell} style={{ justifyContent: 'flex-end' }}>
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={<Eye size={15} />}
                        onClick={() => {
                          setPreviewPostData(post);
                          setIsPreviewOpen(true);
                        }}
                        title="Xem trước"
                      />

                      <Button
                        variant="secondary"
                        size="sm"
                        icon={<Edit2 size={15} />}
                        onClick={() => {
                          setEditingPost(post);
                          setIsEditModalOpen(true);
                        }}
                        title="Chỉnh sửa"
                      >
                        Sửa
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        icon={<Trash2 size={15} />}
                        onClick={() => setDeleteCandidateId(post.id)}
                        title="Xóa bài"
                      >
                        Xóa
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Edit & Create Modal */}
      <PostEditModal
        key={editingPost ? String(editingPost.id) : 'new_post'}
        isOpen={isEditModalOpen}
        postToEdit={editingPost}
        onSave={handleSavePost}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingPost(null);
        }}
      />

      {/* Single Post Preview Modal */}
      <PostPreviewModal
        isOpen={isPreviewOpen}
        post={previewPostData || {}}
        onClose={() => {
          setIsPreviewOpen(false);
          setPreviewPostData(null);
        }}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmModal
        isOpen={deleteCandidateId !== null}
        title="Xác nhận xóa bài viết"
        message="Hành động này sẽ xóa vĩnh viễn bài viết khỏi hệ thống và không thể hoàn tác. Bạn có chắc chắn muốn xóa?"
        confirmLabel="Xóa vĩnh viễn"
        cancelLabel="Hủy bỏ"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteCandidateId(null)}
      />
    </div>
  );
};
