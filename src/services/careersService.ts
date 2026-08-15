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
  { id: 'dept_6', name: 'TRỢ GIẢNG', nameEn: 'Teaching Assistants', color: '#f59e0b' },
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
    createdAt: '2026-08-16T02:30:00.000Z',
    updatedAt: '2026-08-16T02:30:00.000Z',
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
    createdAt: '2026-08-16T02:30:00.000Z',
    updatedAt: '2026-08-16T02:30:00.000Z',
  },
  {
    id: 'job_3',
    title: 'GIÁO VIÊN ĐỒNG GIẢNG – TRỢ GIẢNG',
    titleEn: 'Co-Teacher & Teaching Assistant',
    department: 'TRỢ GIẢNG',
    departmentEn: 'Teaching Assistants',
    location: 'Cơ sở Quận 12',
    locationEn: 'District 12 Campus',
    type: 'Part-time',
    salary: '40.000 VND / GIỜ - 70.000 VND / GIỜ',
    salaryEn: '40,000 VND / HOUR - 70,000 VND / HOUR',
    deadline: '30/09/2026',
    status: 'open',
    description: '• Hỗ trợ giáo viên nước ngoài trong quá trình giảng dạy tại các trường Tiểu học và THCS.\n• Quản lý lớp học, hỗ trợ học sinh trong các hoạt động học tập.\n• Hướng dẫn học sinh tham gia trò chơi, hoạt động tương tác và ngoại khóa bằng tiếng Anh.\n• Chuẩn bị học cụ, giáo án và tài liệu trước mỗi buổi học.\n• Theo dõi tình hình học tập, điểm danh và hỗ trợ giáo viên đánh giá học sinh.\n• Phối hợp với bộ phận học vụ và giáo viên để đảm bảo chất lượng giảng dạy.',
    descriptionEn: '• Support foreign teachers in teaching primary and secondary school classes.\n• Manage classroom environment and assist students in learning activities.\n• Guide students in games, interactive tasks, and English extracurricular activities.\n• Prepare teaching aids, lesson plans, and materials prior to class sessions.\n• Track learning progress, attendance, and assist lead teachers in student evaluations.\n• Coordinate with academic department to ensure teaching quality.',
    requirements: '• Sinh viên hoặc tốt nghiệp chuyên ngành Ngoại ngữ, Sư phạm Tiếng Anh hoặc có chứng chỉ IELTS 6.0+.\n• Năng động, yêu thích môi trường sư phạm trẻ em, giao tiếp tốt.\n• Tác phong chuyên nghiệp, đúng giờ và có tinh thần trách nhiệm cao.',
    requirementsEn: '• English Pedagogy/Linguistics students or graduates, or IELTS 6.0+.\n• Energetic, passionate about young learners, strong communication.\n• Professional etiquette, punctual, and highly responsible.',
    benefits: '• Mức lương theo giờ hấp dẫn (40.000đ – 70.000đ/giờ) + Thưởng hiệu quả.\n• Được tập huấn kỹ năng giảng dạy và quản lý lớp học thực chiến.\n• Cơ hội thăng tiến lên Giáo viên chính thức tại hệ thống iCANCAM.',
    benefitsEn: '• Attractive hourly pay (40,000VND – 70,000VND/hr) + performance bonuses.\n• Practical classroom management & teaching methodology masterclass training.\n• Clear career advancement path to official Lead Teacher at iCANCAM.',
    applicationsCount: 22,
    createdAt: '2026-08-16T02:30:00.000Z',
    updatedAt: '2026-08-16T02:30:00.000Z',
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
    if (!error && data) {
      if (data.length > 0) {
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
            createdAt: item.created_at || '2026-08-16T02:30:00.000Z',
            updatedAt: item.updated_at || '2026-08-16T02:30:00.000Z',
          };
        });

        // Supabase is master for all DB rows. Only preserve local items not in DB yet (offline additions)
        const mergedList = [...careersFromDb];
        localList.forEach((localItem) => {
          const dbIdx = mergedList.findIndex((dbItem) => dbItem.id === localItem.id);
          if (dbIdx === -1) {
            mergedList.unshift(localItem);
            syncCareerToSupabase(localItem);
          }
        });

        saveCareers(mergedList);
        return mergedList;
      } else {
        // Seed initial data to Supabase once if DB is empty
        for (const job of INITIAL_CAREERS) {
          await syncCareerToSupabase(job);
        }
        saveCareers(INITIAL_CAREERS);
        return INITIAL_CAREERS;
      }
    }
  } catch (err) {
    console.warn('Supabase careers_posts table offline or not created yet:', err);
  }
  return getAllCareers();
};

