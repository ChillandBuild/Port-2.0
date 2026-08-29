import { SCHEDULE } from "@/lib/content";
import styles from "./ScheduleContact.module.css";

/**
 * The fallback, now that the form above is the primary route in. The old
 * "payment setup isn't approved" status box is gone — that sentence lives in
 * the form's note, where somebody about to submit will actually read it,
 * rather than as a banner above the fold.
 */
export function ScheduleContact() {
  return (
    <section className={styles.section} aria-labelledby="schedule-contact-heading">
      <div className={`spot ${styles.card}`} data-spot data-reveal data-reveal-children>
        <div>
          <p className={`mono ${styles.cardEyebrow}`}>{SCHEDULE.fallback.eyebrow}</p>
          <h2 className={styles.cardHeading} id="schedule-contact-heading">
            {SCHEDULE.fallback.heading}
          </h2>
          <p className={styles.cardBody}>{SCHEDULE.fallback.body}</p>
        </div>

        <div className={styles.cardActions}>
          <a
            className={styles.primary}
            href={SCHEDULE.fallback.primaryCta.href}
            target="_blank"
            rel="noreferrer noopener"
            data-tilt="4"
          >
            {SCHEDULE.fallback.primaryCta.label} <span aria-hidden="true">→</span>
          </a>
          <a className={styles.ghost} href={SCHEDULE.fallback.secondaryCta.href}>
            {SCHEDULE.fallback.secondaryCta.label}
          </a>
        </div>
      </div>

      <nav className={styles.links} aria-label="More on Sampath">
        {SCHEDULE.links.map((link) => (
          <a className={styles.linkItem} key={link.href} href={link.href}>
            {link.label}
          </a>
        ))}
      </nav>
    </section>
  );
}
