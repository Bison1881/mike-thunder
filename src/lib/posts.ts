/*
 * The Duty Log. Entries are synced from Mike's Substack feed at build time
 * (scripts/fetch-posts.mjs → src/data/posts.json) and merged with the editorial
 * metadata in postMeta.ts, so publishing a post is all it takes for it to appear
 * here on the next rebuild.
 *
 * Nothing fetches at runtime — the merge happens during prerender.
 */

import rawPosts from '../data/posts.json';
import { POST_META } from './postMeta';

export interface Post {
  /** Log number — rendered zero-padded as "LOG #0003". */
  log: number;
  slug: string;
  title: string;
  /** ISO date. Formatted for display by lib/time.ts. */
  date: string;
  /** Optional patrol time, e.g. "02:14 HRS" — shown on the featured card. */
  time?: string;
  excerpt: string;
  pinned?: boolean;
  url: string;
}

interface SyncedPost {
  slug: string;
  title: string;
  url: string;
  date: string;
  excerpt: string;
}

interface PostData {
  generatedAt: string | null;
  posts: SyncedPost[];
}

const data = rawPosts as PostData;

export const syncedAt = data.generatedAt;

/*
 * posts.json is stored oldest-first, so the index gives each entry its log
 * number (#0001 is the first entry ever filed). postMeta can pin a number
 * explicitly if a deletion would otherwise shift it.
 */
export const POSTS: Post[] = (data.posts ?? []).map((p, i) => {
  const meta = POST_META[p.slug] ?? {};
  return {
    log: meta.log ?? i + 1,
    slug: p.slug,
    title: p.title,
    date: p.date,
    time: meta.time,
    // Hand-written copy wins; the feed's auto-excerpt is the fallback so a brand
    // new post still reads properly before anyone writes card copy for it.
    excerpt: meta.excerpt ?? p.excerpt,
    pinned: meta.pinned,
    url: p.url,
  };
});

/** "LOG #0003" — the mono chip that opens every card's meta row. */
export function logNumber(post: Post): string {
  return `LOG #${String(post.log).padStart(4, '0')}`;
}

/** Newest entries first, by log number. */
export function latestPosts(limit?: number): Post[] {
  const sorted = [...POSTS].sort((a, b) => b.log - a.log);
  return limit ? sorted.slice(0, limit) : sorted;
}
