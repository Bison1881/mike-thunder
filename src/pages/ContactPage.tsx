import { useEffect, useRef, useState } from 'react';
import { SITE } from '../lib/site';
import r from '../components/report.module.css';
import s from './ContactPage.module.css';
import Seo from '../components/Seo';

/*
 * Contact — an incident-report form (TPL-03) posting to /api/contact, which
 * relays by email. Mike's address stays server-side in an env var and never
 * reaches the browser.
 *
 * Interior page, so the card is the shared 1b form card; the inputs are
 * underlines rather than boxes so they read as fields on paperwork.
 */

type Status = 'idle' | 'sending' | 'sent' | 'error';

const REASONS = [
  'Story tips and “sincidents” worth reporting.',
  'Press, podcasts, and speaking requests.',
  'Corrections — if a detail in the log is wrong, say so.',
  'Anything else that needs the front desk.',
];

export default function ContactPage() {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const [badFields, setBadFields] = useState<string[]>([]);
  /*
   * Stamped on mount rather than during render — a timestamp baked into the
   * prerendered markup would differ from the hydrated value. Mount (not first
   * focus) on purpose: a password manager or autofill can populate the form
   * without ever firing a focus event, and if this were still null we'd report
   * an elapsed time of zero, which the server reads as a bot and silently
   * discards. Losing a real message that way is worse than any spam it stops.
   */
  const startedAt = useRef<number | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === 'sending') return;

    const data = new FormData(event.currentTarget);
    setStatus('sending');
    setError('');
    setBadFields([]);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          email: data.get('email'),
          subject: data.get('subject'),
          message: data.get('message'),
          company: data.get('company'),
          // Omitted rather than zeroed when unknown; the server treats a missing
          // value as "can't tell" and lets the message through.
          elapsedMs: startedAt.current ? Date.now() - startedAt.current : undefined,
        }),
      });

      const payload = (await res.json().catch(() => ({}))) as {
        error?: string;
        fields?: string[];
      };

      if (!res.ok) {
        setBadFields(payload.fields ?? []);
        setError(payload.error || 'Something went wrong. Try again shortly.');
        setStatus('error');
        return;
      }

      formRef.current?.reset();
      startedAt.current = null;
      setStatus('sent');
    } catch {
      setError('Could not reach the front desk — check your connection and try again.');
      setStatus('error');
    }
  }

  const invalid = (field: string) =>
    badFields.includes(field) ? `${s.input} ${s.invalid}` : s.input;

  return (
    <div className={s.page}>
      <Seo
        title="Contact the Front Desk"
        description="File a report and it reaches Mike directly — story tips, press, podcasts, corrections, and anything else that needs the front desk."
        path="/contact"
      />
      <header className={s.head}>
        <div className={s.kicker}>SECTION · CONTACT</div>
        <h1 className={s.title}>CONTACT THE FRONT DESK</h1>
        <p className={s.deck}>
          File a report and it reaches Mike directly. Response times vary by shift — the guard shack
          is not always staffed.
        </p>
      </header>

      <div className={s.grid}>
        <div className={r.wrap}>
          <div className={r.card}>
            <div className={r.bar}>
              <span className={r.form}>INCIDENT REPORT — FORM TPL-03</span>
              <span className={r.page}>FOR OFFICIAL USE</span>
            </div>
            <div className={r.body}>
              {status === 'sent' ? (
                <div className={s.filed}>
                  <div className={s.filedStamp}>REPORT FILED</div>
                  <p className={s.filedCopy}>
                    Received. It's in the log and Mike will read it. If it needs an answer, you'll
                    get one — eventually, and with total professionalism.
                  </p>
                  <button type="button" className={s.again} onClick={() => setStatus('idle')}>
                    FILE ANOTHER →
                  </button>
                </div>
              ) : (
                <form ref={formRef} onSubmit={handleSubmit} noValidate>
                  <div className={s.row}>
                    <label className={s.field}>
                      <span className={r.fieldLabel}>YOUR NAME</span>
                      <input
                        className={invalid('name')}
                        name="name"
                        type="text"
                        maxLength={80}
                        autoComplete="name"
                        required
                      />
                    </label>
                    <label className={s.field}>
                      <span className={r.fieldLabel}>EMAIL</span>
                      <input
                        className={invalid('email')}
                        name="email"
                        type="email"
                        maxLength={200}
                        autoComplete="email"
                        required
                      />
                    </label>
                  </div>

                  <div className={`${s.field} ${s.spacer}`}>
                    <span className={r.fieldLabel}>SUBJECT</span>
                    <input
                      className={s.input}
                      name="subject"
                      type="text"
                      maxLength={120}
                      placeholder="Optional"
                    />
                  </div>

                  <div className={`${s.field} ${s.spacer}`}>
                    <span className={r.fieldLabel}>NATURE OF THE REPORT</span>
                    <textarea
                      className={
                        badFields.includes('message') ? `${s.textarea} ${s.invalid}` : s.textarea
                      }
                      name="message"
                      maxLength={5000}
                      required
                    />
                  </div>

                  {/* Honeypot: hidden from people, irresistible to bots. */}
                  <div className={s.honeypot} aria-hidden="true">
                    <label>
                      Company
                      <input name="company" type="text" tabIndex={-1} autoComplete="off" />
                    </label>
                  </div>

                  <div className={s.actions}>
                    <button className={s.submit} type="submit" disabled={status === 'sending'}>
                      {status === 'sending' ? 'FILING…' : 'FILE REPORT'}
                    </button>
                    {status === 'error' ? (
                      <span className={s.error} role="alert">
                        {error}
                      </span>
                    ) : (
                      <span className={s.note}>NO ATTACHMENTS · PLAIN TEXT ONLY</span>
                    )}
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        <aside className={s.aside}>
          <div>
            <div className={s.asideTitle}>WHAT TO FILE</div>
            <div className={s.list}>
              {REASONS.map((reason) => (
                <span className={s.listItem} key={reason}>
                  {reason}
                </span>
              ))}
            </div>
          </div>
          <div>
            <div className={s.asideTitle}>ALREADY SUBSCRIBED?</div>
            <p className={s.asideCopy}>
              Replying to any entry in your inbox reaches Mike just as well as this form.
            </p>
          </div>
          <a className={s.asideLink} href={SITE.substack}>
            READ ON SUBSTACK →
          </a>
        </aside>
      </div>
    </div>
  );
}
