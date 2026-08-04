import newsArena from '../assets/news_arena.png';
import newsParenting from '../assets/news_parenting.png';
import newsLimit from '../assets/news_limit.png';

export interface Article {
  id: number | string;
  category: 'events' | 'scholarship' | 'tips';
  categoryLabel: string;
  categoryLabelEn?: string;
  date: string;
  title: string;
  titleEn?: string;
  url: string;
  excerpt: string;
  excerptEn?: string;
  content: string;
  contentEn?: string;
  image: string;
}

const placeholderImg = 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=600&auto=format&fit=crop';

export const articlesData: Article[] = [
  {
    id: 1,
    category: 'events',
    categoryLabel: 'SỰ KIỆN NỔI BẬT',
    categoryLabelEn: 'FEATURED EVENT',
    date: '20/06/2025',
    title: 'KHỞI ĐỘNG TRẠI HÈ STEMVERSE CAMP 2025 – KHƠI NGUỒN SÁNG TẠO, XÂY NỀN LÃNH ĐẠO TÀI NÃNG!',
    titleEn: 'LAUNCHING STEMVERSE CAMP 2025 SUMMER PROGRAM – IGNITING CREATIVITY & BUILDING YOUNG LEADERS!',
    url: '/news',
    excerpt: 'Trại hè STEM kỹ thuật công nghệ đầy hấp dẫn giúp khơi dậy niềm đam mê khám phá khoa học và nâng cao kỹ năng tư duy phản biện cho học sinh.',
    excerptEn: 'An exciting technology & STEM summer camp inspiring scientific discovery and critical thinking skills for students.',
    content: 'Trại hè STEMVERSE CAMP 2025 mở ra không gian trải nghiệm công nghệ đa chiều, nơi các em học sinh được trực tiếp chế tạo mô hình, ứng dụng tiếng Anh thực tiễn và rèn luyện kỹ năng làm việc nhóm. Chương trình được thiết kế kết hợp phương pháp 4Ls và LETI giúp học viên tự tin thể hiện bản thân.',
    contentEn: 'STEMVERSE CAMP 2025 opens a multi-dimensional technology experience where students build models, apply real-world English, and master teamwork. Built with 4Ls + LETI methodology to boost confidence.',
    image: placeholderImg,
  },
  {
    id: 2,
    category: 'events',
    categoryLabel: 'ĐẤU TRƯỜNG TRÍ TUỆ',
    categoryLabelEn: 'ACADEMIC ARENA',
    date: '15/05/2025',
    title: 'Global Arena - Đấu Trường Vinh Quang',
    titleEn: 'Global Arena - Arena of Glory 2025',
    url: '/news',
    excerpt: 'Global Arena - Đấu Trường Vinh Quang là sự kiện đặc biệt được tổ chức hằng năm, nơi học sinh thử thách bản thân và bứt phá giới hạn.',
    excerptEn: 'Global Arena is an annual flagship competition where students challenge themselves and push their academic boundaries.',
    content: 'Đấu trường Global Arena quy tụ hàng trăm thí sinh tài năng tranh tài ở các môn học bằng tiếng Anh. Thí sinh được trải nghiệm bộ câu hỏi tương tác trực tiếp trên nền tảng công nghệ 21st, giúp rèn luyện phản xạ nhanh và bản lĩnh thi đấu tự tin.',
    contentEn: 'Global Arena gathers hundreds of talented contestants competing in English subjects. Students interact with 21st touchscreen technology, training rapid reflexes and competitive confidence.',
    image: newsArena,
  },
  {
    id: 3,
    category: 'events',
    categoryLabel: 'SỰ KIỆN TRƯỜNG HỌC',
    categoryLabelEn: 'SCHOOL EVENT',
    date: '10/05/2025',
    title: '200 "NHÀ KHOA HỌC NHÍ" TỎA SÁNG TẠI CHUNG KẾT BIỆT ĐỘI KHOA HỌC',
    titleEn: '200 YOUNG SCIENTISTS SHINE AT SCIENCE SQUAD FINALS',
    url: '/news',
    excerpt: 'Gần 200 nhà khoa học nhí xuất sắc nhất đã quy tụ tranh tài trong không gian học thuật sáng tạo và tự tin trình bày dự án bằng tiếng Anh.',
    excerptEn: 'Nearly 200 outstanding young scientists gathered to compete in creative academic showcases and present projects in English.',
    content: 'Vòng chung kết Biệt Đội Khoa Học diễn ra vô cùng sôi nổi với các phần thi thuyết trình đề tài khoa học bằng 100% tiếng Anh. Học sinh thể hiện xuất sắc tư duy phản biện và khả năng ứng dụng tri thức vào giải quyết bài toán thực tế.',
    contentEn: 'The Science Squad Finals brought energetic 100% English presentations. Students demonstrated stellar critical thinking and applied knowledge to solve real-world challenges.',
    image: placeholderImg,
  },
  {
    id: 4,
    category: 'scholarship',
    categoryLabel: 'HỌC BỔNG',
    categoryLabelEn: 'SCHOLARSHIP',
    date: '28/04/2025',
    title: 'CÔNG BỐ DANH SÁCH HỌC SINH NHẬN HỌC BỔNG TOÁN VÀ KHOA HỌC',
    titleEn: 'ANNOUNCING MATH & SCIENCE TALENT SCHOLARSHIP RECIPIENTS',
    url: '/news',
    excerpt: 'Ban Tổ Chức rất vui mừng công bố danh sách các thí sinh xuất sắc nhất đã nhận được Học Bổng Tài Năng Toán & Khoa Học.',
    excerptEn: 'The organizing committee proudly announces the top outstanding students awarded Math & Science Talent Scholarships.',
    content: 'Trải qua các vòng thi đánh giá năng lực toàn diện, Ban Tổ Chức đã chọn lựa ra những học viên có thành tích xuất sắc nhất để trao tặng các suất học bổng giá trị. Học bổng hướng tới việc nuôi dưỡng niềm đam mê tự học và khai phóng tiềm năng của học sinh.',
    contentEn: 'Through comprehensive evaluation rounds, top achievers were selected for valuable scholarships. The program aims to nurture self-learning passion and unleash student potential.',
    image: placeholderImg,
  },
  {
    id: 5,
    category: 'events',
    categoryLabel: 'ĐẤU TRƯỜNG',
    categoryLabelEn: 'COMPETITION',
    date: '15/04/2025',
    title: 'ĐẤU TRƯỜNG TOÁN VÀ KHOA HỌC - MATH & SCIENCE ARENA',
    titleEn: 'MATH & SCIENCE ARENA - 21-DAY SELF-LEARNING CHALLENGE',
    url: '/news',
    excerpt: '21 ngày rèn luyện thói quen tự học độc lập giúp học sinh hình thành tư duy ngôn ngữ và phản xạ khoa học mỗi ngày.',
    excerptEn: '21 days of cultivating independent self-study habits, building daily language reflexes and scientific reasoning.',
    content: 'Sân chơi Math & Science Arena kích thích tinh thần tự học của học sinh qua các thử thách hàng ngày. Phương pháp rèn luyện 21 ngày liên tục giúp các em chủ động tiếp thu kiến thức và hình thành thói quen học tập bền vững.',
    contentEn: 'Math & Science Arena stimulates self-study mindsets through daily challenges. The 21-day continuous habit framework empowers proactive knowledge absorption.',
    image: placeholderImg,
  },
  {
    id: 6,
    category: 'tips',
    categoryLabel: 'CẨM NANG PHỤ HUYNH',
    categoryLabelEn: 'PARENTING GUIDE',
    date: '02/04/2025',
    title: 'Trào lưu mới của bố mẹ Việt khi cho con học tiếng Anh thời công nghệ số',
    titleEn: 'Modern Parenting Trends: Raising Children with English in the Digital Age',
    url: '/news',
    excerpt: 'Giai đoạn chuẩn bị bước vào lớp 1 sẽ là bước tiến quan trọng trong việc phát triển năng lực ngôn ngữ của con nhờ ứng dụng công nghệ số.',
    excerptEn: 'Preparing for 1st Grade is a crucial milestone for developing language proficiency powered by digital technology.',
    content: 'Nhiều phụ huynh hiện đại ưu tiên lựa chọn các môi trường giáo dục tích hợp công nghệ tương tác như Bảng thông minh Smartboard và học tập đa phương tiện. Việc kết hợp nghe nói phản xạ từ sớm giúp trẻ không sợ tiếng Anh và sẵn sàng cho các cấp học tiếp theo.',
    contentEn: 'Modern parents prioritize interactive tech environments such as Smartboards and multimedia learning. Early conversational reflexes build confidence for higher academic levels.',
    image: newsParenting,
  },
  {
    id: 7,
    category: 'tips',
    categoryLabel: 'CẨM NANG HỌC TẬP',
    categoryLabelEn: 'LEARNING GUIDE',
    date: '20/03/2025',
    title: 'Vượt qua giới hạn để khai thác toàn bộ tiềm năng trong quá trình học tập',
    titleEn: 'Overcoming Boundaries to Unlock Full Student Potential',
    url: '/news',
    excerpt: 'Làm thế nào để cha mẹ chọn lựa chương trình học tiếng Anh phù hợp giúp con tự học độc lập và phát triển tư duy phản biện.',
    excerptEn: 'How parents can choose the right English pathway to foster independent self-study and critical thinking.',
    content: 'Để trẻ tự tin làm chủ ngôn ngữ, điều quan trọng là xây dựng môi trường học không rập khuôn hay ép buộc ghi nhớ thụ động. Phương pháp tương tác LETI giúp trẻ chủ động thảo luận, ứng dụng bài học và liên tục nâng cao sự tự tin.',
    contentEn: 'To master a language confidently, avoiding passive memorization is key. Interactive LETI methods encourage student discussions, real-world application, and continuous confidence.',
    image: newsLimit,
  },
  {
    id: 8,
    category: 'tips',
    categoryLabel: 'CẨM NANG HỌC TẬP',
    categoryLabelEn: 'LEARNING GUIDE',
    date: '10/03/2025',
    title: 'Giải pháp học tiếng Anh hiệu quả trong thời đại số cho con',
    titleEn: 'Effective Digital-Age English Solutions for Your Child',
    url: '/news',
    excerpt: 'Khả năng tiếng Anh và kỹ năng công nghệ số là chiếc chìa khóa vàng giúp con mở cánh cửa hội nhập, tự tin khám phá thế giới.',
    excerptEn: 'English proficiency and digital skills are golden keys opening global integration and confident world exploration.',
    content: 'Trang bị tiếng Anh song hành cùng tư duy công nghệ số mang lại lợi thế lớn cho thế hệ trẻ. Sự kết hợp giữa mô hình 4Ls và công nghệ giáo dục hiện đại tạo tiền đề cho học sinh tự học bền vững.',
    contentEn: 'Combining English fluency with digital mindsets gives young learners a huge edge. 4Ls methodology merged with modern edtech builds sustainable self-study foundations.',
    image: placeholderImg,
  },
  {
    id: 9,
    category: 'tips',
    categoryLabel: 'CẨM NANG PHỤ HUYNH',
    categoryLabelEn: 'PARENTING GUIDE',
    date: '01/03/2025',
    title: 'Ứng dụng công nghệ trong giáo dục: Cánh cửa mở ra tương lai Công Dân Toàn Cầu',
    titleEn: 'Tech in Education: Doorway to a Global Citizen Future',
    url: '/news',
    excerpt: 'Tiếng Anh là công cụ quan trọng, việc tiếp cận từ sớm qua phương pháp trực quan giúp xây dựng tư duy toàn cầu cho trẻ.',
    excerptEn: 'English is an essential tool; early visual learning builds global mindsets for young learners.',
    content: 'Môi trường học 100% tiếng Anh cùng phần mềm giáo dục chuẩn Anh Quốc giúp trẻ tự nhiên tiếp thu ngôn ngữ như tiếng mẹ đeler, hình thành phong thái tự tin và tầm nhìn hội nhập.',
    contentEn: 'A 100% English environment with British curriculum software helps children acquire language as naturally as a mother tongue, instilling confidence and international vision.',
    image: placeholderImg,
  },
];
