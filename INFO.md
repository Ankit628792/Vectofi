# Vectofi Information & Specification (INFO.md)

## 1. Project Specifications

| Metric | Specification |
| :--- | :--- |
| **Grid System** | $24 \times 24$ unit viewBox (`viewBox="0 0 24 24"`) |
| **Default Stroke Width** | `2px` (customizable from `0.5px` to `4.0px`) |
| **Stroke Linecap** | `round` |
| **Stroke Linejoin** | `round` |
| **Total Registered Icons** | **17,049 production-grade vector icons** |
| **Animated Icons Count** | **16,906 icons** with native motion presets |
| **Total Categories** | **20 domain-specific categories** |
| **Animation Types** | `pulse`, `bounce`, `spin`, `shake`, `slide`, `morph`, `float`, `draw` |
| **Color Inheritance** | `currentColor` by default; custom Hex/RGB configurable in Laboratory |
| **Framework Code Generators** | React (TSX/JSX), Vue 3 SFC, Svelte 4/5, Angular Standalone, Inline SVG, CSS Data URI, Tailwind CSS |
| **License** | MIT & Apache 2.0 Permissive Open Source Licenses |

---

## 2. Category Distribution & Counts

| Category | Slug | Icon Count | Typical Examples |
| :--- | :--- | :---: | :--- |
| **Interface & Controls** | `interface` | 5,527 | `check`, `x`, `sliders`, `toggle-left`, `menu`, `search`, `filter`, `settings`, `power` |
| **Arrows & Directions** | `arrows` | 1,109 | `arrow-up`, `arrow-right`, `chevron-down`, `corner-down-left`, `rotate-cw`, `shuffle` |
| **Editor & Typography** | `editor` | 871 | `bold`, `italic`, `underline`, `align-left`, `list`, `heading`, `highlighter`, `typography` |
| **Communication** | `communication` | 863 | `mail`, `message-square`, `phone`, `send`, `inbox`, `bell`, `megaphone`, `quote` |
| **Files & Folders** | `files` | 858 | `file`, `folder`, `file-text`, `folder-plus`, `archive`, `clipboard`, `receipt` |
| **Design & Creative** | `design` | 829 | `pen-tool`, `palette`, `brush`, `crop`, `layers`, `ruler`, `scissors`, `wand`, `shapes` |
| **Social & Engagement** | `social` | 804 | `heart`, `star`, `bookmark`, `thumbs-up`, `award`, `trophy`, `sparkles`, `flame`, `brands` |
| **Media, Audio & Video** | `media` | 793 | `play`, `pause`, `volume-2`, `mic`, `camera`, `video`, `music`, `disc`, `film` |
| **Devices & Hardware** | `devices` | 760 | `smartphone`, `laptop`, `monitor`, `cpu`, `wifi`, `battery-charging`, `hard-drive` |
| **Commerce & Finance** | `commerce` | 680 | `shopping-cart`, `shopping-bag`, `credit-card`, `wallet`, `dollar-sign`, `percent`, `coins` |
| **Weather & Climate** | `weather` | 547 | `sun`, `moon`, `cloud`, `cloud-rain`, `cloud-snow`, `wind`, `zap`, `thermometer` |
| **Security & Privacy** | `security` | 519 | `lock`, `unlock`, `shield`, `shield-check`, `key`, `fingerprint`, `scan`, `eye` |
| **Navigation & Places** | `navigation` | 505 | `compass`, `map`, `map-pin`, `navigation`, `signpost`, `globe`, `waypoint` |
| **Business & Analytics** | `business` | 450 | `bar-chart`, `pie-chart`, `presentation`, `calendar`, `briefcase`, `kanban`, `clock` |
| **Travel & Transport** | `travel` | 438 | `plane`, `train`, `car`, `bus`, `ship`, `bike`, `rocket`, `fuel`, `hotel`, `luggage` |
| **Users & Teams** | `users` | 412 | `user`, `users`, `user-plus`, `user-check`, `contact`, `group`, `id-card`, `gender` |
| **Development & Code** | `development` | 379 | `code`, `terminal`, `git-branch`, `git-commit`, `database`, `webhook`, `api`, `braces` |
| **Sports & Gaming** | `sports` | 276 | `gamepad-2`, `dice-5`, `trophy`, `dumbbell`, `target`, `joystick`, `medal`, `ball` |
| **Food & Dining** | `food` | 253 | `coffee`, `cup-soda`, `utensils`, `pizza`, `wine`, `beer`, `cake`, `cookie`, `apple` |
| **Health & Wellness** | `health` | 176 | `heart-pulse`, `pill`, `hospital`, `stethoscope`, `dna`, `syringe`, `activity` |

---

## 3. Motion & Animation Presets

Vectofi implements lightweight, standards-compliant CSS and SVG keyframe animation presets:

1. **`pulse`**: Smooth rhythmic opacity and scale expansion, ideal for live beacons, signals, status indicators, and heartbeats.
2. **`bounce`**: Subtle vertical translation with elastic easing, ideal for download indicators, arrows, and action callouts.
3. **`spin`**: Continuous 360-degree rotation with linear or eased timing, ideal for loaders, refresh buttons, dials, and fans.
4. **`shake`**: Subtle horizontal vibration effect, ideal for notifications, alert bells, error signals, and warnings.
5. **`slide`**: Horizontal translational shift, ideal for next/previous indicators, directions, and transport vectors.
6. **`morph`**: Dynamic point and path scale transformation for seamless state morphing.
7. **`float`**: Organic sinusoidal floating motion, ideal for weather, clouds, space, and aerial vehicles.
8. **`draw`**: SVG `stroke-dasharray` and `stroke-dashoffset` progressive line-drawing effect, ideal for signatures, pens, and outlines.

---

## 4. Accessibility & Web Standards (WCAG AA)

- **Decorative Icons**: When paired with adjacent text, icons are marked with `aria-hidden="true"`.
- **Standalone Icons**: Icon-only interactive controls include descriptive `aria-label` tags.
- **Reduced Motion Support**: All CSS animation keyframes include `@media (prefers-reduced-motion: reduce)` fallbacks to respect user system preferences.
- **Color Independence**: Visual hierarchy is maintained using shape distinction and stroke variations, not solely color hue.

---

## 5. Contact & Support

- **Author**: Ankit Kumar
- **Instagram**: [https://www.instagram.com/ankit_628792](https://www.instagram.com/ankit_628792)
- **Repository**: [https://github.com/Ankit628792/Vectofi](https://github.com/Ankit628792/Vectofi)
- **Live Studio**: [https://vectofi.vercel.app](https://vectofi.vercel.app)
