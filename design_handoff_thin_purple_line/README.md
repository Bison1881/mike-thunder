# Handoff: The Thin Purple Line — Blog Homepage

## Overview
Homepage design for **The Thin Purple Line | Status: Nothing To Report** — Mike Thunder's security-themed blog (currently on Substack at https://mikethunder.substack.com/). Dark-themed, security/duty-log aesthetic: charcoal & ink backgrounds, deep royal purple accents, utilitarian type. The site will eventually have: Home, Blog/archive ("Duty Log"), Security news roundup (RSS-fed "News Wire"), Links & recommendations, About, Contact, Subscribe (points to Substack), and a merch placeholder. **Only the homepage is designed so far.**

## About the Design Files
The files in this bundle are **design references created in HTML** — prototypes showing intended look and behavior, not production code to copy directly. The task is to **recreate this design in the target codebase's environment** (e.g., a static site generator, Next.js/Astro, or whatever stack hosts the user's other sites like 206 Fix) using its established patterns. If no environment exists yet, choose an appropriate framework for a mostly-static blog site (Astro or Next.js recommended; needs RSS fetching for the news section).

## Fidelity
**High-fidelity.** `Home.html` is the approved design — recreate it pixel-perfectly. `Homepage Explorations.html` shows two rejected alternates (1b, 1c) kept for reference only; elements from them (incident-report stamp, dispatch sidebar) may be borrowed for future pages.

## Screens / Views

### Home (approved — from `Home.html`)
Full-width dark page, designed at 1200–1440px desktop. Top to bottom:

1. **Status ticker** — full-width bar, background `#6b21a8`, 6px vertical padding. Infinitely scrolling marquee (CSS keyframes, translateX 0 → -50%, 30s linear infinite, duplicated content). Text: IBM Plex Mono 500 12px, letter-spacing .12em, color `#f3e8ff`, segments separated by `◆` with 48px gaps. Copy: "STATUS: NOTHING TO REPORT / SHIFT 3 OF ∞ / ALL QUIET BEHIND THE PURPLE LINE / PERIMETER: SECURE / COFFEE LEVEL: CRITICAL". Should be toggleable/editable in CMS.
2. **Header** — flex row, space-between, padding 18px 48px, bottom border `rgba(255,255,255,.09)`. Left: logo image 52×52 rounded 8px + stacked wordmark: "THE THIN PURPLE LINE" (Quantico 700 20px, letter-spacing .06em) over "STATUS: NOTHING TO REPORT" (IBM Plex Mono 500 11px, `#a49dbb`, letter-spacing .08em). Right nav: Barlow Condensed 600 13px, letter-spacing .18em, 28px gaps — HOME (active `#ece9f1`), DUTY LOG / NEWS WIRE / LINKS / ABOUT / CONTACT (`#a49dbb`), plus SUBSCRIBE button (bg `#9333ea`, white, padding 10px 18px, radius 4px) → https://mikethunder.substack.com/subscribe
3. **Hero** — padding 84px 48px 76px. Background: `radial-gradient(ellipse 900px 500px at 78% 40%, rgba(107,33,168,.28), transparent 65%)` over `#0e0d11`. Logo watermark absolutely positioned bottom-right (width 460px, right -40px, bottom -90px, opacity .16, `filter:saturate(1.3)`, overflow hidden on section). Content column max-width 760px, 22px gaps:
   - Kicker: "EST. 2026 · MEMOIRS OF THE GREATEST SECURITY GUARD, EVER" — IBM Plex Mono 500 13px, `#b57ce8`, letter-spacing .22em
   - H1: "TALES FROM BEHIND THE THIN PURPLE LINE" — Quantico 700 88px, line-height 0.98, `text-wrap:balance`
   - Sub: Barlow 400 19px/1.55, `#a49dbb`, max-width 560px — "Real security. Real incidents. Really long stretches where absolutely nothing happens — reported with total professionalism."
   - CTAs (14px gap): "READ THE LOG" filled `#9333ea`; "SUBSCRIBE ON SUBSTACK" outlined `1px solid rgba(181,124,232,.5)`, text `#d3aef5`. Both: Barlow Condensed 600 15px, letter-spacing .16em, padding 14px 26px, radius 4px.
