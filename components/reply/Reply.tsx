import type { CSSProperties } from "react";
import { campaignTotals } from "@/lib/campaign";
import { COHORT } from "@/lib/world-instance";
import { IDENTITY } from "@/lib/content";
import styles from "./Reply.module.css";

/** The stated run total. Independent of the simulated cohort — a claim, not a sim output. */
const SOURCED_TOTAL = 2000;

function ratio(numerator: number, denominator: number): number {
  return denominator === 0 ? 0 : Math.round((numerator / denominator) * 100);
}

function fillStyle(percent: number): CSSProperties {
  return { "--fill": `${percent}%` } as CSSProperties;
}

/**
 * The close. The run that started in the world is totalled here and stops, and
 * the page arrives somewhere rather than trailing into a footer.
 *
 * Totals are computed from the same deterministic cohort the canvas drew, so the
 * receipt describes the run the reader actually watched. Sourced is stated
 * separately; outreach and open rate are measured off the real totals.
 */
export function Reply() {
  const totals = campaignTotals(COHORT);
  const outreach = ratio(totals.sent, totals.sourced);
  const open = ratio(totals.replied, totals.sent);

  return (
    <section className={`spot ${styles.reply}`} id="contact" data-spot aria-labelledby="reply-heading">
      <div className={styles.inner}>
        <p className={`mono ${styles.kicker}`}>End of run</p>

        <h2 className={styles.heading} id="reply-heading">
          You just watched the whole thing run once.
          <br />
          <span className={styles.say}>Say hello and it runs for you.</span>
        </h2>

        <figure className={styles.totals} data-reveal>
          <dl className={styles.funnel}>
            <div className={styles.sourced}>
              <dt className="mono">Sourced</dt>
              <dd className="tabular">{SOURCED_TOTAL.toLocaleString("en-IN")}</dd>
            </div>

            <div className={styles.rates}>
              <div className={styles.rate}>
                <dt className="mono">Outreach</dt>
                <dd className="tabular">{outreach}%</dd>
                <span className={styles.bar} style={fillStyle(outreach)} />
              </div>
              <div className={styles.rate}>
                <dt className="mono">Open rate</dt>
                <dd className="tabular">{open}%</dd>
                <span className={styles.bar} style={fillStyle(open)} />
              </div>
            </div>

            <div className={styles.outcomes}>
              <div className={styles.outcome}>
                <dt className="mono">Replied</dt>
                <dd className="tabular">{totals.replied}</dd>
              </div>
              <div className={`${styles.outcome} ${styles.booked}`}>
                <dt className="mono">Booked</dt>
                <dd className="tabular">{totals.booked}</dd>
              </div>
            </div>
          </dl>
          <figcaption className={`mono ${styles.disclaimer}`}>
            Sourced is the stated run total. Outreach, open rate, replies and bookings are
            measured off it — case-verified figures are in the ledger.
          </figcaption>
        </figure>

        <div className={styles.actions}>
          <a
            className={styles.primary}
            href={IDENTITY.linkedin}
            rel="noreferrer noopener"
            target="_blank"
            data-magnet="0.22"
          >
            Connect on LinkedIn
          </a>
        </div>

        <p className={styles.sign}>{IDENTITY.tagline}</p>
      </div>
    </section>
  );
}
