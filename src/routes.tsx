import type { RouteRecord } from 'vite-react-ssg';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import DutyLogPage from './pages/DutyLogPage';
import NewsWirePage from './pages/NewsWirePage';
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
      { path: 'duty-log', element: <DutyLogPage /> },
      { path: 'news-wire', element: <NewsWirePage /> },
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
      // Prerendered to dist/404.html, which Vercel serves (with a real 404
      // status) for any path that matches no file. Without this the catch-all
      // below never becomes a file and unknown URLs get Vercel's stock error
      // page instead of the branded one.
      { path: '404', element: <NotFound /> },
      // Client-side catch-all: covers in-app navigation to a bad path.
      { path: '*', element: <NotFound /> },
    ],
  },
];
