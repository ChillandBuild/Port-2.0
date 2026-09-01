import { CASE_STUDIES, ROLES } from "@/lib/content";
import styles from "./CaseStudies.module.css";

/**
 * The case studies themselves, rendered server-side and passed into the gate
 * as children. Each role is a case: the work, then the headline result, with
 * the employer named — the same ROLES the homepage history draws on.
 *
 * One client outcome leads, above the roles. It is a delivered engagement
 * rather than a job, so it gets its own card and links out to the full
 * breakdown instead of pretending to be a seventh role.
 */
export function CaseStudies() {
  const { featured } = CASE_STUDIES;

  return (
    <div className={styles.list}>
      <article className={`${styles.case} ${styles.featured}`}>
        <header className={styles.meta}>
          <p className={`mono ${styles.role}`}>{featured.label}</p>
          <p className={`mono ${styles.when}`}>{featured.meta}</p>
        </header>

        <h3 className={styles.featuredTitle}>{featured.title}</h3>
        <p className={styles.work}>{featured.body}</p>

        <a
          className={`mono ${styles.featuredLink}`}
          href={featured.url}
          target="_blank"
          rel="noreferrer noopener"
        >
          {featured.cta} <span aria-hidden="true">↗</span>
        </a>
      </article>

      {ROLES.map((role) => (
        <article className={styles.case} key={role.company + role.dates}>
          <header className={styles.meta}>
            <p className={`mono ${styles.role}`}>
              {role.title} · {role.company}
            </p>
            <p className={`mono ${styles.when}`}>
              {role.dates} · {role.place}
            </p>
          </header>

          <div className={styles.body}>
            <p className={`mono ${styles.label}`}>{CASE_STUDIES.workLabel}</p>
            <p className={styles.work}>{role.summary}</p>
          </div>

          <p className={styles.result}>
            <span className={`mono ${styles.label}`}>{CASE_STUDIES.resultLabel}</span>
            <span className={styles.resultValue}>{role.result}</span>
          </p>
        </article>
      ))}

      <p className={`mono ${styles.footnote}`}>{CASE_STUDIES.footnote}</p>
    </div>
  );
}