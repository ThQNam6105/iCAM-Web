import React, { useState } from 'react';
import {
  X,
  PhoneCall,
  Mail,
  MessageSquare,
  Globe,
  Archive,
  Ban,
  Info,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import {
  type UserQuestionItem,
  getStatusBadgeLabel,
  updateUserQuestionStatus,
  deleteUserQuestion,
} from '../../services/questionService';
import { useToast } from '../Toast/Toast';
import { Button } from './UI';
import styles from './QuestionReviewModal.module.css';

interface QuestionReviewModalProps {
  isOpen: boolean;
  question: UserQuestionItem | null;
  onClose: () => void;
  onStatusUpdated: () => void;
  onConvertToFaq: (questionText: string) => void;
}

export const QuestionReviewModal: React.FC<QuestionReviewModalProps> = ({
  isOpen,
  question,
  onClose,
  onStatusUpdated,
  onConvertToFaq,
}) => {
  const { showToast } = useToast();
  const [internalNotes, setInternalNotes] = useState(question?.internalNotes || '');

  React.useEffect(() => {
    if (question) {
      setInternalNotes(question.internalNotes || '');
    }
  }, [question]);

  if (!isOpen || !question) return null;

  const badge = getStatusBadgeLabel(question.status);

  const handlePrivateAnswer = () => {
    updateUserQuestionStatus(question.id, 'private_answered', internalNotes);
    showToast('Đã đánh giá câu hỏi là Đã trả lời riêng! ✓', 'success');
    onStatusUpdated();
    onClose();
  };

  const handleConvertToFaqClick = () => {
    updateUserQuestionStatus(question.id, 'published', internalNotes);
    onStatusUpdated();
    onConvertToFaq(question.question);
  };

  const handleReject = () => {
    deleteUserQuestion(question.id);
    showToast('Đã từ chối và xóa khỏi hộp thư!', 'info');
    onStatusUpdated();
    onClose();
  };

  const handleArchive = () => {
    updateUserQuestionStatus(question.id, 'archived', internalNotes);
    onStatusUpdated();
    onClose();
  };

  const getContactIcon = () => {
    if (question.contactType === 'email') return <Mail size={16} />;
    if (question.contactType === 'zalo') return <MessageSquare size={16} />;
    return <PhoneCall size={16} />;
  };

  const formattedDate = new Date(question.createdAt).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.header}>
          <h3 className={styles.title}>Chi tiết câu hỏi từ khách hàng</h3>
          <button type="button" onClick={onClose} className={styles.closeBtn}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.body}>
          <div className={styles.infoCard}>
            <div className={styles.contactRow}>
              <div className={styles.customerName}>
                <span>{question.name}</span>
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

              <div className={styles.contactValue}>
                {getContactIcon()} {question.contactValue} ({question.contactType.toUpperCase()})
              </div>
            </div>

            <div style={{ fontSize: '0.82rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Calendar size={14} /> Ngày nhận: {formattedDate}
              {question.categoryName && ` • Danh mục: ${question.categoryName}`}
            </div>

            <div className={styles.questionText}>
              <strong>Nội dung câu hỏi:</strong>
              <p style={{ margin: '0.5rem 0 0 0' }}>"{question.question}"</p>
            </div>
          </div>

          <div className={styles.guidanceAlert}>
            <Info size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong>Hướng dẫn xử lý câu hỏi:</strong>
              <br />
              • Để <strong>"Trả lời riêng"</strong>: Quý thầy cô/nhân viên vui lòng sử dụng thông tin liên hệ ở trên (SĐT / Zalo / Email) để liên hệ trực tiếp tư vấn cho khách hàng. Hệ thống không tạo tin nhắn giả.
              <br />• Để <strong>"Đăng thành FAQ"</strong>: Bấm nút bên dưới để chuyển câu hỏi này thành bài tri thức công khai song ngữ cho toàn bộ phụ huynh tham khảo.
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Ghi chú nội bộ xử lý (Chỉ lưu trong Admin):</label>
            <textarea
              rows={3}
              placeholder="Nhập ghi chú tư vấn (VD: Đã gọi điện lúc 14h00 tư vấn chương trình IELTS, khách hẹn thứ 7 đến test)..."
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
              className={styles.textarea}
            />
          </div>
        </div>

        <div className={styles.actions}>
          <div className={styles.actionGroupLeft}>
            <Button type="button" variant="secondary" size="sm" onClick={handleReject} icon={<Ban size={14} />}>
              Từ chối
            </Button>
            <Button type="button" variant="secondary" size="sm" onClick={handleArchive} icon={<Archive size={14} />}>
              Lưu trữ
            </Button>
          </div>

          <div className={styles.actionGroupRight}>
            <Button type="button" variant="secondary" size="md" onClick={handlePrivateAnswer} icon={<CheckCircle2 size={16} />}>
              Đánh dấu Đã trả lời riêng
            </Button>
            <Button type="button" variant="primary" size="md" onClick={handleConvertToFaqClick} icon={<Globe size={16} />}>
              Đăng thành bài FAQ
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
