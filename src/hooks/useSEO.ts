import { useEffect } from 'react';
import { IconItem } from '../types';
import { updateDocumentSEO, getSEOForRoute, getSEOForIcon } from '../utils/seo';

interface UseSEOOptions {
  route: string;
  selectedIcon?: IconItem | null;
  categoryId?: string;
  query?: string;
}

/**
 * React hook to synchronize document title, meta tags, Open Graph,
 * Twitter cards, and JSON-LD structured data with current application state.
 */
export function useSEO({ route, selectedIcon, categoryId, query }: UseSEOOptions) {
  useEffect(() => {
    if (selectedIcon) {
      const iconConfig = getSEOForIcon(selectedIcon);
      updateDocumentSEO(iconConfig);
    } else {
      const routeConfig = getSEOForRoute(route, categoryId, query);
      updateDocumentSEO(routeConfig);
    }
  }, [route, selectedIcon, categoryId, query]);
}
