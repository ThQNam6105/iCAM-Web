import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import footerLogo from '../../assets/footer-logo.jpg';
import {
  getNewsPosts,
  addNewsPost,
  deleteNewsPost,
  isAdminAuthenticated,
  logoutAdmin,
  type DynamicNewsItem
} from '../../services/newsService';
import styles from './AdminDashboard.module.css';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<DynamicNewsItem[]>(() => getNewsPosts());
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New post form state
  const [title, setTitle] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [category, setCategory] = useState<'events' | 'scholarship' | 'tips'>('events');
  const [categoryLabel, setCategoryLabel] = useState('SỰ KIỆN NỔI BẬT');
  const [categoryLabelEn, setCategoryLabelEn] = useState('FEATURED EVENT');
  const [image, setImage] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [excerptEn, setExcerptEn] = useState('');
  const [content, setContent] = useState('');
  const [contentEn, setContentEn] = useState('');

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const loadPosts = () => {
    setPosts(getNewsPosts());
  };

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin/login');
  };

  const handleDelete = (id: string | number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này không?')) {
      deleteNewsPost(id);
      loadPosts();
    }
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !excerpt || !content) {
      alert('Vui lòng điền đầy đủ Tiêu đề, Tóm tắt và Nội dung bài viết!');
      return;
    }

    addNewsPost({
      title,
      titleEn: titleEn || title,
      category,
      categoryLabel,
      categoryLabelEn: categoryLabelEn || categoryLabel,
      date: new Date().toLocaleDateString('vi-VN'),
      url: '/news',
      image: image || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop',
      excerpt,
      excerptEn: excerptEn || excerpt,
      content,
      contentEn: contentEn || content,
    });

    // Reset form
    setTitle('');
    setTitleEn('');
    setImage('');
    setExcerpt('');
    setExcerptEn('');
    setContent('');
    setContentEn('');
    setIsModalOpen(false);
    loadPosts();
  };

  return (
    <div className={styles.dashboardWrapper}>
      {/* Top Header Bar */}
      <header className={styles.topBar}>
        <div className={styles.brandMeta}>
          <img src={footerLogo} alt="iCANCAM Logo" className={styles.logoImg} />
          <div>
            <h1 className={styles.dashboardTitle}>Bảng Quản Trị Bài Viết iCANCAM</h1>
            <p className={styles.dashboardSubtitle}>Đăng bài mới, xem và quản lý tin tức - sự kiện</p>
          </div>
        </div>

        <div className={styles.topActions}>
          <button onClick={() => setIsModalOpen(true)} className={styles.newPostBtn}>
            + Đăng Bài Viết Mới
          </button>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            Đăng Xuất
          </button>
        </div>
      </header>

      {/* Main Posts Table */}
      <main className={styles.mainContainer}>
        <div className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <h2 className={styles.tableTitle}>Danh Sách Bài Viết ({posts.length})</h2>
          </div>

          <table className={styles.postsTable}>
            <thead>
              <tr>
                <th>Hình ảnh</th>
                <th>Tiêu đề</th>
                <th>Danh mục</th>
                <th>Ngày đăng</th>
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
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{post.titleEn}</div>
                  </td>
                  <td>
                    <span className={styles.badgeCategory}>{post.categoryLabel}</span>
                  </td>
                  <td>{post.date}</td>
                  <td>
                    {post.isCustom ? (
                      <button onClick={() => handleDelete(post.id)} className={styles.deleteBtn}>
                        Xóa Bài
                      </button>
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Mặc định</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Create New Post Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 className={styles.modalTitle}>Thêm Bài Viết Mới</h2>

            <form onSubmit={handleCreatePost} className={styles.formGrid}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Tiêu đề bài viết (Tiếng Việt) *</label>
                <input
                  type="text"
                  placeholder="Nhập tiêu đề Tiếng Việt..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Tiêu đề bài viết (Tiếng Anh - Tiêu chuẩn)</label>
                <input
                  type="text"
                  placeholder="Title in English..."
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Danh mục bài viết</label>
                <select
                  value={category}
                  onChange={(e) => {
                    const val = e.target.value as 'events' | 'scholarship' | 'tips';
                    setCategory(val);
                    if (val === 'events') {
                      setCategoryLabel('SỰ KIỆN NỔI BẬT');
                      setCategoryLabelEn('FEATURED EVENT');
                    } else if (val === 'scholarship') {
                      setCategoryLabel('HỌC BỔNG & THÀNH TÍCH');
                      setCategoryLabelEn('SCHOLARSHIP & ACHIEVEMENTS');
                    } else {
                      setCategoryLabel('BÍ QUYẾT TIẾNG ANH');
                      setCategoryLabelEn('ENGLISH TIPS');
                    }
                  }}
                  className={styles.select}
                >
                  <option value="events">SỰ KIỆN NỔI BẬT</option>
                  <option value="scholarship">HỌC BỔNG & THÀNH TÍCH</option>
                  <option value="tips">BÍ QUYẾT TIẾNG ANH</option>
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>URL Hình ảnh bài viết (Hình bìa)</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Tóm tắt bài viết (Tiếng Việt) *</label>
                <textarea
                  rows={2}
                  placeholder="Tóm tắt nội dung ngắn gọn..."
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className={styles.textarea}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Tóm tắt bài viết (Tiếng Anh)</label>
                <textarea
                  rows={2}
                  placeholder="Short excerpt in English..."
                  value={excerptEn}
                  onChange={(e) => setExcerptEn(e.target.value)}
                  className={styles.textarea}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Nội dung chi tiết bài viết (Tiếng Việt) *</label>
                <textarea
                  rows={5}
                  placeholder="Nhập nội dung đầy đủ..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className={styles.textarea}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Nội dung chi tiết bài viết (Tiếng Anh)</label>
                <textarea
                  rows={4}
                  placeholder="Full article content in English..."
                  value={contentEn}
                  onChange={(e) => setContentEn(e.target.value)}
                  className={styles.textarea}
                />
              </div>

              <div className={styles.modalActions}>
                <button type="button" onClick={() => setIsModalOpen(false)} className={styles.cancelBtn}>
                  Hủy Bỏ
                </button>
                <button type="submit" className={styles.saveBtn}>
                  Đăng Bài Ngay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
