import { IconItem, IconDefinition, AnimationType } from '../types';
import { IconRegistry } from './iconRegistry';
import { iconWorkerClient } from '../services/iconWorkerClient';
import { ARROWS_ICONS } from './icons/arrows';
import { NAVIGATION_ICONS } from './icons/navigation';
import { INTERFACE_ICONS } from './icons/interface';
import { COMMUNICATION_ICONS } from './icons/communication';
import { SOCIAL_ICONS } from './icons/social';
import { FILES_ICONS } from './icons/files';
import { MEDIA_ICONS } from './icons/media';
import { COMMERCE_ICONS } from './icons/commerce';
import { SECURITY_ICONS } from './icons/security';
import { USERS_ICONS } from './icons/users';
import { WEATHER_ICONS } from './icons/weather';
import { DEVICES_ICONS } from './icons/devices';
import { DEVELOPMENT_ICONS } from './icons/development';
import { BUSINESS_ICONS } from './icons/business';
import { DESIGN_ICONS } from './icons/design';
import { EDITOR_ICONS } from './icons/editor';
import { TRAVEL_ICONS } from './icons/travel';
import { HEALTH_ICONS } from './icons/health';
import { FOOD_ICONS } from './icons/food';
import { SPORTS_ICONS } from './icons/sports';

/**
 * Core curated definitions available synchronously on initial boot.
 * Provides instant interactivity, lightweight initial bundle,
 * and zero render-blocking delay across all 20 categories.
 */
export const CORE_ICONS_DEFINITIONS: IconDefinition[] = [
  ...ARROWS_ICONS,
  ...NAVIGATION_ICONS,
  ...INTERFACE_ICONS,
  ...COMMUNICATION_ICONS,
  ...SOCIAL_ICONS,
  ...FILES_ICONS,
  ...MEDIA_ICONS,
  ...COMMERCE_ICONS,
  ...SECURITY_ICONS,
  ...USERS_ICONS,
  ...WEATHER_ICONS,
  ...DEVICES_ICONS,
  ...DEVELOPMENT_ICONS,
  ...BUSINESS_ICONS,
  ...DESIGN_ICONS,
  ...EDITOR_ICONS,
  ...TRAVEL_ICONS,
  ...HEALTH_ICONS,
  ...FOOD_ICONS,
  ...SPORTS_ICONS,
];

export const ICONS_DEFINITIONS = CORE_ICONS_DEFINITIONS;

// Initialize centralized registry with core icons
export const iconRegistry = new IconRegistry(CORE_ICONS_DEFINITIONS);

export let ICONS: IconItem[] = iconRegistry.getAll();
export let ICONS_DATA: IconItem[] = ICONS;

iconRegistry.subscribe(updated => {
  ICONS = updated;
  ICONS_DATA = updated;
});

export interface CatalogLoadingProgress {
  loadedCount: number;
  totalEstimated: number;
  currentPack: string;
  isComplete: boolean;
}

let catalogLoadingPromise: Promise<void> | null = null;
let currentProgress: CatalogLoadingProgress = {
  loadedCount: CORE_ICONS_DEFINITIONS.length,
  totalEstimated: 17049,
  currentPack: 'Core Curated',
  isComplete: false,
};

const progressListeners = new Set<(progress: CatalogLoadingProgress) => void>();

export function subscribeCatalogProgress(
  listener: (progress: CatalogLoadingProgress) => void
): () => void {
  progressListeners.add(listener);
  listener(currentProgress);
  return () => {
    progressListeners.delete(listener);
  };
}

function updateProgress(progress: CatalogLoadingProgress): void {
  currentProgress = progress;
  progressListeners.forEach(cb => {
    try {
      cb(currentProgress);
    } catch {
      // ignore
    }
  });
}

/**
 * Loads extended icon packs via dedicated Web Worker off the main thread.
 * Ensures 60+ FPS UI responsiveness, lightweight main thread heap,
 * and background non-blocking parsing of 17,000+ vector assets.
 */
