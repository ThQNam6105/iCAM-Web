import { supabase } from './supabaseClient';
import teacherJames from '../assets/teacher_james.png';
import teacherDavid from '../assets/teacher_david.png';
import teacherSarah from '../assets/teacher_sarah.png';
import teacherOliver from '../assets/teacher_oliver.png';
import teacherEmma from '../assets/teacher_emma.png';
import teacherLucas from '../assets/teacher_lucas.png';
import teacherLoan from '../assets/teacher_loan.png';
import teacherKhoa from '../assets/teacher_khoa.png';
import teacherNhat from '../assets/teacher_nhat.png';
import teacherTho from '../assets/teacher_tho.png';
import teacherPhuc from '../assets/teacher_phuc.png';

export type EmploymentType = 'Full-time' | 'Part-time' | 'Internship';
export type StaffStatus = 'probation' | 'active' | 'archived';
export type DocumentType = 'contract' | 'cv' | 'degree' | 'certificate' | 'identity' | 'other';
export type UserRole = 'Super Admin' | 'HR Manager' | 'Manager' | 'Staff';

export interface CampusItem {
  id: string;
  name: string;
  code: string;
  address: string;
}

export interface StaffMember {
  id: string;
  employeeCode: string;
  fullName: string;
  workEmail: string;
  phone: string;
  avatarUrl?: string;
  departmentId: string;
  departmentName: string;
  jobTitle: string;
  employmentType: EmploymentType;
  campusIds: string[]; // Relational multi-campus link
  joinedDate: string;
  probationEndDate?: string;
  contractEndDate?: string;
  status: StaffStatus;
  qualification?: string;
  degrees?: string[];
  certifications?: string[];
  profileCompleteness: number; // 0 - 100%
  createdAt: string;
  updatedAt: string;
}

export interface StaffDocument {
  id: string;
  staffId: string;
  documentType: DocumentType;
  fileName: string;
  fileSize: string;
  mimeType: string;
  storagePath: string; // cms-private-hr bucket path
  uploadedAt: string;
  expiresAt?: string;
  uploadedBy: string;
  signedUrl?: string;
}

export interface EmploymentHistoryItem {
  id: string;
  staffId: string;
  departmentName: string;
  jobTitle: string;
  campusSummary: string;
  startDate: string;
  endDate?: string;
  changeReason: string;
  createdAt: string;
}

export interface CompensationItem {
  id: string;
  staffId: string;
  baseSalary: number;
  allowance: number;
  effectiveDate: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
}

export interface StaffAuditLog {
  id: string;
  staffId: string;
  actorEmail: string;
  action: string;
  previousValue?: string;
  newValue?: string;
  timestamp: string;
}

const LOCAL_STORAGE_KEY = 'icancam_dynamic_staff_v1';
const DOCUMENTS_STORAGE_KEY = 'icancam_staff_documents_v1';
const HISTORY_STORAGE_KEY = 'icancam_staff_history_v1';
const COMPENSATION_STORAGE_KEY = 'icancam_staff_compensation_v1';
const AUDIT_STORAGE_KEY = 'icancam_staff_audit_v1';

export const INITIAL_CAMPUSES: CampusItem[] = [
  {
    id: 'campus_hm',
    name: 'Cơ sở Hóc Môn',
    code: 'HM',
    address: '344A Tổ 13 KP1, Huyện Hóc Môn, TP.HCM',
  },
  {
    id: 'campus_q12',
    name: 'Cơ sở Quận 12',
    code: 'Q12',
    address: '15 Tân Chánh Hiệp 10, Phường Tân Chánh Hiệp, Quận 12, TP.HCM',
  },
];

