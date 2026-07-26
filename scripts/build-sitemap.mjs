/*
 * Post-build: emit sitemap.xml and robots.txt into dist/.
 *
 * The route list is derived from the prerendered output rather than kept in a
 * parallel array — every indexable route is a dist/*.html file, so scanning the
 * directory can't drift out of sync with what actually shipped.
 *
 * Pages carrying `<meta name="robots" content="noindex">` (the placeholders and
 * the 404) are skipped, so the sitemap never advertises a page we've asked
 * Google to ignore.
 *
 * Runs as the `postbuild` step.
 */

import { readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = resolve(dirname(fileURLToPath(import.meta.url)), '../dist');

// Keep in step with src/lib/seo.ts — this script can't import a .ts module.
const SITE_URL = 'https://mikethunder.com';

/** dist/index.html → "/", dist/duty-log.html → "/duty-log" */
const routeOf = (file) => (file === 'index.html' ? '/' : `/${file.replace(/\.html$/, '')}`);

/*
 * Rough priority: the homepage leads, the two real content sections follow, then
 * the evergreen pages. Search engines treat this as a hint at most, but getting
 * the ordering wrong is a wasted signal.
 */
function priorityFor(route) {
  if (route === '/') return '1.0';
  if (route === '/duty-log' || route === '/news-wire') return '0.9';
  return '0.6';
}

/* The wire and the log change on every rebuild; About/Contact rarely do. */
function changefreqFor(route) {
  if (route === '/' || route === '/news-wire') return 'daily';
  if (route === '/duty-log') return 'weekly';
  return 'monthly';
}

async function main() {
  const files = (await readdir(DIST)).filter((f) => f.endsWith('.html'));

  const routes = [];
  for (const file of files) {
    const html = await readFile(resolve(DIST, file), 'utf-8');
    if (/<meta[^>]+name=["']robots["'][^>]+noindex/i.test(html)) {
      console.log(`[sitemap]   skip (noindex)  ${routeOf(file)}`);
      continue;
    }
    routes.push(routeOf(file));
  }

  // Shortest first puts "/" at the top and keeps the file readable.
  routes.sort((a, b) => a.length - b.length || a.localeCompare(b));

  const lastmod = new Date().toISOString().slice(0, 10);
  const sitemap = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...routes.map((route) =>
      [
        '  <url>',
        `    <loc>${SITE_URL}${route === '/' ? '/' : route}</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        `    <changefreq>${changefreqFor(route)}</changefreq>`,
        `    <priority>${priorityFor(route)}</priority>`,
        '  </url>',
      ].join('\n')
    ),
    '</urlset>',
    '',
  ].join('\n');

  const robots = [
    'User-agent: *',
    'Allow: /',
    '',
    '# Placeholders and the 404 carry their own noindex meta.',
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    '',
  ].join('\n');

  await writeFile(resolve(DIST, 'sitemap.xml'), sitemap, 'utf-8');
  await writeFile(resolve(DIST, 'robots.txt'), robots, 'utf-8');

  routes.forEach((r) => console.log(`[sitemap]   ok             ${r}`));
  console.log(`[sitemap] Wrote sitemap.xml (${routes.length} urls) and robots.txt`);
}

main().catch((err) => {
  // A missing sitemap shouldn't fail a deploy that is otherwise fine.
  console.error('[sitemap] Failed (build continues):', err);
});
