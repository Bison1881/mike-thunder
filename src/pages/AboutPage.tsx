import { POSTS } from '../lib/posts';
import { SITE } from '../lib/site';
import r from '../components/report.module.css';
import s from './AboutPage.module.css';
import Seo from '../components/Seo';

/*
 * About Mike Thunder.
 *
 * The prose is adapted from Mike's own introduction post ("Well, Hello There,
 * Strangers") — his voice, his claims, his running gags (the donut, the
 * Mama-appointed title, "sincidents"). Nothing biographical is invented here;
 * if a fact isn't in his own writing, it isn't on this page. It is still a
 * draft he should rewrite in his own words when he has time.
 *
 * The personnel-file card reuses the 1b form card shared with the Duty Log.
 */
export default function AboutPage() {
  return (
    <div className={s.page}>
      <Seo
        title="About Mike Thunder"
        description="Decades on the security beat, one self-issued commendation, and an unbroken record of nothing to report. Truth is optional, humor is mandatory."
        path="/about"
      />
      <header className={s.head}>
        <div className={s.kicker}>SECTION · ABOUT</div>
        <h1 className={s.title}>ABOUT MIKE THUNDER</h1>
      </header>

      <div className={s.grid}>
        <div className={s.prose}>
          <p className={s.lead}>
            Friends and neighbors, I'm Mike Thunder — and depending on who you ask, the greatest
            security guard who ever clipped on a badge, and a tie.
          </p>

          <p>
            Over decades in security I've come across some of the craziest and downright appalling
            "sincidents" you'll ever hear about. Retail floors, loss prevention, the alarm response 
            in a company patrol car in the last place you wanted to visit, the long walk
            around a dark building at 3 a.m. — I've worked it, and I've written it down.
          </p>

          <p>
            Consider this blog my memoirs: how true greatness handles the everyday, the mundane, the
            dangerous and the extraordinary, all while staying cool as a cucumber and occasionally
            giving the bad guys what's coming to 'em. I might give the occasional squeeze of my own
            horn, but I've earned that right. Don't believe me? Read the logs and see for yourself.
          </p>

          <div className={s.quote}>
            <span className={s.quoteText}>Truth is optional, humor is mandatory.</span>
            <span className={s.quoteCite}>— MIKE THUNDER, LOG #0001</span>
          </div>

          <p>
            So grab a donut, save one for me, and be regaled with tales from behind the thin purple
            line from an insider's point of view. I guarantee a good time you don't even have to
            call for. You're welcome.
          </p>
        </div>

        <aside className={s.badge}>
          <img className={s.badgeImg} src="/logo.webp" alt="Mike Thunder" width={150} height={150} />
          <span className={s.badgeName}>MIKE THUNDER</span>
          <span className={s.badgeRole}>
            SECURITY OFFICER
            <br />
            THE THIN PURPLE LINE
          </span>
        </aside>
      </div>

      <div className={r.wrap}>
        <div className={r.card}>
          <div className={r.bar}>
            <span className={r.form}>PERSONNEL FILE — FORM TPL-02</span>
            <span className={r.page}>CONFIDENTIAL</span>
          </div>
          <div className={r.body}>
            <div className={`${r.fields} ${r.fieldsTwo}`}>
              <div className={r.field}>
                <span className={r.fieldLabel}>NAME</span>
                <span className={r.fieldValue}>MIKE THUNDER</span>
              </div>
              <div className={r.field}>
                <span className={r.fieldLabel}>POSITION</span>
                <span className={r.fieldValue}>SECURITY LEGEND</span>
              </div>
              <div className={r.field}>
                <span className={r.fieldLabel}>YEARS OF SERVICE</span>
                <span className={r.fieldValue}>LIFETIME</span>
              </div>
              <div className={r.field}>
                <span className={r.fieldLabel}>PRIOR POSTING</span>
                <span className={r.fieldValue}>EVERYTHING</span>
              </div>
              <div className={r.field}>
                <span className={r.fieldLabel}>COMMENDATION</span>
                <span className={`${r.fieldValue} ${r.fieldAccent}`}>
                  GREATEST SECURITY GUARD, EVER
                </span>
              </div>
              <div className={r.field}>
                <span className={r.fieldLabel}>ENTRIES ON FILE</span>
                <span className={`${r.fieldValue} ${r.fieldAccent}`}>
                  {String(POSTS.length).padStart(3, '0')}
                </span>
              </div>
            </div>
            <div className={r.remarks}>
              <span className={r.fieldLabel}>REMARKS</span>
              <span className={r.remarksValue}>
                Commendation self-issued. Maintains an unbroken record of
                nothing to report. Keeps a full donut box on hand at all times.
              </span>
            </div>
            <div className={r.stamp}>ON DUTY</div>
          </div>
        </div>
      </div>

      <div className={s.closing}>
        <span className={s.closingLabel}>STILL READING?</span>
        <p className={s.closingCopy}>
          The stories live on Substack, filed as they happen. Subscribe and the next one comes to
          you.
        </p>
        <a className={s.closingBtn} href={SITE.subscribe}>
          SUBSCRIBE
        </a>
      </div>
    </div>
  );
}
