# How to Edit The Thin Purple Line

**The core idea:** there's no login or CMS. You change a file, push it to GitHub, and
Vercel rebuilds the site automatically in a minute or two. The project folder *is* the
back end.

**Live at:** https://mikethunder.com
**Project folder:** `C:\Users\Tim_W\dev\mike-thunder`
**Repo:** https://github.com/Bison1881/mike-thunder

## The two things you almost never have to touch

- **Blog posts** — these sync from your Substack feed automatically. Publish on
  Substack and the entry appears on the site at the next rebuild. You do *not* add
  posts by hand.
- **The news wire** — refreshes itself every 3 hours from the feeds. Never edited by hand.

So most days there is nothing to do here at all.

## The basic loop (every edit follows this)

- Open the project in Notepad++ (`C:\Users\Tim_W\dev\mike-thunder`)
- Make your change (see the tasks below)
- Save the file
- In PowerShell, from the project folder:
  - `git add .`
  - `git commit -m "short description of what changed"`
  - `git pull --rebase`
  - `git push`
- Wait ~1–2 minutes, then check the live site

**Easier option, no PowerShell needed:** open the file on github.com, click the pencil
icon, edit in the browser, and hit "Commit changes". Vercel deploys the same way. Good
for one-line copy tweaks.

---

## To change the scrolling ticker, wordmark, or status line

File: `src/lib/site.ts`

Everything in this file is plain text between quotes. Change the words, keep the quotes
and commas.

- `tickerSegments` — the scrolling bar at the very top. Add or remove lines from the
  list; each one becomes a segment separated by a ◆.
- `status` — the small "STATUS: NOTHING TO REPORT" under the logo.
- `copyright` — the footer line.
- `showTicker: true` → set to `false` to hide the scrolling bar entirely.
- `showWatermark: true` → set to `false` to remove the big faded logo behind the hero.

## To turn the LINKS or MERCH sections back on

File: `src/lib/site.ts`

- `showLinks: false` → change to `true` and LINKS reappears in the top nav.
- `showMerch: false` → change to `true` and MERCH (SOON) reappears in the footer.

The pages themselves already exist either way — this only controls whether the site
links to them. Change their wording in `src/routes.tsx` (search for `SECTION · LINKS`).

## To change a post's card copy, pin it, or add a patrol time

File: `src/lib/postMeta.ts`

Titles, dates, and links come from Substack automatically. This file only holds the
things Substack can't tell us, listed by the post's Substack slug (the last bit of its
URL). For each post you can set:

- `excerpt` — the blurb shown on the card. Overrides Substack's auto-summary; usually
  worth writing.
- `pinned: true` — shows the PINNED chip.
- `time: '02:14 HRS'` — the patrol stamp on the featured card.

A new post with no entry here still appears correctly — it just uses Substack's own
summary until you write a better one.

## To change the About page words

File: `src/pages/AboutPage.tsx`

The paragraphs are between `<p>` and `</p>`. Edit the words, leave the tags alone. The
personnel-file box lower down (badge number, years of service, etc.) is in the same file.

## To change the news wire sources

File: `scripts/feeds.config.mjs`

Each source is one line in the list. To add one, copy an existing line and change the
`name` and `url`. If a site has no RSS feed, leave `url: ''` and put a search phrase in
`query` — it'll pull from Google News instead.

Test before pushing: `npm run feeds:fetch` in PowerShell. It prints each source and how
many stories it found.

## To change where contact-form messages go

Not in the files — this one's in Vercel:

Vercel → mike-thunder → Settings → Environment Variables → `CONTACT_TO_EMAIL`

Change it, then redeploy (Deployments → latest → ⋯ → Redeploy). Your address is stored
there and never appears on the website.

---

## Things to leave alone unless you mean it

- `src/styles/tokens.css` — the colours and fonts for the whole site. Changing one value
  changes every page. That's the point, but it's not a place to experiment casually.
- `src/components/` — the page furniture (header, footer, ticker, cards).
- `api/contact.ts` — the contact form's server code.
- `src/data/feeds.json` — generated automatically, overwritten on every build.

## If something breaks

- **The site shows "SOMETHING TRIPPED THE ALARM"** — usually just means the site updated
  while you had it open. Reload. It normally fixes itself.
- **A change didn't appear** — check Vercel → Deployments. A red entry means the build
  failed; click it and read the log. The previous version stays live, so a failed build
  never takes the site down.
- **Check your work before pushing** — `npm run build` in PowerShell. If it completes
  without errors, the deploy will work too.
