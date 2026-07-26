import Hero from '../components/Hero';
import DutyLog from '../components/DutyLog';
import NewsWire from '../components/NewsWire';
import Seo from '../components/Seo';

/*
 * The approved homepage (design_handoff_thin_purple_line/Home.html): hero →
 * duty log → news wire. The ticker, header, and footer live in the shared
 * Layout because every interior page inherits them.
 */
export default function HomePage() {
  return (
    <>
      <Seo
        bare
        title="The Thin Purple Line — Status: Nothing To Report"
        description="Memoirs of the greatest security guard, ever. Real security, real incidents, and really long stretches where absolutely nothing happens — reported with total professionalism."
        path="/"
      />
      <Hero />
      <DutyLog />
      <NewsWire />
    </>
  );
}
