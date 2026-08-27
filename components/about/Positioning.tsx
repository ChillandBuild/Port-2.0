import { ABOUT } from "@/lib/content";
import styles from "./Positioning.module.css";

export function Positioning() {
  return (
    <section className={styles.section} id="about" aria-labelledby="about-heading">
      <div className={styles.rail}>
        <span className="mono">Re: what I actually do</span>
        <span className={`mono ${styles.stamp}`}>{ABOUT.stamp}</span>
      </div>

      <div className={styles.grid}>
        <div className={styles.lead}>
          <p className={`mono ${styles.eyebrow}`}>{ABOUT.eyebrow}</p>
          <h2 className={styles.heading} id="about-heading">
            {ABOUT.heading}
          </h2>

          <div className={styles.exchange}>
            <p className={styles.asked}>&ldquo;{ABOUT.exchange.asked}&rdquo;</p>
            <p className={styles.answered}>&ldquo;{ABOUT.exchange.answered}&rdquo;</p>
          </div>
        </div>

        <div className={styles.detail}>
          {ABOUT.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}

          <dl className={styles.facts}>
            {ABOUT.facts.map((fact) => (
              <div className={styles.fact} key={fact.label}>
                <dt className="mono">{fact.label}</dt>
                <dd className={styles.factValue}>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
