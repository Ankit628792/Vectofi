import React from 'react';
import { IconItem } from '../types';
import { IconCard } from '../components/icons/IconCard';
import { VirtualizedIconGrid } from '../components/icons/VirtualizedIconGrid';
import { EmptyState } from '../components/ui/EmptyState';
import { downloadSvgFile } from '../utils/svgExport';

interface FavoritesPageProps {
  icons: IconItem[];
  favorites: string[];
  onToggleFavorite: (icon: IconItem) => void;
  onSelectIcon: (icon: IconItem) => void;
  onQuickCopy: (icon: IconItem, e: React.MouseEvent) => void;
  onQuickDownload: (icon: IconItem, e: React.MouseEvent) => void;
  onClearFavorites: () => void;
  onShowToast: (title: string, message?: string) => void;
  onNavigate: (route: string) => void;
  reducedMotion?: boolean;
}

export const FavoritesPage: React.FC<FavoritesPageProps> = ({
  icons,
  favorites,
  onToggleFavorite,
  onSelectIcon,
  onQuickCopy,
  onQuickDownload,
  onClearFavorites,
  onShowToast,
  onNavigate,
  reducedMotion = false,
}) => {
  const favoriteIcons = favorites
    .map(slug => icons.find(i => i.slug === slug))
    .filter((i): i is IconItem => Boolean(i));

  const handleBatchDownload = () => {
    if (favoriteIcons.length === 0) return;
    favoriteIcons.forEach((icon, idx) => {
      setTimeout(() => {
        downloadSvgFile(icon, false);
      }, idx * 100);
    });
    onShowToast(
      'Batch download started',
      `Downloading ${favoriteIcons.length} favorite SVG files.`
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-[#e5e5e5]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="text-rose-500">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </span>
            <h1 className="font-display font-light text-3xl text-white tracking-tight">
              Saved <span className="font-bold">Favorites</span>
            </h1>
          </div>
          <p className="text-sm text-white/50 mt-1">
            {favoriteIcons.length} saved {favoriteIcons.length === 1 ? 'icon' : 'icons'} stored locally in your browser session.
          </p>
        </div>

        {favoriteIcons.length > 0 && (
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleBatchDownload}
              className="px-4 py-2 rounded-xl text-xs font-mono font-medium bg-blue-600 hover:bg-blue-500 text-white transition-colors flex items-center gap-2 shadow-lg shadow-blue-600/20 cursor-pointer whitespace-nowrap shrink-0"
            >
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>Download All ({favoriteIcons.length})</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onClearFavorites();
                onShowToast('Favorites cleared', 'All icons removed from favorites.');
              }}
              className="px-3 py-2 rounded-xl text-xs font-mono text-white/40 hover:text-rose-400 hover:bg-white/5 border border-white/10 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {favoriteIcons.length > 0 ? (
        favoriteIcons.length > 24 ? (
          <VirtualizedIconGrid
            icons={favoriteIcons}
            favorites={favorites}
            onToggleFavorite={onToggleFavorite}
            onSelectIcon={onSelectIcon}
            onQuickCopy={onQuickCopy}
            onQuickDownload={onQuickDownload}
            globalAnimated={false}
            reducedMotion={reducedMotion}
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {favoriteIcons.map(icon => (
              <IconCard
                key={icon.slug}
                icon={icon}
                isFavorite={true}
                onToggleFavorite={onToggleFavorite}
                onSelectIcon={onSelectIcon}
                onQuickCopy={onQuickCopy}
                onQuickDownload={onQuickDownload}
                globalAnimated={!reducedMotion}
              />
            ))}
          </div>
        )
      ) : (
        <div className="space-y-12">
          {/* Main Empty State Banner */}
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] p-8 sm:p-12 text-center">
            {/* Background ambient glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-lg mx-auto flex flex-col items-center">
              {/* Animated Vector Heart Graphic */}
              <div className="relative w-24 h-24 mb-6 flex items-center justify-center text-rose-400">
                <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="1.5" strokeDasharray="5 5" opacity="0.25" className="animate-spin" style={{ animationDuration: '30s' }} />
                  <circle cx="50" cy="50" r="32" stroke="currentColor" strokeWidth="1" opacity="0.2" />
                  
                  {/* Glowing heart symbol */}
                  <path
                    d="M50 67l-15.5-15.5a11 11 0 0 1 0-15.5 11 11 0 0 1 15.5 0l0 0 0 0a11 11 0 0 1 15.5 0 11 11 0 0 1 0 15.5z"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                    fill="currentColor"
                    fillOpacity="0.15"
                  />
                  
                  {/* Decorative corner crosshairs */}
                  <line x1="50" y1="2" x2="50" y2="10" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
                  <line x1="50" y1="90" x2="50" y2="98" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
                  <line x1="2" y1="50" x2="10" y2="50" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
                  <line x1="90" y1="50" x2="98" y2="50" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
                </svg>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                <span>Empty Favorites Drawer</span>
              </div>

              <h2 className="font-display font-light text-2xl sm:text-3xl text-white tracking-tight">
                No favorites <span className="font-bold text-rose-400">saved yet</span>
              </h2>
              <p className="text-sm sm:text-base text-white/60 mt-3 leading-relaxed">
                Your favorites drawer is currently empty.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => onNavigate('/icons')}
                  className="px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-blue-600 hover:bg-blue-500 text-white transition-colors shadow-md shadow-blue-600/20 cursor-pointer min-h-[44px] flex items-center gap-2"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                  </svg>
                  Browse All 110+ Icons
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('/animated')}
                  className="px-5 py-2.5 rounded-xl font-medium text-xs sm:text-sm border border-white/10 bg-white/5 hover:bg-white/10 text-white transition-colors cursor-pointer min-h-[44px] flex items-center gap-2"
                >
                  <svg className="w-4 h-4 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  Explore Animated SVGs
                </button>
              </div>
            </div>
          </div>

          {/* Quick-Add Popular Suggestions */}
          <div className="pt-4 border-t border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  Quick-Add Starter Suggestions
                </h3>
                <p className="text-xs text-white/40">
                  Click the heart icon on any suggested icon to add it directly to your favorites:
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {['heart', 'code', 'terminal', 'layers', 'camera', 'globe']
                .map(slug => icons.find(i => i.slug === slug))
                .filter((i): i is IconItem => Boolean(i))
                .map(icon => (
                  <IconCard
                    key={icon.slug}
                    icon={icon}
                    isFavorite={false}
                    onToggleFavorite={iconItem => {
                      onToggleFavorite(iconItem);
                      onShowToast(
                        'Added to favorites',
                        `"${iconItem.name}" is now saved in your favorites list.`
                      );
                    }}
                    onSelectIcon={onSelectIcon}
                    onQuickCopy={onQuickCopy}
                    onQuickDownload={onQuickDownload}
                  />
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
