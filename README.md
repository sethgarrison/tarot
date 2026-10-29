# Tarot Deck Reader

Vite + React tarot reader and tutorials. Fully static: card and tutorial content lives in [src/data/](src/data/).

## Prerequisites

- Node.js 20+
- npm

## Setup

```bash
git clone https://github.com/sethgarrison/tarot.git
cd tarot
npm install
```

## Local development

```bash
npm run dev
```

Open `http://localhost:5173`.

## Scripts

- `npm run dev` — Vite dev server
- `npm run build` — typecheck + production build → `dist/`
- `npm run preview` — serve `dist/` locally
- `npm run lint` — ESLint

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) (Cloudflare Pages).

## Tech stack

- React 19, TypeScript, Vite, SWR, react-router-dom

## License

[MIT License](LICENSE)
