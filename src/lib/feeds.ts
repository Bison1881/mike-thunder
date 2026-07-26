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
