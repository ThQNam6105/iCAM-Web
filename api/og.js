import fs from 'fs';
import path from 'path';

// Helper to escape HTML characters safely
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Generate slug from text
function slugify(text) {
  if (!text) return '';
  return String(text)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// Static default articles list matching src/data/newsData.ts
const staticArticles = [
  {
    slug: 'khoi-dong-trai-he-stemverse-camp-2025-khoi-nguon-sang-tao-xay-nen-lanh-dao-tai-nang',
    title: 'KHỞI ĐỘNG TRẠI HÈ STEMVERSE CAMP 2025 – KHƠI NGUỒN SÁNG TẠO, XÂY NỀN LÃNH ĐẠO TÀI NÃNG!',
    excerpt: 'Trại hè STEM kỹ thuật công nghệ đầy hấp dẫn giúp khơi dậy niềm đam mê khám phá khoa học và nâng cao kỹ năng tư duy phản biện cho học sinh.',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1200&auto=format&fit=crop'
  },
  {
    slug: 'global-arena-dau-truong-vinh-quang',
    title: 'Global Arena - Đấu Trường Vinh Quang',
    excerpt: 'Global Arena - Đấu Trường Vinh Quang là sự kiện đặc biệt được tổ chức hằng năm, nơi học sinh thử thách bản thân và bứt phá giới hạn.',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop'
  },
  {
    slug: '200-nha-khoa-hoc-nhi-toa-sang-tai-chung-ket-biet-doi-khoa-hoc',
    title: '200 "NHÀ KHOA HỌC NHÍ" TỎA SÁNG TẠI CHUNG KẾT BIỆT ĐỘI KHOA HỌC',
    excerpt: 'Gần 200 nhà khoa học nhí xuất sắc nhất đã quy tụ tranh tài trong không gian học thuật sáng tạo và tự tin trình bày dự án bằng tiếng Anh.',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1200&auto=format&fit=crop'
  },
  {
    slug: 'cong-bo-danh-sach-hoc-sinh-nhan-hoc-bong-toan-va-khoa-hoc',
    title: 'CÔNG BỐ DANH SÁCH HỌC SINH NHẬN HỌC BỔNG TOÁN VÀ KHOA HỌC',
    excerpt: 'Ban Tổ Chức rất vui mừng công bố danh sách các thí sinh xuất sắc nhất đã nhận được Học Bổng Tài Năng Toán & Khoa Học.',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1200&auto=format&fit=crop'
  },
  {
    slug: 'dau-truong-toan-va-khoa-hoc-math-science-arena',
    title: 'ĐẤU TRƯỜNG TOÁN VÀ KHOA HỌC - MATH & SCIENCE ARENA',
    excerpt: '21 ngày rèn luyện thói quen tự học độc lập giúp học sinh hình thành tư duy ngôn ngữ và phản xạ khoa học mỗi ngày.',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1200&auto=format&fit=crop'
  },
  {
    slug: 'trao-luu-moi-cua-bo-me-viet-khi-cho-con-hoc-tieng-anh-thoi-cong-nghe-so',
    title: 'Trào lưu mới của bố mẹ Việt khi cho con học tiếng Anh thời công nghệ số',
    excerpt: 'Giai đoạn chuẩn bị bước vào lớp 1 sẽ là bước tiến quan trọng trong việc phát triển năng lực ngôn ngữ của con nhờ ứng dụng công nghệ số.',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop'
  },
  {
    slug: 'vuot-qua-gioi-han-de-khai-thac-toan-bo-tiem-nang-trong-qua-trinh-hoc-tap',
    title: 'Vượt qua giới hạn để khai thác toàn bộ tiềm năng trong quá trình học tập',
    excerpt: 'Làm thế nào để cha mẹ chọn lựa chương trình học tiếng Anh phù hợp giúp con tự học độc lập và phát triển tư duy phản biện.',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop'
  },
  {
    slug: 'giai-phap-hoc-tieng-anh-hieu-qua-trong-thoi-dai-so-cho-con',
    title: 'Giải pháp học tiếng Anh hiệu quả trong thời đại số cho con',
    excerpt: 'Khả năng tiếng Anh và kỹ năng công nghệ số là chiếc chìa khóa vàng giúp con mở cánh cửa hội nhập, tự tin khám phá thế giới.',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1200&auto=format&fit=crop'
  },
  {
    slug: 'ung-dung-cong-nghe-trong-giao-duc-canh-cua-mo-ra-tuong-lai-cong-dan-toan-cau',
    title: 'Ứng dụng công nghệ trong giáo dục: Cánh cửa mở ra tương lai Công Dân Toàn Cầu',
    excerpt: 'Tiếng Anh là công cụ quan trọng, việc tiếp cận từ sớm qua phương pháp trực quan giúp xây dựng tư duy toàn cầu cho trẻ.',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1200&auto=format&fit=crop'
  }
];

export default async function handler(req, res) {
  try {
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers['host'] || 'thieunamicancam.online';
    const domain = `${protocol}://${host}`;

    // Extract slug from request parameter, query, or path
    let rawSlug = req.query.slug || '';
    if (!rawSlug && req.url) {
      const match = req.url.match(/\/news\/([^?#]+)/);
      if (match) rawSlug = match[1];
    }

    try {
      rawSlug = decodeURIComponent(rawSlug).trim();
    } catch {
      // keep rawSlug as is
    }

    const cleanSlug = slugify(rawSlug);
    let article = null;

    // 1. Fetch from Supabase Database with VALID anon key
    if (rawSlug || cleanSlug) {
      try {
        const supabaseUrl = 'https://zzzoqazbembwstfvvqja.supabase.co';
        const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6em9xYXpiZW1id3N0ZnZ2cWphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU5NDY4ODksImV4cCI6MjEwMTUyMjg4OX0.tA59bmIc2cJtNPIjxkjVWCn-IRpDPS-wwQXaqc_owRM';

        const searchSlug = cleanSlug || slugify(rawSlug);
        const queryUrl = `${supabaseUrl}/rest/v1/news_posts?or=(slug.eq.${encodeURIComponent(rawSlug)},slug.eq.${encodeURIComponent(searchSlug)},slug.ilike.*${encodeURIComponent(searchSlug)}*)&select=*`;
        
        const response = await fetch(queryUrl, {
          headers: {
            'apikey': anonKey,
            'Authorization': `Bearer ${anonKey}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            article = data[0];
          }
        }
      } catch (err) {
        console.error('Supabase fetch error in OG handler:', err);
      }
    }

    // 2. Check static articles array if not found in Supabase
    if (!article && cleanSlug) {
      article = staticArticles.find((a) => a.slug === cleanSlug || a.slug.includes(cleanSlug) || cleanSlug.includes(a.slug));
    }

    // Default Fallback Values
    let title = 'Trung Tâm Anh Ngữ iCAM | Tiếng Anh Chuẩn Quốc Tế';
    let description = 'Trung Tâm Anh Ngữ iCAM - Đào tạo tiếng Anh chuẩn quốc tế cho trẻ em, học sinh và người đi làm.';
    let image = `${domain}/og-default.jpg`;
    let canonicalUrl = rawSlug ? `${domain}/news/${rawSlug}` : `${domain}/news`;

    if (article) {
      title = article.meta_title || article.title || title;
      description = article.meta_description || article.excerpt || description;
      
      const rawImg = article.og_image || article.image || article.cover_image;
      if (rawImg && typeof rawImg === 'string' && rawImg.startsWith('http')) {
        image = rawImg;
      } else if (rawImg && typeof rawImg === 'string' && rawImg.startsWith('/')) {
        image = `${domain}${rawImg}`;
      }

      canonicalUrl = article.canonical_url_override || `${domain}/news/${article.slug || rawSlug}`;
    }

    // Read index.html base file
    let htmlPath = path.join(process.cwd(), 'dist', 'index.html');
    if (!fs.existsSync(htmlPath)) {
      htmlPath = path.join(process.cwd(), 'index.html');
    }
    
    let html = fs.readFileSync(htmlPath, 'utf8');

    // Remove any static title or meta tags to prevent duplication in crawlers
    html = html
      .replace(/<title>.*?<\/title>/gi, '')
      .replace(/<meta\s+name=["']title["'].*?>/gi, '')
      .replace(/<meta\s+name=["']description["'].*?>/gi, '')
      .replace(/<link\s+rel=["']canonical["'].*?>/gi, '')
      .replace(/<meta\s+property=["']og:.*?["'].*?>/gi, '')
      .replace(/<meta\s+name=["']twitter:.*?["'].*?>/gi, '');

    // Prepare Open Graph Meta Tags Injection
    const ogTags = `
    <!-- Primary Meta Tags -->
    <title>${escapeHtml(title)} | iCANCAM</title>
    <meta name="title" content="${escapeHtml(title)} | iCANCAM" />
    <meta name="description" content="${escapeHtml(description)}" />
    <link rel="canonical" href="${canonicalUrl}" />

    <!-- Open Graph / Facebook / Zalo / Messenger / LinkedIn / Discord -->
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="iCANCAM English Center" />
    <meta property="og:locale" content="vi_VN" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:title" content="${escapeHtml(title)} | iCANCAM" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:image:secure_url" content="${image}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${escapeHtml(title)}" />

    <!-- Twitter / X -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${canonicalUrl}" />
    <meta name="twitter:title" content="${escapeHtml(title)} | iCANCAM" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${image}" />

    <!-- Structured Data JSON-LD -->
    <script type="application/ld+json">
    ${JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'NewsArticle',
          'headline': title,
          'description': description,
          'image': [image],
          'mainEntityOfPage': {
            '@type': 'WebPage',
            '@id': canonicalUrl
          },
          'publisher': {
            '@type': 'Organization',
            'name': 'iCANCAM English Center',
            'url': domain
          }
        },
        {
          '@type': 'BreadcrumbList',
          'itemListElement': [
            {
              '@type': 'ListItem',
              'position': 1,
              'name': 'Trang chủ',
              'item': domain
            },
            {
              '@type': 'ListItem',
              'position': 2,
              'name': 'Tin tức - Sự kiện',
              'item': `${domain}/news`
            },
            {
              '@type': 'ListItem',
              'position': 3,
              'name': title,
              'item': canonicalUrl
            }
          ]
        }
      ]
    })}
    </script>
    `;

    html = html.replace('</head>', `${ogTags}\n</head>`);

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    return res.status(200).send(html);

  } catch (error) {
    console.error('OG Handler Error:', error);
    try {
      const fallbackPath = path.join(process.cwd(), 'dist', 'index.html');
      const fallbackHtml = fs.readFileSync(fallbackPath, 'utf8');
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.status(200).send(fallbackHtml);
    } catch {
      return res.status(500).send('Internal Server Error');
    }
  }
}
