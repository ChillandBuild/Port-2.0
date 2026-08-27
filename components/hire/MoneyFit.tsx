"use client";

/**
 * Block 5: price, shown only after the teardown has already made the case.
 * A pre-sales lead never opens with a number — this section reads against
 * work already seen, not against nothing. Swaps entirely by lane; nothing
 * else on the page changes.
 */

import { HIRE } from "@/lib/content";
import { useLane } from "./LaneContext";
import styles from "./MoneyFit.module.css";

export function MoneyFit() {
  const { lane } = useLane();
  const copy = HIRE.moneyFit[lane];

  return (
    <section className={styles.section} aria-labelledby="money-heading" data-reveal>
      <p className={`mono ${styles.eyebrow}`}>{copy.eyebrow}</p>
      <h2 className={styles.heading} id="money-heading">
        {copy.heading}
      </h2>

      {lane === "hiring" ? (
        <div className={styles.hiring}>
          <p className={`mono ${styles.compLabel}`}>{HIRE.moneyFit.hiring.compLabel}</p>
          <p className={styles.compBand}>{HIRE.moneyFit.hiring.compBand}</p>
          <ul className={styles.points}>
            {HIRE.moneyFit.hiring.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>
      ) : (
        <div className={styles.buying}>
          <p className={styles.body}>{HIRE.moneyFit.buying.body}</p>
          <dl className={styles.rates}>
            <div className={styles.rate}>
              <dt className={`mono ${styles.rateLabel}`}>{HIRE.moneyFit.buying.rateLabel}</dt>
              <dd className={styles.rateValue}>{HIRE.moneyFit.buying.rateValue}</dd>
            </div>
            <div className={styles.rate}>
              <dt className={`mono ${styles.rateLabel}`}>{HIRE.moneyFit.buying.sessionLabel}</dt>
              <dd className={styles.rateValue}>{HIRE.moneyFit.buying.sessionValue}</dd>
            </div>
          </dl>
        </div>
      )}
    </section>
  );
}
