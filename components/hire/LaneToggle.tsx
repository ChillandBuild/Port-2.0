"use client";

/**
 * Block 2: the qualifying question, asked before anything is pitched — the
 * same discipline a pre-sales lead applies before a demo. Defaults to
 * "hiring" since full-time is the site's stated priority (SITE-CONTENT.md);
 * a blank, un-chosen state would read as broken.
 */

import { HIRE } from "@/lib/content";
import { useLane } from "./LaneContext";
import styles from "./LaneToggle.module.css";

export function LaneToggle() {
  const { lane, setLane } = useLane();

  return (
    <section className={styles.section} aria-labelledby="lane-heading" data-reveal>
      <p className={styles.heading} id="lane-heading">
        {HIRE.lane.heading}
      </p>
      <div className={styles.toggle} role="group" aria-labelledby="lane-heading">
        <button
          type="button"
          className={styles.pill}
          aria-pressed={lane === "hiring"}
          onClick={() => setLane("hiring")}
        >
          <span className={styles.pillLabel}>{HIRE.lane.hiringLabel}</span>
          <span className={styles.pillHint}>{HIRE.lane.hiringHint}</span>
        </button>
        <button
          type="button"
          className={styles.pill}
          aria-pressed={lane === "buying"}
          onClick={() => setLane("buying")}
        >
          <span className={styles.pillLabel}>{HIRE.lane.buyingLabel}</span>
          <span className={styles.pillHint}>{HIRE.lane.buyingHint}</span>
        </button>
      </div>
    </section>
  );
}