4. **Duty Log section** — padding 56px 48px. Section header row: "DUTY LOG — LATEST ENTRIES" (Quantico 700 26px, letter-spacing .06em) + "FULL ARCHIVE →" link (`#b57ce8`), bottom border `rgba(255,255,255,.09)`, 14px padding-bottom. Grid `1.4fr 1fr`, 24px gap:
   - **Featured post card**: bg `#17161c`, border `1px solid rgba(255,255,255,.08)`, radius 6px, padding 32px. Meta row: "LOG #0003" chip (bg `rgba(147,51,234,.18)`, border `rgba(147,51,234,.4)`, padding 4px 8px, radius 3px, `#b57ce8`) + "27 JUN · 02:14 HRS" (`#a49dbb`), IBM Plex Mono 500 12px, letter-spacing .1em. Title: Barlow Condensed 700 30px/1.15. Excerpt: Barlow 400 15.5px/1.6 `#a49dbb`. "CONTINUE READING →" `#b57ce8`.
   - **Two stacked smaller cards** (same card style, padding 24px): mono meta "LOG #0002 / 17 JUN / PINNED" (pinned = outlined chip `rgba(255,255,255,.2)`), title Barlow Condensed 600 20px, excerpt Barlow 400 14px `#a49dbb`. Real post titles: "Status: Nothing To Report" (pinned), "Well, Hello There, Strangers".
5. **Security News Wire** — padding 0 48px 56px. Header: "SECURITY NEWS WIRE" (Quantico 700 26px) + "VIA RSS · UPDATED HOURLY" (mono 11px `#a49dbb`). 3-column grid, 24px gap. Each item: `border-left:2px solid #9333ea`, padding-left 16px — source/time line (IBM Plex Mono 500 11px `#a49dbb`) over headline (Barlow Condensed 600 16.5px/1.3 `#ece9f1`). **These are placeholders — implement as server-side RSS fetch; user will supply feed URLs.**
6. **Footer** — top border, padding 28px 48px, space-between. Left: "© 2026 MIKE THUNDER · END OF SHIFT · NOTHING TO REPORT" (IBM Plex Mono 500 12px `#a49dbb`). Right links: SUBSTACK / MERCH (SOON) / CONTACT (Barlow Condensed 600 12px, letter-spacing .16em, `#a49dbb`).

## Interactions & Behavior
- Ticker: continuous CSS marquee, 30s loop; content duplicated 2× so -50% translate loops seamlessly.
- Link hovers: `#b57ce8` → `#d3aef5`; nav items brighten from `#a49dbb` to `#ece9f1`.
- Post cards/titles link to posts (currently to Substack); SUBSCRIBE buttons → Substack subscribe page.
- News wire items link out to the source article.
- Responsive: design is desktop-only so far. For mobile, collapse nav to a menu, stack the duty-log grid and news columns, scale H1 down (~44–52px).

## State Management
- None client-side beyond the marquee. News Wire needs periodic RSS ingestion (build-time or hourly server fetch). Blog posts should come from the site's content source (markdown/CMS), each with: log number, title, date (+ optional "HRS" time for the patrol-log flavor), excerpt, pinned flag.

## Design Tokens
Colors:
- Page bg (ink): `#0e0d11` · Card bg: `#17161c` · Alt panel: `#121116`
- Text: `#ece9f1` · Muted: `#a49dbb`
- Purple accent (buttons/borders): `#9333ea` · Deep purple (ticker/gradient): `#6b21a8` · Light purple (links/kickers): `#b57ce8` · Lighter hover: `#d3aef5` · Pale ticker text: `#f3e8ff`
- Hairlines: `rgba(255,255,255,.08–.09)`

Typography (all Google Fonts):
- **Quantico 700** — display/headings (H1 88px/0.98, H2 26px, wordmark 20px), letter-spacing .01–.06em, always uppercase
- **Barlow Condensed 500–700** — post titles (30px, 20px), nav/buttons/labels (12–15px, letter-spacing .14–.18em, uppercase)
- **Barlow 400–600** — body copy (14–19px, line-height 1.55–1.65)
- **IBM Plex Mono 400–600** — all "log" metadata, timestamps, ticker, footer (11–13px, letter-spacing .08–.22em)

Spacing: 48px horizontal page padding; 56px section padding; 24px card grid gap; radius 3–8px (small chips 3px, cards 6px, logo 8px).

## Assets
- `logo.webp` — Mike Thunder purple sasquatch logo (user-supplied). Used at 52×52 in header and as large hero watermark.

## Files
- `Home.html` — **approved homepage design** (open in a browser; design markup is inside `<x-dc>`, all styles inline)
- `Homepage Explorations.html` — 3 explored directions; 1a was chosen. 1b (incident-report hero, "NOTHING TO REPORT" stamp, case-file rows) and 1c (dispatch feed + news sidebar) are good references for interior pages later.
- `logo.webp` — brand logo
- `screenshots/home.png` — rendered approved homepage
- `screenshots/explorations.png` — rendered exploration options (1a/1b/1c)

## Not Yet Designed (planned pages)
Duty Log archive, News Wire page, Links & recommendations, About Mike Thunder, Contact, merch placeholder. Follow the same tokens/type system; 1b/1c explorations hint at directions for these.
