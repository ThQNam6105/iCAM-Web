import newsArena from '../assets/news_arena.png';
import newsParenting from '../assets/news_parenting.png';
import newsLimit from '../assets/news_limit.png';

export interface Article {
  id: number;
  category: 'events' | 'scholarship' | 'tips';
  categoryLabel: string;
  date: string;
  title: string;
  url: string;
  excerpt: string;
  content: string;
  image: string;
}

const placeholderImg = 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=600&auto=format&fit=crop';

export const articlesData: Article[] = [
  {
    id: 1,
    category: 'events',
    categoryLabel: 'SỰ KIỆN NỔI BẬT',
    date: '20/06/2025',
    title: 'KHỞI ĐỘNG TRẠI HÈ STEMVERSE CAMP 2025 – KHƠI NGUỒN SÁNG TẠO, XÂY NỀN LÃNH ĐẠO TÀI NÃNG!',
    url: '/news',
    excerpt: 'Trại hè STEM kỹ thuật công nghệ đầy hấp dẫn giúp khơi dậy niềm đam mê khám phá khoa học và nâng cao kỹ năng tư duy phản biện cho học sinh.',
    content: 'Trại hè STEMVERSE CAMP 2025 mở ra không gian trải nghiệm công nghệ đa chiều, nơi các em học sinh được trực tiếp chế tạo mô hình, ứng dụng tiếng Anh thực tiễn và rèn luyện kỹ năng làm việc nhóm. Chương trình được thiết kế kết hợp phương pháp 4Ls và LETI giúp học viên tự tin thể hiện bản thân.',
    image: placeholderImg,
  },
  {
    id: 2,
    category: 'events',
    categoryLabel: 'ĐẤU TRƯỜNG TRÍ TUỆ',
    date: '15/05/2025',
    title: 'Global Arena - Đấu Trường Vinh Quang',
    url: '/news',
    excerpt: 'Global Arena - Đấu Trường Vinh Quang là sự kiện đặc biệt được tổ chức hằng năm, nơi học sinh thử thách bản thân và bứt phá giới hạn.',
    content: 'Đấu trường Global Arena quy tụ hàng trăm thí sinh tài năng tranh tài ở các môn học bằng tiếng Anh. Thí sinh được trải nghiệm bộ câu hỏi tương tác trực tiếp trên nền tảng công nghệ 21st, giúp rèn luyện phản xạ nhanh và bản lĩnh thi đấu tự tin.',
    image: newsArena,
  },
  {
    id: 3,
    category: 'events',
    categoryLabel: 'SỰ KIỆN TRƯỜNG HỌC',
    date: '10/05/2025',
    title: '200 "NHÀ KHOA HỌC NHÍ" TỎA SÁNG TẠI CHUNG KẾT BIỆT ĐỘI KHOA HỌC',
    url: '/news',
    excerpt: 'Gần 200 nhà khoa học nhí xuất sắc nhất đã quy tụ tranh tài trong không gian học thuật sáng tạo và tự tin trình bày dự án bằng tiếng Anh.',
    content: 'Vòng chung kết Biệt Đội Khoa Học diễn ra vô cùng sôi nổi với các phần thi thuyết trình đề tài khoa học bằng 100% tiếng Anh. Học sinh thể hiện xuất sắc tư duy phản biện và khả năng ứng dụng tri thức vào giải quyết bài toán thực tế.',
    image: placeholderImg,
  },
  {
    id: 4,
    category: 'scholarship',
    categoryLabel: 'HỌC BỔNG',
    date: '28/04/2025',
    title: 'CÔNG BỐ DANH SÁCH HỌC SINH NHẬN HỌC BỔNG TOÁN VÀ KHOA HỌC',
    url: '/news',
    excerpt: 'Ban Tổ Chức rất vui mừng công bố danh sách các thí sinh xuất sắc nhất đã nhận được Học Bổng Tài Năng Toán & Khoa Học.',
    content: 'Trải qua các vòng thi đánh giá năng lực toàn diện, Ban Tổ Chức đã chọn lựa ra những học viên có thành tích xuất sắc nhất để trao tặng các suất học bổng giá trị. Học bổng hướng tới việc nuôi dưỡng niềm đam mê tự học và khai phóng tiềm năng của học sinh.',
    image: placeholderImg,
  },
  {
    id: 5,
    category: 'events',
    categoryLabel: 'ĐẤU TRƯỜNG',
    date: '15/04/2025',
    title: 'ĐẤU TRƯỜNG TOÁN VÀ KHOA HỌC - MATH & SCIENCE ARENA',
    url: '/news',
    excerpt: '21 ngày rèn luyện thói quen tự học độc lập giúp học sinh hình thành tư duy ngôn ngữ và phản xạ khoa học mỗi ngày.',
    content: 'Sân chơi Math & Science Arena kích thích tinh thần tự học của học sinh qua các thử thách hàng ngày. Phương pháp rèn luyện 21 ngày liên tục giúp các em chủ động tiếp thu kiến thức và hình thành thói quen học tập bền vững.',
    image: placeholderImg,
  },
  {
    id: 6,
    category: 'tips',
    categoryLabel: 'CẨM NANG PHỤ HUYNH',
    date: '02/04/2025',
    title: 'Trào lưu mới của bố mẹ Việt khi cho con học tiếng Anh thời công nghệ số',
    url: '/news',
    excerpt: 'Giai đoạn chuẩn bị bước vào lớp 1 sẽ là bước tiến quan trọng trong việc phát triển năng lực ngôn ngữ của con nhờ ứng dụng công nghệ số.',
    content: 'Nhiều phụ huynh hiện đại ưu tiên lựa chọn các môi trường giáo dục tích hợp công nghệ tương tác như Bảng thông minh Smartboard và học tập đa phương tiện. Việc kết hợp nghe nói phản xạ từ sớm giúp trẻ không sợ tiếng Anh và sẵn sàng cho các cấp học tiếp theo.',
    image: newsParenting,
  },
  {
    id: 7,
    category: 'tips',
    categoryLabel: 'CẨM NANG HỌC TẬP',
    date: '20/03/2025',
    title: 'Vượt qua giới hạn để khai thác toàn bộ tiềm năng trong quá trình học tập',
    url: '/news',
    excerpt: 'Làm thế nào để cha mẹ chọn lựa chương trình học tiếng Anh phù hợp giúp con tự học độc lập và phát triển tư duy phản biện.',
    content: 'Để trẻ tự tin làm chủ ngôn ngữ, điều quan trọng là xây dựng môi trường học không rập khuôn hay ép buộc ghi nhớ thụ động. Phương pháp tương tác LETI giúp trẻ chủ động thảo luận, ứng dụng bài học và liên tục nâng cao sự tự tin.',
    image: newsLimit,
  },
  {
    id: 8,
    category: 'tips',
    categoryLabel: 'CẨM NANG HỌC TẬP',
    date: '10/03/2025',
    title: 'Giải pháp học tiếng Anh hiệu quả trong thời đại số cho con',
    url: '/news',
    excerpt: 'Khả năng tiếng Anh và kỹ năng công nghệ số là chiếc chìa khóa vàng giúp con mở cánh cửa hội nhập, tự tin khám phá thế giới.',
    content: 'Trang bị tiếng Anh song hành cùng tư duy công nghệ số mang lại lợi thế lớn cho thế hệ trẻ. Sự kết hợp giữa mô hình 4Ls và công nghệ giáo dục hiện đại tạo tiền đề cho học sinh tự học bền vững.',
    image: placeholderImg,
  },
  {
    id: 9,
    category: 'tips',
    categoryLabel: 'CẨM NANG PHỤ HUYNH',
    date: '01/03/2025',
    title: 'Ứng dụng công nghệ trong giáo dục: Cánh cửa mở ra tương lai Công Dân Toàn Cầu',
    url: '/news',
    excerpt: 'Tiếng Anh là công cụ quan trọng, việc tiếp cận từ sớm qua phương pháp trực quan giúp xây dựng tư duy toàn cầu cho trẻ.',
    content: 'Môi trường học 100% tiếng Anh cùng phần mềm giáo dục chuẩn Anh Quốc giúp trẻ tự nhiên tiếp thu ngôn ngữ như tiếng mẹ đẻ, hình thành phong thái tự tin và tầm nhìn hội nhập.',
    image: placeholderImg,
  },
];
