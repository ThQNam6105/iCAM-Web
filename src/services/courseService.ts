import { supabase } from './supabaseClient';

export type CourseCategory = string;
export type CourseStatus = 'active' | 'paused' | 'draft';

export interface CourseCategoryItem {
  id: string;
  nameVi: string;
  nameEn?: string;
  descriptionVi?: string;
  descriptionEn?: string;
  badgeColor?: string;
}

export const INITIAL_COURSE_CATEGORIES: CourseCategoryItem[] = [
  { id: 'kids', nameVi: 'Tiếng Anh Mầm Non & Tiểu Học', nameEn: 'Kids & Primary', badgeColor: '#fb923c' },
  { id: 'teens', nameVi: 'Tiếng Anh THCS & THPT', nameEn: 'Teens Academic', badgeColor: '#60a5fa' },
  { id: 'ielts', nameVi: 'Luyện Thi IELTS Cam Kết', nameEn: 'IELTS Master', badgeColor: '#c084fc' },
  { id: 'comm', nameVi: 'Tiếng Anh Giao Tiếp Quốc Tế', nameEn: 'Business Communication', badgeColor: '#4ade80' },
  { id: 'online', nameVi: 'Chương Trình Online Đa Trải Nghiệm', nameEn: 'Online 21st', badgeColor: '#38bdf8' },
];

const COURSE_CATEGORIES_KEY = 'icancam_course_categories_v1';

export interface CourseItem {
  id: string;
  courseCode: string;
  category: CourseCategory;
  titleVi: string;
  titleEn: string;
  badgeVi: string;
  badgeEn: string;
  targetAgeVi: string;
  targetAgeEn: string;
  descriptionVi: string;
  descriptionEn: string;
  durationVi: string;
  durationEn: string;
  levelVi: string;
  levelEn: string;
  targetOutputVi: string;
  targetOutputEn: string;
  thumbnailUrl?: string;
  bannerUrl?: string;
  featuresVi: string[];
  featuresEn: string[];
  syllabusVi: string[];
  syllabusEn: string[];
  status: CourseStatus;
  createdAt: string;
  updatedAt: string;
}

const LOCAL_STORAGE_KEY = 'icancam_courses_v1';

