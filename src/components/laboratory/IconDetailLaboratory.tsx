import React, { useState, useEffect } from 'react';
import { IconItem, FrameworkType, LaboratorySettings, CollectionItem } from '../../types';
import { AnimatedIconRenderer } from '../icons/AnimatedIconRenderer';
import { generateFrameworkCode, downloadSvgFile } from '../../utils/svgExport';

interface IconDetailLaboratoryProps {
  icon: IconItem;
  allIcons: IconItem[];
  isOpen: boolean;
  onClose: () => void;
  onSelectIcon: (icon: IconItem) => void;
  isFavorite: boolean;
  onToggleFavorite: (icon: IconItem) => void;
  onShowToast: (title: string, message?: string, type?: 'success' | 'favorite' | 'download') => void;
  collections: CollectionItem[];
  onAddToCollection: (collectionId: string, iconSlug: string) => void;
}

export const IconDetailLaboratory: React.FC<IconDetailLaboratoryProps> = ({
  icon,
  allIcons,
  isOpen,
  onClose,
  onSelectIcon,
  isFavorite,
  onToggleFavorite,
  onShowToast,
  collections,
  onAddToCollection,
}) => {
  const [activeTab, setActiveTab] = useState<FrameworkType>('react');
  const [compareMode, setCompareMode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showCollectionMenu, setShowCollectionMenu] = useState(false);

  // Playground settings state
  const [settings, setSettings] = useState<LaboratorySettings>({
    size: 48,
    color: '#60A5FA', // blue default in Sophisticated Dark
    strokeWidth: 2,
    background: 'transparent',
    customBgColor: '#050505',
    animated: icon.hasAnimation,
    speed: 1,
    loop: true,
    isPlaying: true,
  });

  // When icon changes, reset animated mode if the new icon has animation
  useEffect(() => {
    setSettings(prev => ({
      ...prev,
      animated: icon.hasAnimation,
      isPlaying: true,
    }));
  }, [icon.slug, icon.hasAnimation]);

  // Handle keyboard shortcuts when laboratory is open
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when editing input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        handleCopyCode();
      } else if (e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        handleDownload(settings.animated);
      } else if (e.key === 'ArrowRight') {
        const currentIndex = allIcons.findIndex(i => i.slug === icon.slug);
        if (currentIndex < allIcons.length - 1) {
          onSelectIcon(allIcons[currentIndex + 1]);
        }
      } else if (e.key === 'ArrowLeft') {
        const currentIndex = allIcons.findIndex(i => i.slug === icon.slug);
        if (currentIndex > 0) {
          onSelectIcon(allIcons[currentIndex - 1]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, icon, allIcons, settings, activeTab]);

  if (!isOpen) return null;

  // Find related icons in same category
  const relatedIcons = allIcons
    .filter(i => i.category === icon.category && i.slug !== icon.slug)
    .slice(0, 6);

  const handleCopyCode = () => {
    const code = generateFrameworkCode(icon, activeTab, settings);
    navigator.clipboard.writeText(code);
    setCopied(true);
    onShowToast(`Copied ${activeTab.toUpperCase()} code!`, `${icon.name} ready to paste.`);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopySvg = () => {
    const svgCode = generateFrameworkCode(icon, 'svg', settings);
    navigator.clipboard.writeText(svgCode);
    onShowToast('SVG code copied!', `${icon.name} markup in clipboard.`);
  };

  const handleDownload = (asAnimated: boolean) => {
    downloadSvgFile(icon, asAnimated, settings);
    onShowToast(
      'Download started',
      `${icon.slug}${asAnimated ? '-animated' : ''}.svg saved.`,
      'download'
    );
  };

  // Stage background styling
  let stageBgClass = 'bg-black text-white';
  let customStyle: React.CSSProperties = {};

  if (settings.background === 'light') {
    stageBgClass = 'bg-white text-slate-900';
  } else if (settings.background === 'dark') {
    stageBgClass = 'bg-[#050505] text-white';
  } else if (settings.background === 'checkerboard') {
    stageBgClass = 'bg-checkerboard-dark';
  } else if (settings.background === 'custom') {
    customStyle = { backgroundColor: settings.customBgColor };
  }

  const generatedCode = generateFrameworkCode(icon, activeTab, settings);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-1.5 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label={`${icon.name} SVG Laboratory`}
    >
      <div className="relative w-full max-w-5xl my-auto rounded-2xl bg-[#0a0a0a] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[96vh] sm:max-h-[92vh] text-[#e5e5e5]">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-3.5 sm:px-6 py-3 sm:py-4 border-b border-white/10 bg-[#050505]/80">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 pr-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse shrink-0" />
            <h2 className="font-display font-bold text-sm sm:text-lg text-white flex items-center gap-1.5 truncate">
              <span className="truncate">{icon.name}</span>
              <span className="text-[11px] font-mono font-normal text-white/40 hidden sm:inline">
                ({icon.slug}.svg)
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Add to Collection Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowCollectionMenu(!showCollectionMenu)}
                className="px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/5 text-xs font-mono text-white/70 hover:bg-white/10 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer min-h-[36px]"
                title="Add to collection"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
                <span className="hidden xs:inline">Collect</span>
              </button>

              {/* Collections dropdown */}
              {showCollectionMenu && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-[#101014] border border-white/10 shadow-xl p-2 z-20 space-y-1">
                  <p className="text-[11px] font-mono text-white/40 px-2 py-1">Save to collection:</p>
                  {collections.map(col => (
                    <button
                      key={col.id}
                      type="button"
                      onClick={() => {
                        onAddToCollection(col.id, icon.slug);
                        setShowCollectionMenu(false);
                        onShowToast('Saved to collection', `Added to "${col.name}"`);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-md text-xs font-medium text-white/80 hover:bg-blue-600/20 hover:text-blue-400 truncate cursor-pointer transition-colors"
                    >
                      {col.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Favorite Button */}
            <button
              type="button"
              onClick={() => onToggleFavorite(icon)}
              className={`p-2 rounded-lg border transition-colors cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center ${
                isFavorite
                  ? 'border-rose-500/50 bg-rose-500/20 text-rose-400'
                  : 'border-white/10 bg-white/5 text-white/40 hover:text-rose-400 hover:bg-white/10'
              }`}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>

            {/* Close modal button */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg border border-white/10 bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
              title="Close (Esc)"
              aria-label="Close dialog"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Modal Body: Split view (Left: Preview & Controls, Right: Code Playground) */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
          {/* Left Column: Interactive Stage & Inspector (7 cols) */}
          <div className="lg:col-span-7 p-4 sm:p-6 space-y-4 sm:space-y-6">
            {/* Primary Interactive Stage */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                {/* Static vs Animated Toggle */}
                {icon.hasAnimation ? (
                  <div className="inline-flex p-1 rounded-lg bg-white/5 border border-white/10">
                    <button
                      type="button"
                      onClick={() => setSettings(s => ({ ...s, animated: false }))}
                      className={`px-3 py-1 text-xs font-mono font-medium rounded-md transition-all cursor-pointer min-h-[28px] ${
                        !settings.animated
                          ? 'bg-blue-600 text-white font-bold shadow-xs'
                          : 'text-white/40 hover:text-white'
                      }`}
                    >
                      Static
                    </button>
                    <button
                      type="button"
                      onClick={() => setSettings(s => ({ ...s, animated: true }))}
                      className={`px-3 py-1 text-xs font-mono font-medium rounded-md transition-all flex items-center gap-1.5 cursor-pointer min-h-[28px] ${
                        settings.animated
                          ? 'bg-blue-600 text-white font-bold shadow-xs'
                          : 'text-white/40 hover:text-white'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-300 animate-ping" />
                      Morph from None
                    </button>
                  </div>
                ) : (
                  <span className="text-xs font-mono text-white/40 px-2.5 py-1 rounded bg-white/5 border border-white/10">
                    Static Vector Only
                  </span>
                )}

                {/* Compare Mode Toggle */}
                {icon.hasAnimation && (
                  <button
                    type="button"
                    onClick={() => setCompareMode(!compareMode)}
                    className={`px-2.5 py-1 text-xs font-mono rounded-lg border transition-colors cursor-pointer min-h-[30px] ${
                      compareMode
                        ? 'bg-blue-500/20 border-blue-500/40 text-blue-400'
                        : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    Compare Side-by-Side
                  </button>
                )}
              </div>

              {/* The Visual Laboratory Canvas matching Design HTML */}
              {compareMode && icon.hasAnimation ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {/* Static Preview Box */}
                  <div className="flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl border border-white/10 bg-black relative min-h-44 sm:min-h-56">
                    <span className="absolute top-2 left-2 text-[10px] font-mono text-white/40">
                      FINAL ICON (STATIC)
                    </span>
                    <AnimatedIconRenderer
                      icon={icon}
                      size={settings.size}
                      color={settings.color}
                      strokeWidth={settings.strokeWidth}
                      animated={false}
                    />
                  </div>
                  {/* Animated Preview Box */}
                  <div className="flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl border border-blue-500/40 bg-blue-950/20 relative min-h-44 sm:min-h-56">
                    <span className="absolute top-2 left-2 text-[10px] font-mono text-blue-400">
                      MORPHING (FROM NONE)
                    </span>
                    <AnimatedIconRenderer
                      icon={icon}
                      size={settings.size}
                      color={settings.color}
                      strokeWidth={settings.strokeWidth}
                      animated={true}
                      speed={settings.speed}
                    />
                  </div>
                </div>
              ) : (
                <div
                  className={`relative flex items-center justify-center rounded-2xl border border-white/10 min-h-52 sm:min-h-72 transition-all overflow-hidden ${stageBgClass}`}
                  style={customStyle}
                >
                  {/* Vector Coordinate Grid overlay */}
                  <div className="absolute inset-0 bg-vector-grid-blue opacity-30 pointer-events-none" />
                  
                  {/* Radial accent glow */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent pointer-events-none" />

                  {/* Icon Rendering */}
                  <div className="relative z-10 flex items-center justify-center p-6 sm:p-8 transition-transform">
                    <AnimatedIconRenderer
                      icon={icon}
                      size={settings.size}
                      color={settings.color}
                      strokeWidth={settings.strokeWidth}
                      animated={settings.animated && settings.isPlaying}
                      speed={settings.speed}
                    />
                  </div>

                  {/* Corner dimension label matching Design HTML */}
                  <div className="absolute bottom-2.5 right-2.5 text-[10px] font-mono text-blue-400 bg-blue-900/30 px-2 py-0.5 sm:py-1 rounded border border-blue-500/20 backdrop-blur-xs">
                    {settings.size} x {settings.size} • {settings.strokeWidth}px
                  </div>
                </div>
              )}
            </div>

            {/* Stage Controls: Background, Color, Size, Stroke */}
            <div className="space-y-3.5 pt-2">
              {/* Background Picker */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs">
                <span className="font-mono text-white/50">Background:</span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {(['transparent', 'light', 'dark', 'checkerboard'] as const).map(bg => (
                    <button
                      key={bg}
                      type="button"
                      onClick={() => setSettings(s => ({ ...s, background: bg }))}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-mono capitalize transition-all border cursor-pointer min-h-[28px] ${
                        settings.background === bg
                          ? 'bg-blue-600 border-blue-500 text-white font-bold'
                          : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {bg}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Swatches + Custom Picker */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs">
                <span className="font-mono text-white/50">Color:</span>
                <div className="flex flex-wrap items-center gap-2">
                  {['#60A5FA', '#38BDF8', '#34D399', '#FBBF24', '#F43F5E', '#FFFFFF'].map(hex => (
                    <button
                      key={hex}
                      type="button"
                      onClick={() => setSettings(s => ({ ...s, color: hex }))}
                      className={`w-5 h-5 rounded-full border border-white/20 transition-transform cursor-pointer ${
                        settings.color === hex ? 'scale-125 ring-2 ring-blue-500 ring-offset-2 ring-offset-[#0a0a0a]' : 'hover:scale-110'
                      }`}
                      style={{ backgroundColor: hex }}
                      title={hex}
                      aria-label={`Select color ${hex}`}
                    />
                  ))}
                  <input
                    type="color"
                    value={settings.color.startsWith('#') ? settings.color : '#60A5FA'}
                    onChange={e => setSettings(s => ({ ...s, color: e.target.value }))}
                    className="w-6 h-6 rounded cursor-pointer border-0 p-0 bg-transparent"
                    title="Custom color picker"
                    aria-label="Custom color picker"
                  />
                </div>
              </div>

              {/* Size Slider */}
              <div className="flex flex-col sm:grid sm:grid-cols-12 gap-1.5 sm:gap-3 items-stretch sm:items-center text-xs">
                <div className="sm:col-span-4 flex items-center justify-between font-mono text-white/50">
                  <span>Size ({settings.size}px):</span>
                  <div className="flex sm:hidden items-center gap-1">
                    {[24, 48, 64].map(preset => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setSettings(s => ({ ...s, size: preset }))}
                        className="px-2 py-0.5 text-[10px] font-mono rounded bg-white/5 border border-white/10 text-white/50"
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="sm:col-span-5 flex items-center">
                  <input
                    type="range"
                    min="16"
                    max="128"
                    step="4"
                    value={settings.size}
                    onChange={e => setSettings(s => ({ ...s, size: Number(e.target.value) }))}
                    className="w-full accent-blue-500 min-h-[24px]"
                    aria-label="Icon size slider"
                  />
                </div>
                <div className="hidden sm:flex col-span-3 items-center justify-end gap-1">
                  {[24, 48, 64].map(preset => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setSettings(s => ({ ...s, size: preset }))}
                      className="px-2 py-0.5 text-[10px] font-mono rounded-lg bg-white/5 border border-white/10 text-white/50 hover:bg-white/10 hover:text-white cursor-pointer"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stroke Width Slider */}
              <div className="flex flex-col sm:grid sm:grid-cols-12 gap-1.5 sm:gap-3 items-stretch sm:items-center text-xs">
                <div className="sm:col-span-4 flex items-center justify-between font-mono text-white/50">
                  <span>Stroke ({settings.strokeWidth}px):</span>
                  <div className="flex sm:hidden items-center gap-1">
                    {[1, 2, 3].map(st => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setSettings(s => ({ ...s, strokeWidth: st }))}
                        className="px-2 py-0.5 text-[10px] font-mono rounded bg-white/5 border border-white/10 text-white/50"
                      >
                        {st}x
                      </button>
                    ))}
                  </div>
                </div>
                <div className="sm:col-span-5 flex items-center">
                  <input
                    type="range"
                    min="1"
                    max="4"
                    step="0.5"
                    value={settings.strokeWidth}
                    onChange={e => setSettings(s => ({ ...s, strokeWidth: Number(e.target.value) }))}
                    className="w-full accent-blue-500 min-h-[24px]"
                    aria-label="Stroke width slider"
                  />
                </div>
                <div className="hidden sm:flex col-span-3 items-center justify-end gap-1">
                  {[1, 2, 3].map(st => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setSettings(s => ({ ...s, strokeWidth: st }))}
                      className="px-2 py-0.5 text-[10px] font-mono rounded-lg bg-white/5 border border-white/10 text-white/50 hover:bg-white/10 hover:text-white cursor-pointer"
                    >
                      {st}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Speed Controls (if animated) */}
              {icon.hasAnimation && settings.animated && (
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-2 border-t border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-white/50">Animation:</span>
                    <button
                      type="button"
                      onClick={() => setSettings(s => ({ ...s, isPlaying: !s.isPlaying }))}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-mono border border-white/10 bg-white/5 text-white/80 hover:bg-white/10 cursor-pointer min-h-[28px]"
                    >
                      {settings.isPlaying ? '❚❚ Pause' : '▶ Play'}
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <span className="font-mono text-[11px] text-white/40 mr-1">Speed:</span>
                    {[0.5, 1, 1.5, 2].map(spd => (
                      <button
                        key={spd}
                        type="button"
                        onClick={() => setSettings(s => ({ ...s, speed: spd }))}
                        className={`px-2 py-0.5 text-[10px] font-mono rounded-lg border cursor-pointer min-h-[26px] ${
                          settings.speed === spd
                            ? 'bg-blue-600 border-blue-500 text-white font-bold'
                            : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'
                        }`}
                      >
                        {spd}x
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Primary Actions: Copy SVG & Download */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <button
                type="button"
                onClick={handleCopySvg}
                className="flex-1 px-4 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm bg-blue-600/10 border border-blue-500/20 text-blue-400 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm min-h-[42px]"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                Copy SVG Markup
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDownload(false)}
                  className="flex-1 sm:flex-none px-4 py-2.5 sm:py-3 rounded-xl font-medium text-xs sm:text-sm border border-white/10 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white transition-colors flex items-center justify-center gap-2 cursor-pointer min-h-[42px]"
                  title="Download static SVG file (D)"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Static SVG
                </button>

                {icon.hasAnimation && (
                  <button
                    type="button"
                    onClick={() => handleDownload(true)}
                    className="flex-1 sm:flex-none px-4 py-2.5 sm:py-3 rounded-xl font-medium text-xs sm:text-sm border border-blue-500/20 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors flex items-center justify-center gap-2 cursor-pointer min-h-[42px]"
                    title="Download animated SVG file"
                  >
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                    Animated
                  </button>
                )}
              </div>
            </div>

            {/* Related Icons */}
            {relatedIcons.length > 0 && (
              <div className="pt-3 border-t border-white/10">
                <h4 className="text-xs font-mono font-medium text-white/50 mb-2">
                  Related in {icon.category}:
                </h4>
                <div className="flex items-center gap-2 flex-wrap">
                  {relatedIcons.map(rel => (
                    <button
                      key={rel.slug}
                      type="button"
                      onClick={() => onSelectIcon(rel)}
                      className="p-2 sm:p-2.5 rounded-xl border border-white/10 bg-white/5 hover:border-blue-500/50 hover:bg-blue-500/10 hover:text-blue-400 text-white/70 transition-all cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
                      title={rel.name}
                    >
                      <AnimatedIconRenderer icon={rel} size={20} strokeWidth={2} animated={false} />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Framework Code Playground (5 cols) matching Design HTML */}
          <div className="lg:col-span-5 p-4 sm:p-6 flex flex-col bg-[#050505]/60">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-white/60">
                Framework Output
              </span>

              <button
                type="button"
                onClick={handleCopyCode}
                className="px-3 py-1.5 text-xs font-mono font-medium rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors flex items-center gap-1.5 shadow-md shadow-blue-600/20 cursor-pointer min-h-[32px]"
              >
                {copied ? (
                  <>
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>

            {/* Framework Switcher Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-none touch-pan-x">
              {(['react', 'svg', 'html', 'vue', 'svelte', 'angular', 'css'] as FrameworkType[]).map(fw => (
                <button
                  key={fw}
                  type="button"
                  onClick={() => setActiveTab(fw)}
                  className={`px-2.5 py-1 text-xs font-mono rounded-lg uppercase transition-all shrink-0 border cursor-pointer min-h-[28px] ${
                    activeTab === fw
                      ? 'bg-blue-600 border-blue-500 text-white font-bold shadow-md shadow-blue-600/20'
                      : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {fw}
                </button>
              ))}
            </div>

            {/* Code Output Display matching Design HTML */}
            <div className="flex-1 min-h-[200px] sm:min-h-[260px] max-h-[360px] sm:max-h-none rounded-xl bg-black text-blue-300 p-3 sm:p-4 font-mono text-[11px] overflow-auto border border-white/5 shadow-inner leading-relaxed">
              <pre className="whitespace-pre-wrap break-all">
                <code>{generatedCode}</code>
              </pre>
            </div>

            {/* Metadata Footer */}
            <div className="mt-3 sm:mt-4 pt-3 border-t border-white/10 space-y-1 text-[11px] font-mono text-white/40">
              <div className="flex items-center justify-between">
                <span>Category:</span>
                <span className="font-semibold text-white/80 capitalize">{icon.category}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Style:</span>
                <span className="font-semibold text-white/80 capitalize">{icon.style}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Tags:</span>
                <span className="truncate max-w-[200px] text-white/60">{icon.tags.join(', ')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>License:</span>
                <span className="font-semibold text-emerald-400">MIT (Free)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
