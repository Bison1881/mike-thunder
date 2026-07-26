# The Thin Purple Line

Mike Thunder's security duty log — *Status: Nothing To Report*. Dark, utilitarian,
purple-accented. Posts currently live on
[Substack](https://mikethunder.substack.com/); this site is the home page in front
of them, plus an RSS-fed security news wire.

## Stack

Same stack as **the-206-fix**, deliberately:

| Piece | What it does |
| --- | --- |
| Vite 5 + React 18 + TypeScript | build + components |
| `vite-react-ssg` | prerenders **every route to static HTML** at build time |
| `react-router-dom` | routing (one URL per section) |
| CSS Modules + `src/styles/tokens.css` | styling; no CSS framework |
| `rss-parser` + `scripts/fetch-feeds.mjs` | build-time news-wire aggregation |
| Vercel | hosting (`vercel.json`, output `dist/`) |

> `vite-react-ssg` is pinned to exactly **0.9.1**. 0.9.2+ requires Vite 6, which
> would break the Vite 5 stack shared with the-206-fix. Don't loosen it to `^`
> without upgrading Vite too.

Nothing fetches at runtime: the wire is baked into the prerendered HTML, so a
refresh means a rebuild (see *Deploying*).

## Commands

```bash
npm install
npm run dev          # local dev at http://localhost:5173
npm run build        # prebuild fetches feeds → vite-react-ssg build → dist/
npm run preview      # serve the built dist/
npm run typecheck    # tsc --noEmit
npm run feeds:fetch  # refresh src/data/feeds.json now (--dry-run to just look)
```

## Editing content

Everything editable lives in three files — no CMS yet.

- **`src/lib/site.ts`** — wordmark, status line, Substack URLs, footer copyright,
  the ticker segments, and the two toggles the design exposed
  (`showTicker`, `showWatermark`).
- **`src/lib/posts.ts`** — the duty log. Each entry has a log number, title, ISO
  date, optional `time` ("02:14 HRS", shown on the featured card), excerpt,
  `pinned` flag, and `url`. Newest log number becomes the featured card; the next
  two stack beside it. When posts move off Substack, swap this array for a
  markdown/CMS loader — every surface reads through `latestPosts()`.
- **`scripts/feeds.config.mjs`** — news-wire sources. ⚠ **The current four are
  placeholders** (physical-security / loss-prevention defaults) pending your real
  feed URLs. Each source has a native `url` plus a Google News `query` that is
  used automatically if the native feed is dead or empty, so a wrong URL degrades
  instead of leaving a hole.

If the wire has no items at all, the homepage falls back to the design's three
placeholder slots rather than showing an empty section.

## Deploying

Push to the Vercel-linked repo; `vercel.json` runs `npm run build`, whose
`prebuild` step regenerates the wire. `src/data/feeds.json` is a **build
artifact** and is gitignored.

To refresh the wire on a schedule, `.github/workflows/refresh-feeds.yml` pings a
Vercel Deploy Hook every 3 hours. One-time setup: create the hook in
Vercel → Settings → Git → Deploy Hooks, then save the URL as the GitHub secret
`VERCEL_DEPLOY_HOOK_URL`. Until that secret exists the job no-ops.

## Routes

`/` is the only designed page. Every other route renders the interior scaffold
(`src/pages/StubPage.tsx`) so navigation is whole and crawlable while those
designs are pending: `/duty-log`, `/news-wire`, `/links`, `/about`, `/contact`,
`/merch`, plus a 404.

## Design source of truth

`design_handoff_thin_purple_line/Home.html` is the approved homepage. The build
was verified against it element-by-element (identical box geometry, type,
colour, and document height) and by a difference-blend overlay at desktop width.
Two notes if you touch the CSS:

- `src/styles/tokens.css` is a 1:1 port of the design's palette and type stack.
  Changing a token changes the whole site — that's the point.
- `global.css` deliberately does **not** set `-webkit-font-smoothing`; forcing
  `antialiased` visibly thins this type against the ink background and broke
  parity with the design.

Responsive rules are additions (the handoff is desktop-only): nav collapses
behind a MENU button below 1080px, the duty-log and wire grids stack below 900px,
and the 88px H1 steps down to 66/48/44px.

`design_handoff_thin_purple_line/Homepage Explorations.html` holds two rejected
directions kept as reference for interior pages (incident-report stamp, dispatch
sidebar).
