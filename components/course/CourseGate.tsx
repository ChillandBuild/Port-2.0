import Link from "next/link";
import { COURSE, COURSE_ENROLL_HREF, COURSE_PRICE_INR } from "@/lib/content/course";
import { EnrollDialog } from "./EnrollDialog";
import styles from "./CourseGate.module.css";

/**
 * The paywall rendered in place of course content by app/course/layout.tsx.
 * "locked" is a visitor without (valid) access; "expired" is a cookie that
 * still resolves to an enrollment whose 30-day window has closed — same
 * screen, different copy, because expired buyers need "renew", not "what is
 * this?". Stays a server component: the count-up stat numerals are picked up
 * by the page-wide ScrollFX driver with zero client code, and the entrance
 * motion is CSS-only — only EnrollDialog (the payment flow) needs "use client".
 */
export function CourseGate({ state }: { state: "locked" | "expired" }) {
  const copy = state === "expired" ? COURSE.gate.expiredEyebrow : COURSE.gate.lockedEyebrow;
  const heading = state === "expired" ? COURSE.gate.expiredHeading : COURSE.gate.lockedHeading;
  const body = state === "expired" ? COURSE.gate.expiredBody : COURSE.gate.lockedBody;
  const priceLabel = `₹${COURSE_PRICE_INR.toLocaleString("en-IN")}`;
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
