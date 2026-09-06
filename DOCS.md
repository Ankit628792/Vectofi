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

## 2. Core Data Models (`src/types.ts`)

### `IconData`
```typescript
export interface IconData {
  name: string;        // Human-readable title (e.g. "Arrow Right")
  slug: string;        // Unique identifier (e.g. "arrow-right")
  category: string;    // Category slug (e.g. "navigation", "media")
  tags: string[];      // Searchable keywords
  body: string;        // Raw inner SVG markup
  hasAnimation: boolean; // Indicates if icon supports path morphing
}
```

### `MorphablePath`
```typescript
export interface MorphablePath {
  id: string;             // Unique path instance ID
  originalD: string;      // The completed final path 'd' attribute
  valuesString: string;   // Semicolon-delimited frame string for <animate values="...">
  strokeWidth?: string;
  fill?: string;
}
```

### `LabSettings`
```typescript
export interface LabSettings {
  size: number;           // Icon pixel dimension (e.g. 24, 32, 48)
  strokeWidth: number;    // Vector stroke width (e.g. 2)
  color: string;          // Hex or CSS color string
  animated: boolean;      // Static vs morphing toggle
  speed: 'fast' | 'normal' | 'slow';
  bgTheme: 'dark' | 'light' | 'grid' | 'slate' | 'gradient';
}
```

---

## 3. UI Component Reference

### `<AnimatedIconRenderer />`
High-level rendering component that automatically renders either authentic vector markup (when static) or synchronized morphing paths with `<animate>` elements (when active).

```tsx
import { AnimatedIconRenderer } from './components/vector/AnimatedIconRenderer';

<AnimatedIconRenderer
  icon={iconData}
  size={32}
  color="#3b82f6"
  strokeWidth={2}
  animated={true}
  speed="normal"
/>
```

#### Props
| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `icon` | `IconData` | **Required** | The icon object to render |
| `size` | `number` | `24` | Width and height in pixels |
| `color` | `string` | `"currentColor"` | Stroke color |
| `strokeWidth` | `number` | `2` | Stroke thickness in pixels |
| `animated` | `boolean` | `true` | When `false`, renders native static markup |
| `speed` | `'fast' \| 'normal' \| 'slow'` | `'normal'` | Morphing loop duration (1.2s, 2.4s, 4.0s) |
| `className` | `string` | `""` | Additional CSS classes |

---

## 4. Integration Guide

### Vanilla JavaScript / Canvas Loop
You can use `createPathMorphTransition` or `interpolatePathData` inside a `requestAnimationFrame` loop:

```javascript
import { interpolatePathData } from './src/utils/animations';

const pathA = "M 12 2 L 22 22 L 2 22 Z";
const pathB = "M 6 4 L 18 12 L 6 20 Z";
const pathElement = document.querySelector('#morphing-path');

let start = null;
function animate(timestamp) {
  if (!start) start = timestamp;
  const progress = (timestamp - start) / 2000; // 2-second cycle
  const t = (Math.sin(progress * Math.PI * 2) + 1) / 2; // Oscillate 0 -> 1 -> 0
  
  pathElement.setAttribute('d', interpolatePathData(pathA, pathB, t));
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
```

### Pure SVG Export
All generated animations use standard W3C SVG SMIL attributes:
```html
<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#2563eb" stroke-width="2">
  <path d="M 12 2 L 22 22 L 2 22 Z">
    <animate
      attributeName="d"
      dur="2.4s"
      repeatCount="indefinite"
      values="M 12 12 C 12 12 ...; M 12 2 C 15.3 8.6 ...; M 12 2 L 22 22 L 2 22 Z"
    />
  </path>
</svg>
```
Because this requires no JavaScript, the exported SVG files are 100% compatible with HTML `<img>` tags, CSS backgrounds, and standalone vector renderers.
