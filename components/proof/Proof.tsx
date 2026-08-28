import { ImpressionsChart } from "@/components/linkedin/ImpressionsChart";
import { LEDGER, LINKEDIN } from "@/lib/content";
import styles from "./Proof.module.css";

/**
 * The arrival. The world has landed, the motion drops away, and the figures
 * that follow are the checkable ones — each with the engagement it came from
 * attached, because a number without a source is decoration.
 *
 * Closes with the LinkedIn reach and the curve behind it; the writing that
 * made both now stands as its own section down by the footer.
 */
export function Proof() {
  return (
    <section className={styles.proof} id="proof" aria-labelledby="proof-heading">
      <div className={styles.intro} data-reveal data-reveal-children>
        <p className="mono">Verified</p>
        <h2 className={styles.heading} id="proof-heading">
          That was the method. These are the results, with their sources attached.
        </h2>
      </div>

      <dl className={styles.ledger}>
        {LEDGER.map((row) => (
          <div className={styles.row} key={row.label} data-reveal>
            <dt className={`${styles.value} tabular`}>
              {row.count ? (
                <span
                  data-count={row.count.to}
                  data-count-prefix={row.count.prefix ?? ""}
                  data-count-suffix={row.count.suffix ?? ""}
                  data-count-decimals={row.count.decimals ?? 0}
                >
                  {row.value}
                </span>
              ) : (
                row.value
              )}
            </dt>
            <dd className={styles.meaning}>
              <p className={styles.label}>{row.label}</p>
              <p className={`mono ${styles.source}`}>{row.source}</p>
            </dd>
          </div>
        ))}
      </dl>

      <div className={styles.inbound} data-reveal data-reveal-children>
        <h3 className={styles.inboundHeading}>{LINKEDIN.heading}</h3>
        <p className={styles.inboundBody}>{LINKEDIN.body}</p>
        <ul className={styles.inboundStats}>
          {LINKEDIN.stats.map((stat) => (
            <li key={stat.label}>
              <span className={`${styles.inboundValue} tabular`}>{stat.value}</span>
              <span className={`mono ${styles.inboundLabel}`}>{stat.label}</span>
            </li>
          ))}
        </ul>
        <ImpressionsChart />
      </div>
    </section>
  );
}
