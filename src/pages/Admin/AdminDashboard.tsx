import React, { useState, useMemo } from 'react';
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
  type DynamicNewsItem,
  type PostStatus
} from '../../services/newsService';
import { PostEditModal } from '../../components/Admin/PostEditModal';
import { PostPreviewModal } from '../../components/Admin/PostPreviewModal';
import { ConfirmModal } from '../../components/ConfirmModal/ConfirmModal';
import { useToast } from '../../components/Toast/Toast';
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
    if (editingPost) {
      updateNewsPost(editingPost.id, postData);
      showToast('Đã lưu thay đổi bài viết thành công! ✓', 'success');
    } else {
      createNewsPost(postData as Omit<DynamicNewsItem, 'id' | 'createdAt' | 'updatedAt' | 'isCustom'>);
      showToast('Đã đăng bài viết mới thành công! ✓', 'success');
    }
    loadPosts();
  };

  // Delete handler
  const handleConfirmDelete = () => {
    if (deleteCandidateId) {
      deleteNewsPost(deleteCandidateId);
      showToast('Đã xóa bài viết thành công!', 'info');
      setDeleteCandidateId(null);
      loadPosts();
    }
  };

  return (
    <div className={styles.container}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Quản Lý Bài Viết & Tin Tức</h1>
          <p className={styles.pageSubtitle}>Quản lý, chỉnh sửa, xem trước và xuất bản tin tức iCANCAM</p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingPost(null);
            setIsEditModalOpen(true);
          }}
          className={styles.createBtn}
        >
          <Plus size={18} /> Thêm Bài Viết Mới
        </button>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div>
            <div className={styles.statValue}>{stats.total}</div>
            <div className={styles.statLabel}>Tổng Bài Viết</div>
          </div>
          <div className={styles.statIcon}>
            <FileText size={24} />
          </div>
        </div>

        <div className={styles.statCard}>
          <div>
            <div className={styles.statValue}>{stats.published}</div>
            <div className={styles.statLabel}>Đã Xuất Bản</div>
          </div>
          <div className={styles.statIcon} style={{ color: '#10b981' }}>
            <CheckCircle size={24} />
          </div>
        </div>

        <div className={styles.statCard}>
          <div>
            <div className={styles.statValue}>{stats.drafts}</div>
            <div className={styles.statLabel}>Bản Nháp (Drafts)</div>
          </div>
          <div className={styles.statIcon} style={{ color: '#F58220' }}>
            <Clock size={24} />
          </div>
        </div>

        <div className={styles.statCard}>
          <div>
            <div className={styles.statValue}>{stats.categories}</div>
            <div className={styles.statLabel}>Danh Mục Nổi Bật</div>
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
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={styles.selectFilter}
          >
            <option value="all">Tất cả Danh mục</option>
            <option value="events">Sự kiện nổi bật</option>
            <option value="scholarship">Học bổng & Thành tích</option>
            <option value="tips">Bí quyết Tiếng Anh</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as PostStatus | 'all')}
            className={styles.selectFilter}
          >
            <option value="all">Tất cả Trạng thái</option>
            <option value="published">Đã xuất bản (Published)</option>
            <option value="draft">Bản nháp (Draft)</option>
            <option value="archived">Lưu trữ (Archived)</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'alphabetical')}
            className={styles.selectFilter}
          >
            <option value="newest">Mới nhất trước</option>
            <option value="oldest">Cũ nhất trước</option>
            <option value="alphabetical">Xếp theo A-Z</option>
          </select>
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
            <button
              type="button"
              onClick={() => {
                setEditingPost(null);
                setIsEditModalOpen(true);
              }}
              className={styles.createBtn}
            >
              <Plus size={18} /> Tạo Bài Viết Đầu Tiên
            </button>
          </div>
        ) : (
          <table className={styles.postsTable}>
            <thead>
              <tr>
                <th>Hình ảnh</th>
                <th>Tiêu đề & Slug</th>
                <th>Danh mục</th>
                <th>Trạng thái</th>
                <th>Ngày cập nhật</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id}>
                  <td>
                    <img src={post.image} alt={post.title} className={styles.postThumb} />
                  </td>
                  <td>
                    <div style={{ fontWeight: 700 }}>{post.title}</div>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>/{post.slug}</div>
                  </td>
                  <td>
                    <span className={styles.badgeCategory}>{post.categoryLabel}</span>
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
                    <div className={styles.actionsCell}>
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewPostData(post);
                          setIsPreviewOpen(true);
                        }}
                        className={styles.actionBtn}
                        title="Xem trước"
                      >
                        <Eye size={15} />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setEditingPost(post);
                          setIsEditModalOpen(true);
                        }}
                        className={styles.actionBtn}
                        title="Chỉnh sửa"
                      >
                        <Edit2 size={15} /> Sửa
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteCandidateId(post.id)}
                        className={`${styles.actionBtn} ${styles.actionDelete}`}
                        title="Xóa bài"
                      >
                        <Trash2 size={15} /> Xóa
                      </button>
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
        confirmLabel="Xóa Vĩnh Viễn"
        cancelLabel="Hủy Bỏ"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteCandidateId(null)}
      />
    </div>
  );
};
