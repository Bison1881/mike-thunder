import type { RouteRecord } from 'vite-react-ssg';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import DutyLogPage from './pages/DutyLogPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import NewsWirePage from './pages/NewsWirePage';
import StubPage from './pages/StubPage';
import NotFound from './pages/NotFound';
import ErrorPage from './pages/ErrorPage';

/*
 * Route table. Every nav destination gets its own URL (and, under
 * vite-react-ssg, its own prerendered static HTML). Only the homepage is
 * designed so far — the rest render the interior scaffold so the navigation is
 * whole and crawlable while their designs are pending.
 */

const pages: RouteRecord[] = [
  { index: true, element: <HomePage /> },
  { path: 'duty-log', element: <DutyLogPage /> },
  { path: 'news-wire', element: <NewsWirePage /> },
  {
    path: 'links',
    element: (
      <StubPage
        path="/links"
        description="Gear, reading, and the people worth following — vetted from the guard shack."
        kicker="SECTION · LINKS"
        title="LINKS & RECOMMENDATIONS"
        blurb="Gear, reading, and the people worth following — vetted from the guard shack."
        note="PAGE NOT YET DESIGNED"
      />
    ),
  },
  { path: 'about', element: <AboutPage /> },
  { path: 'contact', element: <ContactPage /> },
  {
    path: 'merch',
    element: (
      <StubPage
        path="/merch"
        description="Shirts, patches, and at least one hat that says NOTHING TO REPORT. Not open yet."
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
];

/*
 * The error boundary is attached to every child rather than to the layout route.
 * react-router renders the *nearest* errorElement in place of the failing
 * route's element — put it only on the parent and an error takes the ticker,
 * header, and footer down with it. Per-child keeps the shell intact and renders
 * the error where page content goes, so the site still looks like the site.
 *
 * The parent keeps a copy as a last resort, for the case where Layout itself
 * throws and there is no child boundary to catch it.
 */
export const routes: RouteRecord[] = [
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: pages.map((page) => ({ ...page, errorElement: <ErrorPage /> })),
  },
];
