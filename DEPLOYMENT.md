# Deploy the Tarot web app (Cloudflare Workers)

The app is fully static. Card and tutorial content is bundled from [src/data/](src/data/), so there is no API, database or build-time env var to set up. It is served as Workers static assets, configured in [wrangler.jsonc](wrangler.jsonc).

## Cloudflare Workers Builds

The `tarot` Worker is connected to this repo (Cloudflare dashboard → **Workers & Pages** → `tarot` → **Settings** → **Build**). It needs:

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy` (the default)
- Root directory: `/`

Each push to `main` deploys to production, and pushes to other branches upload a preview version. The build check shows up on PRs.

### SPA routing

`"not_found_handling": "single-page-application"` in `wrangler.jsonc` serves `index.html` with a **200** status for paths that aren’t files, so deep links like `/deck` and `/tutorial` work on refresh and on iOS. Don’t remove it.

Check it:

```bash
curl -sI "https://tarot.YOUR-SUBDOMAIN.workers.dev/deck" | head -1
```

You want `HTTP/2 200`.

### Deploy from your machine (optional)

```bash
npm run build && npx wrangler deploy
```

## Editing content

- Cards: [src/data/cards.json](src/data/cards.json). Multilingual fields look like `{ "en": "...", "es": "..." }`. A missing `es` falls back to English.
- Tutorials: [src/data/tutorials.json](src/data/tutorials.json). Same shape; `content` can be a string or nested JSON per language.
- UI strings: [src/data/translations.json](src/data/translations.json).

Commit and push to redeploy.

## Assets

Card JPEGs live in [public/tarot-images/](public/tarot-images/). Each card's `image_path` in `cards.json` points at one of them.

## Local production build

```bash
npm run build
```

```bash
npm run preview
```
