import { SectionHeader } from "@/components/ui/SectionHeader";
import { ROLES } from "@/lib/content";
import styles from "./TrackRecord.module.css";

export function TrackRecord() {
  return (
    <section className={styles.section} id="track-record" aria-labelledby="track-heading">
      <SectionHeader
        label="Re: where it happened"
        aside="6 roles · 2020 — 2025"
        heading="Track record, most recent first."
        id="track-heading"
      />

      <ol className={styles.roles}>
        {ROLES.map((role) => (
          <li className={styles.role} key={`${role.client}-${role.dates}`}>
            <div className={styles.when}>
              <span className={`mono ${styles.dates}`}>{role.dates}</span>
              <span className={`mono ${styles.place}`}>{role.place}</span>
            </div>

            <div className={styles.what}>
              <h3 className={styles.title}>
                {role.title}
                <span className={styles.client}> · {role.client}</span>
              </h3>
              <p className={styles.summary}>{role.summary}</p>
            </div>

            <p className={`mono ${styles.result}`}>{role.result}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
