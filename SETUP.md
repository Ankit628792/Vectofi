# Vectofi Setup Guide (SETUP.md)

This document provides complete instructions for configuring, running, and deploying the Vectofi application locally or in a containerized production environment.

---

## 1. System Requirements

Ensure your environment meets the following specifications:

- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **Package Manager**: `npm` (v9+), `pnpm` (v8+), `yarn` (v1.22+), or `bun` (v1.0+)
- **Operating System**: Linux, macOS, or Windows (WSL2 recommended for Windows)

---

## 2. Quick Installation

Clone the repository and install project dependencies:

```bash
# Clone the repository
git clone https://github.com/Ankit628792/Vectofi.git
cd Vectofi

# Install dependencies using npm
npm install

# Alternatively, using bun:
# bun install
```

---

## 3. Environment Configuration

Vectofi is a zero-configuration, standalone vector icon studio and path morphing engine. All rendering, interpolation calculations, and code generations run directly in modern browsers without requiring third-party API keys or external database credentials.

If you are customizing host configurations or deployment base URLs, you can optionally configure `.env.example`:

```bash
cp .env.example .env
```

Variables in `.env.example`:
```env
# Base host URL for deployment (used in sitemap and robots.txt generation)
APP_URL=https://vectofi.dev
```

---

## 4. Running the Development Server

To launch the local development server:

```bash
npm run dev
```

The application boots Vite on port `3000`:
- **Local URL**: `http://localhost:3000`
- **Network URL**: `http://0.0.0.0:3000`

> **Note**: Port 3000 is the default port configured in `package.json` (`vite --port=3000 --host=0.0.0.0`).

---

## 5. Scripts Reference

The following npm scripts are defined in `package.json`:

| Command | Action | Description |
| :--- | :--- | :--- |
| `npm run dev` | `vite --port=3000 --host=0.0.0.0` | Starts hot-reloading development server |
| `npm run build` | `vite build` | Compiles production assets into `dist/` |
| `npm run preview` | `vite preview` | Locally serves the compiled production build |
| `npm run lint` | `tsc --noEmit` | Runs the TypeScript compiler in strict typecheck mode |
| `npm run clean` | `rm -rf dist server.js` | Cleans up previous build artifacts |

---

## 6. Verifying Build & Type Safety

Before pushing changes or deploying, verify that the project passes TypeScript validation and builds cleanly:

```bash
# 1. Typecheck the codebase
npm run lint

# 2. Compile production bundle
npm run build
```

Successful compilation outputs static HTML, JavaScript, and CSS bundles to the `dist/` directory.

---

## 7. Troubleshooting & FAQ

### Port 3000 is already in use
If another service is occupying port 3000, kill the conflicting process or specify an alternate port locally:
```bash
# Linux / macOS
lsof -i :3000
kill -9 <PID>

# Or launch Vite with an alternate port
npx vite --port 3001
```

### Missing dependencies or `module not found`
If node modules are incomplete or corrupted:
```bash
rm -rf node_modules package-lock.json
npm install
```

### TypeScript errors in node_modules
Ensure you are using TypeScript 5.8+ as specified in `package.json`.
