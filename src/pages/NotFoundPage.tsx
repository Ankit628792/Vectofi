import React, { useState } from 'react';

interface NotFoundPageProps {
  currentPath?: string;
  onNavigate: (route: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({
  currentPath = window.location.pathname || '/404',
  onNavigate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate(`/icons?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      onNavigate('/icons');
    }
  };

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-16 text-center max-w-3xl mx-auto">
      {/* Visual Vector 404 Illustration */}
      <div className="relative mb-8 select-none">
        {/* Ambient glow */}
        <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Outer 404 vector graphic */}
        <div className="relative w-40 h-40 sm:w-48 sm:h-48 mx-auto flex items-center justify-center">
          <svg
            className="w-full h-full text-blue-500/20"
            viewBox="0 0 200 200"
            fill="none"
          >
            {/* Coordinate Grid Lines */}
            <line x1="20" y1="100" x2="180" y2="100" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
            <line x1="100" y1="20" x2="100" y2="180" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
            <circle cx="100" cy="100" r="70" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 4" />
            <circle cx="100" cy="100" r="40" stroke="currentColor" strokeWidth="1.5" />
          </svg>

          {/* Central 404 Node Badge */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono text-5xl sm:text-6xl font-bold tracking-tight text-white drop-shadow-md">
              4<span className="text-blue-500">0</span>4
            </span>
            <span className="text-[10px] font-mono tracking-widest uppercase text-blue-400 mt-1 px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">
              Vector Missing
            </span>
          </div>

          {/* Broken node anchor points */}
          <div className="absolute top-4 left-4 w-2.5 h-2.5 rounded-sm bg-cyan-400 border border-white" />
          <div className="absolute bottom-4 right-4 w-2.5 h-2.5 rounded-sm bg-rose-500 border border-white" />
        </div>
      </div>

      {/* Main Copy */}
      <h1 className="text-3xl sm:text-4xl font-light font-display text-white tracking-tight">
        Coordinate <span className="font-bold">Not Found</span>
      </h1>
      <p className="mt-3 text-sm sm:text-base text-white/50 max-w-lg leading-relaxed">
        The route <code className="text-blue-300 bg-white/5 px-2 py-0.5 rounded border border-white/10 font-mono text-xs break-all">{currentPath}</code> does not correspond to an active Vectofi index or icon coordinate.
      </p>

      {/* Integrated Search Box */}
      <form onSubmit={handleSearchSubmit} className="mt-8 w-full max-w-md">
        <div className="relative flex items-center">
          <div className="absolute left-4 text-white/40 pointer-events-none">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search icon names or categories (e.g. arrow, bell, user)..."
            className="w-full pl-11 pr-24 py-3 rounded-xl border border-white/10 bg-white/5 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-sans"
          />
          <button
            type="submit"
            className="absolute right-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-xs transition-colors cursor-pointer"
          >
            Find Icon
          </button>
        </div>
      </form>

      {/* Primary Action Buttons */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => onNavigate('/')}
          className="px-6 py-2.5 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-500 text-white transition-colors shadow-md shadow-blue-600/20 cursor-pointer min-h-[44px]"
        >
          Return to Home
        </button>

        <button
          type="button"
          onClick={() => onNavigate('/icons')}
          className="px-6 py-2.5 rounded-xl font-bold text-sm border border-white/10 bg-white/5 hover:bg-white/10 text-white transition-colors cursor-pointer min-h-[44px]"
        >
          Browse All Icons
        </button>

        <button
          type="button"
          onClick={() => onNavigate('/categories')}
          className="px-5 py-2.5 rounded-xl font-medium text-xs border border-white/10 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer min-h-[44px]"
        >
          Categories
        </button>
      </div>

      {/* Breadcrumb suggestions */}
      <div className="mt-12 pt-6 border-t border-white/10 w-full max-w-md text-xs text-white/40 flex items-center justify-center gap-4">
        <span>Quick Navigation:</span>
        <button
          type="button"
          onClick={() => onNavigate('/animated')}
          className="text-blue-400 hover:underline cursor-pointer"
        >
          Animated
        </button>
        <span className="text-white/20">•</span>
        <button
          type="button"
          onClick={() => onNavigate('/collections')}
          className="text-blue-400 hover:underline cursor-pointer"
        >
          Collections
        </button>
        <span className="text-white/20">•</span>
        <button
          type="button"
          onClick={() => onNavigate('/docs')}
          className="text-blue-400 hover:underline cursor-pointer"
        >
          Docs
        </button>
      </div>
    </div>
  );
};
