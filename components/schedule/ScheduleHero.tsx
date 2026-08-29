import Link from "next/link";
import { SCHEDULE } from "@/lib/content";
import styles from "./ScheduleHero.module.css";

/**
 * The /schedule page's opening block. States the top of the ladder only — free
 * call, paid second call, format — and leaves the rest of the commercial model
 * to the sections below it. The page is long enough that the hero's job is to
 * establish that the first conversation costs nothing, not to price everything.
 */
export function ScheduleHero() {
  const [before, highlight, after] = SCHEDULE.headline;

  return (
    <section className={styles.hero} aria-labelledby="schedule-heading" data-reveal data-reveal-children>
      <Link className={styles.back} href="/">
        <span aria-hidden="true">←</span> Home
      </Link>

      <p className={`mono ${styles.eyebrow}`}>{SCHEDULE.eyebrow}</p>

      <h1 className={styles.headline} id="schedule-heading">
        {before}
        <em className={styles.highlight}>{highlight}</em>
        {after}
      </h1>

      <p className={styles.sub}>
        <strong>{SCHEDULE.chip}</strong>
        {" — "}
        {SCHEDULE.sub.lead}
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
