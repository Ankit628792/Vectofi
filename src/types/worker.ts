import { IconStyle, AnimationType, FilterState, RegistryStats } from '../types';

/**
 * Lightweight Icon Descriptor sent across the Web Worker boundary.
 * Omits heavy SVG path body strings from the initial payload to minimize
 * structural clone serialization time, main thread memory consumption, and GC pressure.
 */
export interface LightweightIconItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  tags: string[];
  style: IconStyle;
  viewBox?: string;
  hasAnimation: boolean;
  animationType?: AnimationType;
  license: string;
  popularity?: number;
  featured?: boolean;
  author?: string;
  isNew?: boolean;
  /** Populated when resolved on-demand */
  body?: string;
}

export type WorkerRequestPayload =
  | {
      type: 'INIT_CATALOG';
    }
  | {
      type: 'SEARCH_FILTER';
      payload: {
        filters: FilterState;
        limit?: number;
      };
    }
  | {
      type: 'RESOLVE_PATHS';
      payload: {
        slugs: string[];
      };
    }
  | {
      type: 'RESOLVE_ICON';
      payload: {
        slug: string;
      };
    }
  | {
      type: 'GET_STATS';
    }
  | {
      type: 'GENERATE_SPRITE';
      payload: {
        slugs?: string[];
      };
    };

export type WorkerRequestMessage = WorkerRequestPayload & { id: string };

export type WorkerResponseMessage =
  | {
      type: 'PROGRESS';
      id: string;
      payload: {
        loadedCount: number;
        totalEstimated: number;
        currentPack: string;
        isComplete: boolean;
      };
    }
  | {
      type: 'BATCH_READY';
      id: string;
      payload: {
        packName: string;
        icons: LightweightIconItem[];
        totalCount: number;
      };
    }
  | {
      type: 'CATALOG_COMPLETE';
      id: string;
      payload: {
        totalCount: number;
      };
    }
  | {
      type: 'SEARCH_FILTER_RESULT';
      id: string;
      payload: {
        results: LightweightIconItem[];
        total: number;
      };
    }
  | {
      type: 'PATHS_RESOLVED';
      id: string;
      payload: {
        paths: Record<string, string>;
      };
    }
  | {
      type: 'ICON_RESOLVED';
      id: string;
      payload: {
        icon: LightweightIconItem & { body: string };
      };
    }
  | {
      type: 'STATS_RESULT';
      id: string;
      payload: RegistryStats;
    }
  | {
      type: 'SPRITE_RESULT';
      id: string;
      payload: {
        svg: string;
      };
    }
  | {
      type: 'ERROR';
      id: string;
      error: string;
    };
