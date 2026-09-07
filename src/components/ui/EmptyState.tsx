import React from 'react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  iconType?: 'search' | 'favorite' | 'collection';
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No icons found',
  description = 'Try searching with different keywords or clearing your active filters.',
  actionLabel = 'Clear all filters',
  onAction,
  iconType = 'search',
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center my-6 max-w-md mx-auto">
      {/* Handcrafted Vector Art Empty Illustration */}
      <div className="relative w-28 h-28 mb-6 flex items-center justify-center text-blue-400/80">
        <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Orbital dashed circle */}
          <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.3" />
          
          {/* Coordinate cross lines */}
          <line x1="50" y1="6" x2="50" y2="16" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
          <line x1="50" y1="84" x2="50" y2="94" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
          <line x1="6" y1="50" x2="16" y2="50" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
          <line x1="84" y1="50" x2="94" y2="50" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />

          {/* Center vector subject */}
          {iconType === 'favorite' ? (
            <path
              d="M50 64l-14-14a9.9 9.9 0 0 1 0-14 9.9 9.9 0 0 1 14 0l0 0 0 0a9.9 9.9 0 0 1 14 0 9.9 9.9 0 0 1 0 14z"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinejoin="round"
              fill="currentColor"
              fillOpacity="0.1"
            />
          ) : iconType === 'collection' ? (
            <rect
              x="32"
              y="32"
              width="36"
              height="36"
              rx="6"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="4 3"
            />
          ) : (
            <g>
              <circle cx="46" cy="46" r="16" stroke="currentColor" strokeWidth="2.5" />
              <line x1="58" y1="58" x2="72" y2="72" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              <text x="43" y="52" fill="currentColor" fontSize="16" fontFamily="monospace" fontWeight="bold">?</text>
            </g>
          )}

          {/* Floating tiny spark */}
          <polygon points="76,24 78,30 84,32 78,34 76,40 74,34 68,32 74,30" fill="currentColor" opacity="0.6" />
        </svg>
      </div>

      <h3 className="font-display font-bold text-lg text-white mb-2">
        {title}
      </h3>
      <p className="text-sm text-white/50 mb-6 leading-relaxed max-w-sm">
        {description}
      </p>

      {onAction && (
        <button
          type="button"
          onClick={onAction}
          className="px-5 py-2.5 text-xs font-mono font-medium rounded-xl bg-blue-600 text-white hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20 cursor-pointer whitespace-nowrap"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
