import { generatedAt, wire, wireItems, wireSources } from '../lib/feeds';
import { agoLabel, logStamp } from '../lib/time';
import { SITE } from '../lib/site';
import s from './NewsWirePage.module.css';
import Seo from '../components/Seo';

/*
 * The full Security News Wire — every item the build-time aggregator collected,
 * grouped by day, with the source roster alongside. The homepage shows three of
 * these; this is the rest.
 *
 * Interior pages aren't in the approved handoff, so the treatment is borrowed
 * from exploration 1c (which the handoff flags as the reference for later
 * pages): alt-panel aside, hairline rows, mono meta over a condensed headline.
 */
export default function NewsWirePage() {
  const items = wireItems();
  const sources = wireSources();

  return (
    <div className={s.page}>
      <Seo
        title="Security News Wire"
        description="Aggregated security headlines — private security, loss prevention, and the guard beat — refreshed on every build and linking out to the original reporting."
        path="/news-wire"
      />
      <header className={s.head}>
        <div className={s.kicker}>SECTION · NEWS WIRE</div>
        <h1 className={s.title}>SECURITY NEWS WIRE</h1>
        <p className={s.deck}>
          Everything crossing the wire — private security, loss prevention, and the guard beat,
          pulled from {sources.length} sources and rebuilt on every deploy. Headlines link out to
          whoever reported them.
        </p>
        <div className={s.status}>
          <span className={s.dot} aria-hidden="true" />
          {wire.length} ITEMS · {sources.length} SOURCES
          {generatedAt ? ` · SYNCED ${logStamp(generatedAt)}` : ''}
        </div>
      </header>

      <div className={s.grid}>
        <main className={s.feed}>
          {items.length === 0 && (
            <p className={s.empty}>
              WIRE EMPTY — NO ITEMS RETRIEVED AT LAST SYNC. RUN `npm run feeds:fetch`.
            </p>
          )}

          {items.map((item) => (
            <a
              className={s.item}
              key={item.link}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className={s.itemMeta}>
                {item.source} · {agoLabel(item.publishedAt, generatedAt)}
              </span>
              <span className={s.itemTitle}>{item.title}</span>
            </a>
          ))}
        </main>

        <aside className={s.aside}>
          <div>
            <div className={s.panelHead}>
              <span className={s.panelTitle}>SOURCES</span>
              <span className={s.panelNote}>LIVE · RSS</span>
            </div>
            {sources.map(({ source, count }) => (
              <div className={s.sourceRow} key={source}>
                <span>{source}</span>
                <span className={s.sourceCount}>{count}</span>
              </div>
            ))}
          </div>

          <div className={s.join}>
            <span className={s.joinTitle}>JOIN THE WATCH</span>
            <p className={s.joinCopy}>
              The wire is the day job. The stories are on Substack — new entries filed straight to
              your inbox.
            </p>
            <a className={s.joinBtn} href={SITE.subscribe}>
              SUBSCRIBE
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}
