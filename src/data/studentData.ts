import studentHuy from '../assets/student_huy.png';
import studentAn from '../assets/student_an.png';
import studentThu from '../assets/student_thu.png';
import studentVy from '../assets/student_vy.png';
import studentNam from '../assets/student_nam.png';

export interface StudentHighlight {
  iconType: 'ielts' | 'degree' | 'medal';
  title: string;
  subText: string;
}

export interface Student {
  id: string;
  name: string;
  role: string;
  image: string;
  mainHighlight: string;
  highlights: StudentHighlight[];
}

export const studentsData: Student[] = [
  {
    id: '1',
    name: 'Đỗ Nhất Huy',
    role: 'Học viên tiêu biểu tại iCAM',
    image: studentHuy,
    mainHighlight: '15/15 Flyers Overall',
    highlights: [
      { iconType: 'ielts', title: '15/15 khiên', subText: 'Flyers Cambridge' },
      { iconType: 'degree', title: 'Điểm Tuyệt Đối', subText: 'Starters & Movers' },
      { iconType: 'medal', title: 'Giải Nhất', subText: 'Tiếng Anh cấp trường' }
    ]
  },
  {
    id: '2',
    name: 'Hoàng Thái An',
    role: 'Học viên tiêu biểu tại iCAM',
    image: studentAn,
    mainHighlight: '15/15 Flyers Overall',
    highlights: [
      { iconType: 'ielts', title: '15/15 khiên', subText: 'Flyers Cambridge' },
      { iconType: 'degree', title: 'Á Quân', subText: 'English Contest iCAM' },
      { iconType: 'medal', title: 'Huy Chương Đồng', subText: 'Toán tiếng Anh SASMO' }
    ]
  },
  {
    id: '3',
    name: 'Nguyễn Thị Hoài Thu',
    role: 'Học viên tiêu biểu tại iCAM',
    image: studentThu,
    mainHighlight: '15/15 Flyers Overall',
    highlights: [
      { iconType: 'ielts', title: '15/15 khiên', subText: 'Flyers Cambridge' },
      { iconType: 'degree', title: '15/15 khiên', subText: 'Cambridge Movers' },
      { iconType: 'medal', title: 'Thủ Khoa', subText: 'Học sinh giỏi cấp Quận' }
    ]
  },
  {
    id: '4',
    name: 'Lê Thảo Vy',
    role: 'Học viên tiêu biểu tại iCAM',
    image: studentVy,
    mainHighlight: '15/15 Flyers Overall',
    highlights: [
      { iconType: 'ielts', title: '15/15 khiên', subText: 'Flyers Cambridge' },
      { iconType: 'degree', title: 'Điểm Tuyệt Đối', subText: 'Starters & Movers' },
      { iconType: 'medal', title: 'Giải Ba', subText: 'Kể chuyện Tiếng Anh' }
    ]
  },
  {
    id: '5',
    name: 'Nguyễn Hoàng Nam',
    role: 'Học viên tiêu biểu tại iCAM',
    image: studentNam,
    mainHighlight: '15/15 Flyers Overall',
    highlights: [
      { iconType: 'ielts', title: '15/15 khiên', subText: 'Flyers Cambridge' },
      { iconType: 'degree', title: 'Thủ Khoa', subText: 'Kỳ thi Flyers iCAM' },
      { iconType: 'medal', title: 'Giải Nhì', subText: 'Hùng biện Tiếng Anh' }
    ]
  }
];
