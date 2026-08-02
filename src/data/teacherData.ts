import teacherJames from '../assets/teacher_james.png';
import teacherDavid from '../assets/teacher_david.png';
import teacherSarah from '../assets/teacher_sarah.png';
import teacherOliver from '../assets/teacher_oliver.png';
import teacherEmma from '../assets/teacher_emma.png';
import teacherLucas from '../assets/teacher_lucas.png';

export interface TeacherHighlight {
  iconType: 'ielts' | 'degree' | 'medal';
  title: string;
  titleEn?: string;
  subText: string;
  subTextEn?: string;
}

export interface Teacher {
  id: string;
  name: string;
  role: string;
  roleEn?: string;
  image: string;
  mainHighlight: string;
  highlights: TeacherHighlight[];
}

export const teachersData: Teacher[] = [
  {
    id: '1',
    name: 'James Harrison',
    role: 'Academic Manager tại iCANCAM',
    roleEn: 'Academic Manager at iCANCAM',
    image: teacherJames,
    mainHighlight: '9.0 IELTS Overall',
    highlights: [
      { iconType: 'ielts', title: '9.0', subText: 'IELTS Overall', subTextEn: 'IELTS Overall' },
      { iconType: 'degree', title: 'MA in TESOL', subText: 'University of Oxford', subTextEn: 'University of Oxford' },
      { iconType: 'medal', title: 'Senior Trainer', titleEn: 'Senior Trainer', subText: '8+ năm kinh nghiệm', subTextEn: '8+ years experience' }
    ]
  },
  {
    id: '2',
    name: 'David Miller',
    role: 'Academic Director tại iCANCAM',
    roleEn: 'Academic Director at iCANCAM',
    image: teacherDavid,
    mainHighlight: '9.0 IELTS Overall',
    highlights: [
      { iconType: 'ielts', title: '9.0', subText: 'IELTS Overall', subTextEn: 'IELTS Overall' },
      { iconType: 'degree', title: 'Thạc sĩ Ngôn ngữ', titleEn: 'Master of Linguistics', subText: 'University of Cambridge', subTextEn: 'University of Cambridge' },
      { iconType: 'medal', title: 'Cựu giám khảo', titleEn: 'Former Examiner', subText: 'Giám khảo chấm thi IELTS', subTextEn: 'Certified IELTS Examiner' }
    ]
  },
  {
    id: '3',
    name: 'Sarah Jenkins',
    role: 'Head of IELTS tại iCANCAM',
    roleEn: 'Head of IELTS at iCANCAM',
    image: teacherSarah,
    mainHighlight: '8.5 IELTS Overall',
    highlights: [
      { iconType: 'ielts', title: '8.5', subText: 'IELTS Overall', subTextEn: 'IELTS Overall' },
      { iconType: 'degree', title: 'Cử nhân Danh dự', titleEn: 'Bachelor with Honors', subText: 'RMIT University', subTextEn: 'RMIT University' },
      { iconType: 'medal', title: 'Sáng lập giáo trình', titleEn: 'Curriculum Creator', subText: 'Giáo trình IELTS độc quyền', subTextEn: 'Exclusive IELTS Syllabus' }
    ]
  },
  {
    id: '4',
    name: 'Oliver Smith',
    role: 'Senior IELTS Trainer tại iCANCAM',
    roleEn: 'Senior IELTS Trainer at iCANCAM',
    image: teacherOliver,
    mainHighlight: '8.5 IELTS Overall',
    highlights: [
      { iconType: 'ielts', title: '8.5', subText: 'IELTS Overall', subTextEn: 'IELTS Overall' },
      { iconType: 'degree', title: 'Thạc sĩ Giáo dục', titleEn: 'Master of Education', subText: 'University of London', subTextEn: 'University of London' },
      { iconType: 'medal', title: 'Tác giả sách', titleEn: 'Book Author', subText: 'Sách Luyện thi IELTS iCANCAM', subTextEn: 'iCANCAM IELTS Prep Book' }
    ]
  },
  {
    id: '5',
    name: 'Emma Cooper',
    role: 'IELTS Specialist tại iCANCAM',
    roleEn: 'IELTS Specialist at iCANCAM',
    image: teacherEmma,
    mainHighlight: '8.0 IELTS Overall',
    highlights: [
      { iconType: 'ielts', title: '8.0', subText: 'IELTS Overall', subTextEn: 'IELTS Overall' },
      { iconType: 'degree', title: 'Cử nhân Ngôn ngữ', titleEn: 'Bachelor of Linguistics', subText: 'University of Edinburgh', subTextEn: 'University of Edinburgh' },
      { iconType: 'medal', title: 'Chứng chỉ CELTA', titleEn: 'CELTA Certificate', subText: 'Cambridge certified', subTextEn: 'Cambridge certified' }
    ]
  },
  {
    id: '6',
    name: 'Lucas Davies',
    role: 'IELTS Specialist tại iCANCAM',
    roleEn: 'IELTS Specialist at iCANCAM',
    image: teacherLucas,
    mainHighlight: '8.5 IELTS Overall',
    highlights: [
      { iconType: 'ielts', title: '8.5', subText: 'IELTS Overall', subTextEn: 'IELTS Overall' },
      { iconType: 'degree', title: 'Thạc sĩ Ngôn ngữ', titleEn: 'Master of Linguistics', subText: 'University of Edinburgh', subTextEn: 'University of Edinburgh' },
      { iconType: 'medal', title: 'Chứng chỉ CELTA', titleEn: 'CELTA Certificate', subText: 'Cambridge certified', subTextEn: 'Cambridge certified' }
    ]
  }
];

