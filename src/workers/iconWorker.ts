import { FilterState, IconStyle, AnimationType, RegistryStats } from '../types';
import {
  LightweightIconItem,
  WorkerRequestMessage,
  WorkerResponseMessage,
} from '../types/worker';
import {
  getSynonymsForToken,
  calculateRelevanceScoreWithSynonyms,
} from '../services/synonyms';

// In-worker storage structures
const pathsBySlug = new Map<string, string>();
const itemsBySlug = new Map<string, LightweightIconItem>();
const itemsById = new Map<string, LightweightIconItem>();
const itemsByCategory = new Map<string, LightweightIconItem[]>();
const itemsByTag = new Map<string, Set<string>>();
let allItems: LightweightIconItem[] = [];

let isCatalogInitialized = false;
let initPromise: Promise<void> | null = null;

/**
 * Calculates a search relevance score for a given query against an icon,
 * taking into account exact matches, prefixes, tags, and synonym mappings.
 */
function calculateSearchScore(icon: LightweightIconItem, query: string): number {
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
 * Performs high-speed multi-token fuzzy search and filtering in the worker
 * with full bidirectional synonym expansion (e.g. searching 'delete' finds 'trash').
 */
function executeSearchFilter(filters: FilterState, limit?: number): { results: LightweightIconItem[]; total: number } {
  const q = (filters.query || '').trim().toLowerCase();
  const tokens = q.split(/\s+/).filter(Boolean);

  // Pre-expand tokens with their synonym variants
  const tokenSynonymMap = tokens.map(token => {
    const synonyms = getSynonymsForToken(token);
    return [token, ...synonyms];
  });

  const filtered = allItems.filter(icon => {
    // Category filter
    if (filters.category && filters.category !== 'all' && icon.category !== filters.category) {
      return false;
    }

    // Style filter
    if (filters.style && filters.style !== 'all' && icon.style !== filters.style) {
      return false;
    }

    // Animation filter
    if (filters.hasAnimation === 'animated' && !icon.hasAnimation) {
      return false;
    }
    if (filters.hasAnimation === 'static' && icon.hasAnimation) {
      return false;
    }

    // Multi-token query match with synonym fallback
    if (tokenSynonymMap.length > 0) {
      const nameLower = icon.name.toLowerCase();
      const slugLower = icon.slug.toLowerCase();
      const catLower = icon.category.toLowerCase();
      const tagsLower = icon.tags.map(t => t.toLowerCase());

      // All user tokens must match either directly or through a synonym
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

        if (!tokenMatched) {
          return false;
        }
      }
    }

    return true;
  });

  // Score and sort
  const sorted = [...filtered].sort((a, b) => {
    if (q) {
      const scoreA = calculateSearchScore(a, q);
      const scoreB = calculateSearchScore(b, q);
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

  const total = sorted.length;
  const results = limit ? sorted.slice(0, limit) : sorted;

  return { results, total };
}

/**
 * Registers an icon batch into worker indexes and path storage
 */
function registerBatchInWorker(
  icons: [string, string, string, string[], string, AnimationType][],
  idPrefix: string,
  styleDefault: IconStyle,
  author: string,
  license: string,
  onBatchItem?: (item: LightweightIconItem) => void
): LightweightIconItem[] {
  const batchLightweight: LightweightIconItem[] = [];

  for (let idx = 0; idx < icons.length; idx++) {
    const [slug, name, category, tags, body, animationType] = icons[idx];
    const id = `${idPrefix}-${slug}`;
    const style: IconStyle =
      slug.endsWith('-fill') || slug.endsWith('-filled')
        ? 'filled'
        : slug.endsWith('-outline')
        ? 'outline'
        : styleDefault;

    // Store the SVG path body in the worker's dedicated path storage
    pathsBySlug.set(slug, body);

    const lightweightItem: LightweightIconItem = {
      id,
      name,
      slug,
      category,
      tags: Array.isArray(tags) ? tags : [],
      style,
      viewBox: '0 0 24 24',
      hasAnimation: true,
      animationType: animationType || 'pulse',
      license,
      popularity: 50 + (idx % 45),
      featured: idx % 120 === 0,
      author,
      isNew: true,
    };

    itemsById.set(id, lightweightItem);
    itemsBySlug.set(slug, lightweightItem);

    // Category index
    let catList = itemsByCategory.get(category);
    if (!catList) {
      catList = [];
      itemsByCategory.set(category, catList);
    }
    catList.push(lightweightItem);

    // Tag index
    lightweightItem.tags.forEach(t => {
      const tagLower = t.toLowerCase();
      let slugSet = itemsByTag.get(tagLower);
      if (!slugSet) {
        slugSet = new Set();
        itemsByTag.set(tagLower, slugSet);
      }
      slugSet.add(slug);
    });

    batchLightweight.push(lightweightItem);
    if (onBatchItem) {
      onBatchItem(lightweightItem);
    }
  }

  return batchLightweight;
}

/**
 * Loads and indexes all extended icon packs inside the Web Worker
 */
async function loadCatalogInWorker(msgId: string): Promise<void> {
  if (isCatalogInitialized) {
    self.postMessage({
      type: 'CATALOG_COMPLETE',
      id: msgId,
      payload: { totalCount: allItems.length },
    } as WorkerResponseMessage);
    return;
  }

  if (initPromise) {
    return initPromise;
  }

  initPromise = (async () => {
    try {
      // Pack 1: Tabler Expanded Icons (~5,130 icons)
      self.postMessage({
        type: 'PROGRESS',
        id: msgId,
        payload: {
          loadedCount: allItems.length,
          totalEstimated: 17049,
          currentPack: 'Tabler Vector Pack',
          isComplete: false,
        },
      } as WorkerResponseMessage);

      const expandedModule = await import('../data/expandedIcons.json');
      const expandedRaw = expandedModule.default as [string, string, string, string[], string, AnimationType][];
      const tablerItems = registerBatchInWorker(
        expandedRaw,
        'tb',
        'outline',
        'Tabler & Vectofi',
        'MIT'
      );
      allItems = Array.from(itemsBySlug.values());

      self.postMessage({
        type: 'BATCH_READY',
        id: msgId,
        payload: {
          packName: 'Tabler Vector Pack',
          icons: tablerItems,
          totalCount: allItems.length,
        },
      } as WorkerResponseMessage);

      // Pack 2: Remix Icons (~3,229 icons)
      self.postMessage({
        type: 'PROGRESS',
        id: msgId,
        payload: {
          loadedCount: allItems.length,
          totalEstimated: 17049,
          currentPack: 'Remix Vector Pack',
          isComplete: false,
        },
      } as WorkerResponseMessage);

      const remixModule = await import('../data/remixIcons.json');
      const remixRaw = remixModule.default as [string, string, string, string[], string, AnimationType][];
      const remixItems = registerBatchInWorker(
        remixRaw,
        'ri',
        'outline',
        'Remix & Vectofi',
        'Apache-2.0'
      );
      allItems = Array.from(itemsBySlug.values());

      self.postMessage({
        type: 'BATCH_READY',
        id: msgId,
        payload: {
          packName: 'Remix Vector Pack',
          icons: remixItems,
          totalCount: allItems.length,
        },
      } as WorkerResponseMessage);

      // Pack 3: Material Design Icons (~7,638 icons)
      self.postMessage({
        type: 'PROGRESS',
        id: msgId,
        payload: {
          loadedCount: allItems.length,
          totalEstimated: 17049,
          currentPack: 'Material Vector Pack',
          isComplete: false,
        },
      } as WorkerResponseMessage);

      const materialModule = await import('../data/materialIcons.json');
      const materialRaw = materialModule.default as [string, string, string, string[], string, AnimationType][];
      const materialItems = registerBatchInWorker(
        materialRaw,
        'mdi',
        'filled',
        'Material & Vectofi',
        'Apache-2.0'
      );
      allItems = Array.from(itemsBySlug.values());

      self.postMessage({
        type: 'BATCH_READY',
        id: msgId,
        payload: {
          packName: 'Material Vector Pack',
          icons: materialItems,
          totalCount: allItems.length,
        },
      } as WorkerResponseMessage);

      isCatalogInitialized = true;

      self.postMessage({
        type: 'PROGRESS',
        id: msgId,
        payload: {
          loadedCount: allItems.length,
          totalEstimated: allItems.length,
          currentPack: 'Complete Library Ready',
          isComplete: true,
        },
      } as WorkerResponseMessage);

      self.postMessage({
        type: 'CATALOG_COMPLETE',
        id: msgId,
        payload: { totalCount: allItems.length },
      } as WorkerResponseMessage);
    } catch (err: any) {
      self.postMessage({
        type: 'ERROR',
        id: msgId,
        error: err?.message || 'Failed to initialize catalog in worker',
      } as WorkerResponseMessage);
    }
  })();

  return initPromise;
}

/**
 * Message dispatcher
 */
self.onmessage = async (event: MessageEvent<WorkerRequestMessage>) => {
  const msg = event.data;
  if (!msg || !msg.type) return;

  try {
    switch (msg.type) {
      case 'INIT_CATALOG': {
        await loadCatalogInWorker(msg.id);
        break;
      }

      case 'SEARCH_FILTER': {
        const { filters, limit } = msg.payload;
        const result = executeSearchFilter(filters, limit);
        self.postMessage({
          type: 'SEARCH_FILTER_RESULT',
          id: msg.id,
          payload: result,
        } as WorkerResponseMessage);
        break;
      }

      case 'RESOLVE_PATHS': {
        const { slugs } = msg.payload;
        const paths: Record<string, string> = {};
        for (let i = 0; i < slugs.length; i++) {
          const slug = slugs[i];
          const body = pathsBySlug.get(slug);
          if (body) {
            paths[slug] = body;
          }
        }
        self.postMessage({
          type: 'PATHS_RESOLVED',
          id: msg.id,
          payload: { paths },
        } as WorkerResponseMessage);
        break;
      }

      case 'RESOLVE_ICON': {
        const { slug } = msg.payload;
        const item = itemsBySlug.get(slug);
        const body = pathsBySlug.get(slug) || '';
        if (item) {
          self.postMessage({
            type: 'ICON_RESOLVED',
            id: msg.id,
            payload: {
              icon: {
                ...item,
                body,
              },
            },
          } as WorkerResponseMessage);
        } else {
          self.postMessage({
            type: 'ERROR',
            id: msg.id,
            error: `Icon not found: ${slug}`,
          } as WorkerResponseMessage);
        }
        break;
      }

      case 'GET_STATS': {
        const styles: Record<IconStyle, number> = {
          outline: 0,
          filled: 0,
          duotone: 0,
          rounded: 0,
        };
        let animatedCount = 0;
        const uniqueTags = new Set<string>();

        allItems.forEach(icon => {
          styles[icon.style] = (styles[icon.style] || 0) + 1;
          if (icon.hasAnimation) animatedCount++;
          icon.tags.forEach(t => uniqueTags.add(t.toLowerCase()));
        });

        const stats: RegistryStats = {
          totalIcons: allItems.length,
          animatedIcons: animatedCount,
          categoriesCount: itemsByCategory.size,
          totalTags: uniqueTags.size,
          styles,
        };

        self.postMessage({
          type: 'STATS_RESULT',
          id: msg.id,
          payload: stats,
        } as WorkerResponseMessage);
        break;
      }

      case 'GENERATE_SPRITE': {
        const { slugs } = msg.payload;
        const targetSlugs = slugs && slugs.length > 0 ? slugs : Array.from(itemsBySlug.keys());
        
        const symbols: string[] = [];
        for (const s of targetSlugs) {
          const item = itemsBySlug.get(s);
          const body = pathsBySlug.get(s);
          if (item && body) {
            symbols.push(
              `<symbol id="icon-${item.slug}" viewBox="${item.viewBox || '0 0 24 24'}">\n  ${body}\n</symbol>`
            );
          }
        }

        const svg = `<svg xmlns="http://www.w3.org/2000/svg" style="display: none;">\n  <defs>\n${symbols
          .map(s => '    ' + s)
          .join('\n')}\n  </defs>\n</svg>`;

        self.postMessage({
          type: 'SPRITE_RESULT',
          id: msg.id,
          payload: { svg },
        } as WorkerResponseMessage);
        break;
      }

      default:
        break;
    }
  } catch (err: any) {
    self.postMessage({
      type: 'ERROR',
      id: msg.id,
      error: err?.message || 'Worker processing error',
    } as WorkerResponseMessage);
  }
};
