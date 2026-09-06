import React, { useState, useMemo } from 'react';
import { VectorStars, VectorOrbit, VectorDots } from './VectorDecorations';
import { calculateCreationFromNoneFrames } from '../../utils/animations';

interface VectorHeroIllustrationProps {
  className?: string;
  onExploreClick?: () => void;
}

const HERO_ICON_PATHS = {
  sparkle: 'M 12 2 L 14.5 9.5 L 22 12 L 14.5 14.5 L 12 22 L 9.5 14.5 L 2 12 L 9.5 9.5 Z',
  heart: 'M 12 21.35 C 5.4 15.36 2 12.28 2 8.5 C 2 5.42 4.42 3 7.5 3 C 9.24 3 10.91 3.81 12 5.09 C 13.09 3.81 14.76 3 16.5 3 C 19.58 3 22 5.42 22 8.5 C 22 12.28 18.6 15.36 12 21.35 Z',
  arrow: 'M 5 12 L 19 12 M 13 6 L 19 12 L 13 18',
};

export const VectorHeroIllustration: React.FC<VectorHeroIllustrationProps> = ({
  className = '',
  onExploreClick,
}) => {
  const [isAnimated, setIsAnimated] = useState(true);
  const [activeTab, setActiveTab] = useState<'sparkle' | 'heart' | 'arrow'>('sparkle');

  // Precalculate intermediate SVG morph frames showing creation of final icon from none
  const sparkleValues = useMemo(() => {
    return calculateCreationFromNoneFrames(HERO_ICON_PATHS.sparkle, 14).join(';');
  }, []);

  const heartValues = useMemo(() => {
    return calculateCreationFromNoneFrames(HERO_ICON_PATHS.heart, 14).join(';');
  }, []);

  const arrowValues = useMemo(() => {
    return calculateCreationFromNoneFrames(HERO_ICON_PATHS.arrow, 14).join(';');
  }, []);

  const currentFinalPath = HERO_ICON_PATHS[activeTab];
  const currentValues =
    activeTab === 'sparkle'
      ? sparkleValues
      : activeTab === 'heart'
      ? heartValues
      : arrowValues;

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

          {/* Interactive Icon Demonstration with Native SVG Path Morphing from None */}
          <div className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center text-indigo-600 dark:text-indigo-400 transition-transform group-hover:scale-105">
            <svg
              key={`${activeTab}-${isAnimated ? 'anim' : 'static'}`}
              className="w-full h-full"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d={currentFinalPath}>
                {isAnimated && (
                  <animate
                    attributeName="d"
                    dur="2.4s"
                    repeatCount="indefinite"
                    values={currentValues}
                  />
                )}
              </path>
            </svg>
          </div>

          {/* Quick interactive hint badge */}
          <div className="relative z-10 mt-4 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-white dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700 shadow-xs group-hover:border-indigo-400">
            <span>{isAnimated ? '✦ Morph: Creation from None' : '○ Static Final Icon'}</span>
            <span className="text-slate-400 dark:text-zinc-500">• click to toggle</span>
          </div>
        </div>

        {/* Bottom Presets & Inspector */}
        <div className="mt-5 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setActiveTab('sparkle')}
              className={`px-2 py-1 text-xs rounded font-mono transition-colors ${
                activeTab === 'sparkle'
                  ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'text-slate-500 dark:text-zinc-400 hover:text-slate-800'
              }`}
            >
              Sparkle Star
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('heart')}
              className={`px-2 py-1 text-xs rounded font-mono transition-colors ${
                activeTab === 'heart'
                  ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'text-slate-500 dark:text-zinc-400 hover:text-slate-800'
              }`}
            >
              Heart
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('arrow')}
              className={`px-2 py-1 text-xs rounded font-mono transition-colors ${
                activeTab === 'arrow'
                  ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'text-slate-500 dark:text-zinc-400 hover:text-slate-800'
              }`}
            >
              Arrow
            </button>
          </div>

          <div className="text-[11px] font-mono text-slate-400 dark:text-zinc-500">
            None → Final Icon
          </div>
        </div>
      </div>
    </div>
  );
};