export async function loadExtendedIconLibrary(): Promise<void> {
  if (catalogLoadingPromise) {
    return catalogLoadingPromise;
  }

  catalogLoadingPromise = (async () => {
    try {
      if (iconWorkerClient.isWorkerAvailable()) {
        await iconWorkerClient.initCatalog(
          progress => {
            updateProgress({
              loadedCount: Math.max(progress.loadedCount, CORE_ICONS_DEFINITIONS.length),
              totalEstimated: progress.totalEstimated,
              currentPack: progress.currentPack,
              isComplete: progress.isComplete,
            });
          },
          batch => {
            // Register lightweight descriptors into registry without copying full path strings
            iconRegistry.registerBatch(batch.icons);
          }
        );

        updateProgress({
          loadedCount: iconRegistry.getCount(),
          totalEstimated: iconRegistry.getCount(),
          currentPack: 'Complete Library Ready',
          isComplete: true,
        });
      } else {
        // Fallback for environments where Web Workers are disabled
        await loadExtendedLibraryFallback();
      }
    } catch (err) {
      console.warn('Worker catalog load failed, falling back to local thread:', err);
      await loadExtendedLibraryFallback();
    }
  })();

  return catalogLoadingPromise;
}

/**
 * Fallback loader if Web Workers are unavailable
 */
async function loadExtendedLibraryFallback(): Promise<void> {
  try {
    updateProgress({
      loadedCount: iconRegistry.getCount(),
      totalEstimated: 17049,
      currentPack: 'Tabler Vector Pack',
      isComplete: false,
    });

    const expandedModule = await import('./expandedIcons.json');
    const expandedRaw = expandedModule.default as [string, string, string, string[], string, AnimationType][];
    const expandedIcons: IconDefinition[] = expandedRaw.map(
      ([slug, name, category, tags, body, animationType], idx) => ({
        id: `tb-${slug}`,
        name,
        slug,
        category,
        tags,
        style: 'outline',
        body,
        hasAnimation: true,
        animationType: animationType as AnimationType,
        license: 'MIT',
        popularity: 50 + (idx % 45),
        featured: idx % 100 === 0,
        author: 'Tabler & Vectofi',
        isNew: true,
      })
    );
    iconRegistry.registerBatch(expandedIcons);

    updateProgress({
      loadedCount: iconRegistry.getCount(),
      totalEstimated: 17049,
      currentPack: 'Remix Vector Pack',
      isComplete: false,
    });

    const remixModule = await import('./remixIcons.json');
    const remixRaw = remixModule.default as [string, string, string, string[], string, AnimationType][];
    const remixIcons: IconDefinition[] = remixRaw.map(
      ([slug, name, category, tags, body, animationType], idx) => ({
        id: `ri-${slug}`,
        name,
        slug,
        category,
        tags,
        style: slug.endsWith('-fill') ? 'filled' : 'outline',
        body,
        hasAnimation: true,
        animationType: animationType as AnimationType,
        license: 'Apache-2.0',
        popularity: 50 + (idx % 45),
        featured: idx % 120 === 0,
        author: 'Remix & Vectofi',
        isNew: true,
      })
    );
    iconRegistry.registerBatch(remixIcons);

    updateProgress({
      loadedCount: iconRegistry.getCount(),
      totalEstimated: 17049,
      currentPack: 'Material Vector Pack',
      isComplete: false,
    });

    const materialModule = await import('./materialIcons.json');
    const materialRaw = materialModule.default as [string, string, string, string[], string, AnimationType][];
    const materialIcons: IconDefinition[] = materialRaw.map(
      ([slug, name, category, tags, body, animationType], idx) => ({
        id: `mdi-${slug}`,
        name,
        slug,
        category,
        tags,
        style: slug.endsWith('-outline') ? 'outline' : 'filled',
        body,
        hasAnimation: true,
        animationType: animationType as AnimationType,
        license: 'Apache-2.0',
        popularity: 50 + (idx % 45),
        featured: idx % 150 === 0,
        author: 'Material & Vectofi',
        isNew: true,
      })
    );
    iconRegistry.registerBatch(materialIcons);

    updateProgress({
      loadedCount: iconRegistry.getCount(),
      totalEstimated: iconRegistry.getCount(),
      currentPack: 'Complete Library Ready',
      isComplete: true,
    });
  } catch (err) {
    console.error('Fallback icon library loading failed:', err);
  }
}
