import Link from "next/link";
import { COURSE, COURSE_ENROLL_HREF, COURSE_PRICE_USD } from "@/lib/content/course";
import { EnrollDialog } from "./EnrollDialog";
import { CourseUnlockForm } from "./CourseUnlockForm";
import styles from "./CourseGate.module.css";

export type CourseGateState = "locked" | "expired" | "revoked";

/**
 * The paywall rendered in place of course content by app/course/page.tsx.
 * "locked" is a visitor without (valid) access; "expired" is a cookie that
 * still resolves to an enrollment whose window has closed; "revoked" is a
 * grant ended by hand. Same screen, different copy — an expired buyer needs
 * "renew" and a revoked one needs "ask the person who sent you this", neither
 * of which is "what is this?".
 *
 * Stays a server component: the count-up stat numerals are picked up by the
 * page-wide ScrollFX driver with zero client code, and the entrance motion is
 * CSS-only — only EnrollDialog and CourseUnlockForm need "use client".
 */
const GATE_COPY: Record<CourseGateState, { eyebrow: string; heading: string; body: string }> = {
  locked: {
    eyebrow: COURSE.gate.lockedEyebrow,
    heading: COURSE.gate.lockedHeading,
    body: COURSE.gate.lockedBody,
  },
  expired: {
    eyebrow: COURSE.gate.expiredEyebrow,
    heading: COURSE.gate.expiredHeading,
    body: COURSE.gate.expiredBody,
  },
  revoked: {
    eyebrow: COURSE.gate.revokedEyebrow,
    heading: COURSE.gate.revokedHeading,
    body: COURSE.gate.revokedBody,
  },
};

export function CourseGate({ state }: { state: CourseGateState }) {
  const { eyebrow: copy, heading, body } = GATE_COPY[state];
  const priceLabel = `$${COURSE_PRICE_USD}`;
  const keyConfigured = Boolean(process.env.RAZORPAY_KEY_ID);

  return (
    <section className={styles.gate} aria-labelledby="course-gate-title">
      <p className={`mono ${styles.eyebrow} ${styles.entrance1}`}>{copy}</p>
      <h1 className={`${styles.heading} ${styles.entrance2}`} id="course-gate-title">
        {heading}
      </h1>
      <p className={`${styles.body} ${styles.entrance3}`}>{body}</p>

      <div className={`${styles.whatsInside} ${styles.entrance4}`}>
        <p className={`mono ${styles.whatsInsideHeading}`}>{COURSE.gate.whatsInsideHeading}</p>
        <ul className={styles.whatsInsideList}>
          {COURSE.gate.whatsInsideItems.map((item) => (
            <li key={item} className={styles.whatsInsideItem}>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className={`${styles.statRow} ${styles.entrance5}`}>
        <div className={styles.stat}>
          <span className={styles.statValue} data-count={COURSE.gate.statLessons}>
            {COURSE.gate.statLessons}
          </span>
          <span className={styles.statLabel}>{COURSE.gate.statLessonsLabel}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue} data-count={COURSE.gate.statDays}>
            {COURSE.gate.statDays}
          </span>
          <span className={styles.statLabel}>{COURSE.gate.statDaysLabel}</span>
        </div>
      </div>

      <div className={`${styles.panel} ${styles.entrance6}`}>
        <div className={styles.panelRule} aria-hidden="true" />
        <p className={styles.enrollNote}>{COURSE.durationNote}</p>
        <EnrollDialog priceLabel={priceLabel} fallbackHref={COURSE_ENROLL_HREF} keyConfigured={keyConfigured} />
        <p className={styles.buyNote}>{COURSE.gate.payNote}</p>

        {/*
          The access-code email has always told buyers to "open /course and
          enter your access code", but until now this page offered nowhere to
          type it — anyone on a new device was stranded. It is also the only
          way into a time-limited demo grant whose link has been used already.
        */}
        <details className={styles.unlock}>
          <summary className={styles.unlockSummary}>{COURSE.gate.unlockToggleLabel}</summary>
          <CourseUnlockForm />
        </details>
      </div>

      <p className={styles.backNote}>
        Not ready yet?{" "}
        <Link className={styles.backLink} href="/">
          Back to the site
        </Link>
      </p>
    </section>
  );
}