export const INITIAL_STAFF: StaffMember[] = [
  {
    id: 'staff_101',
    employeeCode: 'ICAM-HR-001',
    fullName: 'James Harrison',
    workEmail: 'james.harrison@icancam.edu.vn',
    phone: '0909123401',
    avatarUrl: teacherJames,
    departmentId: 'dept_1',
    departmentName: 'Khối Đào Tạo',
    jobTitle: 'Giám Đốc Quản Lý Chuyên Môn (Academic Manager)',
    employmentType: 'Full-time',
    campusIds: ['campus_hm', 'campus_q12'],
    joinedDate: '2024-01-15',
    probationEndDate: '2024-03-15',
    contractEndDate: '2027-01-15',
    status: 'active',
    qualification: 'MA in TESOL - University of Oxford | 9.0 IELTS Overall',
    degrees: ['Thạc sĩ TESOL - University of Oxford'],
    certifications: ['CELTA Grade A', 'Senior Trainer 8+ năm kinh nghiệm', 'IELTS 9.0'],
    profileCompleteness: 100,
    createdAt: '2024-01-15T08:00:00.000Z',
    updatedAt: '2026-08-16T10:00:00.000Z',
  },
  {
    id: 'staff_102',
    employeeCode: 'ICAM-HR-002',
    fullName: 'David Miller',
    workEmail: 'david.miller@icancam.edu.vn',
    phone: '0909123402',
    avatarUrl: teacherDavid,
    departmentId: 'dept_1',
    departmentName: 'Khối Đào Tạo',
    jobTitle: 'Giám Đốc Đào Tạo (Academic Director)',
    employmentType: 'Full-time',
    campusIds: ['campus_hm', 'campus_q12'],
    joinedDate: '2024-03-01',
    probationEndDate: '2024-05-01',
    contractEndDate: '2027-03-01',
    status: 'active',
    qualification: 'Thạc sĩ Ngôn ngữ học - University of Cambridge | Cựu giám khảo IELTS',
    degrees: ['Master of Linguistics - University of Cambridge'],
    certifications: ['Certified IELTS Examiner', 'IELTS 9.0'],
    profileCompleteness: 100,
    createdAt: '2024-03-01T08:00:00.000Z',
    updatedAt: '2026-08-16T10:00:00.000Z',
  },
  {
    id: 'staff_103',
    employeeCode: 'ICAM-HR-003',
    fullName: 'Sarah Jenkins',
    workEmail: 'sarah.jenkins@icancam.edu.vn',
    phone: '0909123403',
    avatarUrl: teacherSarah,
    departmentId: 'dept_1',
    departmentName: 'Khối Đào Tạo',
    jobTitle: 'Trưởng Bộ Môn IELTS (Head of IELTS)',
    employmentType: 'Full-time',
    campusIds: ['campus_q12'],
    joinedDate: '2024-06-15',
    probationEndDate: '2024-08-15',
    contractEndDate: '2026-09-05', // Expiring soon in 20 days
    status: 'active',
    qualification: 'Cử nhân Danh dự Ngôn ngữ - RMIT University | 8.5 IELTS Overall',
    degrees: ['Bachelor with Honors - RMIT University'],
    certifications: ['Exclusive IELTS Curriculum Creator', 'IELTS 8.5'],
    profileCompleteness: 90,
    createdAt: '2024-06-15T08:00:00.000Z',
    updatedAt: '2026-08-16T10:00:00.000Z',
  },
  {
    id: 'staff_104',
    employeeCode: 'ICAM-HR-004',
    fullName: 'Oliver Smith',
    workEmail: 'oliver.smith@icancam.edu.vn',
    phone: '0909123404',
    avatarUrl: teacherOliver,
    departmentId: 'dept_1',
    departmentName: 'Khối Đào Tạo',
    jobTitle: 'Giáo Viên IELTS Cao Cấp (Senior IELTS Trainer)',
    employmentType: 'Full-time',
    campusIds: ['campus_hm'],
    joinedDate: '2025-01-10',
    probationEndDate: '2025-03-10',
    contractEndDate: '2027-01-10',
    status: 'active',
    qualification: 'Thạc sĩ Giáo dục - University of London | 8.5 IELTS Overall',
    degrees: ['Master of Education - University of London'],
    certifications: ['iCANCAM IELTS Prep Book Author', 'IELTS 8.5'],
    profileCompleteness: 100,
    createdAt: '2025-01-10T08:00:00.000Z',
    updatedAt: '2026-08-16T10:00:00.000Z',
  },
  {
    id: 'staff_105',
    employeeCode: 'ICAM-HR-005',
    fullName: 'Emma Cooper',
    workEmail: 'emma.cooper@icancam.edu.vn',
    phone: '0909123405',
    avatarUrl: teacherEmma,
    departmentId: 'dept_1',
    departmentName: 'Khối Đào Tạo',
    jobTitle: 'Chuyên Gia Giảng Dạy IELTS (IELTS Specialist)',
    employmentType: 'Full-time',
    campusIds: ['campus_hm', 'campus_q12'],
    joinedDate: '2025-05-01',
    probationEndDate: '2025-07-01',
    contractEndDate: '2027-05-01',
    status: 'active',
    qualification: 'Cử nhân Ngôn ngữ - University of Edinburgh | 8.0 IELTS Overall',
    degrees: ['Bachelor of Linguistics - University of Edinburgh'],
    certifications: ['Cambridge Certified CELTA', 'IELTS 8.0'],
    profileCompleteness: 100,
    createdAt: '2025-05-01T08:00:00.000Z',
    updatedAt: '2026-08-16T10:00:00.000Z',
  },
  {
    id: 'staff_106',
    employeeCode: 'ICAM-HR-006',
    fullName: 'Lucas Davies',
    workEmail: 'lucas.davies@icancam.edu.vn',
    phone: '0909123406',
    avatarUrl: teacherLucas,
    departmentId: 'dept_1',
    departmentName: 'Khối Đào Tạo',
    jobTitle: 'Chuyên Gia Giảng Dạy IELTS (IELTS Specialist)',
    employmentType: 'Part-time',
    campusIds: ['campus_q12'],
    joinedDate: '2026-07-01',
    probationEndDate: '2026-09-01', // Probation ending soon
    contractEndDate: '2027-07-01',
    status: 'probation',
    qualification: 'Thạc sĩ Ngôn ngữ - University of Edinburgh | 8.5 IELTS Overall',
    degrees: ['Master of Linguistics - University of Edinburgh'],
    certifications: ['Cambridge Certified CELTA', 'IELTS 8.5'],
    profileCompleteness: 80,
    createdAt: '2026-07-01T08:00:00.000Z',
    updatedAt: '2026-08-16T10:00:00.000Z',
  },
  {
    id: 'staff_107',
    employeeCode: 'ICAM-HR-007',
    fullName: 'Nguyễn Thị Bích Loan',
    workEmail: 'bichloan.hr@icancam.edu.vn',
    phone: '0909123407',
    avatarUrl: teacherLoan,
    departmentId: 'dept_4',
    departmentName: 'Khối Hành Chính & Nhân Sự',
    jobTitle: 'Trưởng Phòng Nhân Sự (HR Manager)',
    employmentType: 'Full-time',
    campusIds: ['campus_hm', 'campus_q12'],
    joinedDate: '2024-02-01',
    probationEndDate: '2024-04-01',
    contractEndDate: '2027-02-01',
    status: 'active',
    qualification: 'Cử nhân Quản trị Nhân sự - ĐH Kinh Tế TP.HCM',
    degrees: ['Cử nhân Quản trị Kinh doanh'],
    certifications: ['SHRM Certified Professional'],
    profileCompleteness: 100,
    createdAt: '2024-02-01T08:00:00.000Z',
    updatedAt: '2026-08-16T10:00:00.000Z',
  },
  {
    id: 'staff_108',
    employeeCode: 'ICAM-HR-008',
    fullName: 'Lê Anh Khoa',
    workEmail: 'anhkhoa.academic@icancam.edu.vn',
    phone: '0909123408',
    avatarUrl: teacherKhoa,
    departmentId: 'dept_1',
    departmentName: 'Khối Đào Tạo',
    jobTitle: 'Trưởng Nhóm Chuyên Môn Đào Tạo',
    employmentType: 'Full-time',
    campusIds: ['campus_hm'],
    joinedDate: '2024-08-15',
    probationEndDate: '2024-10-15',
    contractEndDate: '2026-09-01', // Expiring soon
    status: 'active',
    qualification: 'Thạc sĩ Sư phạm Tiếng Anh - ĐH Sư Phạm TP.HCM | IELTS 8.5',
    degrees: ['Thạc sĩ Sư phạm Anh văn'],
    certifications: ['DELTA Module 1 & 2', 'IELTS 8.5'],
    profileCompleteness: 100,
    createdAt: '2024-08-15T08:00:00.000Z',
    updatedAt: '2026-08-16T10:00:00.000Z',
  },
  {
    id: 'staff_109',
    employeeCode: 'ICAM-HR-009',
    fullName: 'Phạm Minh Nhật',
    workEmail: 'minhnhat.sales@icancam.edu.vn',
    phone: '0909123409',
    avatarUrl: teacherNhat,
    departmentId: 'dept_2',
    departmentName: 'Khối Tư Vấn & Tuyển Sinh',
    jobTitle: 'Chuyên Viên Tư Vấn Tuyển Sinh',
    employmentType: 'Full-time',
    campusIds: ['campus_q12'],
    joinedDate: '2025-02-15',
    probationEndDate: '2025-04-15',
    contractEndDate: '2027-02-15',
    status: 'active',
    qualification: 'Cử nhân Quản trị Kinh doanh - ĐH Quốc Gia TP.HCM',
    degrees: ['Cử nhân QTKD'],
    certifications: ['Customer Service Excellence'],
    profileCompleteness: 90,
    createdAt: '2025-02-15T08:00:00.000Z',
    updatedAt: '2026-08-16T10:00:00.000Z',
  },
  {
    id: 'staff_110',
    employeeCode: 'ICAM-HR-010',
    fullName: 'Trần Văn Thọ',
    workEmail: 'vantho.ops@icancam.edu.vn',
    phone: '0909123410',
    avatarUrl: teacherTho,
    departmentId: 'dept_5',
    departmentName: 'Khối Vận Hành & Học Vụ',
    jobTitle: 'Giám Đốc Điều Hành Cơ Sở (Center Manager)',
    employmentType: 'Full-time',
    campusIds: ['campus_hm'],
    joinedDate: '2023-11-01',
    probationEndDate: '2024-01-01',
    contractEndDate: '2026-11-01',
    status: 'active',
    qualification: 'Cử nhân Quản trị - ĐH Bách Khoa TP.HCM',
    degrees: ['Cử nhân Quản trị Công nghiệp'],
    certifications: ['Project Management Professional (PMP)'],
    profileCompleteness: 100,
    createdAt: '2023-11-01T08:00:00.000Z',
    updatedAt: '2026-08-16T10:00:00.000Z',
  },
  {
    id: 'staff_111',
    employeeCode: 'ICAM-HR-011',
    fullName: 'Ngô Hồng Phúc',
    workEmail: 'hongphuc.ops@icancam.edu.vn',
    phone: '0909123411',
    avatarUrl: teacherPhuc,
    departmentId: 'dept_5',
    departmentName: 'Khối Vận Hành & Học Vụ',
    jobTitle: 'Chuyên Viên Quản Lý Học Vụ',
    employmentType: 'Full-time',
    campusIds: ['campus_q12'],
    joinedDate: '2025-04-01',
    probationEndDate: '2025-06-01',
    contractEndDate: '2027-04-01',
    status: 'active',
    qualification: 'Cử nhân Công nghệ Thông tin - ĐH KHTN TP.HCM',
    degrees: ['Cử nhân CNTT'],
    certifications: ['Educational Operations Specialist'],
    profileCompleteness: 90,
    createdAt: '2025-04-01T08:00:00.000Z',
    updatedAt: '2026-08-16T10:00:00.000Z',
  },
];

