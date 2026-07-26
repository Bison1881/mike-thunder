import { Outlet, ScrollRestoration } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import Ticker from './Ticker';
import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';

/*
 * The shared shell every page inherits: status ticker → header → page content →
 * footer. The page itself is full-width (the design has no centred column);
 * horizontal rhythm comes from the 48px --gutter each block applies.
 */
export default function Layout() {
  return (
    <>
      <Ticker />
      <SiteHeader />
      <main>
        <Outlet />
      </main>
      <SiteFooter />
      <ScrollRestoration />
      {/*
       * Vercel Web Analytics. Cookieless and does not collect personal data, so
       * it needs no consent banner. Lives in the Layout so it mounts once and
       * follows client-side route changes rather than only the first load.
       */}
      <Analytics />
    </>
  );
}
