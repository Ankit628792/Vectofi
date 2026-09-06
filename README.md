# Vectofi

> Developer-first SVG icon library featuring static and animated vector icons, an interactive SVG laboratory, framework code generators, and an advanced SVG path morphing engine.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-cyan.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8.svg)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-6-646cff.svg)](https://vitejs.dev/)
[![GitHub](https://img.shields.io/badge/GitHub-Ankit628792%2FVectofi-181717.svg?logo=github)](https://github.com/Ankit628792/Vectofi)

---

## Overview

**Vectofi** is an open-source, developer-centric vector icon ecosystem designed for modern web applications. It provides 120+ carefully crafted SVG icons designed on a precision $24 \times 24$ pixel grid.

Beyond traditional static vector icons, Vectofi includes an integrated **Vector Path Morphing Engine** that enables dynamic, seamless SVG shape transitions without heavy third-party animation runtimes. The engine uses de Casteljau cubic Bézier subdivision and linear interpolation to morph paths of varying geometric complexity smoothly from scratch or between different iconography states.

---

## Key Features

- **120+ Precision Icons**: Hand-tuned vector paths across 10 categories (Navigation, Media, Actions, Communication, Commerce, Devices, Editor, Files, System, Shapes).
- **Creation-from-None Morphing**: Organic blossom transitions that expand paths outward from their visual centroid ($cx, cy$) into the finished icon.
- **Dynamic Point Generation**: Mathematical subdivision powered by de Casteljau's algorithm and Gravesen arc-length approximation, guaranteeing point-to-point linear interpolation between paths of differing complexity without point clustering.
- **Interactive Vector Laboratory**: Real-time inspection canvas with side-by-side static vs. animated comparison, zoom controls, coordinate crosshairs, stroke customizer, and color palettes.
- **Multi-Framework Export**: 1-click code generation for:
  - Raw SVG
  - React (TSX / JSX)
  - Vue 3 (Composition API)
  - Svelte
  - Tailwind CSS classes
  - SVG `<use>` Sprite references
- **Local Collections & Favorites**: Organize icons into project buckets stored locally in your browser session.
- **Zero Runtime Dependencies for Generated SVGs**: Exported SVG paths are 100% native SVG and run on standard browser vector engines (`<animate>` or vanilla CSS/JS).

---

## Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **React 19** | Modern UI components, hooks, and reactive state |
| **TypeScript 5.8** | Full type safety and geometry interfaces |
| **Tailwind CSS v4** | Modern utility-first styling with dark mode support |
| **Vite 6** | Ultra-fast development server and production bundler |
| **Lucide React** | Supplemental UI control iconography |
| **Motion** | Fluid layout transitions and modal reveals |

---

## Project Structure

```
├── public/                 # Static public assets and web manifest
├── src/
│   ├── components/
│   │   ├── hero/           # Hero section and vector branding
│   │   ├── laboratory/     # SVG Laboratory inspector modal and playground
│   │   ├── library/        # Icon grid, filters, search, and pagination
│   │   ├── navigation/     # Header, navbar, and theme toggles
│   │   ├── vector/         # Animated SVG renderers and vector decorations
│   │   └── ui/             # Toast alerts, modals, and tooltips
│   ├── data/
│   │   └── icons.ts        # Vector icon database (121 icons with SVG bodies)
│   ├── utils/
│   │   ├── animations.ts   # Core vector path parsing, morphing & interpolation engine
│   │   ├── codeGenerators.ts # Code export generators (React, Vue, Svelte, SVG)
│   │   └── exportUtils.ts  # Download utilities (SVG, PNG, JSON)
│   ├── types.ts            # Core TypeScript interfaces & types
│   ├── App.tsx             # Main application orchestrator
│   └── main.tsx            # Application entry point
├── package.json            # Scripts and dependencies
├── vite.config.ts          # Vite configuration
└── tsconfig.json           # TypeScript configuration
```

---

## Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/Ankit628792/Vectofi.git
cd Vectofi

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open in browser
# http://localhost:3000
```

---

## Documentation Links

- [INFO.md](./INFO.md) - Deep-dive into architecture, icon catalog specifications, and mathematical foundations.
- [SETUP.md](./SETUP.md) - Complete setup guide, environment requirements, and build configurations.
- [USAGE.md](./USAGE.md) - User guide for the icon browser, laboratory, customization, and export workflows.
- [DOCS.md](./DOCS.md) - Developer API reference for the path morphing engine and utility functions.

---

## Repository & Links

- **GitHub Repository**: [https://github.com/Ankit628792/Vectofi](https://github.com/Ankit628792/Vectofi)
- **Issues & Discussions**: [https://github.com/Ankit628792/Vectofi/issues](https://github.com/Ankit628792/Vectofi/issues)

---

## Author

Designed & Developed by [Ankit Kumar](https://www.instagram.com/ankit_628792)

---

## License

Distributed under the [MIT License](./LICENSE). See the [LICENSE](./LICENSE) file for the full legal text and permissions.

Copyright © 2026 [Ankit Kumar](https://github.com/Ankit628792/Vectofi). All vector icons, generators, and library assets are free for personal and commercial usage.
