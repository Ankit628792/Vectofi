import { useState, useEffect } from 'react';
import { IconItem } from '../types';
import { iconRegistry } from '../data/icons';
import { iconWorkerClient } from '../services/iconWorkerClient';

/**
 * Hook to lazily load and resolve an icon's SVG path body on demand.
 * When an icon enters the viewport or is requested, it retrieves the path data
 * from memory cache or the Web Worker without blocking the main UI thread.
 */
export function useIconBody(icon: IconItem, shouldLoad = true): { body: string; isLoaded: boolean } {
  // Check if body is immediately available
  const initialBody = icon.body || iconWorkerClient.getCachedBody(icon.slug) || '';
  const [body, setBody] = useState<string>(initialBody);
  const [isLoaded, setIsLoaded] = useState<boolean>(Boolean(initialBody));

  useEffect(() => {
    // If icon changed or already has body
    const currentCached = icon.body || iconWorkerClient.getCachedBody(icon.slug) || '';
    if (currentCached) {
      setBody(currentCached);
      setIsLoaded(true);
      return;
    }

    if (!shouldLoad) {
      return;
    }

    let isMounted = true;

    iconRegistry.requestBody(icon.slug, resolvedBody => {
      if (isMounted) {
        setBody(resolvedBody);
        setIsLoaded(true);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [icon.slug, shouldLoad]);

  return { body, isLoaded };
}
