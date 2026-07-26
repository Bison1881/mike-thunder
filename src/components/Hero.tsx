import { Link } from 'react-router-dom';
import { SITE } from '../lib/site';
import s from './Hero.module.css';

/** The front-page hero: kicker, display headline, deck, two CTAs. */
export default function Hero() {
  return (
    <section className={s.hero}>
      {SITE.showWatermark && (
        <img src="/logo.webp" alt="" className={s.watermark} aria-hidden="true" />
      )}
      <div className={s.inner}>
        <div className={s.kicker}>EST. 2026 · MEMOIRS OF THE GREATEST SECURITY GUARD, EVER</div>
        <h1 className={s.title}>TALES FROM BEHIND THE THIN PURPLE LINE</h1>
        <p className={s.sub}>
          Real security. Real incidents. Really long stretches where absolutely nothing happens —
          reported with total professionalism.
        </p>
        <div className={s.ctas}>
          <Link to="/duty-log" className={s.btnPrimary}>
            READ THE LOG
          </Link>
          <a href={SITE.subscribe} className={s.btnGhost}>
            SUBSCRIBE ON SUBSTACK
          </a>
        </div>
      </div>
    </section>
  );
}
