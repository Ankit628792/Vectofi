# Vectofi User Guide (USAGE.md)

Welcome to the **Vectofi** user guide. This walkthrough explains how to discover icons, customize vectors in the interactive Laboratory, organize project collections, and export code across modern web frameworks.

---

## 1. Browsing & Searching Icons

### Real-Time Search Bar
- Press <kbd>/</kbd> anywhere in the application or click the top search input to instantly filter across icon titles, slugs, and semantic synonyms (e.g. typing `"search"`, `"cart"`, `"database"`, `"user"`, or `"trend"`).
- Search evaluates multi-word queries, exact slug matches, and semantic tag associations with instant zero-lag response.

### 20 Functional Categories
Filter icons via the category navigation bar or sidebar:
- **Interface & Controls** (5,527 icons)
- **Arrows & Directions** (1,109 icons)
- **Editor & Typography** (871 icons)
- **Communication** (863 icons)
- **Files & Folders** (858 icons)
- **Design & Creative** (829 icons)
- **Social & Engagement** (804 icons)
- **Media, Audio & Video** (793 icons)
- **Devices & Hardware** (760 icons)
- **Commerce & Finance** (680 icons)
- **Weather & Climate** (547 icons)
- **Security & Privacy** (519 icons)
- **Navigation & Places** (505 icons)
- **Business & Analytics** (450 icons)
- **Travel & Transport** (438 icons)
- **Users & Teams** (412 icons)
- **Development & Code** (379 icons)
- **Sports & Gaming** (276 icons)
- **Food & Dining** (253 icons)
- **Health & Wellness** (176 icons)

### Animation & Style Filters
- **All Icons (17,000+)**: Displays full static and animated vector icon collection.
- **Animated Only (16,000+)**: Highlights icons with active motion presets (`pulse`, `bounce`, `spin`, `shake`, `slide`, `morph`, `float`, `draw`).
- **Static Only**: Displays clean, un-animated vector geometry.
- **Style Filters**: Switch between Outline, Solid, and Duotone variants.

### High-Performance Web Worker Architecture
- **Off-Thread Processing**: Search filtering, category queries, and sprite creation run in a dedicated Web Worker to avoid blocking UI frame rates.
- **Virtual Grid & Lazy Geometry**: Icons in the virtual grid stream raw SVG path geometry on-demand through intersection observers and pre-warming heuristics, reducing initial DOM payload and RAM usage.

---

## 2. Interactive SVG Laboratory

Click any icon card or launch the Laboratory from the navigation bar to inspect and customize vector attributes in real-time.

### 2.1 Live Canvas Inspection
- **Static vs. Animated Comparison**: Toggle side-by-side mode to preview static vector geometry alongside its live animated keyframe loop.
- **Centroid & Grid Crosshairs**: Inspect pixel alignment on the official $24 \times 24$ coordinate system.
- **Zoom & Stage Controls**: Scale preview up to 400% with technical blueprint, dark canvas, or light canvas backdrops.

### 2.2 Vector Styling Controls
- **Stroke Width**: Real-time slider from `0.5px` (ultra-thin hairline) to `4.0px` (bold display).
- **Size**: Adjust rendered container dimensions from `16px` to `128px`.
- **Color Customizer**: Pick from theme presets or enter custom Hex / RGB / `currentColor` values.
- **Animation Speed**: Choose between `Slow (3.5s)`, `Normal (2.0s)`, or `Fast (1.0s)`.

---

## 3. Code Generation & Multi-Framework Export

Vectofi generates production-ready, accessible code snippets for all major web frameworks:

### 1. React / Next.js (TSX / JSX)
```tsx
import React from 'react';

export const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = ({
  width = 24,
  height = 24,
  stroke = 'currentColor',
  strokeWidth = 2,
  ...props
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke={stroke}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
  </svg>
);
```

### 2. Vue 3 (Composition API)
```vue
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
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
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
</script>
```

### 3. Svelte (Svelte 4 & 5)
```svelte
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
  <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
</svg>
```

### 4. Angular Standalone Component
```typescript
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon-sparkles',
  standalone: true,
  template: `
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
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  `,
  styles: [':host { display: inline-flex; }']
})
export class SparklesIconComponent {
  @Input() size: number | string = 24;
  @Input() color: string = 'currentColor';
  @Input() strokeWidth: number = 2;
}
```

### 5. Tailwind CSS Utility Markup
```html
<svg class="w-6 h-6 text-blue-500 stroke-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
  <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
</svg>
```

---

## 4. Collections & Batch Management

- **Favorites**: Click the heart button on any icon card to pin it to your favorites list.
- **Project Collections**: Create custom named collections (e.g. *"Fintech Mobile App"*, *"Admin Dashboard v3"*). Add or remove icons with a single click.
- **Batch Export**: Download all icons in a collection at once as optimized `.svg` files or bundle them into a `.zip` archive.
- **Import / Export JSON**: Back up your collections and share presets across team members.

---

## 5. Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| <kbd>/</kbd> or <kbd>Cmd</kbd> + <kbd>K</kbd> | Focus global icon search / Open command palette |
| <kbd>Esc</kbd> | Close modal / laboratory inspector |
| <kbd>←</kbd> / <kbd>→</kbd> | Navigate to previous / next icon in laboratory |
| <kbd>C</kbd> | Copy active SVG code to clipboard |
| <kbd>F</kbd> | Toggle favorite on current icon |
| <kbd>D</kbd> | Trigger SVG download |
