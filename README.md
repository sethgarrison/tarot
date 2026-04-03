# Tarot Deck Reader

Vite + React frontend for a tarot reader and tutorials. Data comes from a separate HTTP API ([contract](docs/TAROT_API_SERVER_SPEC.md)).

## Prerequisites

- Node.js 20+
- npm

## Setup

```bash
git clone https://github.com/yourusername/tarot.git
cd tarot
npm install
```

## Local development

[`.env.development`](.env.development) sets `VITE_API_BASE` for the hosted API. Run:

```bash
npm run dev
```

Open `http://localhost:5173`. The API must allow **CORS** from your dev origin (or use `Access-Control-Allow-Origin: *`).

To point at another API, edit `VITE_API_BASE` in `.env.development`.

## Scripts

- `npm run dev` — Vite dev server
- `npm run build` — typecheck + production build → `dist/`
- `npm run preview` — serve `dist/` locally
- `npm run lint` — ESLint

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) and [render.yaml](render.yaml) (Render **static site**).

## Tech stack

- React 19, TypeScript, Vite, SWR, react-router-dom

## License

[MIT License](LICENSE)
