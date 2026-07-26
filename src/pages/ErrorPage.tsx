import { useEffect, useState } from 'react';
import { Link, useRouteError } from 'react-router-dom';
import s from './scaffold.module.css';
import e from './ErrorPage.module.css';

/*
 * Route error boundary. Without one, react-router shows its unstyled default
 * ("Unexpected Application Error!") with a raw stack trace — which reads as a
 * broken site rather than a handled problem.
 *
 * It also auto-recovers from the most likely cause: version skew. Every
 * client-side navigation fetches loader data from a URL containing the build
 * hash (static-loader-data/<route>.<hash>.json). Deploying replaces those files,
 * so a tab that was open across a deploy requests a hash that no longer exists,
 * gets Vercel's 404 HTML back, and blows up parsing "<!DOCTYPE" as JSON. This
 * site redeploys every 3 hours for the news wire, so real visitors will hit it.
 * A reload fixes it, so we do that for them — once.
 */

/** The version-skew signature: HTML (or nothing parseable) where JSON was due. */
function isStaleBuildError(error: unknown): boolean {
  if (error instanceof SyntaxError) {
    const m = error.message;
    return (
      m.includes('is not valid JSON') ||
      m.includes('Unexpected token') ||
      m.includes('JSON.parse') ||
      // Safari and Firefox word this differently
      m.includes('unexpected character')
    );
  }
  // A loader/manifest fetch that 404s can also surface as a Response.
  if (error instanceof Response) return error.status === 404;
  return false;
}

function describe(error: unknown): string {
  if (error instanceof Response) return `${error.status} ${error.statusText} — ${error.url}`;
  if (error instanceof Error) return error.stack || `${error.name}: ${error.message}`;
  if (typeof error === 'string') return error;
  try {
    return JSON.stringify(error, null, 2);
  } catch {
    return String(error);
  }
}

export default function ErrorPage() {
  const error = useRouteError();
  const [recovering, setRecovering] = useState(false);

  useEffect(() => {
    if (!isStaleBuildError(error)) return;

    /*
     * One attempt per path per session. A blanket reload-on-error would spin
     * forever if the failure is persistent rather than stale assets, so if the
     * marker is already set we fall through and show the UI instead.
     */
    const key = `tpl:stale-reload:${window.location.pathname}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, String(Date.now()));
    } catch {
      // Storage unavailable (private mode, blocked). Don't risk a reload loop.
      return;
    }

    setRecovering(true);
    window.location.reload();
  }, [error]);

  if (recovering) {
    return (
      <div className={s.page}>
        <div className={s.kicker}>STATUS: RELOADING</div>
        <h1 className={s.title}>ONE MOMENT</h1>
        <p className={s.blurb}>The site updated while you were reading it. Fetching the new copy.</p>
      </div>
    );
  }

  return (
    <div className={s.page}>
      <div className={s.kicker}>STATUS: UNSCHEDULED INCIDENT</div>
      <h1 className={s.title}>SOMETHING TRIPPED THE ALARM</h1>
      <p className={s.blurb}>
        This page didn't load properly. Most often that means the site was updated while you had it
        open, and a reload clears it.
      </p>
      <hr className={s.rule} />
      <div className={e.actions}>
        <button type="button" className={e.reload} onClick={() => window.location.reload()}>
          RELOAD THE PAGE
        </button>
        <Link to="/" className={s.action}>
          ← BACK TO THE GUARD SHACK
        </Link>
      </div>
      <details className={e.details}>
        <summary className={e.summary}>TECHNICAL DETAIL</summary>
        <pre className={e.trace}>{describe(error)}</pre>
      </details>
    </div>
  );
}
