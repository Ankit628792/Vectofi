import React, { useState } from 'react';
import {
  VectorGrid,
  VectorBlob,
  VectorDots,
  VectorStars,
  VectorOrbit,
  VectorLines,
  VectorArrow,
  VectorBadge,
  VectorPattern,
} from './index';
import { copyToClipboard } from '../../utils/svgUtils';

type VectorCompKey =
  | 'grid'
  | 'blob'
  | 'dots'
  | 'stars'
  | 'orbit'
  | 'lines'
  | 'arrow'
  | 'badge'
  | 'pattern';

interface ComponentSpec {
  key: VectorCompKey;
  name: string;
  tag: string;
  description: string;
  props: string[];
}

const VECTOR_SPECS: ComponentSpec[] = [
  {
    key: 'grid',
    name: 'VectorGrid',
    tag: 'Architectural Grid',
    description: 'Crisp SVG coordinate grid with customizable step size, crosshair axes, and subgrid dots.',
    props: ['width', 'height', 'gridSize', 'strokeColor', 'crosshairs', 'dots', 'opacity'],
  },
  {
    key: 'blob',
    name: 'VectorBlob',
    tag: 'Organic Geometry',
    description: 'Smooth mathematical Bézier curves with radial gradient shading and dashed constraint rings.',
    props: ['size', 'color', 'variant (1-4)', 'animated', 'dashedRing', 'opacity'],
  },
  {
    key: 'dots',
    name: 'VectorDots',
    tag: 'Procedural Matrix',
    description: 'Dynamic dot matrix with configurable row/column densities and staggered pulse keyframes.',
    props: ['rows', 'cols', 'gap', 'dotSize', 'color', 'opacity', 'animated'],
  },
  {
    key: 'stars',
    name: 'VectorStars',
    tag: 'Sparkle Vectors',
    description: '4-point diamond vector stars with SVG Gaussian blur glow filter and subtle floating movement.',
    props: ['size', 'color', 'count (1-4)', 'glow', 'animated'],
  },
  {
    key: 'orbit',
    name: 'VectorOrbit',
    tag: 'Celestial Trajectory',
    description: 'Tilted elliptical orbital paths with planetary satellites rotating around central crosshairs.',
    props: ['size', 'color', 'rings (1-3)', 'tilt', 'satellites', 'animated', 'opacity'],
  },
  {
    key: 'lines',
    name: 'VectorLines',
    tag: 'Drafting Metrics',
    description: 'Precision engineering measurement guides, delta coordinate markers, and architectural brackets.',
    props: ['orientation', 'length', 'color', 'ticks', 'label', 'strokeWidth', 'opacity'],
  },
  {
    key: 'arrow',
    name: 'VectorArrow',
    tag: 'Directional Callout',
    description: 'Handcrafted vector arrows including curved arcs, organic sketch doodles, and tech pointers.',
    props: ['variant', 'size', 'color', 'strokeWidth', 'direction', 'animated'],
  },
  {
    key: 'badge',
    name: 'VectorBadge',
    tag: 'Technical Emblem',
    description: 'Geometric emblem container featuring chamfered polygons, crest shields, and status pulses.',
    props: ['text', 'subtext', 'variant', 'color', 'statusPulse'],
  },
  {
    key: 'pattern',
    name: 'VectorPattern',
    tag: 'Seamless Tiles',
    description: 'Pure SVG pattern tiles for backgrounds: isometric cubes, circuit traces, chevrons, and crosshatch.',
    props: ['variant', 'patternSize', 'strokeColor', 'strokeWidth', 'opacity', 'width', 'height'],
  },
];

