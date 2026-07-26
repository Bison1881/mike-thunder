import { Head } from 'vite-react-ssg';
import { OG_IMAGE, TITLE_SUFFIX, canonical } from '../lib/seo';

interface SeoProps {
  /** Page-specific title. The brand suffix is appended unless `bare` is set. */
  title: string;
  description: string;
  /** Route path, e.g. "/duty-log" — drives canonical and og:url. */
  path: string;
  /** True for the homepage, whose title is already the brand. */
  bare?: boolean;
  /** Keep this page out of search results (thin/placeholder pages). */
  noindex?: boolean;
}

/*
 * Per-page head tags. Without this every prerendered route shipped the same
 * <title> and description from index.html, which wastes the whole point of
 * giving each section its own static page.
 *
 * vite-react-ssg's <Head> writes into the prerendered HTML at build time, so
 * these are present for crawlers with no JavaScript executed.
 */
export default function Seo({ title, description, path, bare, noindex }: SeoProps) {
  const fullTitle = bare ? title : `${title} — ${TITLE_SUFFIX}`;
  const url = canonical(path);

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={TITLE_SUFFIX} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={OG_IMAGE} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={OG_IMAGE} />

      {noindex && <meta name="robots" content="noindex, follow" />}
    </Head>
  );
}
