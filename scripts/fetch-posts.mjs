/*
 * Build-time duty-log sync. Pulls the posts from Mike's Substack feed and
 * writes src/data/posts.json, so a new post appears on the site at the next
 * rebuild instead of waiting for someone to edit a hand-maintained array.
 *
 * Run: `npm run posts:fetch` (also `--dry-run`). Runs as part of `prebuild`.
 *
 * Unlike the news wire, src/data/posts.json IS committed. It's the site's own
 * content, not borrowed headlines, so the repo keeps a last-known-good copy and
 * a failed fetch degrades to that rather than to an empty duty log. This script
 * never overwrites a good file with nothing and never fails the build.
 *
 * Editorial metadata the feed can't provide — pinned flag, the "02:14 HRS"
 * patrol stamp, hand-written excerpts — lives in src/lib/postMeta.ts and is
 * merged in at render time, keyed by slug.
 */

import Parser from 'rss-parser';
import { writeFile, mkdir, readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = resolve(__dirname, '../src/data/posts.json');
const DRY_RUN = process.argv.includes('--dry-run');

const FEED_URL = 'https://mikethunder.substack.com/feed';
const TIMEOUT_MS = 15_000;
const EXCERPT_MAX = 150;

/*
 * no-cache matters here. Substack serves the feed through Cloudflare with
 * per-edge caching, and a build machine can land on an edge holding a copy from
 * before the newest post existed — the fetch "succeeds", writes stale data, and
 * the article silently fails to appear. Observed exactly that: a build fetched
 * 3 posts (CF-Cache-Status HIT, Age 875) while the origin had 4.
 */
const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (compatible; TheThinPurpleLine/1.0)',
  Accept: 'application/rss+xml, application/atom+xml, application/xml;q=0.9, */*;q=0.8',
  'Cache-Control': 'no-cache',
  Pragma: 'no-cache',
};

/** Unique query string per run, so a cached edge response can't be reused. */
const cacheBusted = (url) => `${url}${url.includes('?') ? '&' : '?'}_=${Date.now()}`;

const parser = new Parser({ timeout: TIMEOUT_MS, headers: HEADERS });

function stripHtml(input) {
  if (!input) return '';
  return input
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(parseInt(n, 10)))
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function truncate(input, max) {
  if (!input || input.length <= max) return input || '';
  return input.slice(0, max).replace(/\s+\S*$/, '') + '…';
}

/** Substack permalinks are /p/<slug>; the slug is our stable join key. */
function slugOf(link) {
  const m = (link || '').match(/\/p\/([^/?#]+)/);
  return m ? m[1] : '';
}

async function main() {
  console.log(`[posts] Fetching ${FEED_URL}`);

  let feed;
  try {
    feed = await parser.parseURL(cacheBusted(FEED_URL));
  } catch (err) {
    console.warn(`[posts] FAILED (${err.message}) — keeping existing posts.json`);
    return;
  }

  const posts = (feed.items || [])
    .map((item) => {
      const url = (item.link || '').split('?')[0];
      return {
        slug: slugOf(url),
        title: stripHtml(item.title || ''),
        url,
        // ISO date; lib/time.ts formats it with UTC getters for hydration safety.
        date: item.isoDate || (item.pubDate ? new Date(item.pubDate).toISOString() : ''),
        // Fallback excerpt only — postMeta.ts overrides win where they exist.
        excerpt: truncate(stripHtml(item.contentSnippet || item.content || ''), EXCERPT_MAX),
      };
    })
    .filter((p) => p.slug && p.title && p.date)
    // Oldest first: log numbers are assigned from publish order, so #0001 is
    // the first entry ever filed.
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  if (!posts.length) {
    console.warn('[posts] Feed parsed but yielded 0 usable posts — keeping existing posts.json');
    return;
  }

  // Don't regress: if the feed briefly returns fewer posts than we already
  // have on disk, treat it as suspect and keep what we know is good.
  try {
    const existing = JSON.parse(await readFile(OUTPUT_PATH, 'utf-8'));
    const had = (existing.posts || []).length;
    if (posts.length < had) {
      console.warn(`[posts] Feed returned ${posts.length} posts but ${had} are on disk — keeping existing.`);
      return;
    }
  } catch {
    /* no existing file — first run */
  }

  const output = { generatedAt: new Date().toISOString(), posts };

  if (DRY_RUN) {
    console.log('[posts] DRY RUN:');
    console.log(JSON.stringify(output, null, 2));
    return;
  }

  await mkdir(dirname(OUTPUT_PATH), { recursive: true });
  await writeFile(OUTPUT_PATH, JSON.stringify(output, null, 2) + '\n', 'utf-8');
  posts.forEach((p, i) => console.log(`[posts]   LOG #${String(i + 1).padStart(4, '0')}  ${p.title}`));
  console.log(`[posts] Wrote ${posts.length} posts to ${OUTPUT_PATH}`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('[posts] Fatal error (build continues):', err);
    process.exit(0);
  });
