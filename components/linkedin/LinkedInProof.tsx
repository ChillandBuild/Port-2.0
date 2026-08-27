import { ImpressionsChart } from "@/components/linkedin/ImpressionsChart";
import { LINKEDIN } from "@/lib/content";
import styles from "./LinkedInProof.module.css";

export function LinkedInProof() {
  return (
    <section className={styles.section} aria-labelledby="linkedin-heading">
      <div className={styles.rail}>
        <span className="mono">Re: inbound, unprompted</span>
        <span className={`mono ${styles.aside}`}>{LINKEDIN.eyebrow}</span>
      </div>

      <div className={styles.grid}>
        <div className={styles.summary}>
          <h2 className={styles.heading} id="linkedin-heading">
            {LINKEDIN.heading}
          </h2>
          <p className={styles.body}>{LINKEDIN.body}</p>

          <dl className={styles.stats}>
            {LINKEDIN.stats.map((stat) => (
              <div className={styles.stat} key={stat.label}>
                <dt className={`${styles.statValue} tabular`}>{stat.value}</dt>
                <dd className="mono">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <ImpressionsChart />
      </div>
    </section>
  );
}
