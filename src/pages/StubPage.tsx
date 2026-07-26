import { Link } from 'react-router-dom';
import s from './scaffold.module.css';

interface StubPageProps {
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
export default function StubPage({ kicker, title, blurb, note }: StubPageProps) {
  return (
    <div className={s.page}>
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
