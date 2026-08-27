import { EDUCATION } from "@/lib/content";
import styles from "./Education.module.css";

/**
 * Three qualifications, newest first, on one horizontal rule — the engineering
 * foundation the rest of the page keeps referring back to, stated once and
 * plainly.
 *
 * Pointer vocabulary, shared with the rest of the paper half: the section
 * carries the spotlight (`data-spot`), each card leans toward the pointer
 * (`data-tilt`), and the node mark blooms on hover — the same mark the run uses
 * for a booked contact.
 */
export function Education() {
  return (
    <section
      className={`spot ${styles.education}`}
      id="education"
      data-spot
      aria-labelledby="education-heading"
    >
      <div className={styles.head} data-reveal data-reveal-children>
        <h2 className={styles.heading} id="education-heading">
          The engineering came first.
        </h2>
        <p className={styles.standfirst}>
          Newest first, down to the foundation diploma — the systems training the
          sales method is built on.
        </p>
      </div>

      <ol className={styles.list} data-reveal data-reveal-children>
        {EDUCATION.map((item, i) => (
          <li className={styles.item} key={item.institution} style={{ ["--i" as string]: i }}>
            <div className={styles.itemInner} data-tilt="5">
              <span className={styles.node} aria-hidden="true" />
              <p className={`mono ${styles.dates}`}>{item.dates}</p>
              <h3 className={styles.degree}>{item.degree}</h3>
              <p className={styles.institution}>{item.institution}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
