/**
 * Vectofi — Central Common Variables, Texts & Constants
 * 
 * Defines single-source-of-truth constants, textual strings, labels,
 * default configuration settings, brand identities, and utility helpers.
 */

// ============================================================================
// 1. BRAND & APPLICATION METADATA
// ============================================================================

export const APP_NAME = 'Vectofi';
export const APP_VERSION = '2.4';
export const APP_TAGLINE = 'Free Static & Animated Vector Icons';
export const APP_DESCRIPTION =
  'Developer-first SVG icon library with 220+ static and animated icons, interactive SVG laboratory, framework code generators, and vector art design system.';
export const APP_CANONICAL_URL = 'https://vectofi.dev/';
export const APP_DEFAULT_BASE_URL = 'https://vectofi.vercel.app';
export const APP_REPOSITORY_URL = 'https://github.com/ankit628792/vectofi';

// ============================================================================
// 2. CREATOR & ATTRIBUTION
// ============================================================================

export const AUTHOR_NAME = 'Ankit Kumar';
export const AUTHOR_PROFILE_URL = 'https://www.instagram.com/ankit_628792';
export const AUTHOR_ROLE_LABEL = 'Designed & Developed by';

// ============================================================================
// 3. ICON LIBRARY METRICS & LABELS
// ============================================================================

/** Consistent display strings for counts across all views */
export const ICON_COUNT_DISPLAY = '220+';
export const ANIMATED_ICONS_DISPLAY = '90+';
export const CATEGORIES_COUNT = 14;
export const DEFAULT_LICENSE = 'MIT';

/** Standardized UI Text & Labels */
export const UI_TEXT = {
  // Search placeholders
  searchCompactPlaceholder: `Search ${ICON_COUNT_DISPLAY} icons...`,
  searchFullPlaceholder: `Search ${ICON_COUNT_DISPLAY} icons by name, category, or tag (press /)...`,
  searchHeroPlaceholder: `Search ${ICON_COUNT_DISPLAY} icons (e.g. arrow, heart, code, rocket)...`,
  commandPalettePlaceholder: `Type a command or search ${ICON_COUNT_DISPLAY} icons...`,

  // Common CTA and button labels
  browseAllIcons: `Browse All ${ICON_COUNT_DISPLAY} Icons`,
  browseSvgLibrary: `Browse ${ICON_COUNT_DISPLAY} SVG Library`,
  exploreAllIcons: `Explore All ${ICON_COUNT_DISPLAY} Icons`,
  loadingSvgs: `Loading ${ICON_COUNT_DISPLAY} SVGs`,
  registryBadge: `Registry: ${ICON_COUNT_DISPLAY} Production SVGs`,
  vectorIconsBadge: `${ICON_COUNT_DISPLAY} Vector Icons`,
  registeredIconsLabel: `${ICON_COUNT_DISPLAY} icons registered`,
  
  // Gallery Subtitle
  gallerySubtitle: `Browse, customize, and export ${ICON_COUNT_DISPLAY} production-ready vector icons with motion and framework bindings.`,
  allIconsSubtitle: `Explore ${ICON_COUNT_DISPLAY} precision vector icons across ${CATEGORIES_COUNT} functional categories.`,
} as const;

// ============================================================================
// 4. INTERACTIVE SVG LABORATORY PRESETS
// ============================================================================

export const PRESET_ICON_SIZES = [16, 24, 32, 48, 64, 96] as const;
export const DEFAULT_ICON_SIZE = 48;

export const PRESET_STROKE_WIDTHS = [1, 1.5, 2, 2.5, 3] as const;
export const DEFAULT_STROKE_WIDTH = 2;

export const PRESET_SWATCH_COLORS = [
  '#60A5FA', // Blue
  '#38BDF8', // Sky
  '#34D399', // Emerald
  '#FBBF24', // Amber
  '#F43F5E', // Rose
  '#FFFFFF', // White
] as const;
export const DEFAULT_SWATCH_COLOR = '#60A5FA';

export const PRESET_BACKGROUND_MODES = [
  'transparent',
  'light',
  'dark',
  'blueprint',
  'custom',
] as const;

// ============================================================================
// 5. TIMING & DURATION CONSTANTS
// ============================================================================

export const COPY_FEEDBACK_DURATION_MS = 2000;
export const TOAST_DEFAULT_DURATION_MS = 3000;
export const LOADER_TICK_MS = 120;
export const SEARCH_DEBOUNCE_MS = 150;

// ============================================================================
// 6. KEYBOARD SHORTCUTS REFERENCE
// ============================================================================

export const KEYBOARD_SHORTCUTS = [
  { key: '/', description: 'Focus icon search input' },
  { key: '⌘K / Ctrl+K', description: 'Open command palette' },
  { key: 'Esc', description: 'Close modal, palette, or drawer' },
  { key: 'Space', description: 'Toggle animation playback in laboratory' },
  { key: 'C', description: 'Quick copy SVG code' },
  { key: 'D', description: 'Quick download SVG file' },
  { key: 'F', description: 'Toggle favorite status' },
] as const;

// ============================================================================
// 7. HELPER UTILITIES
// ============================================================================

/**
 * Formats an icon count into a standardized display string (e.g. 220+)
 */
export function formatIconCount(count: number, suffix = '+'): string {
  if (count <= 0) return '0';
  const rounded = Math.floor(count / 10) * 10;
  return `${rounded}${suffix}`;
}

/**
 * Safely copies text to the browser clipboard using the modern Clipboard API
 * with a fallback for older browser environments.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (!text) return false;

  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fallback if permission rejected or unsupported
  }

  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.top = '-9999px';
    textArea.style.left = '-9999px';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch {
    return false;
  }
}
