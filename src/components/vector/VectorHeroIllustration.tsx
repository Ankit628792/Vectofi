import React, { useState } from 'react';
import { VectorStars, VectorOrbit, VectorDots } from './VectorDecorations';

interface VectorHeroIllustrationProps {
  className?: string;
  onExploreClick?: () => void;
}

export const VectorHeroIllustration: React.FC<VectorHeroIllustrationProps> = ({
  className = '',
  onExploreClick,
}) => {
  const [isAnimated, setIsAnimated] = useState(true);
  const [activeTab, setActiveTab] = useState<'transform' | 'pulse' | 'path'>('transform');

  return (
    <div className={`relative flex flex-col items-center justify-center select-none ${className}`}>
      {/* Background vector ambient glow and orbit */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <VectorOrbit className="text-indigo-500/40 dark:text-indigo-400/30 w-72 h-72 sm:w-96 sm:h-96" />
        <div className="absolute w-56 h-56 rounded-full bg-gradient-to-tr from-indigo-500/10 via-purple-500/15 to-transparent blur-2xl pointer-events-none" />
      </div>

      {/* Floating vector symbols: ✦, ○, ↗, < >, {}, ↻ */}
      <div className="absolute -top-4 sm:-top-6 flex items-center gap-1 text-indigo-600 dark:text-indigo-400 animate-vector-float pointer-events-none">
        <VectorStars size={24} />
      </div>

      <div className="absolute -left-4 sm:-left-8 top-1/4 text-purple-600 dark:text-purple-400 opacity-60 font-mono text-sm pointer-events-none animate-vector-float" style={{ animationDelay: '1s' }}>
        <span className="p-1.5 rounded-lg border border-purple-500/30 bg-purple-500/10 backdrop-blur-xs">&lt;svg&gt;</span>
      </div>

      <div className="absolute -right-4 sm:-right-8 top-1/3 text-emerald-600 dark:text-emerald-400 opacity-70 font-mono text-sm pointer-events-none animate-vector-float" style={{ animationDelay: '2.2s' }}>
        <span className="p-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-xs">&#123; path &#125;</span>
      </div>

      <div className="absolute -bottom-3 sm:-bottom-6 left-1/4 text-amber-500 dark:text-amber-400 opacity-80 pointer-events-none animate-vector-float" style={{ animationDelay: '3.5s' }}>
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="9" strokeDasharray="4 3" />
        </svg>
      </div>

      <div className="absolute -bottom-4 right-1/4 text-blue-500 dark:text-blue-400 opacity-80 pointer-events-none animate-vector-float" style={{ animationDelay: '1.8s' }}>
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M7 17L17 7M17 7H7M17 7V17" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Main Interactive Stage Box */}
      <div className="relative z-10 w-full max-w-md p-6 sm:p-8 rounded-2xl bg-white/85 dark:bg-[#141419]/90 backdrop-blur-md border border-slate-200/80 dark:border-zinc-800/80 shadow-2xl shadow-indigo-500/5 transition-all">
        {/* Top Header with coordinate indicators and state toggle */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-zinc-800/80 mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono font-medium text-slate-500 dark:text-zinc-400">
              VECTOR_ENGINE::v2.4
            </span>
          </div>

          {/* Static <-> Animated switch */}
          <div className="flex items-center p-0.5 rounded-lg bg-slate-100 dark:bg-zinc-800/90 border border-slate-200/60 dark:border-zinc-700/60">
            <button
              type="button"
              onClick={() => setIsAnimated(false)}
              className={`px-2.5 py-1 text-xs font-mono font-medium rounded-md transition-all ${
                !isAnimated
                  ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Static
            </button>
            <button
              type="button"
              onClick={() => setIsAnimated(true)}
              className={`px-2.5 py-1 text-xs font-mono font-medium rounded-md transition-all flex items-center gap-1 ${
                isAnimated
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-300 animate-ping" />
              Animated
            </button>
          </div>
        </div>

        {/* Center SVG Laboratory Stage */}
        <div
          onClick={() => setIsAnimated(!isAnimated)}
          className="group relative cursor-pointer flex flex-col items-center justify-center p-8 rounded-xl bg-slate-50/70 dark:bg-zinc-900/60 border border-slate-200/60 dark:border-zinc-800/60 hover:border-indigo-400 dark:hover:border-indigo-500/50 transition-all overflow-hidden"
          title="Click to toggle Static ↔ Animated"
        >
          {/* Subtle Stage Grid */}
          <div className="absolute inset-0 opacity-40 bg-vector-grid pointer-events-none" />

          {/* Coordinate Crosshairs */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-full h-px bg-slate-200/60 dark:bg-zinc-800/80" />
            <div className="absolute h-full w-px bg-slate-200/60 dark:bg-zinc-800/80" />
            <div className="absolute w-28 h-28 rounded-full border border-indigo-500/20 dark:border-indigo-400/20 pointer-events-none" />
          </div>

          {/* Interactive Icon Demonstration */}
          <div className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center text-indigo-600 dark:text-indigo-400 transition-transform group-hover:scale-105">
            {activeTab === 'transform' ? (
              <svg
                className="w-full h-full"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* Dynamic arrow / rocket vector with SVG motion */}
                {isAnimated ? (
                  <g className="origin-center animate-bounce">
                    <path d="M5 12h14M12 5l7 7-7 7" className="animate-vector-dash" />
                    <circle cx="12" cy="12" r="9" strokeDasharray="3 3" opacity="0.4" />
                  </g>
                ) : (
                  <g>
                    <path d="M5 12h14M12 5l7 7-7 7" />
                    <circle cx="12" cy="12" r="9" opacity="0.3" />
                  </g>
                )}
              </svg>
            ) : activeTab === 'pulse' ? (
              <svg
                className={`w-full h-full ${isAnimated ? 'animate-vector-pulse' : ''}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                {isAnimated && (
                  <circle cx="12" cy="11" r="3" fill="currentColor" fillOpacity="0.2" />
                )}
              </svg>
            ) : (
              <svg
                className={`w-full h-full ${isAnimated ? 'animate-spin' : ''}`}
                style={{ animationDuration: '4s' }}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                <polyline points="21 3 21 9 15 9" />
              </svg>
            )}
          </div>

          {/* Quick interactive hint badge */}
          <div className="relative z-10 mt-4 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-white dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700 shadow-xs group-hover:border-indigo-400">
            <span>{isAnimated ? '✦ Motion Active' : '○ Static Path'}</span>
            <span className="text-slate-400 dark:text-zinc-500">• click to toggle</span>
          </div>
        </div>

        {/* Bottom Presets & Inspector */}
        <div className="mt-5 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setActiveTab('transform')}
              className={`px-2 py-1 text-xs rounded font-mono transition-colors ${
                activeTab === 'transform'
                  ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'text-slate-500 dark:text-zinc-400 hover:text-slate-800'
              }`}
            >
              Arrow
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('pulse')}
              className={`px-2 py-1 text-xs rounded font-mono transition-colors ${
                activeTab === 'pulse'
                  ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'text-slate-500 dark:text-zinc-400 hover:text-slate-800'
              }`}
            >
              Heart
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('path')}
              className={`px-2 py-1 text-xs rounded font-mono transition-colors ${
                activeTab === 'path'
                  ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'text-slate-500 dark:text-zinc-400 hover:text-slate-800'
              }`}
            >
              Sync
            </button>
          </div>

          <div className="text-[11px] font-mono text-slate-400 dark:text-zinc-500">
            24x24 • viewBox
          </div>
        </div>
      </div>
    </div>
  );
};
