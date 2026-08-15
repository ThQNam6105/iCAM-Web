import React, { useState, useEffect, useMemo } from 'react';
import {
  HelpCircle,
  Plus,
  Search,
  FolderTree,
  Inbox,
  Globe,
  Edit2,
  Trash2,
  Pin,
  Clock,
  Eye,
} from 'lucide-react';
import {
  type FaqItem,
  getAllFaqs,
  getAllFaqCategories,
  fetchFaqsFromSupabase,
  createFaq,
  updateFaq,
  deleteFaq,
} from '../../services/faqService';
import {
  type UserQuestionItem,
  getAllUserQuestions,
  fetchUserQuestionsFromSupabase,
  getStatusBadgeLabel,
} from '../../services/questionService';

import { FaqEditModal } from '../../components/Admin/FaqEditModal';
import { QuestionReviewModal } from '../../components/Admin/QuestionReviewModal';
import { FaqCategoryManagerModal } from '../../components/Admin/FaqCategoryManagerModal';
import { ConfirmModal } from '../../components/ConfirmModal/ConfirmModal';
import { useToast } from '../../components/Toast/Toast';
import { Button, Select } from '../../components/Admin/UI';
import styles from './AdminFAQ.module.css';

export const AdminFAQ: React.FC = () => {
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'inbox' | 'faqs'>('inbox');
  const [refreshKey, setRefreshKey] = useState(0);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFaqStatus, setSelectedFaqStatus] = useState<string>('all');
  const [selectedInboxStatus, setSelectedInboxStatus] = useState<string>('all');

  // Modals state
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const [isQuestionReviewOpen, setIsQuestionReviewOpen] = useState(false);

  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<UserQuestionItem | null>(null);
  const [prefillQuestionText, setPrefillQuestionText] = useState<string>('');
  const [deleteFaqCandidateId, setDeleteFaqCandidateId] = useState<string | null>(null);

  const reloadData = () => {
    setRefreshKey((prev) => prev + 1);
  };

  useEffect(() => {
    fetchFaqsFromSupabase().then(() => reloadData());
    fetchUserQuestionsFromSupabase().then(() => reloadData());
  }, []);

  const categories = useMemo(() => getAllFaqCategories(), [refreshKey]);
  const faqsList = useMemo(() => getAllFaqs(), [refreshKey]);
  const userQuestionsList = useMemo(() => getAllUserQuestions(), [refreshKey]);

  const pendingQuestionsCount = useMemo(() => {
    return userQuestionsList.filter((q) => q.status === 'pending').length;
  }, [userQuestionsList]);

  // Filtered FAQs
  const filteredFaqs = useMemo(() => {
    return faqsList.filter((faq) => {
      const matchSearch =
        faq.questionVi.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (faq.questionEn && faq.questionEn.toLowerCase().includes(searchQuery.toLowerCase())) ||
        faq.answerVi.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCat = selectedCategory === 'all' || faq.categoryId === selectedCategory;
      const matchStatus = selectedFaqStatus === 'all' || faq.status === selectedFaqStatus;

      return matchSearch && matchCat && matchStatus;
    });
  }, [faqsList, searchQuery, selectedCategory, selectedFaqStatus]);

  // Filtered Inbox Questions
  const filteredQuestions = useMemo(() => {
    return userQuestionsList.filter((q) => {
      const matchSearch =
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.contactValue.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus = selectedInboxStatus === 'all' || q.status === selectedInboxStatus;

      return matchSearch && matchStatus;
    });
  }, [userQuestionsList, searchQuery, selectedInboxStatus]);

  // Handlers
  const handleSaveFaq = (data: Partial<FaqItem>) => {
    if (editingFaq) {
      updateFaq(editingFaq.id, data);
      showToast('Cập nhật bài FAQ thành công! ✓', 'success');
    } else {
      createFaq(
        data as Omit<FaqItem, 'id' | 'createdAt' | 'updatedAt' | 'helpfulCount' | 'unhelpfulCount'>
      );
      showToast('Tạo bài FAQ mới thành công! ✓', 'success');
    }
    setEditingFaq(null);
    setPrefillQuestionText('');
    reloadData();
  };

  const handleConfirmDeleteFaq = () => {
    if (deleteFaqCandidateId) {
      deleteFaq(deleteFaqCandidateId);
      showToast('Đã xóa bài FAQ khỏi hệ thống!', 'info');
      setDeleteFaqCandidateId(null);
      reloadData();
    }
  };

  const handleTogglePin = (faq: FaqItem) => {
    updateFaq(faq.id, { isPinned: !faq.isPinned });
    showToast(faq.isPinned ? 'Đã bỏ ghim câu hỏi!' : 'Đã ghim câu hỏi lên ưu tiên trang FAQ! 📌', 'info');
    reloadData();
  };

  const handleConvertToFaq = (questionText: string) => {
    setEditingFaq(null);
    setPrefillQuestionText(questionText);
    setIsFaqModalOpen(true);
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <h1 className={styles.pageTitle}>
            <HelpCircle size={26} color="#F58220" /> Hỏi đáp & Hộp thư tiếp nhận
          </h1>
          <span className={styles.pageSub}>
            Quản lý câu hỏi từ khách hàng và hệ thống bài tri thức FAQ công khai
          </span>
        </div>

        <div className={styles.headerBtnGroup}>
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={() => setIsDeptModalOpen(true)}
            icon={<FolderTree size={16} />}
          >
            Quản lý danh mục
          </Button>

          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={() => {
              setEditingFaq(null);
              setPrefillQuestionText('');
              setIsFaqModalOpen(true);
            }}
            icon={<Plus size={16} />}
          >
            Tạo FAQ mới
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className={styles.tabsContainer}>
        <button
          type="button"
          onClick={() => setActiveTab('inbox')}
          className={`${styles.tabBtn} ${activeTab === 'inbox' ? styles.tabActive : ''}`}
        >
          <Inbox size={18} />
          <span>Hộp thư câu hỏi khách hàng</span>
          {pendingQuestionsCount > 0 && (
            <span className={styles.badgePending}>{pendingQuestionsCount}</span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('faqs')}
          className={`${styles.tabBtn} ${activeTab === 'faqs' ? styles.tabActive : ''}`}
        >
          <Globe size={18} />
          <span>Thư viện FAQ công khai ({faqsList.length})</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className={styles.filterBar}>
        <div className={styles.searchBox}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="text"
            placeholder={
              activeTab === 'inbox'
                ? 'Tìm kiếm theo tên khách, SĐT, nội dung câu hỏi...'
                : 'Tìm kiếm tiêu đề câu hỏi, nội dung câu trả lời FAQ...'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        {activeTab === 'faqs' ? (
          <>
            <Select
              options={[
                { value: 'all', label: 'Tất cả danh mục' },
                ...categories.map((c) => ({ value: c.id, label: c.nameVi })),
              ]}
              value={selectedCategory}
              onChange={(val) => setSelectedCategory(val)}
            />

            <Select
              options={[
                { value: 'all', label: 'Tất cả trạng thái' },
                { value: 'published', label: 'Công khai (Published)' },
                { value: 'draft', label: 'Bản nháp (Draft)' },
                { value: 'archived', label: 'Lưu trữ (Archived)' },
              ]}
              value={selectedFaqStatus}
              onChange={(val) => setSelectedFaqStatus(val)}
            />
          </>
        ) : (
          <Select
            options={[
              { value: 'all', label: 'Tất cả câu hỏi khách' },
              { value: 'pending', label: 'Chờ xử lý' },
              { value: 'private_answered', label: 'Đã trả lời riêng' },
              { value: 'published', label: 'Đã đăng thành FAQ' },
              { value: 'rejected', label: 'Từ chối' },
              { value: 'archived', label: 'Đã lưu trữ' },
            ]}
            value={selectedInboxStatus}
            onChange={(val) => setSelectedInboxStatus(val)}
          />
        )}
      </div>

      {/* TAB 1: INBOX CÂU HỎI KHÁCH HÀNG */}
      {activeTab === 'inbox' && (
        <div className={styles.questionsGrid}>
          {filteredQuestions.length === 0 ? (
            <div className={styles.emptyState}>
              <Inbox size={48} opacity={0.3} />
              <p>Chưa có câu hỏi nào từ khách hàng phù hợp với điều kiện tìm kiếm.</p>
            </div>
          ) : (
            filteredQuestions.map((q) => {
              const badge = getStatusBadgeLabel(q.status);
              const formattedDate = new Date(q.createdAt).toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div key={q.id} className={styles.qCard}>
                  <div className={styles.qCardHeader}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <strong style={{ color: '#f8fafc', fontSize: '1rem' }}>{q.name}</strong>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          color: badge.color,
                          background: badge.bgColor,
                          padding: '0.2rem 0.6rem',
                          borderRadius: '6px',
                        }}
                      >
                        {badge.label}
                      </span>
                    </div>

                    <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                      <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />
                      {formattedDate}
                    </span>
                  </div>

                  <div className={styles.qCardBody}>
                    <p style={{ margin: 0 }}>"{q.question}"</p>
                  </div>

                  <div className={styles.qCardFooter}>
                    <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                      Liên hệ qua: <strong style={{ color: '#F58220' }}>{q.contactValue}</strong> ({q.contactType.toUpperCase()})
                    </span>

                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        setSelectedQuestion(q);
                        setIsQuestionReviewOpen(true);
                      }}
                      icon={<Eye size={14} />}
                    >
                      Xem & Xử lý
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 2: THƯ VIỆN FAQ CÔNG KHAI */}
      {activeTab === 'faqs' && (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th} style={{ width: '40px' }}>📌</th>
                <th className={styles.th}>Câu hỏi & Câu trả lời</th>
                <th className={styles.th}>Danh mục</th>
                <th className={styles.th}>Đánh giá</th>
                <th className={styles.th}>Trạng thái</th>
                <th className={styles.th} style={{ textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredFaqs.length === 0 ? (
                <tr>
                  <td colSpan={6} className={styles.td} style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                    Chưa có bài FAQ nào trong thư viện. Bấm "+ Tạo FAQ mới" để thêm!
                  </td>
                </tr>
              ) : (
                filteredFaqs.map((faq) => (
                  <tr key={faq.id} className={styles.tr}>
                    <td className={styles.td} style={{ textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={() => handleTogglePin(faq)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                        title={faq.isPinned ? 'Bỏ ghim' : 'Ghim bài viết'}
                      >
                        <Pin size={16} color={faq.isPinned ? '#F58220' : '#475569'} />
                      </button>
                    </td>

                    <td className={styles.td}>
                      <div style={{ fontWeight: 600, color: '#f8fafc', marginBottom: '0.25rem' }}>
                        {faq.questionVi}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                        {faq.questionEn}
                      </div>
                    </td>

                    <td className={styles.td}>
                      <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                        {faq.categoryNameVi}
                      </span>
                    </td>

                    <td className={styles.td}>
                      <div style={{ fontSize: '0.82rem', display: 'flex', gap: '0.75rem' }}>
                        <span style={{ color: '#10b981' }}>👍 {faq.helpfulCount}</span>
                        <span style={{ color: '#ef4444' }}>👎 {faq.unhelpfulCount}</span>
                      </div>
                    </td>

                    <td className={styles.td}>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          padding: '0.2rem 0.6rem',
                          borderRadius: '6px',
                          color: faq.status === 'published' ? '#10b981' : faq.status === 'draft' ? '#f59e0b' : '#6b7280',
                          background:
                            faq.status === 'published'
                              ? 'rgba(16, 185, 129, 0.15)'
                              : faq.status === 'draft'
                              ? 'rgba(245, 158, 11, 0.15)'
                              : 'rgba(107, 114, 128, 0.15)',
                        }}
                      >
                        {faq.status === 'published' ? 'Công khai' : faq.status === 'draft' ? 'Bản nháp' : 'Lưu trữ'}
                      </span>
                    </td>

                    <td className={styles.td} style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingFaq(faq);
                            setIsFaqModalOpen(true);
                          }}
                          style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', padding: '4px' }}
                          title="Sửa bài FAQ"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteFaqCandidateId(faq.id)}
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                          title="Xóa bài FAQ"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals */}
      <FaqEditModal
        isOpen={isFaqModalOpen}
        faqToEdit={editingFaq}
        initialQuestionVi={prefillQuestionText}
        onSave={handleSaveFaq}
        onClose={() => {
          setIsFaqModalOpen(false);
          setEditingFaq(null);
          setPrefillQuestionText('');
        }}
      />

      <QuestionReviewModal
        isOpen={isQuestionReviewOpen}
        question={selectedQuestion}
        onClose={() => {
          setIsQuestionReviewOpen(false);
          setSelectedQuestion(null);
        }}
        onStatusUpdated={reloadData}
        onConvertToFaq={handleConvertToFaq}
      />

      <FaqCategoryManagerModal
        isOpen={isDeptModalOpen}
        onClose={() => setIsDeptModalOpen(false)}
        onCategoriesUpdated={reloadData}
      />

      <ConfirmModal
        isOpen={!!deleteFaqCandidateId}
        title="Xác nhận xóa câu hỏi FAQ"
        message="Bạn có chắc chắn muốn xóa bài FAQ này khỏi hệ thống không? Hành động này không thể hoàn tác."
        confirmLabel="Xóa bài FAQ"
        cancelLabel="Hủy"
        onConfirm={handleConfirmDeleteFaq}
        onCancel={() => setDeleteFaqCandidateId(null)}
      />
    </div>
  );
};
