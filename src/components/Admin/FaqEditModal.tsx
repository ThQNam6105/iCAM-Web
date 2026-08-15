import React, { useState, useEffect } from 'react';
import { X, Save, Pin } from 'lucide-react';
import {
  type FaqItem,
  type FaqCategoryItem,
  type FaqStatus,
  getAllFaqCategories,
} from '../../services/faqService';
import { Button, Select } from './UI';
import styles from './FaqEditModal.module.css';

interface FaqEditModalProps {
  isOpen: boolean;
  faqToEdit?: FaqItem | null;
  initialQuestionVi?: string; // Pre-filled when converting from customer question
  onSave: (data: Partial<FaqItem>) => void;
  onClose: () => void;
}

export const FaqEditModal: React.FC<FaqEditModalProps> = ({
  isOpen,
  faqToEdit,
  initialQuestionVi = '',
  onSave,
  onClose,
}) => {
  const [categories, setCategories] = useState<FaqCategoryItem[]>([]);

  const [categoryId, setCategoryId] = useState(faqToEdit?.categoryId || 'cat_method');
  const [questionVi, setQuestionVi] = useState(faqToEdit?.questionVi || initialQuestionVi || '');
  const [questionEn, setQuestionEn] = useState(faqToEdit?.questionEn || '');
  const [answerVi, setAnswerVi] = useState(faqToEdit?.answerVi || '');
  const [answerEn, setAnswerEn] = useState(faqToEdit?.answerEn || '');
  const [status, setStatus] = useState<FaqStatus>(faqToEdit?.status || 'published');
  const [isPinned, setIsPinned] = useState<boolean>(faqToEdit?.isPinned || false);
  const [displayOrder, setDisplayOrder] = useState<number>(faqToEdit?.displayOrder || 1);

  useEffect(() => {
    const cats = getAllFaqCategories().filter((c) => c.status === 'active');
    setCategories(cats);

    if (isOpen) {
      if (faqToEdit) {
        setCategoryId(faqToEdit.categoryId || (cats.length > 0 ? cats[0].id : 'cat_method'));
        setQuestionVi(faqToEdit.questionVi || '');
        setQuestionEn(faqToEdit.questionEn || '');
        setAnswerVi(faqToEdit.answerVi || '');
        setAnswerEn(faqToEdit.answerEn || '');
        setStatus(faqToEdit.status || 'published');
        setIsPinned(!!faqToEdit.isPinned);
        setDisplayOrder(faqToEdit.displayOrder || 1);
      } else {
        setCategoryId(cats.length > 0 ? cats[0].id : 'cat_method');
        setQuestionVi(initialQuestionVi || '');
        setQuestionEn('');
        setAnswerVi('');
        setAnswerEn('');
        setStatus('published');
        setIsPinned(false);
        setDisplayOrder(1);
      }
    }
  }, [faqToEdit, isOpen, initialQuestionVi]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      categoryId,
      questionVi,
      questionEn: questionEn || questionVi,
      answerVi,
      answerEn: answerEn || answerVi,
      status,
      isPinned,
      displayOrder: Number(displayOrder) || 1,
    });
    onClose();
  };

  const handleKeyDownAutoBullet = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
    currentVal: string,
    setter: (val: string) => void
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const selectionStart = e.currentTarget.selectionStart;
      const selectionEnd = e.currentTarget.selectionEnd;

      const before = currentVal.substring(0, selectionStart);
      const after = currentVal.substring(selectionEnd);
      const newVal = `${before}\n• ${after}`;
      setter(newVal);

      setTimeout(() => {
        if (e.currentTarget) {
          e.currentTarget.selectionStart = selectionStart + 3;
          e.currentTarget.selectionEnd = selectionStart + 3;
        }
      }, 0);
    }
  };

  const handleFocusAutoBullet = (
    currentVal: string,
    setter: (val: string) => void
  ) => {
    if (!currentVal.trim()) {
      setter('• ');
    }
  };

  const handlePasteAutoBullet = (
    e: React.ClipboardEvent<HTMLTextAreaElement>,
    currentVal: string,
    setter: (val: string) => void
  ) => {
    const pastedText = e.clipboardData.getData('text');
    if (!pastedText) return;

    if (pastedText.includes('\n') || pastedText.includes('\r')) {
      e.preventDefault();
      const formattedPasted = pastedText
        .split(/\r?\n/)
        .map((line) => {
          const cleaned = line.replace(/^[-*•\s]+/, '').trim();
          return cleaned ? `• ${cleaned}` : '';
        })
        .filter((line, idx, arr) => line !== '' || idx < arr.length - 1)
        .join('\n');

      const selectionStart = e.currentTarget.selectionStart;
      const selectionEnd = e.currentTarget.selectionEnd;

      const before = currentVal.substring(0, selectionStart);
      const after = currentVal.substring(selectionEnd);

      const prefix = before && !before.endsWith('\n') ? '\n' : '';
      const newVal = `${before}${prefix}${formattedPasted}${after}`;

      setter(newVal);

      const newCursorPos = before.length + prefix.length + formattedPasted.length;
      setTimeout(() => {
        if (e.currentTarget) {
          e.currentTarget.selectionStart = newCursorPos;
          e.currentTarget.selectionEnd = newCursorPos;
        }
      }, 0);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.header}>
          <h3 className={styles.title}>
            {faqToEdit ? 'Chỉnh sửa bài FAQ' : 'Tạo bài FAQ mới'}
          </h3>
          <button type="button" onClick={onClose} className={styles.closeBtn}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.formGrid}>
          {/* Category & Status */}
          <div className={styles.rowTwo}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>
                Danh mục tri thức <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <Select
                options={categories.map((c) => ({
                  value: c.id,
                  label: `${c.nameVi} (${c.nameEn})`,
                }))}
                value={categoryId}
                onChange={(val) => setCategoryId(val)}
                fullWidth
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Trạng thái xuất bản</label>
              <Select
                options={[
                  { value: 'published', label: 'Công khai (Published)' },
                  { value: 'draft', label: 'Bản nháp (Draft)' },
                  { value: 'archived', label: 'Lưu trữ (Archived)' },
                ]}
                value={status}
                onChange={(val) => setStatus(val as FaqStatus)}
                fullWidth
              />
            </div>
          </div>

          {/* Question VI */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>
              Câu hỏi (Tiếng Việt) <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="text"
              required
              placeholder="VD: Phương pháp 4Ls + LETI tại iCANCAM là gì?"
              value={questionVi}
              onChange={(e) => setQuestionVi(e.target.value)}
              className={styles.input}
            />
          </div>

          {/* Question EN */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Câu hỏi (Tiếng Anh)</label>
            <input
              type="text"
              placeholder="VD: What is the 4Ls + LETI methodology at iCANCAM?"
              value={questionEn}
              onChange={(e) => setQuestionEn(e.target.value)}
              className={styles.input}
            />
          </div>

          {/* Answer VI */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>
              Câu trả lời (Tiếng Việt) <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <textarea
              rows={4}
              required
              placeholder="Nhập câu trả lời chi tiết (tự động chèn • khi Enter hoặc Paste xuống dòng)..."
              value={answerVi}
              onChange={(e) => setAnswerVi(e.target.value)}
              onFocus={() => handleFocusAutoBullet(answerVi, setAnswerVi)}
              onKeyDown={(e) => handleKeyDownAutoBullet(e, answerVi, setAnswerVi)}
              onPaste={(e) => handlePasteAutoBullet(e, answerVi, setAnswerVi)}
              className={styles.textarea}
            />
          </div>

          {/* Answer EN */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Câu trả lời (Tiếng Anh)</label>
            <textarea
              rows={4}
              placeholder="Detailed answer in English (auto-inserts • on Enter or Paste)..."
              value={answerEn}
              onChange={(e) => setAnswerEn(e.target.value)}
              onFocus={() => handleFocusAutoBullet(answerEn, setAnswerEn)}
              onKeyDown={(e) => handleKeyDownAutoBullet(e, answerEn, setAnswerEn)}
              onPaste={(e) => handlePasteAutoBullet(e, answerEn, setAnswerEn)}
              className={styles.textarea}
            />
          </div>

          {/* Pinned & Order */}
          <div className={styles.rowTwo} style={{ alignItems: 'center' }}>
            <label className={styles.checkboxRow}>
              <input
                type="checkbox"
                checked={isPinned}
                onChange={(e) => setIsPinned(e.target.checked)}
                className={styles.checkbox}
              />
              <Pin size={16} color={isPinned ? '#F58220' : '#94a3b8'} />
              <span>Ghim câu hỏi này lên ưu tiên đầu trang FAQ</span>
            </label>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Thứ tự hiển thị (Display Order)</label>
              <input
                type="number"
                min={1}
                max={999}
                value={displayOrder}
                onChange={(e) => setDisplayOrder(parseInt(e.target.value, 10) || 1)}
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.actions}>
            <Button type="button" variant="secondary" size="md" onClick={onClose}>
              Hủy bỏ
            </Button>
            <Button type="submit" variant="primary" size="md" icon={<Save size={16} />}>
              {faqToEdit ? 'Lưu bài FAQ' : 'Đăng bài FAQ'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
