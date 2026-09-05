export type IconStyle = 'outline' | 'filled' | 'duotone' | 'rounded';

export type AnimationType = 
  | 'draw' 
  | 'pulse' 
  | 'bounce' 
  | 'spin' 
  | 'shake' 
  | 'slide' 
  | 'morph' 
  | 'float';

export interface IconItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  tags: string[];
  style: IconStyle;
  viewBox?: string;
  /** Raw SVG inner markup (paths, circles, rects) */
  body: string;
  /** Standalone valid SVG string for static export */
  staticSvg: string;
  /** Standalone valid animated SVG string with embedded animation rules */
  animatedSvg: string;
  animationType?: AnimationType;
  hasAnimation: boolean;
  license: string;
  popularity?: number;
  featured?: boolean;
  author?: string;
  isNew?: boolean;
}

/** Definition used to register or seed an icon into the centralized registry */
export interface IconDefinition {
  id: string;
  name: string;
  slug: string;
  category: string;
  tags: string[];
  style?: IconStyle;
  viewBox?: string;
  body: string;
  staticSvg?: string;
  animatedSvg?: string;
  hasAnimation?: boolean;
  animationType?: AnimationType;
  license?: string;
  popularity?: number;
  featured?: boolean;
  author?: string;
  isNew?: boolean;
}

export type IconCategory = string;

export interface CategoryMeta {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconSymbol: string;
  colorAccent: string;
  iconCount?: number;
}

export interface CollectionItem {
  id: string;
  name: string;
  description?: string;
  iconSlugs: string[];
  createdAt: string | number;
  isCurated?: boolean;
}

export interface FilterState {
  query: string;
  category: string;
  style: string;
  hasAnimation: 'all' | 'static' | 'animated';
  sortBy: 'name' | 'popular' | 'newest';
}

export type FrameworkType = 'svg' | 'html' | 'react' | 'vue' | 'svelte' | 'angular' | 'css';

export interface LaboratorySettings {
  size: number;
  color: string;
  strokeWidth: number;
  background: 'transparent' | 'light' | 'dark' | 'checkerboard' | 'custom';
  customBgColor: string;
  animated: boolean;
  speed: number;
  loop: boolean;
  isPlaying: boolean;
}

export interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  type?: 'success' | 'info' | 'favorite' | 'download';
}

export interface FilterOptions {
  search?: string;
  category?: string;
  style?: string;
  animationFilter?: 'all' | 'static' | 'animated';
  sortBy?: 'name' | 'popular' | 'newest';
}

export interface RegistryStats {
  totalIcons: number;
  animatedIcons: number;
  categoriesCount: number;
  totalTags: number;
  styles: Record<IconStyle, number>;
}
