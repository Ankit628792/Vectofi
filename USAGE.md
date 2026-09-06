# Vectofi User Guide (USAGE.md)

Welcome to the **Vectofi** user guide. This walkthrough explains how to browse the icon library, inspect and animate vectors in the Laboratory, customize icon styles, and export code across multiple web frameworks.

---

## 1. Browsing & Searching Icons

### Search Bar
- Click the search bar at the top or press `/` to instantly search across icon names, slugs, and descriptive keywords (e.g. typing `"arrow"`, `"download"`, `"cog"`, or `"check"`).
- Search results update in real-time.

### Category Filters
Filter icons by category pills:
- **All Icons** (121)
- **Navigation**
- **Media**
- **Actions**
- **Communication**
- **Commerce**
- **Devices**
- **Editor**
- **Files**
- **System**
- **Weather**

### Animation Filter
Use the **Animation Toggle** in the filter toolbar:
- **All**: Displays both static and animated icons.
- **Animated Only**: Displays only icons with active path morphing capabilities.
- **Static Only**: Displays standard non-animated icons.

---

## 2. Interactive SVG Laboratory

Click on any icon card in the grid to launch the **Icon Detail Laboratory**.

### 2.1 Static ↔ Morphing Controls
- **Static**: Renders the authentic, static SVG vector geometry.
- **Morph from None**: Activates the vector morphing engine, expanding the icon outward from its center point using cubic Bézier interpolation.
- **Compare Side-by-Side**: Splits the inspection canvas into two synchronized boxes:
  - **Left Box**: Static final icon reference.
  - **Right Box**: Live loop of the icon morphing from none.

### 2.2 Vector Customization Controls
Inside the laboratory's control drawer:
- **Size**: Adjust the render dimension from `16px` to `96px` (defaults to `32px` in stage).
- **Stroke Width**: Adjust vector thickness from `0.5px` (hairline) to `4.0px` (ultra-bold).
- **Color Picker**: Choose from curated design presets (Pure White, Electric Blue, Emerald Green, Indigo, Amber, Rose, Purple) or enter any arbitrary Hex/RGB color code.
- **Animation Speed**: Choose between `Fast (1.2s)`, `Normal (2.4s)`, or `Slow (4.0s)`.
- **Stage Background**: Toggle the laboratory backdrop between Dark Canvas, Light Canvas, Technical Blueprint Grid, Slate, or Subtle Gradient to test contrast.

---

## 3. Exporting Icons & Code Generation

On the right panel of the Laboratory, select your target framework to preview and copy production-ready code.

### 3.1 Supported Code Formats

#### 1. Raw SVG
Standard standalone `<svg>` tag with inline attributes and `<animate>` tags (if animated).
```html
<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="...">
    <animate attributeName="d" dur="2.4s" repeatCount="indefinite" values="..." />
  </path>
</svg>
```

#### 2. React / TSX
Modular functional React component with typed props:
```tsx
import React from 'react';

export const PlayIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);
```

#### 3. Vue 3 (Composition API)
Native Vue Single File Component with `<script setup>` and template binding:
```vue
<template>
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" :stroke-width="strokeWidth" stroke-linecap="round" stroke-linejoin="round">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ strokeWidth?: number }>(), { strokeWidth: 2 });
</script>
```

#### 4. Svelte
Svelte component with reactive prop declarations:
```svelte
<script lang="ts">
  export let size: number = 24;
  export let strokeWidth: number = 2;
  export let color: string = "currentColor";
</script>

<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} stroke-width={strokeWidth} stroke-linecap="round" stroke-linejoin="round">
  <polygon points="5 3 19 12 5 21 5 3" />
</svg>
```

#### 5. Tailwind CSS
Inline vector snippet with utility classes applied directly:
```html
<svg class="w-6 h-6 text-blue-500 stroke-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
  <polygon points="5 3 19 12 5 21 5 3" />
</svg>
```

#### 6. SVG Sprite
Reference symbol ID for large-scale icon sprite systems:
```html
<svg class="icon icon-play" width="24" height="24">
  <use href="#icon-play" />
</svg>
```

### 3.2 File Downloads
- **Download SVG**: Downloads a sanitized `.svg` file containing the configured stroke width, color, and optional animation.
- **Download PNG**: Renders the vector to an HTML5 offscreen canvas at high resolution ($1024 \times 1024$) and triggers a `.png` download.

---

## 4. Managing Collections & Favorites

- **Favorites**: Click the heart button on any card or inside the Laboratory to quickly favorite an icon. Filter by Favorites in the category bar to view your curated set.
- **Collections**: Create named project collections (e.g. *"Dashboard v2"*, *"E-Commerce Header"*, *"Mobile Nav"*). Add icons to specific collections from the dropdown and export collection metadata as JSON.

---

## 5. Keyboard Shortcuts

| Key | Action |
| :--- | :--- |
| <kbd>/</kbd> | Focus icon search input |
| <kbd>Esc</kbd> | Close Laboratory modal |
| <kbd>Tab</kbd> / <kbd>Shift+Tab</kbd> | Cycle focus between icon cards |
| <kbd>Enter</kbd> / <kbd>Space</kbd> | Open selected icon in Laboratory |
