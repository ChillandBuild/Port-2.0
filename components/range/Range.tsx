import { SECTORS } from "@/lib/content";
import styles from "./Range.module.css";

/**
 * Breadth as an index, not a grid of cards. Each sector is one hairline row —
 * number, title, description, tag — and the three core verticals are marked
 * with the accent stop, the same punctuation as the wordmark. Flat white so
 * the section reads as its own ledger against the themed page around it.
 */
export function Range() {
  return (
    <section className={`spot ${styles.range}`} id="range" data-spot aria-labelledby="range-heading">
      <div className={styles.head} data-reveal>
        <h2 className={styles.heading} id="range-heading">
          Nine sectors.
          <br />
          Twenty-four global markets.
        </h2>
        <p className={styles.headBody}>
          The method holds across all of them. The message never does, which is
          the entire point.
        </p>
      </div>

      <div className={styles.rows} data-reveal data-reveal-children>
        {SECTORS.map((sector, i) => (
          <div
            className={`${styles.row} ${sector.core ? styles.rowCore : ""}`}
            key={sector.title}
          >
            <span className={`mono ${styles.idx}`}>{String(i + 1).padStart(2, "0")}</span>
            <h3 className={styles.title}>
              {sector.title}
              {sector.core && <span className={styles.mark} aria-hidden="true" />}
            </h3>
            <p className={styles.body}>{sector.description}</p>
            <span className={`mono ${styles.tag}`}>{sector.tag}</span>
          </div>
        ))}
      </div>

      <p className={`mono ${styles.legend}`} data-reveal>
        <span className={styles.mark} aria-hidden="true" /> core focus
      </p>

      <p className={styles.closerBody} data-reveal>
        Buyer norms change at every border. Cadence timing, proof style and how
        direct the first line can be are set per market, not per campaign.
      </p>
    </section>
  );
}
