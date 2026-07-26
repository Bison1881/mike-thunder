import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import s from './scaffold.module.css';

export default function NotFound() {
  return (
    <div className={s.page}>
      <Seo
        title="Nothing To Report Here"
        description="That page isn't on the roster."
        path="/404"
        noindex
      />
      <div className={s.kicker}>STATUS: PAGE NOT ON THE ROSTER</div>
      <h1 className={s.title}>NOTHING TO REPORT HERE</h1>
      <p className={s.blurb}>
        Checked the door twice. Whatever you were looking for isn't behind it.
      </p>
      <hr className={s.rule} />
      <Link to="/" className={s.action}>
        ← BACK TO THE GUARD SHACK
      </Link>
    </div>
  );
}
