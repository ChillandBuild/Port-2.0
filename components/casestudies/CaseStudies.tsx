import { CASE_STUDIES, CASE_STUDY_ENTRIES } from "@/lib/content";
import styles from "./CaseStudies.module.css";

/**
 * The case studies themselves, rendered server-side and passed into the gate
 * as children. Each entry is a company with four labeled blocks: what
 * happened, what was done, the problem faced, and how it was resolved.
 */
export function CaseStudies() {
  return (
    <div className={styles.list}>
      {CASE_STUDY_ENTRIES.map((entry) => (
        <article className={styles.case} key={entry.company}>
          <header className={styles.meta}>
            <p className={`mono ${styles.role}`}>{entry.company}</p>
          </header>

          <div className={styles.body}>
            <p className={`mono ${styles.label}`}>{CASE_STUDIES.whatHappenedLabel}</p>
            <p className={styles.work}>{entry.whatHappened}</p>
          </div>

          <div className={styles.body}>
            <p className={`mono ${styles.label}`}>{CASE_STUDIES.whatWasDoneLabel}</p>
            <p className={styles.work}>{entry.whatWasDone}</p>
          </div>

          <div className={styles.body}>
            <p className={`mono ${styles.label}`}>{CASE_STUDIES.problemLabel}</p>
            <p className={styles.work}>{entry.problem}</p>
          </div>

          <p className={styles.result}>
            <span className={`mono ${styles.label}`}>{CASE_STUDIES.resolutionLabel}</span>
            <span className={styles.resultValue}>{entry.resolution}</span>
          </p>
        </article>
      ))}

      <p className={`mono ${styles.footnote}`}>{CASE_STUDIES.footnote}</p>
    </div>
  );
}