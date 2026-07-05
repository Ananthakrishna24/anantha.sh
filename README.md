# anantha.sh

Personal portfolio site for Me. A single-page Svelte 5 app with four screens, a pixel-canvas backdrop, animated transitions, and a light/dark theme.

## Features

- **Four screens** — `01 HELLO`, `02 WORK`, `03 PROJECTS`, `04 CONTACT`, each with its own accent color.
- **Navigation** — click tabs, arrow keys (`←`/`→`), number keys (`1`–`4`), or swipe on touch devices.
- **Pixel canvas** — reactive animated background (`PixelCanvas.svelte` + `fx.js`).
- **Theme toggle** — light/dark with an animated wipe, persisted to `localStorage`.
- **Live IST clock** in the footer.
- **Respects `prefers-reduced-motion`** — animations disable when the OS asks.

## Stack

Svelte 5 (runes) · Vite · deployed on Netlify.

## Develop

```bash
npm install
npm run dev      # dev server with HMR
npm run build    # production build -> dist/
npm run preview  # serve the build locally
```
