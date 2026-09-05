import React from 'react';
import { IconItem } from '../types';
import { IconCard } from '../components/icons/IconCard';
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
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleBatchDownload}
              className="px-4 py-2 rounded-xl text-xs font-mono font-medium bg-blue-600 hover:bg-blue-500 text-white transition-colors flex items-center gap-2 shadow-lg shadow-blue-600/20 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download All ({favoriteIcons.length})
            </button>

            <button
              type="button"
              onClick={() => {
                onClearFavorites();
                onShowToast('Favorites cleared', 'All icons removed from favorites.');
              }}
              className="px-3 py-2 rounded-xl text-xs font-mono text-white/40 hover:text-rose-400 hover:bg-white/5 border border-white/10 transition-colors cursor-pointer"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {favoriteIcons.length > 0 ? (
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
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No favorites saved yet"
          description="Click the heart icon on any card or inside the SVG laboratory to save icons to your personal favorites list."
          actionLabel="Explore All Icons"
          onAction={() => onNavigate('/icons')}
          iconType="favorite"
        />
      )}
    </div>
  );
};
