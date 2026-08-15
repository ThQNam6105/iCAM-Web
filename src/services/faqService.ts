import { supabase } from './supabaseClient';

export type FaqStatus = 'published' | 'draft' | 'archived';

export interface FaqCategoryItem {
  id: string;
  nameVi: string;
  nameEn: string;
  displayOrder: number;
  status: 'active' | 'hidden';
  createdAt?: string;
  updatedAt?: string;
}

export interface FaqItem {
  id: string;
  categoryId: string;
  categoryNameVi?: string;
  categoryNameEn?: string;
  questionVi: string;
  questionEn: string;
  answerVi: string;
  answerEn: string;
  status: FaqStatus;
  isPinned: boolean;
  displayOrder: number;
  helpfulCount: number;
  unhelpfulCount: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface FaqVoteRecord {
  faqId: string;
  voteType: 'helpful' | 'unhelpful';
  reason?: string;
  timestamp: number;
}

const FAQ_STORAGE_KEY = 'icancam_dynamic_faqs_v1';
const FAQ_CATEGORIES_STORAGE_KEY = 'icancam_dynamic_faq_categories_v1';
const FAQ_VOTES_STORAGE_KEY = 'icancam_faq_user_votes_v1';

export const INITIAL_FAQ_CATEGORIES: FaqCategoryItem[] = [
  { id: 'cat_method', nameVi: 'Phương Pháp & Lớp Học', nameEn: 'Method & Classrooms', displayOrder: 1, status: 'active' },
  { id: 'cat_curriculum', nameVi: 'Lộ Trình & Cam Kết', nameEn: 'Pathway & Guarantees', displayOrder: 2, status: 'active' },
  { id: 'cat_tuition', nameVi: 'Học Phí & Ưu Đãi', nameEn: 'Tuition & Discounts', displayOrder: 3, status: 'active' },
  { id: 'cat_location', nameVi: 'Cơ Sở & Lịch Học', nameEn: 'Campuses & Schedule', displayOrder: 4, status: 'active' },
  { id: 'cat_ielts', nameVi: 'Luyện Thi IELTS', nameEn: 'IELTS Preparation', displayOrder: 5, status: 'active' },
];

export const INITIAL_FAQS: FaqItem[] = [
  {
    id: 'faq_1',
    categoryId: 'cat_method',
    questionVi: 'Phương pháp 4Ls + LETI tại iCANCAM là gì?',
    questionEn: 'What is the 4Ls + LETI methodology at iCANCAM?',
    answerVi: '• 4Ls đại diện cho 4 kỹ năng cốt lõi: Listening (Nghe), Speaking (Nói), Reading (Đọc), Writing (Viết).\n• LETI (Learning English Through Interactions) là phương pháp giúp học viên học qua tương tác hai chiều, thảo luận nhóm, bài tập tình huống và trải nghiệm thực tế thay vì học thuộc lòng thụ động.',
    answerEn: '• 4Ls represents 4 core skills: Listening, Speaking, Reading, Writing.\n• LETI (Learning English Through Interactions) is a method enabling students to learn through two-way interactions, group discussions, scenario tasks, and practical experiences rather than passive memorization.',
    status: 'published',
    isPinned: true,
    displayOrder: 1,
    helpfulCount: 142,
    unhelpfulCount: 3,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    publishedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'faq_2',
    categoryId: 'cat_method',
    questionVi: 'Lớp học 21st tại iCANCAM có điểm gì khác biệt?',
    questionEn: 'What makes the 21st Smart Classroom at iCANCAM unique?',
    answerVi: '• 100% phòng học được trang bị Bảng tương tác thông minh (Smartboard), sử dụng giáo trình và phần mềm Anh Quốc kết hợp đa phương tiện multimedia.\n• Học viên được nhúng trong môi trường 100% tiếng Anh giúp kích hoạt phản xạ giao tiếp tự nhiên.',
    answerEn: '• 100% of classrooms are equipped with interactive touchscreens (Smartboards), using British curriculum software and multimedia.\n• Students are immersed in a 100% English environment triggering natural speech reflexes.',
    status: 'published',
    isPinned: false,
    displayOrder: 2,
    helpfulCount: 98,
    unhelpfulCount: 1,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    publishedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'faq_3',
    categoryId: 'cat_curriculum',
    questionVi: 'iCANCAM có cam kết đầu ra bằng văn bản không?',
    questionEn: 'Does iCANCAM provide written outcome guarantees?',
    answerVi: '• Có. Tất cả học viên đăng ký lộ trình học tại iCANCAM đều được ký hợp đồng cam kết đầu ra bằng văn bản pháp lý.\n• Nếu học viên tham gia đầy đủ lịch học và làm bài tập theo quy định nhưng chưa đạt target, trung tâm sẽ tài trợ 100% học phí học lại.',
    answerEn: '• Yes. All students enrolling in iCANCAM pathways receive a legal written output contract.\n• If a student attends required sessions and completes assignments but falls short of targets, the center sponsors 100% tuition for re-taking.',
    status: 'published',
    isPinned: true,
    displayOrder: 1,
    helpfulCount: 215,
    unhelpfulCount: 4,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    publishedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'faq_4',
    categoryId: 'cat_curriculum',
    questionVi: 'Trung tâm có các khóa học dành cho những độ tuổi nào?',
    questionEn: 'Which age groups do iCANCAM courses cater to?',
    answerVi: '• CAM Kids Starter (4-6 tuổi): Phát triển phản xạ mầm non.\n• CAM Juniors (7-11 tuổi): Nền tảng tiểu học & chứng chỉ Cambridge.\n• CAM Teens Master (12-15 tuổi): Anh văn THCS & tư duy 21st.\n• Lộ trình IELTS Bứt Tốc (4.5 – 7.5+): Luyện thi chiến thuật cao.\n• Tiếng Anh Giao Tiếp Thực Chiến cho sinh viên & người đi làm.',
    answerEn: '• CAM Kids Starter (ages 4-6): Early childhood reflex building.\n• CAM Juniors (ages 7-11): Primary school foundation & Cambridge exams.\n• CAM Teens Master (ages 12-15): Secondary English & 21st skills.\n• IELTS Acceleration (4.5–7.5+): Strategic test preparation.\n• Practical Communication for students and working professionals.',
    status: 'published',
    isPinned: false,
    displayOrder: 2,
    helpfulCount: 110,
    unhelpfulCount: 2,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    publishedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'faq_5',
    categoryId: 'cat_tuition',
    questionVi: 'Học phí tại iCANCAM có chính sách hỗ trợ trả góp không?',
    questionEn: 'Does iCANCAM offer tuition installment support?',
    answerVi: '• Trung tâm hỗ trợ các phương thức thanh toán linh hoạt, bao gồm trả góp 0% lãi suất qua thẻ tín dụng.\n• Hỗ trợ chia nhỏ học phí theo từng đợt đóng để tạo điều kiện thuận lợi nhất cho phụ huynh.',
    answerEn: '• We support flexible payment options including 0% interest credit card installments.\n• Split payment options are available to ensure convenience for parents.',
    status: 'published',
    isPinned: false,
    displayOrder: 1,
    helpfulCount: 86,
    unhelpfulCount: 1,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    publishedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'faq_6',
    categoryId: 'cat_location',
    questionVi: 'Địa điểm các cơ sở của iCANCAM ở đâu và lịch học thế nào?',
    questionEn: 'Where are iCANCAM campuses located and what is the schedule?',
    answerVi: '• Cơ sở Hóc Môn & Quận 12, TP. Hồ Chí Minh (344 A Tổ 13 KP 1, Trung Mỹ Tây, HCM).\n• Lịch học linh hoạt từ Thứ 2 đến Chủ nhật (Ca 1: 17h30 - 19h00 | Ca 2: 19h00 - 20h30).\n• Học viên có thể linh hoạt sắp xếp học bù miễn phí nếu bận đột xuất.',
    answerEn: '• Hoc Mon & District 12 Campuses, HCMC (344 A To 13 KP 1, Trung My Tay, HCMC).\n• Flexible schedule Monday through Sunday (Shift 1: 17:30-19:00 | Shift 2: 19:00-20:30).\n• Students can schedule free makeup sessions if absent.',
    status: 'published',
    isPinned: false,
    displayOrder: 1,
    helpfulCount: 94,
    unhelpfulCount: 0,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    publishedAt: '2026-01-01T00:00:00.000Z',
  },
];

// CATEGORY CRUD
export const getAllFaqCategories = (): FaqCategoryItem[] => {
  try {
    const raw = localStorage.getItem(FAQ_CATEGORIES_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
    localStorage.setItem(FAQ_CATEGORIES_STORAGE_KEY, JSON.stringify(INITIAL_FAQ_CATEGORIES));
    return INITIAL_FAQ_CATEGORIES;
  } catch {
    return INITIAL_FAQ_CATEGORIES;
  }
};

export const saveFaqCategories = (categories: FaqCategoryItem[]) => {
  localStorage.setItem(FAQ_CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
};

export const createFaqCategory = (data: Omit<FaqCategoryItem, 'id'>): FaqCategoryItem => {
  const list = getAllFaqCategories();
  const created: FaqCategoryItem = {
    ...data,
    id: `cat_${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const updated = [...list, created];
  saveFaqCategories(updated);
  return created;
};

export const updateFaqCategory = (id: string, data: Partial<FaqCategoryItem>): FaqCategoryItem | null => {
  const list = getAllFaqCategories();
  const idx = list.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  const updated = { ...list[idx], ...data, updatedAt: new Date().toISOString() };
  list[idx] = updated;
  saveFaqCategories(list);
  return updated;
};

export const deleteFaqCategory = (id: string): { success: boolean; message?: string } => {
  const faqs = getAllFaqs();
  const hasActiveFaqs = faqs.some((f) => f.categoryId === id && f.status !== 'archived');
  if (hasActiveFaqs) {
    return {
      success: false,
      message: 'Không thể xóa danh mục này vì đang chứa các câu hỏi FAQ đang hoạt động. Vui lòng di chuyển hoặc lưu trữ các câu hỏi trước!',
    };
  }
  const list = getAllFaqCategories();
  const filtered = list.filter((c) => c.id !== id);
  saveFaqCategories(filtered);
  return { success: true };
};

// FAQ ITEMS CRUD
export const getAllFaqs = (): FaqItem[] => {
  try {
    const raw = localStorage.getItem(FAQ_STORAGE_KEY);
    let list: FaqItem[] = [];
    if (raw) {
      list = JSON.parse(raw);
    } else {
      list = INITIAL_FAQS;
    }

    const categories = getAllFaqCategories();
    const updated = list.map((item) => {
      const cat = categories.find((c) => c.id === item.categoryId);
      const seed = INITIAL_FAQS.find((s) => s.id === item.id);
      return {
        ...item,
        categoryNameVi: cat?.nameVi || 'Khác',
        categoryNameEn: cat?.nameEn || 'Other',
        questionEn: item.questionEn || seed?.questionEn || item.questionVi,
        answerEn: item.answerEn || seed?.answerEn || item.answerVi,
      };
    });

    localStorage.setItem(FAQ_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return INITIAL_FAQS;
  }
};

export const saveFaqs = (faqs: FaqItem[]) => {
  localStorage.setItem(FAQ_STORAGE_KEY, JSON.stringify(faqs));
};

export const fetchFaqsFromSupabase = async (): Promise<FaqItem[]> => {
  const localList = getAllFaqs();
  try {
    const { data, error } = await supabase.from('faq_items').select('*').order('display_order', { ascending: true });
    if (!error && data && data.length > 0) {
      const categories = getAllFaqCategories();
      const faqsFromDb: FaqItem[] = data.map((item) => {
        const cat = categories.find((c) => c.id === item.category_id);
        const seed = INITIAL_FAQS.find((s) => s.id === item.id);
        return {
          id: item.id,
          categoryId: item.category_id,
          categoryNameVi: cat?.nameVi || 'Khác',
          categoryNameEn: cat?.nameEn || 'Other',
          questionVi: item.question_vi,
          questionEn: item.question_en || seed?.questionEn || item.question_vi,
          answerVi: item.answer_vi,
          answerEn: item.answer_en || seed?.answerEn || item.answer_vi,
          status: (item.status as FaqStatus) || 'published',
          isPinned: !!item.is_pinned,
          displayOrder: item.display_order || 1,
          helpfulCount: item.helpful_count || 0,
          unhelpfulCount: item.unhelpful_count || 0,
          createdAt: item.created_at || '2026-01-01T00:00:00.000Z',
          updatedAt: item.updated_at || '2026-01-01T00:00:00.000Z',
          publishedAt: item.published_at,
        };
      });

      // Single source of truth merge
      const mergedList = [...faqsFromDb];
      localList.forEach((localItem) => {
        const isCustomCreated = !INITIAL_FAQS.some((seed) => seed.id === localItem.id);
        const dbIdx = mergedList.findIndex((db) => db.id === localItem.id);

        if (dbIdx === -1 && isCustomCreated) {
          mergedList.unshift(localItem);
          syncFaqToSupabase(localItem);
        } else if (dbIdx !== -1 && isCustomCreated) {
          const dbTime = new Date(mergedList[dbIdx].updatedAt || 0).getTime();
          const localTime = new Date(localItem.updatedAt || 0).getTime();
          if (localTime > dbTime) {
            mergedList[dbIdx] = localItem;
            syncFaqToSupabase(localItem);
          }
        }
      });

      saveFaqs(mergedList);
      return mergedList;
    } else if (!error && data && data.length === 0) {
      // Seed initial data to Supabase once if DB is empty
      for (const faq of INITIAL_FAQS) {
        await syncFaqToSupabase(faq);
      }
      return INITIAL_FAQS;
    }
  } catch (err) {
    console.warn('Supabase faq_items table offline or not created yet:', err);
  }
  return getAllFaqs();
};

const syncFaqToSupabase = async (faq: FaqItem) => {
  try {
    await supabase.from('faq_items').upsert({
      id: faq.id,
      category_id: faq.categoryId,
      question_vi: faq.questionVi,
      question_en: faq.questionEn,
      answer_vi: faq.answerVi,
      answer_en: faq.answerEn,
      status: faq.status,
      is_pinned: faq.isPinned,
      display_order: faq.displayOrder,
      helpful_count: faq.helpfulCount,
      unhelpful_count: faq.unhelpfulCount,
      created_at: faq.createdAt,
      updated_at: faq.updatedAt,
      published_at: faq.publishedAt,
    });
  } catch (err) {
    console.warn('Supabase faq sync error:', err);
  }
};

export const createFaq = (data: Omit<FaqItem, 'id' | 'createdAt' | 'updatedAt' | 'helpfulCount' | 'unhelpfulCount'>): FaqItem => {
  const list = getAllFaqs();
  const now = new Date().toISOString();
  const created: FaqItem = {
    ...data,
    id: `faq_${Date.now()}`,
    helpfulCount: 0,
    unhelpfulCount: 0,
    createdAt: now,
    updatedAt: now,
    publishedAt: data.status === 'published' ? now : undefined,
  };
  const updated = [created, ...list];
  saveFaqs(updated);
  syncFaqToSupabase(created);
  return created;
};

export const updateFaq = (id: string, data: Partial<FaqItem>): FaqItem | null => {
  const list = getAllFaqs();
  const idx = list.findIndex((f) => f.id === id);
  if (idx === -1) return null;

  const now = new Date().toISOString();
  const updated: FaqItem = {
    ...list[idx],
    ...data,
    updatedAt: now,
    publishedAt: data.status === 'published' && !list[idx].publishedAt ? now : list[idx].publishedAt,
  };

  list[idx] = updated;
  saveFaqs(list);
  syncFaqToSupabase(updated);
  return updated;
};

export const archiveFaq = (id: string): FaqItem | null => {
  return updateFaq(id, { status: 'archived' });
};

export const deleteFaq = (id: string): boolean => {
  const list = getAllFaqs();
  const filtered = list.filter((f) => f.id !== id);
  saveFaqs(filtered);
  supabase.from('faq_items').delete().eq('id', id).then();
  return true;
};

// HELPFUL VOTING SYSTEM WITH DUPLICATE PROTECTION
export const getVotedFaqIds = (): Record<string, FaqVoteRecord> => {
  try {
    const raw = localStorage.getItem(FAQ_VOTES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

export const voteFaq = (
  faqId: string,
  voteType: 'helpful' | 'unhelpful',
  reason?: string
): { success: boolean; updatedFaq: FaqItem | null; message?: string } => {
  const votes = getVotedFaqIds();
  if (votes[faqId]) {
    return {
      success: false,
      updatedFaq: null,
      message: 'Bạn đã thực hiện đánh giá cho câu hỏi này trước đó!',
    };
  }

  const list = getAllFaqs();
  const idx = list.findIndex((f) => f.id === faqId);
  if (idx === -1) return { success: false, updatedFaq: null, message: 'Không tìm thấy câu hỏi!' };

  const target = list[idx];
  const updated: FaqItem = {
    ...target,
    helpfulCount: voteType === 'helpful' ? target.helpfulCount + 1 : target.helpfulCount,
    unhelpfulCount: voteType === 'unhelpful' ? target.unhelpfulCount + 1 : target.unhelpfulCount,
    updatedAt: new Date().toISOString(),
  };

  list[idx] = updated;
  saveFaqs(list);
  syncFaqToSupabase(updated);

  votes[faqId] = {
    faqId,
    voteType,
    reason,
    timestamp: Date.now(),
  };
  localStorage.setItem(FAQ_VOTES_STORAGE_KEY, JSON.stringify(votes));

  supabase.from('faq_votes').insert({
    faq_id: faqId,
    vote_type: voteType,
    feedback_reason: reason,
    created_at: new Date().toISOString(),
  }).then();

  return { success: true, updatedFaq: updated };
};
