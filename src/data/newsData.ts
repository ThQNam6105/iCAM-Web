import newsArena from '../assets/news_arena.png';
import newsParenting from '../assets/news_parenting.png';
import newsLimit from '../assets/news_limit.png';

export interface Article {
  id: number;
  title: string;
  url: string;
  excerpt: string;
  image: string;
}

const placeholderImg = 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=600&auto=format&fit=crop';

export const articlesData: Article[] = [
  {
    id: 1,
    title: 'iSMART ONLINE KHỞI ĐỘNG TRẠI HÈ STEMVERSE CAMP 2025 – KHƠI NGUỒN SÁNG TẠO, XÂY NỀN LÃNH ĐẠO TÀI NĂNG!',
    url: '/news',
    excerpt: 'Trại hè STEM kỹ thuật công nghệ đầy hấp dẫn giúp khơi dậy niềm đam mê khám phá khoa học và nâng cao kỹ năng tư duy phản biện cho học sinh.',
    image: placeholderImg,
  },
  {
    id: 2,
    title: '[iSMART Online] Global Arena - Đấu trường vinh quang',
    url: '/news',
    excerpt: 'Global Arena - Đấu Trường Vinh Quang là một sự kiện đặc biệt được iSMART Online tổ chức hằng năm, nơi học sinh sẽ có cơ hội thử thách bản thân, khai phá tiềm năng và vượt qua mọi giới hạn.',
    image: newsArena,
  },
  {
    id: 3,
    title: '200 "NHÀ KHOA HỌC NHÍ" TỎA SÁNG TẠI CHUNG KẾT BIỆT ĐỘI KHOA HỌC iSMART TẠI THỊ XÃ PHÚ THỌ',
    url: '/news',
    excerpt: 'Sáng ngày 10/05/2024, gần 200 "nhà khoa học nhí" xuất sắc nhất đến từ 4 trường Tiểu học trên địa bàn thị xã Phú Thọ đã quy tụ tranh tài.',
    image: placeholderImg,
  },
  {
    id: 4,
    title: '[iSMART Online] CÔNG BỐ DANH SÁCH HỌC SINH NHẬN HỌC BỔNG TOÁN VÀ KHOA HỌC - MATH & SCIENCE SCHOLARS',
    url: '/news',
    excerpt: 'Trải qua những vòng thi đánh giá năng lực, Ban Tổ Chức rất vui mừng công bố danh sách các thí sinh xuất sắc nhất đã nhận được Học Bổng.',
    image: placeholderImg,
  },
  {
    id: 5,
    title: '[iSMART Online] ĐẤU TRƯỜNG TOÁN VÀ KHOA HỌC - MATH & SCIENCE ARENA',
    url: '/news',
    excerpt: 'Theo các nhà nghiên cứu khoa học, 21 ngày là khoảng thời gian là tối thiểu giúp bắt đầu hình thành một thói quen tự rèn luyện và học tập.',
    image: placeholderImg,
  },
  {
    id: 6,
    title: 'Trào lưu mới của bố mẹ Việt khi cho con học tiếng Anh thời công nghệ số',
    url: '/news',
    excerpt: 'Giai đoạn chuẩn bị bước vào lớp 1 sẽ là bước tiến quan trọng trong việc phát triển năng lực ngôn ngữ của con, bằng cách ứng dụng công nghệ số.',
    image: newsParenting,
  },
  {
    id: 7,
    title: 'Vượt qua giới hạn để khai thác toàn bộ tiềm năng trong quá trình học tập',
    url: '/news',
    excerpt: 'Đứng trước vô vàn thông tin trên mạng và những rào cản, nhiều cha mẹ không khỏi băn khoăn, làm thế nào để chọn một chương trình học tiếng Anh phù hợp.',
    image: newsLimit,
  },
  {
    id: 8,
    title: 'Giải pháp học tiếng Anh hiệu quả trong thời đại số cho con',
    url: '/news',
    excerpt: 'Khả năng tiếng Anh và kỹ năng công nghệ số là chiếc chìa khóa vàng giúp con mở cánh cửa hội nhập, tự tin khám phá thế giới.',
    image: placeholderImg,
  },
  {
    id: 9,
    title: 'Ứng dụng công nghệ trong giáo dục: Cánh cửa mở ra tương lai Công Dân Toàn Cầu cho con',
    url: '/news',
    excerpt: 'Tiếng Anh đã trở thành một ngôn ngữ quốc tế quan trọng, và việc học tập từ sớm sẽ mang lại lợi thế lớn cho con trong tương lai.',
    image: placeholderImg,
  },
];
