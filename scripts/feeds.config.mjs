/*
 * News Wire sources — the single list the build-time aggregator reads.
 *
 *   name   : label shown on the card ("SOURCE · 3H AGO"). Keep it short; it
 *            renders in 11px mono in a narrow column.
 *   url    : native RSS/Atom URL. '' means "query only".
 *   query  : Google News RSS search, used when `url` is missing, dead, or
 *            empty. This is the self-heal that keeps a broken feed from
 *            leaving a gap.
 *   region : optional Google News edition for `query` (default US).
 *
 * The four "Private Security" entries reproduce Mike's Google Alerts searches
 * ("private security" minus the cyber noise, per country) as plain Google News
 * queries. Deliberate: the Alerts feed URLs embed a personal account id, and
 * this repo is public. Google News needs no account, and returns far more
 * items — four of the five Alerts were empty when checked.
 */

/** Google News editions, so a query can be scoped per country. */
export const REGIONS = {
  US: { hl: 'en-US', gl: 'US', ceid: 'US:en' },
  UK: { hl: 'en-GB', gl: 'GB', ceid: 'GB:en' },
  CA: { hl: 'en-CA', gl: 'CA', ceid: 'CA:en' },
  AU: { hl: 'en-AU', gl: 'AU', ceid: 'AU:en' },
};

const PRIVATE_SECURITY = '"private security" -cybersecurity -cyber';

export const SOURCES = [
  // ── The private-security beat, by country (ex-Google Alerts) ───────────
  { name: 'Private Security US', url: '', query: PRIVATE_SECURITY, region: 'US' },
  { name: 'Private Security UK', url: '', query: PRIVATE_SECURITY, region: 'UK' },
  { name: 'Private Security CA', url: '', query: PRIVATE_SECURITY, region: 'CA' },
  { name: 'Private Security AU', url: '', query: PRIVATE_SECURITY, region: 'AU' },

  // ── Trade press ────────────────────────────────────────────────────────
  // asisonline.org sits behind Cloudflare and returns 403 to any server-side
  // fetch (every feed path was tried), so their coverage comes via Google News,
  // which does index them.
  { name: 'Security Management', url: '', query: '"ASIS International" OR "Security Management" security', region: 'US' },
  { name: 'Loss Prevention Media', url: 'https://losspreventionmedia.com/feed/', query: '"loss prevention" retail', region: 'US' },

  // ── Working-guard blogs (from the Feedspot directory, filtered to the ones
  //    that are actually alive and readable rather than vendor SEO copy) ───
  { name: 'Working The Doors', url: 'https://www.workingthedoors.co.uk/feed/', query: '"door supervisor" OR "security guard" UK', region: 'UK' },
  { name: 'GuardsPro', url: 'https://blog.guardspro.com/feed/', query: '"security guard" industry', region: 'US' },
];

/** Google News RSS for a plain-text query, in the given edition. */
export function googleNewsUrl(query, region = 'US') {
  if (!query) return null;
  const r = REGIONS[region] ?? REGIONS.US;
  return `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=${r.hl}&gl=${r.gl}&ceid=${r.ceid}`;
}
