import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, Map } from 'lucide-react';
import styles from './Contact.module.css';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    course: 'ielts',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Giả lập gửi thông tin thành công
    setSubmitted(true);
    setFormData({ name: '', phone: '', email: '', course: 'ielts', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="page-container">
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={`${styles.title} gradient-text`}>Liên Hệ Với Chúng Tôi</h1>
          <p className={styles.subtitle}>
            Đừng ngần ngại liên hệ để nhận tư vấn lộ trình học miễn phí hoặc gửi câu hỏi góp ý về cho
            iCAM.
          </p>
        </div>

        <div className={styles.splitLayout}>
          {/* Contact Info Column */}
          <div className={styles.infoColumn}>
            <div className={`${styles.infoCard} glass`}>
              <div className={styles.infoItem}>
                <div className={styles.iconWrapper}>
                  <MapPin size={20} />
                </div>
                <div className={styles.infoText}>
                  <span className={styles.infoLabel}>Địa chỉ</span>
                  <span className={styles.infoValue}>
                    Tòa nhà iCAM, số 12 Chùa Bộc, Đống Đa, Hà Nội
                  </span>
                </div>
              </div>

              <div className={styles.infoItem}>
                <div className={styles.iconWrapper}>
                  <Phone size={20} />
                </div>
                <div className={styles.infoText}>
                  <span className={styles.infoLabel}>Hotline tuyển sinh</span>
                  <span className={styles.infoValue}>0987.654.321 – 1900.1234</span>
                </div>
              </div>

              <div className={styles.infoItem}>
                <div className={styles.iconWrapper}>
                  <Mail size={20} />
                </div>
                <div className={styles.infoText}>
                  <span className={styles.infoLabel}>Email</span>
                  <span className={styles.infoValue}>tuyensinh@icam.edu.vn</span>
                </div>
              </div>

              <div className={styles.infoItem}>
                <div className={styles.iconWrapper}>
                  <Clock size={20} />
                </div>
                <div className={styles.infoText}>
                  <span className={styles.infoLabel}>Giờ làm việc</span>
                  <span className={styles.infoValue}>Thứ 2 – Chủ nhật | 08:00 – 21:30</span>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className={styles.mapPlaceholder}>
              <Map size={36} color="hsl(var(--primary))" />
              <span style={{ fontWeight: 600 }}>Bản đồ chỉ đường</span>
              <span style={{ fontSize: '0.85rem' }}>(Google Maps sẽ được nhúng hiển thị ở đây)</span>
            </div>
          </div>

          {/* Contact Form Column */}
          <div className={`${styles.formCard} glass`}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Đăng Ký Nhận Tư Vấn</h2>
            <p
              style={{
                color: 'hsl(var(--text-secondary))',
                fontSize: '0.9rem',
                marginBottom: '0.5rem',
              }}
            >
              Học viên sẽ được kiểm tra trình độ đầu vào hoàn toàn miễn phí cùng giảng viên bản xứ.
            </p>

            {submitted && (
              <div
                style={{
                  background: 'rgba(74, 222, 128, 0.1)',
                  border: '1px solid rgb(74, 222, 128)',
                  color: 'rgb(22, 101, 52)',
                  padding: '1rem',
                  borderRadius: '8px',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                }}
              >
                ✓ Gửi thông tin thành công! Tư vấn viên của iCAM sẽ liên hệ lại với bạn trong vòng 24h
                làm việc.
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
            >
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="name">
                  Họ và tên *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="Nhập họ và tên của bạn..."
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="phone">
                  Số điện thoại *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="Nhập số điện thoại liên hệ..."
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="email">
                  Địa chỉ Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="ví dụ: email@cua-ban.com..."
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="course">
                  Khóa học quan tâm
                </label>
                <select
                  id="course"
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  className={styles.input}
                  style={{ background: 'hsl(var(--bg-secondary))' }}
                >
                  <option value="ielts">Lộ trình IELTS Cam kết đầu ra</option>
                  <option value="communication">Tiếng Anh Giao Tiếp Thực Chiến</option>
                  <option value="kids">Tiếng Anh Trẻ Em Phát Triển Toàn Diện</option>
                  <option value="other">Tư vấn khóa học khác</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="message">
                  Lời nhắn / Yêu cầu thêm
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className={styles.textarea}
                  placeholder="Ví dụ: Lịch rảnh rỗi của bạn, trình độ hiện tại..."
                />
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{ justifyContent: 'center', padding: '14px' }}
              >
                <Send size={18} /> Gửi yêu cầu tư vấn
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Contact;
