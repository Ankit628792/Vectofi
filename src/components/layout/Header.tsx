import React, { useState } from 'react';

interface HeaderProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  onOpenCommandPalette: () => void;
  favoritesCount: number;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  reducedMotion: boolean;
  onToggleReducedMotion: () => void;
  onOpenShortcuts: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRoute,
  onNavigate,
  onOpenCommandPalette,
  favoritesCount,
  darkMode,
  onToggleDarkMode,
  reducedMotion,
  onToggleReducedMotion,
  onOpenShortcuts,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Icons', route: '/icons' },
    { label: 'Animated', route: '/animated', badge: 'Motion' },
    { label: 'Categories', route: '/categories' },
    { label: 'Collections', route: '/collections' },
    { label: 'Docs', route: '/docs' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 backdrop-blur-md bg-[#0a0a0a]/90 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo: Sophisticated Dark Brand */}
        <div
          onClick={() => onNavigate('/')}
          className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
        >
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/25 group-hover:scale-105 transition-transform">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="group-hover:rotate-6 transition-transform"
            >
              <path d="m7.5 4.27 9 5.15" />
              <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
              <path d="m3.3 7 8.7 5 8.7-5" />
              <path d="M12 22V12" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-bold tracking-tight text-white font-display">
                Vecto<span className="text-blue-500">fi</span>
              </span>
              <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                PRO
              </span>
            </div>
          </div>
        </div>

        {/* Desktop Navigation with refined underline indicator */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navLinks.map(link => {
            const isActive = currentRoute === link.route;
            return (
              <button
                key={link.route}
                type="button"
                onClick={() => onNavigate(link.route)}
                className={`relative py-1 transition-colors flex items-center gap-1.5 ${
                  isActive
                    ? 'text-white font-semibold border-b-2 border-blue-500'
                    : 'text-white/60 hover:text-blue-400'
                }`}
              >
                {link.label}
                {link.badge && (
                  <span className="px-1.5 py-0.2 text-[9px] font-mono uppercase font-bold rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    {link.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Action Bar */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Search Trigger matching Design HTML (expanded on desktop, compact on tablet) */}
          <div
            onClick={onOpenCommandPalette}
            className="relative group cursor-pointer hidden sm:flex items-center"
          >
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <svg className="w-3.5 h-3.5 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-full py-1.5 pl-9 pr-10 text-xs w-44 md:w-56 lg:w-64 text-white/60 group-hover:border-blue-500/50 group-hover:bg-white/[0.08] transition-all flex items-center justify-between">
              <span className="truncate">Search 110+ icons...</span>
              <kbd className="absolute right-2.5 top-1.5 text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-white/40 border border-white/10 font-mono">
                ⌘K
              </kbd>
            </div>
          </div>

          {/* Mobile Search Icon Button */}
          <button
            type="button"
            onClick={onOpenCommandPalette}
            className="sm:hidden min-w-[38px] min-h-[38px] p-2 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center"
            aria-label="Search icons"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* Favorites Button with Counter */}
          <button
            type="button"
            onClick={() => onNavigate('/favorites')}
            className={`relative min-w-[38px] min-h-[38px] p-2 rounded-xl border transition-colors flex items-center justify-center ${
              currentRoute === '/favorites'
                ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                : 'bg-white/5 border-white/10 text-white/70 hover:text-rose-400 hover:bg-white/10'
            }`}
            title="View Favorites"
            aria-label="Favorites"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill={favoritesCount > 0 ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {favoritesCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center shadow-xs">
                {favoritesCount}
              </span>
            )}
          </button>

          {/* Global Reduced Motion Toggle Button */}
          <button
            type="button"
            onClick={onToggleReducedMotion}
            className={`hidden sm:flex min-w-[38px] min-h-[38px] px-2.5 py-1.5 rounded-xl border transition-all items-center gap-1.5 cursor-pointer select-none ${
              reducedMotion
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm shadow-amber-500/10'
                : 'bg-white/5 border-white/10 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20'
            }`}
            title={
              reducedMotion
                ? 'Reduced motion is active (All CSS & SVG animations disabled) — Press M to resume'
                : 'Animations active — Click or press M to disable animations (Reduced Motion)'
            }
            aria-label={reducedMotion ? 'Disable reduced motion' : 'Enable reduced motion'}
            aria-pressed={reducedMotion}
          >
            {reducedMotion ? (
              <>
                <svg className="w-3.5 h-3.5 text-amber-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
                <span className="hidden lg:inline text-[11px] font-mono font-medium tracking-tight">Motion: Off</span>
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5 text-blue-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                <span className="hidden lg:inline text-[11px] font-mono text-white/70 tracking-tight">Motion: On</span>
              </>
            )}
          </button>

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={onToggleDarkMode}
            className="min-w-[38px] min-h-[38px] p-2 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center cursor-pointer"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? (
              <svg className="w-4 h-4 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            )}
          </button>

          {/* GitHub Repository Link */}
          <a
            href="https://github.com/Ankit628792/Vectofi"
            target="_blank"
            rel="noreferrer"
            className="min-w-[38px] min-h-[38px] p-2 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center cursor-pointer"
            title="GitHub Repository"
            aria-label="GitHub Repository"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
            </svg>
          </a>

          {/* CTA Button matching Design HTML */}
          <button
            type="button"
            onClick={() => onNavigate('/icons')}
            className="hidden lg:inline-flex bg-white text-black font-semibold text-xs px-4 py-2 rounded-full hover:bg-blue-400 hover:text-black transition-colors shrink-0 shadow-sm cursor-pointer"
          >
            Browse Library
          </button>

          {/* Mobile Menu Toggle Button (Touch Friendly) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden min-w-[42px] min-h-[42px] p-2 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white flex items-center justify-center transition-colors"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileMenuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation with Enhanced Layout */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#0a0a0a]/98 backdrop-blur-xl px-4 pt-3 pb-6 space-y-2 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="space-y-1">
            {navLinks.map(link => (
              <button
                key={link.route}
                type="button"
                onClick={() => {
                  onNavigate(link.route);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium flex items-center justify-between transition-colors min-h-[44px] ${
                  currentRoute === link.route
                    ? 'bg-blue-600/20 text-blue-400 font-semibold border border-blue-500/30'
                    : 'text-white/80 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className="px-2 py-0.5 text-[10px] font-mono rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    {link.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Quick Mobile Action Utilities */}
          <div className="pt-3 border-t border-white/10 grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => onToggleDarkMode()}
              className="px-2 py-2 rounded-xl text-xs font-mono border border-white/10 bg-white/5 text-white/70 hover:text-white hover:bg-white/10 flex items-center justify-center gap-1 min-h-[44px] cursor-pointer"
            >
              <span>{darkMode ? '☀️ Light' : '🌙 Dark'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onToggleReducedMotion();
              }}
              className={`px-2 py-2 rounded-xl text-xs font-mono border transition-colors flex items-center justify-center gap-1 min-h-[44px] cursor-pointer ${
                reducedMotion
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-semibold'
                  : 'bg-white/5 border-white/10 text-white/70 hover:text-white'
              }`}
              aria-label="Toggle Reduced Motion"
              aria-pressed={reducedMotion}
            >
              <span>{reducedMotion ? '⏸ Motion: Off' : '▶ Motion: On'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onOpenShortcuts();
                setMobileMenuOpen(false);
              }}
              className="px-2 py-2 rounded-xl text-xs font-mono border border-white/10 bg-white/5 text-white/60 hover:text-white hover:bg-white/10 flex items-center justify-center gap-1 min-h-[44px] cursor-pointer"
            >
              <span>Keys (?)</span>
            </button>
          </div>

          <div className="pt-2 space-y-2">
            <a
              href="https://github.com/Ankit628792/Vectofi"
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 rounded-xl text-xs font-mono font-medium bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 flex items-center justify-center gap-2 transition-colors min-h-[44px]"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
              </svg>
              <span>GitHub Repository</span>
              <svg className="w-3.5 h-3.5 text-white/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </a>

            <button
              type="button"
              onClick={() => {
                onNavigate('/icons');
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 rounded-xl text-xs font-bold font-mono bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 min-h-[44px]"
            >
              <span>Browse 110+ SVG Library</span>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
