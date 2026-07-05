import teacherJames from '../assets/teacher_james.png';
import teacherDavid from '../assets/teacher_david.png';
import teacherSarah from '../assets/teacher_sarah.png';
import teacherOliver from '../assets/teacher_oliver.png';
import teacherEmma from '../assets/teacher_emma.png';
import teacherLucas from '../assets/teacher_lucas.png';

export interface TeacherHighlight {
  iconType: 'ielts' | 'degree' | 'medal';
  title: string;
  subText: string;
}

export interface Teacher {
  id: string;
  name: string;
  role: string;
  image: string;
  mainHighlight: string;
  highlights: TeacherHighlight[];
}

export const teachersData: Teacher[] = [
  {
    id: '1',
    name: 'James Harrison',
    role: 'Academic Manager tại iCAM',
    image: teacherJames,
    mainHighlight: '9.0 IELTS Overall',
    highlights: [
      { iconType: 'ielts', title: '9.0', subText: 'IELTS Overall' },
      { iconType: 'degree', title: 'MA in TESOL', subText: 'University of Oxford' },
      { iconType: 'medal', title: 'Senior Trainer', subText: '8+ năm kinh nghiệm' }
    ]
  },
  {
    id: '2',
    name: 'David Miller',
    role: 'Academic Director tại iCAM',
    image: teacherDavid,
    mainHighlight: '9.0 IELTS Overall',
    highlights: [
      { iconType: 'ielts', title: '9.0', subText: 'IELTS Overall' },
      { iconType: 'degree', title: 'Thạc sĩ Ngôn ngữ', subText: 'University of Cambridge' },
      { iconType: 'medal', title: 'Cựu giám khảo', subText: 'Giám khảo chấm thi IELTS' }
    ]
  },
  {
    id: '3',
    name: 'Sarah Jenkins',
    role: 'Head of IELTS tại iCAM',
    image: teacherSarah,
    mainHighlight: '8.5 IELTS Overall',
    highlights: [
      { iconType: 'ielts', title: '8.5', subText: 'IELTS Overall' },
      { iconType: 'degree', title: 'Cử nhân Danh dự', subText: 'RMIT University' },
      { iconType: 'medal', title: 'Sáng lập giáo trình', subText: 'Giáo trình IELTS độc quyền' }
    ]
  },
  {
    id: '4',
    name: 'Oliver Smith',
    role: 'Senior IELTS Trainer tại iCAM',
    image: teacherOliver,
    mainHighlight: '8.5 IELTS Overall',
    highlights: [
      { iconType: 'ielts', title: '8.5', subText: 'IELTS Overall' },
      { iconType: 'degree', title: 'Thạc sĩ Giáo dục', subText: 'University of London' },
      { iconType: 'medal', title: 'Tác giả sách', subText: 'Sách Luyện thi IELTS iCAM' }
    ]
  },
  {
    id: '5',
    name: 'Emma Cooper',
    role: 'IELTS Specialist tại iCAM',
    image: teacherEmma,
    mainHighlight: '8.0 IELTS Overall',
    highlights: [
      { iconType: 'ielts', title: '8.0', subText: 'IELTS Overall' },
      { iconType: 'degree', title: 'Cử nhân Ngôn ngữ', subText: 'University of Edinburgh' },
      { iconType: 'medal', title: 'Chứng chỉ CELTA', subText: 'Cambridge certified' }
    ]
  },
  {
    id: '6',
    name: 'Lucas Davies',
    role: 'IELTS Specialist tại iCAM',
    image: teacherLucas,
    mainHighlight: '8.5 IELTS Overall',
    highlights: [
      { iconType: 'ielts', title: '8.5', subText: 'IELTS Overall' },
      { iconType: 'degree', title: 'Thạc sĩ Ngôn ngữ', subText: 'University of Edinburgh' },
      { iconType: 'medal', title: 'Chứng chỉ CELTA', subText: 'Cambridge certified' }
    ]
  }
];
