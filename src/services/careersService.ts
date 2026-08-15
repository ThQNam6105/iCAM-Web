import { supabase } from './supabaseClient';

export type JobStatus = 'open' | 'closed' | 'draft';
export type JobType = 'Full-time' | 'Part-time' | 'Internship';

export interface DepartmentItem {
  id: string;
  name: string;
  nameEn?: string;
  description?: string;
  color?: string;
}

export interface CareersItem {
  id: string;
  title: string;
  titleEn?: string;
  department: string;
  departmentEn?: string;
  location: string;
  locationEn?: string;
  type: JobType;
  salary: string;
  salaryEn?: string;
  deadline: string;
  status: JobStatus;
  description: string;
  descriptionEn?: string;
  requirements: string;
  requirementsEn?: string;
  benefits: string;
  benefitsEn?: string;
  applicationsCount: number;
  createdAt: string;
  updatedAt: string;
}

const LOCAL_STORAGE_KEY = 'icancam_dynamic_careers_v1';
const DEPARTMENTS_STORAGE_KEY = 'icancam_dynamic_departments_v1';

export const INITIAL_DEPARTMENTS: DepartmentItem[] = [
  { id: 'dept_1', name: 'Khối Đào Tạo', nameEn: 'Academic Department', color: '#3b82f6' },
  { id: 'dept_2', name: 'Khối Tư Vấn & Tuyển Sinh', nameEn: 'Admissions & Course Consultants', color: '#F58220' },
  { id: 'dept_3', name: 'Khối Marketing', nameEn: 'Marketing Department', color: '#ec4899' },
  { id: 'dept_4', name: 'Khối Hành Chính & Nhân Sự', nameEn: 'Admin & HR Department', color: '#8b5cf6' },
  { id: 'dept_5', name: 'Khối Vận Hành & Học Vụ', nameEn: 'Operations & Student Affairs', color: '#10b981' },
];