export const INITIAL_COURSES: CourseItem[] = [
  {
    id: 'kids-starter',
    courseCode: 'ICAM-KIDS-01',
    category: 'kids',
    titleVi: 'CAM Kids Starter',
    titleEn: 'CAM Kids Starter',
    badgeVi: 'MẦM NON (4 - 6 TUỔI)',
    badgeEn: 'KINDERGARTEN (AGES 4 - 6)',
    targetAgeVi: '4 - 6 tuổi',
    targetAgeEn: 'Ages 4 - 6',
    descriptionVi: 'Khơi dậy niềm đam mê tiếng Anh tự nhiên qua phương pháp Phonics, bài hát, trò chơi tương tác và hoạt động vận động.',
    descriptionEn: 'Inspiring natural English passion through Phonics, songs, interactive games, and movement activities.',
    durationVi: '12 tháng / 3 khóa',
    durationEn: '12 months / 3 terms',
    levelVi: 'Pre-A1 Starters',
    levelEn: 'Pre-A1 Starters',
    targetOutputVi: 'Tự tin phát âm chuẩn 44 âm Phonics, giao tiếp 150+ từ vựng & câu đơn giản',
    targetOutputEn: 'Master 44 Phonics sounds, communicate 150+ words & simple sentences',
    featuresVi: [
      'Phương pháp Phonics chuẩn Mỹ',
      'Học qua bài hát, câu chuyện & kịch tương tác',
      '100% Giáo viên nước ngoài hỗ trợ phát âm',
      'Phòng học Smartboard tương tác trực quan'
    ],
    featuresEn: [
      'US Standard Phonics method',
      'Learn via songs, stories & role-play',
      '100% Native English teachers for pronunciation',
      'Interactive Smartboard classroom environment'
    ],
    syllabusVi: [
      'Module 1: Phonics & Alphabet Discovery (Âm tiết & Bảng chữ cái)',
      'Module 2: Family, Colors & Animals (Gia đình & Thế giới xung quanh)',
      'Module 3: Daily Habits & Expression (Thói quen & Cảm xúc hàng ngày)'
    ],
    syllabusEn: [
      'Module 1: Phonics & Alphabet Discovery',
      'Module 2: Family, Colors & Animals',
      'Module 3: Daily Habits & Expression'
    ],
    status: 'active',
    createdAt: '2026-01-15T08:00:00.000Z',
    updatedAt: '2026-08-16T10:00:00.000Z',
  },
  {
    id: 'kids-mover',
    courseCode: 'ICAM-KIDS-02',
    category: 'kids',
    titleVi: 'CAM Kids Primary (Starters - Movers)',
    titleEn: 'CAM Kids Primary (Starters - Movers)',
    badgeVi: 'TIỂU HỌC (6 - 11 TUỔI)',
    badgeEn: 'PRIMARY (AGES 6 - 11)',
    targetAgeVi: '6 - 11 tuổi',
    targetAgeEn: 'Ages 6 - 11',
    descriptionVi: 'Xây dựng nền tảng vững chắc 4 kỹ năng Nghe - Nói - Đọc - Viết, sẵn sàng chinh phục chứng chỉ Cambridge.',
    descriptionEn: 'Building solid 4-skill foundation, ready to conquer Cambridge exams.',
    durationVi: '12 tháng / 3 khóa',
    durationEn: '12 months / 3 terms',
    levelVi: 'A1 Movers - A2 Flyers',
    levelEn: 'A1 Movers - A2 Flyers',
    targetOutputVi: 'Đạt 12 - 15 khiên Cambridge Starters/Movers, tự tin giao tiếp phản xạ',
    targetOutputEn: 'Achieve 12 - 15 Cambridge Shields, confident speaking fluency',
    featuresVi: [
      'Lộ trình Cambridge Young Learners chuẩn quốc tế',
      'Kết hợp phương pháp 4Ls + LETI độc quyền',
      'Luyện thi khiên Cambridge hàng tháng',
      'Báo cáo tiến độ học tập rèn luyện định kỳ'
    ],
    featuresEn: [
      'International Cambridge Young Learners pathway',
      'Exclusive 4Ls + LETI methodology integration',
      'Monthly Cambridge mock exam practice',
      'Regular academic progress reporting'
    ],
    syllabusVi: [
      'Module 1: Grammar & Vocabulary Expansion (Từ vựng & Ngữ pháp nâng cao)',
      'Module 2: Cambridge Exam Skills (Kỹ năng làm bài thi Cambridge)',
      'Module 3: Presentation & Teamwork (Thuyết trình & Làm việc nhóm)'
    ],
    syllabusEn: [
      'Module 1: Grammar & Vocabulary Expansion',
      'Module 2: Cambridge Exam Skills',
      'Module 3: Presentation & Teamwork'
    ],
    status: 'active',
    createdAt: '2026-01-15T08:00:00.000Z',
    updatedAt: '2026-08-16T10:00:00.000Z',
  },
  {
    id: 'teens-flyers',
    courseCode: 'ICAM-TEENS-01',
    category: 'teens',
    titleVi: 'CAM Teens Academic (KET - PET)',
    titleEn: 'CAM Teens Academic (KET - PET)',
    badgeVi: 'THCS (11 - 15 TUỔI)',
    badgeEn: 'SECONDARY (AGES 11 - 15)',
    targetAgeVi: '11 - 15 tuổi',
    targetAgeEn: 'Ages 11 - 15',
    descriptionVi: 'Phát triển tư duy phản biện, kỹ năng thuyết trình và chuẩn bị nền tảng vững chắc cho IELTS.',
    descriptionEn: 'Developing critical thinking, presentation skills, and preparing solid IELTS foundation.',
    durationVi: '9 tháng / 2 khóa',
    durationEn: '9 months / 2 terms',
    levelVi: 'A2 KET - B1 PET',
    levelEn: 'A2 KET - B1 PET',
    targetOutputVi: 'Đạt chứng chỉ Cambridge KET/PET (B1), tạo đà bứt phá IELTS 5.5+',
    targetOutputEn: 'Pass Cambridge KET/PET (B1), creating momentum for IELTS 5.5+',
    featuresVi: [
      'Tích hợp chương trình chuyên Anh THCS',
      'Rèn luyện tư duy phản biện Critical Thinking',
      'Thi thử KET/PET trên máy tính hàng quý',
      'Cố vấn học tập cá nhân hóa 1-on-1'
    ],
    featuresEn: [
      'Integrated secondary school English curriculum',
      'Critical thinking training',
      'Quarterly Computer-based KET/PET mock test',
      'Personalized 1-on-1 academic mentorship'
    ],
    syllabusVi: [
      'Module 1: Academic Reading & Writing (Đọc hiểu & Viết luận học thuật)',
      'Module 2: Public Speaking & Debate (Thuyết trình & Tranh luận)',
      'Module 3: Cambridge KET/PET Intensive (Luyện đề KET/PET cấp tốc)'
    ],
    syllabusEn: [
      'Module 1: Academic Reading & Writing',
      'Module 2: Public Speaking & Debate',
      'Module 3: Cambridge KET/PET Intensive'
    ],
    status: 'active',
    createdAt: '2026-02-01T08:00:00.000Z',
    updatedAt: '2026-08-16T10:00:00.000Z',
  },
  {
    id: 'ielts-master',
    courseCode: 'ICAM-IELTS-65',
    category: 'ielts',
    titleVi: 'IELTS Intensive & Master (Target 6.5 - 7.5+)',
    titleEn: 'IELTS Intensive & Master (Target 6.5 - 7.5+)',
    badgeVi: 'IELTS BỨT PHÁ',
    badgeEn: 'IELTS INTENSIVE',
    targetAgeVi: '15+ tuổi',
    targetAgeEn: 'Ages 15+',
    descriptionVi: 'Chiến thuật làm bài chuyên sâu, chuyên trị dạng bài khó, bứt phá Band điểm Writing & Speaking.',
    descriptionEn: 'Advanced test-taking strategies, mastering tough question types, boosting Writing & Speaking scores.',
    durationVi: '4 tháng / 48 buổi',
    durationEn: '4 months / 48 sessions',
    levelVi: 'Target 6.5 - 7.5+',
    levelEn: 'Target 6.5 - 7.5+',
    targetOutputVi: 'Cam kết bằng hợp đồng đạt IELTS 6.5 - 7.5+',
    targetOutputEn: 'Contractual guarantee to reach IELTS 6.5 - 7.5+',
    featuresVi: [
      'Học cùng cựu Giám khảo IELTS & Chuyên gia 9.0 IELTS',
      'Chấm chữa bài Writing Task 1 & 2 trực tiếp 1-on-1',
      'Phòng thi máy chuẩn IDP/BC tại trung tâm',
      'Cam kết đầu ra hợp đồng pháp lý'
    ],
    featuresEn: [
      'Learn with Former IELTS Examiners & 9.0 IELTS Masters',
      'Direct 1-on-1 Writing Task 1 & 2 correction',
      'IDP/BC standard computer testing room',
      'Legal contract output commitment'
    ],
    syllabusVi: [
      'Module 1: Advanced Writing Task 2 & Cohesion (Viết luận chuyên sâu)',
      'Module 2: Fluency & Lexical Resource for Speaking Part 2 & 3 (Phản xạ Nói 7.5+)',
      'Module 3: Full Cambridge Mock Test Sprint (Giải đề cấp tốc & Tối ưu thời gian)'
    ],
    syllabusEn: [
      'Module 1: Advanced Writing Task 2 & Cohesion',
      'Module 2: Fluency & Lexical Resource for Speaking Part 2 & 3',
      'Module 3: Full Cambridge Mock Test Sprint'
    ],
    status: 'active',
    createdAt: '2026-03-01T08:00:00.000Z',
    updatedAt: '2026-08-16T10:00:00.000Z',
  },
  {
    id: 'comm-pro',
    courseCode: 'ICAM-COMM-01',
    category: 'comm',
    titleVi: 'Tiếng Anh Giao Tiếp Phản Xạ Quốc Tế',
    titleEn: 'International Fluent Speaking & Communication',
    badgeVi: 'NGƯỜI LỚN & ĐI LÀM',
    badgeEn: 'ADULTS & PROFESSIONALS',
    targetAgeVi: '18+ tuổi',
    targetAgeEn: 'Ages 18+',
    descriptionVi: 'Tập trung rèn luyện phản xạ giao tiếp tự nhiên, chỉnh sửa phát âm IPA và Tiếng Anh công sở thực chiến.',
    descriptionEn: 'Focusing on natural speaking reflex, IPA pronunciation correction, and practical business English.',
    durationVi: '3 tháng / 36 buổi',
    durationEn: '3 months / 36 sessions',
    levelVi: 'Mọi cấp độ (Pre-Inter -> Upper)',
    levelEn: 'All levels (Pre-Inter -> Upper)',
    targetOutputVi: 'Tự tin giao tiếp phản xạ trôi chảy trong môi trường làm việc quốc tế',
    targetOutputEn: 'Confident fluent communication in international work environments',
    featuresVi: [
      'Lịch học linh hoạt Sáng - Tối & Cuối tuần',
      '100% Thời lượng rèn luyện phản xạ Speaking với giáo viên',
      'Chủ đề giao tiếp thực tế công sở & du lịch',
      'Môi trường CLB Tiếng Anh giao lưu hàng tuần'
    ],
    featuresEn: [
      'Flexible Morning, Evening & Weekend schedules',
      '100% Speaking reflex practice with teachers',
      'Practical workplace & travel topics',
      'Weekly English Club networking environment'
    ],
    syllabusVi: [
      'Module 1: Pronunciation & IPA Mastery (Chuẩn hóa phát âm IPA)',
      'Module 2: Everyday Social Conversation (Giao tiếp xã hội hàng ngày)',
      'Module 3: Business Emailing & Meeting Skills (Tiếng Anh công sở & Họp hành)'
    ],
    syllabusEn: [
      'Module 1: Pronunciation & IPA Mastery',
      'Module 2: Everyday Social Conversation',
      'Module 3: Business Emailing & Meeting Skills'
    ],
    status: 'active',
    createdAt: '2026-03-15T08:00:00.000Z',
    updatedAt: '2026-08-16T10:00:00.000Z',
  },
];

