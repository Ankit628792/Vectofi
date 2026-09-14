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
import { LightweightIconItem } from '../types/worker';
import { CATEGORIES } from './categories';
import {
  generateStaticSvg,
  generateAnimatedSvg,
  generateSvgSprite,
  generateFrameworkCode,
} from '../utils/svgExport';
import { iconWorkerClient } from '../services/iconWorkerClient';
import {
  getSynonymsForToken,
  calculateRelevanceScoreWithSynonyms,
} from '../services/synonyms';

/**
 * Normalized Icon Item implementing lazy-evaluated SVG properties on its prototype.
 * Using class prototype getters reduces memory usage and avoids Object.defineProperty overhead.
 * Supports on-demand path body hydration without blocking rendering.
 */
class NormalizedIcon implements IconItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  tags: string[];
  style: IconStyle;
  viewBox: string;
  hasAnimation: boolean;
  animationType: any;
  license: string;
  popularity: number;
  featured: boolean;
  author: string;
  isNew: boolean;

  private _body?: string;
  private _staticSvg?: string;
  private _animatedSvg?: string;
  private _isResolving = false;

  constructor(def: IconDefinition | LightweightIconItem) {
    this.id = def.id;
    this.name = def.name;
    this.slug = def.slug;
    this.category = def.category;
    this.tags = Array.isArray(def.tags) ? def.tags : [];
    this.style = def.style ?? 'outline';
    this.viewBox = def.viewBox ?? '0 0 24 24';
    this.hasAnimation = Boolean(def.hasAnimation ?? (def.animationType !== undefined));
    this.animationType = def.animationType ?? 'pulse';
    this.license = def.license ?? 'MIT';
    this.popularity = def.popularity ?? 50;
    this.featured = def.featured ?? false;
    this.author = def.author ?? 'Vectofi Core';
    this.isNew = def.isNew ?? false;

    // If body was provided up front (e.g. core icons)
    if ('body' in def && def.body) {
      this._body = def.body;
      iconWorkerClient.setCachedBody(this.slug, def.body);
    }
  }

  get body(): string {
    if (this._body) {
      return this._body;
    }

    // Check worker client cache
    const cached = iconWorkerClient.getCachedBody(this.slug);
    if (cached) {
      this._body = cached;
      return cached;
    }

    // Auto-trigger lazy resolution in background if not already in flight
    if (!this._isResolving && typeof window !== 'undefined') {
      this._isResolving = true;
      iconWorkerClient.requestPathBody(this.slug, body => {
        this._body = body;
        this._staticSvg = undefined;
        this._animatedSvg = undefined;
        this._isResolving = false;
      }).catch(() => {
        this._isResolving = false;
      });
    }

    return '';
  }

  set body(value: string) {
    this._body = value;
    this._staticSvg = undefined;
    this._animatedSvg = undefined;
    if (value) {
      iconWorkerClient.setCachedBody(this.slug, value);
    }
  }

  public setBodyDirect(value: string): void {
    this._body = value;
    this._staticSvg = undefined;
    this._animatedSvg = undefined;
    if (value) {
      iconWorkerClient.setCachedBody(this.slug, value);
    }
  }

  public hasResolvedBody(): boolean {
    return Boolean(this._body || iconWorkerClient.getCachedBody(this.slug));
  }

  get staticSvg(): string {
    if (!this._staticSvg) {
      this._staticSvg = generateStaticSvg(this);
    }
    return this._staticSvg;
  }

  get animatedSvg(): string {
    if (!this._animatedSvg) {
      this._animatedSvg = this.hasAnimation ? generateAnimatedSvg(this) : this.staticSvg;
    }
    return this._animatedSvg;
  }
}

function normalizeIcon(def: IconDefinition | LightweightIconItem): NormalizedIcon {
  return new NormalizedIcon(def);
}

/**
 * Scalable Centralized Icon Registry Architecture
 * Provides indexed O(1) lookups, multi-token fuzzy/scoring search, categorization,
 * batch export, Web Worker off-thread filtering, and on-demand path lazy loading.
 */
export class IconRegistry {
  private iconsById: Map<string, NormalizedIcon> = new Map();
  private iconsBySlug: Map<string, NormalizedIcon> = new Map();
  private iconsByCategory: Map<string, NormalizedIcon[]> = new Map();
  private iconsByTag: Map<string, Set<string>> = new Map();
  private iconsByStyle: Map<IconStyle, NormalizedIcon[]> = new Map();
  private allIcons: NormalizedIcon[] = [];
  private categoriesMap: Map<string, CategoryMeta> = new Map();
  private listeners: Set<(icons: IconItem[]) => void> = new Set();
  private bodyListeners = new Map<string, Set<(body: string) => void>>();

  constructor(initialIcons: IconDefinition[] = [], categories: CategoryMeta[] = CATEGORIES) {
    // Initialize categories
    categories.forEach(cat => this.categoriesMap.set(cat.id, cat));

    // Register initial core icons
    if (initialIcons.length > 0) {
      this.registerBatch(initialIcons);
    }
  }