export const INITIAL_CAREERS: CareersItem[] = [
  {
    id: 'job_1',
    title: 'Giáo Viên Tiếng Anh Trẻ Em (Kids English Teacher)',
    titleEn: 'Kids English Teacher',
    department: 'Khối Đào Tạo',
    departmentEn: 'Academic Department',
    location: 'Cơ sở Hóc Môn & Quận 12',
    locationEn: 'Hoc Mon & District 12 Campuses',
    type: 'Full-time',
    salary: '12.000.000đ - 18.000.000đ',
    salaryEn: '12,000,000VND - 18,000,000VND',
    deadline: '31/08/2026',
    status: 'open',
    description: '• Giảng dạy các lớp Tiếng Anh Trẻ Em (Junior & Teens) theo giáo trình 21st Century Learning của iCANCAM.\n• Theo dõi sát sao tiến độ học tập và tương tác báo cáo cùng phụ huynh.',
    descriptionEn: '• Teach Kids & Teens English classes following iCANCAM 21st Century Learning curriculum.\n• Closely monitor student progress and communicate proactively with parents.',
    requirements: '• Tốt nghiệp Đại học Sư phạm Ngoại ngữ hoặc Ngôn ngữ Anh.\n• Có chứng chỉ IELTS >= 7.0 hoặc TESOL/CELTA.\n• Phát âm chuẩn, giàu năng lượng và yêu trẻ.',
    requirementsEn: '• Bachelor degree in English Pedagogy or English Linguistics.\n• Valid IELTS >= 7.0 or TESOL/CELTA certification.\n• Standard pronunciation, energetic demeanor, and passion for teaching children.',
    benefits: '• Bảo hiểm xã hội & y tế đầy đủ 100% theo quy định.\n• Thưởng hiệu suất giảng dạy hàng tháng & thưởng lễ tết.\n• Cơ hội thăng tiến Trưởng nhóm chuyên môn hoặc Quản lý Đào tạo.\n• Khóa tập huấn Masterclass 4Ls + LETI hàng năm từ chuyên gia.',
    benefitsEn: '• 100% full social and health insurance per regulations.\n• Monthly teaching performance bonuses & holiday bonuses.\n• Clear career advancement path to Academic Team Lead or Manager.\n• Annual 4Ls + LETI Masterclass training from international experts.',
    applicationsCount: 14,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'job_2',
    title: 'Chuyên Viên Tư Vấn Tuyển Sinh (Course Consultant)',
    titleEn: 'Course Consultant',
    department: 'Khối Tư Vấn & Tuyển Sinh',
    departmentEn: 'Admissions & Course Consultants',
    location: 'Cơ sở Quận 12',
    locationEn: 'District 12 Campus',
    type: 'Full-time',
    salary: '10.000.000đ - 20.000.000đ (Lương cứng + Hoa hồng)',
    salaryEn: '10,000,000VND - 20,000,000VND (Base salary + Commission)',
    deadline: '15/09/2026',
    status: 'open',
    description: '• Tư vấn lộ trình học Tiếng Anh & IELTS cho phụ huynh và học sinh tại cơ sở iCANCAM.\n• Chăm sóc phụ huynh hiện tại và hỗ trợ giải đáp thắc mắc học phí.',
    descriptionEn: '• Advise parents and students on English & IELTS learning roadmaps at iCANCAM campuses.\n• Support existing parents and answer course fee inquiries.',
    requirements: '• Giao tiếp tốt, tự tin, khả năng thuyết phục cao.\n• Ưu tiên ứng viên có kinh nghiệm tư vấn trong lĩnh vực giáo dục.',
    requirementsEn: '• Strong communication skills, self-confident, persuasive mindset.\n• Priority given to candidates with prior education consulting experience.',
    benefits: '• Hoa hồng hấp dẫn theo doanh số tuyển sinh hàng tháng.\n• Môi trường làm việc năng động, đào tạo kỹ năng tư vấn chuyên nghiệp.\n• Thưởng vượt chỉ tiêu doanh số hàng quý.',
    benefitsEn: '• Attractive monthly admissions sales commissions.\n• Dynamic workplace environment with professional sales training.\n• Quarterly target achievement bonuses.',
    applicationsCount: 8,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'job_3',
    title: 'Trợ Giảng Lớp IELTS (IELTS Teaching Assistant)',
    titleEn: 'IELTS Teaching Assistant',
    department: 'Khối Đào Tạo',
    departmentEn: 'Academic Department',
    location: 'Cơ sở Hóc Môn',
    locationEn: 'Hoc Mon Campus',
    type: 'Part-time',
    salary: '50.000đ - 80.000đ / Giờ',
    salaryEn: '50,000VND - 80,000VND / Hour',
    deadline: '30/09/2026',
    status: 'open',
    description: '• Hỗ trợ giáo viên nước ngoài và bản ngữ quản lý lớp học.\n• Kiểm tra bài tập về nhà và chấm bài Writing/Speaking cho học viên.',
    descriptionEn: '• Assist foreign and native teachers in classroom management.\n• Check homework assignments and grade Writing/Speaking practice tasks.',
    requirements: '• Sinh viên chuyên ngành Ngoại ngữ hoặc Sư phạm.\n• Chứng chỉ IELTS >= 6.5.',
    requirementsEn: '• Foreign language or Education university students.\n• IELTS certificate >= 6.5.',
    benefits: '• Lịch làm việc linh hoạt phù hợp với lịch học.\n• Nâng cao kỹ năng sư phạm & làm việc trực tiếp với giáo viên bản ngữ.\n• Cấp chứng nhận kinh nghiệm làm việc sau 6 tháng.',
    benefitsEn: '• Flexible working shifts tailored to student schedules.\n• Enhance pedagogical skills working alongside native speakers.\n• Experience certificate granted after 6 months.',
    applicationsCount: 22,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
];

// DEPARTMENTS CRUD
export const getAllDepartments = (): DepartmentItem[] => {
  try {
    const raw = localStorage.getItem(DEPARTMENTS_STORAGE_KEY);
    let list: DepartmentItem[] = [];
    if (raw) {
      list = JSON.parse(raw);
    } else {
      list = INITIAL_DEPARTMENTS;
    }

    const updatedList = list.map((item) => {
      const seed = INITIAL_DEPARTMENTS.find((init) => init.id === item.id);
      if (seed) {
        return {
          ...item,
          nameEn: item.nameEn || seed.nameEn,
        };
      }
      return item;
    });

    localStorage.setItem(DEPARTMENTS_STORAGE_KEY, JSON.stringify(updatedList));
    return updatedList;
  } catch {
    return INITIAL_DEPARTMENTS;
  }
};

export const saveDepartments = (list: DepartmentItem[]) => {
  localStorage.setItem(DEPARTMENTS_STORAGE_KEY, JSON.stringify(list));
};

export const createDepartment = (dept: Omit<DepartmentItem, 'id'>): DepartmentItem => {
  const list = getAllDepartments();
  const newDept: DepartmentItem = {
    id: `dept_${Date.now()}`,
    ...dept,
  };
  const updated = [...list, newDept];
  saveDepartments(updated);
  return newDept;
};

export const updateDepartment = (id: string, data: Partial<DepartmentItem>): DepartmentItem | null => {
  const list = getAllDepartments();
  const idx = list.findIndex((d) => d.id === id);
  if (idx === -1) return null;
  const updated = { ...list[idx], ...data };
  list[idx] = updated;
  saveDepartments(list);
  return updated;
};

export const deleteDepartment = (id: string): boolean => {
  const list = getAllDepartments();
  const filtered = list.filter((d) => d.id !== id);
  saveDepartments(filtered);
  return true;
};

// CAREERS CRUD
export const getAllCareers = (): CareersItem[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    let list: CareersItem[] = [];
    if (raw) {
      list = JSON.parse(raw);
    } else {
      list = INITIAL_CAREERS;
    }

    const updatedList = list.map((item) => {
      const seed = INITIAL_CAREERS.find((init) => init.id === item.id);
      if (seed) {
        return {
          ...item,
          titleEn: item.titleEn || seed.titleEn,
          departmentEn: item.departmentEn || seed.departmentEn,
          locationEn: item.locationEn || seed.locationEn,
          salaryEn: item.salaryEn || seed.salaryEn,
          descriptionEn: item.descriptionEn || seed.descriptionEn,
          requirementsEn: item.requirementsEn || seed.requirementsEn,
          benefitsEn: item.benefitsEn || seed.benefitsEn,
        };
      }
      return item;
    });

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedList));
    return updatedList;
  } catch {
    return INITIAL_CAREERS;
  }
};

