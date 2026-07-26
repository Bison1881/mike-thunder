/*
 * Contact form handler — the site's only server-side code.
 *
 * Takes a JSON POST from the contact page and relays it by email via Resend.
 * Mike's address lives in an environment variable and is never sent to the
 * browser, which is the whole point of doing this server-side rather than with
 * a mailto: link.
 *
 * Required environment variables (Vercel → Settings → Environment Variables):
 *   RESEND_API_KEY     — from resend.com, starts "re_"
 *   CONTACT_TO_EMAIL   — where messages land (never exposed to the client)
 *   CONTACT_FROM_EMAIL — a sender on a domain verified in Resend, e.g.
 *                        "Front Desk <desk@yourdomain.com>". Resend's shared
 *                        onboarding@resend.dev also works for testing.
 *
 * Until those are set the endpoint returns 503 with code "not_configured", and
 * the form surfaces that rather than pretending the message went through.
 */

const MAX = { name: 80, email: 200, subject: 120, message: 5000 };
const MIN_MESSAGE = 10;
/* Bots submit instantly; a human takes seconds to type. */
const MIN_ELAPSED_MS = 2500;

interface Payload {
  name?: unknown;
  email?: unknown;
  subject?: unknown;
  message?: unknown;
  /** Honeypot — hidden in the UI, so anything here is a bot. */
  company?: unknown;
  /** Milliseconds between form mount and submit. */
  elapsedMs?: unknown;
}

const json = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });

/** Collapse whitespace and strip CR/LF so nothing can smuggle in email headers. */
const clean = (v: unknown, max: number): string =>
  typeof v === 'string' ? v.replace(/[\r\n]+/g, ' ').trim().slice(0, max) : '';

/** Message body keeps its line breaks; only carriage returns are normalised. */
const cleanBody = (v: unknown, max: number): string =>
  typeof v === 'string' ? v.replace(/\r\n/g, '\n').trim().slice(0, max) : '';

const looksLikeEmail = (v: string) => /^[^\s@]+@[^\s@.]+\.[^\s@]+$/.test(v);

export async function POST(request: Request): Promise<Response> {
  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return json(400, { error: 'Malformed request.', code: 'bad_json' });
  }

  // ── Spam traps ─────────────────────────────────────────────────────────
  // Both answer 200 so a bot sees success and doesn't retry with variations.
  const honeypot = clean(body.company, 100);
  const elapsed = typeof body.elapsedMs === 'number' ? body.elapsedMs : Number.MAX_SAFE_INTEGER;
  if (honeypot || elapsed < MIN_ELAPSED_MS) {
    return json(200, { ok: true, dropped: true });
  }

  // ── Validation ─────────────────────────────────────────────────────────
  const name = clean(body.name, MAX.name);
  const email = clean(body.email, MAX.email);
  const subject = clean(body.subject, MAX.subject) || 'No subject';
  const message = cleanBody(body.message, MAX.message);

  const problems: string[] = [];
  if (!name) problems.push('name');
  if (!looksLikeEmail(email)) problems.push('email');
  if (message.length < MIN_MESSAGE) problems.push('message');
  if (problems.length) {
    return json(422, {
      error: 'Please check the highlighted fields.',
      code: 'invalid',
      fields: problems,
    });
  }

  // ── Config ─────────────────────────────────────────────────────────────
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !to || !from) {
    // Deliberately explicit: a silent success here would lose real messages.
    console.error('[contact] missing env:', {
      RESEND_API_KEY: Boolean(apiKey),
      CONTACT_TO_EMAIL: Boolean(to),
      CONTACT_FROM_EMAIL: Boolean(from),
    });
    return json(503, {
      error: 'The front desk is not staffed yet — the contact form has no mailbox configured.',
      code: 'not_configured',
    });
  }

  // ── Relay ──────────────────────────────────────────────────────────────
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${apiKey}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        // Replying in the mail client goes straight back to the sender.
        reply_to: email,
        subject: `[Thin Purple Line] ${subject}`,
        text: [
          `From:    ${name} <${email}>`,
          `Subject: ${subject}`,
          '',
          message,
          '',
          '—',
          'Filed via the contact form at mike-thunder.vercel.app/contact',
        ].join('\n'),
      }),
      signal: AbortSignal.timeout(10_000),
    });

    if (!res.ok) {
      // Log the provider's reason for us; tell the visitor something useful.
      console.error('[contact] resend failed', res.status, await res.text().catch(() => ''));
      return json(502, {
        error: 'The message could not be delivered. Try again shortly.',
        code: 'send_failed',
      });
    }
  } catch (err) {
    console.error('[contact] resend threw', err);
    return json(502, {
      error: 'The message could not be delivered. Try again shortly.',
      code: 'send_failed',
    });
  }

  return json(200, { ok: true });
}
