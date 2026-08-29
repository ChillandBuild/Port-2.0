import { SCHEDULE } from "@/lib/content";
import styles from "./ScheduleEngagement.module.css";

/**
 * The home page carries an abstract three-phase version of this strip
 * (components/terms/Terms.tsx). This is the /schedule version: four phases,
 * each with its price stated on it, because this is the page where somebody is
 * deciding whether to pay. The two arrays are deliberately separate — WORK_PLAN
 * stays priceless, SCHEDULE.engagement carries the numbers.
 *
 * It used to borrow Terms.module.css's grammar — hairline top rule wiping to
 * accent. It no longer does: from 1024px up this is a zig-zag of cards on a
 * ruled ground, connected by drawn lines with a node travelling the tip
 * (components/motion/connectors.ts). Terms.tsx is unchanged and still owns the
 * hairline strip; the two sections deliberately diverge now. Only the sibling
 * quietening to 0.62 survives.
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

      {/* Both <svg>s are siblings of the <ol>, not children: <ol> only admits
          <li>. .ladder is the shared coordinate space — it is the offsetParent
          every anchor is measured against in components/motion/connectors.ts. */}
      <div className={styles.ladder} data-connectors>
        {/* Ground plane. Behind the cards, and static — the ticks land on every
            third grid intersection because the tick tile is 3x the cell. */}
        <svg className={styles.grid} aria-hidden="true" focusable="false">
          <defs>
            <pattern height="96" id="engagement-cells" patternUnits="userSpaceOnUse" width="96">
              <path d="M 96 0 L 0 0 L 0 96" />
            </pattern>
            <pattern height="288" id="engagement-ticks" patternUnits="userSpaceOnUse" width="288">
              <path className={styles.gridTick} d="M 91 96 L 101 96 M 96 91 L 96 101" />
            </pattern>
          </defs>
          <rect fill="url(#engagement-cells)" height="100%" width="100%" />
          <rect fill="url(#engagement-ticks)" height="100%" width="100%" />
        </svg>

        <ol className={styles.steps}>
          {SCHEDULE.engagement.phases.map((phase) => (
            <li className={styles.step} key={phase.no} data-connector-anchor data-reveal>
              {/* The inner wrapper is not decorative: the hover-dim transition has
                  to live off the data-reveal node. See ScheduleEngagement.module.css. */}
              <div className={styles.stepInner}>
                <p className={`mono ${styles.stepNo}`}>Phase {phase.no}</p>
                <h3 className={styles.stepName}>{phase.name}</h3>
                <p className={`mono tabular ${styles.stepPrice}`} data-connector-target>
                  {phase.price}
                </p>
                <p className={styles.stepBody}>{phase.description}</p>
              </div>
            </li>
          ))}
        </ol>

        {/* One connector per gap, so the count is derived rather than written
            down twice. Both `d` and the dot positions are computed at runtime
            from live anchor positions — nothing here is a fixed coordinate. */}
        <svg className={styles.connectors} aria-hidden="true" focusable="false">
          {SCHEDULE.engagement.phases.slice(1).map((phase) => (
            <g key={phase.no}>
              <path className={styles.connectorPath} data-connector-path fill="none" />
              <circle className={styles.connectorDot} data-connector-dot r="4.5" />
            </g>
          ))}
        </svg>
      </div>
    </section>
  );
}
