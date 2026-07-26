/*
 * Build-time news-wire aggregator. Fetches every source in feeds.config.mjs,
 * self-heals a dead/empty feed via Google News, de-dups, sorts newest-first, and
 * writes src/data/feeds.json for SSG to prerender from.
 *
 * Run: `npm run feeds:fetch` (also `--dry-run`). Runs automatically as the
 * prebuild step, so every deploy regenerates the wire fresh.
 *
 * Resilience contract: a dead or malformed feed is skipped and logged, never
 * throws, never fails the build — a missing wire degrades to the design's
 * placeholder slots rather than a broken page.
 */

import Parser from 'rss-parser';
import { writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SOURCES, googleNewsUrl } from './feeds.config.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = resolve(__dirname, '../src/data/feeds.json');
const DRY_RUN = process.argv.includes('--dry-run');

const FETCH_TIMEOUT_MS = 10_000;
const HARD_TIMEOUT_MS = 15_000;
const MAX_ITEMS_PER_FEED = 8;
const MAX_WIRE_ITEMS = 40; // homepage shows 3; the rest feed the /news-wire page

const UA = 'Mozilla/5.0 (compatible; TheThinPurpleLine/1.0; +https://mikethunder.substack.com)';
const HEADERS = {
  'User-Agent': UA,
  Accept: 'application/rss+xml, application/atom+xml, application/xml;q=0.9, */*;q=0.8',
};

const parser = new Parser({ timeout: FETCH_TIMEOUT_MS, headers: HEADERS });

// ── Fetch/parse hardening ───────────────────────────────────────────────────

function withHardTimeout(promise, ms, label) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`Hard timeout after ${ms}ms (${label})`)), ms)
    ),
  ]);
}

function sanitizeXml(input) {
  return input
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '')
    .replace(/&(?!(?:amp|lt|gt|quot|apos|#[0-9]+|#x[0-9a-fA-F]+);)/g, '&amp;');
}

async function fetchAndParseLenient(url) {
  const res = await fetch(url, { headers: HEADERS, signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
  if (!res.ok) throw new Error(`Status ${res.status}`);
  return parser.parseString(sanitizeXml(await res.text()));
}

async function parseAny(url, label) {
  try {
    return await withHardTimeout(parser.parseURL(url), HARD_TIMEOUT_MS, label);
  } catch {
    return withHardTimeout(fetchAndParseLenient(url), HARD_TIMEOUT_MS, `${label} (lenient)`);
  }
}

function stripHtml(input) {
  if (!input) return '';
  return input
    .replace(/<[^>]*>/g, '')
    // Decode &amp; first so double-encoded numeric refs (&amp;#8211;) resolve,
    // then numeric (hex + decimal) refs, then the common named ones.
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

function isoOf(item) {
  return (
    item.isoDate ||
    (item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString())
  );
}

// ── Per-source fetch → normalized WireItem[] ────────────────────────────────

async function fetchSource(source) {
  let feed = null;
  let via = source.url;

  if (source.url) {
    try {
      feed = await parseAny(source.url, source.name);
    } catch {
      feed = null;
    }
  }

  // Self-heal: no/empty/failed native feed → the source's Google News query.
  if (!feed || !(feed.items || []).length) {
    const gnews = googleNewsUrl(source.query, source.region);
    if (gnews) {
      try {
        feed = await parseAny(gnews, `${source.name} (Google News)`);
        via = gnews;
      } catch {
        /* keep whatever we had (possibly nothing) */
      }
    }
  }

  if (!feed) {
    return { ok: false, source: source.name, via, error: 'fetch failed', items: [] };
  }

  const viaGNews = Boolean(via && via.includes('news.google.com'));
  const items = (feed.items || [])
    .slice(0, MAX_ITEMS_PER_FEED)
    .map((item) => {
      let title = stripHtml(item.title || '');
      // Google News appends " - Publisher" to every headline — strip it.
      if (viaGNews) title = title.replace(/\s+[-–]\s+[^-–]+$/, '').trim();
      return {
        title,
        link: item.link || '',
        source: source.name,
        publishedAt: isoOf(item),
      };
    })
    .filter((it) => it.title && it.link);

  return { ok: true, source: source.name, via, count: items.length, items };
}

// ── De-dup by normalized title AND URL ──────────────────────────────────────

const normTitle = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const normUrl = (u) => {
  try {
    const x = new URL(u);
    return (x.host + x.pathname).toLowerCase().replace(/\/$/, '');
  } catch {
    return u;
  }
};

function dedup(items) {
  const seenT = new Set();
  const seenU = new Set();
  const out = [];
  for (const it of items) {
    const t = normTitle(it.title);
    const u = normUrl(it.link);
    if (seenT.has(t) || seenU.has(u)) continue;
    seenT.add(t);
    seenU.add(u);
    out.push(it);
  }
  return out;
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const startedAt = new Date();
  console.log(`[wire] Fetching ${SOURCES.length} sources at ${startedAt.toISOString()}`);

  const results = await Promise.all(SOURCES.map(fetchSource));
  const ok = results.filter((r) => r.ok);
  const failed = results.filter((r) => !r.ok);

  for (const r of ok) {
    const fellBack = r.via && r.via.includes('news.google.com') ? ' [→GoogleNews]' : '';
    console.log(`[wire]   ok    ${r.source.padEnd(24)} ${r.count} items${fellBack}`);
  }
  for (const r of failed) {
    console.warn(`[wire]   FAIL  ${r.source.padEnd(24)} ${r.error}`);
  }

  const wire = dedup(
    ok.flatMap((r) => r.items).sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
  ).slice(0, MAX_WIRE_ITEMS);

  const output = {
    generatedAt: startedAt.toISOString(),
    wire,
    log: {
      sourceCount: SOURCES.length,
      ok: ok.map((r) => ({
        source: r.source,
        count: r.count,
        googleNews: r.via?.includes('news.google.com') || false,
      })),
      failed: failed.map((f) => ({ source: f.source, error: f.error })),
    },
  };

  if (DRY_RUN) {
    console.log('[wire] DRY RUN — first 5 items:');
    console.log(JSON.stringify(wire.slice(0, 5), null, 2));
    return;
  }

  await mkdir(dirname(OUTPUT_PATH), { recursive: true });
  await writeFile(OUTPUT_PATH, JSON.stringify(output, null, 2), 'utf-8');
  const elapsed = ((Date.now() - startedAt.getTime()) / 1000).toFixed(2);
  console.log(`[wire] Wrote ${wire.length} items to ${OUTPUT_PATH} in ${elapsed}s`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    // Even a fatal error must not fail the build — log loud, leave the wire be.
    console.error('[wire] Fatal error (build continues):', err);
    process.exit(0);
  });
