# Deploy the Tarot web app (Cloudflare Pages)

The app is fully static. Card and tutorial content is bundled from [src/data/](src/data/), so there's no API, database, or build-time env var to set up.

## Cloudflare Pages

1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git** → pick `sethgarrison/tarot`.
2. Build settings:
   - Framework preset: **None**, or Vite if offered
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Environment variable: `NODE_VERSION=20`
3. Save and deploy. Every push to the production branch redeploys.

### SPA routing

No configuration is needed. When the output has no `404.html`, Pages serves `index.html` with a **200** status for unknown paths, so deep links like `/deck` and `/tutorial` work on refresh and on iOS. Don't add a `404.html` to `public/`, because it would switch this behavior off.

Check it:

```bash
curl -sI "https://YOUR-SITE.pages.dev/deck" | head -1
```

You want `HTTP/2 200`.

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
