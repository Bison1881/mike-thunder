/*
 * Deterministic, timezone-stable formatting for build-time content. Pages are
 * prerendered at build (Node) and hydrated in the browser (user's TZ); a
 * locale/TZ-dependent format would differ between the two and trigger a
 * hydration mismatch. Formatting from the ISO string via UTC getters yields
 * identical output in both places.
 */

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

/** "27 JUN" — the duty-log date stamp. */
export function logDate(iso: string | null | undefined): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`;
}

/**
 * "2H AGO" — news-wire freshness, measured against when the wire was
 * generated rather than "now". Anchoring to the build timestamp keeps the
 * label identical on the server and on hydration (and it is what the label
 * honestly describes: the age of the item at fetch time).
 */
export function agoLabel(publishedAt: string, generatedAt: string | null): string {
  const then = new Date(publishedAt).getTime();
  const now = generatedAt ? new Date(generatedAt).getTime() : NaN;
  if (Number.isNaN(then) || Number.isNaN(now)) return '';

  const minutes = Math.max(0, Math.round((now - then) / 60_000));
  if (minutes < 60) return `${minutes}M AGO`;

  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}H AGO`;

  return `${Math.floor(hours / 24)}D AGO`;
}
