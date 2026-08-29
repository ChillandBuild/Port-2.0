import { SCHEDULE } from "@/lib/content";
import styles from "./ScheduleAgenda.module.css";

/**
 * What the free call actually covers, published rather than hinted at. A buyer
 * deciding whether to give up 45 minutes wants to know what the 45 minutes
 * are — an ordered list is the honest answer, so this is an <ol>.
 */
export function ScheduleAgenda() {
  return (
    <section className={styles.section} aria-labelledby="schedule-agenda-heading">
      <div className={styles.head} data-reveal data-reveal-children>
        <p className={`mono ${styles.eyebrow}`}>{SCHEDULE.agenda.eyebrow}</p>
        <h2 className={styles.heading} id="schedule-agenda-heading">
          {SCHEDULE.agenda.heading}
        </h2>
        <p className={styles.body}>{SCHEDULE.agenda.body}</p>
      </div>

      <ol className={styles.items}>
        {SCHEDULE.agenda.items.map((item) => (
          <li className={styles.item} key={item.no} data-reveal>
            {/* The inner wrapper is not decorative: the hover-dim transition has
                to live off the data-reveal node. See ScheduleAgenda.module.css. */}
            <div className={styles.itemInner}>
              <p className={`mono ${styles.itemNo}`}>{item.no}</p>
              <h3 className={styles.itemName}>{item.name}</h3>
              <p className={styles.itemBody}>{item.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
