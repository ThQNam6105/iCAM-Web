import { supabase } from './supabaseClient';

export type ContactType = 'phone' | 'zalo' | 'email';
export type UserQuestionStatus =
  | 'pending'
  | 'reviewing'
  | 'answered'
  | 'published'
  | 'private_answered'
  | 'rejected'
  | 'archived';

export interface UserQuestionItem {
  id: string;
  name: string;
  contactType: ContactType;
  contactValue: string;
  question: string;
  categoryId?: string;
  categoryName?: string;
  status: UserQuestionStatus;
  internalNotes?: string;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
}

export interface QuestionAnswerItem {
  id: string;
  questionId: string;
  answerText: string;
  isPublic: boolean;
  answeredBy: string;
  answeredAt: string;
}

const QUESTIONS_STORAGE_KEY = 'icancam_dynamic_user_questions_v1';
const LAST_SUBMISSION_TIME_KEY = 'icancam_last_question_submission_time';

export const INITIAL_USER_QUESTIONS: UserQuestionItem[] = [
  {
    id: 'q_101',
    name: 'Chị Nguyễn Thanh Hà',
    contactType: 'phone',
    contactValue: '0908 123 456',
    question: 'Bé nhà mình 5 tuổi chưa từng học tiếng Anh thì nên đăng ký lớp nào tại cơ sở Hóc Môn?',
    categoryId: 'cat_method',
    categoryName: 'Phương Pháp & Lớp Học',
    status: 'pending',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'q_102',
    name: 'Anh Trần Quốc Bảo',
    contactType: 'zalo',
    contactValue: '0912 345 678',
    question: 'Cho em hỏi lịch test đầu vào IELTS bứt tốc thứ 7 tuần này ở cơ sở Quận 12 có cần đặt hẹn trước không?',
    categoryId: 'cat_ielts',
    categoryName: 'Luyện Thi IELTS',
    status: 'pending',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'q_103',
    name: 'Lê Minh Anh',
    contactType: 'email',
    contactValue: 'minhanh.le@gmail.com',
    question: 'Nếu đóng học phí nguyên khóa 6 tháng thì trung tâm có chính sách ưu đãi giảm bao nhiêu % ạ?',
    categoryId: 'cat_tuition',
    categoryName: 'Học Phí & Ưu Đãi',
    status: 'private_answered',
    internalNotes: 'Đã gọi điện tư vấn chính sách đóng trọn gói giảm 15% + tặng balo iCANCAM.',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 18).toISOString(),
  },
];

export const getStatusBadgeLabel = (status: UserQuestionStatus, isEn: boolean = false): { label: string; color: string; bgColor: string } => {
  switch (status) {
    case 'pending':
      return {
        label: isEn ? 'Pending Review' : 'Chờ xử lý',
        color: '#f59e0b',
        bgColor: 'rgba(245, 158, 11, 0.15)',
      };
    case 'reviewing':
      return {
        label: isEn ? 'Reviewing' : 'Đang xử lý',
        color: '#3b82f6',
        bgColor: 'rgba(59, 130, 246, 0.15)',
      };
    case 'answered':
    case 'private_answered':
      return {
        label: isEn ? 'Answered Privately' : 'Đã trả lời riêng',
        color: '#10b981',
        bgColor: 'rgba(16, 185, 129, 0.15)',
      };
    case 'published':
      return {
        label: isEn ? 'Published as FAQ' : 'Đã đăng thành FAQ',
        color: '#8b5cf6',
        bgColor: 'rgba(139, 92, 246, 0.15)',
      };
    case 'rejected':
      return {
        label: isEn ? 'Rejected' : 'Từ chối',
        color: '#ef4444',
        bgColor: 'rgba(239, 68, 68, 0.15)',
      };
    case 'archived':
      return {
        label: isEn ? 'Archived' : 'Đã lưu trữ',
        color: '#6b7280',
        bgColor: 'rgba(107, 114, 128, 0.15)',
      };
    default:
      return {
        label: isEn ? 'Pending' : 'Chờ xử lý',
        color: '#f59e0b',
        bgColor: 'rgba(245, 158, 11, 0.15)',
      };
  }
};

