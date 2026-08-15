import React, { useState } from 'react';
import { X, Send, PhoneCall, Mail, MessageSquare, HelpCircle } from 'lucide-react';
import {
  type ContactType,
  submitUserQuestion,
} from '../../services/questionService';
import { useLanguage } from '../../contexts/LanguageContext';
import { useToast } from '../Toast/Toast';
import styles from './AskQuestionModal.module.css';

interface AskQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitted?: () => void;
}

export const AskQuestionModal: React.FC<AskQuestionModalProps> = ({
  isOpen,
  onClose,
  onSubmitted,
}) => {
  const { language } = useLanguage();
  const { showToast } = useToast();
  const isEn = language === 'en';

  const [name, setName] = useState('');
  const [contactType, setContactType] = useState<ContactType>('phone');
  const [contactValue, setContactValue] = useState('');
  const [question, setQuestion] = useState('');
  const [honeypot, setHoneypot] = useState(''); // Anti-bot

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = submitUserQuestion({
      name,
      contactType,
      contactValue,
      question,
      honeypot,
    });

    if (result.success) {
      showToast(
        isEn
          ? 'Question submitted successfully! Our iCANCAM team will contact you soon.'
          : result.message,
        'success'
      );
      setName('');
      setContactValue('');
      setQuestion('');
      onClose();
      if (onSubmitted) onSubmitted();
    } else {
      showToast(result.message, 'error');
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.header}>
          <h3 className={styles.title}>
            <HelpCircle size={22} color="#F58220" />
            {isEn ? 'Ask iCANCAM Team a Question' : 'Đặt câu hỏi cho iCANCAM'}
          </h3>
          <button type="button" onClick={onClose} className={styles.closeBtn}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.body}>
          {/* Honeypot field for bot protection */}
          <input
            type="text"
            name="website_url_hp"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            className={styles.honeypotField}
          />

          {/* Name */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>
              {isEn ? 'Full Name' : 'Họ và tên của bạn'} <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="text"
              required
              placeholder={isEn ? 'e.g. John Doe' : 'VD: Nguyễn Văn A'}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.input}
            />
          </div>

          {/* Contact Method Selector */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>
              {isEn ? 'Preferred Contact Method' : 'Phương thức nhận tư vấn'} <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <div className={styles.contactTypeRow}>
              <button
                type="button"
                className={`${styles.typeBtn} ${contactType === 'phone' ? styles.typeBtnActive : ''}`}
                onClick={() => setContactType('phone')}
              >
                <PhoneCall size={16} /> {isEn ? 'Phone' : 'Số ĐT'}
              </button>

              <button
                type="button"
                className={`${styles.typeBtn} ${contactType === 'zalo' ? styles.typeBtnActive : ''}`}
                onClick={() => setContactType('zalo')}
              >
                <MessageSquare size={16} /> Zalo
              </button>

              <button
                type="button"
                className={`${styles.typeBtn} ${contactType === 'email' ? styles.typeBtnActive : ''}`}
                onClick={() => setContactType('email')}
              >
                <Mail size={16} /> Email
              </button>
            </div>
          </div>

          {/* Contact Value */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>
              {contactType === 'phone'
                ? isEn ? 'Phone Number' : 'Số điện thoại của bạn'
                : contactType === 'zalo'
                ? isEn ? 'Zalo Number / Name' : 'Số Zalo nhận tin nhắn'
                : isEn ? 'Email Address' : 'Địa chỉ Email'} <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type={contactType === 'email' ? 'email' : 'text'}
              required
              placeholder={
                contactType === 'email'
                  ? 'VD: yourname@gmail.com'
                  : 'VD: 0909 123 456'
              }
              value={contactValue}
              onChange={(e) => setContactValue(e.target.value)}
              className={styles.input}
            />
          </div>

          {/* Question Text */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>
              {isEn ? 'Your Question' : 'Nội dung câu hỏi của bạn'} <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <textarea
              rows={4}
              required
              placeholder={
                isEn
                  ? 'Ask naturally in your own words (e.g. Does iCANCAM offer weekend IELTS classes for working professionals?).'
                  : 'Hãy nhập câu hỏi tự nhiên theo nhu cầu của bạn (VD: Trung tâm có lớp IELTS bứt tốc học buổi tối ở cơ sở Hóc Môn không ạ?).'
              }
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className={styles.textarea}
            />
          </div>

          <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
            🔒 {isEn
              ? 'Your contact information is strictly confidential and will never be published publicly.'
              : 'Thông tin cá nhân & SĐT của bạn được bảo mật tuyệt đối, chỉ dùng để tư vấn trực tiếp.'}
          </p>

          <div className={styles.actions}>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>
              {isEn ? 'Cancel' : 'Hủy bỏ'}
            </button>
            <button type="submit" className={styles.submitBtn}>
              <Send size={16} /> {isEn ? 'Submit Question' : 'Gửi câu hỏi ngay'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
