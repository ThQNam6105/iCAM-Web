import React from 'react';
import { Briefcase, MapPin, Clock, DollarSign, Send } from 'lucide-react';
import styles from './Careers.module.css';

interface Job {
  id: number;
  title: string;
  department: string;
  type: string;
  location: string;
  salary: string;
}

const jobs: Job[] = [
  {
    id: 1,
    title: 'Giáo Viên Tiếng Anh Full-time / Part-time',
    department: 'Học Thuật',
    type: 'Full-time hoặc Part-time',
    location: 'Hà Nội',
    salary: 'Thỏa thuận theo năng lực',
  },
  {
    id: 2,
    title: 'Trợ Giảng Tiếng Anh (Tutor) Cho Lớp Trẻ Em',
    department: 'Học Thuật',
    type: 'Part-time',
    location: 'Hà Nội',
    salary: '25.000đ - 45.000đ / giờ',
  },
  {
    id: 3,
    title: 'Chuyên Viên Tư Vấn Tuyển Sinh (Academic Consultant)',
    department: 'Kinh Doanh',
    type: 'Full-time',
    location: 'Hà Nội',
    salary: '8.000.000đ + % Doanh số',
  },
];

export const Careers: React.FC = () => {
  return (
    <div className="page-container">
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={`${styles.title} gradient-text`}>Cơ Hội Nghề Nghiệp</h1>
          <p className={styles.subtitle}>
            Gia nhập đội ngũ iCAM để cùng nhau xây dựng môi trường học tiếng Anh năng động, chất lượng
            và truyền cảm hứng cho hàng ngàn học viên.
          </p>
        </div>

        <div className={styles.jobsList}>
          {jobs.map((job) => (
            <div key={job.id} className={`${styles.jobCard} glass-interactive`}>
              <div className={styles.jobDetails}>
                <h2 className={styles.jobTitle}>{job.title}</h2>
                <div className={styles.jobMeta}>
                  <span className={styles.metaItem}>
                    <Briefcase size={12} style={{ display: 'inline', marginRight: '4px' }} />
                    {job.department}
                  </span>
                  <span className={styles.metaItem}>
                    <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />
                    {job.type}
                  </span>
                  <span className={styles.metaItem}>
                    <MapPin size={12} style={{ display: 'inline', marginRight: '4px' }} />
                    {job.location}
                  </span>
                  <span
                    className={styles.metaItem}
                    style={{ color: 'hsl(var(--primary))', fontWeight: 600 }}
                  >
                    <DollarSign size={12} style={{ display: 'inline', marginRight: '4px' }} />
                    {job.salary}
                  </span>
                </div>
              </div>

              <button className="btn-primary">
                <Send size={16} /> Ứng tuyển ngay
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Careers;
