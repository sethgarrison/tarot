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

## SPA routing (deep links, refresh, iOS)

This app uses **React Router** with browser URLs (`/reader`, `/deck`, …). The static host must serve **`index.html`** for those paths (not a real file on disk). Otherwise a **full page load** to `/reader` returns **404**; some browsers (especially mobile Safari) may show a generic “not found” and odd download-like behavior depending on the response `Content-Type`.

- **Render** (this repo’s [render.yaml](render.yaml)): configure **`/*` → `/index.html`** (rewrite), as in the blueprint.
- **GitHub Pages**: there is no rewrite rule. After `npm run build`, **`postbuild`** copies `dist/index.html` to **`dist/404.html`** so GitHub Pages serves your app shell for unknown paths (see `scripts/gh-pages-spa-fallback.mjs`). For a **project site** at `https://<user>.github.io/<repo>/`, also set Vite [`base`](https://vite.dev/config/shared-options.html#base) to `'/<repo>/'` and the npm `homepage` field so asset URLs resolve.

**Check your deployment** (replace with your site origin):

```bash
curl -sI "https://YOUR-SITE/reader" | sed -n '1,15p'
```

You want **200** (or GitHub Pages **404** with an HTML body from your `404.html` shell) and **`content-type: text/html`**, not `application/octet-stream` or similar.

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
