import studentHuy from '../assets/student_huy.png';
import studentAn from '../assets/student_an.png';
import studentThu from '../assets/student_thu.png';
import studentVy from '../assets/student_vy.png';
import studentNam from '../assets/student_nam.png';

export interface StudentHighlight {
  iconType: 'ielts' | 'degree' | 'medal';
  title: string;
  titleEn?: string;
  subText: string;
  subTextEn?: string;
}

export interface Student {
  id: string;
  name: string;
  role: string;
  roleEn?: string;
  image: string;
  mainHighlight: string;
  mainHighlightEn?: string;
  highlights: StudentHighlight[];
}

export const studentsData: Student[] = [
  {
    id: '1',
    name: 'Đỗ Nhất Huy',
    role: 'Học viên tiêu biểu tại iCANCAM',
    roleEn: 'Outstanding Student at iCANCAM',
    image: studentHuy,
    mainHighlight: '15/15 Flyers Overall',
    mainHighlightEn: '15/15 Shields Flyers',
    highlights: [
      { iconType: 'ielts', title: '15/15 khiên', titleEn: '15/15 Shields', subText: 'Flyers Cambridge', subTextEn: 'Cambridge Flyers' },
      { iconType: 'degree', title: 'Điểm Tuyệt Đối', titleEn: 'Perfect Score', subText: 'Starters & Movers', subTextEn: 'Starters & Movers' },
      { iconType: 'medal', title: 'Giải Nhất', titleEn: '1st Prize', subText: 'Tiếng Anh cấp trường', subTextEn: 'School English Contest' }
    ]
  },
  {
    id: '2',
    name: 'Hoàng Thái An',
    role: 'Học viên tiêu biểu tại iCANCAM',
    roleEn: 'Outstanding Student at iCANCAM',
    image: studentAn,
    mainHighlight: '15/15 Flyers Overall',
    mainHighlightEn: '15/15 Shields Flyers',
    highlights: [
      { iconType: 'ielts', title: '15/15 khiên', titleEn: '15/15 Shields', subText: 'Flyers Cambridge', subTextEn: 'Cambridge Flyers' },
      { iconType: 'degree', title: 'Á Quân', titleEn: 'Runner-up', subText: 'English Contest iCANCAM', subTextEn: 'iCANCAM English Contest' },
      { iconType: 'medal', title: 'Huy Chương Đồng', titleEn: 'Bronze Medal', subText: 'Toán tiếng Anh SASMO', subTextEn: 'SASMO English Math' }
    ]
  },
  {
    id: '3',
    name: 'Nguyễn Thị Hoài Thu',
    role: 'Học viên tiêu biểu tại iCANCAM',
    roleEn: 'Outstanding Student at iCANCAM',
    image: studentThu,
    mainHighlight: '15/15 Flyers Overall',
    mainHighlightEn: '15/15 Shields Flyers',
    highlights: [
      { iconType: 'ielts', title: '15/15 khiên', titleEn: '15/15 Shields', subText: 'Flyers Cambridge', subTextEn: 'Cambridge Flyers' },
      { iconType: 'degree', title: '15/15 khiên', titleEn: '15/15 Shields', subText: 'Cambridge Movers', subTextEn: 'Cambridge Movers' },
      { iconType: 'medal', title: 'Thủ Khoa', titleEn: 'Top Achiever', subText: 'Học sinh giỏi cấp Quận', subTextEn: 'District Top Student' }
    ]
  },
  {
    id: '4',
    name: 'Lê Thảo Vy',
    role: 'Học viên tiêu biểu tại iCANCAM',
    roleEn: 'Outstanding Student at iCANCAM',
    image: studentVy,
    mainHighlight: '15/15 Flyers Overall',
    mainHighlightEn: '15/15 Shields Flyers',
    highlights: [
      { iconType: 'ielts', title: '15/15 khiên', titleEn: '15/15 Shields', subText: 'Flyers Cambridge', subTextEn: 'Cambridge Flyers' },
      { iconType: 'degree', title: 'Điểm Tuyệt Đối', titleEn: 'Perfect Score', subText: 'Starters & Movers', subTextEn: 'Starters & Movers' },
      { iconType: 'medal', title: 'Giải Ba', titleEn: '3rd Prize', subText: 'Kể chuyện Tiếng Anh', subTextEn: 'English Storytelling' }
    ]
  },
  {
    id: '5',
    name: 'Nguyễn Hoàng Nam',
    role: 'Học viên tiêu biểu tại iCANCAM',
    roleEn: 'Outstanding Student at iCANCAM',
    image: studentNam,
    mainHighlight: '15/15 Flyers Overall',
    mainHighlightEn: '15/15 Shields Flyers',
    highlights: [
      { iconType: 'ielts', title: '15/15 khiên', titleEn: '15/15 Shields', subText: 'Flyers Cambridge', subTextEn: 'Cambridge Flyers' },
      { iconType: 'degree', title: 'Thủ Khoa', titleEn: 'Valedictorian', subText: 'Kỳ thi Flyers iCANCAM', subTextEn: 'iCANCAM Flyers Exam' },
      { iconType: 'medal', title: 'Giải Nhì', titleEn: '2nd Prize', subText: 'Hùng biện Tiếng Anh', subTextEn: 'English Speech Contest' }
    ]
  }
];

