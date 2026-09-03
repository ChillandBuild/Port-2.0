import { ABOUT } from "@/lib/content";
import styles from "./Positioning.module.css";

export function Positioning() {
  return (
    <section className={`grained ${styles.section}`} id="about" aria-labelledby="about-heading">
      <div className={styles.grid}>
        <div className={styles.lead}>
          <div data-reveal data-reveal-tier="lift" data-reveal-children>
            <p className={`mono ${styles.eyebrow}`}>{ABOUT.eyebrow}</p>
            <h2 className={styles.heading} id="about-heading">
              {ABOUT.heading}
            </h2>
          </div>

          <p className={styles.stamp} data-reveal aria-hidden="true">
            <span className={styles.stampFigure}>{ABOUT.stamp}</span>
          </p>

          <div className={styles.exchange} data-reveal data-reveal-children>
            <p className={styles.asked}>&ldquo;{ABOUT.exchange.asked}&rdquo;</p>
            <p className={styles.answered}>&ldquo;{ABOUT.exchange.answered}&rdquo;</p>
          </div>
        </div>

        <div className={styles.detail}>
          <div className={styles.body} data-reveal data-reveal-children>
            {ABOUT.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <dl className={styles.facts} data-reveal data-reveal-tier="subtle" data-reveal-children>
            {ABOUT.facts.map((fact) => (
              <div className={styles.fact} key={fact.label}>
                <dt className="mono">{fact.label}</dt>
                <dd className={styles.factValue}>
                  <span className={styles.factDegree}>{fact.degree}</span>
                  <span className={styles.factSchool}>{fact.school}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
