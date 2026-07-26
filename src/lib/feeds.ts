/*
 * Typed access to the build-time aggregated news wire (src/data/feeds.json,
 * produced by scripts/fetch-feeds.mjs). Nothing fetches at runtime — the wire
 * is baked into the prerendered HTML and refreshed by rebuilding.
 */

import rawData from '../data/feeds.json';

export interface WireItem {
  title: string;
  link: string;
  source: string;
  publishedAt: string;
}

interface FeedData {
  generatedAt: string | null;
  wire: WireItem[];
}

const data = rawData as FeedData;

export const generatedAt = data.generatedAt;
export const wire: WireItem[] = data.wire ?? [];

/**
 * Newest wire items, newest first — but spread across sources: at most one item
 * per source on the first pass, then a second, and so on. Without this the
 * three homepage slots routinely fill with three headlines from whichever feed
 * happened to publish most recently, which reads like a single-source wire.
 */
/** Every source currently on the wire, with its item count, busiest first. */
export function wireSources(): { source: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const item of wire) counts.set(item.source, (counts.get(item.source) ?? 0) + 1);
  return [...counts.entries()]
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count || a.source.localeCompare(b.source));
}

/** The whole wire, newest first — the /news-wire page shows all of it. */
export function wireByDay(): { day: string; items: WireItem[] }[] {
  const byDay = new Map<string, WireItem[]>();
  const sorted = [...wire].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
  for (const item of sorted) {
    // Group on the UTC date so server and client agree (see lib/time.ts).
    const day = item.publishedAt.slice(0, 10);
    const bucket = byDay.get(day);
    if (bucket) bucket.push(item);
    else byDay.set(day, [item]);
  }
  return [...byDay.entries()].map(([day, items]) => ({ day, items }));
}

export function wireItems(limit?: number): WireItem[] {
  const bySource = new Map<string, WireItem[]>();
  for (const item of wire) {
    const bucket = bySource.get(item.source);
    if (bucket) bucket.push(item);
    else bySource.set(item.source, [item]);
  }

  const spread: WireItem[] = [];
  const buckets = [...bySource.values()];
  for (let pass = 0; spread.length < wire.length; pass++) {
    for (const bucket of buckets) {
      if (bucket[pass]) spread.push(bucket[pass]);
    }
  }

  return limit ? spread.slice(0, limit) : spread;
}
