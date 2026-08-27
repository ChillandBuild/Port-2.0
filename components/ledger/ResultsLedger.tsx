import { LEDGER } from "@/lib/content";
import styles from "./ResultsLedger.module.css";

/** Results as a sent-mail ledger: what went out, what came back, from where. */
export function ResultsLedger() {
  return (
    <section className={styles.section} aria-labelledby="results-heading">
      <div className={styles.rail}>
        <h2 className="mono" id="results-heading">
          Sent · delivered · replied
        </h2>
        <span className={`mono ${styles.aside}`}>Selected results</span>
      </div>

      <dl className={styles.rows}>
        {LEDGER.map((row) => (
          <div className={styles.row} key={row.source}>
            <dt className={`${styles.value} tabular`}>
              {row.value}
              {row.suffix ? <span className={styles.suffix}>{row.suffix}</span> : null}
            </dt>
            <dd className={styles.label}>{row.label}</dd>
            <dd className={`mono ${styles.source}`}>{row.source}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
