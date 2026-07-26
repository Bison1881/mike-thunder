/*
 * Canonical site identity for search engines and link previews.
 *
 * SITE_URL is the single place the production origin is defined — canonical
 * tags, og:url, and the generated sitemap all derive from it. Change it here and
 * everything follows.
 *
 * Apex, not www: pick one host and stick to it, or search engines index both and
 * split the ranking. www.mikethunder.com should 308 to the apex (configured in
 * Vercel → Domains, not here).
 */

export const SITE_URL = 'https://mikethunder.com';

/** Absolute URL for a route path, e.g. "/duty-log" → "https://mikethunder.com/duty-log". */
export function canonical(path: string): string {
  if (path === '/') return `${SITE_URL}/`;
  return SITE_URL + (path.startsWith('/') ? path : `/${path}`);
}

/** Social preview image — the supplied banner, referenced absolutely. */
export const OG_IMAGE = `${SITE_URL}/banner.jpg`;

/** Suffix every page title carries, so tabs and SERP entries stay branded. */
export const TITLE_SUFFIX = 'The Thin Purple Line';