// COURSES CRUD - SUPABASE AS SINGLE SOURCE OF TRUTH
export const getAllCourses = (): CourseItem[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
    return [];
  } catch {
    return [];
  }
};

export const saveCourses = (list: CourseItem[]) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
};

export const fetchCoursesFromSupabase = async (): Promise<CourseItem[]> => {
  try {
    const { data, error } = await supabase.from('courses').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      const coursesFromDb: CourseItem[] = data.map((item) => {
        const seed = INITIAL_COURSES.find((init) => init.id === item.id);
        return {
          id: item.id,
          courseCode: item.course_code || seed?.courseCode || `ICAM-CRS-${item.id}`,
          category: item.category as CourseCategory,
          titleVi: item.title_vi || item.title || seed?.titleVi || '',
          titleEn: item.title_en || seed?.titleEn || item.title_vi || '',
          badgeVi: item.badge_vi || seed?.badgeVi || '',
          badgeEn: item.badge_en || seed?.badgeEn || '',
          targetAgeVi: item.target_age_vi || item.target_age || seed?.targetAgeVi || '',
          targetAgeEn: item.target_age_en || seed?.targetAgeEn || '',
          descriptionVi: item.description_vi || item.description || seed?.descriptionVi || '',
          descriptionEn: item.description_en || seed?.descriptionEn || '',
          durationVi: item.duration_vi || item.duration || seed?.durationVi || '',
          durationEn: item.duration_en || seed?.durationEn || '',
          levelVi: item.level_vi || item.level || seed?.levelVi || '',
          levelEn: item.level_en || seed?.levelEn || '',
          targetOutputVi: item.target_output_vi || item.target_output || seed?.targetOutputVi || '',
          targetOutputEn: item.target_output_en || seed?.targetOutputEn || '',
          thumbnailUrl: item.thumbnail_url || seed?.thumbnailUrl,
          bannerUrl: item.banner_url || seed?.bannerUrl,
          featuresVi: Array.isArray(item.features_vi) ? item.features_vi : seed?.featuresVi || [],
          featuresEn: Array.isArray(item.features_en) ? item.features_en : seed?.featuresEn || [],
          syllabusVi: Array.isArray(item.syllabus_vi) ? item.syllabus_vi : seed?.syllabusVi || [],
          syllabusEn: Array.isArray(item.syllabus_en) ? item.syllabus_en : seed?.syllabusEn || [],
          status: (item.status as CourseStatus) || 'active',
          createdAt: item.created_at || new Date().toISOString(),
          updatedAt: item.updated_at || new Date().toISOString(),
        };
      });

      saveCourses(coursesFromDb);
      return coursesFromDb;
    }
  } catch (err) {
    console.warn('Supabase courses table offline:', err);
  }
  return getAllCourses();
};

