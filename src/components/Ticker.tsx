import { SITE } from '../lib/site';
import s from './Ticker.module.css';

/*
 * The scrolling status bar. Segments come from SITE.tickerSegments; each is
 * followed by a ◆ separator and the whole run is emitted twice, which is what
 * makes the -50% translate loop without a visible seam.
 */
export default function Ticker() {
  if (!SITE.showTicker) return null;

  const segments = [0, 1].flatMap((pass) =>
    SITE.tickerSegments.flatMap((seg, i) => [
      { key: `${pass}-${i}-seg`, text: seg },
      { key: `${pass}-${i}-sep`, text: '◆' },
    ])
  );

  return (
    <div className={s.ticker} aria-hidden="true">
      <div className={s.track}>
        {segments.map((seg) => (
          <span key={seg.key}>{seg.text}</span>
        ))}
      </div>
    </div>
  );
}
