import { SCHEDULE } from "@/lib/content";
import styles from "./ScheduleCta.module.css";

/**
 * Standalone CTA that links to the booking form. Pulled out of the hero so
 * it can sit closer to the form — users see it after reading the content,
 * not before.
 */
export function ScheduleCta() {
  return (
    <section className={styles.wrap} aria-label="Book a call">
      <a className={styles.cta} href={SCHEDULE.cta.href}>
        {SCHEDULE.cta.label}
      </a>
    </section>
  );
}
