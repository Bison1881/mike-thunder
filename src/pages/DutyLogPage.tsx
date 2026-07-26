import { latestPosts, logNumber, syncedAt } from '../lib/posts';
import { logDate, logStamp } from '../lib/time';
import { SITE } from '../lib/site';
import r from '../components/report.module.css';
import s from './DutyLogPage.module.css';
import Seo from '../components/Seo';

/*
 * The full Duty Log archive — every entry, newest first.
 *
 * Interior pages aren't in the approved handoff, so the treatment is borrowed
 * from exploration 1b (which the handoff names as the reference for later
 * pages): the TPL-01 daily-activity-report card, its rotated "NOTHING TO
 * REPORT" stamp, and its case-file rows.
 */

/*
 * Report-card flavour. "M. THUNDER / 029 / THE PURPLE LINE" is copy from
 * exploration 1b, not real data — it's the duty-paperwork conceit the design
 * runs on. Entry count and filing date are live.
 */
const OFFICER = 'M. THUNDER';
const BADGE = '7363ND';
const SECTOR = 'THE PURPLE LINE';

export default function DutyLogPage() {
  const posts = latestPosts();
  const newest = posts[0];

  return (
    <div className={s.page}>
      <Seo
        title="The Duty Log"
        description="Every entry filed from behind the thin purple line, newest first — incidents, non-incidents, and the long quiet stretches in between."
        path="/duty-log"
      />
      <header className={s.head}>
        <div className={s.kicker}>SECTION · DUTY LOG</div>
        <h1 className={s.title}>THE DUTY LOG</h1>
        <p className={s.deck}>
          Every entry filed from behind the thin purple line, newest first. Incidents,
          non-incidents, and the long quiet stretches in between.
        </p>
      </header>

      <div className={r.wrap}>
        <div className={r.card}>
          <div className={r.bar}>
            <span className={r.form}>DAILY ACTIVITY REPORT — FORM TPL-01</span>
            <span className={r.page}>PAGE 1 OF 1</span>
          </div>
          <div className={r.body}>
            <div className={r.fields}>
              <div className={r.field}>
                <span className={r.fieldLabel}>LEGEND ON DUTY</span>
                <span className={r.fieldValue}>{LEGEND}</span>
              </div>
              <div className={r.field}>
                <span className={r.fieldLabel}>BADGE NO.</span>
                <span className={r.fieldValue}>{BADGE}</span>
              </div>
              <div className={r.field}>
                <span className={r.fieldLabel}>SECTOR</span>
                <span className={r.fieldValue}>{SECTOR}</span>
              </div>
              <div className={r.field}>
                <span className={r.fieldLabel}>ENTRIES FILED</span>
                <span className={`${r.fieldValue} ${r.fieldAccent}`}>
                  {String(posts.length).padStart(3, '0')}
                </span>
              </div>
            </div>
            <div className={r.remarks}>
              <span className={r.fieldLabel}>REMARKS</span>
              <span className={r.remarksValue}>
                All quiet. Perimeter secure. Nothing further to report — see attached case files.
              </span>
            </div>
            <div className={r.stamp}>NOTHING TO REPORT</div>
          </div>
        </div>
      </div>

      <div className={s.filesHead}>
        <h2 className={s.filesTitle}>CASE FILES</h2>
        <span className={s.filesNote}>
          {newest ? `LAST ENTRY ${logDate(newest.date)}` : 'NO ENTRIES'}
          {syncedAt ? ` · SYNCED ${logStamp(syncedAt)}` : ''}
        </span>
      </div>

      <div className={s.files}>
        {posts.length === 0 && (
          <p className={s.empty}>NO ENTRIES ON FILE — RUN `npm run posts:fetch`.</p>
        )}

        {posts.map((post) => (
          <a className={s.row} key={post.slug} href={post.url}>
            <span className={s.rowLog}>{logNumber(post)}</span>
            <span className={s.rowMain}>
              <span className={s.rowTitle}>
                {post.title}
                {post.pinned && <span className={s.pinned}>PINNED</span>}
              </span>
              <span className={s.rowExcerpt}>{post.excerpt}</span>
            </span>
            <span className={s.rowFiled}>
              FILED {logDate(post.date)}
              {post.time ? ` · ${post.time}` : ''}
            </span>
            <span className={s.rowArrow} aria-hidden="true">
              →
            </span>
          </a>
        ))}
      </div>

      <div className={s.closing}>
        <span className={s.closingLabel}>END OF LOG</span>
        <p className={s.closingCopy}>
          Entries are filed on Substack as they happen. Subscribe and the next one lands in your
          inbox before it reaches this page.
        </p>
        <a className={s.closingBtn} href={SITE.subscribe}>
          SUBSCRIBE
        </a>
      </div>
    </div>
  );
}