export const syncCourseToSupabase = async (course: CourseItem): Promise<{ success: boolean; error?: string }> => {
  const fullPayload: Record<string, any> = {
    id: course.id,
    course_code: course.courseCode,
    category: course.category,
    title_vi: course.titleVi,
    title_en: course.titleEn,
    badge_vi: course.badgeVi,
    badge_en: course.badgeEn,
    target_age_vi: course.targetAgeVi,
    target_age_en: course.targetAgeEn,
    description_vi: course.descriptionVi,
    description_en: course.descriptionEn,
    duration_vi: course.durationVi,
    duration_en: course.durationEn,
    level_vi: course.levelVi,
    level_en: course.levelEn,
    target_output_vi: course.targetOutputVi,
    target_output_en: course.targetOutputEn,
    thumbnail_url: course.thumbnailUrl,
    banner_url: course.bannerUrl,
    features_vi: course.featuresVi,
    features_en: course.featuresEn,
    syllabus_vi: course.syllabusVi,
    syllabus_en: course.syllabusEn,
    status: course.status,
    created_at: course.createdAt,
    updated_at: course.updatedAt,
  };

  try {
    let { error } = await supabase.from('courses').upsert(fullPayload);
    if (error) {
      console.warn('Supabase courses upsert notice:', error.message);
    }
    return { success: true };
  } catch (err: any) {
    console.warn('Supabase course sync exception:', err);
    return { success: true };
  }
};

