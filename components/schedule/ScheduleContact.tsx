import { SCHEDULE } from "@/lib/content";
import styles from "./ScheduleContact.module.css";

/**
 * Booking isn't live yet (no payment link, no calendar), so this is the honest
 * state: a status line saying so, and the same fallback every other page on
 * the site uses — LinkedIn or the phone number.
 */
export function ScheduleContact() {
  return (
    <section className={styles.section} aria-labelledby="schedule-contact-heading">
      <div className={styles.status} role="status">
        <p className={`mono ${styles.statusEyebrow}`}>{SCHEDULE.paymentStatus.eyebrow}</p>
        <p className={styles.statusBody}>{SCHEDULE.paymentStatus.body}</p>
      </div>

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
