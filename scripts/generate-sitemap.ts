import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ICONS_DEFINITIONS } from '../src/data/icons.ts';
import { ICON_CATEGORIES } from '../src/data/categories.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = process.env.APP_URL || 'https://vectofi.dev';
const TODAY = new Date().toISOString().split('T')[0];

interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: string;
  image?: {
    loc: string;
    title: string;
    caption: string;
  };
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function generateSitemapXml(): { xml: string; totalUrls: number } {
  const urls: SitemapUrl[] = [];

  // 1. Static Core Pages
  const staticPages: { path: string; priority: string; changefreq: SitemapUrl['changefreq'] }[] = [
    { path: '/', priority: '1.0', changefreq: 'daily' },
    { path: '/icons', priority: '0.9', changefreq: 'daily' },
    { path: '/animated', priority: '0.9', changefreq: 'weekly' },
    { path: '/categories', priority: '0.8', changefreq: 'weekly' },
    { path: '/collections', priority: '0.8', changefreq: 'weekly' },
    { path: '/favorites', priority: '0.6', changefreq: 'weekly' },
    { path: '/docs', priority: '0.8', changefreq: 'monthly' },
    { path: '/license', priority: '0.7', changefreq: 'monthly' },
  ];

  for (const page of staticPages) {
    urls.push({
      loc: `${BASE_URL}${page.path === '/' ? '' : page.path}`,
      lastmod: TODAY,
      changefreq: page.changefreq,
      priority: page.priority,
    });
  }

  // 2. Category Pages (14 categories)
  for (const cat of ICON_CATEGORIES) {
    urls.push({
      loc: `${BASE_URL}/icons?category=${encodeURIComponent(cat.id)}`,
      lastmod: TODAY,
      changefreq: 'weekly',
      priority: '0.7',
    });
  }

  // 3. Individual Icon Pages (110+ icons)
  for (const icon of ICONS_DEFINITIONS) {
    const isAnim = icon.hasAnimation ? 'animated' : 'static';
    urls.push({
      loc: `${BASE_URL}/icon/${icon.slug}`,
      lastmod: TODAY,
      changefreq: 'weekly',
      priority: icon.featured ? '0.85' : '0.80',
      image: {
        loc: `${BASE_URL}/icons/${icon.slug}.svg`,
        title: `${escapeXml(icon.name)} SVG Icon`,
        caption: `Free ${isAnim} vector icon for ${escapeXml(icon.name)} (${icon.category} category). MIT licensed.`,
      },
    });
  }

  // Build XML string
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
  xml += '        xmlns:xhtml="http://www.w3.org/1999/xhtml"\n';
  xml += '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n';

  for (const item of urls) {
    xml += '  <url>\n';
    xml += `    <loc>${escapeXml(item.loc)}</loc>\n`;
    xml += `    <lastmod>${item.lastmod}</lastmod>\n`;
    xml += `    <changefreq>${item.changefreq}</changefreq>\n`;
    xml += `    <priority>${item.priority}</priority>\n`;

    if (item.image) {
      xml += '    <image:image>\n';
      xml += `      <image:loc>${escapeXml(item.image.loc)}</image:loc>\n`;
      xml += `      <image:title>${item.image.title}</image:title>\n`;
      xml += `      <image:caption>${item.image.caption}</image:caption>\n`;
      xml += '    </image:image>\n';
    }

    xml += '  </url>\n';
  }

  xml += '</urlset>\n';

  return { xml, totalUrls: urls.length };
}

function run() {
  const publicDir = path.resolve(__dirname, '../public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // 1. Generate Sitemap XML
  const { xml, totalUrls } = generateSitemapXml();
  const sitemapPath = path.join(publicDir, 'sitemap.xml');
  fs.writeFileSync(sitemapPath, xml, 'utf8');
  console.log(`[sitemap] Generated sitemap.xml with ${totalUrls} indexed routes.`);

  // 2. Generate robots.txt
  const robotsTxt = `# https://www.robotstxt.org/robotstxt.html
User-agent: *
Allow: /

# Sitemaps
Sitemap: ${BASE_URL}/sitemap.xml
`;
  const robotsPath = path.join(publicDir, 'robots.txt');
  fs.writeFileSync(robotsPath, robotsTxt, 'utf8');
  console.log('[sitemap] Generated robots.txt pointing to sitemap.xml.');
}

run();