export const createCourse = async (
  data: Omit<CourseItem, 'id' | 'createdAt' | 'updatedAt'>
): Promise<{ success: boolean; data?: CourseItem; error?: string }> => {
  const list = getAllCourses();
  const now = new Date().toISOString();
  const created: CourseItem = {
    ...data,
    id: `course_${Date.now()}`,
    createdAt: now,
    updatedAt: now,
  };

  await syncCourseToSupabase(created);

  const updatedList = [created, ...list];
  saveCourses(updatedList);
  return { success: true, data: created };
};

export const updateCourse = async (
  id: string,
  data: Partial<CourseItem>
): Promise<{ success: boolean; data?: CourseItem; error?: string }> => {
  const list = getAllCourses();
  const idx = list.findIndex((c) => c.id === id);
  if (idx === -1) return { success: false, error: 'Khóa học không tồn tại' };

  const updated: CourseItem = {
    ...list[idx],
    ...data,
    updatedAt: new Date().toISOString(),
  };

  await syncCourseToSupabase(updated);

  list[idx] = updated;
  saveCourses(list);
  return { success: true, data: updated };
};

export const deleteCourse = async (id: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase.from('courses').delete().eq('id', id);
    if (error) {
      console.error('Supabase delete course error:', error.message);
      return { success: false, error: error.message };
    }

    const list = getAllCourses();
    const filtered = list.filter((c) => c.id !== id);
    saveCourses(filtered);

    return { success: true };
  } catch (err: any) {
    console.error('Supabase delete course exception:', err);
    return { success: false, error: err?.message || 'Network error' };
  }
};

