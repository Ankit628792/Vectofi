import React from 'react';

interface IconCardSkeletonProps {
  id?: string;
  className?: string;
}

/**
 * Lightweight, zero-layout-shift skeleton placeholder matching exact dimensions
 * of the standard IconCard to guarantee 0 cumulative layout shift (CLS).
 */
export const IconCardSkeleton: React.FC<IconCardSkeletonProps> = ({
  id,
  className = '',
}) => {
  const cardId = id || `icon-card-skeleton-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div
      id={cardId}
      role="status"
      aria-label="Loading icon vector..."
      className={`relative flex flex-col justify-between p-3 sm:p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] min-h-[165px] sm:min-h-[175px] h-full overflow-hidden select-none pointer-events-none ${className}`}
    >
      {/* Subtle Shimmer Sweep Effect */}
      <div
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.04] to-transparent animate-[shimmer_1.8s_infinite]"
        style={{
          backgroundImage:
            'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.04) 50%, transparent 100%)',
          animation: 'shimmer 1.8s infinite ease-in-out',
        }}
      />

      {/* Top action bar skeleton */}
      <div
        id={`${cardId}-topbar`}
        className="flex items-center justify-between w-full mb-1 min-h-[22px] gap-1 shrink-0"
      >
        {/* Category tag skeleton */}
        <div className="h-2.5 w-14 sm:w-16 rounded bg-white/[0.08] animate-pulse" />
        {/* Favorite heart skeleton */}
        <div className="w-5 h-5 rounded-md bg-white/[0.05] animate-pulse shrink-0" />
      </div>

      {/* Main Icon Stage skeleton */}
      <div
        id={`${cardId}-stage`}
        className="relative flex-1 py-1.5 sm:py-2.5 flex items-center justify-center min-h-[44px]"
      >
        {/* Icon glyph placeholder */}
        <div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/[0.04] flex items-center justify-center animate-pulse">
          <div className="w-4 h-4 rounded-md bg-white/[0.08]" />
        </div>
      </div>

      {/* Card Footer: Name & Action Buttons skeleton */}
      <div
        id={`${cardId}-footer`}
        className="mt-1.5 pt-2 border-t border-white/[0.05] flex items-center justify-between shrink-0"
      >
        <div className="min-w-0 pr-1 flex-1 space-y-1.5">
          {/* Icon name skeleton */}
          <div className="h-3 w-16 sm:w-20 rounded bg-white/[0.08] animate-pulse" />
          {/* Icon type tag skeleton */}
          <div className="h-2 w-10 rounded bg-white/[0.04] animate-pulse" />
        </div>

        {/* Quick action placeholders */}
        <div className="flex items-center gap-1 shrink-0 opacity-40">
          <div className="w-4 h-4 rounded bg-white/[0.06] animate-pulse" />
          <div className="w-4 h-4 rounded bg-white/[0.06] animate-pulse" />
        </div>
      </div>
    </div>
  );
};
