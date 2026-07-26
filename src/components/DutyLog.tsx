import { Link } from 'react-router-dom';
import { latestPosts, logNumber, type Post } from '../lib/posts';
import { logDate } from '../lib/time';
import head from './section.module.css';
import s from './DutyLog.module.css';

/*
 * Duty Log — latest entries. The newest post takes the featured card; the next
 * two stack beside it. Posts link out to Substack until they move in-house
 * (see lib/posts.ts).
 */
export default function DutyLog() {
  const [featured, ...rest] = latestPosts(3);
  if (!featured) return null;

  return (
    <section className={s.section}>
      <div className={head.head}>
        <h2 className={head.heading}>DUTY LOG — LATEST ENTRIES</h2>
        <Link to="/duty-log" className={head.action}>
          FULL ARCHIVE →
        </Link>
      </div>

      <div className={s.grid}>
        <article className={`${s.card} ${s.featured}`}>
          <div className={s.meta}>
            <span className={s.chip}>{logNumber(featured)}</span>
            <span className={s.stamp}>{stamp(featured)}</span>
          </div>
          <h3 className={s.featuredTitle}>
            <a href={featured.url}>{featured.title}</a>
          </h3>
          <p className={s.excerpt}>{featured.excerpt}</p>
          <a href={featured.url} className={s.continue}>
            CONTINUE READING →
          </a>
        </article>

        <div className={s.stack}>
          {rest.map((post) => (
            <article className={`${s.card} ${s.small}`} key={post.slug}>
              <div className={s.smallMeta}>
                <span className={s.logNo}>{logNumber(post)}</span>
                <span>{logDate(post.date)}</span>
                {post.pinned && <span className={s.pinned}>PINNED</span>}
              </div>
              <h3 className={s.smallTitle}>
                <a href={post.url}>{post.title}</a>
              </h3>
              <p className={s.smallExcerpt}>{post.excerpt}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/** "27 JUN · 02:14 HRS" — the featured card carries the patrol time too. */
function stamp(post: Post): string {
  return post.time ? `${logDate(post.date)} · ${post.time}` : logDate(post.date);
}
