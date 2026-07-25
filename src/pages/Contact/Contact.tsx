import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Sparkles,
  MessageCircle,
  CheckCircle2,
  PhoneCall,
  GraduationCap,
  Building2,
  ShieldCheck
} from 'lucide-react';
import styles from './Contact.module.css';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    branch: 'hocmon',
    course: 'ielts',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: '', phone: '', email: '', branch: 'hocmon', course: 'ielts', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className={styles.contactWrapper}>
      {/* HERO SECTION */}
      <section className={styles.heroSection}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContainer}>
          <div className={styles.heroBadge}>
            <Sparkles size={16} />
            <span>ANH NGỮ CAM — HÓC MÔN & QUẬN 12</span>
          </div>

          <h1 className={styles.heroTitle}>
            Liên Hệ & <span className={styles.orangeHighlight}>Đăng Ký Tư Vấn</span>
          </h1>

          <p className={styles.heroSubtitle}>
            Đừng ngần ngại liên hệ để nhận tư vấn lộ trình học cá nhân hóa và đăng ký kiểm tra trình độ 4 kỹ năng hoàn toàn miễn phí cùng đội ngũ chuyên gia ANH NGỮ CAM.
          </p>

          {/* Quick Contact Badges */}
          <div className={styles.quickContactRow}>
            <div className={styles.quickBadge}>
              <PhoneCall size={16} color="#F58220" />
              <span>Hotline: 0909 123 456</span>
            </div>
            <div className={styles.quickBadge}>
              <MapPin size={16} color="#F58220" />
              <span>Cơ sở Hóc Môn & Quận 12, TP.HCM</span>
            </div>
            <div className={styles.quickBadge}>
              <Clock size={16} color="#F58220" />
              <span>T2 - CN: 08:00 - 21:30</span>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN SPLIT LAYOUT SECTION */}
      <section className={styles.mainSection}>
        <div className={styles.container}>
          <div className={styles.splitLayout}>
            {/* LEFT COLUMN: CAMPUSES & CONTACT INFO */}
            <div className={styles.infoColumn}>
              {/* Campus 1: Hoc Mon */}
              <div className={styles.campusCard}>
                <div className={styles.campusHeader}>
                  <Building2 size={22} color="#F58220" />
                  <h3>Cơ Sở Hóc Môn</h3>
                </div>
                <div className={styles.campusBody}>
                  <div className={styles.infoRow}>
                    <MapPin size={18} className={styles.icon} />
                    <span>Khu vực Trung tâm Hóc Môn, TP. Hồ Chí Minh</span>
                  </div>
                  <div className={styles.infoRow}>
                    <Phone size={18} className={styles.icon} />
                    <span>Hotline: 0909 123 456</span>
                  </div>
                  <div className={styles.infoRow}>
                    <Mail size={18} className={styles.icon} />
                    <span>Email: hocmon@icam.edu.vn</span>
                  </div>
                </div>
              </div>

              {/* Campus 2: District 12 */}
              <div className={styles.campusCard}>
                <div className={styles.campusHeader}>
                  <Building2 size={22} color="#F58220" />
                  <h3>Cơ Sở Quận 12</h3>
                </div>
                <div className={styles.campusBody}>
                  <div className={styles.infoRow}>
                    <MapPin size={18} className={styles.icon} />
                    <span>Khu vực Trung tâm Quận 12, TP. Hồ Chí Minh</span>
                  </div>
                  <div className={styles.infoRow}>
                    <Phone size={18} className={styles.icon} />
                    <span>Hotline: 0909 789 012</span>
                  </div>
                  <div className={styles.infoRow}>
                    <Mail size={18} className={styles.icon} />
                    <span>Email: quan12@icam.edu.vn</span>
                  </div>
                </div>
              </div>

              {/* Working Hours & Commitments */}
              <div className={styles.workingCard}>
                <div className={styles.workingItem}>
                  <Clock size={20} color="#F58220" />
                  <div>
                    <h4>Giờ Làm Việc Trung Tâm</h4>
                    <p>Thứ 2 – Chủ Nhật | 08:00 – 21:30 (Mở cửa tất cả các ngày trong tuần)</p>
                  </div>
                </div>

                <div className={styles.workingItem}>
                  <ShieldCheck size={20} color="#F58220" />
                  <div>
                    <h4>Cam Kết Tư Vấn</h4>
                    <p>Tư vấn viên liên hệ hỗ trợ trong vòng 24h & Test trình độ miễn phí 100%.</p>
                  </div>
                </div>
              </div>

              {/* Fast Shortcut Actions */}
              <div className={styles.shortcutGrid}>
                <a href="https://zalo.me" target="_blank" rel="noreferrer" className={styles.shortcutBtn}>
                  <MessageCircle size={18} color="#0088FF" /> Chat qua Zalo
                </a>
                <a href="https://m.me" target="_blank" rel="noreferrer" className={styles.shortcutBtn}>
                  <Send size={18} color="#A033FF" /> Chat Messenger
                </a>
              </div>
            </div>

            {/* RIGHT COLUMN: CONSULTATION FORM */}
            <div className={styles.formColumn}>
              <div className={styles.formCard}>
                <div className={styles.formCardHeader}>
                  <GraduationCap size={28} color="#F58220" />
                  <div>
                    <h2>Đăng Ký Tư Vấn & Test Trình Độ</h2>
                    <p>Học viên được kiểm tra trình độ 4 kỹ năng miễn phí và nhận lộ trình học cá nhân hóa.</p>
                  </div>
                </div>

                {submitted && (
                  <div className={styles.successAlert}>
                    <CheckCircle2 size={20} />
                    <span>Gửi thông tin thành công! Bộ phận tư vấn ANH NGỮ CAM sẽ liên hệ lại với bạn trong vòng 24h làm việc.</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className={styles.contactForm}>
                  <div className={styles.formGroup}>
                    <label htmlFor="name">Họ và tên *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Nhập họ và tên của bạn..."
                      required
                    />
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="phone">Số điện thoại *</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Nhập số điện thoại liên hệ..."
                        required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="email">Địa chỉ Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="email@example.com..."
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="branch">Cơ sở thuận tiện *</label>
                      <select
                        id="branch"
                        name="branch"
                        value={formData.branch}
                        onChange={handleChange}
                      >
                        <option value="hocmon">Cơ sở Hóc Môn</option>
                        <option value="quan12">Cơ sở Quận 12</option>
                      </select>
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="course">Khóa học quan tâm *</label>
                      <select
                        id="course"
                        name="course"
                        value={formData.course}
                        onChange={handleChange}
                      >
                        <option value="kids">CAM Kids Starter (4-6 tuổi)</option>
                        <option value="juniors">CAM Juniors (7-11 tuổi)</option>
                        <option value="teens">CAM Teens Master (12-15 tuổi)</option>
                        <option value="ielts">Lộ trình IELTS Bứt Tốc (4.5 - 7.5+)</option>
                        <option value="communication">Tiếng Anh Giao Tiếp Thực Chiến</option>
                        <option value="online">iCAM Online Đa Trải Nghiệm</option>
                      </select>
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="message">Lời nhắn / Yêu cầu thêm</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Ví dụ: Thời gian rảnh của học viên, trình độ hiện tại hoặc mong muốn cụ thể..."
                      rows={4}
                    />
                  </div>

                  <button type="submit" className={styles.submitBtn}>
                    <Send size={18} /> Gửi Yêu Cầu Tư Vấn Ngay
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LOCATION MAP PLACEHOLDER SECTION */}
      <section className={styles.mapSection}>
        <div className={styles.container}>
          <div className={styles.mapCard}>
            <MapPin size={36} color="#F58220" />
            <h3>Hệ Thống Cơ Sở ANH NGỮ CAM Tại Hóc Môn & Quận 12</h3>
            <p>Phụ huynh và học viên có thể đến trực tiếp cơ sở để tham quan phòng học thông minh Smartboard và tư vấn 1-1.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
