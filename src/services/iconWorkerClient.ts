import { FilterState, RegistryStats, IconItem } from '../types';
import {
  LightweightIconItem,
  WorkerRequestPayload,
  WorkerRequestMessage,
  WorkerResponseMessage,
} from '../types/worker';

export interface CatalogProgressCallback {
  (progress: {
    loadedCount: number;
    totalEstimated: number;
    currentPack: string;
    isComplete: boolean;
  }): void;
}

export interface CatalogBatchCallback {
  (batch: {
    packName: string;
    icons: LightweightIconItem[];
    totalCount: number;
  }): void;
}

class IconWorkerClient {
  private worker: Worker | null = null;
  private pendingRequests = new Map<
    string,
    {
      resolve: (data: any) => void;
      reject: (error: Error) => void;
    }
  >();
  private isInitialized = false;
  private isInitializing = false;
  private progressListeners = new Set<CatalogProgressCallback>();
  private batchListeners = new Set<CatalogBatchCallback>();
  private cachedPaths = new Map<string, string>();

  // Batching queue for lazy path resolution
  private pendingPathResolutions = new Set<string>();
  private pathBatchTimer: ReturnType<typeof setTimeout> | null = null;
  private pathCallbacks = new Map<string, Set<(body: string) => void>>();

  constructor() {
    this.initWorker();
  }

  private initWorker(): void {
    if (typeof window === 'undefined' || typeof Worker === 'undefined') {
      return;
    }

    try {
      this.worker = new Worker(
        new URL('../workers/iconWorker.ts', import.meta.url),
        { type: 'module' }
      );

      this.worker.onmessage = (event: MessageEvent<WorkerResponseMessage>) => {
        const msg = event.data;
        if (!msg) return;

        if (msg.type === 'PROGRESS') {
          this.progressListeners.forEach(cb => {
            try {
              cb(msg.payload);
            } catch {
              // ignore
            }
          });
          return;
        }

        if (msg.type === 'BATCH_READY') {
          this.batchListeners.forEach(cb => {
            try {
              cb(msg.payload);
            } catch {
              // ignore
            }
          });
          return;
        }

        if (msg.type === 'PATHS_RESOLVED') {
          const { paths } = msg.payload;
          Object.entries(paths).forEach(([slug, body]) => {
            this.cachedPaths.set(slug, body);
            const listeners = this.pathCallbacks.get(slug);
            if (listeners) {
              listeners.forEach(cb => {
                try {
                  cb(body);
                } catch {
                  // ignore
                }
              });
              this.pathCallbacks.delete(slug);
            }
          });
        }

        const pending = this.pendingRequests.get(msg.id);
        if (pending) {
          this.pendingRequests.delete(msg.id);
          if (msg.type === 'ERROR') {
            pending.reject(new Error(msg.error));
          } else if (msg.type === 'SEARCH_FILTER_RESULT') {
            pending.resolve(msg.payload);
          } else if (msg.type === 'PATHS_RESOLVED') {
            pending.resolve(msg.payload.paths);
          } else if (msg.type === 'ICON_RESOLVED') {
            pending.resolve(msg.payload.icon);
          } else if (msg.type === 'STATS_RESULT') {
            pending.resolve(msg.payload);
          } else if (msg.type === 'SPRITE_RESULT') {
            pending.resolve(msg.payload.svg);
          } else if (msg.type === 'CATALOG_COMPLETE') {
            this.isInitialized = true;
            this.isInitializing = false;
            pending.resolve(msg.payload);
          }
        }
      };

      this.worker.onerror = err => {
        console.warn('Icon Web Worker error, falling back to local thread if needed:', err);
      };
    } catch (err) {
      console.warn('Unable to instantiate Icon Web Worker:', err);
      this.worker = null;
    }
  }

  public isWorkerAvailable(): boolean {
    return this.worker !== null;
  }