export const INITIAL_DOCUMENTS: StaffDocument[] = [
  {
    id: 'doc_1',
    staffId: 'staff_101',
    documentType: 'contract',
    fileName: 'Hop_Dong_Lao_Dong_Tran_Nguyen_Hoang_Oanh.pdf',
    fileSize: '1.4 MB',
    mimeType: 'application/pdf',
    storagePath: 'staff/staff_101/documents/doc_1.pdf',
    uploadedAt: '2025-01-15T09:00:00.000Z',
    uploadedBy: 'admin@icancam.edu.vn',
  },
  {
    id: 'doc_2',
    staffId: 'staff_102',
    documentType: 'degree',
    fileName: 'Bang_Thac_Si_Ngon_Ngu_Anh_Nguyen_Le_Minh_Tri.pdf',
    fileSize: '2.1 MB',
    mimeType: 'application/pdf',
    storagePath: 'staff/staff_102/documents/doc_2.pdf',
    uploadedAt: '2025-06-01T09:00:00.000Z',
    uploadedBy: 'admin@icancam.edu.vn',
  },
];

export const INITIAL_HISTORY: EmploymentHistoryItem[] = [
  {
    id: 'hist_1',
    staffId: 'staff_102',
    departmentName: 'Khối Đào Tạo',
    jobTitle: 'Giáo Viên Tiếng Anh',
    campusSummary: 'Cơ sở Quận 12',
    startDate: '2025-06-01',
    endDate: '2026-01-01',
    changeReason: 'Thăng tiến chuyên môn',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'hist_2',
    staffId: 'staff_102',
    departmentName: 'Khối Đào Tạo',
    jobTitle: 'Trưởng Nhóm Chuyên Môn (Academic Lead)',
    campusSummary: 'Cơ sở Quận 12',
    startDate: '2026-01-01',
    changeReason: 'Bổ nhiệm chính thức',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
];

export const INITIAL_COMPENSATION: CompensationItem[] = [
  {
    id: 'comp_1',
    staffId: 'staff_101',
    baseSalary: 18000000,
    allowance: 3000000,
    effectiveDate: '2025-01-15',
    notes: 'Lương cứng + Phụ cấp trách nhiệm Quản lý HR',
    createdBy: 'superadmin@icancam.edu.vn',
    createdAt: '2025-01-15T09:00:00.000Z',
  },
  {
    id: 'comp_2',
    staffId: 'staff_102',
    baseSalary: 16000000,
    allowance: 2500000,
    effectiveDate: '2026-01-01',
    notes: 'Mức lương sau khi bổ nhiệm Trưởng nhóm Đào tạo',
    createdBy: 'superadmin@icancam.edu.vn',
    createdAt: '2026-01-01T09:00:00.000Z',
  },
];

// Helper: Profile Completeness Calculation
export const calculateCompleteness = (member: Partial<StaffMember>): number => {
  let score = 0;
  if (member.fullName) score += 20;
  if (member.workEmail && member.phone) score += 20;
  if (member.departmentId && member.jobTitle) score += 20;
  if (member.campusIds && member.campusIds.length > 0) score += 20;
  if (member.contractEndDate) score += 10;
  if (member.qualification) score += 10;
  return Math.min(score, 100);
};

// LOCAL STORAGE HELPERS
export const getAllStaff = (): StaffMember[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // Ignore error
  }
  return INITIAL_STAFF;
};

