import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import s from './scaffold.module.css';

interface StubPageProps {
  /** Route path, for canonical + og:url. */
  path: string;
  /** Meta description for this section. */
  description: string;
  /** Mono kicker, e.g. "SECTION 02 · DUTY LOG" */
  kicker: string;
  title: string;
  blurb: string;
  note: string;
}

/*
 * Generic interior-page placeholder. Only the homepage has been designed
 * (handoff README, "Not Yet Designed"), so each remaining section renders this
 * until its own design lands — the route, shell, and navigation all work now.
 */
export default function StubPage({ kicker, title, blurb, note, path, description }: StubPageProps) {
  return (
    <div className={s.page}>
      {/* Placeholders are kept out of the index until they have real content —
          thin pages dilute the sections that don't. */}
      <Seo title={title} description={description} path={path} noindex />
      <div className={s.kicker}>{kicker}</div>
      <h1 className={s.title}>{title}</h1>
      <p className={s.blurb}>{blurb}</p>
      <hr className={s.rule} />
      <p className={s.note}>{note}</p>
      <Link to="/" className={s.action}>
        ← BACK TO THE GUARD SHACK
      </Link>
    </div>
  );
}
