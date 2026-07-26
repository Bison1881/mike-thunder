import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SITE } from '../lib/site';
import s from './SiteHeader.module.css';

/*
 * Primary navigation. Six sections plus the SUBSCRIBE button, which always
 * points out to Substack. Below 1080px the nav collapses behind a MENU button
 * (the button is display:none at desktop, so the approved layout is unchanged).
 */
const SECTIONS = [
  { label: 'HOME', to: '/' },
  { label: 'DUTY LOG', to: '/duty-log' },
  { label: 'NEWS WIRE', to: '/news-wire' },
  { label: 'LINKS', to: '/links' },
  { label: 'ABOUT', to: '/about' },
  { label: 'CONTACT', to: '/contact' },
];

export default function SiteHeader() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <header className={s.header}>
      <Link to="/" className={s.brand} onClick={() => setOpen(false)}>
        <img src="/logo.webp" alt="Mike Thunder" className={s.logo} width={52} height={52} />
        <div>
          <div className={s.wordmark}>{SITE.wordmark}</div>
          <div className={s.status}>{SITE.status}</div>
        </div>
      </Link>

      <button
        type="button"
        className={s.menuButton}
        aria-expanded={open}
        aria-controls="site-nav"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? 'CLOSE' : 'MENU'}
      </button>

      <nav
        id="site-nav"
        className={open ? `${s.nav} ${s.navOpen}` : s.nav}
        aria-label="Sections"
      >
        {SECTIONS.map((item) => {
          const active = pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={active ? s.linkActive : s.link}
              aria-current={active ? 'page' : undefined}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          );
        })}
        <a className={s.subscribe} href={SITE.subscribe}>
          SUBSCRIBE
        </a>
      </nav>
    </header>
  );
}
