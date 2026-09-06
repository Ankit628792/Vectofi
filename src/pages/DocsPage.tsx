import React, { useState } from 'react';
import { FrameworkType } from '../types';

export const DocsPage: React.FC = () => {
  const [activeFw, setActiveFw] = useState<FrameworkType>('react');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-[#e5e5e5]">
      {/* Header */}
      <div className="mb-12 border-b border-white/10 pb-8">
        <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">
          Developer Reference & Integration
        </span>
        <h1 className="font-display font-light text-3xl sm:text-4xl text-white mt-1 tracking-tight">
          Vectofi <span className="font-bold">Documentation</span>
        </h1>
        <p className="text-base text-white/50 mt-2 max-w-2xl leading-relaxed">
          Comprehensive developer guide for integrating static and motion-first animated SVG icons into React, Vue, Svelte, Angular, and vanilla web applications.
        </p>
      </div>

      <div className="space-y-16">
        {/* SECTION 1: ARCHITECTURE OVERVIEW */}
        <section className="space-y-4">
          <h2 className="font-display font-bold text-2xl text-white flex items-center gap-2">
            <span className="text-blue-400 font-mono text-lg">01.</span>
            Design System & Grid Standards
          </h2>
          <p className="text-sm text-white/60 leading-relaxed">
            All icons in Vectofi are designed strictly on a <strong className="text-white">24 &times; 24 pixel viewBox</strong> coordinate system.
            Using vector strokes with <code className="text-blue-300 bg-white/5 px-1.5 py-0.5 rounded border border-white/10">stroke-linecap="round"</code> and <code className="text-blue-300 bg-white/5 px-1.5 py-0.5 rounded border border-white/10">stroke-linejoin="round"</code> ensures that lines scale naturally from 16px micro-icons to 128px presentation badges without distortion.
          </p>

          <div className="p-4 rounded-xl bg-black border border-white/10 font-mono text-xs text-blue-300">
            <code>viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"</code>
          </div>
        </section>

        {/* SECTION 2: STATIC VS ANIMATED ICONS */}
        <section className="space-y-4">
          <h2 className="font-display font-bold text-2xl text-white flex items-center gap-2">
            <span className="text-blue-400 font-mono text-lg">02.</span>
            Static vs. Animated Icons
          </h2>
          <p className="text-sm text-white/60 leading-relaxed">
            Vectofi supports two distinct export paradigms:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl border border-white/10 bg-white/5 space-y-3">
              <h3 className="font-display font-bold text-base text-white">
                Static SVG
              </h3>
              <p className="text-xs text-white/50 leading-relaxed">
                Zero overhead, lightweight vector paths. Inherits font color via <code className="text-blue-300">currentColor</code> and scales seamlessly with CSS font-size or width/height attributes. Ideal for dense tables, navigation trees, and buttons.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-blue-500/20 bg-blue-500/5 space-y-3">
              <h3 className="font-display font-bold text-base text-blue-300 flex items-center gap-2">
                <span>Self-Contained Animated SVG</span>
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              </h3>
              <p className="text-xs text-white/50 leading-relaxed">
                Animated SVG files embed CSS <code className="text-blue-300">@keyframes</code> directly inside an encapsulated <code className="text-blue-300">&lt;style&gt;</code> block within the SVG document. This allows the animation to play inside standard HTML <code className="text-blue-300">&lt;img&gt;</code> tags and background images without requiring external JavaScript.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 3: FRAMEWORK INTEGRATION GUIDES */}
        <section className="space-y-6">
          <h2 className="font-display font-bold text-2xl text-white flex items-center gap-2">
            <span className="text-blue-400 font-mono text-lg">03.</span>
            Framework Integration Guides
          </h2>

          {/* Framework Selector Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {(['react', 'vue', 'svelte', 'angular', 'html', 'css'] as FrameworkType[]).map(fw => (
              <button
                key={fw}
                type="button"
                onClick={() => setActiveFw(fw)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold uppercase transition-all border cursor-pointer ${
                  activeFw === fw
                    ? 'bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-600/20'
                    : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white'
                }`}
              >
                {fw}
              </button>
            ))}
          </div>

          {/* Framework Specific Code Box */}
          <div className="rounded-2xl border border-white/10 bg-black text-blue-300 p-6 font-mono text-xs overflow-x-auto shadow-inner">
            {activeFw === 'react' && (
              <pre className="leading-relaxed">
{`// 1. Save component file (e.g. CheckCircleIcon.tsx)
import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
  strokeWidth?: number;
}

export const CheckCircleIcon: React.FC<IconProps> = ({
  size = 24,
  color = 'currentColor',
  strokeWidth = 2,
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="16 10 11 15 8 12" />
  </svg>
);`}
              </pre>
            )}

            {activeFw === 'vue' && (
              <pre className="leading-relaxed">
{`<!-- Vue 3 Single File Component (CheckCircleIcon.vue) -->
<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    :stroke="color"
    :stroke-width="strokeWidth"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="16 10 11 15 8 12" />
  </svg>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    size?: number | string;
    color?: string;
    strokeWidth?: number;
  }>(),
  {
    size: 24,
    color: 'currentColor',
    strokeWidth: 2,
  }
);
</script>`}
              </pre>
            )}

            {activeFw === 'svelte' && (
              <pre className="leading-relaxed">
{`<!-- Svelte 4/5 Component (CheckCircleIcon.svelte) -->
<script lang="ts">
  export let size: number | string = 24;
  export let color: string = 'currentColor';
  export let strokeWidth: number = 2;
</script>

<svg
  width={size}
  height={size}
  viewBox="0 0 24 24"
  fill="none"
  stroke={color}
  stroke-width={strokeWidth}
  stroke-linecap="round"
  stroke-linejoin="round"
  {...$$restProps}
>
  <circle cx="12" cy="12" r="10" />
  <polyline points="16 10 11 15 8 12" />
</svg>`}
              </pre>
            )}

            {activeFw === 'angular' && (
              <pre className="leading-relaxed">
{`import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon-check-circle',
  standalone: true,
  template: \`
    <svg
      [attr.width]="size"
      [attr.height]="size"
      viewBox="0 0 24 24"
      fill="none"
      [attr.stroke]="color"
      [attr.stroke-width]="strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="16 10 11 15 8 12" />
    </svg>
  \`,
  styles: [':host { display: inline-flex; }']
})
export class CheckCircleIconComponent {
  @Input() size: number | string = 24;
  @Input() color: string = 'currentColor';
  @Input() strokeWidth: number = 2;
}`}
              </pre>
            )}

            {activeFw === 'html' && (
              <pre className="leading-relaxed">
{`<!-- Standard Inline SVG -->
<svg class="icon icon-check-circle" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="10" />
  <polyline points="16 10 11 15 8 12" />
</svg>`}
              </pre>
            )}

            {activeFw === 'css' && (
              <pre className="leading-relaxed">
{`/* CSS Data URI for background-image */
.icon-check-circle {
  display: inline-block;
  width: 24px;
  height: 24px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2360A5FA' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Cpolyline points='16 10 11 15 8 12'/%3E%3C/svg%3E");
}`}
              </pre>
            )}
          </div>
        </section>

        {/* SECTION 4: ACCESSIBILITY */}
        <section className="space-y-4">
          <h2 className="font-display font-bold text-2xl text-white flex items-center gap-2">
            <span className="text-blue-400 font-mono text-lg">04.</span>
            Accessibility Best Practices (WCAG AA)
          </h2>
          <div className="space-y-3 text-sm text-white/60">
            <p>
              1. <strong className="text-white">Decorative Icons:</strong> If an icon is placed next to text (e.g. a button with label "Delete"), add <code className="text-blue-300">aria-hidden="true"</code> so screen readers do not announce duplicate information:
            </p>
            <div className="p-3 rounded-lg bg-black border border-white/10 font-mono text-xs text-blue-300">
              <code>&lt;button&gt;&lt;TrashIcon aria-hidden="true" /&gt; Delete&lt;/button&gt;</code>
            </div>

            <p className="pt-2">
              2. <strong className="text-white">Standalone Icon Buttons:</strong> If an icon represents an action by itself without text (e.g. an icon-only close button), ensure the parent button has an <code className="text-blue-300">aria-label</code>:
            </p>
            <div className="p-3 rounded-lg bg-black border border-white/10 font-mono text-xs text-blue-300">
              <code>&lt;button aria-label="Close dialog"&gt;&lt;CloseIcon /&gt;&lt;/button&gt;</code>
            </div>

            <p className="pt-2">
              3. <strong className="text-white">Reduced Motion:</strong> Respect users who have enabled <code className="text-blue-300">prefers-reduced-motion</code> in their OS settings by honoring our built-in CSS media queries:
            </p>
            <div className="p-3 rounded-lg bg-black border border-white/10 font-mono text-xs text-blue-300">
              <code>@media (prefers-reduced-motion: reduce) &#123; * &#123; animation: none !important; &#125; &#125;</code>
            </div>
          </div>
        </section>

        {/* SECTION 5: LICENSE */}
        <section className="p-6 rounded-2xl border border-white/10 bg-white/5 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
              <span>MIT License</span>
              <span className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                Open Source
              </span>
            </h3>
            <div className="flex items-center gap-3 text-xs font-mono">
              <a
                href="https://github.com/Ankit628792/Vectofi/blob/main/LICENSE"
                target="_blank"
                rel="noreferrer"
                className="text-blue-400 hover:text-blue-300 inline-flex items-center gap-1 hover:underline"
              >
                <span>View LICENSE on GitHub</span>
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </a>
              <span className="text-white/20">•</span>
              <a
                href="https://opensource.org/licenses/MIT"
                target="_blank"
                rel="noreferrer"
                className="text-blue-400 hover:text-blue-300 inline-flex items-center gap-1 hover:underline"
              >
                <span>OSI Standard</span>
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </a>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-white/50 leading-relaxed">
            All icons, animations, and code utilities in Vectofi are licensed under the permissive{' '}
            <strong className="text-white font-medium">MIT License</strong> by{' '}
            <a
              href="https://www.instagram.com/ankit_628792"
              target="_blank"
              rel="noreferrer"
              className="text-blue-400 hover:underline"
            >
              Ankit Kumar
            </a>
            . You are free to use, modify, distribute, remix, and integrate them into personal, commercial, internal, and open-source applications without royalty or mandatory attribution.
          </p>
        </section>
      </div>
    </div>
  );
};