export const saveCareers = (list: CareersItem[]) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
};

export const fetchCareersFromSupabase = async (): Promise<CareersItem[]> => {
  const localList = getAllCareers();
  try {
    const { data, error } = await supabase.from('careers_posts').select('*').order('created_at', { ascending: false });
    if (!error && data && data.length > 0) {
      const careersFromDb: CareersItem[] = data.map((item) => {
        const seed = INITIAL_CAREERS.find((init) => init.id === item.id);
        return {
          id: item.id,
          title: item.title,
          titleEn: item.title_en || seed?.titleEn || item.title,
          department: item.department,
          departmentEn: item.department_en || seed?.departmentEn || item.department,
          location: item.location,
          locationEn: item.location_en || seed?.locationEn || item.location,
          type: item.type as JobType,
          salary: item.salary,
          salaryEn: item.salary_en || seed?.salaryEn || item.salary,
          deadline: item.deadline,
          status: item.status as JobStatus,
          description: item.description,
          descriptionEn: item.description_en || seed?.descriptionEn || item.description,
          requirements: item.requirements,
          requirementsEn: item.requirements_en || seed?.requirementsEn || item.requirements,
          benefits: item.benefits,
          benefitsEn: item.benefits_en || seed?.benefitsEn || item.benefits,
          applicationsCount: item.applications_count || 0,
          createdAt: item.created_at || '2026-01-01T00:00:00.000Z',
          updatedAt: item.updated_at || '2026-01-01T00:00:00.000Z',
        };
      });

      // Single source of truth merge
      const mergedList = [...careersFromDb];
      localList.forEach((localItem) => {
        const dbIdx = mergedList.findIndex((dbItem) => dbItem.id === localItem.id);
        const localTime = new Date(localItem.updatedAt || 0).getTime();

        if (dbIdx === -1) {
          mergedList.unshift(localItem);
          syncCareerToSupabase(localItem);
        } else {
          const dbTime = new Date(mergedList[dbIdx].updatedAt || 0).getTime();
          if (localTime > dbTime) {
            mergedList[dbIdx] = localItem;
            syncCareerToSupabase(localItem);
          }
        }
      });

      saveCareers(mergedList);
      return mergedList;
    } else if (!error && data && data.length === 0) {
      // Seed initial data to Supabase once if DB is empty
      for (const job of INITIAL_CAREERS) {
        await syncCareerToSupabase(job);
      }
      return INITIAL_CAREERS;
    }
  } catch (err) {
    console.warn('Supabase careers_posts table offline or not created yet:', err);
  }
  return getAllCareers();
};

const syncCareerToSupabase = async (job: CareersItem) => {
  try {
    const { error } = await supabase.from('careers_posts').upsert({
      id: job.id,
      title: job.title,
      title_en: job.titleEn,
      department: job.department,
      department_en: job.departmentEn,
      location: job.location,
      location_en: job.locationEn,
      type: job.type,
      salary: job.salary,
      salary_en: job.salaryEn,
      deadline: job.deadline,
      status: job.status,
      description: job.description,
      description_en: job.descriptionEn,
      requirements: job.requirements,
      requirements_en: job.requirementsEn,
      benefits: job.benefits,
      benefits_en: job.benefitsEn,
      applications_count: job.applicationsCount,
      created_at: job.createdAt,
      updated_at: job.updatedAt,
    });
    if (error) {
      console.error('Supabase careers_posts upsert error:', error.message, error.details, error.hint);
    }
  } catch (err) {
    console.error('Supabase career sync exception:', err);
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