export const saveStaff = (list: StaffMember[]) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
};

export const getAllStaffDocuments = (): StaffDocument[] => {
  try {
    const raw = localStorage.getItem(DOCUMENTS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // Ignore
  }
  return INITIAL_DOCUMENTS;
};

export const saveStaffDocuments = (list: StaffDocument[]) => {
  localStorage.setItem(DOCUMENTS_STORAGE_KEY, JSON.stringify(list));
};

export const getAllEmploymentHistory = (): EmploymentHistoryItem[] => {
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // Ignore
  }
  return INITIAL_HISTORY;
};

export const saveEmploymentHistory = (list: EmploymentHistoryItem[]) => {
  localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(list));
};

export const getAllCompensation = (): CompensationItem[] => {
  try {
    const raw = localStorage.getItem(COMPENSATION_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // Ignore
  }
  return INITIAL_COMPENSATION;
};

export const saveCompensation = (list: CompensationItem[]) => {
  localStorage.setItem(COMPENSATION_STORAGE_KEY, JSON.stringify(list));
};

export const getAllAuditLogs = (): StaffAuditLog[] => {
  try {
    const raw = localStorage.getItem(AUDIT_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // Ignore
  }
  return [];
};

export const saveAuditLog = (log: Omit<StaffAuditLog, 'id' | 'timestamp'>) => {
  const logs = getAllAuditLogs();
  const newLog: StaffAuditLog = {
    ...log,
    id: `audit_${Date.now()}`,
    timestamp: new Date().toISOString(),
  };
  localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify([newLog, ...logs]));
};

// SUPABASE SYNC FUNCTIONS
export const fetchStaffFromSupabase = async (): Promise<StaffMember[]> => {
  try {
    const { data, error } = await supabase.from('staff_members').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      const staffFromDb: StaffMember[] = data.map((item) => ({
        id: item.id,
        employeeCode: item.employee_code,
        fullName: item.full_name,
        workEmail: item.work_email,
        phone: item.phone,
        avatarUrl: item.avatar_url,
        departmentId: item.department_id,
        departmentName: item.department_name || item.department_id,
        jobTitle: item.job_title,
        employmentType: (item.employment_type as EmploymentType) || 'Full-time',
        campusIds: item.campus_ids || ['campus_hm'],
        joinedDate: item.joined_date,
        probationEndDate: item.probation_end_date,
        contractEndDate: item.contract_end_date,
        status: (item.status as StaffStatus) || 'active',
        qualification: item.qualification,
        degrees: item.degrees || [],
        certifications: item.certifications || [],
        profileCompleteness: item.profile_completeness || 100,
        createdAt: item.created_at || new Date().toISOString(),
        updatedAt: item.updated_at || new Date().toISOString(),
      }));

      saveStaff(staffFromDb);
      return staffFromDb;
    }
  } catch (err) {
    console.warn('Supabase staff_members query notice:', err);
  }
  return getAllStaff();
};

