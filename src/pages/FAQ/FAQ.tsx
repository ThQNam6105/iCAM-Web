import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Search,
  ChevronDown,
  ChevronUp,
  PhoneCall,
  MessageSquare,
  Send,
  ThumbsUp,
  ThumbsDown,
  Pin,
  HelpCircle,
  X,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import styles from './FAQ.module.css';
import { useLanguage } from '../../contexts/LanguageContext';
import { SectionTransition } from '../../components/SectionTransition/SectionTransition';
import {
  type FaqItem,
  type FaqCategoryItem,
  getAllFaqs,
  getAllFaqCategories,
  fetchFaqsFromSupabase,
  voteFaq,
  getVotedFaqIds,
} from '../../services/faqService';
import { AskQuestionModal } from '../../components/Public/AskQuestionModal';
import { useToast } from '../../components/Toast/Toast';

// SAFE HIGHLIGHT COMPONENT (NO DANGEROUSLY SET INNER HTML)
const HighlightText: React.FC<{ text: string; query: string }> = ({ text, query }) => {
  if (!query.trim()) return <>{text}</>;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className={styles.highlightMatch}>
            {part}
          </mark>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        )
      )}
    </>
  );
};

export const FAQ: React.FC = () => {
  const { language } = useLanguage();
  const { showToast } = useToast();
  const isEn = language === 'en';

  const [categories, setCategories] = useState<FaqCategoryItem[]>([]);
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openIds, setOpenIds] = useState<string[]>([]);
  const [isAskModalOpen, setIsAskModalOpen] = useState(false);
  const [votedMap, setVotedMap] = useState<Record<string, any>>({});

  // Negative feedback modal state
  const [negativeVoteFaqId, setNegativeVoteFaqId] = useState<string | null>(null);

  const loadData = () => {
    setCategories(getAllFaqCategories().filter((c) => c.status === 'active'));
    const publishedOnly = getAllFaqs().filter((f) => f.status === 'published');

    // Sort pinned items to the top, then by displayOrder
    publishedOnly.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return a.displayOrder - b.displayOrder;
    });

    setFaqs(publishedOnly);
    setVotedMap(getVotedFaqIds());
  };

  useEffect(() => {
    loadData();
    fetchFaqsFromSupabase().then(() => loadData());
  }, []);

  const toggleAccordion = (id: string) => {
    if (openIds.includes(id)) {
      setOpenIds(openIds.filter((item) => item !== id));
    } else {
      setOpenIds([...openIds, id]);
    }
  };

  const handleOpenAll = () => {
    setOpenIds(filteredFaqs.map((f) => f.id));
  };

  const handleCloseAll = () => {
    setOpenIds([]);
  };

  const filteredFaqs = useMemo(() => {
    return faqs.filter((item) => {
      const matchesCategory = activeCategory === 'all' || item.categoryId === activeCategory;
      const qText = isEn ? item.questionEn : item.questionVi;
      const aText = isEn ? item.answerEn : item.answerVi;
      const catText = isEn ? item.categoryNameEn || '' : item.categoryNameVi || '';

      const queryLower = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !queryLower ||
        qText.toLowerCase().includes(queryLower) ||
        aText.toLowerCase().includes(queryLower) ||
        catText.toLowerCase().includes(queryLower);

      return matchesCategory && matchesSearch;
    });
  }, [faqs, activeCategory, searchQuery, isEn]);

  const handleVote = (faqId: string, type: 'helpful' | 'unhelpful') => {
    const res = voteFaq(faqId, type);
    if (!res.success) {
      showToast(res.message || 'Bạn đã đánh giá bài viết này rồi!', 'info');
      return;
    }

    setVotedMap(getVotedFaqIds());
    loadData();

    if (type === 'helpful') {
      showToast(
        isEn ? 'Thank you for your helpful feedback! 👍' : 'Cảm ơn phản hồi đánh giá hữu ích của bạn! 👍',
        'success'
      );
    } else {
      setNegativeVoteFaqId(faqId);
    }
  };

  const handleNegativeReasonSubmit = (_reason: string) => {
    showToast(
      isEn
        ? 'Thank you! We will update this FAQ content soon.'
        : 'Cảm ơn góp ý! Ban biên tập iCANCAM sẽ nâng cấp câu trả lời này sớm nhất.',
      'info'
    );
    setNegativeVoteFaqId(null);
  };

  return (
    <div className={styles.faqWrapper}>
      {/* 1. HERO & SEARCH HEADER */}
      <section className={styles.heroSection}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContainer}>
          <div className={styles.heroBadge}>
            <Sparkles size={16} />
            <span>{isEn ? 'FAQ Knowledge Base' : 'Trung Tâm Trợ Giúp & FAQ'}</span>
          </div>

          <h1 className={styles.heroTitle}>
            {isEn ? (
              <>
                Frequently Asked <span className={styles.orangeHighlight}>Questions</span>
              </>
            ) : (
              <>
                Giải Đáp Mọi <span className={styles.orangeHighlight}>Thắc Mắc Cho Phụ Huynh</span>
              </>
            )}
          </h1>

          <p className={styles.heroSubtitle}>
            {isEn
              ? 'Find fast, transparent answers regarding 4Ls + LETI methodology, 21st smart classrooms, tuition policies, and outcome guarantees at iCANCAM.'
              : 'Tra cứu nhanh chóng, minh bạch về phương pháp 4Ls + LETI, phòng học 21st, chính sách học phí và hợp đồng cam kết đầu ra bằng văn bản tại iCANCAM.'}
          </p>

          {/* Interactive Search Box */}
          <div className={styles.searchBoxWrapper}>
            <Search className={styles.searchIcon} size={22} />
            <input
              type="text"
              className={styles.searchInput}
              placeholder={
                isEn
                  ? 'Search questions, methodology, tuition, IELTS, campuses...'
                  : 'Nhập từ khóa tìm kiếm (VD: 4Ls, học phí, cam kết đầu ra, IELTS, cơ sở...)'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className={styles.clearSearchBtn}
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className={styles.filterBar}>
            <button
              type="button"
              className={`${styles.filterBtn} ${activeCategory === 'all' ? styles.activeFilter : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              {isEn ? 'All Topics' : 'Tất cả chủ đề'}
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`${styles.filterBtn} ${activeCategory === cat.id ? styles.activeFilter : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {isEn ? cat.nameEn : cat.nameVi}
              </button>
            ))}
          </div>
        </div>
      </section>

      <SectionTransition variant="navy-to-soft-orange" />

      {/* 2. ACCORDION FAQ CONTENT SECTION */}
      <section className={styles.accordionSection}>
        <div className={styles.container}>
          {/* Controls Bar: Expand All / Collapse All & Ask Question */}
          <div className={styles.controlsBar}>
            <div className={styles.controlGroup}>
              <button type="button" onClick={handleOpenAll} className={styles.expandBtn}>
                <Maximize2 size={14} /> {isEn ? 'Expand All' : 'Mở tất cả'}
              </button>
              <button type="button" onClick={handleCloseAll} className={styles.expandBtn}>
                <Minimize2 size={14} /> {isEn ? 'Collapse All' : 'Thu gọn tất cả'}
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsAskModalOpen(true)}
              className={styles.askHeaderBtn}
            >
              <HelpCircle size={18} />
              {isEn ? 'Ask a Question' : 'Đặt câu hỏi trực tiếp'}
            </button>
          </div>

          {/* Accordion List */}
          <div className={styles.accordionList}>
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((item) => {
                const isOpen = openIds.includes(item.id);
                const qText = isEn ? item.questionEn : item.questionVi;
                const aText = isEn ? item.answerEn : item.answerVi;
                const catText = isEn ? item.categoryNameEn : item.categoryNameVi;
                const userVote = votedMap[item.id];

                return (
                  <div
                    key={item.id}
                    className={`${styles.accordionItem} ${isOpen ? styles.itemOpen : ''}`}
                  >
                    <button
                      type="button"
                      className={styles.accordionHeader}
                      onClick={() => toggleAccordion(item.id)}
                      aria-expanded={isOpen}
                    >
                      <div className={styles.questionMeta}>
                        <div className={styles.metaHeaderRow}>
                          <span className={styles.badgeCategory}>{catText}</span>
                          {item.isPinned && (
                            <span className={styles.pinnedBadge}>
                              <Pin size={12} /> {isEn ? 'Pinned' : 'Ghim ưu tiên'}
                            </span>
                          )}
                        </div>

                        <h3 className={styles.questionText}>
                          <HighlightText text={qText} query={searchQuery} />
                        </h3>
                      </div>

                      <div className={styles.toggleIconWrap}>
                        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    </button>

                    {isOpen && (
                      <div className={styles.accordionBody}>
                        <div className={styles.answerContent}>
                          <HighlightText text={aText} query={searchQuery} />
                        </div>

                        {/* Helpful Voting Bar */}
                        <div className={styles.voteBar}>
                          <span>
                            {isEn ? 'Was this answer helpful to you?' : 'Câu trả lời này có hữu ích với bạn không?'}
                          </span>

                          <div className={styles.voteButtons}>
                            <button
                              type="button"
                              onClick={() => handleVote(item.id, 'helpful')}
                              className={`${styles.voteBtn} ${
                                userVote?.voteType === 'helpful' ? styles.voteBtnActive : ''
                              }`}
                            >
                              <ThumbsUp size={14} />
                              {isEn ? 'Helpful' : 'Hữu ích'} ({item.helpfulCount})
                            </button>

                            <button
                              type="button"
                              onClick={() => handleVote(item.id, 'unhelpful')}
                              className={`${styles.voteBtn} ${
                                userVote?.voteType === 'unhelpful' ? styles.voteBtnActive : ''
                              }`}
                            >
                              <ThumbsDown size={14} />
                              {isEn ? 'Not helpful' : 'Chưa hữu ích'} ({item.unhelpfulCount})
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              /* RECOVERY "NO ANSWER FOUND" CTA EXPERIENCE */
              <div className={styles.noResultsCard}>
                <HelpCircle size={48} color="#F58220" />
                <h3>
                  {isEn
                    ? `No answer found for "${searchQuery}"`
                    : `Chưa tìm thấy câu trả lời phù hợp cho "${searchQuery}"`}
                </h3>
                <p>
                  {isEn
                    ? 'Our consultants are ready to answer your specific questions directly via Zalo, phone, or live chat.'
                    : 'Bạn có thể đặt câu hỏi trực tiếp để ban tư vấn chuyên môn iCANCAM hỗ trợ riêng cho bạn ngay.'}
                </p>

                <div className={styles.recoveryBtnRow}>
                  <button
                    type="button"
                    onClick={() => setIsAskModalOpen(true)}
                    className={styles.recoveryAskBtn}
                  >
                    <Send size={16} /> {isEn ? 'Ask iCANCAM Team' : 'Đặt câu hỏi cho iCANCAM'}
                  </button>

                  <a href="tel:0909123456" className={styles.recoveryCallBtn}>
                    <PhoneCall size={16} /> {isEn ? 'Call Hotline' : 'Gọi Hotline 0909 123 456'}
                  </a>

                  <a
                    href="https://zalo.me"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.recoveryZaloBtn}
                  >
                    <MessageSquare size={16} /> {isEn ? 'Chat Zalo 24/7' : 'Chat Zalo Tư vấn'}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. HIGHLIGHT PILLARS SECTION */}
      <section className={styles.pillarsSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTag}>
              <Sparkles size={14} />
              <span>{isEn ? 'Core Values' : 'Cam Kết Chất Lượng'}</span>
            </div>
            <h2 className={styles.sectionTitle}>
              {isEn ? 'Why Parents Trust iCANCAM' : 'Vì Sao Phụ Huynh An Tâm Chọn iCANCAM'}
            </h2>
          </div>

          <div className={styles.pillarsGrid}>
            <div className={styles.pillarCard}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(245, 130, 32, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
                <Sparkles size={24} color="#F58220" />
              </div>
              <h3>{isEn ? '4Ls + LETI Method' : 'Phương Pháp 4Ls + LETI'}</h3>
              <p>
                {isEn
                  ? 'Active 2-way interaction boosting natural speech reflexes without passive rote learning.'
                  : 'Học qua tương tác 2 chiều kích hoạt phản xạ giao tiếp tự nhiên, không học thuộc lòng thụ động.'}
              </p>
            </div>

            <div className={styles.pillarCard}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
                <PhoneCall size={24} color="#3b82f6" />
              </div>
              <h3>{isEn ? 'Written Guarantees' : 'Cam Kết Đầu Ra Văn Bản'}</h3>
              <p>
                {isEn
                  ? 'Legal written contracts guaranteeing target outcomes or 100% free re-study sponsorship.'
                  : 'Ký hợp đồng pháp lý cam kết đầu ra. Tài trợ 100% học phí học lại nếu chưa đạt mục tiêu.'}
              </p>
            </div>

            <div className={styles.pillarCard}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
                <MessageSquare size={24} color="#10b981" />
              </div>
              <h3>{isEn ? '21st Smart Classrooms' : 'Phòng Học 21st Hiện Đại'}</h3>
              <p>
                {isEn
                  ? '100% Smartboards with UK multimedia curriculum for immersive 100% English practice.'
                  : '100% trang bị Bảng thông minh Smartboard & phần mềm chuẩn Anh Quốc giúp trẻ tự tin.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FINAL CONSULTATION CTA SECTION */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaCard}>
            <h2>
              {isEn ? 'Still Have Questions for Your Child?' : 'Phụ Huynh Cần Tư Vấn Lộ Trình Cho Con?'}
            </h2>
            <p>
              {isEn
                ? 'Register for a 100% free 4-skill proficiency test and receive a custom roadmap tailored specifically for your child.'
                : 'Đăng ký kiểm tra trình độ 4 kỹ năng miễn phí 100% và nhận tư vấn lộ trình cá nhân hóa từ các chuyên gia đào tạo iCANCAM.'}
            </p>

            <div className={styles.ctaButtons}>
              <button
                type="button"
                onClick={() => setIsAskModalOpen(true)}
                className={styles.primaryCtaBtn}
              >
                <Send size={18} />
                <span>{isEn ? 'Ask Question Now' : 'Đặt câu hỏi cho iCANCAM'}</span>
              </button>

              <Link to="/contact" className={styles.secondaryCtaBtn}>
                <PhoneCall size={18} />
                <span>{isEn ? 'Free Assessment Test' : 'Đăng ký test trình độ'}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Ask Question Modal */}
      <AskQuestionModal
        isOpen={isAskModalOpen}
        onClose={() => setIsAskModalOpen(false)}
        onSubmitted={() => loadData()}
      />

      {/* Negative Vote Feedback Modal */}
      {negativeVoteFaqId && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1200,
            padding: '1rem',
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '1.5rem',
              maxWidth: '450px',
              width: '100%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
          >
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#0f172a', fontSize: '1.1rem' }}>
              {isEn ? 'How can we improve this answer?' : 'Bạn muốn chúng tôi cải thiện điều gì?'}
            </h4>
            <p style={{ margin: '0 0 1rem 0', fontSize: '0.88rem', color: '#64748b' }}>
              {isEn
                ? 'Select a reason to help iCANCAM team upgrade this FAQ:'
                : 'Vui lòng chọn lý do để giúp ban biên tập iCANCAM hoàn thiện nội dung:'}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                isEn ? 'Answer is not clear' : 'Câu trả lời chưa rõ ràng',
                isEn ? 'Does not answer the exact question' : 'Không đúng trọng tâm câu hỏi',
                isEn ? 'Information may be outdated' : 'Thông tin có thể đã cũ',
                isEn ? 'I need more details' : 'Tôi cần thêm thông tin chi tiết hơn',
              ].map((reason, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleNegativeReasonSubmit(reason)}
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    padding: '0.6rem 0.85rem',
                    textAlign: 'left',
                    fontSize: '0.88rem',
                    color: '#334155',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#F58220';
                    e.currentTarget.style.color = '#F58220';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#cbd5e1';
                    e.currentTarget.style.color = '#334155';
                  }}
                >
                  • {reason}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setNegativeVoteFaqId(null)}
              style={{
                marginTop: '1rem',
                width: '100%',
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                fontSize: '0.85rem',
                cursor: 'pointer',
                textAlign: 'center',
              }}
            >
              {isEn ? 'Close' : 'Đóng lại'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
