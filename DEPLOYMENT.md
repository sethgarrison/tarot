# Deploy the Tarot web app (Render static site)

This repository is the **Vite + React frontend** only. Card and tutorial data are served by your API (see [docs/TAROT_API_SERVER_SPEC.md](docs/TAROT_API_SERVER_SPEC.md)).

## Build-time environment

| Variable | Required | Purpose |
|----------|----------|---------|
| `VITE_API_BASE` | Yes (for real data) | API **origin** only, no trailing slash, e.g. `https://your-api.onrender.com` |

The client calls `${VITE_API_BASE}/api/cards`, `/api/tutorials`, etc.

Do **not** put privileged secrets in `VITE_*` variables (they are embedded in the bundle).

## Render (Blueprint)

[render.yaml](render.yaml) defines a **static site** (`runtime: static`): `npm install && npm run build`, publish `./dist`, SPA rewrite `/*` → `/index.html`, and `VITE_API_BASE` for the build. The `name` field must match your static site’s name in the Render dashboard (it controls the default `*.onrender.com` hostname).

1. Connect the repo on Render and apply the blueprint (or create a **Static Site** manually with the same settings).
2. Change `VITE_API_BASE` in `render.yaml` (or in the dashboard) if your API URL changes.
3. After deploy, open the `.onrender.com` URL and exercise routes (e.g. `/tutorial`, `/admin`).
4. If `curl -I https://…/deck` still returns **404**, add the rewrite in the dashboard as in [SPA routing](#spa-routing-deep-links-refresh-ios) (blueprint routes are easy to miss on older services).

## SPA routing (deep links, refresh, iOS)

This app uses **React Router** with browser URLs (`/reader`, `/deck`, …). The static host must serve **`index.html`** for those paths with **HTTP 200** (a **rewrite**, not “show a 404 page that happens to be HTML”).

If `curl` shows **`HTTP/2 404`** but the response body is still your small `index.html` shell (same size as `/`), the CDN may be serving **`404.html`** (if present in the published bundle) with a **404 status**. Mobile Safari treats that as a failed navigation even though the HTML is correct. Prefer a **rewrite** and avoid shipping a duplicate of `index.html` as `404.html` unless you know your host expects it.

### Render (required)

1. In the [Render Dashboard](https://dashboard.render.com/), open your **static site** (e.g. `sissy-foot-tarot`).
2. Open **Redirects / Rewrites** (or **Redirects** in the sidebar, depending on UI).
3. Add a rule: **Source** `/*`, **Destination** `/index.html`, action **Rewrite** (not redirect).

[Blueprint](render.yaml) can define the same `routes`, but if the service was created earlier or the blueprint was not applied, **add the rule in the dashboard** and save. Redeploy if needed.

**Verify** (you want **`200`** for deep links):

```bash
curl -sI "https://YOUR-SITE.onrender.com/deck" | sed -n '1,12p'
```

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
