import React, { useState } from 'react';
import { IconItem } from '../types';
import {
  VectorGrid,
  VectorOrbit,
  VectorStars,
  VectorDots,
  VectorLines,
  VectorBadge,
  VectorPattern,
  VectorHeroIllustration,
  VectorSystemShowcase,
} from '../components/vector';
import { IconCard } from '../components/icons/IconCard';
import { CATEGORIES } from '../data/categories';
import { AnimatedIconRenderer } from '../components/icons/AnimatedIconRenderer';

interface HomePageProps {
  icons: IconItem[];
  favorites: string[];
  onToggleFavorite: (icon: IconItem) => void;
  onSelectIcon: (icon: IconItem) => void;
  onQuickCopy: (icon: IconItem, e: React.MouseEvent) => void;
  onQuickDownload: (icon: IconItem, e: React.MouseEvent) => void;
  onNavigate: (route: string) => void;
  onFilterCategory: (catId: string) => void;
  onOpenSearch: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  icons,
  favorites,
  onToggleFavorite,
  onSelectIcon,
  onQuickCopy,
  onQuickDownload,
  onNavigate,
  onFilterCategory,
  onOpenSearch,
}) => {
  const [heroSearch, setHeroSearch] = useState('');

  const featuredIcons = icons.slice(0, 12);
  const animatedIcons = icons.filter(i => i.hasAnimation).slice(0, 8);

  const handleHeroSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      onNavigate(`/icons?q=${encodeURIComponent(heroSearch.trim())}`);
    } else {
      onNavigate('/icons');
    }
  };

  return (
    <div className="relative overflow-hidden bg-[#050505] text-[#e5e5e5]">
      {/* SECTION 1: HERO SECTION matching Sophisticated Dark design */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-white/10 overflow-hidden">
        {/* Crisp Vector Grid Pattern matching Design HTML */}
        <div className="absolute inset-0 pointer-events-none opacity-25 bg-vector-grid" />
        
        {/* Subtle radial glow and vector stars */}
        <div className="absolute top-1/4 left-1/3 -translate-x-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <VectorStars className="absolute top-8 left-8 opacity-60" size={28} color="#3b82f6" />
        <VectorDots className="absolute bottom-6 left-8 opacity-25" rows={4} cols={8} color="#3b82f6" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content (7 cols) */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Feature Pill with VectorBadge */}
              <div>
                <VectorBadge
                  text="Version 2.4 Live"
                  subtext="110+ SVGs"
                  variant="tech"
                  color="#3b82f6"
                  statusPulse={true}
                />
              </div>

              {/* Main Headline with Gradient */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-white leading-tight tracking-tight">
                The engine for <br />
                <span className="font-bold italic text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                  Motion-First
                </span>{' '}
                vector design.
              </h1>

              {/* Subheadline */}
              <p className="text-base sm:text-lg text-white/50 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                A premium collection of production-ready SVG icons with native CSS and framework support. Built for developers by vector and motion designers.
              </p>

              {/* Instant Search Bar inside Hero */}
              <form
                onSubmit={handleHeroSearchSubmit}
                className="relative max-w-md mx-auto lg:mx-0 pt-1"
              >
                <div className="relative flex items-center">
                  <div className="absolute left-4 text-white/40">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={heroSearch}
                    onChange={e => setHeroSearch(e.target.value)}
                    placeholder="Search 110+ icons (e.g. arrow, heart, code, rocket)..."
                    className="w-full pl-11 pr-28 py-3 rounded-full border border-white/10 bg-white/5 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 font-sans transition-all"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Search
                  </button>
                </div>
              </form>

              {/* Hero Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <button
                  type="button"
                  onClick={() => onNavigate('/icons')}
                  className="bg-blue-600 px-8 py-3 rounded-xl font-bold text-sm text-white hover:bg-blue-500 shadow-lg shadow-blue-600/20 transition-all cursor-pointer whitespace-nowrap"
                >
                  Browse the Gallery
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('/docs')}
                  className="border border-white/10 bg-white/5 px-8 py-3 rounded-xl font-bold text-sm text-white hover:bg-white/10 transition-all cursor-pointer whitespace-nowrap"
                >
                  View Documentation
                </button>
              </div>

              {/* Statistics Row */}
              <div className="pt-4 grid grid-cols-3 sm:grid-cols-4 gap-4 border-t border-white/10 max-w-lg mx-auto lg:mx-0 text-left">
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-white font-display">
                    110+
                  </p>
                  <p className="text-xs font-mono text-white/40 whitespace-nowrap">
                    Vector Icons
                  </p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-blue-400 font-display">
                    90+
                  </p>
                  <p className="text-xs font-mono text-white/40 whitespace-nowrap">
                    Animated
                  </p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-white font-display">
                    14
                  </p>
                  <p className="text-xs font-mono text-white/40 whitespace-nowrap">
                    Categories
                  </p>
                </div>
                <div className="hidden sm:block">
                  <p className="text-xl sm:text-2xl font-bold text-emerald-400 font-display">
                    100%
                  </p>
                  <p className="text-xs font-mono text-white/40 whitespace-nowrap">
                    Free MIT
                  </p>
                </div>
              </div>
            </div>

            {/* Right Interactive Vector Illustration (5 cols) with VectorOrbit */}
            <div className="lg:col-span-5 flex justify-center relative">
              <VectorOrbit
                className="absolute -top-10 -right-8 opacity-25 pointer-events-none"
                size={340}
                color="#3b82f6"
                rings={3}
                satellites={true}
              />
              <VectorHeroIllustration />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: FEATURED ANIMATED ICONS STRIP */}
      <section className="py-12 bg-[#0a0a0a] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-white/60">
                  Featured Animated Icons
                </h3>
              </div>
              <p className="text-xs text-white/40 mt-0.5">
                Self-contained CSS animations embedded natively in every SVG.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('/animated')}
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
            >
              <span>View all {icons.filter(i => i.hasAnimation).length}+ animations</span>
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>

          {/* Animated Icons Grid matching Design HTML aspect-square cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {animatedIcons.map((icon, idx) => {
              const colorClasses = [
                'text-blue-400',
                'text-cyan-400',
                'text-indigo-400',
                'text-purple-400',
              ];
              const accentColor = colorClasses[idx % colorClasses.length];

              return (
                <div
                  key={icon.slug}
                  onClick={() => onSelectIcon(icon)}
                  className="aspect-square bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center justify-center group hover:border-blue-500/50 hover:bg-blue-500/5 transition-all cursor-pointer p-2"
                >
                  <div className={`${accentColor} group-hover:scale-110 transition-transform`}>
                    <AnimatedIconRenderer
                      icon={icon}
                      size={32}
                      strokeWidth={1.8}
                      animated={true}
                    />
                  </div>
                  <span className="text-[10px] mt-2 font-medium text-white/40 group-hover:text-white font-mono truncate max-w-full">
                    {icon.slug}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 3: VECTOR-FIRST VALUE PROPOSITIONS */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">
            Engineered For Developers
          </span>
          <h2 className="text-3xl sm:text-4xl font-light text-white tracking-tight">
            Not just pictures. <span className="font-bold">Precision code.</span>
          </h2>
          <p className="text-sm sm:text-base text-white/50 leading-relaxed">
            Every icon is crafted with mathematical precision on a strict 24x24 grid, ready to be customized and exported into modern frameworks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="p-8 rounded-2xl border border-white/10 bg-white/5 hover:border-blue-500/40 hover:bg-blue-500/5 transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <h3 className="font-bold text-lg text-white font-display">
              Self-Contained Motion
            </h3>
            <p className="text-sm text-white/50 leading-relaxed">
              Our animated SVG files include encapsulated CSS keyframes. They animate seamlessly inside standard HTML images and background tags with zero JS runtime.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-8 rounded-2xl border border-white/10 bg-white/5 hover:border-blue-500/40 hover:bg-blue-500/5 transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
              </svg>
            </div>
            <h3 className="font-bold text-lg text-white font-display">
              6+ Framework Formats
            </h3>
            <p className="text-sm text-white/50 leading-relaxed">
              Export pure SVG, React JSX with typed props, Vue 3 Script Setup, Svelte components, Angular components, or CSS Data URIs with one click.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-8 rounded-2xl border border-white/10 bg-white/5 hover:border-blue-500/40 hover:bg-blue-500/5 transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </div>
            <h3 className="font-bold text-lg text-white font-display">
              Interactive Laboratory
            </h3>
            <p className="text-sm text-white/50 leading-relaxed">
              Every icon includes a full sandbox. Test light, dark, and transparent backgrounds, adjust stroke weight from hairline to bold, and test animation speeds.
            </p>
          </div>
        </div>
      </section>

      {/* VECTOR DECORATION SYSTEM SHOWCASE (PHASE 2 SPECIFICATION) */}
      <VectorSystemShowcase />

      {/* SECTION 4: FEATURED ICONS GRID */}
      <section className="relative py-16 bg-[#0a0a0a] border-y border-white/10 overflow-hidden">
        {/* Interactive precision VectorGrid with magnet points */}
        <div className="absolute inset-0 pointer-events-none">
          <VectorGrid
            className="w-full h-full"
            gridSize={48}
            strokeColor="#3b82f6"
            accentColor="#38bdf8"
            opacity={0.12}
            crosshairs={true}
            dots={true}
            interactive={true}
            magnetPoints={true}
            snapRadius={90}
            showCoordinates={true}
            showTether={true}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-white font-display">
                  Featured Icons
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-mono text-blue-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  Magnet Grid
                </span>
              </div>
              <p className="text-sm text-white/50">
                A selection of popular vector assets across interface, development, and commerce.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('/icons')}
              className="px-5 py-2.5 rounded-full text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition-colors flex items-center gap-1.5 shadow-md shadow-blue-600/20 cursor-pointer whitespace-nowrap shrink-0"
            >
              <span>Explore All 110+ Icons</span>
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>

          {/* Grid of featured icons */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {featuredIcons.map(icon => (
              <IconCard
                key={icon.slug}
                icon={icon}
                isFavorite={favorites.includes(icon.slug)}
                onToggleFavorite={onToggleFavorite}
                onSelectIcon={onSelectIcon}
                onQuickCopy={onQuickCopy}
                onQuickDownload={onQuickDownload}
              />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: CATEGORIES SHOWCASE */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">
            Browse By Category
          </span>
          <h2 className="text-3xl font-bold text-white font-display">
            14 Comprehensive Categories
          </h2>
          <p className="text-sm text-white/50">
            Organized to help you find the exact vector icon your interface needs.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {CATEGORIES.map(cat => (
            <div
              key={cat.id}
              onClick={() => {
                onFilterCategory(cat.id);
                onNavigate('/icons');
              }}
              className="group p-5 rounded-2xl border border-white/10 bg-white/5 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-white/80 group-hover:border-blue-500/50 group-hover:text-blue-400 group-hover:bg-blue-500/10 transition-colors flex items-center justify-center font-mono text-base">
                  <span>{cat.iconSymbol}</span>
                </div>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-white/5 text-white/40 border border-white/10">
                  {cat.iconCount} icons
                </span>
              </div>

              <h4 className="font-semibold text-sm text-white group-hover:text-blue-400 transition-colors">
                {cat.name}
              </h4>
              <p className="text-xs text-white/40 mt-1 line-clamp-2">
                {cat.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 6: VECTOR CALL TO ACTION */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-[#0a0a0a] border border-white/10 text-white p-8 sm:p-12 lg:p-16 overflow-hidden shadow-2xl">
          {/* Reusable VectorPattern in banner background */}
          <VectorPattern
            variant="circuit"
            patternSize={44}
            strokeColor="#3b82f6"
            opacity={0.12}
            className="absolute inset-0 pointer-events-none"
          />
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-4">
            <VectorBadge
              text="Open Source"
              subtext="MIT Licensed"
              variant="shield"
              color="#3b82f6"
              statusPulse={true}
            />
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight">
              Start building with Vectofi today.
            </h2>
            <p className="text-white/60 text-sm sm:text-base leading-relaxed">
              No API keys, no subscriptions, no attribution required. Download SVG files or copy ready-to-use framework components directly into your codebase.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={() => onNavigate('/icons')}
                className="px-6 py-3 rounded-xl font-bold text-sm bg-blue-600 text-white hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20 cursor-pointer whitespace-nowrap"
              >
                Browse All Icons
              </button>
              <button
                type="button"
                onClick={() => onNavigate('/docs')}
                className="px-6 py-3 rounded-xl font-bold text-sm border border-white/10 bg-white/5 text-white hover:bg-white/10 transition-colors cursor-pointer whitespace-nowrap"
              >
                Read Framework Docs
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
