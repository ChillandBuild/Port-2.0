import { ImpressionsChart } from "@/components/linkedin/ImpressionsChart";
import { LINKEDIN } from "@/lib/content";
import { getLedger } from "@/lib/backend/site-content-loaders";
import styles from "./Proof.module.css";

/**
 * The arrival. The world has landed, the motion drops away, and the figures
 * that follow are the checkable ones — each with the engagement it came from
 * attached, because a number without a source is decoration.
 *
 * Closes with the LinkedIn reach and the curve behind it; the writing that
 * made both now stands as its own section down by the footer.
 */
export async function Proof() {
  const LEDGER = await getLedger();
  return (
    <section className={styles.proof} id="proof" aria-labelledby="proof-heading">
      <div className={styles.intro} data-reveal data-reveal-tier="lift" data-reveal-children>
        <p className="mono">Verified</p>
        <h2 className={styles.heading} id="proof-heading">
          That was the method. These are the results, with their sources attached.
        </h2>
      </div>

      <dl className={styles.ledger} data-reveal data-reveal-tier="subtle" data-reveal-children>
        {LEDGER.map((row) => (
          <div className={styles.row} key={row.label} data-count-row>
            <dt className={`${styles.value} tabular`}>
              {row.count ? (
                <>
                  <span
                    data-count={row.count.to}
                    data-count-prefix={row.count.prefix ?? ""}
                    data-count-suffix={row.count.suffix ?? ""}
                    data-count-decimals={row.count.decimals ?? 0}
                  >
                    {row.value}
                  </span>
                  <span className={styles.bar} aria-hidden="true">
                    <span className={styles.barFill} data-count-bar />
                  </span>
                </>
              ) : row.countRange ? (
                <span
                  data-count-range
                  data-count-range-from={row.countRange.from}
                  data-count-range-to={row.countRange.to}
                  data-count-prefix={row.countRange.prefix ?? ""}
                  data-count-suffix={row.countRange.suffix ?? ""}
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
              <span className={`${styles.inboundValue} tabular`}>
                {"count" in stat && stat.count ? (
                  <span
                    data-count={stat.count.to}
                    data-count-prefix={"prefix" in stat.count ? stat.count.prefix : ""}
                    data-count-suffix={"suffix" in stat.count ? stat.count.suffix : ""}
                    data-count-decimals={"decimals" in stat.count ? stat.count.decimals : 0}
                  >
                    {stat.value}
                  </span>
                ) : (
                  stat.value
                )}
              </span>
              <span className={`mono ${styles.inboundLabel}`}>{stat.label}</span>
            </li>
          ))}
        </ul>
        <ImpressionsChart />
      </div>
    </section>
  );
}
