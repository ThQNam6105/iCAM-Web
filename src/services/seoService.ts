import type { SystemSettings } from './settingsService';
import icanLogo from '../assets/ican.png';
import bannerBg from '../assets/banner-bg.jpg';

/**
 * Dynamically synchronize system SEO settings to browser HTML <head>
 */
export const applySEOMetadata = (settings: SystemSettings, language: 'vi' | 'en' = 'vi') => {
  if (typeof document === 'undefined') return;

  const isEn = language === 'en';

  // 1. Title Resolution
  const title = isEn
    ? settings.seo?.websiteTitleEn || settings.seo?.websiteTitleVi || 'iCANCAM English Center'
    : settings.seo?.websiteTitleVi || 'Trung Tâm Ngoại Ngữ iCANCAM | Anh Văn Trẻ Em & Luyện Thi IELTS Hóc Môn, Q.12';

  // 2. Description Resolution
  const description = isEn
    ? settings.seo?.websiteDescEn || settings.seo?.websiteDescVi || 'International standard English training center.'
    : settings.seo?.websiteDescVi || 'Trung tâm đào tạo Tiếng Anh chuẩn quốc tế hàng đầu tại Hóc Môn và Quận 12.';

  const rawFavicon = settings.seo?.faviconUrl || '';
  const faviconUrl = (!rawFavicon || rawFavicon.startsWith('blob:')) ? icanLogo : rawFavicon;

  const rawSocial = settings.seo?.socialShareImageUrl || '';
  const socialShareImageUrl = (!rawSocial || rawSocial.startsWith('blob:')) ? bannerBg : rawSocial;
  const siteName = settings.websiteInfo?.displayName || 'iCANCAM English Center';

  // Apply Document Title
  document.title = title;

  // Helper to set meta tag
  const setMetaTag = (attrName: string, attrVal: string, content: string) => {
    if (!content) return;
    let element = document.querySelector(`meta[${attrName}="${attrVal}"]`);
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attrName, attrVal);
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  };

  // Helper to set link rel tag
  const setLinkTag = (rel: string, href: string, type?: string) => {
    if (!href) return;
    let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
    if (!element) {
      element = document.createElement('link');
      element.setAttribute('rel', rel);
      document.head.appendChild(element);
    }
    if (type) element.setAttribute('type', type);
    element.setAttribute('href', href);
  };

  // Primary Meta Tags
  setMetaTag('name', 'title', title);
  setMetaTag('name', 'description', description);

  // Favicon & Touch Icon
  if (faviconUrl) {
    let iconType = 'image/png';
    if (faviconUrl.includes('.ico') || faviconUrl.startsWith('data:image/x-icon') || faviconUrl.startsWith('data:image/vnd.microsoft.icon')) {
      iconType = 'image/x-icon';
    } else if (faviconUrl.includes('.svg') || faviconUrl.startsWith('data:image/svg+xml')) {
      iconType = 'image/svg+xml';
    }

    setLinkTag('icon', faviconUrl, iconType);
    setLinkTag('shortcut icon', faviconUrl, iconType);
    setLinkTag('apple-touch-icon', faviconUrl);
  }

  // Open Graph / Facebook / Zalo / Messenger / LinkedIn / Discord
  setMetaTag('property', 'og:site_name', siteName);
  setMetaTag('property', 'og:title', title);
  setMetaTag('property', 'og:description', description);
  setMetaTag('property', 'og:image', socialShareImageUrl);
  setMetaTag('property', 'og:image:secure_url', socialShareImageUrl);

  // Twitter / X
  setMetaTag('name', 'twitter:title', title);
  setMetaTag('name', 'twitter:description', description);
  setMetaTag('name', 'twitter:image', socialShareImageUrl);

  // Dynamic Tracking Script Injections
  if (settings.analytics?.enableGoogleAnalytics && settings.analytics?.gaMeasurementId) {
    injectGoogleAnalytics(settings.analytics.gaMeasurementId);
  }
  if (settings.analytics?.enableMetaPixel && settings.analytics?.metaPixelId) {
    injectMetaPixel(settings.analytics.metaPixelId);
  }
};

const injectGoogleAnalytics = (gaId: string) => {
  if (document.getElementById('ga-script')) return;
  try {
    const script1 = document.createElement('script');
    script1.id = 'ga-script';
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`;
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.id = 'ga-init-script';
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${gaId}');
    `;
    document.head.appendChild(script2);
  } catch {
    // Ignore script injection restrictions
  }
};

const injectMetaPixel = (pixelId: string) => {
  if (document.getElementById('meta-pixel-script')) return;
  try {
    const script = document.createElement('script');
    script.id = 'meta-pixel-script';
    script.innerHTML = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${pixelId}');
      fbq('track', 'PageView');
    `;
    document.head.appendChild(script);
  } catch {
    // Ignore script injection restrictions
  }
};
