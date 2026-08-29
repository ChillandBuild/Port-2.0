import { SCHEDULE } from "@/lib/content";
import styles from "./ScheduleAgenda.module.css";

/**
 * What the free call actually covers, published rather than hinted at. A buyer
 * deciding whether to give up 45 minutes wants to know what the 45 minutes
 * are — an ordered list is the honest answer, so this is an <ol>.
 *
 * The five questions are asked in order, and the connectors say so: a line
 * draws itself from one to the next as the section scrolls, sweeping back
 * through the gutter when the grid wraps to a new row. Driven by
 * components/motion/connectors.ts via the data-connector-* hooks below.
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

      {/* The <svg> is a sibling of the <ol>, not a child: <ol> only admits <li>.
          .ladder is the positioned coordinate space both share — connectors.ts
          sums offsets up the chain to reach it. 720 is the width at which the
          items stop being a single column and become a journey worth tracing. */}
      <div className={styles.ladder} data-connectors data-connectors-min="720">
        <ol className={styles.items}>
          {SCHEDULE.agenda.items.map((item) => (
            <li
              className={styles.item}
              key={item.no}
              data-connector-anchor
              /* The item is its own latch target: what lights on arrival is the
                 top rule, which is a ::before on this element. */
              data-connector-target
              data-reveal
            >
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

        {/* One connector per gap — connectors.ts refuses to build if this count
            and the anchor count ever disagree. */}
        <svg className={styles.connectors} aria-hidden="true" focusable="false">
          {SCHEDULE.agenda.items.slice(1).map((item) => (
            <g key={item.no}>
              <path className={styles.connectorPath} data-connector-path fill="none" />
              <circle className={styles.connectorDot} data-connector-dot r="4" />
            </g>
          ))}
        </svg>
      </div>
    </section>
  );
}