  private sendRequest<T>(message: WorkerRequestPayload): Promise<T> {
    if (!this.worker) {
      return Promise.reject(new Error('Web Worker not available'));
    }

    const id = `req_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const fullMessage = { ...message, id } as WorkerRequestMessage;

    return new Promise<T>((resolve, reject) => {
      this.pendingRequests.set(id, { resolve, reject });
      this.worker!.postMessage(fullMessage);
    });
  }

  /**
   * Initializes the catalog in the Web Worker
   */
  public initCatalog(
    onProgress?: CatalogProgressCallback,
    onBatch?: CatalogBatchCallback
  ): Promise<{ totalCount: number }> {
    if (onProgress) this.progressListeners.add(onProgress);
    if (onBatch) this.batchListeners.add(onBatch);

    if (this.isInitialized) {
      return Promise.resolve({ totalCount: 17049 });
    }

    if (this.isInitializing) {
      return new Promise<{ totalCount: number }>(resolve => {
        const check = setInterval(() => {
          if (this.isInitialized) {
            clearInterval(check);
            resolve({ totalCount: 17049 });
          }
        }, 100);
      });
    }

    this.isInitializing = true;
    return this.sendRequest<{ totalCount: number }>({
      type: 'INIT_CATALOG',
    });
  }

  /**
   * High-speed off-thread multi-token fuzzy search and filter
   */
  public searchFilter(
    filters: FilterState,
    limit?: number
  ): Promise<{ results: LightweightIconItem[]; total: number }> {
    return this.sendRequest<{ results: LightweightIconItem[]; total: number }>({
      type: 'SEARCH_FILTER',
      payload: { filters, limit },
    });
  }

  /**
   * Checks if an icon's SVG path body is already cached in memory
   */
  public getCachedBody(slug: string): string | undefined {
    return this.cachedPaths.get(slug);
  }

  /**
   * Sets a path in cache (e.g. for core icons)
   */
  public setCachedBody(slug: string, body: string): void {
    this.cachedPaths.set(slug, body);
  }

  /**
   * Requests the SVG path body for a single slug with automatic batch debouncing
   */
  public requestPathBody(slug: string, callback?: (body: string) => void): Promise<string> {
    const cached = this.cachedPaths.get(slug);
    if (cached) {
      if (callback) callback(cached);
      return Promise.resolve(cached);
    }

    return new Promise<string>(resolve => {
      let listeners = this.pathCallbacks.get(slug);
      if (!listeners) {
        listeners = new Set();
        this.pathCallbacks.set(slug, listeners);
      }

      listeners.add(body => {
        if (callback) callback(body);
        resolve(body);
      });

      this.pendingPathResolutions.add(slug);

      if (!this.pathBatchTimer) {
        this.pathBatchTimer = setTimeout(() => {
          this.flushPendingPathBatch();
        }, 8); // 8ms micro-batching for 120 FPS render loops
      }
    });
  }

  /**
   * Flushes the batched path requests to the Web Worker in a single round-trip
   */
  private flushPendingPathBatch(): void {
    this.pathBatchTimer = null;
    if (this.pendingPathResolutions.size === 0) return;

    const slugs = Array.from(this.pendingPathResolutions);
    this.pendingPathResolutions.clear();

    if (!this.worker) {
      return;
    }

    this.sendRequest<Record<string, string>>({
      type: 'RESOLVE_PATHS',
      payload: { slugs },
    }).catch(err => {
      console.warn('Failed to resolve batch paths in worker:', err);
    });
  }

  /**
   * Resolves a batch of icon paths immediately
   */
  public resolveBatchPaths(slugs: string[]): Promise<Record<string, string>> {
    // Check what is already cached
    const missingSlugs: string[] = [];
    const results: Record<string, string> = {};

    slugs.forEach(slug => {
      const cached = this.cachedPaths.get(slug);
      if (cached) {
        results[slug] = cached;
      } else {
        missingSlugs.push(slug);
      }
    });

    if (missingSlugs.length === 0 || !this.worker) {
      return Promise.resolve(results);
    }

    return this.sendRequest<Record<string, string>>({
      type: 'RESOLVE_PATHS',
      payload: { slugs: missingSlugs },
    }).then(resolved => {
      Object.entries(resolved).forEach(([slug, body]) => {
        this.cachedPaths.set(slug, body);
        results[slug] = body;
      });
      return results;
    });
  }

  /**
   * Resolves a full icon definition with its path body
   */
  public resolveFullIcon(slug: string): Promise<LightweightIconItem & { body: string }> {
    return this.sendRequest<LightweightIconItem & { body: string }>({
      type: 'RESOLVE_ICON',
      payload: { slug },
    }).then(icon => {
      if (icon.body) {
        this.cachedPaths.set(icon.slug, icon.body);
      }
      return icon;
    });
  }

  /**
   * Generates SVG sprite sheet in the Web Worker
   */
  public generateSpriteSheet(slugs?: string[]): Promise<string> {
    return this.sendRequest<string>({
      type: 'GENERATE_SPRITE',
      payload: { slugs },
    });
  }

  /**
   * Fetches full dataset statistics from the Web Worker
   */
  public getStats(): Promise<RegistryStats> {
    return this.sendRequest<RegistryStats>({
      type: 'GET_STATS',
    });
  }
}

export const iconWorkerClient = new IconWorkerClient();
