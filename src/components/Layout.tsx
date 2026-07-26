import { Outlet, ScrollRestoration } from 'react-router-dom';
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
    </>
  );
}
