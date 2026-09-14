import { useState, useEffect, useRef, useMemo } from 'react';
import { IconItem, FilterState } from '../types';
import { iconRegistry } from '../data/icons';
import { iconWorkerClient } from '../services/iconWorkerClient';

/**
 * High-performance off-thread search & filter hook powered by Web Worker.
 * Ensures the main UI thread stays at 60+ FPS even when typing rapidly
 * across 17,000+ vector icon items.
 */
export function useWorkerIconFilter(
  icons: IconItem[],
  filters: FilterState
): {
  filteredIcons: IconItem[];
  isFiltering: boolean;
  totalMatching: number;
} {
  const [filteredIcons, setFilteredIcons] = useState<IconItem[]>(() => {
    // Initial quick filter
    return iconRegistry.search(filters);
  });
  const [isFiltering, setIsFiltering] = useState<boolean>(false);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeRequestIdRef = useRef<number>(0);

  // Fallback synchronous filter calculation
  const fallbackResults = useMemo(() => {
    if (!iconWorkerClient.isWorkerAvailable()) {
      return iconRegistry.search(filters);
    }
    return null;
  }, [filters, icons.length]);

  useEffect(() => {
    if (fallbackResults !== null) {
      setFilteredIcons(fallbackResults);
      setIsFiltering(false);
      return;
    }

    const currentReqId = ++activeRequestIdRef.current;
    const isQueryEmpty = !filters.query.trim();

    // Use shorter debounce for empty query or dropdown changes, slightly longer for rapid typing
    const delay = isQueryEmpty ? 0 : 35;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    setIsFiltering(true);

    debounceTimerRef.current = setTimeout(async () => {
      try {
        const { results } = await iconWorkerClient.searchFilter(filters);

        // Discard stale responses
        if (currentReqId !== activeRequestIdRef.current) {
          return;
        }

        // Map lightweight items back to registered items (preserving prototype getters)
        const mapped = results
          .map(res => iconRegistry.getBySlug(res.slug))
          .filter((i): i is IconItem => Boolean(i));

        setFilteredIcons(mapped);
      } catch {
        // Fallback to local search on worker error
        if (currentReqId === activeRequestIdRef.current) {
          const localFiltered = iconRegistry.search(filters);
          setFilteredIcons(localFiltered);
        }
      } finally {
        if (currentReqId === activeRequestIdRef.current) {
          setIsFiltering(false);
        }
      }
    }, delay);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [
    filters.query,
    filters.category,
    filters.style,
    filters.hasAnimation,
    filters.sortBy,
    icons.length,
    fallbackResults,
  ]);

  return {
    filteredIcons,
    isFiltering,
    totalMatching: filteredIcons.length,
  };
}
