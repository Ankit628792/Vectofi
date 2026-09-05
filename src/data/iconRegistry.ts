import {
  IconItem,
  IconDefinition,
  IconStyle,
  FilterState,
  FilterOptions,
  CategoryMeta,
  RegistryStats,
  FrameworkType,
} from '../types';
import { CATEGORIES } from './categories';
import {
  generateStaticSvg,
  generateAnimatedSvg,
  generateSvgSprite,
  generateFrameworkCode,
} from '../utils/svgExport';

/**
 * Normalizes an IconDefinition into a complete IconItem with standalone SVG strings
 */
function normalizeIcon(def: IconDefinition): IconItem {
  const hasAnimation = Boolean(def.hasAnimation ?? (def.animationType !== undefined));
  const style = def.style ?? 'outline';
  const license = def.license ?? 'MIT';
  const viewBox = def.viewBox ?? '0 0 24 24';

  const baseItem = {
    id: def.id,
    name: def.name,
    slug: def.slug,
    category: def.category,
    tags: Array.isArray(def.tags) ? def.tags : [],
    style,
    viewBox,
    body: def.body,
    hasAnimation,
    animationType: def.animationType ?? 'pulse',
    license,
    popularity: def.popularity ?? 50,
    featured: def.featured ?? false,
    author: def.author ?? 'Vectofi Core',
    isNew: def.isNew ?? false,
  };

  const staticSvg = def.staticSvg || generateStaticSvg(baseItem);
  const animatedSvg = def.animatedSvg || (hasAnimation ? generateAnimatedSvg(baseItem) : staticSvg);

  return {
    ...baseItem,
    staticSvg,
    animatedSvg,
  };
}

/**
 * Scalable Centralized Icon Registry Architecture (Phase 3)
 * Provides indexed O(1) lookups, multi-token fuzzy/scoring search, categorization,
 * batch export, and dynamic registration for thousands of icons.
 */
export class IconRegistry {
  private iconsById: Map<string, IconItem> = new Map();
  private iconsBySlug: Map<string, IconItem> = new Map();
  private iconsByCategory: Map<string, IconItem[]> = new Map();
  private iconsByTag: Map<string, Set<string>> = new Map();
  private iconsByStyle: Map<IconStyle, IconItem[]> = new Map();
  private allIcons: IconItem[] = [];
  private categoriesMap: Map<string, CategoryMeta> = new Map();

  constructor(initialIcons: IconDefinition[] = [], categories: CategoryMeta[] = CATEGORIES) {
    // Initialize categories
    categories.forEach(cat => this.categoriesMap.set(cat.id, cat));
    
    // Register initial icons
    if (initialIcons.length > 0) {
      this.registerBatch(initialIcons);
    }
  }

  /**
   * Registers a new icon into the centralized registry and updates indexes
   */
  public register(def: IconDefinition): IconItem {
    const item = normalizeIcon(def);

    this.iconsById.set(item.id, item);
    this.iconsBySlug.set(item.slug, item);

    // Category index
    const catList = this.iconsByCategory.get(item.category) || [];
    catList.push(item);
    this.iconsByCategory.set(item.category, catList);

    // Style index
    const styleList = this.iconsByStyle.get(item.style) || [];
    styleList.push(item);
    this.iconsByStyle.set(item.style, styleList);

    // Tag index
    item.tags.forEach(t => {
      const tagLower = t.toLowerCase();
      let slugSet = this.iconsByTag.get(tagLower);
      if (!slugSet) {
        slugSet = new Set();
        this.iconsByTag.set(tagLower, slugSet);
      }
      slugSet.add(item.slug);
    });

    // Update flat array
    this.allIcons = Array.from(this.iconsBySlug.values());

    return item;
  }

  /**
   * Registers a batch of icons efficiently
   */
  public registerBatch(definitions: IconDefinition[]): void {
    definitions.forEach(def => {
      const item = normalizeIcon(def);
      this.iconsById.set(item.id, item);
      this.iconsBySlug.set(item.slug, item);

      // Category
      const catList = this.iconsByCategory.get(item.category) || [];
      catList.push(item);
      this.iconsByCategory.set(item.category, catList);

      // Style
      const styleList = this.iconsByStyle.get(item.style) || [];
      styleList.push(item);
      this.iconsByStyle.set(item.style, styleList);

      // Tags
      item.tags.forEach(t => {
        const tagLower = t.toLowerCase();
        let slugSet = this.iconsByTag.get(tagLower);
        if (!slugSet) {
          slugSet = new Set();
          this.iconsByTag.set(tagLower, slugSet);
        }
        slugSet.add(item.slug);
      });
    });

    this.allIcons = Array.from(this.iconsBySlug.values());
  }

  /**
   * Returns all registered icons
   */
  public getAll(): IconItem[] {
    return this.allIcons;
  }

  /**
   * Total count of registered icons
   */
  public getCount(): number {
    return this.allIcons.length;
  }

  /**
   * Retrieves an icon by unique ID in O(1)
   */
  public getById(id: string): IconItem | undefined {
    return this.iconsById.get(id);
  }

  /**
   * Retrieves an icon by slug in O(1)
   */
  public getBySlug(slug: string): IconItem | undefined {
    return this.iconsBySlug.get(slug);
  }

  /**
   * Retrieves all icons in a category in O(1)
   */
  public getByCategory(category: string): IconItem[] {
    return this.iconsByCategory.get(category) || [];
  }

  /**
   * Retrieves all icons with a given style
   */
  public getByStyle(style: IconStyle): IconItem[] {
    return this.iconsByStyle.get(style) || [];
  }

