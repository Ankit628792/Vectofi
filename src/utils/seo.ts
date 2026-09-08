import { IconItem } from '../types';
import { ICON_CATEGORIES } from '../data/categories';

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogType?: 'website' | 'article' | 'product';
  jsonLd?: Record<string, any>;
}

const BASE_URL = 'https://vectofi.dev';
const DEFAULT_TITLE = 'Vectofi — Free Static & Animated Vector Icons';
const DEFAULT_DESCRIPTION =
  'Developer-first SVG icon library with 110+ static and animated icons, interactive SVG laboratory, framework code generators, and vector art design system.';
const DEFAULT_KEYWORDS = [
  'svg icons',
  'animated icons',
  'vector icons',
  'react icons',
  'vue icons',
  'svelte icons',
  'angular icons',
  'open source icons',
  'mit license',
  'icon library',
  'vector graphics',
  'ui icons',
];

/**
 * Helper to update or create a <meta> tag by name or property attribute.
 */
function setMetaTag(attrName: 'name' | 'property', attrValue: string, content: string) {
  let element = document.querySelector(`meta[${attrName}="${attrValue}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attrName, attrValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

/**
 * Helper to update or create the canonical <link> tag.
 */
function setCanonicalLink(url: string) {
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
}

/**
 * Helper to update or inject JSON-LD structured data.
 */
function setStructuredData(jsonLd?: Record<string, any>) {
  const SCRIPT_ID = 'vectofi-seo-jsonld';
  let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;

  if (!jsonLd) {
    if (script) script.remove();
    return;
  }

  if (!script) {
    script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(jsonLd);
}

/**
 * Core utility to dynamically update the document title and meta tags.
 */
export function updateDocumentSEO(config: Partial<SEOConfig>) {
  if (typeof document === 'undefined') return;

  const title = config.title
    ? config.title.includes('Vectofi')
      ? config.title
      : `${config.title} — Vectofi`
    : DEFAULT_TITLE;

  const description = config.description || DEFAULT_DESCRIPTION;
  const keywords = config.keywords && config.keywords.length > 0 ? config.keywords : DEFAULT_KEYWORDS;
  const canonicalUrl = config.canonicalUrl || BASE_URL;
  const ogType = config.ogType || 'website';

  // 1. Title
  document.title = title;

  // 2. Standard Meta Tags
  setMetaTag('name', 'description', description);
  setMetaTag('name', 'keywords', keywords.join(', '));
  setMetaTag('name', 'robots', 'index, follow');

  // 3. Open Graph Tags
  setMetaTag('property', 'og:title', title);
  setMetaTag('property', 'og:description', description);
  setMetaTag('property', 'og:type', ogType);
  setMetaTag('property', 'og:url', canonicalUrl);
  setMetaTag('property', 'og:site_name', 'Vectofi');

  // 4. Twitter Tags
  setMetaTag('name', 'twitter:card', 'summary_large_image');
  setMetaTag('name', 'twitter:title', title);
  setMetaTag('name', 'twitter:description', description);

  // 5. Canonical
  setCanonicalLink(canonicalUrl);

  // 6. JSON-LD Structured Data
  setStructuredData(config.jsonLd);
}

/**
 * Generate SEO configuration for a specific route.
 */
export function getSEOForRoute(
  route: string,
  categoryId?: string,
  query?: string
): SEOConfig {
  const cleanRoute = route.split('?')[0];

  if (cleanRoute === '/' || cleanRoute === '') {
    return {
      title: DEFAULT_TITLE,
      description: DEFAULT_DESCRIPTION,
      keywords: DEFAULT_KEYWORDS,
      canonicalUrl: `${BASE_URL}/`,
      ogType: 'website',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Vectofi',
        url: BASE_URL,
        description: DEFAULT_DESCRIPTION,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${BASE_URL}/icons?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
    };
  }

  if (cleanRoute === '/icons') {
    if (query) {
      return {
        title: `Search "${query}" Icons — Vectofi`,
        description: `Explore search results for "${query}" across 110+ precision static and animated vector icons.`,
        keywords: [query, 'svg search', 'icon search', 'vector search', ...DEFAULT_KEYWORDS],
        canonicalUrl: `${BASE_URL}/icons?q=${encodeURIComponent(query)}`,
      };
    }

    if (categoryId && categoryId !== 'all') {
      const cat = ICON_CATEGORIES.find(c => c.id === categoryId);
      const catName = cat ? cat.name : categoryId;
      return {
        title: `${catName} SVG Icons — Vectofi`,
        description: cat?.description || `Explore ${catName} vector icons in SVG, React, Vue, and Svelte format.`,
        keywords: [catName.toLowerCase(), `${catName.toLowerCase()} icons`, 'svg icons', ...DEFAULT_KEYWORDS],
        canonicalUrl: `${BASE_URL}/icons?category=${encodeURIComponent(categoryId)}`,
      };
    }

    return {
      title: 'Browse 110+ Precision SVG Icons — Vectofi',
      description: 'Explore 110+ developer-first static and morphing SVG vector icons with real-time framework code generation and interactive customization.',
      keywords: ['icon catalog', 'all icons', 'svg collection', ...DEFAULT_KEYWORDS],
      canonicalUrl: `${BASE_URL}/icons`,
    };
  }

  if (cleanRoute === '/animated') {
    return {
      title: 'Animated SVG Icons (Pure CSS Keyframes) — Vectofi',
      description: 'Self-contained animated vector icons powered by encapsulated CSS keyframes, zero external dependencies, and accessible reduced-motion support.',
      keywords: ['animated icons', 'css keyframe icons', 'morphing icons', 'svg motion', ...DEFAULT_KEYWORDS],
      canonicalUrl: `${BASE_URL}/animated`,
    };
  }

  if (cleanRoute === '/categories') {
    return {
      title: 'Icon Categories (14 Functional Sets) — Vectofi',
      description: 'Explore vector icons organized into 14 functional categories: arrows, navigation, interface, media, developer tooling, security, and more.',
      keywords: ['icon categories', 'functional icon sets', 'ui icons', ...DEFAULT_KEYWORDS],
      canonicalUrl: `${BASE_URL}/categories`,
    };
  }

  if (cleanRoute === '/collections') {
    return {
      title: 'Curated Icon Sets & Custom Collections — Vectofi',
      description: 'Build, customize, and batch download tailored SVG icon packs for web applications, dashboards, e-commerce, and developer tooling.',
      keywords: ['icon collections', 'curated icon packs', 'batch download svg', ...DEFAULT_KEYWORDS],
      canonicalUrl: `${BASE_URL}/collections`,
    };
  }

  if (cleanRoute === '/favorites') {
    return {
      title: 'Saved Favorite Icons — Vectofi',
      description: 'Your saved vector icons ready for batch download, React component export, and SVG code copying.',
      keywords: ['saved icons', 'favorite icons', 'custom icon set', ...DEFAULT_KEYWORDS],
      canonicalUrl: `${BASE_URL}/favorites`,
    };
  }

  if (cleanRoute === '/docs') {
    return {
      title: 'Integration Documentation & Framework Guide — Vectofi',
      description: 'Complete documentation for integrating Vectofi SVG icons into React, Vue, Svelte, Angular, Web Components, and Vanilla HTML/CSS.',
      keywords: ['icon documentation', 'react icons guide', 'vue icons guide', 'svelte icons', ...DEFAULT_KEYWORDS],
      canonicalUrl: `${BASE_URL}/docs`,
      ogType: 'article',
    };
  }

  if (cleanRoute === '/license') {
    return {
      title: 'MIT Open Source License — Vectofi',
      description: 'Vectofi is 100% free and open-source under the MIT license for personal, educational, and commercial projects.',
      keywords: ['mit license', 'open source icons', 'commercial use icons', 'free svg license'],
      canonicalUrl: `${BASE_URL}/license`,
    };
  }

  return {
    title: 'Page Not Found — Vectofi',
    description: 'The requested Vectofi page could not be found.',
    canonicalUrl: `${BASE_URL}${route.startsWith('/') ? route : '/' + route}`,
  };
}

/**
 * Generate SEO configuration for an individual icon view / laboratory.
 */
export function getSEOForIcon(icon: IconItem): SEOConfig {
  const animationText = icon.hasAnimation ? 'Animated ' : 'Static ';
  const title = `${icon.name} ${animationText}SVG Icon — Vectofi`;
  const description = `Free ${animationText.toLowerCase()}${icon.name} vector icon in SVG, React, Vue, Svelte, and Angular format. MIT licensed, fully accessible, 24px grid aligned.`;
  const keywords = [
    icon.name.toLowerCase(),
    icon.slug,
    `${icon.slug} icon`,
    `${icon.name.toLowerCase()} svg`,
    `${icon.category} icons`,
    icon.hasAnimation ? 'animated svg' : 'static svg',
    ...icon.tags,
    'free vector icon',
    'mit license',
  ];
  const canonicalUrl = `${BASE_URL}/icon/${icon.slug}`;

  return {
    title,
    description,
    keywords,
    canonicalUrl,
    ogType: 'product',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: `${icon.name} SVG Icon`,
      headline: `${icon.name} — Free ${animationText.toLowerCase()}Vector Icon`,
      description,
      encodingFormat: 'image/svg+xml',
      keywords: keywords.join(', '),
      license: 'https://opensource.org/licenses/MIT',
      author: {
        '@type': 'Person',
        name: 'Ankit Kumar',
        url: 'https://github.com/Ankit628792/Vectofi',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Vectofi',
        url: BASE_URL,
        logo: {
          '@type': 'ImageObject',
          url: `${BASE_URL}/favicon.svg`,
        },
      },
    },
  };
}
