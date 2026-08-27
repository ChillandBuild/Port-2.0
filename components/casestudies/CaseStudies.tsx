import { CASE_STUDIES, ROLES } from "@/lib/content";
import styles from "./CaseStudies.module.css";

/**
 * The case studies themselves, rendered server-side and passed into the gate
 * as children. Each role is a case: the work, then the headline result, with
 * the employer named — the same ROLES the homepage history draws on.
 */
export function CaseStudies() {
  return (
    <div className={styles.list}>
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