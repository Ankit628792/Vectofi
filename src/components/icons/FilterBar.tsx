import React, { useRef, useEffect } from 'react';
import { FilterState, IconCategory } from '../../types';
import { CATEGORIES } from '../../data/categories';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  totalCount: number;
  filteredCount: number;
  globalAnimated: boolean;
  onToggleGlobalAnimated: () => void;
  onResetFilters: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  totalCount,
  filteredCount,
  globalAnimated,
  onToggleGlobalAnimated,
  onResetFilters,
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus search input when pressing `/`
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        !['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const hasActiveFilters =
    filters.query.trim() !== '' ||
    filters.category !== 'all' ||
    filters.style !== 'all' ||
    filters.hasAnimation !== 'all';

  return (
    <div className="space-y-4 mb-8">
      {/* Top Search & Primary Filters Row */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search Input matching Design HTML */}
        <div className="relative flex-1 group">
          <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-white/40">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>

          <input
            ref={searchInputRef}
            type="text"
            value={filters.query}
            onChange={e => onFilterChange({ ...filters, query: e.target.value })}
            placeholder="Search 110+ icons by name, category, or tag (press /)..."
            className="w-full pl-10 pr-16 sm:pr-20 py-2.5 rounded-full border border-white/10 bg-white/5 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-sans min-h-[42px]"
            aria-label="Search icons"
          />

          <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-1.5">
            {filters.query && (
              <button
                type="button"
                onClick={() => onFilterChange({ ...filters, query: '' })}
                className="p-1 rounded-md text-white/40 hover:text-white"
                title="Clear search"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-white/40 bg-white/10 rounded border border-white/10">
              /
            </kbd>
          </div>
        </div>

        {/* Animation Filter Pills & Global Toggle Group */}
        <div className="flex items-center justify-between sm:justify-start gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {/* Animation Filter Pills */}
          <div className="inline-flex p-1 rounded-xl bg-white/5 border border-white/10 shrink-0">
            {(['all', 'animated', 'static'] as const).map(animOption => (
              <button
                key={animOption}
                type="button"
                onClick={() => onFilterChange({ ...filters, hasAnimation: animOption })}
                className={`px-3 py-1.5 text-xs font-mono capitalize rounded-lg transition-all min-h-[34px] cursor-pointer whitespace-nowrap ${
                  filters.hasAnimation === animOption
                    ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/25'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {animOption === 'animated' ? '⚡ Animated' : animOption}
              </button>
            ))}
          </div>

          {/* Global Animation Switch */}
          <button
            type="button"
            onClick={onToggleGlobalAnimated}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono transition-colors shrink-0 min-h-[36px] cursor-pointer whitespace-nowrap ${
              globalAnimated
                ? 'bg-blue-500/20 border-blue-500/40 text-blue-400'
                : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
            }`}
            title="Play all animated icons simultaneously"
          >
            <span className={`w-2 h-2 rounded-full shrink-0 ${globalAnimated ? 'bg-blue-500 animate-ping' : 'bg-white/30'}`} />
            <span className="whitespace-nowrap">{globalAnimated ? 'Animating' : 'Animate All'}</span>
          </button>
        </div>
      </div>

      {/* Categories & Sorting Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
        {/* Category Horizontal Scroll Pills with touch support */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 max-w-full sm:max-w-3xl scrollbar-none touch-pan-x">
          <button
            type="button"
            onClick={() => onFilterChange({ ...filters, category: 'all' })}
            className={`px-3 py-1 text-xs font-medium rounded-full transition-all shrink-0 border min-h-[30px] cursor-pointer whitespace-nowrap ${
              filters.category === 'all'
                ? 'bg-white text-black border-white font-bold'
                : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            All Categories
          </button>
          {CATEGORIES.map(cat => {
            const isSelected = filters.category === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onFilterChange({ ...filters, category: cat.id as IconCategory })}
                className={`px-3 py-1 text-xs font-medium rounded-full transition-all shrink-0 flex items-center gap-1.5 border min-h-[30px] cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-blue-600 border-blue-500 text-white font-bold shadow-sm'
                    : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="whitespace-nowrap">{cat.name}</span>
                <span className={`text-[10px] font-mono whitespace-nowrap shrink-0 ${isSelected ? 'text-blue-200' : 'text-white/40'}`}>
                  {cat.iconCount}
                </span>
              </button>
            );
          })}
        </div>

        {/* Sort & Count */}
        <div className="flex items-center justify-between sm:justify-end gap-3 sm:ml-auto text-xs shrink-0">
          <span className="font-mono text-white/40 whitespace-nowrap text-[11px] sm:text-xs shrink-0">
            <strong className="text-white">{filteredCount}</strong> of {totalCount} icons
          </span>

          <select
            value={filters.sortBy}
            onChange={e => onFilterChange({ ...filters, sortBy: e.target.value as any })}
            className="px-2.5 py-1.5 rounded-xl border border-white/10 bg-[#0a0a0a] text-xs font-mono text-white/80 focus:outline-none focus:border-blue-500 min-h-[32px] cursor-pointer whitespace-nowrap"
            aria-label="Sort icons"
          >
            <option value="name">Name (A-Z)</option>
            <option value="popular">Popular</option>
            <option value="newest">Newest</option>
          </select>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="text-xs font-mono text-blue-400 hover:text-blue-300 hover:underline cursor-pointer min-h-[32px] px-1 flex items-center whitespace-nowrap shrink-0"
            >
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
