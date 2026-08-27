import { campaignTotals } from "@/lib/campaign";
import { COHORT } from "@/lib/world-instance";
import { IDENTITY } from "@/lib/content";
import styles from "./Reply.module.css";

/**
 * The close. The run that started in the world is totalled here and stops, and
 * the page arrives somewhere rather than trailing into a footer.
 *
 * Totals are computed from the same deterministic cohort the canvas drew, so the
 * receipt describes the run the reader actually watched.
 */
export function Reply() {
  const totals = campaignTotals(COHORT);

  const receipt = [
    { label: "Sourced", value: totals.sourced },
    { label: "Verified", value: totals.verified },
    { label: "Sent", value: totals.sent },
    { label: "Replied", value: totals.replied },
    { label: "Booked", value: totals.booked },
  ];

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
          <dl className={styles.receipt}>
            {receipt.map((line) => (
              <div key={line.label} className={styles.line}>
                <dt className="mono">{line.label}</dt>
                <dd className="tabular">{line.value}</dd>
              </div>
            ))}
          </dl>
          <figcaption className={`mono ${styles.disclaimer}`}>
            Totals from the run above. The verified figures are in the ledger.
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
