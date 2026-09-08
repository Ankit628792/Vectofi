import React, { useState, useEffect, useCallback } from 'react';
import { IconItem, FilterState, CollectionItem, ToastMessage } from './types';
import { ICONS } from './data/icons';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { IconsPage } from './pages/IconsPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { CollectionsPage } from './pages/CollectionsPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { DocsPage } from './pages/DocsPage';
import { LicensePage } from './pages/LicensePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ErrorPage } from './pages/ErrorPage';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { InitialLoader } from './components/ui/InitialLoader';
import { IconDetailLaboratory } from './components/laboratory/IconDetailLaboratory';
import { CommandPalette } from './components/ui/CommandPalette';
import { KeyboardShortcutsModal } from './components/ui/KeyboardShortcutsModal';
import { ToastContainer } from './components/ui/Toast';
import { generateSvgCode, downloadSvgFile } from './utils/svgExport';
import { useSEO } from './hooks/useSEO';

// Initial curated collections
const INITIAL_COLLECTIONS: CollectionItem[] = [
  {
    id: 'starter',
    name: 'Essential Web Starter',
    description: 'Core interface and navigation icons every web application needs.',
    iconSlugs: ['menu', 'close', 'search', 'home', 'user', 'settings', 'bell', 'check', 'chevron-down'],
    isCurated: true,
    createdAt: Date.now(),
  },
  {
    id: 'commerce',
    name: 'E-commerce & Checkout',
    description: 'Shopping cart, payment cards, badges, and delivery logistics.',
    iconSlugs: ['shopping-bag', 'shopping-cart', 'credit-card', 'tag', 'package', 'truck', 'heart', 'shield-check'],
    isCurated: true,
    createdAt: Date.now(),
  },
  {
    id: 'developer',
    name: 'Developer Tooling',
    description: 'Code branches, terminals, databases, and version control icons.',
    iconSlugs: ['code', 'git-branch', 'git-commit', 'terminal', 'database', 'cpu', 'bug', 'layers', 'sliders'],
    isCurated: true,
    createdAt: Date.now(),
  },
  {
    id: 'media',
    name: 'Media Player',
    description: 'Audio, video, volume, and playback controls with animations.',
    iconSlugs: ['play', 'pause', 'volume-2', 'volume-x', 'music', 'camera', 'video', 'disc'],
    isCurated: true,
    createdAt: Date.now(),
  },
];

