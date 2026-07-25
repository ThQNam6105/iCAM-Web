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
  ShieldCheck,
  ExternalLink,
  Navigation
} from 'lucide-react';
import styles from './Contact.module.css';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    branch: 'trungmytay',
    course: 'ielts',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: '', phone: '', email: '', branch: 'trungmytay', course: 'ielts', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const googleMapsUrl = 'https://maps.app.goo.gl/AhLJBp14TZsQwmuq5';
  const fullAddress = '344 A Tổ 13 KP 1, Trung Mỹ Tây, Hồ Chí Minh, Việt Nam';

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
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noreferrer"
              className={styles.quickBadgeLink}
              title="Xem bản đồ chỉ đường"
            >
              <MapPin size={16} color="#F58220" />
              <span>{fullAddress}</span>
              <ExternalLink size={14} />
            </a>
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
              {/* Main Campus Card */}
              <div className={styles.campusCard}>
                <div className={styles.campusHeader}>
                  <Building2 size={22} color="#F58220" />
                  <div>
                    <h3>Trụ Sở ANH NGỮ CAM</h3>
                    <span className={styles.subTag}>Hóc Môn & Quận 12</span>
                  </div>
                </div>
                <div className={styles.campusBody}>
                  <div className={styles.infoRow}>
                    <MapPin size={20} className={styles.icon} />
                    <div>
                      <strong>Địa chỉ chính thức:</strong>
                      <p className={styles.addressText}>{fullAddress}</p>
                    </div>
                  </div>

                  <div className={styles.infoRow}>
                    <Phone size={18} className={styles.icon} />
                    <div>
                      <strong>Hotline tuyển sinh & tư vấn:</strong>
                      <p>0909 123 456 - 0909 789 012</p>
                    </div>
                  </div>

                  <div className={styles.infoRow}>
                    <Mail size={18} className={styles.icon} />
                    <div>
                      <strong>Email hỗ trợ:</strong>
                      <p>tuyensinh@icam.edu.vn</p>
                    </div>
                  </div>

                  {/* Google Maps Button */}
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.mapsDirectionBtn}
                  >
                    <Navigation size={18} /> Định Vị Trên Google Maps <ExternalLink size={15} />
                  </a>
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
                <a href="http://zaloapp.com/qr/p/1eek3rblfox15" target="_blank" rel="noreferrer" className={styles.shortcutBtn}>
                  <MessageCircle size={18} color="#0088FF" /> Chat qua Zalo
                </a>
                <a href="https://m.me/tqnam6105" target="_blank" rel="noreferrer" className={styles.shortcutBtn}>
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
                      <label htmlFor="branch">Cơ sở đăng ký *</label>
                      <select
                        id="branch"
                        name="branch"
                        value={formData.branch}
                        onChange={handleChange}
                      >
                        <option value="trungmytay">Cơ sở Trung Mỹ Tây (344 A Tổ 13 KP 1, HCM)</option>
                        <option value="hocmon">Cơ sở Hóc Môn & Quận 12</option>
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

      {/* LOCATION MAP EMBEDDED SECTION */}
      <section className={styles.mapSection}>
        <div className={styles.container}>
          <div className={styles.mapCard}>
            <div className={styles.mapHeaderInfo}>
              <MapPin size={32} color="#F58220" />
              <div>
                <h3>Vị Trí Bản Đồ Trung Tâm ANH NGỮ CAM</h3>
                <p className={styles.mapAddress}>{fullAddress}</p>
              </div>
            </div>

            {/* Embedded Google Maps iFrame */}
            <div className={styles.mapFrameWrapper}>
              <iframe
                title="Bản đồ ANH NGỮ CAM Trung Mỹ Tây"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.4725356950293!2d106.61750031533446!3d10.851624892270634!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752a16d5555555%3A0x1!2zMzQ0IEEgVOG7lSAxMyBLUCAxLCBUcnVuZyBN4bu5IFTDonksIEjhu5MgQ2jDrSBNaW5o!5e0!3m2!1svi!2s!4v1700000000000!5m2!1svi!2s"
                width="100%"
                height="380"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div className={styles.mapFooter}>
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className={styles.openMapsBtn}
              >
                <Navigation size={18} /> Mở Ứng Dụng Google Maps Chỉ Đường <ExternalLink size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
