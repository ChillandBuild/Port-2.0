import Link from "next/link";
import { COURSE, COURSE_ENROLL_HREF } from "@/lib/content/course";
import { CourseUnlockForm } from "./CourseUnlockForm";
import styles from "./CourseGate.module.css";

/**
 * The paywall rendered in place of course content by app/course/layout.tsx.
 * "locked" is a visitor without (valid) access; "expired" is a cookie that
 * still resolves to an enrollment whose 30-day window has closed — same
 * screen, different copy, because expired buyers need "renew", not "what is
 * this?".
 */
export function CourseGate({ state }: { state: "locked" | "expired" }) {
  const copy = state === "expired" ? COURSE.gate.expiredEyebrow : COURSE.gate.lockedEyebrow;
  const heading = state === "expired" ? COURSE.gate.expiredHeading : COURSE.gate.lockedHeading;
  const body = state === "expired" ? COURSE.gate.expiredBody : COURSE.gate.lockedBody;

  return (
    <section className={styles.gate} aria-labelledby="course-gate-title">
      <p className={`mono ${styles.eyebrow}`}>{copy}</p>
      <h1 className={styles.heading} id="course-gate-title">
        {heading}
      </h1>
      <p className={styles.body}>{body}</p>

      <div className={styles.panel}>
        <p className={styles.enrollNote}>{COURSE.durationNote}</p>
        <a className={styles.buy} href={COURSE_ENROLL_HREF} target="_blank" rel="noreferrer noopener">
          {COURSE.gate.buyLabel}
        </a>
        <p className={styles.buyNote}>{COURSE.gate.buyNote}</p>
        <div className={styles.rule} aria-hidden="true" />
        <CourseUnlockForm />
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
