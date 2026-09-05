import React, { useState, useEffect } from 'react';

interface InitialLoaderProps {
  onComplete?: () => void;
  minDisplayTimeMs?: number;
}

export const InitialLoader: React.FC<InitialLoaderProps> = ({
  onComplete,
  minDisplayTimeMs = 700,
}) => {
  const [stage, setStage] = useState<'loading' | 'finishing' | 'done'>('loading');
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    // Progress interval for realistic vector system initialization
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return prev + Math.floor(Math.random() * 20) + 10;
      });
    }, 120);

    // Minimum display timer before initiating smooth fadeout
    const timer = setTimeout(() => {
      setProgress(100);
      setStage('finishing');
      const finishTimer = setTimeout(() => {
        setStage('done');
        onComplete?.();
      }, 400);

      return () => clearTimeout(finishTimer);
    }, minDisplayTimeMs);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timer);
    };
  }, [minDisplayTimeMs, onComplete]);

  if (stage === 'done') return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050505] transition-opacity duration-400 ease-out select-none ${
        stage === 'finishing' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      aria-live="polite"
      role="status"
    >
      {/* Background ambient grid pattern */}
      <div className="absolute inset-0 bg-vector-grid opacity-20 pointer-events-none" />

      {/* Subtle radial glow */}
      <div className="absolute w-72 h-72 rounded-full bg-blue-600/15 blur-3xl pointer-events-none animate-pulse" />

      {/* Central Vector Logo & Loader Frame */}
      <div className="relative z-10 flex flex-col items-center max-w-xs px-6 text-center space-y-5">
        {/* Animated Vector Logo Mark */}
        <div className="relative w-20 h-20 flex items-center justify-center">
          {/* Outer rotating vector orbit ring */}
          <svg
            className="absolute inset-0 w-full h-full text-blue-500/30 animate-spin"
            style={{ animationDuration: '8s' }}
            viewBox="0 0 80 80"
            fill="none"
          >
            <circle
              cx="40"
              cy="40"
              r="36"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray="6 6"
            />
          </svg>

          {/* Core Vectofi SVG Emblem */}
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-xl shadow-blue-500/30 transition-transform transform">
            <svg
              className="w-8 h-8 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Vectofi V/Vector node path */}
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>

          {/* Active pulse node */}
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-blue-500 border-2 border-[#050505]" />
          </span>
        </div>

        {/* Brand Name & Tagline */}
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-1.5">
            <h1 className="text-2xl font-bold font-display tracking-tight text-white">
              Vecto<span className="text-blue-400">fi</span>
            </h1>
            <span className="px-1.5 py-0.5 text-[9px] font-mono uppercase tracking-wider rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 font-bold">
              v2.4
            </span>
          </div>
          <p className="text-xs text-white/50 font-mono tracking-wide">
            Vector Design & Motion Engine
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full space-y-2 pt-1">
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/5">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-150 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] font-mono text-white/40 px-0.5">
            <span>Loading 110+ SVGs</span>
            <span>{Math.min(progress, 100)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
