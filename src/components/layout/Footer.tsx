import React from 'react';

interface FooterProps {
  onNavigate: (route: string) => void;
  onOpenShortcuts: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenShortcuts }) => {
  return (
    <footer className="relative border-t border-white/10 bg-[#0a0a0a] text-[#e5e5e5] overflow-hidden transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-14 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Col 1: Brand & Status */}
          <div className="lg:col-span-2 space-y-4">
            <div
              onClick={() => onNavigate('/')}
              className="flex items-center gap-3 cursor-pointer group select-none"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m7.5 4.27 9 5.15" />
                  <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                  <path d="m3.3 7 8.7 5 8.7-5" />
                  <path d="M12 22V12" />
                </svg>
              </div>
              <span className="font-display font-bold text-lg text-white">
                Vecto<span className="text-blue-500">fi</span>
              </span>
            </div>

            <p className="text-sm text-white/50 max-w-sm leading-relaxed">
              A premium collection of production-ready static and animated SVG icons with native CSS keyframes, SVG laboratory customizer, and multi-framework exports.
            </p>

            <div className="pt-1 flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block animate-pulse" />
                110+ Vector Icons
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded-full bg-white/5 text-white/60 border border-white/10">
                MIT License
              </span>
            </div>
          </div>

          {/* Col 2: Explore */}
          <div>
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-white/40 mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/icons')}
                  className="text-white/60 hover:text-blue-400 transition-colors cursor-pointer"
                >
                  All Icons
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/animated')}
                  className="text-white/60 hover:text-blue-400 transition-colors cursor-pointer"
                >
                  Animated Icons
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/categories')}
                  className="text-white/60 hover:text-blue-400 transition-colors cursor-pointer"
                >
                  Categories
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/collections')}
                  className="text-white/60 hover:text-blue-400 transition-colors cursor-pointer"
                >
                  Collections
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/favorites')}
                  className="text-white/60 hover:text-blue-400 transition-colors cursor-pointer"
                >
                  Saved Favorites
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Frameworks */}
          <div>
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-white/40 mb-4">
              Frameworks
            </h4>
            <ul className="space-y-2.5 text-sm text-white/60">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/docs')}
                  className="hover:text-blue-400 transition-colors cursor-pointer"
                >
                  React & Next.js
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/docs')}
                  className="hover:text-blue-400 transition-colors cursor-pointer"
                >
                  Vue 3
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/docs')}
                  className="hover:text-blue-400 transition-colors cursor-pointer"
                >
                  Svelte
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/docs')}
                  className="hover:text-blue-400 transition-colors cursor-pointer"
                >
                  Angular
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/docs')}
                  className="hover:text-blue-400 transition-colors cursor-pointer"
                >
                  CSS Data URI
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Resources */}
          <div>
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-white/40 mb-4">
              Resources
            </h4>
            <ul className="space-y-2.5 text-sm text-white/60">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/docs')}
                  className="hover:text-blue-400 transition-colors cursor-pointer"
                >
                  Documentation
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/license')}
                  className="hover:text-blue-400 transition-colors cursor-pointer"
                >
                  MIT License
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenShortcuts}
                  className="hover:text-blue-400 transition-colors cursor-pointer"
                >
                  Shortcuts (press ?)
                </button>
              </li>
              <li>
                <a
                  href="https://github.com/Ankit628792/Vectofi"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-blue-400 transition-colors inline-flex items-center gap-1"
                >
                  GitHub Repository
                  <svg className="w-3 h-3 text-white/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: System Status, Author Attribution & Metrics */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 font-mono">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
              <span>CDN Status: Optimal</span>
            </div>
            <span className="text-white/20 hidden sm:inline">|</span>
            <span>Registry: 120+ Production SVGs</span>
          </div>

          {/* Creator Attribution */}
          <div className="flex items-center gap-1.5 text-xs text-white/60 font-medium">
            <span>Designed &amp; Developed by</span>
            <a
              href="https://www.instagram.com/ankit_628792"
              target="_blank"
              rel="noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors font-semibold inline-flex items-center gap-1 group cursor-pointer"
            >
              <span>Ankit Kumar</span>
              <svg
                className="w-3 h-3 text-blue-400/70 group-hover:text-blue-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
};
