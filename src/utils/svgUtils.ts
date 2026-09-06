import { IconItem, AnimationType, LaboratorySettings } from '../types';
import { getAnimationCss, parseSvgBodyToMorphablePaths } from './animations';

export * from './animations';

export interface SvgRenderOptions {
  size?: number | string;
  color?: string;
  strokeWidth?: number;
  animated?: boolean;
  speed?: number;
  viewBox?: string;
  className?: string;
  id?: string;
}

/**
 * Generates a clean, valid standalone static SVG document string
 */
export function generateStaticSvg(
  icon: Pick<IconItem, 'name' | 'slug' | 'body' | 'viewBox'>,
  options: SvgRenderOptions = {}
): string {
  const size = options.size ?? 24;
  const color = options.color ?? 'currentColor';
  const strokeWidth = options.strokeWidth ?? 2;
  const viewBox = icon.viewBox || options.viewBox || '0 0 24 24';

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="${viewBox}" fill="none" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">
  <!-- ${icon.name} Icon -->
  ${icon.body}
</svg>`;
}

/**
 * Generates a self-contained animated SVG document string with native SVG path morphing
 * showing the creation of the final icon from none.
 */
export function generateAnimatedSvg(
  icon: Pick<IconItem, 'name' | 'slug' | 'body' | 'viewBox' | 'animationType' | 'hasAnimation'>,
  options: SvgRenderOptions = {}
): string {
  const size = options.size ?? 24;
  const color = options.color ?? 'currentColor';
  const strokeWidth = options.strokeWidth ?? 2;
  const viewBox = icon.viewBox || options.viewBox || '0 0 24 24';
  const speed = options.speed ?? 1;
  const durationSec = Math.max(0.6, 2.4 / Math.max(0.2, speed)).toFixed(2);

  const morphPaths = parseSvgBodyToMorphablePaths(icon.body, icon.slug, 14);

  const pathsMarkup = morphPaths.length > 0
    ? morphPaths.map(p => `  <path d="${p.originalD}" stroke="${p.stroke || color}" stroke-width="${p.strokeWidth || strokeWidth}" fill="${p.fill || 'none'}" stroke-linecap="${p.strokeLinecap || 'round'}" stroke-linejoin="${p.strokeLinejoin || 'round'}">
    <animate attributeName="d" dur="${durationSec}s" repeatCount="indefinite" values="${p.valuesString}" />
  </path>`).join('\n')
    : `  <g>${icon.body}</g>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="${viewBox}" fill="none" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">
  <!-- Morphed SVG ${icon.name} Icon (Creation from None) -->
${pathsMarkup}
</svg>`;
}

/**
 * Cleans, formats, and indents raw SVG markup
 */
export function cleanSvgMarkup(rawSvg: string): string {
  return rawSvg
    .replace(/>\s+</g, '><')
    .replace(/<([^>]+)>/g, '\n  <$1>')
    .trim();
}

/**
 * Minifies and optimizes SVG markup by removing redundant whitespace and comment tags
 */
export function optimizeSvg(rawSvg: string): string {
  return rawSvg
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\s+/g, ' ')
    .replace(/>\s+</g, '><')
    .trim();
}

/**
 * Encodes SVG string into a valid CSS Data URI for background-image use
 */
export function createSvgDataUri(svg: string): string {
  const minified = optimizeSvg(svg);
  const encoded = encodeURIComponent(minified)
    .replace(/'/g, '%27')
    .replace(/"/g, '%22');
  return `data:image/svg+xml,${encoded}`;
}

/**
 * Generates an SVG Sprite Sheet containing <symbol> definitions for each icon
 */
export function generateSvgSprite(
  icons: Pick<IconItem, 'id' | 'slug' | 'body' | 'viewBox'>[]
): string {
  const symbols = icons
    .map(icon => {
      const viewBox = icon.viewBox || '0 0 24 24';
      return `    <symbol id="icon-${icon.slug}" viewBox="${viewBox}">
      ${icon.body}
    </symbol>`;
    })
    .join('\n');

  return `<svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
  <defs>
${symbols}
  </defs>
</svg>`;
}

/**
 * Calculates geometric element statistics for an SVG body
 */
export function parseSvgElementStats(body: string): {
  paths: number;
  lines: number;
  circles: number;
  polylines: number;
  rects: number;
  totalElements: number;
} {
  const paths = (body.match(/<path\b/gi) || []).length;
  const lines = (body.match(/<line\b/gi) || []).length;
  const circles = (body.match(/<circle\b/gi) || []).length;
  const polylines = (body.match(/<polyline\b/gi) || []).length;
  const rects = (body.match(/<rect\b/gi) || []).length;

  return {
    paths,
    lines,
    circles,
    polylines,
    rects,
    totalElements: paths + lines + circles + polylines + rects,
  };
}

/**
 * Triggers browser file download for an SVG icon
 */
export function downloadSvgFile(
  icon: IconItem,
  isAnimated: boolean = false,
  settings: Partial<LaboratorySettings> = {}
): void {
  const svgContent = isAnimated && icon.hasAnimation
    ? generateAnimatedSvg(icon, settings)
    : generateStaticSvg(icon, settings);

  const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `${icon.slug}${isAnimated ? '-animated' : ''}.svg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Safely copies text to the clipboard with fallback
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fallback
    }
  }

  // Fallback for non-secure or iframe contexts
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.opacity = '0';
  textArea.style.left = '-999999px';
  textArea.style.top = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  let successful = false;
  try {
    successful = document.execCommand('copy');
  } catch {
    successful = false;
  }
  document.body.removeChild(textArea);
  return successful;
}
