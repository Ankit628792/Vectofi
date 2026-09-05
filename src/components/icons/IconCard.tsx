import React, { useState } from 'react';
import { IconItem } from '../../types';
import { AnimatedIconRenderer } from './AnimatedIconRenderer';

interface IconCardProps {
  icon: IconItem;
  isFavorite: boolean;
  onToggleFavorite: (icon: IconItem) => void;
  onSelectIcon: (icon: IconItem) => void;
  onQuickCopy: (icon: IconItem, e: React.MouseEvent) => void;
  onQuickDownload: (icon: IconItem, e: React.MouseEvent) => void;
  globalAnimated?: boolean;
}

export const IconCard: React.FC<IconCardProps> = ({
  icon,
  isFavorite,
  onToggleFavorite,
  onSelectIcon,
  onQuickCopy,
  onQuickDownload,
  globalAnimated = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Animate if hovered OR if page-wide globalAnimated mode is on
  const shouldAnimate = (isHovered || globalAnimated) && icon.hasAnimation;

  return (
    <div
      onClick={() => onSelectIcon(icon)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all duration-200 cursor-pointer select-none overflow-hidden"
      role="button"
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelectIcon(icon);
        }
      }}
      aria-label={`View ${icon.name} icon details`}
    >
      {/* Top action bar */}
      <div className="flex items-center justify-between w-full mb-3 min-h-6">
        {/* Style / Category tag */}
        <span className="text-[10px] font-mono uppercase tracking-wider text-white/40 group-hover:text-white/60 transition-colors">
          {icon.category}
        </span>

        {/* Favorite heart button */}
        <button
          type="button"
          onClick={e => {
            e.stopPropagation();
            onToggleFavorite(icon);
          }}
          className={`p-1.5 rounded-lg transition-all ${
            isFavorite
              ? 'text-rose-500 bg-rose-500/20 opacity-100'
              : 'text-white/40 hover:text-rose-400 hover:bg-white/10 opacity-70 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100'
          }`}
          title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
          aria-label={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
        >
          <svg
            className="w-3.5 h-3.5"
            viewBox="0 0 24 24"
            fill={isFavorite ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>

      {/* Main Icon Stage */}
      <div className="relative py-4 sm:py-6 flex items-center justify-center text-white/80 group-hover:text-blue-400 transition-colors">
        {/* Subtle grid pattern background on hover */}
        <div className="absolute inset-0 bg-vector-grid-blue opacity-0 group-hover:opacity-60 transition-opacity rounded-xl pointer-events-none" />

        <div className="relative transform transition-transform duration-200 group-hover:scale-110">
          <AnimatedIconRenderer
            icon={icon}
            size={34}
            strokeWidth={1.8}
            animated={shouldAnimate}
          />
        </div>
      </div>

      {/* Card Footer: Name & Action Buttons */}
      <div className="mt-2.5 pt-2.5 border-t border-white/5 flex items-center justify-between">
        <div className="min-w-0 pr-1.5 flex-1">
          <p className="text-xs font-medium text-white/90 truncate group-hover:text-white transition-colors">
            {icon.name}
          </p>
          <div className="flex items-center gap-1.5 mt-0.5">
            {icon.hasAnimation ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-mono text-blue-400 font-medium">
                <span className="w-1 h-1 rounded-full bg-blue-500 animate-ping" />
                {icon.animationType || 'animated'}
              </span>
            ) : (
              <span className="text-[10px] font-mono text-white/40">
                static
              </span>
            )}
          </div>
        </div>

        {/* Quick Copy & Download buttons */}
        <div className="flex items-center gap-0.5 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 focus-within:opacity-100 transition-opacity shrink-0">
          <button
            type="button"
            onClick={e => onQuickCopy(icon, e)}
            className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
            title="Copy SVG code (C)"
            aria-label={`Copy ${icon.name} SVG`}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          </button>
          <button
            type="button"
            onClick={e => onQuickDownload(icon, e)}
            className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
            title="Download SVG file (D)"
            aria-label={`Download ${icon.name} SVG`}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