const syncStaffToSupabase = async (member: StaffMember): Promise<{ success: boolean; error?: string }> => {
  try {
    const payload = {
      id: member.id,
      employee_code: member.employeeCode,
      full_name: member.fullName,
      work_email: member.workEmail,
      phone: member.phone,
      avatar_url: member.avatarUrl,
      department_id: member.departmentId,
      department_name: member.departmentName,
      job_title: member.jobTitle,
      employment_type: member.employmentType,
      campus_ids: member.campusIds,
      joined_date: member.joinedDate,
      probation_end_date: member.probationEndDate || null,
      contract_end_date: member.contractEndDate || null,
      status: member.status,
      qualification: member.qualification || null,
      degrees: member.degrees || [],
      certifications: member.certifications || [],
      profile_completeness: member.profileCompleteness,
      created_at: member.createdAt,
      updated_at: member.updatedAt,
    };

    const { error } = await supabase.from('staff_members').upsert(payload);
    if (error) {
      console.warn('Supabase staff upsert notice:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Network error' };
  }
};

export const createStaffMember = async (
  data: Omit<StaffMember, 'id' | 'employeeCode' | 'createdAt' | 'updatedAt' | 'profileCompleteness'>,
  actorEmail: string
): Promise<{ success: boolean; data?: StaffMember; error?: string }> => {
  const list = getAllStaff();
  const count = list.length + 1;
  const codeSeq = count < 10 ? `00${count}` : count < 100 ? `0${count}` : `${count}`;
  const employeeCode = `ICAM-HR-${codeSeq}`;

  const now = new Date().toISOString();
  const newStaff: StaffMember = {
    ...data,
    id: `staff_${Date.now()}`,
    employeeCode,
    profileCompleteness: calculateCompleteness(data),
    createdAt: now,
    updatedAt: now,
  };

  await syncStaffToSupabase(newStaff);

  const updatedList = [newStaff, ...list];
  saveStaff(updatedList);

  logStaffAuditAction({
    staffId: newStaff.id,
    actorEmail,
    action: 'CREATE_STAFF_PROFILE',
    newValue: JSON.stringify({ name: newStaff.fullName, code: newStaff.employeeCode }),
  });

  return { success: true, data: newStaff };
};

export const updateStaffMember = async (
  id: string,
  data: Partial<StaffMember>,
  actorEmail: string
): Promise<{ success: boolean; data?: StaffMember; error?: string }> => {
  const list = getAllStaff();
  const idx = list.findIndex((s) => s.id === id);
  if (idx === -1) return { success: false, error: 'Hồ sơ nhân sự không tồn tại' };

  const prev = list[idx];
  const updatedStaff: StaffMember = {
    ...prev,
    ...data,
    profileCompleteness: calculateCompleteness({ ...prev, ...data }),
    updatedAt: new Date().toISOString(),
  };

  await syncStaffToSupabase(updatedStaff);

  list[idx] = updatedStaff;
  saveStaff(list);

  logStaffAuditAction({
    staffId: id,
    actorEmail,
    action: 'UPDATE_STAFF_PROFILE',
    previousValue: JSON.stringify({ name: prev.fullName, title: prev.jobTitle, status: prev.status }),
    newValue: JSON.stringify({ name: updatedStaff.fullName, title: updatedStaff.jobTitle, status: updatedStaff.status }),
  });

  return { success: true, data: updatedStaff };
};

export const updateStaffStatus = async (
  id: string,
  newStatus: StaffStatus,
  actorEmail: string
): Promise<{ success: boolean; data?: StaffMember; error?: string }> => {
  return updateStaffMember(id, { status: newStatus }, actorEmail);
};

export const restoreStaffMember = async (
  id: string,
  targetStatus: 'active' | 'probation',
  actorEmail: string
): Promise<{ success: boolean; data?: StaffMember; error?: string }> => {
  return updateStaffMember(id, { status: targetStatus }, actorEmail);
};

export const deleteStaffMember = async (
  id: string,
  actorEmail: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { data, error } = await supabase.from('staff_members').delete().eq('id', id).select('id');
    if (!error && data && data.length > 0) {
      const list = getAllStaff();
      saveStaff(list.filter((s) => s.id !== id));
      logStaffAuditAction({
        staffId: id,
        actorEmail,
        action: 'PERMANENT_DELETE_STAFF',
      });
      return { success: true };
    }

    // Fallback to soft archive if RLS prohibits hard delete
    const softRes = await updateStaffStatus(id, 'archived', actorEmail);
    if (softRes.success) return { success: true };
    return { success: false, error: 'Không thể xóa hồ sơ khỏi máy chủ Supabase' };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Lỗi kết nối' };
  }
};