  /**
   * Retrieves icons matching a specific tag
   */
  public getByTag(tag: string): IconItem[] {
    const slugSet = this.iconsByTag.get(tag.toLowerCase());
    if (!slugSet) return [];
    return Array.from(slugSet)
      .map(slug => this.iconsBySlug.get(slug))
      .filter((i): i is IconItem => Boolean(i));
  }

  /**
   * Retrieves all icons marked with animations
   */
  public getAnimated(): IconItem[] {
    return this.allIcons.filter(i => i.hasAnimation);
  }

  /**
   * Retrieves featured icons
   */
  public getFeatured(limit = 12): IconItem[] {
    return this.allIcons
      .filter(i => i.featured)
      .slice(0, limit);
  }

  /**
   * Multi-token search algorithm with relevance weighting
   */
  public search(filters: FilterState): IconItem[] {
    const q = filters.query.trim().toLowerCase();

    const filtered = this.allIcons.filter(icon => {
      // Category filter
      if (filters.category !== 'all' && icon.category !== filters.category) {
        return false;
      }

      // Style filter
      if (filters.style !== 'all' && icon.style !== filters.style) {
        return false;
      }

      // Animation filter
      if (filters.hasAnimation === 'animated' && !icon.hasAnimation) {
        return false;
      }
      if (filters.hasAnimation === 'static' && icon.hasAnimation) {
        return false;
      }

      // Query match
      if (q) {
        const nameMatch = icon.name.toLowerCase().includes(q);
        const slugMatch = icon.slug.toLowerCase().includes(q);
        const catMatch = icon.category.toLowerCase().includes(q);
        const tagMatch = icon.tags.some(t => t.toLowerCase().includes(q));
        if (!nameMatch && !slugMatch && !catMatch && !tagMatch) {
          return false;
        }
      }

      return true;
    });

    // Score and sort
    return [...filtered].sort((a, b) => {
      if (q) {
        const scoreA = this.calculateSearchScore(a, q);
        const scoreB = this.calculateSearchScore(b, q);
        if (scoreB !== scoreA) {
          return scoreB - scoreA;
        }
      }

      if (filters.sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      if (filters.sortBy === 'popular') {
        return (b.popularity || 50) - (a.popularity || 50);
      }
      if (filters.sortBy === 'newest') {
        return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      }
      return 0;
    });
  }

  /**
   * Flexible query method
   */
  public query(options: FilterOptions = {}): IconItem[] {
    return this.search({
      query: options.search || '',
      category: options.category || 'all',
      style: options.style || 'all',
      hasAnimation: options.animationFilter || 'all',
      sortBy: options.sortBy || 'name',
    });
  }

  /**
   * Calculates a relevance score for a given query against an icon
   */
  private calculateSearchScore(icon: IconItem, query: string): number {
    const slug = icon.slug.toLowerCase();
    const name = icon.name.toLowerCase();

    if (slug === query) return 100;
    if (slug.startsWith(query)) return 75;
    if (name.startsWith(query)) return 60;
    if (name.includes(query)) return 40;
    if (icon.tags.some(t => t.toLowerCase() === query)) return 50;
    if (icon.tags.some(t => t.toLowerCase().startsWith(query))) return 30;
    if (icon.category.toLowerCase() === query) return 20;

    return 10;
  }

  /**
   * Paginates an array of icons
   */
  public paginate(
    items: IconItem[],
    page = 1,
    pageSize = 24
  ): {
    items: IconItem[];
    total: number;
    totalPages: number;
    page: number;
    hasNext: boolean;
    hasPrev: boolean;
  } {
    const validPage = Math.max(1, page);
    const total = items.length;
    const totalPages = Math.ceil(total / pageSize) || 1;
    const startIndex = (validPage - 1) * pageSize;
    const paginatedItems = items.slice(startIndex, startIndex + pageSize);

    return {
      items: paginatedItems,
      total,
      totalPages,
      page: validPage,
      hasNext: validPage < totalPages,
      hasPrev: validPage > 1,
    };
  }

  /**
   * Retrieves enriched categories with live icon counts
   */
  public getCategories(): CategoryMeta[] {
    return Array.from(this.categoriesMap.values()).map(cat => ({
      ...cat,
      iconCount: this.iconsByCategory.get(cat.id)?.length || 0,
    }));
  }

  /**
   * Computes comprehensive registry metadata statistics
   */
  public getStats(): RegistryStats {
    const styles: Record<IconStyle, number> = {
      outline: 0,
      filled: 0,
      duotone: 0,
      rounded: 0,
    };

    let animatedCount = 0;
    const uniqueTags = new Set<string>();

    this.allIcons.forEach(icon => {
      styles[icon.style] = (styles[icon.style] || 0) + 1;
      if (icon.hasAnimation) animatedCount++;
      icon.tags.forEach(t => uniqueTags.add(t.toLowerCase()));
    });

    return {
      totalIcons: this.allIcons.length,
      animatedIcons: animatedCount,
      categoriesCount: this.categoriesMap.size,
      totalTags: uniqueTags.size,
      styles,
    };
  }

  /**
   * Generates an SVG sprite sheet containing all or selected icons
   */
  public generateSpriteSheet(slugs?: string[]): string {
    const targetIcons = slugs
      ? slugs.map(s => this.iconsBySlug.get(s)).filter((i): i is IconItem => Boolean(i))
      : this.allIcons;

    return generateSvgSprite(targetIcons);
  }

  /**
   * Exports multiple icons into code snippets for a given framework
   */
  public exportBatch(
    slugs: string[],
    framework: FrameworkType
  ): Record<string, string> {
    const result: Record<string, string> = {};
    slugs.forEach(slug => {
      const icon = this.iconsBySlug.get(slug);
      if (icon) {
        result[slug] = generateFrameworkCode(icon, framework);
      }
    });
    return result;
  }
}
