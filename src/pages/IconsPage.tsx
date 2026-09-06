import React from 'react';
import { IconItem, FilterState } from '../types';
import { IconCard } from '../components/icons/IconCard';
import { FilterBar } from '../components/icons/FilterBar';
import { EmptyState } from '../components/ui/EmptyState';
import { VectorGrid } from '../components/vectors/VectorGrid';

interface IconsPageProps {
  icons: IconItem[];
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  favorites: string[];
  onToggleFavorite: (icon: IconItem) => void;
  onSelectIcon: (icon: IconItem) => void;
  onQuickCopy: (icon: IconItem, e: React.MouseEvent) => void;
  onQuickDownload: (icon: IconItem, e: React.MouseEvent) => void;
  globalAnimated: boolean;
  onToggleGlobalAnimated: () => void;
  onResetFilters: () => void;
  title?: string;
  subtitle?: string;
}

export const IconsPage: React.FC<IconsPageProps> = ({
  icons,
  filters,
  onFilterChange,
  favorites,
  onToggleFavorite,
  onSelectIcon,
  onQuickCopy,
  onQuickDownload,
  globalAnimated,
  onToggleGlobalAnimated,
  onResetFilters,
  title = 'SVG Icon Gallery',
  subtitle = 'Browse, customize, and export 110+ production-ready vector icons with motion and framework bindings.',
}) => {
  // Apply filtering
  const filteredIcons = icons.filter(icon => {
    // Search query
    if (filters.query.trim()) {
      const q = filters.query.toLowerCase().trim();
      const matchName = icon.name.toLowerCase().includes(q);
      const matchSlug = icon.slug.toLowerCase().includes(q);
      const matchCat = icon.category.toLowerCase().includes(q);
      const matchTags = icon.tags.some(t => t.toLowerCase().includes(q));
      if (!matchName && !matchSlug && !matchCat && !matchTags) {
        return false;
      }
    }

    // Category
    if (filters.category !== 'all' && icon.category !== filters.category) {
      return false;
    }

    // Style
    if (filters.style !== 'all' && icon.style !== filters.style) {
      return false;
    }

    // Animation
    if (filters.hasAnimation === 'animated' && !icon.hasAnimation) {
      return false;
    }
    if (filters.hasAnimation === 'static' && icon.hasAnimation) {
      return false;
    }

    return true;
  });

  // Apply sorting
  const sortedIcons = [...filteredIcons].sort((a, b) => {
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 text-[#e5e5e5]">
      {/* Page Header */}
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-display font-light text-2xl sm:text-4xl text-white tracking-tight">
            {title.includes('Gallery') || title.includes('Library') ? (
              <>
                SVG <span className="font-bold">Icon Gallery</span>
              </>
            ) : (
              title
            )}
          </h1>
          <p className="text-sm sm:text-base text-white/50 mt-1.5 sm:mt-2 max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Technical Layout Precision Indicator */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 self-start sm:self-auto text-xs font-mono text-blue-400">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>Precision Magnet Grid Active</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <FilterBar
        filters={filters}
        onFilterChange={onFilterChange}
        totalCount={icons.length}
        filteredCount={sortedIcons.length}
        globalAnimated={globalAnimated}
        onToggleGlobalAnimated={onToggleGlobalAnimated}
        onResetFilters={onResetFilters}
      />

      {/* Icons Grid or Empty State */}
      {sortedIcons.length > 0 ? (
        <div className="relative group/library-grid">
          {/* Interactive Architectural VectorGrid with Magnet Points */}
          <div className="absolute -inset-3 sm:-inset-5 lg:-inset-6 pointer-events-none overflow-hidden rounded-2xl z-0">
            <VectorGrid
              className="w-full h-full"
              gridSize={48}
              strokeColor="#3b82f6"
              accentColor="#38bdf8"
              strokeWidth={0.75}
              crosshairs={true}
              dots={true}
              opacity={0.12}
              interactive={true}
              magnetPoints={true}
              snapRadius={90}
              showCoordinates={true}
              showTether={true}
            />
          </div>

          <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {sortedIcons.map(icon => (
              <IconCard
                key={icon.slug}
                icon={icon}
                isFavorite={favorites.includes(icon.slug)}
                onToggleFavorite={onToggleFavorite}
                onSelectIcon={onSelectIcon}
                onQuickCopy={onQuickCopy}
                onQuickDownload={onQuickDownload}
                globalAnimated={globalAnimated}
              />
            ))}
          </div>
        </div>
      ) : (
        <EmptyState
          title="No matching icons found"
          description={`No icons matched "${filters.query || 'current filters'}". Try clearing filters or searching for terms like "arrow", "play", "check", or "code".`}
          actionLabel="Clear all filters"
          onAction={onResetFilters}
          iconType="search"
        />
      )}
    </div>
  );
};
