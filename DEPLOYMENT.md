# Deploy the Tarot web app (Render static site)

This repository is the **Vite + React frontend** only. Card and tutorial data are served by your API (see [docs/TAROT_API_SERVER_SPEC.md](docs/TAROT_API_SERVER_SPEC.md)).

## Build-time environment

| Variable | Required | Purpose |
|----------|----------|---------|
| `VITE_API_BASE` | Yes (for real data) | API **origin** only, no trailing slash, e.g. `https://your-api.onrender.com` |

The client calls `${VITE_API_BASE}/api/cards`, `/api/tutorials`, etc.

Do **not** put privileged secrets in `VITE_*` variables (they are embedded in the bundle).

## Render (Blueprint)

[render.yaml](render.yaml) defines a **static site** (`runtime: static`): `npm install && npm run build`, publish `./dist`, SPA rewrite `/*` → `/index.html`, and `VITE_API_BASE` for the build.

1. Connect the repo on Render and apply the blueprint (or create a **Static Site** manually with the same settings).
2. Change `VITE_API_BASE` in `render.yaml` (or in the dashboard) if your API URL changes.
3. After deploy, open the `.onrender.com` URL and exercise routes (e.g. `/tutorial`, `/admin`).

## Admin UI

The admin page uses `Authorization: Bearer` with a token the user pastes in the browser. That token must match whatever your **API** validates (`ADMIN_API_KEY` or equivalent on the API service—not in this repo).

## Local production build

```bash
npm run build
npm run preview
```

Uses [`.env.production`](.env.production) for `VITE_API_BASE` when present.

## Assets

Card JPEGs live under [public/tarot-images/](public/tarot-images/). Paths like `/tarot-images/foo.jpg` from the API resolve against the **site** origin, so files must ship in this build.
