# Vectofi

> Developer-first SVG icon library featuring 17,000+ static and animated vector icons across 20 categories, an interactive SVG laboratory, framework code generators, and an advanced vector animation engine.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-cyan.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8.svg)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-6-646cff.svg)](https://vitejs.dev/)
[![Icons](https://img.shields.io/badge/Icons-17000%2B-emerald.svg)](https://vectofi.vercel.app)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub](https://img.shields.io/badge/GitHub-Ankit628792%2Fvectofi-181717.svg?logo=github)](https://github.com/Ankit628792/vectofi)

---

## Overview

**Vectofi** is an open-source, developer-centric vector icon ecosystem designed for modern web applications. It provides **17,000+ carefully crafted SVG icons** (17,049 exact icons) designed on a precision $24 \times 24$ pixel grid.

Beyond traditional static vector icons, Vectofi includes an integrated **Interactive SVG Laboratory** and **Animation Engine** featuring 16,000+ animated icons with native keyframe motion presets (`pulse`, `bounce`, `spin`, `shake`, `slide`, `morph`, `float`, and `draw`). Exported icons run natively in all modern browsers with zero external animation dependencies.

---

## Key Features

- **17,000+ Precision Vector Icons**: Production-grade SVG icons across 20 functional domains with unified stroke weights and geometry.
- **16,000+ Animated Icons**: Native SVG and CSS motion presets with configurable loop speeds, delays, and trigger modes.
- **Background Web Worker Engine**: Off-thread icon catalog indexing, fast fuzzy filtering, and on-demand SVG geometry streaming for buttery 60+ FPS navigation.
- **Interactive SVG Laboratory**: Real-time inspection canvas with live preview, zoom, stroke weight customizer ($0.5\text{px} \to 4.0\text{px}$), color palettes, animation speeds, and stage backdrop themes.
- **Multi-Framework Export**: 1-click code generation for:
  - **React (TSX / JSX)**
  - **Vue 3 (Composition API / SFC)**
  - **Svelte 4 / 5**
  - **Angular (Standalone Component)**
  - **Inline SVG / Raw Markup**
  - **CSS Data URI**
  - **Tailwind CSS Utility Classes**
  - **SVG Sprite `<use>` References**
- **Search & Filter Engine**: Instant client-side search across icon names, slugs, categories, and descriptive semantic tags.
- **Zero Runtime Overhead**: Exported SVGs are 100% native vector markup and run cleanly without bloated dependencies.
- **MIT Open Source License**: 100% free for commercial, open-source, and personal projects.

---

## Icon Categories (20 Total)

| Category | Slug | Icons | Highlights |
| :--- | :--- | :---: | :--- |
| **Interface & Controls** | `interface` | 5,527 | Check, cross, sliders, toggle, menu, search, filter, settings, power |
| **Arrows & Directions** | `arrows` | 1,109 | Arrow directional sets, chevrons, rotate, shuffle, expand, shrink |
| **Editor & Typography** | `editor` | 871 | Bold, italic, underline, list, align, heading, text, highlighter, quote |
| **Communication** | `communication` | 863 | Message, chat, mail, phone, call, notification bell, inbox, megaphone |
| **Files & Folders** | `files` | 858 | Document, folder, archive, clipboard, invoice, sheet, pdf, receipt |
| **Design & Creative** | `design` | 829 | Pen, palette, brush, crop, layers, ruler, scissors, wand, vector art |
| **Social & Engagement** | `social` | 804 | Heart, star, bookmark, thumb, award, trophy, flame, share, brands |
| **Media, Audio & Video** | `media` | 793 | Play, pause, camera, video, mic, volume, equalizer, waveform, music |
| **Devices & Hardware** | `devices` | 760 | Laptop, phone, tablet, monitor, cpu, wifi, battery, server, chip |
| **Commerce & Finance** | `commerce` | 680 | Cart, bag, credit card, wallet, dollar, percent, discount, coins |
| **Weather & Climate** | `weather` | 547 | Sun, moon, cloud, rain, wind, storm, snowflake, thermometer |
| **Security & Privacy** | `security` | 519 | Lock, shield, key, fingerprint, scan, eye, badge-check |
| **Navigation & Places** | `navigation` | 505 | Compass, map, pin, signpost, globe, waypoint, anchor |
| **Business & Analytics** | `business` | 450 | Bar chart, pie chart, presentation, calendar, briefcase, kanban, clock |
| **Travel & Transport** | `travel` | 438 | Plane, train, car, bus, ship, bike, rocket, luggage, hotel |
| **Users & Teams** | `users` | 412 | User, users, user-check, avatar, group, contact, id-card |
| **Development & Code** | `development` | 379 | Code, terminal, git branch, commit, database, api, bug, braces |
| **Sports & Gaming** | `sports` | 276 | Gamepad, dice, trophy, target, dumbbell, joystick, medal |
| **Food & Dining** | `food` | 253 | Coffee, cup, utensils, pizza, wine, beer, cake, apple, cookie |
| **Health & Wellness** | `health` | 176 | Heart-pulse, pill, hospital, stethoscope, syringe, activity |

---

## Tech Stack

| Technology | Version | Purpose |
| :--- | :--- | :--- |
| **React** | 19.x | High-performance UI components, reactive state, and virtualized grid |
| **TypeScript** | 5.8.x | Full type safety and geometry interfaces |
| **Tailwind CSS** | 4.x | Modern utility-first styling with dark/light themes |
| **Vite** | 6.x | Ultra-fast development server and production bundler |
| **Web Workers** | ES Modules | Background catalog parsing, search indexing & geometry streaming |
| **Motion** | 12.x | Fluid layout transitions and animated modal reveals |
| **Lucide React** | 0.546.x | Supplemental UI control iconography |

---

## Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/Ankit628792/vectofi.git
cd vectofi

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open in browser
# http://localhost:3000
```

---

## Documentation Links

- [Icons.md](./Icons.md) — Complete searchable directory of all 17,049 icons with animation flags and tags.
- [INFO.md](./INFO.md) — Architectural overview, geometric grid standards, and category distributions.
- [USAGE.md](./USAGE.md) — Complete user guide for the SVG Laboratory, framework generators, and styling customizers.
- [DOCS.md](./DOCS.md) — API reference, Web Worker architecture, and framework integration snippets.
- [SETUP.md](./SETUP.md) — Environment configuration, scripts, and deployment instructions.

---

## Repository & Links

- **Live Application**: [https://vectofi.vercel.app](https://vectofi.vercel.app)
- **GitHub Repository**: [https://github.com/Ankit628792/vectofi](https://github.com/Ankit628792/vectofi)
- **Issues & Discussions**: [https://github.com/Ankit628792/vectofi/issues](https://github.com/Ankit628792/vectofi/issues)

---

## Author

Designed & Developed by [Ankit Kumar](https://www.instagram.com/ankit_628792)  
Contact: `ankit628792@gmail.com`

---

## License

Distributed under the [MIT License](./LICENSE). Copyright © 2026 [Ankit Kumar](https://github.com/Ankit628792/vectofi). Free for personal and commercial usage.
