import Link from "next/link";
import { COURSE, COURSE_ENROLL_HREF, COURSE_PRICE_USD } from "@/lib/content/course";
import { GUIDE_DOCUMENT } from "@/lib/guide";
import { chapterIcon } from "@/components/guide/icons";
import { EnrollDialog } from "./EnrollDialog";
import { CourseUnlockForm } from "./CourseUnlockForm";
import styles from "./CourseSales.module.css";
import type { CourseGateState } from "./gate-state";

const HERO_COPY: Record<
  CourseGateState,
  { eyebrow: string; heading: string; body: string }
> = {
  locked: {
    eyebrow: COURSE.sales.hero.lockedEyebrow,
    heading: COURSE.sales.hero.lockedHeading,
    body: COURSE.sales.hero.lockedBody,
  },
  expired: {
    eyebrow: COURSE.sales.hero.expiredEyebrow,
    heading: COURSE.sales.hero.expiredHeading,
    body: COURSE.sales.hero.expiredBody,
  },
  revoked: {
    eyebrow: COURSE.sales.hero.revokedEyebrow,
    heading: COURSE.sales.hero.revokedHeading,
    body: COURSE.sales.hero.revokedBody,
  },
};

/**
 * The /course sales page — hero, outcomes, curriculum (generated from
 * GUIDE_DOCUMENT so it cannot drift from the course), instructor, pricing
 * card with the always-open enroll form, FAQ and trust links. Rendered for
 * every access state; only the hero copy differs, so expired and revoked
 * buyers are always one scroll from re-enrolling. Server component — only
 * EnrollDialog and CourseUnlockForm are client islands.
 */
