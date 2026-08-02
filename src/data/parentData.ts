import parent1 from '../assets/parent_1.png';
import parent2 from '../assets/parent_2.png';
import parent3 from '../assets/parent_3.png';
import parent4 from '../assets/parent_4.png';

export interface ParentTestimonial {
  id: number;
  childName: string;
  image: string;
  feedback: string;
  feedbackEn?: string;
  years: number;
}

export const parentsData: ParentTestimonial[] = [
  {
    id: 1,
    childName: "Bé Võ Huỳnh Thiên Ân",
    image: parent1,
    feedback: "iCANCAM đã tạo cho Ân và các bạn có một môi trường học tiếng Anh chuẩn quốc tế để con phát triển. Rất là hay!",
    feedbackEn: "iCANCAM has created an international-standard English environment for An and classmates to develop naturally. Fantastic experience!",
    years: 10
  },
  {
    id: 2,
    childName: "Bé Nguyễn Tất Minh Phương",
    image: parent2,
    feedback: "Gia đình rất yên tâm vì bé được tương tác nhiều với giáo viên và bạn bè qua các hoạt động vừa học vừa chơi.",
    feedbackEn: "Our family is completely reassured because our child interacts extensively with teachers and peers through playful learning activities.",
    years: 12
  },
  {
    id: 3,
    childName: "Bé Nguyễn Ngọc Khả My",
    image: parent3,
    feedback: "Khả năng tiếp xúc với tiếng Anh, phản xạ, cách phát âm thay đổi rất nhiều. Bé tự tin hơn khi sử dụng, nghe hiểu tiếng Anh nhiều hơn.",
    feedbackEn: "Language reflexes and pronunciation have improved tremendously. My child is much more confident listening and speaking English.",
    years: 10
  },
  {
    id: 4,
    childName: "Bé Lê Mạnh Cường",
    image: parent4,
    feedback: "Mình và gia đình cảm thấy rất vui vì bé đã trở nên yêu thích tiếng Anh hơn chỉ sau một thời gian ngắn học tại iCANCAM.",
    feedbackEn: "Our family is delighted that our child has grown to love English after just a short time studying at iCANCAM.",
    years: 12
  },
  {
    id: 5,
    childName: "Bé Võ Phương Yên",
    image: parent1,
    feedback: "Lớp học iCANCAM tổ chức nhiều trò chơi và các hoạt động học tập nên bé nhà mình nhớ được nhiều từ vựng hơn, kể cả những từ dài và khó.",
    feedbackEn: "iCANCAM classes organize engaging games so my child retains extensive vocabulary, even complex and long words.",
    years: 10
  },
  {
    id: 6,
    childName: "Bé Cao Văn Trí Đức",
    image: parent2,
    feedback: "Mỗi ngày đến với iCANCAM là một ngày vui của con. Lớp học iCANCAM có nhiều hoạt động tương tác lắm nên con năng động và tự tin hơn rất nhiều.",
    feedbackEn: "Every day at iCANCAM is a joyful day. Interactive class activities have made my child far more active and self-confident.",
    years: 12
  },
  {
    id: 7,
    childName: "Bé Võ Thành Tâm",
    image: parent3,
    feedback: "Học tiếng Anh tại iCANCAM cho con nhiều cơ hội để tiếp xúc với tiếng Anh hơn. Mình thấy con có sự tiến bộ rõ rệt và quan trọng là con rất thích đi học.",
    feedbackEn: "Studying at iCANCAM gives my child rich language exposure. Noticeable progress is evident, and most importantly, my child loves going to class.",
    years: 10
  }
];

