/*
 * Site-wide copy and switches. The design exposed these as CMS props
 * (showTicker, tickerText, showWatermark); until a CMS is wired up this file is
 * the single place to edit them.
 */

export const SITE = {
  wordmark: 'THE THIN PURPLE LINE',
  status: 'STATUS: NOTHING TO REPORT',
  substack: 'https://mikethunder.substack.com/',
  subscribe: 'https://mikethunder.substack.com/subscribe',
  copyright: '© 2026 MIKE THUNDER · END OF SHIFT · NOTHING TO REPORT',

  /** Status ticker — the scrolling bar above the header. */
  showTicker: true,
  tickerSegments: [
    'STATUS: NOTHING TO REPORT',
    'SHIFT 3 OF ∞',
    'ALL QUIET BEHIND THE PURPLE LINE',
    'PERIMETER: SECURE',
    'COFFEE LEVEL: CRITICAL',
  ],

  /** Oversized logo bleeding off the bottom-right of the hero. */
  showWatermark: true,

  /*
   * Section switches. The pages and their URLs still exist (and stay noindex);
   * these only control whether the nav and footer point at them, so nobody
   * clicks through to a section that hasn't opened. Flip to true when there's
   * something on the other side.
   *
   * Note this departs from the approved design, whose nav includes LINKS and
   * whose footer includes MERCH (SOON). Restoring both is one word each.
   */
  showLinks: false,
  showMerch: false,
} as const;
