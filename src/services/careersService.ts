import { supabase } from './supabaseClient';

export type JobStatus = 'open' | 'closed' | 'draft';
export type JobType = 'Full-time' | 'Part-time' | 'Internship';

export interface CareersItem {
  id: string;
  title: string;
  titleEn?: string;
  department: string;
  location: string;
  type: JobType;
  salary: string;
  deadline: string;
  status: JobStatus;
  description: string;
  requirements: string;
  benefits: string;
  applicationsCount: number;
  createdAt: string;
  updatedAt: string;
}

const LOCAL_STORAGE_KEY = 'icancam_dynamic_careers_v1';

export const INITIAL_CAREERS: CareersItem[] = [
  {
    id: 'job_1',
    title: 'Giáo Viên Tiếng Anh Trẻ Em (Kids English Teacher)',
    titleEn: 'Kids English Teacher',
    department: 'Khối Đào Tạo',
    location: 'Cơ sở Hóc Môn & Quận 12',
    type: 'Full-time',
    salary: '12.000.000đ - 18.000.000đ',
    deadline: '31/08/2026',
    status: 'open',
    description: 'Giảng dạy các lớp Tiếng Anh Trẻ Em (Junior & Teens) theo giáo trình 21st Century Learning của iCANCAM.',
    requirements: 'Tốt nghiệp Đại học Sư phạm Ngoại ngữ hoặc Ngôn ngữ Anh. Có chứng chỉ IELTS >= 7.0 hoặc TESOL/CELTA.',
    benefits: 'Bảo hiểm đầy đủ, thưởng hiệu suất hàng tháng, cơ hội thăng tiến Trưởng nhóm chuyên môn.',
    applicationsCount: 14,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'job_2',
    title: 'Chuyên Viên Tư Vấn Tuyển Sinh (Course Consultant)',
    titleEn: 'Course Consultant',
    department: 'Khối Tư Vấn & Tuyển Sinh',
    location: 'Cơ sở Quận 12',
    type: 'Full-time',
    salary: '10.000.000đ - 20.000.000đ (Lương cứng + Hoa hồng)',
    deadline: '15/09/2026',
    status: 'open',
    description: 'Tư vấn lộ trình học Tiếng Anh & IELTS cho phụ huynh và học sinh tại cơ sở iCANCAM.',
    requirements: 'Giao tiếp tốt, tự tin, ưu tiên ứng viên có kinh nghiệm tư vấn trong lĩnh vực giáo dục.',
    benefits: 'Hoa hồng hấp dẫn theo doanh số, môi trường làm việc năng động, đào tạo kỹ năng mềm.',
    applicationsCount: 8,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'job_3',
    title: 'Trợ Giảng Lớp IELTS (IELTS Teaching Assistant)',
    titleEn: 'IELTS Teaching Assistant',
    department: 'Khối Đào Tạo',
    location: 'Cơ sở Hóc Môn',
    type: 'Part-time',
    salary: '50.000đ - 80.000đ / Giờ',
    deadline: '30/09/2026',
    status: 'open',
    description: 'Hỗ trợ giáo viên nước ngoài và bản ngữ quản lý lớp học, kiểm tra bài tập về nhà của học viên.',
    requirements: 'Sinh viên chuyên ngành Ngoại ngữ. Chứng chỉ IELTS >= 6.5.',
    benefits: 'Lịch làm việc linh hoạt, nâng cao kỹ năng sư phạm, cấp chứng nhận kinh nghiệm.',
    applicationsCount: 22,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const getAllCareers = (): CareersItem[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_CAREERS));
    return INITIAL_CAREERS;
  } catch {
    return INITIAL_CAREERS;
  }
};

export const fetchCareersFromSupabase = async (): Promise<CareersItem[]> => {
  try {
    const { data, error } = await supabase.from('careers_posts').select('*').order('created_at', { ascending: false });
    if (!error && data && data.length > 0) {
      const careersFromDb: CareersItem[] = data.map((item) => ({
        id: item.id,
        title: item.title,
        titleEn: item.title_en,
        department: item.department,
        location: item.location,
        type: item.type as JobType,
        salary: item.salary,
        deadline: item.deadline,
        status: item.status as JobStatus,
        description: item.description,
        requirements: item.requirements,
        benefits: item.benefits,
        applicationsCount: item.applications_count || 0,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      }));

      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(careersFromDb));
      return careersFromDb;
    }
  } catch (err) {
    console.warn('Supabase careers_posts table offline or not created yet:', err);
  }
  return getAllCareers();
};

const syncCareerToSupabase = async (job: CareersItem) => {
  try {
    await supabase.from('careers_posts').upsert({
      id: job.id,
      title: job.title,
      title_en: job.titleEn,
      department: job.department,
      location: job.location,
      type: job.type,
      salary: job.salary,
      deadline: job.deadline,
      status: job.status,
      description: job.description,
      requirements: job.requirements,
      benefits: job.benefits,
      applications_count: job.applicationsCount,
      created_at: job.createdAt,
      updated_at: job.updatedAt,
    });
  } catch (err) {
    console.warn('Supabase career sync error:', err);
  }
};

export const createCareer = (data: Omit<CareersItem, 'id' | 'createdAt' | 'updatedAt' | 'applicationsCount'>): CareersItem => {
  const list = getAllCareers();
  const now = new Date().toISOString();
  const created: CareersItem = {
    ...data,
    id: `job_${Date.now()}`,
    applicationsCount: 0,
    createdAt: now,
    updatedAt: now,
  };

  const updated = [created, ...list];
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  syncCareerToSupabase(created);
  return created;
};

export const updateCareer = (id: string, data: Partial<CareersItem>): CareersItem | null => {
  const list = getAllCareers();
  const idx = list.findIndex((j) => j.id === id);
  if (idx === -1) return null;

  const updated: CareersItem = {
    ...list[idx],
    ...data,
    updatedAt: new Date().toISOString(),
  };

  list[idx] = updated;
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
  syncCareerToSupabase(updated);
  return updated;
};

export const deleteCareer = (id: string): boolean => {
  const list = getAllCareers();
  const filtered = list.filter((j) => j.id !== id);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
  supabase.from('careers_posts').delete().eq('id', id).then();
  return true;
};
