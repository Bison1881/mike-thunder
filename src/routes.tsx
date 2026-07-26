import type { RouteRecord } from 'vite-react-ssg';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import StubPage from './pages/StubPage';
import NotFound from './pages/NotFound';

/*
 * Route table. Every nav destination gets its own URL (and, under
 * vite-react-ssg, its own prerendered static HTML). Only the homepage is
 * designed so far — the rest render the interior scaffold so the navigation is
 * whole and crawlable while their designs are pending.
 */
export const routes: RouteRecord[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: 'duty-log',
        element: (
          <StubPage
            kicker="SECTION · DUTY LOG"
            title="THE FULL DUTY LOG"
            blurb="Every entry, newest first — the complete archive of incidents, non-incidents, and long quiet stretches."
            note="ARCHIVE PAGE NOT YET DESIGNED · ENTRIES CURRENTLY LIVE ON SUBSTACK"
          />
        ),
      },
      {
        path: 'news-wire',
        element: (
          <StubPage
            kicker="SECTION · NEWS WIRE"
            title="SECURITY NEWS WIRE"
            blurb="The full feed of security headlines, aggregated from the wire and refreshed on every build."
            note="WIRE PAGE NOT YET DESIGNED · CONFIGURE FEEDS IN scripts/feeds.config.mjs"
          />
        ),
      },
      {
        path: 'links',
        element: (
          <StubPage
            kicker="SECTION · LINKS"
            title="LINKS & RECOMMENDATIONS"
            blurb="Gear, reading, and the people worth following — vetted from the guard shack."
            note="PAGE NOT YET DESIGNED"
          />
        ),
      },
      {
        path: 'about',
        element: (
          <StubPage
            kicker="SECTION · ABOUT"
            title="ABOUT MIKE THUNDER"
            blurb="Credentials, career, and the philosophy behind reporting nothing with total professionalism."
            note="PAGE NOT YET DESIGNED"
          />
        ),
      },
      {
        path: 'contact',
        element: (
          <StubPage
            kicker="SECTION · CONTACT"
            title="CONTACT THE FRONT DESK"
            blurb="Tips, bookings, and incident reports. Response times vary by shift."
            note="PAGE NOT YET DESIGNED · NO FORM WIRED UP YET"
          />
        ),
      },
      {
        path: 'merch',
        element: (
          <StubPage
            kicker="SECTION · MERCH"
            title="MERCH — COMING SOON"
            blurb="Shirts, patches, and at least one hat that says NOTHING TO REPORT."
            note="STORE NOT OPEN · PLACEHOLDER PAGE"
          />
        ),
      },
      { path: '*', element: <NotFound /> },
    ],
  },
];