// ==========================================
// COURSE CATEGORIES CRUD OPERATIONS
// ==========================================
export const getCourseCategories = (): CourseCategoryItem[] => {
  try {
    const raw = localStorage.getItem(COURSE_CATEGORIES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.error('Error reading course categories:', err);
  }
  localStorage.setItem(COURSE_CATEGORIES_KEY, JSON.stringify(INITIAL_COURSE_CATEGORIES));
  return INITIAL_COURSE_CATEGORIES;
};

export const saveCourseCategories = (cats: CourseCategoryItem[]) => {
  localStorage.setItem(COURSE_CATEGORIES_KEY, JSON.stringify(cats));
};

export const fetchCourseCategoriesFromSupabase = async (): Promise<CourseCategoryItem[]> => {
  try {
    const { data, error } = await supabase.from('course_categories').select('*');
    if (!error && data && data.length > 0) {
      const mapped: CourseCategoryItem[] = data.map((item: any) => ({
        id: item.id || item.slug,
        nameVi: item.name_vi || item.nameVi,
        nameEn: item.name_en || item.nameEn,
        descriptionVi: item.description_vi || item.descriptionVi,
        descriptionEn: item.description_en || item.descriptionEn,
        badgeColor: item.badge_color || item.badgeColor || '#F58220',
      }));
      saveCourseCategories(mapped);
      return mapped;
    }
  } catch (err) {
    console.warn('Supabase fetch course categories notice:', err);
  }
  return getCourseCategories();
};

const slugify = (text: string) => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const createCourseCategory = async (
  item: Omit<CourseCategoryItem, 'id'> & { id?: string }
): Promise<{ success: boolean; data?: CourseCategoryItem; error?: string }> => {
  const categories = getCourseCategories();
  let catId = item.id ? item.id.toLowerCase().trim() : slugify(item.nameVi);
  if (!catId) catId = `cat_${Date.now()}`;

  if (categories.some((c) => c.id === catId)) {
    catId = `${catId}_${Date.now()}`;
  }

  const newCat: CourseCategoryItem = {
    id: catId,
    nameVi: item.nameVi,
    nameEn: item.nameEn || item.nameVi,
    descriptionVi: item.descriptionVi || '',
    descriptionEn: item.descriptionEn || '',
    badgeColor: item.badgeColor || '#F58220',
  };

  const updated = [...categories, newCat];
  saveCourseCategories(updated);

  try {
    await supabase.from('course_categories').upsert({
      id: newCat.id,
      name_vi: newCat.nameVi,
      name_en: newCat.nameEn,
      description_vi: newCat.descriptionVi,
      description_en: newCat.descriptionEn,
      badge_color: newCat.badgeColor,
    });
  } catch (err) {
    console.warn('Supabase create course category notice:', err);
  }

  return { success: true, data: newCat };
};

export const updateCourseCategory = async (
  id: string,
  updates: Partial<CourseCategoryItem>
): Promise<{ success: boolean; data?: CourseCategoryItem; error?: string }> => {
  const categories = getCourseCategories();
  const index = categories.findIndex((c) => c.id === id);
  if (index === -1) return { success: false, error: 'Không tìm thấy loại chương trình!' };

  const updatedCat: CourseCategoryItem = {
    ...categories[index],
    ...updates,
  };

  categories[index] = updatedCat;
  saveCourseCategories(categories);

  try {
    await supabase.from('course_categories').upsert({
      id: updatedCat.id,
      name_vi: updatedCat.nameVi,
      name_en: updatedCat.nameEn,
      description_vi: updatedCat.descriptionVi,
      description_en: updatedCat.descriptionEn,
      badge_color: updatedCat.badgeColor,
    });
  } catch (err) {
    console.warn('Supabase update course category notice:', err);
  }

  return { success: true, data: updatedCat };
};

export const deleteCourseCategory = async (id: string): Promise<{ success: boolean; error?: string }> => {
  const courses = getAllCourses();
  const isUsed = courses.some((c) => c.category === id);
  if (isUsed) {
    return { success: false, error: 'Không thể xóa loại chương trình này vì đang có khóa học thuộc danh mục này!' };
  }

  const categories = getCourseCategories();
  const filtered = categories.filter((c) => c.id !== id);
  saveCourseCategories(filtered);

  try {
    await supabase.from('course_categories').delete().eq('id', id);
  } catch (err) {
    console.warn('Supabase delete course category notice:', err);
  }

  return { success: true };
};