export function CourseSalesPage({ state }: { state: CourseGateState }) {
  const hero = HERO_COPY[state];
  const priceLabel = `$${COURSE_PRICE_USD}`;
  const keyConfigured = Boolean(process.env.RAZORPAY_KEY_ID);

  return (
    <article className={styles.page}>
      {/* ---------------------------------------------------------- hero */}
      <section className={styles.hero} aria-labelledby="sales-title">
        <p className={`mono ${styles.eyebrow}`}>{hero.eyebrow}</p>
        <h1 className={styles.heading} id="sales-title">
          {hero.heading}
        </h1>
        <p className={styles.lede}>{hero.body}</p>

        <div className={styles.heroActions}>
          <a className={styles.primary} href={COURSE.sales.ctaHref}>
            {COURSE.sales.heroCta}
          </a>
          <div className={styles.priceAnchor}>
            <span className={styles.priceValue}>{priceLabel}</span>
            <span className={styles.priceTerms}>one-time payment</span>
          </div>
        </div>
        <p className={`mono ${styles.trustCue}`}>{COURSE.sales.heroCtaNote}</p>

        <dl className={styles.heroStats}>
          <div className={styles.heroStat}>
            <dt className={`mono ${styles.heroStatLabel}`}>{COURSE.gate.statLessonsLabel}</dt>
            <dd className={styles.heroStatValue} data-count={COURSE.gate.statLessons}>
              {COURSE.gate.statLessons}
            </dd>
          </div>
          <div className={styles.heroStat}>
            <dt className={`mono ${styles.heroStatLabel}`}>Chapters</dt>
            <dd className={styles.heroStatValue} data-count={GUIDE_DOCUMENT.chapters.length}>
              {GUIDE_DOCUMENT.chapters.length}
            </dd>
          </div>
          <div className={styles.heroStat}>
            <dt className={`mono ${styles.heroStatLabel}`}>{COURSE.gate.statDaysLabel}</dt>
            <dd className={styles.heroStatValue} data-count={COURSE.gate.statDays}>
              {COURSE.gate.statDays}
            </dd>
          </div>
        </dl>
      </section>

      {/* ------------------------------------------------------ outcomes */}
      <section className={styles.outcomes} aria-labelledby="outcomes-title">
        <p className={`mono ${styles.eyebrow}`}>{COURSE.sales.outcomesEyebrow}</p>
        <h2 className={styles.sectionHeading} id="outcomes-title">
          {COURSE.sales.outcomesHeading}
        </h2>
        <ul className={styles.outcomeGrid}>
          {COURSE.sales.outcomes.map((outcome) => (
            <li key={outcome} className={styles.outcome}>
              <span className={styles.outcomeCheck} aria-hidden="true">
                ✓
              </span>
              {outcome}
            </li>
          ))}
        </ul>
        <p className={`mono ${styles.outcomesNote}`}>{COURSE.sales.outcomesNote}</p>
      </section>

      {/* ---------------------------------------------------- curriculum */}
      <section className={styles.curriculum} aria-labelledby="curriculum-title">
        <p className={`mono ${styles.eyebrow}`}>{COURSE.sales.curriculumEyebrow}</p>
        <h2 className={styles.sectionHeading} id="curriculum-title">
          {COURSE.sales.curriculumHeading}
        </h2>
        <p className={styles.sectionBody}>{COURSE.sales.curriculumBody}</p>

        <ol className={styles.chapterList}>
          {GUIDE_DOCUMENT.chapters.map((chapter, i) => (
            <li key={chapter.id} className={styles.chapterCard}>
              <details open={i === 0}>
                <summary className={styles.chapterSummary}>
                  <span className={styles.chapterIconWrap}>{chapterIcon(chapter.id)}</span>
                  <span className={styles.chapterTitleGroup}>
                    <span className={`mono ${styles.chapterNo}`}>Chapter {chapter.number}</span>
                    <span className={styles.chapterTitle}>{chapter.title}</span>
                  </span>
                  <span className={`mono ${styles.chapterCount}`}>
                    {COURSE.sales.curriculumMeta(chapter.sections.length)}
                  </span>
                </summary>
                <ol className={styles.lessonList}>
                  {chapter.sections.map((section) => (
                    <li key={section.id} className={styles.lessonItem}>
                      {section.title}
                    </li>
                  ))}
                </ol>
              </details>
            </li>
          ))}
        </ol>
      </section>

      {/* ---------------------------------------------------- instructor */}
      <section className={styles.instructor} aria-labelledby="instructor-title">
        <p className={`mono ${styles.eyebrow}`}>{COURSE.sales.instructorEyebrow}</p>
        <h2 className={styles.sectionHeading} id="instructor-title">
          {COURSE.sales.instructorHeading}
        </h2>
        {COURSE.sales.instructorBody.map((para) => (
          <p key={para} className={styles.sectionBody}>
            {para}
          </p>
        ))}
        <a
          className={styles.textLink}
          href="https://www.linkedin.com/in/sampath-kumar-tn66sk9699"
          target="_blank"
          rel="noreferrer noopener"
        >
          {COURSE.sales.instructorCta} ↗
        </a>
      </section>

      {/* ------------------------------------------------ pricing + enroll */}
      <section className={styles.pricing} aria-labelledby="pricing-title" id="enroll">
        <p className={`mono ${styles.eyebrow}`}>{COURSE.sales.pricingEyebrow}</p>
        <h2 className={styles.sectionHeading} id="pricing-title">
          {COURSE.sales.pricingHeading}
        </h2>

        <div className={styles.priceCard}>
          <div className={styles.priceCardTop}>
            <p className={styles.priceBig}>{priceLabel}</p>
            <p className={`mono ${styles.priceTerms}`}>one-time payment · {COURSE.durationNote}</p>
            <p className={styles.guaranteeBadge}>
              <span aria-hidden="true">↩</span> {COURSE.sales.guaranteeBadge}
            </p>
          </div>

          <div className={styles.priceCardRule} aria-hidden="true" />

          <p className={`mono ${styles.includesLabel}`}>{COURSE.sales.includesLabel}</p>
          <ul className={styles.includesList}>
            {COURSE.sales.includes.map((item) => (
              <li key={item} className={styles.includesItem}>
                {item}
              </li>
            ))}
          </ul>

          <div className={styles.priceCardRule} aria-hidden="true" />

          <EnrollDialog priceLabel={priceLabel} fallbackHref={COURSE_ENROLL_HREF} keyConfigured={keyConfigured} />
          <p className={styles.secureNote}>{COURSE.sales.secureNote}</p>
          <p className={styles.guaranteeNote}>{COURSE.sales.guaranteeNote}</p>

          <div className={styles.priceCardRule} aria-hidden="true" />

          <div className={styles.unlockBlock}>
            <p className={`mono ${styles.unlockHeading}`}>{COURSE.sales.unlockHeading}</p>
            <p className={styles.unlockBody}>{COURSE.sales.unlockBody}</p>
            <CourseUnlockForm />
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- FAQ */}
      <section className={styles.faq} aria-labelledby="faq-title">
        <p className={`mono ${styles.eyebrow}`}>{COURSE.sales.faqEyebrow}</p>
        <h2 className={styles.sectionHeading} id="faq-title">
          {COURSE.sales.faqHeading}
        </h2>
        <div className={styles.faqList}>
          {COURSE.sales.faq.map((item) => (
            <details key={item.q} className={styles.faqItem}>
              <summary className={styles.faqQuestion}>{item.q}</summary>
              <p className={styles.faqAnswer}>{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------- trust links */}
      <footer className={styles.trustRow}>
        {COURSE.sales.trustLinks.map((link) => (
          <Link key={link.href} className={styles.trustLink} href={link.href}>
            {link.label}
          </Link>
        ))}
        <Link className={styles.trustLink} href="/">
          {COURSE.sales.backLabel}
        </Link>
      </footer>
    </article>
  );
}
