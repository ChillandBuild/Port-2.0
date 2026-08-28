import Link from "next/link";
import { CONTACT, WORK_PLAN } from "@/lib/content";
import styles from "./Terms.module.css";

/**
 * The offer, plainly. Two ways in: a performance-linked engagement where the
 * spend starts at tool cost, and a single paid session. Set small on purpose —
 * this is the part that has to read as terms rather than as a pitch.
 */
export function Terms() {
  return (
    <section className={styles.terms} id="terms" aria-labelledby="terms-heading">
      <div className={styles.head} data-reveal data-reveal-children>
        <h2 className={styles.heading} id="terms-heading">
          {WORK_PLAN.heading}
        </h2>
        <p className={styles.standfirst}>
          You control the spend, and the results arrive before the retainer does.
        </p>
      </div>

      <ol className={styles.steps}>
        {WORK_PLAN.steps.map((step) => (
          <li className={styles.step} key={step.no} data-reveal>
            <p className={`mono ${styles.stepNo}`}>Phase {step.no}</p>
            <h3 className={styles.stepName}>{step.name}</h3>
            <p className={styles.stepBody}>{step.description}</p>
          </li>
        ))}
      </ol>

      <div className={styles.session} data-reveal data-reveal-children>
        <h3 className={styles.sessionHeading}>Or book the hour.</h3>
        <p className={styles.sessionBody}>{CONTACT.body}</p>
        <dl className={styles.sessionTerms}>
          {CONTACT.terms.map((term) => (
            <div key={term.label}>
              <dt className="mono">{term.label}</dt>
              <dd className="tabular">{term.value}</dd>
            </div>
          ))}
        </dl>
        <p className={styles.note}>{CONTACT.note}</p>
        {/* The section states the offer; this is the one place on it that acts
            on that. It goes to /schedule rather than straight to LinkedIn so the
            free-call-then-paid-setup split is explained before anyone commits —
            the Reply section below keeps the direct LinkedIn route. */}
        <Link className={styles.cta} href="/schedule" data-magnet="0.22">
          Schedule a call <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
