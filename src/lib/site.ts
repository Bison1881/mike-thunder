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
} as const;
