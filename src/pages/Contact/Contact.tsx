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
import { useLanguage } from '../../contexts/LanguageContext';
import { SectionTransition } from '../../components/SectionTransition/SectionTransition';

export const Contact: React.FC = () => {
  const { language, t } = useLanguage();
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
  const fullAddress = language === 'en'
    ? '344 A To 13 KP 1, Trung My Tay, Ho Chi Minh City, Vietnam'
    : '344 A Tổ 13 KP 1, Trung Mỹ Tây, Hồ Chí Minh, Việt Nam';

  return (
    <div className={styles.contactWrapper}>
      {/* HERO SECTION */}
      <section className={styles.heroSection}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContainer}>
          <div className={styles.heroBadge}>
            <Sparkles size={16} />
            <span>{t.contact.heroBadge}</span>
          </div>

          <h1 className={styles.heroTitle}>
            {language === 'en' ? 'Contact Us & ' : 'Liên Hệ & '}
            <span className={styles.orangeHighlight}>
              {language === 'en' ? 'Book Consultation' : 'Đăng Ký Tư Vấn'}
            </span>
          </h1>

          <p className={styles.heroSubtitle}>
            {t.contact.heroSubtitle}
          </p>

          {/* Quick Contact Badges */}
          <div className={styles.quickContactRow}>
            <div className={styles.quickBadge}>
              <PhoneCall size={16} color="#F58220" />
              <span>{t.contact.hotlineBadge}</span>
            </div>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noreferrer"
              className={styles.quickBadgeLink}
              title={language === 'en' ? 'View directions on map' : 'Xem bản đồ chỉ đường'}
            >
              <MapPin size={16} color="#F58220" />
              <span>{fullAddress}</span>
              <ExternalLink size={14} />
            </a>
            <div className={styles.quickBadge}>
              <Clock size={16} color="#F58220" />
              <span>{t.contact.hoursBadge}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Transition: Hero (Navy) -> Main Split Section (Soft Orange) */}
      <SectionTransition variant="navy-to-soft-orange" />

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
                    <h3>{t.contact.campusTitle}</h3>
                    <span className={styles.subTag}>{t.contact.subTag}</span>
                  </div>
                </div>
                <div className={styles.campusBody}>
                  <div className={styles.infoRow}>
                    <MapPin size={20} className={styles.icon} />
                    <div>
                      <strong>{t.contact.addressLabel}</strong>
                      <p className={styles.addressText}>{fullAddress}</p>
                    </div>
                  </div>

                  <div className={styles.infoRow}>
                    <Phone size={18} className={styles.icon} />
                    <div>
                      <strong>{t.contact.hotlineLabel}</strong>
                      <p>0909 123 456 - 0909 789 012</p>
                    </div>
                  </div>

                  <div className={styles.infoRow}>
                    <Mail size={18} className={styles.icon} />
                    <div>
                      <strong>{t.contact.emailLabel}</strong>
                      <p>
                        <a href="mailto:thieunam2005@gmail.com" style={{ color: 'inherit', textDecoration: 'none' }}>
                          thieunam2005@gmail.com
                        </a>
                      </p>
                    </div>
                  </div>

                  {/* Google Maps Button */}
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.mapsDirectionBtn}
                  >
                    <Navigation size={18} /> {t.contact.mapsBtn} <ExternalLink size={15} />
                  </a>
                </div>
              </div>

              {/* Working Hours & Commitments */}
              <div className={styles.workingCard}>
                <div className={styles.workingItem}>
                  <Clock size={20} color="#F58220" />
                  <div>
                    <h4>{t.contact.hoursTitle}</h4>
                    <p>{t.contact.hoursDesc}</p>
                  </div>
                </div>

                <div className={styles.workingItem}>
                  <ShieldCheck size={20} color="#F58220" />
                  <div>
                    <h4>{t.contact.commitTitle}</h4>
                    <p>{t.contact.commitDesc}</p>
                  </div>
                </div>
              </div>

              {/* Fast Shortcut Actions */}
              <div className={styles.shortcutGrid}>
                <a href="http://zaloapp.com/qr/p/1eek3rblfox15" target="_blank" rel="noreferrer" className={styles.shortcutBtn}>
                  <MessageCircle size={18} color="#0088FF" /> Chat Zalo
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
                    <h2>{t.contact.formTitle}</h2>
                    <p>{t.contact.formDesc}</p>
                  </div>
                </div>

                {submitted && (
                  <div className={styles.successAlert}>
                    <CheckCircle2 size={20} />
                    <span>{t.contact.successAlert}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className={styles.contactForm}>
                  <div className={styles.formGroup}>
                    <label htmlFor="name">{t.contact.fullNameLabel}</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={language === 'en' ? 'Enter full name...' : 'Nhập họ và tên...'}
                      required
                    />
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="phone">{t.contact.phoneLabel}</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder={language === 'en' ? 'Enter phone number...' : 'Nhập số điện thoại...'}
                        required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="email">{t.contact.emailInputLabel}</label>
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
                      <label htmlFor="branch">{t.contact.branchLabel}</label>
                      <select
                        id="branch"
                        name="branch"
                        value={formData.branch}
                        onChange={handleChange}
                      >
                        <option value="trungmytay">{t.contact.branchOpt1}</option>
                        <option value="hocmon">{t.contact.branchOpt2}</option>
                      </select>
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="course">{t.contact.courseLabel}</label>
                      <select
                        id="course"
                        name="course"
                        value={formData.course}
                        onChange={handleChange}
                      >
                        <option value="kids">CAM Kids Starter (4-6)</option>
                        <option value="juniors">CAM Juniors (7-11)</option>
                        <option value="teens">CAM Teens Master (12-15)</option>
                        <option value="ielts">IELTS Acceleration (4.5 - 7.5+)</option>
                        <option value="communication">Practical Communication</option>
                        <option value="online">iCAM Online 21st</option>
                      </select>
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="message">{t.contact.messageLabel}</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder={language === 'en' ? 'Add any notes or requirements...' : 'Ghi chú thêm nhu cầu của bạn...'}
                      rows={4}
                    />
                  </div>

                  <button type="submit" className={styles.submitBtn}>
                    <Send size={18} /> {t.contact.submitBtn}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Transition: Main Split Section (Soft Orange) -> Map Section (Navy) */}
      <SectionTransition variant="soft-orange-to-navy" />

      {/* LOCATION MAP EMBEDDED SECTION */}
      <section className={styles.mapSection}>
        <div className={styles.container}>
          <div className={styles.mapCard}>
            <div className={styles.mapHeaderInfo}>
              <MapPin size={32} color="#F58220" />
              <div>
                <h3>{t.contact.mapTitle}</h3>
                <p className={styles.mapAddress}>{fullAddress}</p>
              </div>
            </div>

            {/* Embedded Google Maps iFrame */}
            <div className={styles.mapFrameWrapper}>
              <iframe
                title="Google Maps ICANCAM"
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
                <Navigation size={18} /> {t.contact.openAppBtn} <ExternalLink size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
