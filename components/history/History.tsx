import { getRoles } from "@/lib/backend/site-content-loaders";
import { RoleGraphic } from "./RoleGraphic";
import { RoleSummary } from "./RoleSummary";
import styles from "./History.module.css";

/**
 * Seven years, most recent first, down a single spine that draws itself as the
 * reader passes it. A career is a sequence, so it reads vertically. Each role
 * carries the named employer, the responsibilities and the headline result.
 */
export async function History() {
  const ROLES = await getRoles();
  return (
    <section className={styles.history} id="history" aria-labelledby="history-heading">
      <div className={styles.head} data-reveal data-reveal-tier="lift" data-reveal-children>
        <h2 className={styles.heading} id="history-heading">
          Seven years of doing exactly this.
        </h2>
        <p className={styles.standfirst}>
          Global market specialist with deep expertise across the United States, United Kingdom, UAE, Singapore,
          Australia, Canada, and Europe — the employer, the work and the numbers, in order.
        </p>
      </div>

      <div className={styles.stage} data-history>
        <ol className={styles.list}>
          <span className={styles.spine} data-spine aria-hidden="true" />
          <span className={styles.spineHead} data-spine-head aria-hidden="true" />
          {ROLES.map((role) => (
            <li className={styles.role} key={role.company + role.dates} data-reveal data-history-role>
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

        <div className={styles.stageImages} aria-hidden="true">
          {ROLES.map((role, index) => (
            <RoleGraphic key={role.company + role.dates} index={index} total={ROLES.length} company={role.company} />
          ))}
        </div>
      </div>
    </section>
  );
}
