/*
 * Editorial metadata for duty-log entries, keyed by Substack slug.
 *
 * Titles, dates, URLs, and fallback excerpts come from the feed
 * (scripts/fetch-posts.mjs → src/data/posts.json). Everything here is a
 * deliberate human choice the feed can't supply, so it's kept by hand:
 *
 *   pinned  — show the outlined PINNED chip
 *   time    — the patrol stamp on the featured card, e.g. "02:14 HRS"
 *   excerpt — hand-written card copy; overrides the feed's auto-excerpt
 *   log     — force a log number (see below)
 *
 * Log numbers are otherwise assigned from publish order: oldest post is
 * LOG #0001. That's stable as long as posts are only ever added — but deleting
 * an old post would renumber everything after it. If that ever happens, pin the
 * affected numbers here with `log` to keep them permanent.
 *
 * A slug with no entry here is fine: it renders with feed data alone, which is
 * what makes new posts appear automatically.
 */

export interface PostMeta {
  pinned?: boolean;
  time?: string;
  excerpt?: string;
  log?: number;
}

export const POST_META: Record<string, PostMeta> = {
  'how-to-loss-prevent-someone-right': {
    time: '02:14 HRS',
    excerpt:
      'A field guide to retail loss prevention, apprehension technique, and the single most confusing arrest of my entire career.',
  },
  'status-nothing-to-report': {
    pinned: true,
    excerpt: 'The manifesto. Why nothing happening is the whole job.',
  },
  'well-hello-there-strangers': {
    excerpt: 'Introductions, credentials, and a tour of the guard shack.',
  },
};
