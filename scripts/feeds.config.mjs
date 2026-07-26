/*
 * News Wire sources — the single list the build-time aggregator reads.
 *
 * ⚠ PLACEHOLDERS. The handoff says the user supplies the real feed URLs. These
 * are sensible physical-security / loss-prevention defaults so the wire works
 * today; swap or extend the array and the whole pipeline follows.
 *
 *   name  : the label shown on the card ("SOURCE · 3H AGO")
 *   url   : native RSS/Atom URL. Leave '' to rely purely on the Google News
 *           query below.
 *   query : Google News RSS search used when `url` is missing, dead, or empty.
 *           This is the self-heal that keeps a wrong URL from leaving a gap.
 */

export const SOURCES = [
  {
    name: 'Loss Prevention Media',
    url: 'https://losspreventionmedia.com/feed/',
    query: '"loss prevention" retail',
  },
  {
    name: 'Security Magazine',
    url: 'https://www.securitymagazine.com/rss/articles',
    query: '"physical security" OR "security officer" industry',
  },
  {
    name: 'Retail Crime',
    url: '',
    query: '"organized retail crime" OR "retail theft"',
  },
  {
    name: 'Guard Beat',
    url: '',
    query: '"security guard" OR "security officer"',
  },
];

/** Google News RSS for a plain-text query. */
export function googleNewsUrl(query) {
  if (!query) return null;
  return `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US:en`;
}