const syncCareerToSupabase = async (job: CareersItem): Promise<{ success: boolean; error?: string }> => {
  const fullPayload: Record<string, any> = {
    id: job.id,
    title: job.title,
    title_en: job.titleEn || job.title,
    department: job.department,
    department_en: job.departmentEn || job.department,
    location: job.location,
    location_en: job.locationEn || job.location,
    type: job.type || 'Full-time',
    salary: job.salary,
    salary_en: job.salaryEn || job.salary,
    deadline: job.deadline || '30/09/2026',
    status: job.status || 'open',
    description: job.description || '',
    description_en: job.descriptionEn || job.description || '',
    requirements: job.requirements || '',
    requirements_en: job.requirementsEn || job.requirements || '',
    benefits: job.benefits || '',
    benefits_en: job.benefitsEn || job.benefits || '',
    applications_count: job.applicationsCount || 0,
    created_at: job.createdAt || new Date().toISOString(),
    updated_at: job.updatedAt || new Date().toISOString(),
  };

  try {
    let { error } = await supabase.from('careers_posts').upsert(fullPayload);

    if (error && error.message.includes('Could not find')) {
      // Fallback if optional _en columns are missing in Supabase schema cache
      const safePayload = { ...fullPayload };
      delete safePayload.benefits_en;
      delete safePayload.requirements_en;
      delete safePayload.description_en;
      delete safePayload.salary_en;
      delete safePayload.title_en;
      delete safePayload.department_en;
      delete safePayload.location_en;

      const retry = await supabase.from('careers_posts').upsert(safePayload);
      error = retry.error;
    }

    if (error) {
      console.error('Supabase careers_posts upsert error:', error.message, error.details, error.hint);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    console.error('Supabase career sync exception:', err);
    return { success: false, error: err?.message || 'Network or connection failure' };
  }
};

export const createCareer = async (
  data: Omit<CareersItem, 'id' | 'createdAt' | 'updatedAt' | 'applicationsCount'>
): Promise<{ success: boolean; data?: CareersItem; error?: string }> => {
  const list = getAllCareers();
  const now = new Date().toISOString();
  const created: CareersItem = {
    ...data,
    id: `job_${Date.now()}`,
    applicationsCount: 0,
    createdAt: now,
    updatedAt: now,
  };

  const syncRes = await syncCareerToSupabase(created);
  if (!syncRes.success) {
    return { success: false, error: syncRes.error };
  }

  const updatedList = [created, ...list];
  saveCareers(updatedList);
  return { success: true, data: created };
};

export const updateCareer = async (
  id: string,
  data: Partial<CareersItem>
): Promise<{ success: boolean; data?: CareersItem; error?: string }> => {
  const list = getAllCareers();
  const idx = list.findIndex((j) => j.id === id);
  if (idx === -1) return { success: false, error: 'Job position not found' };

  const updated: CareersItem = {
    ...list[idx],
    ...data,
    updatedAt: new Date().toISOString(),
  };

  const syncRes = await syncCareerToSupabase(updated);
  if (!syncRes.success) {
    return { success: false, error: syncRes.error };
  }

  list[idx] = updated;
  saveCareers(list);
  return { success: true, data: updated };
};

export const deleteCareer = async (id: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase.from('careers_posts').delete().eq('id', id);
    if (error) {
      console.error('Supabase delete career error:', error.message);
      return { success: false, error: error.message };
    }
    const list = getAllCareers();
    const filtered = list.filter((j) => j.id !== id);
    saveCareers(filtered);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Network or connection failure' };
  }
};
