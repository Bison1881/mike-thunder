import { Link } from 'react-router-dom';
import { SITE } from '../lib/site';
import s from './SiteFooter.module.css';

/** End of shift. Copyright line left, outbound + utility links right. */
export default function SiteFooter() {
  return (
    <footer className={s.footer}>
      <span className={s.copy}>{SITE.copyright}</span>
      <div className={s.links}>
        <a href={SITE.substack}>SUBSTACK</a>
        {/* Hidden until there's merch — see SITE.showMerch in lib/site.ts. */}
        {SITE.showMerch && <Link to="/merch">MERCH (SOON)</Link>}
        <Link to="/contact">CONTACT</Link>
      </div>
    </footer>
  );
}
