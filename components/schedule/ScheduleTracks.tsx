import { SCHEDULE } from "@/lib/content";
import styles from "./ScheduleTracks.module.css";

/**
 * The fork after the setup call: pay per outcome, or bring the function
 * in-house on a monthly arrangement. Neither card publishes a rate for the part
 * that is negotiated per client — the commission and the monthly figure are
 * both set on the call, and inventing a number here would be worse than the
 * blank.
 */
export function ScheduleTracks() {
  return (
    <section className={styles.section} aria-labelledby="schedule-tracks-heading">
      <div className={styles.head} data-reveal data-reveal-children>
        <p className={`mono ${styles.eyebrow}`}>{SCHEDULE.tracks.eyebrow}</p>
        <h2 className={styles.heading} id="schedule-tracks-heading">
          {SCHEDULE.tracks.heading}
        </h2>
        <p className={styles.body}>{SCHEDULE.tracks.body}</p>
      </div>

      <ul className={styles.cards}>
        {SCHEDULE.tracks.items.map((track) => (
          <li
            className={`spot ${styles.card} ${track.featured ? styles.cardFeatured : ""}`}
            key={track.kind}
            data-spot
            data-reveal
          >
            <p className={`mono ${styles.kind}`}>{track.kind}</p>
            <h3 className={styles.name}>{track.name}</h3>
            <p className={`mono tabular ${styles.rate}`}>{track.rate}</p>
            <p className={styles.cardBody}>{track.body}</p>
            <ul className={styles.points}>
              {track.points.map((point) => (
                <li className={styles.point} key={point}>
                  {point}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  );
}
