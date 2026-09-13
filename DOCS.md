# Vectofi Technical Documentation & API Reference (DOCS.md)

This reference document outlines the core geometry utilities, animation functions, data models, and component APIs in the **Vectofi** codebase.

---

## 1. Core Animation & Morphing Engine (`src/utils/animations.ts`)

### `equalizePathCommands(cmdsA: PathCommand[], cmdsB: PathCommand[]): [PathCommand[], PathCommand[]]`
Normalizes two distinct path command lists into identical structural representations with matching command types (`M`, `C`, `Z`) and segment lengths.
- **Dynamic Point Generation**: Dynamically subdivides the longest segments using de Casteljau's algorithm and Gravesen arc-length calculation so that the simpler path gains points smoothly distributed along its perimeter without distorting geometry.
- **Subpath Harmonization**: Reconciles mismatched subpaths (e.g. single-path vs multi-path SVGs) by provisioning zero-dimension subpaths at counterpart centroids.
- **Phase Alignment**: Minimizes Euclidean rotation offset for closed paths.

```typescript
import { parseSvgPath, equalizePathCommands, formatPathCommands } from './animations';

const pathA = parseSvgPath('M 12 2 L 22 22 L 2 22 Z'); // Triangle (3 segments)
const pathB = parseSvgPath('M 12 2 C 17.5 2 22 6.5 22 12 ...'); // Circle (4 segments)

const [eqA, eqB] = equalizePathCommands(pathA, pathB);
// eqA and eqB now both have 4 matching 'C' segments!
```

---

### `interpolatePathData(pathA: string, pathB: string, t: number): string`
Performs coordinate-wise linear interpolation between two arbitrary SVG path strings at progress parameter $t \in [0, 1]$.

$$P(t) = P_A + (P_B - P_A) \cdot t$$

- **Parameters**:
  - `pathA`: Initial SVG `d` attribute string.
  - `pathB`: Destination SVG `d` attribute string.
  - `t`: Normalized progression factor from `0` to `1`.
- **Returns**: Formatted SVG path string representing the exact intermediate state.

---

### `calculateIntermediatePaths(pathA: string, pathB: string, steps: number = 10): string[]`
Calculates an array of evenly spaced morphing keyframe path strings from `pathA` to `pathB`.

```typescript
const frames = calculateIntermediatePaths(triangleD, circleD, 8);
// frames[0] === triangle, frames[7] === circle
```

---

### `createCreationFromNoneInterpolator(finalD: string, options?: {...}): (t: number) => string`
Creates a high-performance closure that interpolates an icon path from its visual centroid ($t = 0$) to its complete final geometry ($t = 1$).

- **Options**:
  - `staggerOffset?: number`: Temporal delay offset for multi-part icon paths.
  - `iconCenter?: { cx: number; cy: number }`: Explicit visual center coordinates (defaults to auto-calculated bbox centroid).

```typescript
const interpolator = createCreationFromNoneInterpolator(iconPathD, {
  iconCenter: { cx: 12, cy: 12 }
});

// t = 0: All points collapsed at (12, 12)
const frame0 = interpolator(0);

// t = 1: Exact final icon path
const finalFrame = interpolator(1);
```

---

### `calculateCreationFromNoneFrames(finalD: string, steps: number = 14, staggerOffset?: number, iconCenter?: { cx: number; cy: number }): string[]`
Generates the precomputed frame string array used by native SVG `<animate>` elements.
- **Timeline Structure**:
  - `p = 0.0`: Completely collapsed to centroid $(cx, cy)$.
  - `p = 0.1 → 0.9`: Smooth cubic ease-out blossoming outward.
  - `p = 1.0` (Frames 6–10): Dedicated hold period at 100% completion in the exact final shape.
  - `p = 0.9 → 0.0` (Frames 11–13): Smooth contraction loop back to 0.

---