export const getAllUserQuestions = (): UserQuestionItem[] => {
  try {
    const raw = localStorage.getItem(QUESTIONS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
    localStorage.setItem(QUESTIONS_STORAGE_KEY, JSON.stringify(INITIAL_USER_QUESTIONS));
    return INITIAL_USER_QUESTIONS;
  } catch {
    return INITIAL_USER_QUESTIONS;
  }
};

export const saveUserQuestions = (questions: UserQuestionItem[]) => {
  localStorage.setItem(QUESTIONS_STORAGE_KEY, JSON.stringify(questions));
};

export const fetchUserQuestionsFromSupabase = async (): Promise<UserQuestionItem[]> => {
  const localList = getAllUserQuestions();
  try {
    const { data, error } = await supabase.from('user_questions').select('*').order('created_at', { ascending: false });
    if (!error && data && data.length > 0) {
      const questionsFromDb: UserQuestionItem[] = data.map((item) => ({
        id: item.id,
        name: item.name,
        contactType: (item.contact_type as ContactType) || 'phone',
        contactValue: item.contact_value,
        question: item.question,
        categoryId: item.category_id,
        categoryName: item.category_name,
        status: (item.status as UserQuestionStatus) || 'pending',
        internalNotes: item.internal_notes,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        assignedTo: item.assigned_to,
      }));

      // Preserve local edits if local timestamp is newer
      const mergedList = [...questionsFromDb];
      localList.forEach((localItem) => {
        const dbIdx = mergedList.findIndex((db) => db.id === localItem.id);
        if (dbIdx !== -1) {
          const dbTime = new Date(mergedList[dbIdx].updatedAt || 0).getTime();
          const localTime = new Date(localItem.updatedAt || 0).getTime();
          if (localTime > dbTime) {
            mergedList[dbIdx] = localItem;
            syncUserQuestionToSupabase(localItem);
          }
        } else {
          mergedList.unshift(localItem);
          syncUserQuestionToSupabase(localItem);
        }
      });

      saveUserQuestions(mergedList);
      return mergedList;
    }
  } catch (err) {
    console.warn('Supabase user_questions table offline or not created yet:', err);
  }
  return getAllUserQuestions();
};

const syncUserQuestionToSupabase = async (q: UserQuestionItem) => {
  try {
    await supabase.from('user_questions').upsert({
      id: q.id,
      name: q.name,
      contact_type: q.contactType,
      contact_value: q.contactValue,
      question: q.question,
      category_id: q.categoryId,
      category_name: q.categoryName,
      status: q.status,
      internal_notes: q.internalNotes,
      created_at: q.createdAt,
      updated_at: q.updatedAt,
      assigned_to: q.assignedTo,
    });
  } catch (err) {
    console.warn('Supabase user_questions sync error:', err);
  }
};

// PUBLIC QUESTION SUBMISSION WITH HONEYPOT & RATE LIMITING
export const submitUserQuestion = (input: {
  name: string;
  contactType: ContactType;
  contactValue: string;
  question: string;
  categoryId?: string;
  categoryName?: string;
  honeypot?: string; // Bot protection
}): { success: boolean; message: string; data?: UserQuestionItem } => {
  // Honeypot check (hidden field filled by bots)
  if (input.honeypot && input.honeypot.trim().length > 0) {
    return {
      success: false,
      message: 'Hệ thống phát hiện gửi không hợp lệ!',
    };
  }

  // Rate limiting throttling check (minimum 30s between submissions)
  const lastTime = localStorage.getItem(LAST_SUBMISSION_TIME_KEY);
  const now = Date.now();
  if (lastTime && now - parseInt(lastTime, 10) < 30000) {
    return {
      success: false,
      message: 'Bạn đang gửi câu hỏi quá nhanh. Vui lòng đợi 30 giây trước khi gửi thêm câu hỏi mới!',
    };
  }

  // Validation
  if (!input.name.trim() || input.name.trim().length < 2) {
    return { success: false, message: 'Vui lòng nhập họ và tên hợp lệ!' };
  }
  if (!input.contactValue.trim() || input.contactValue.trim().length < 5) {
    return { success: false, message: 'Vui lòng nhập thông tin liên hệ (Số điện thoại / Zalo / Email) hợp lệ!' };
  }
  if (!input.question.trim() || input.question.trim().length < 10) {
    return { success: false, message: 'Nội dung câu hỏi quá ngắn. Vui lòng nhập tối thiểu 10 ký tự!' };
  }

  const list = getAllUserQuestions();
  const created: UserQuestionItem = {
    id: `q_${Date.now()}`,
    name: input.name.trim(),
    contactType: input.contactType,
    contactValue: input.contactValue.trim(),
    question: input.question.trim(),
    categoryId: input.categoryId,
    categoryName: input.categoryName,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const updated = [created, ...list];
  saveUserQuestions(updated);
  syncUserQuestionToSupabase(created);

  localStorage.setItem(LAST_SUBMISSION_TIME_KEY, now.toString());

  return {
    success: true,
    message: 'Gửi câu hỏi thành công! Ban tư vấn iCANCAM sẽ liên hệ giải đáp riêng cho bạn sớm nhất.',
    data: created,
  };
};

export const updateUserQuestionStatus = (
  id: string,
  status: UserQuestionStatus,
  internalNotes?: string
): UserQuestionItem | null => {
  const list = getAllUserQuestions();
  const idx = list.findIndex((q) => q.id === id);
  if (idx === -1) return null;

  const updated: UserQuestionItem = {
    ...list[idx],
    status,
    internalNotes: internalNotes !== undefined ? internalNotes : list[idx].internalNotes,
    updatedAt: new Date().toISOString(),
  };

  list[idx] = updated;
  saveUserQuestions(list);
  syncUserQuestionToSupabase(updated);
  return updated;
};

export const deleteUserQuestion = (id: string): boolean => {
  const list = getAllUserQuestions();
  const filtered = list.filter((q) => q.id !== id);
  saveUserQuestions(filtered);
  supabase.from('user_questions').delete().eq('id', id).then();
  return true;
};
