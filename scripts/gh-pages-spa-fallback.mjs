/**
 * GitHub Pages has no configurable server rewrite for SPAs. For unknown paths it
 * serves /404.html (HTTP 404) instead of index.html. Copying the built shell
 * lets react-router handle client-side routes after a hard refresh or
 * "Open in New Tab" on /reader, etc.
 */
import { copyFileSync, existsSync } from 'node:fs';

const src = 'dist/index.html';
const dest = 'dist/404.html';

if (!existsSync(src)) {
  console.error('gh-pages-spa-fallback: missing dist/index.html (build first).');
  process.exit(1);
}

copyFileSync(src, dest);
console.log('gh-pages-spa-fallback: wrote dist/404.html');