### `parseSvgBodyToMorphablePaths(svgBody: string, iconSlug: string, steps: number = 14): MorphablePath[]`
Parses raw SVG markup (which may contain `<path>`, `<circle>`, `<line>`, `<rect>`, `<polygon>`, or `<polyline>` elements), converts all geometry into canonical cubic Bézier path strings, and precomputes creation-from-none morph frames.

```typescript
const morphablePaths = parseSvgBodyToMorphablePaths(icon.body, icon.slug, 14);
morphablePaths.forEach(mp => {
  console.log(mp.originalD);     // Full final path
  console.log(mp.valuesString);  // Semicolon-delimited frames for <animate>
});
```

---

## 2. Multi-Framework Code Generators (`src/utils/codeGenerators.ts`)

Vectofi provides 8 output generators supporting modern front-end frameworks:

```typescript
import { generateFrameworkCode } from './codeGenerators';

const code = generateFrameworkCode(icon, {
  framework: 'react', // 'react' | 'vue' | 'svelte' | 'angular' | 'html' | 'css' | 'sprite' | 'native'
  size: 24,
  strokeWidth: 2,
  color: '#3B82F6',
  animated: true,
  animationSpeed: 'normal'
});
```

### Supported Frameworks:
1. **React / TSX**: Standalone functional component with `React.SVGProps<SVGSVGElement>` typing.
2. **Vue 3**: Single File Component with `<script setup lang="ts">` and reactive props.
3. **Svelte**: Svelte 4/5 component with reactive `export let` variables.
4. **Angular**: Standalone Angular component with `@Input()` bindings.
5. **Raw Inline SVG**: Self-contained SVG markup with embedded `<style>` keyframe animations or `<animate>` elements.
6. **Tailwind CSS**: Semantic HTML with Tailwind utility classes.
7. **SVG Sprite Reference**: `<svg><use href="#icon-slug" /></svg>` symbol reference.
8. **CSS Data URI**: URL-encoded SVG string for `background-image` CSS rules.

---

## 3. Core Data Models (`src/types.ts`)

### `IconDefinition`
```typescript
export interface IconDefinition {
  id: string;                    // Unique identifier (matches slug)
  name: string;                  // Human-readable title (e.g. "Arrow Right")
  slug: string;                  // URL-friendly slug (e.g. "arrow-right")
  category: string;              // Category ID (e.g. "arrows", "media", "interface")
  tags: string[];                // Search and discovery keyword array
  style: 'outline' | 'solid' | 'duotone'; // Visual style
  body: string;                  // Inner SVG child markup
  hasAnimation: boolean;         // Animation availability flag
  animationType?: AnimationType; // 'pulse' | 'bounce' | 'spin' | 'shake' | 'slide' | 'morph' | 'float' | 'draw'
  popularity?: number;           // Search ranking score (0 - 100)
  featured?: boolean;            // Featured badge display flag
  license?: string;              // "MIT"
  author?: string;               // Author attribution
  isNew?: boolean;               // New release badge flag
}
```

### `IconCategory`
```typescript
export interface IconCategory {
  id: string;                    // Category key (e.g. "interface")
  name: string;                  // Display title (e.g. "Interface & Controls")
  description: string;           // Concise domain description
  iconSymbol: string;            // Visual category glyph or symbol
  count?: number;                // Dynamically counted icons in category
}
```

---

## 4. Central Utilities & Constants (`src/utils/common.ts`)

- `ICON_COUNT_DISPLAY`: Display string formatted as `'1,000+'`.
- `ANIMATED_ICONS_DISPLAY`: Display string formatted as `'900+'`.
- `CATEGORIES_COUNT`: Total registered categories evaluated dynamically as `${ICON_CATEGORIES.length}` (`20`).
- `APP_CANONICAL_URL`: `https://vectofi.vercel.app/`.
- `APP_REPOSITORY_URL`: `https://github.com/ankit628792/vectofi`.
