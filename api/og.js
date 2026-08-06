import fs from 'fs';
import path from 'path';

// Helper to escape HTML characters
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export default async function handler(req, res) {
  try {
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers['host'] || 'thieunamicancam.online';
    const domain = `${protocol}://${host}`;

    // Get slug from query parameter or URL path
    let slug = req.query.slug || '';
    if (!slug && req.url) {
      const match = req.url.match(/\/news\/([^?#]+)/);
      if (match) slug = match[1];
    }

    let article = null;

    // 1. Attempt to fetch dynamic article from Supabase REST API
    if (slug) {
      try {
        const supabaseUrl = 'https://zzzoqazbembwstfvvqja.supabase.co';
        const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6em9xYXpiZW1id3N0ZnZ2cWphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5MTcxOTUsImV4cCI6MjA2NDQ5MzE5NX0.8Q5tB0k3n_J3y0X_Vp0hJ517g5zJ2v3k_N5m5x_X0';
        
        const response = await fetch(`${supabaseUrl}/rest/v1/news_posts?slug=eq.${encodeURIComponent(slug)}&select=*`, {
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

    // Default Fallback Values
    let title = 'Trung Tâm Anh Ngữ iCAM | Tiếng Anh Chuẩn Quốc Tế';
    let description = 'Cập nhật tin tức, sự kiện và bí quyết học tiếng Anh mới nhất tại Trung Tâm Anh Ngữ iCAM.';
    let image = `${domain}/og-default.jpg`;
    let canonicalUrl = slug ? `${domain}/news/${slug}` : `${domain}/news`;

    if (article) {
      title = article.meta_title || article.title || title;
      description = article.meta_description || article.excerpt || description;
      
      const rawImg = article.og_image || article.image || article.cover_image;
      if (rawImg && typeof rawImg === 'string' && rawImg.startsWith('http')) {
        image = rawImg;
      } else if (rawImg && typeof rawImg === 'string' && rawImg.startsWith('/')) {
        image = `${domain}${rawImg}`;
      }

      canonicalUrl = article.canonical_url_override || `${domain}/news/${article.slug || slug}`;
    }

    // Read index.html base file
    let htmlPath = path.join(process.cwd(), 'dist', 'index.html');
    if (!fs.existsSync(htmlPath)) {
      htmlPath = path.join(process.cwd(), 'index.html');
    }
    
    let html = fs.readFileSync(htmlPath, 'utf8');

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

    // Replace existing <title> tag or inject before </head>
    if (html.includes('<title>')) {
      html = html.replace(/<title>.*?<\/title>/i, ogTags);
    } else {
      html = html.replace('</head>', `${ogTags}\n</head>`);
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    return res.status(200).send(html);

  } catch (error) {
    console.error('OG Handler Error:', error);
    // Fallback to serving static index.html on error
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
