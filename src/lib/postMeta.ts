/*
 * Editorial metadata for duty-log entries, keyed by Substack slug.
 *
 * Titles, dates, URLs, and summaries all come from the feed
 * (scripts/fetch-posts.mjs → src/data/posts.json). Everything here is a
 * deliberate human choice the feed can't supply:
 *
 *   pinned  — show the outlined PINNED chip
 *   time    — the patrol stamp on the featured card, e.g. "02:14 HRS"
 *   log     — force a log number (see below)
 *   excerpt — escape hatch only; see the rule below before using it
 *
 * ── Card summaries are the post's Substack subtitle ──────────────────────
 * Substack puts the subtitle in the feed's <description>, which is what
 * fetch-posts.mjs stores as the excerpt. So writing a subtitle on Substack is
 * all it takes — the card picks it up on the next rebuild, and the site never
 * disagrees with the post.
 *
 * That's why `excerpt` overrides are absent here. Don't add one to write nicer
 * copy; change the subtitle on Substack instead. The single override below
 * exists only because Substack's feed hasn't yet caught up with an edit.
 *
 * ── Log numbers ──────────────────────────────────────────────────────────
 * Assigned from publish order: oldest post is LOG #0001. Stable as long as
 * posts are only added — deleting an old one would renumber everything after
 * it. If that happens, pin the affected numbers here with `log`.
 *
 * A slug with no entry here is fine, and normal: it renders on feed data alone.
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
    /*
     * TEMPORARY. The post's real subtitle is "Britches Get Stitches, ya'll.",
     * but this entry was retitled after publishing and Substack's feed still
     * carries the old body-text description ("For some time at the beginning of
     * my career…"). Delete this line once the feed shows the subtitle — check
     * with `npm run posts:fetch -- --dry-run`.
     */
    excerpt: "Britches Get Stitches, ya'll.",
  },
  'status-nothing-to-report': {
    pinned: true,
  },
};
