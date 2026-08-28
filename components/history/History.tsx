import { ROLES } from "@/lib/content";
import { RoleSummary } from "./RoleSummary";
import styles from "./History.module.css";

/**
 * Seven years, most recent first, down a single spine that draws itself as the
 * reader passes it. A career is a sequence, so it reads vertically. Each role
 * carries the named employer, the responsibilities and the headline result.
 */
export function History() {
  return (
    <section className={styles.history} id="history" aria-labelledby="history-heading">
      <div className={styles.head} data-reveal data-reveal-children>
        <h2 className={styles.heading} id="history-heading">
          Seven years of doing exactly this.
        </h2>
        <p className={styles.standfirst}>
          Global reach across the United States, United Kingdom, UAE, Singapore,
          Australia and Canada — the employer, the work and the numbers, in order.
        </p>
      </div>

      <ol className={styles.list}>
        <span className={styles.spine} data-spine aria-hidden="true" />
        {ROLES.map((role) => (
          <li className={styles.role} key={role.company + role.dates} data-reveal>
            <p className={`mono ${styles.dates}`}>{role.dates}</p>
            <div className={styles.detail}>
              <h3 className={styles.title}>{role.title}</h3>
              <p className={`mono ${styles.place}`}>
                {role.company} · {role.place}
              </p>
              <RoleSummary items={role.summary} />
              <p className={styles.result}>{role.result}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
