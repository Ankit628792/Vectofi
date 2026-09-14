import React from 'react';
import { IconItem, FilterState } from '../types';
import { FilterBar } from '../components/icons/FilterBar';
import { EmptyState } from '../components/ui/EmptyState';
import { VectorGrid } from '../components/vector/VectorGrid';
import { VirtualizedIconGrid } from '../components/icons/VirtualizedIconGrid';
import { UI_TEXT } from '../utils/common';
import { CatalogLoadingProgress } from '../data/icons';
import { useWorkerIconFilter } from '../hooks/useWorkerIconFilter';

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
  reducedMotion?: boolean;
  onToggleReducedMotion?: () => void;
  title?: string;
  subtitle?: string;
  isHydrating?: boolean;
  catalogProgress?: CatalogLoadingProgress;
  isLoading?: boolean;
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
  reducedMotion = false,
  onToggleReducedMotion,
  title = 'SVG Icon Gallery',
  subtitle = UI_TEXT.gallerySubtitle,
  isHydrating = false,
  catalogProgress,
  isLoading = false,
}) => {
  // Execute high-speed search and filtering off-thread in the Web Worker
  const { filteredIcons, isFiltering } = useWorkerIconFilter(icons, filters);

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
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-mono text-blue-400 whitespace-nowrap">
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                isFiltering
                  ? 'bg-amber-400 animate-ping'
                  : reducedMotion
                  ? 'bg-amber-400'
                  : 'bg-cyan-400 animate-pulse'
              }`}
            />
            <span>
              {isFiltering ? 'Worker Searching...' : 'Worker Engine Active'}
            </span>
          </div>
          {reducedMotion && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-xs font-mono text-amber-300 whitespace-nowrap">
              <span>⏸ Reduced Motion</span>
            </div>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <FilterBar
        filters={filters}
        onFilterChange={onFilterChange}
        totalCount={icons.length}
        filteredCount={filteredIcons.length}
        globalAnimated={globalAnimated}
        onToggleGlobalAnimated={onToggleGlobalAnimated}
        onResetFilters={onResetFilters}
      />

      {/* Icons Grid or Empty State */}
      {filteredIcons.length > 0 || isHydrating || isLoading ? (
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
              interactive={!reducedMotion}
              magnetPoints={true}
              snapRadius={90}
              showCoordinates={true}
              showTether={true}
            />
          </div>

          <div className="relative z-10">
            <VirtualizedIconGrid
              icons={filteredIcons}
              favorites={favorites}
              onToggleFavorite={onToggleFavorite}
              onSelectIcon={onSelectIcon}
              onQuickCopy={onQuickCopy}
              onQuickDownload={onQuickDownload}
              globalAnimated={globalAnimated}
              reducedMotion={reducedMotion}
              isLoading={isLoading}
              isHydrating={isHydrating}
              catalogProgress={catalogProgress}
            />
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
