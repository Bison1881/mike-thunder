import Hero from '../components/Hero';
import DutyLog from '../components/DutyLog';
import NewsWire from '../components/NewsWire';

/*
 * The approved homepage (design_handoff_thin_purple_line/Home.html): hero →
 * duty log → news wire. The ticker, header, and footer live in the shared
 * Layout because every interior page inherits them.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <DutyLog />
      <NewsWire />
    </>
  );
}
