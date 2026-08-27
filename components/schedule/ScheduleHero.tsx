import Link from "next/link";
import { SCHEDULE } from "@/lib/content";
import styles from "./ScheduleHero.module.css";

/**
 * The /schedule page's opening block: the two-call offer, stated plainly.
 * A free strategy call first, then the paid setup session — ported from the
 * live Portfolio/schedule/index.html, which updated the offer after this site
 * first shipped a single $350 session.
 */
export function ScheduleHero() {
  const [before, highlight, after] = SCHEDULE.headline;

  return (
    <section className={styles.hero} aria-labelledby="schedule-heading">
      <Link className={styles.back} href="/">
        <span aria-hidden="true">←</span> Home
      </Link>

      <p className={`mono ${styles.eyebrow}`}>{SCHEDULE.eyebrow}</p>

      <h1 className={styles.headline} id="schedule-heading">
        {before}
        <em className={styles.highlight}>{highlight}</em>
        {after}
      </h1>

      <ul className={styles.freeBadge} aria-label="First call is free">
        {SCHEDULE.freeBadge.map((word, i) => (
          <li key={i}>{word}</li>
        ))}
      </ul>

      <p className={styles.sub}>
        <strong>{SCHEDULE.sub.lead}</strong>
        {SCHEDULE.sub.rest}
      </p>

      <dl className={styles.summary} aria-label="Consulting offer details">
        {SCHEDULE.summary.map((item) => (
          <div
            className={`${styles.summaryItem} ${"free" in item && item.free ? styles.summaryItemFree : ""}`}
            key={item.title}
          >
            <dt>{item.title}</dt>
            <dd>{item.detail}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
