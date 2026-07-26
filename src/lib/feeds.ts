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

/** Every source currently on the wire, with its item count, busiest first. */
export function wireSources(): { source: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const item of wire) counts.set(item.source, (counts.get(item.source) ?? 0) + 1);
  return [...counts.entries()]
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count || a.source.localeCompare(b.source));
}

/**
 * The wire in the order it arrived — newest first, no bucketing by source or by
 * day. A wire is chronological; that's what makes it a wire.
 *
 * An earlier version round-robined one item per source to force variety. That was
 * added when the four placeholder feeds kept filling every homepage slot from
 * whichever had published most recently. With eight live sources the natural
 * order already mixes them, so the machinery bought nothing and is gone.
 *
 * Sorted here rather than trusting the file's order, so a change to the fetch
 * script can't silently reorder the site.
 */
export function wireItems(limit?: number): WireItem[] {
  const sorted = [...wire].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
  return limit ? sorted.slice(0, limit) : sorted;
}
