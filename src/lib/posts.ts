/*
 * The Duty Log — the blog's content source. Posts currently live on Substack,
 * so each entry carries its permalink and the site links out. When posts move
 * in-house this module is the seam: swap the array for a markdown/CMS loader and
 * every surface (homepage, archive) keeps working.
 *
 * Fields mirror the patrol-log flavour of the design: a log number, a date, and
 * an optional "HRS" time stamped on featured entries.
 */

export interface Post {
  /** Log number — rendered zero-padded as "LOG #0003". */
  log: number;
  slug: string;
  title: string;
  /** ISO date (YYYY-MM-DD). Formatted for display by lib/time.ts. */
  date: string;
  /** Optional patrol time, e.g. "02:14 HRS" — shown on the featured card. */
  time?: string;
  excerpt: string;
  pinned?: boolean;
  /** Where the post lives. Substack permalinks for now. */
  url: string;
}

export const POSTS: Post[] = [
  {
    log: 3,
    slug: 'loss-prevent-right-out-of-their-pants',
    title: 'How to Loss-Prevent Someone Right Out of Their Pants',
    date: '2026-06-27',
    time: '02:14 HRS',
    excerpt:
      'A field guide to retail loss prevention, apprehension technique, and the single most confusing arrest of my entire career.',
    url: 'https://mikethunder.substack.com/',
  },
  {
    log: 2,
    slug: 'status-nothing-to-report',
    title: 'Status: Nothing To Report',
    date: '2026-06-17',
    excerpt: 'The manifesto. Why nothing happening is the whole job.',
    pinned: true,
    url: 'https://mikethunder.substack.com/',
  },
  {
    log: 1,
    slug: 'well-hello-there-strangers',
    title: 'Well, Hello There, Strangers',
    date: '2026-06-17',
    excerpt: 'Introductions, credentials, and a tour of the guard shack.',
    url: 'https://mikethunder.substack.com/',
  },
];

/** "LOG #0003" — the mono chip that opens every card's meta row. */
export function logNumber(post: Post): string {
  return `LOG #${String(post.log).padStart(4, '0')}`;
}

/** Newest entries first, by log number. */
export function latestPosts(limit?: number): Post[] {
  const sorted = [...POSTS].sort((a, b) => b.log - a.log);
  return limit ? sorted.slice(0, limit) : sorted;
}
