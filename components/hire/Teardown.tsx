import { HIRE, TEARDOWN } from "@/lib/content";
import styles from "./Teardown.module.css";

/**
 * Block 3: the centrepiece. His method applied in full to a real,
 * recognisable company — the "past work sample" a recruiter's post actually
 * asks for, without a real client's data anywhere on the page. The
 * disclaimer renders first and stays visible; nothing here claims real work
 * done for the named brand.
 */
export function Teardown() {
  return (
    <section className={styles.section} aria-labelledby="teardown-heading" data-reveal>
      <p className={`mono ${styles.eyebrow}`}>{HIRE.teardownIntro.eyebrow}</p>
      <h2 className={styles.introHeading}>{HIRE.teardownIntro.heading}</h2>
      <p className={styles.introBody}>{HIRE.teardownIntro.body}</p>

      <div className={styles.panel}>
        <p className={styles.disclaimer} role="note">
          {TEARDOWN.disclaimer}
        </p>

        <p className={`mono ${styles.eyebrow}`}>{TEARDOWN.eyebrow}</p>
        <h3 className={styles.heading} id="teardown-heading">
          {TEARDOWN.heading}
        </h3>
        <p className={styles.lede}>{TEARDOWN.lede}</p>

        <div className={styles.sections}>
          {TEARDOWN.sections.map((section) => (
            <article className={styles.item} key={section.key}>
              <h4 className={styles.itemLabel}>{section.label}</h4>

              {section.body?.map((para) => (
                <p className={styles.itemBody} key={para}>
                  {para}
                </p>
              ))}

              {section.bullets ? (
                <ul className={styles.bullets}>
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              ) : null}

              {section.subject ? (
                <p className={`mono ${styles.subject}`}>&ldquo;{section.subject}&rdquo;</p>
              ) : null}

              {section.stats ? (
                <dl className={styles.numbers}>
                  {section.stats.map((stat) => (
                    <div className={styles.numberRow} key={stat.label}>
                      <dt className={`tabular ${styles.numberValue}`}>{stat.value}</dt>
                      <dd className={styles.numberLabel}>{stat.label}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}

              {section.note ? <p className={styles.itemNote}>{section.note}</p> : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