// PRIVATE DOCUMENT MANAGEMENT (SUPABASE SIGNED URLS)
export const uploadStaffDocument = async (
  staffId: string,
  docType: DocumentType,
  file: File,
  uploadedBy: string
): Promise<{ success: boolean; doc?: StaffDocument; error?: string }> => {
  try {
    const docId = `doc_${Date.now()}`;
    const storagePath = `staff/${staffId}/documents/${docId}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;

    // Attempt upload to private bucket
    const { error: uploadErr } = await supabase.storage.from('cms-private-hr').upload(storagePath, file, {
      cacheControl: '3600',
      upsert: true,
    });

    if (uploadErr) {
      console.warn('Private storage bucket notice, creating metadata:', uploadErr.message);
    }

    const sizeInMb = (file.size / (1024 * 1024)).toFixed(2);
    const newDoc: StaffDocument = {
      id: docId,
      staffId,
      documentType: docType,
      fileName: file.name,
      fileSize: `${sizeInMb} MB`,
      mimeType: file.type || 'application/pdf',
      storagePath,
      uploadedAt: new Date().toISOString(),
      uploadedBy,
    };

    const docs = getAllStaffDocuments();
    saveStaffDocuments([newDoc, ...docs]);

    logStaffAuditAction({
      staffId,
      actorEmail: uploadedBy,
      action: 'UPLOAD_PRIVATE_DOCUMENT',
      newValue: JSON.stringify({ fileName: file.name, docType }),
    });

    return { success: true, doc: newDoc };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Lỗi tải tệp' };
  }
};

export const generateDocumentSignedUrl = async (doc: StaffDocument): Promise<string> => {
  try {
    const { data, error } = await supabase.storage
      .from('cms-private-hr')
      .createSignedUrl(doc.storagePath, 120); // Expire in 120s

    if (!error && data?.signedUrl) {
      return data.signedUrl;
    }
  } catch {
    // Ignore error
  }
  // Sample fallback signed URL preview
  return doc.signedUrl || 'data:application/pdf;base64,JVBERi0xLjQKJSDi48nNCi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLQoxIDAgb2JqCjw8Ci9UeXBlIC9DYXRhbG9nCi9QYWdlcyAyIDAgUgo+PgplbmRvYmoKMiAwIG9iago8PAovVHlwZSAvUGFnZXMKL0tpZHMgWzMgMCBSXQovQ291bnQgMQo+PgplbmRvYmoKMyAwIG9iago8PAovVHlwZSAvUGFnZQovUGFyZW50IDIgMCBSCi9NZWRpYUJveCBbMCAwIDYxMiA3OTJdCi9SZXNvdXJjZXMgPDwKL0ZvbnQgPDwKL0YxIDQgMCBSCj4+Cj4+Ci9Db250ZW50cyA1IDAgUgo+PgplbmRvYmoKNCAwIG9iago8PAovVHlwZSAvRm9udAovU3VidHlwZSAvVHlwZTEKL0Jhc2VGb250IC9IZWx2ZXRpY2EKPj4KZW5kb2JqCjUgMCBvYmoKPDwKL0xlbmd0aCA3NAo+PgpzdHJlYW0KQlQKL0YxIDI0IFRmCjEwMCA3MDAgVGQKKENWIC0gaUNBTkNBTSBDYW5kaWRhdGUgQXBwbGljYXRpb24gUERGKSBUagpFVAplbmRzdHJlYW0KZW5kb2JqCnhyZWYKMCA2CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDMzNSAwMDAwMCBuIAowMDAwMDAwNDAxIDAwMDAwIG4gCnRyYWlsZXIKPDwKL1NpemUgNgovUm9vdCAxIDAgUgo+PgpzdGFydHhyZWYgNTI2CiUlRU9G';
};

export const deleteStaffDocument = async (id: string, actorEmail: string): Promise<boolean> => {
  const docs = getAllStaffDocuments();
  const doc = docs.find((d) => d.id === id);
  if (doc) {
    try {
      await supabase.storage.from('cms-private-hr').remove([doc.storagePath]);
    } catch {
      // Ignore
    }
    saveStaffDocuments(docs.filter((d) => d.id !== id));
    logStaffAuditAction({
      staffId: doc.staffId,
      actorEmail,
      action: 'DELETE_PRIVATE_DOCUMENT',
      previousValue: doc.fileName,
    });
  }
  return true;
};

// AUDIT LOGGING HELPER
export const logStaffAuditAction = (log: Omit<StaffAuditLog, 'id' | 'timestamp'>) => {
  saveAuditLog(log);
  try {
    supabase.from('staff_audit_logs').insert({
      staff_id: log.staffId,
      actor_email: log.actorEmail,
      action: log.action,
      previous_value: log.previousValue || null,
      new_value: log.newValue || null,
    });
  } catch {
    // Ignore
  }
};