  /**
   * Subscribes to registry updates when new icon batches are loaded
   */
  public subscribe(listener: (icons: IconItem[]) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(cb => {
      try {
        cb(this.allIcons);
      } catch {
        // ignore listener errors
      }
    });
  }

  /**
   * Registers a new icon into the centralized registry and updates indexes
   */
  public register(def: IconDefinition | LightweightIconItem): IconItem {
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
    this.notifyListeners();

    return item;
  }

  /**
   * Registers a batch of icons efficiently without memory bloat
   */
  public registerBatch(definitions: (IconDefinition | LightweightIconItem)[]): void {
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
    this.notifyListeners();
  }

  /**
   * Resolves SVG path bodies for a batch of icons asynchronously
   */
  public async resolveBodies(slugs: string[]): Promise<void> {
    const missingSlugs = slugs.filter(s => {
      const item = this.iconsBySlug.get(s);
      return item && !item.hasResolvedBody();
    });

    if (missingSlugs.length === 0) return;

    try {
      const resolved = await iconWorkerClient.resolveBatchPaths(missingSlugs);
      Object.entries(resolved).forEach(([slug, body]) => {
        const item = this.iconsBySlug.get(slug);
        if (item) {
          item.setBodyDirect(body);
        }
        const listeners = this.bodyListeners.get(slug);
        if (listeners) {
          listeners.forEach(cb => cb(body));
        }
      });
    } catch (err) {
      console.warn('Failed to resolve bodies batch:', err);
    }
  }

  /**
   * Resolves a single icon's path body and returns the full IconItem
   */
  public async resolveIcon(slug: string): Promise<IconItem | undefined> {
    const item = this.iconsBySlug.get(slug);
    if (!item) return undefined;

    if (item.hasResolvedBody()) {
      return item;
    }

    try {
      const body = await iconWorkerClient.requestPathBody(slug);
      if (body) {
        item.setBodyDirect(body);
      }
      return item;
    } catch {
      return item;
    }
  }

  /**
   * Request body for a specific slug with callback
   */
  public requestBody(slug: string, callback?: (body: string) => void): void {
    const item = this.iconsBySlug.get(slug);
    if (item && item.hasResolvedBody()) {
      if (callback) callback(item.body);
      return;
    }

    if (callback) {
      let listeners = this.bodyListeners.get(slug);
      if (!listeners) {
        listeners = new Set();
        this.bodyListeners.set(slug, listeners);
      }
      listeners.add(callback);
    }

    iconWorkerClient.requestPathBody(slug, body => {
      if (item) {
        item.setBodyDirect(body);
      }
      const listeners = this.bodyListeners.get(slug);
      if (listeners) {
        listeners.forEach(cb => cb(body));
        this.bodyListeners.delete(slug);
      }
    });
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
      .filter((i): i is NormalizedIcon => Boolean(i));
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
   * Multi-token search algorithm with bidirectional synonym expansion
   */
  public search(filters: FilterState): IconItem[] {
    const q = filters.query.trim().toLowerCase();
    const tokens = q.split(/\s+/).filter(Boolean);

    // Pre-expand tokens with their synonym variants
    const tokenSynonymMap = tokens.map(token => {
      const synonyms = getSynonymsForToken(token);
      return [token, ...synonyms];
    });

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

      // Query match with synonym expansion
      if (tokenSynonymMap.length > 0) {
        const nameLower = icon.name.toLowerCase();
        const slugLower = icon.slug.toLowerCase();
        const catLower = icon.category.toLowerCase();
        const tagsLower = icon.tags.map(t => t.toLowerCase());

        for (let i = 0; i < tokenSynonymMap.length; i++) {
          const variants = tokenSynonymMap[i];
          let tokenMatched = false;

          for (let j = 0; j < variants.length; j++) {
            const variant = variants[j];
            if (
              nameLower.includes(variant) ||
              slugLower.includes(variant) ||
              catLower.includes(variant) ||
              tagsLower.some(t => t.includes(variant))
            ) {
              tokenMatched = true;
              break;
            }
          }

          if (!tokenMatched) return false;
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
   * Calculates a relevance score for a given query against an icon using synonym metrics
   */
  private calculateSearchScore(icon: IconItem, query: string): number {
    const result = calculateRelevanceScoreWithSynonyms(
      icon.slug,
      icon.name,
      icon.category,
      icon.tags,
      query
    );
    return result.score;
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
  public async generateSpriteSheet(slugs?: string[]): Promise<string> {
    if (iconWorkerClient.isWorkerAvailable()) {
      try {
        return await iconWorkerClient.generateSpriteSheet(slugs);
      } catch {
        // Fallback to local
      }
    }

    const targetIcons = slugs
      ? slugs.map(s => this.iconsBySlug.get(s)).filter((i): i is NormalizedIcon => Boolean(i))
      : this.allIcons;

    // Ensure all target icons have bodies loaded
    await this.resolveBodies(targetIcons.map(i => i.slug));

    return generateSvgSprite(targetIcons);
  }

  /**
   * Exports multiple icons into code snippets for a given framework
   */
  public async exportBatch(
    slugs: string[],
    framework: FrameworkType
  ): Promise<Record<string, string>> {
    await this.resolveBodies(slugs);

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

