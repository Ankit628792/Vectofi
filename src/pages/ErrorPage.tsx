import React, { useState } from 'react';

interface ErrorPageProps {
  error?: Error | null;
  resetErrorBoundary?: () => void;
  onNavigate?: (route: string) => void;
}

export const ErrorPage: React.FC<ErrorPageProps> = ({
  error,
  resetErrorBoundary,
  onNavigate = route => {
    window.location.href = route;
  },
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const handleResetStorage = () => {
    try {
      localStorage.removeItem('vectofi_favorites');
      localStorage.removeItem('vectofi_collections');
      localStorage.removeItem('vectofi_theme');
      window.location.href = '/';
    } catch {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-16 text-center max-w-2xl mx-auto">
      {/* Error Badge Graphic */}
      <div className="relative mb-6 select-none">
        <div className="absolute inset-0 bg-rose-500/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative w-20 h-20 mx-auto rounded-3xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-xl shadow-rose-500/10">
          <svg
            className="w-10 h-10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
      </div>

      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono mb-3">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
        <span>Vector Engine Alert</span>
      </div>

      <h1 className="text-3xl sm:text-4xl font-light font-display text-white tracking-tight">
        Something went <span className="font-bold text-rose-400">wrong</span>
      </h1>
      <p className="mt-3 text-sm sm:text-base text-white/60 max-w-md leading-relaxed">
        An unexpected runtime exception interrupted the rendering cycle. Don't worry, your custom collections and favorites are safely preserved.
      </p>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        {resetErrorBoundary ? (
          <button
            type="button"
            onClick={resetErrorBoundary}
            className="px-6 py-2.5 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-500 text-white transition-colors shadow-md shadow-blue-600/20 cursor-pointer min-h-[44px]"
          >
            Try Again
          </button>
        ) : (
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-500 text-white transition-colors shadow-md shadow-blue-600/20 cursor-pointer min-h-[44px]"
          >
            Reload App
          </button>
        )}

        <button
          type="button"
          onClick={() => onNavigate('/')}
          className="px-6 py-2.5 rounded-xl font-bold text-sm border border-white/10 bg-white/5 hover:bg-white/10 text-white transition-colors cursor-pointer min-h-[44px]"
        >
          Return to Home
        </button>

        <button
          type="button"
          onClick={handleResetStorage}
          className="px-4 py-2.5 rounded-xl font-medium text-xs border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/15 text-rose-300 transition-colors cursor-pointer min-h-[44px]"
          title="Clears local state cache in case of corrupted data"
        >
          Reset Cache
        </button>
      </div>

      {/* Optional Collapsible Technical Details */}
      {error && (
        <div className="mt-10 w-full text-left">
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs font-mono text-white/40 hover:text-white/70 flex items-center gap-1.5 transition-colors cursor-pointer mx-auto"
          >
            <span>{showDetails ? 'Hide' : 'View'} Diagnostic Details</span>
            <svg
              className={`w-3.5 h-3.5 transition-transform ${showDetails ? 'rotate-180' : ''}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {showDetails && (
            <div className="mt-3 p-4 rounded-xl bg-black/80 border border-white/10 font-mono text-xs text-rose-300 overflow-x-auto">
              <p className="font-bold text-white mb-1">
                {error.name}: {error.message}
              </p>
              {error.stack && (
                <pre className="text-[11px] text-white/40 whitespace-pre-wrap leading-relaxed mt-2">
                  {error.stack}
                </pre>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