export default function App() {
  // Navigation Route
  const [currentRoute, setCurrentRoute] = useState<string>('/');

  // Filter State
  const [filters, setFilters] = useState<FilterState>({
    query: '',
    category: 'all',
    style: 'all',
    hasAnimation: 'all',
    sortBy: 'name',
  });

  // Selected Icon for Laboratory modal
  const [selectedIcon, setSelectedIcon] = useState<IconItem | null>(null);

  // Favorites (persisted in localStorage, initialized to empty)
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      // Remove any legacy mock keys
      localStorage.removeItem('vectorcraft_favorites');
      const saved = localStorage.getItem('vectofi_favorites');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // If the user previously had the hardcoded 5 mock favorites from early development, reset to empty
          const isOldMock =
            parsed.length === 5 &&
            ['heart', 'play', 'code', 'sparkles', 'rocket'].every(s =>
              parsed.includes(s)
            );
          if (!isOldMock) return parsed;
        }
      }
      return [];
    } catch {
      return [];
    }
  });

  // Collections (persisted in localStorage)
  const [collections, setCollections] = useState<CollectionItem[]>(() => {
    try {
      const saved = localStorage.getItem('vectofi_collections') || localStorage.getItem('vectorcraft_collections');
      return saved ? JSON.parse(saved) : INITIAL_COLLECTIONS;
    } catch {
      return INITIAL_COLLECTIONS;
    }
  });

  // Dark Mode - default to true for Sophisticated Dark
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('vectofi_theme') || localStorage.getItem('vectorcraft_theme');
      if (saved) return saved === 'dark';
      return true; // Default to Sophisticated Dark
    } catch {
      return true;
    }
  });

  // Global Reduced Motion Setting (persists in localStorage)
  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('vectofi_reduced_motion');
      if (saved !== null) {
        return saved === 'true';
      }
      return typeof window !== 'undefined'
        ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
        : false;
    } catch {
      return false;
    }
  });

  // Global Animated switch on catalog
  const [globalAnimated, setGlobalAnimated] = useState<boolean>(false);

  // Modals & Overlays
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [shortcutsModalOpen, setShortcutsModalOpen] = useState(false);

  // Toast Notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Initial loader on enter
  const [showInitialLoader, setShowInitialLoader] = useState<boolean>(true);

  // Apply dark mode class to html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('vectofi_theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // Apply reduced motion class to root html element and sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('vectofi_reduced_motion', String(reducedMotion));
    } catch {
      // ignore
    }

    if (reducedMotion) {
      document.documentElement.classList.add('reduced-motion');
      document.documentElement.setAttribute('data-reduced-motion', 'true');
    } else {
      document.documentElement.classList.remove('reduced-motion');
      document.documentElement.removeAttribute('data-reduced-motion');
    }
  }, [reducedMotion]);

  // Persist favorites
  useEffect(() => {
    try {
      localStorage.setItem('vectofi_favorites', JSON.stringify(favorites));
    } catch {
      // ignore
    }
  }, [favorites]);

  // Persist collections
  useEffect(() => {
    try {
      localStorage.setItem('vectofi_collections', JSON.stringify(collections));
    } catch {
      // ignore
    }
  }, [collections]);

  // Handle HTML5 pushState routing and deep-linking to icons
  useEffect(() => {
    const handleLocationChange = () => {
      // If URL contains a legacy hash (e.g., #/icons or #/icon/arrow-right), migrate cleanly to pathname
      if (window.location.hash && window.location.hash.startsWith('#')) {
        const hashContent = window.location.hash.replace(/^#\/?/, '/');
        window.history.replaceState(null, '', hashContent);
      }

      const pathname = window.location.pathname || '/';
      const search = window.location.search;

      if (pathname.startsWith('/icon/')) {
        const slug = pathname.replace('/icon/', '').split('/')[0].trim();
        const foundIcon = ICONS.find(i => i.slug === slug || i.id === slug);
        if (foundIcon) {
          setSelectedIcon(foundIcon);
          // Keep current background route if already valid; default to /icons
          setCurrentRoute(prev => (prev === '/' ? '/icons' : prev));
        } else {
          setSelectedIcon(null);
        }
      } else {
        setSelectedIcon(null);
        setCurrentRoute(pathname);
      }

      if (search) {
        const params = new URLSearchParams(search);
        const iconSlug = params.get('icon');
        if (iconSlug) {
          const foundIcon = ICONS.find(i => i.slug === iconSlug || i.id === iconSlug);
          if (foundIcon) {
            setSelectedIcon(foundIcon);
          }
        }
        const q = params.get('q');
        const cat = params.get('category');
        const anim = params.get('anim');
        if (q !== null) setFilters(f => ({ ...f, query: q }));
        if (cat !== null) setFilters(f => ({ ...f, category: cat as any }));
        if (anim !== null) setFilters(f => ({ ...f, hasAnimation: anim as any }));
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    handleLocationChange();
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  // Dynamically update document title, meta tags, Open Graph, Twitter, and JSON-LD schema (Phase 19 SEO)
  useSEO({
    route: currentRoute,
    selectedIcon,
    categoryId: filters.category,
    query: filters.query,
  });

  const showToast = useCallback(
    (
      title: string,
      message?: string,
      type: 'success' | 'favorite' | 'download' = 'success'
    ) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts(prev => [...prev, { id, title, message, type }]);
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toggleReducedMotion = useCallback(() => {
    setReducedMotion(prev => {
      const next = !prev;
      showToast(
        next ? 'Reduced Motion Enabled' : 'Standard Motion Active',
        next
          ? 'CSS keyframes and SVG animations paused.'
          : 'CSS animations and keyframes resumed.',
        'success'
      );
      return next;
    });
  }, [showToast]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(
        (e.target as HTMLElement)?.tagName
      );

      // Cmd+K or Ctrl+K -> Command Palette
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      } else if (!isInput && e.key === '?') {
        e.preventDefault();
        setShortcutsModalOpen(prev => !prev);
      } else if (!isInput && (e.key === 'm' || e.key === 'M') && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        toggleReducedMotion();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleReducedMotion]);

  const navigateTo = useCallback((route: string) => {
    // Ensure clean route without leading #
    const cleanRoute = route.startsWith('#') ? route.replace(/^#\/?/, '/') : route;
    const [path, queryString] = cleanRoute.split('?');

    // Close any open icon detail laboratory
    setSelectedIcon(null);

    // Update browser URL without hash
    window.history.pushState(null, '', cleanRoute);
    setCurrentRoute(path || '/');

    if (queryString) {
      const params = new URLSearchParams(queryString);
      const q = params.get('q');
      const cat = params.get('category');
      const anim = params.get('anim');
      if (q !== null) setFilters(f => ({ ...f, query: q }));
      if (cat !== null) setFilters(f => ({ ...f, category: cat as any }));
      if (anim !== null) setFilters(f => ({ ...f, hasAnimation: anim as any }));
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleOpenIcon = useCallback((icon: IconItem) => {
    setSelectedIcon(icon);
    window.history.pushState(null, '', `/icon/${icon.slug}`);
  }, []);

  const handleCloseIcon = useCallback(() => {
    setSelectedIcon(null);
    if (window.location.pathname.startsWith('/icon/')) {
      const returnRoute = currentRoute === '/' ? '/' : currentRoute;
      window.history.pushState(null, '', returnRoute);
    }
  }, [currentRoute]);

  const handleToggleFavorite = (icon: IconItem) => {
    setFavorites(prev => {
      if (prev.includes(icon.slug)) {
        showToast('Removed from favorites', icon.name);
        return prev.filter(s => s !== icon.slug);
      } else {
        showToast('Added to favorites', icon.name, 'favorite');
        return [...prev, icon.slug];
      }
    });
  };

  const handleQuickCopy = (icon: IconItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const svgCode = generateSvgCode(icon, { size: 24, strokeWidth: 2 });
    navigator.clipboard.writeText(svgCode);
    showToast('SVG copied to clipboard', `${icon.name} vector markup.`);
  };

  const handleQuickDownload = (icon: IconItem, e: React.MouseEvent) => {
    e.stopPropagation();
    downloadSvgFile(icon, false, { size: 24, strokeWidth: 2 });
    showToast('Download started', `${icon.slug}.svg saved to device.`, 'download');
  };

  const handleCreateCollection = (name: string, description: string) => {
    const newCol: CollectionItem = {
      id: name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now().toString(36),
      name,
      description,
      iconSlugs: [],
      createdAt: Date.now(),
    };
    setCollections(prev => [...prev, newCol]);
  };

  const handleDeleteCollection = (id: string) => {
    setCollections(prev => prev.filter(c => c.id !== id));
    showToast('Collection deleted');
  };

  const handleAddToCollection = (collectionId: string, iconSlug: string) => {
    setCollections(prev =>
      prev.map(c => {
        if (c.id === collectionId) {
          if (!c.iconSlugs.includes(iconSlug)) {
            return { ...c, iconSlugs: [...c.iconSlugs, iconSlug] };
          }
        }
        return c;
      })
    );
  };

  const handleRemoveFromCollection = (collectionId: string, iconSlug: string) => {
    setCollections(prev =>
      prev.map(c => {
        if (c.id === collectionId) {
          return { ...c, iconSlugs: c.iconSlugs.filter(s => s !== iconSlug) };
        }
        return c;
      })
    );
  };

  const resetFilters = () => {
    setFilters({
      query: '',
      category: 'all',
      style: 'all',
      hasAnimation: 'all',
      sortBy: 'name',
    });
  };

  const knownRoutes = [
    '/',
    '/icons',
    '/animated',
    '/categories',
    '/collections',
    '/favorites',
    '/docs',
    '/license',
    '/error',
  ];
  const isKnownRoute = knownRoutes.includes(currentRoute);

  return (
    <div className={`min-h-screen flex flex-col bg-[#050505] text-[#e5e5e5] selection:bg-blue-600/30 selection:text-white transition-colors duration-200 ${reducedMotion ? 'vector-reduced-motion' : ''}`}>
      {/* Initial Entry Loader */}
      {showInitialLoader && (
        <InitialLoader onComplete={() => setShowInitialLoader(false)} />
      )}

      {/* Header */}
      <Header
        currentRoute={currentRoute}
        onNavigate={navigateTo}
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        favoritesCount={favorites.length}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        reducedMotion={reducedMotion}
        onToggleReducedMotion={toggleReducedMotion}
        onOpenShortcuts={() => setShortcutsModalOpen(true)}
      />

      {/* Main Routed Page Content wrapped in Error Boundary */}
      <main className="flex-1">
        <ErrorBoundary>
          {currentRoute === '/' && (
            <HomePage
              icons={ICONS}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              onSelectIcon={handleOpenIcon}
              onQuickCopy={handleQuickCopy}
              onQuickDownload={handleQuickDownload}
              onNavigate={navigateTo}
              onFilterCategory={catId => {
                setFilters(f => ({ ...f, category: catId as any }));
              }}
              onOpenSearch={() => setCommandPaletteOpen(true)}
            />
          )}

          {currentRoute === '/icons' && (
            <IconsPage
              icons={ICONS}
              filters={filters}
              onFilterChange={setFilters}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              onSelectIcon={handleOpenIcon}
              onQuickCopy={handleQuickCopy}
              onQuickDownload={handleQuickDownload}
              globalAnimated={globalAnimated}
              onToggleGlobalAnimated={() => setGlobalAnimated(!globalAnimated)}
              onResetFilters={resetFilters}
              reducedMotion={reducedMotion}
              onToggleReducedMotion={toggleReducedMotion}
              title="All SVG Icons"
              subtitle="Explore 110+ precision vector icons across 14 functional categories."
            />
          )}

          {currentRoute === '/animated' && (
            <IconsPage
              icons={ICONS}
              filters={{ ...filters, hasAnimation: 'animated' }}
              onFilterChange={setFilters}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              onSelectIcon={handleOpenIcon}
              onQuickCopy={handleQuickCopy}
              onQuickDownload={handleQuickDownload}
              globalAnimated={globalAnimated}
              onToggleGlobalAnimated={() => setGlobalAnimated(!globalAnimated)}
              onResetFilters={resetFilters}
              reducedMotion={reducedMotion}
              onToggleReducedMotion={toggleReducedMotion}
              title="Animated SVG Icons"
              subtitle="Self-contained animated vector icons powered by encapsulated CSS keyframes."
            />
          )}

          {currentRoute === '/categories' && (
            <CategoriesPage
              icons={ICONS}
              onSelectCategory={catId => {
                setFilters(f => ({ ...f, category: catId as any }));
                navigateTo('/icons');
              }}
              onSelectIcon={handleOpenIcon}
            />
          )}

          {currentRoute === '/collections' && (
            <CollectionsPage
              icons={ICONS}
              collections={collections}
              onCreateCollection={handleCreateCollection}
              onDeleteCollection={handleDeleteCollection}
              onRemoveFromCollection={handleRemoveFromCollection}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              onSelectIcon={handleOpenIcon}
              onQuickCopy={handleQuickCopy}
              onQuickDownload={handleQuickDownload}
              onShowToast={showToast}
              onNavigate={navigateTo}
            />
          )}

          {currentRoute === '/favorites' && (
            <FavoritesPage
              icons={ICONS}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              onSelectIcon={handleOpenIcon}
              onQuickCopy={handleQuickCopy}
              onQuickDownload={handleQuickDownload}
              onClearFavorites={() => setFavorites([])}
              onShowToast={showToast}
              onNavigate={navigateTo}
              reducedMotion={reducedMotion}
            />
          )}

          {currentRoute === '/docs' && (
            <DocsPage />
          )}

          {currentRoute === '/license' && (
            <LicensePage onNavigate={navigateTo} onShowToast={showToast} />
          )}

          {currentRoute === '/error' && (
            <ErrorPage onNavigate={navigateTo} />
          )}

          {!isKnownRoute && (
            <NotFoundPage currentPath={currentRoute} onNavigate={navigateTo} />
          )}
        </ErrorBoundary>
      </main>

      {/* Footer */}
      <Footer onNavigate={navigateTo} onOpenShortcuts={() => setShortcutsModalOpen(true)} />

      {/* Icon Detail Laboratory Modal */}
      {selectedIcon && (
        <IconDetailLaboratory
          icon={selectedIcon}
          allIcons={ICONS}
          isOpen={Boolean(selectedIcon)}
          onClose={handleCloseIcon}
          onSelectIcon={handleOpenIcon}
          isFavorite={favorites.includes(selectedIcon.slug)}
          onToggleFavorite={handleToggleFavorite}
          onShowToast={showToast}
          collections={collections}
          onAddToCollection={handleAddToCollection}
        />
      )}

      {/* Command Palette (Cmd + K) */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        icons={ICONS}
        onSelectIcon={handleOpenIcon}
        onNavigate={navigateTo}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        darkMode={darkMode}
        reducedMotion={reducedMotion}
        onToggleReducedMotion={toggleReducedMotion}
      />

      {/* Keyboard Shortcuts Cheat Sheet */}
      <KeyboardShortcutsModal
        isOpen={shortcutsModalOpen}
        onClose={() => setShortcutsModalOpen(false)}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
