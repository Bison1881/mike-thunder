import { generatedAt, wireItems } from '../lib/feeds';
import { agoLabel } from '../lib/time';
import head from './section.module.css';
import s from './NewsWire.module.css';

/*
 * Security News Wire. Reads the build-time aggregate (src/data/feeds.json) — no
 * runtime fetch. Until feed URLs are configured in scripts/feeds.config.mjs the
 * block renders the design's three placeholder slots, so the page never shows a
 * hole.
 */
const PLACEHOLDERS = [
  { meta: 'RSS SOURCE · 2H AGO', title: 'Headline from your first security feed lands here' },
  { meta: 'RSS SOURCE · 5H AGO', title: 'Second wire headline, pulled automatically' },
  { meta: 'RSS SOURCE · 9H AGO', title: "Third headline with Mike's one-line take beneath" },
];

export default function NewsWire() {
  const items = wireItems(3);

  return (
    <section className={s.section}>
      <div className={head.head}>
        <h2 className={head.heading}>SECURITY NEWS WIRE</h2>
        <span className={head.note}>VIA RSS · UPDATED HOURLY</span>
      </div>

      <div className={s.grid}>
        {items.length
          ? items.map((item) => (
              <a
                className={`${s.item} ${s.link}`}
                href={item.link}
                key={item.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className={s.itemMeta}>
                  {item.source} · {agoLabel(item.publishedAt, generatedAt)}
                </span>
                <span className={s.itemTitle}>{item.title}</span>
              </a>
            ))
          : PLACEHOLDERS.map((p) => (
              <div className={s.item} key={p.meta}>
                <span className={s.itemMeta}>{p.meta}</span>
                <span className={s.itemTitle}>{p.title}</span>
              </div>
            ))}
      </div>
    </section>
  );
}
