import { SCHEDULE } from "@/lib/content";
import styles from "./ScheduleEngagement.module.css";

/**
 * The home page carries an abstract three-phase version of this strip
 * (components/terms/Terms.tsx). This is the /schedule version: four phases,
 * each with its price stated on it, because this is the page where somebody is
 * deciding whether to pay. The two arrays are deliberately separate — WORK_PLAN
 * stays priceless, SCHEDULE.engagement carries the numbers.
 *
 * Same visual grammar as Terms.module.css on purpose: hairline top rule that
 * wipes to accent on hover, siblings quietening to 0.62.
 */
export function ScheduleEngagement() {
  return (
    <section className={styles.section} aria-labelledby="schedule-engagement-heading">
      <div className={styles.head} data-reveal data-reveal-children>
        <p className={`mono ${styles.eyebrow}`}>{SCHEDULE.engagement.eyebrow}</p>
        <h2 className={styles.heading} id="schedule-engagement-heading">
          {SCHEDULE.engagement.heading}
        </h2>
        <p className={styles.standfirst}>{SCHEDULE.engagement.standfirst}</p>
      </div>

      <ol className={styles.steps}>
        {SCHEDULE.engagement.phases.map((phase) => (
          <li className={styles.step} key={phase.no} data-reveal>
            {/* The inner wrapper is not decorative: the hover-dim transition has
                to live off the data-reveal node. See ScheduleEngagement.module.css. */}
            <div className={styles.stepInner}>
              <p className={`mono ${styles.stepNo}`}>Phase {phase.no}</p>
              <h3 className={styles.stepName}>{phase.name}</h3>
              <p className={`mono tabular ${styles.stepPrice}`}>{phase.price}</p>
              <p className={styles.stepBody}>{phase.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