export const VectorSystemShowcase: React.FC = () => {
  const [selectedComp, setSelectedComp] = useState<VectorCompKey>('orbit');
  const [activeColor, setActiveColor] = useState<string>('#3b82f6');
  const [animated, setAnimated] = useState<boolean>(true);
  const [variantIdx, setVariantIdx] = useState<number>(1);
  const [copied, setCopied] = useState<boolean>(false);

  const currentSpec = VECTOR_SPECS.find(s => s.key === selectedComp) || VECTOR_SPECS[0];

  const colorPresets = [
    { name: 'Electric Blue', hex: '#3b82f6' },
    { name: 'Cyan Glow', hex: '#06b6d4' },
    { name: 'Indigo Core', hex: '#6366f1' },
    { name: 'Emerald', hex: '#10b981' },
    { name: 'White Silver', hex: '#f3f4f6' },
  ];

  const getCodeSnippet = (key: VectorCompKey): string => {
    switch (key) {
      case 'grid':
        return `<VectorGrid\n  width="100%"\n  height={240}\n  gridSize={40}\n  strokeColor="${activeColor}"\n  crosshairs={true}\n  dots={true}\n  opacity={0.25}\n/>`;
      case 'blob':
        return `<VectorBlob\n  size={240}\n  color="${activeColor}"\n  variant={${(variantIdx % 4) + 1}}\n  animated={${animated}}\n  dashedRing={true}\n/>`;
      case 'dots':
        return `<VectorDots\n  rows={6}\n  cols={10}\n  gap={16}\n  color="${activeColor}"\n  animated={${animated}}\n/>`;
      case 'stars':
        return `<VectorStars\n  size={36}\n  color="${activeColor}"\n  count={3}\n  glow={true}\n  animated={${animated}}\n/>`;
      case 'orbit':
        return `<VectorOrbit\n  size={240}\n  color="${activeColor}"\n  rings={3}\n  satellites={true}\n  animated={${animated}}\n/>`;
      case 'lines':
        return `<VectorLines\n  orientation="horizontal"\n  length={260}\n  color="${activeColor}"\n  ticks={true}\n  label="Δ 24.00px"\n/>`;
      case 'arrow':
        return `<VectorArrow\n  variant="curved"\n  size={64}\n  color="${activeColor}"\n  direction="right"\n  animated={${animated}}\n/>`;
      case 'badge':
        return `<VectorBadge\n  text="SVG VECTOR"\n  subtext="PRECISION"\n  variant="tech"\n  color="${activeColor}"\n  statusPulse={${animated}}\n/>`;
      case 'pattern':
        return `<VectorPattern\n  variant="isometric"\n  patternSize={40}\n  strokeColor="${activeColor}"\n  opacity={0.25}\n/>`;
    }
  };

  const handleCopyCode = async () => {
    const code = getCodeSnippet(selectedComp);
    const success = await copyToClipboard(code);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section className="py-20 border-t border-white/10 bg-[#070707] relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-vector-grid opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">
                Phase 2 Vector Design System
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-light text-white tracking-tight">
              Reusable <span className="font-bold">SVG Vector Decorations</span>
            </h2>
            <p className="text-sm sm:text-base text-white/50 max-w-2xl">
              Engineered with pure mathematical vector elements. Zero bitmap rasterization, infinite scalability, and native CSS property binding.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-white/40">Pure SVG components</span>
            <div className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs font-mono text-blue-400">
              9 Components
            </div>
          </div>
        </div>

        {/* Interactive Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Component Selection List (4 cols) */}
          <div className="lg:col-span-4 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-white/40 block px-1">
              Select Vector Decoration
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-1.5 max-h-[320px] sm:max-h-[360px] lg:max-h-[520px] overflow-y-auto pr-1">
              {VECTOR_SPECS.map(spec => {
                const isSelected = spec.key === selectedComp;
                return (
                  <button
                    key={spec.key}
                    type="button"
                    onClick={() => {
                      setSelectedComp(spec.key);
                      setVariantIdx(1);
                    }}
                    className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between min-h-[44px] ${
                      isSelected
                        ? 'bg-blue-600/15 border-blue-500/50 text-white shadow-lg shadow-blue-500/5'
                        : 'bg-white/5 border-white/10 text-white/70 hover:border-white/20 hover:bg-white/8 hover:text-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold">{spec.name}</span>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-white/40 border border-white/10">
                          {spec.tag}
                        </span>
                      </div>
                      <p className="text-[11px] text-white/40 line-clamp-1 mt-0.5">
                        {spec.description}
                      </p>
                    </div>

                    <div
                      className={`w-2 h-2 rounded-full transition-all ${
                        isSelected ? 'bg-blue-400 scale-125' : 'bg-transparent'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Live Interactive Canvas & Code Inspector (8 cols) */}
          <div className="lg:col-span-8 bg-[#0a0a0a] border border-white/10 rounded-2xl p-4 sm:p-6 space-y-4 sm:space-y-6">
            {/* Canvas Header Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <h3 className="font-display font-bold text-lg text-white">
                  {currentSpec.name}
                </h3>
                <p className="text-xs text-white/50">{currentSpec.description}</p>
              </div>

              {/* Controls bar */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                {/* Color Selector */}
                <div className="flex items-center gap-1.5 p-1 rounded-lg bg-white/5 border border-white/10">
                  {colorPresets.map(preset => (
                    <button
                      key={preset.hex}
                      type="button"
                      onClick={() => setActiveColor(preset.hex)}
                      title={preset.name}
                      className="w-5 h-5 rounded-full border transition-all cursor-pointer"
                      style={{
                        backgroundColor: preset.hex,
                        borderColor: activeColor === preset.hex ? '#ffffff' : 'transparent',
                        transform: activeColor === preset.hex ? 'scale(1.15)' : 'scale(1)',
                      }}
                    />
                  ))}
                </div>

                {/* Animation Toggle */}
                <button
                  type="button"
                  onClick={() => setAnimated(!animated)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all cursor-pointer flex items-center gap-1.5 min-h-[32px] ${
                    animated
                      ? 'bg-blue-500/20 border-blue-500/40 text-blue-300'
                      : 'bg-white/5 border-white/10 text-white/50 hover:text-white'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      animated ? 'bg-blue-400 animate-pulse' : 'bg-white/30'
                    }`}
                  />
                  <span>Animation {animated ? 'ON' : 'OFF'}</span>
                </button>

                {/* Variant Switcher for blob / pattern / arrow */}
                {['blob', 'pattern', 'arrow', 'badge'].includes(selectedComp) && (
                  <button
                    type="button"
                    onClick={() => setVariantIdx(v => (v + 1) % 4)}
                    className="px-3 py-1.5 rounded-lg text-xs font-mono border border-white/10 bg-white/5 hover:bg-white/10 text-white/70 transition-all cursor-pointer min-h-[32px]"
                  >
                    Variant #{variantIdx + 1}
                  </button>
                )}
              </div>
            </div>

            {/* Live Interactive SVG Stage */}
            <div className="h-64 rounded-xl border border-white/10 bg-black/40 relative flex items-center justify-center overflow-hidden">
              {/* Stage Background grid */}
              <div className="absolute inset-0 opacity-15 bg-vector-grid pointer-events-none" />

              {/* Rendered Component */}
              <div className="relative z-10 flex items-center justify-center p-4">
                {selectedComp === 'grid' && (
                  <VectorGrid
                    width={480}
                    height={220}
                    gridSize={40}
                    strokeColor={activeColor}
                    crosshairs={true}
                    dots={true}
                    opacity={0.35}
                  />
                )}
                {selectedComp === 'blob' && (
                  <VectorBlob
                    size={220}
                    color={activeColor}
                    variant={((variantIdx % 4) + 1) as 1 | 2 | 3 | 4}
                    animated={animated}
                    dashedRing={true}
                    opacity={0.15}
                  />
                )}
                {selectedComp === 'dots' && (
                  <VectorDots
                    rows={6}
                    cols={12}
                    gap={18}
                    dotSize={2.5}
                    color={activeColor}
                    opacity={0.5}
                    animated={animated}
                  />
                )}
                {selectedComp === 'stars' && (
                  <VectorStars
                    size={48}
                    color={activeColor}
                    count={4}
                    glow={true}
                    animated={animated}
                  />
                )}
                {selectedComp === 'orbit' && (
                  <VectorOrbit
                    size={220}
                    color={activeColor}
                    rings={3}
                    satellites={true}
                    animated={animated}
                    opacity={0.35}
                  />
                )}
                {selectedComp === 'lines' && (
                  <div className="space-y-4">
                    <VectorLines
                      orientation="horizontal"
                      length={320}
                      color={activeColor}
                      ticks={true}
                      label="X: 320.00px • Δ VECTOR"
                      opacity={0.4}
                    />
                    <VectorLines
                      orientation="bracket"
                      length={320}
                      color={activeColor}
                      ticks={true}
                      label="SPAN 24PX"
                      opacity={0.4}
                    />
                  </div>
                )}
                {selectedComp === 'arrow' && (
                  <div className="flex items-center gap-6">
                    <VectorArrow
                      variant={
                        variantIdx === 0
                          ? 'curved'
                          : variantIdx === 1
                          ? 'sketch'
                          : variantIdx === 2
                          ? 'tech'
                          : 'pointer'
                      }
                      size={64}
                      color={activeColor}
                      direction="right"
                      animated={animated}
                    />
                    <VectorArrow
                      variant="curved"
                      size={48}
                      color={activeColor}
                      direction="down"
                      animated={animated}
                    />
                  </div>
                )}
                {selectedComp === 'badge' && (
                  <div className="flex flex-wrap items-center justify-center gap-4">
                    <VectorBadge
                      text="SVG 2.0 VECTOR"
                      subtext="STANDARDS"
                      variant={
                        variantIdx === 0
                          ? 'tech'
                          : variantIdx === 1
                          ? 'shield'
                          : variantIdx === 2
                          ? 'hexagon'
                          : 'pill'
                      }
                      color={activeColor}
                      statusPulse={animated}
                    />
                    <VectorBadge
                      text="MIT LICENSED"
                      variant="tech"
                      color="#10b981"
                      statusPulse={false}
                    />
                  </div>
                )}
                {selectedComp === 'pattern' && (
                  <div className="w-80 h-44 rounded-lg border border-white/10 overflow-hidden relative">
                    <VectorPattern
                      variant={
                        variantIdx === 0
                          ? 'isometric'
                          : variantIdx === 1
                          ? 'circuit'
                          : variantIdx === 2
                          ? 'chevrons'
                          : 'crosshatch'
                      }
                      patternSize={36}
                      strokeColor={activeColor}
                      opacity={0.3}
                      width="100%"
                      height="100%"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Code Output Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-white/50">React Component Usage:</span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="px-3 py-1 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-medium transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  {copied ? (
                    <>
                      <svg className="w-3.5 h-3.5 text-emerald-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                      <span>Copy Component Code</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-black border border-white/10 text-xs font-mono text-blue-300 overflow-x-auto">
                <code>{getCodeSnippet(selectedComp)}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
