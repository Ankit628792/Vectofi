# Vectofi Information & Specification (INFO.md)

## 1. Project Specifications

| Metric | Value |
| :--- | :--- |
| **Grid System** | $24 \times 24$ unit viewBox (`viewBox="0 0 24 24"`) |
| **Default Stroke Width** | `2px` (customizable from `0.5px` to `4px`) |
| **Stroke Linecap** | `round` |
| **Stroke Linejoin** | `round` |
| **Total Icons** | 121 production-grade icons |
| **Animation Support** | 100% of icons support native SVG path morphing |
| **Color Model** | Inherits `currentColor` or uses custom hex/RGB inputs |

---

## 2. Icon Library Catalog Breakdown

The icon collection is categorized into 10 domain-specific sets:

| Category | Icon Count | Typical Examples |
| :--- | :---: | :--- |
| **Navigation** | 16 | `arrow-left`, `arrow-right`, `chevron-down`, `compass`, `menu`, `external-link` |
| **Media & Audio** | 14 | `play`, `pause`, `volume-high`, `music`, `camera`, `video`, `film` |
| **Actions** | 16 | `heart`, `star`, `bookmark`, `download`, `share-2`, `trash-2`, `check` |
| **Communication** | 12 | `mail`, `message-square`, `phone`, `send`, `inbox`, `bell` |
| **Commerce & Finance** | 10 | `shopping-cart`, `shopping-bag`, `credit-card`, `dollar-sign`, `tag` |
| **Devices & Hardware** | 11 | `smartphone`, `laptop`, `monitor`, `cpu`, `wifi`, `battery-charging` |
| **Editor & Text** | 12 | `edit-3`, `code`, `copy`, `scissors`, `align-left`, `type` |
| **Files & Folders** | 10 | `file`, `folder`, `file-text`, `folder-plus`, `archive` |
| **System & Settings** | 12 | `settings`, `shield`, `sliders`, `clock`, `calendar`, `database` |
| **Weather & Nature** | 8 | `sun`, `moon`, `cloud`, `cloud-rain`, `zap`, `wind` |

---

## 3. Mathematical Foundations of Path Morphing

SVG `<path>` elements cannot naturally morph into one another unless they share the **exact same number of segments** and **matching command tokens** (`M`, `C`, `Z`). Vectofi solves this using an algorithmic geometry pipeline in `src/utils/animations.ts`.

### 3.1 Canonical Cubic Bézier Normalization
To avoid mismatched command tokens (e.g. attempting to morph an arc `A` with a line `L` or curve `C`), all path commands are converted into cubic Bézier curves (`C`):
- **Lines (`L x y`)**: Converted to `C cp1x cp1y cp2x cp2y x y` where control points lie along the segment ($1/3$ and $2/3$).
- **Elliptical Arcs (`A rx ry rot large sweep x y`)**: Converted into sequences of cubic curves using standard W3C parametric arc decomposition (`arcToCubics`).
- **Quadratics (`Q cp x y`)**: Promoted to cubics using the degree elevation formula:
  $$CP_1 = P_0 + \frac{2}{3}(QP - P_0), \quad CP_2 = P_1 + \frac{2}{3}(QP - P_1)$$

### 3.2 Dynamic Point Generation via de Casteljau Subdivision
When morphing between shapes of different complexities (for instance, a 3-segment triangle morphing into a 20-segment star or circle), missing points must be added dynamically without clustering at corners:
1. **Arc Length Estimation**: Gravesen's approximation estimates segment curve length:
   $$L \approx \frac{\text{chord} + \text{net\_polygon}}{2}$$
2. **Dynamic Splitting**: The longest segment along the contour is repeatedly identified and subdivided at $t = 0.5$ using de Casteljau's algorithm:
   $$Q_0 = (1-t)P_0 + tCP_1, \quad Q_1 = (1-t)CP_1 + tCP_2, \quad Q_2 = (1-t)CP_2 + tP_3$$
   $$R_0 = (1-t)Q_0 + tQ_1, \quad R_1 = (1-t)Q_1 + tQ_2$$
   $$S_0 = (1-t)R_0 + tR_1$$
   This yields two new cubic curves $(P_0, Q_0, R_0, S_0)$ and $(S_0, R_1, Q_2, P_3)$ that match the original geometry with zero visual distortion while adding the required control points.

### 3.3 Creation-From-None Morphing
To achieve the "creation from none" blossoming effect:
1. The visual centroid $(cx, cy)$ of the entire icon is calculated across all bounding boxes.
2. At progress $p = 0$, every point and control point collapses to $(cx, cy)$.
3. Over frames $0 \to 5$, coordinates expand outward using cubic easing.
4. Frames $6 \to 10$ hold at 100% completion in the exact final shape.
5. Frames $11 \to 13$ smoothly return to 0 to create an infinite, seamless loop.

### 3.4 Circular Phase Alignment
For closed loops (`Z`), the starting point of one shape may be located at the top while the counterpart starts at the bottom. An angular/distance phase scan determines the cyclic permutation that minimizes total Euclidean point travel:
$$\arg\min_{k} \sum_{i=0}^{N-1} \| P_A[i] - P_B[(i + k) \bmod N] \|^2$$
This eliminates rotational twists and self-intersecting artifacts during morphing.

---

## 4. Architectural Boundaries & Conventions

- **100% Client-Side Ready**: The vector laboratory and icon components are standalone client-side React components.
- **Accessible Markups**: Every icon contains appropriate `aria-hidden` attributes or descriptive titles.
- **Fallback Guarantee**: When morphing is inactive or finishes, the renderer mounts the authentic SVG string directly (`dangerouslySetInnerHTML={{ __html: icon.body }}`) to ensure zero degradation of native vector strokes.
