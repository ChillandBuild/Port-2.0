import Link from "next/link";
import { HERO, HIRE, IDENTITY } from "@/lib/content";
import styles from "./RecruiterCard.module.css";

/**
 * Block 1: the 8-second answer. Everything a recruiter needs before they
 * scroll — name, role, location, three stats, tools, résumé — because a DM
 * reader never reaches a scroll story's numbers on their own.
 */
export function RecruiterCard() {
  return (
    <section className={styles.card} aria-labelledby="hire-card-title" data-reveal>
      <Link className={styles.back} href="/">
        <span aria-hidden="true">←</span> Home
      </Link>

      <p className={`mono ${styles.eyebrow}`}>{HIRE.card.eyebrow}</p>
      <h1 className={styles.title} id="hire-card-title">
        {IDENTITY.name}
      </h1>
      <p className={styles.role}>{IDENTITY.role}</p>
      <p className={styles.meta}>{HIRE.card.timezone}</p>
      <p className={styles.meta}>{HIRE.card.availability}</p>

      <dl className={styles.stats}>
        {HERO.stats.map((stat) => (
          <div className={styles.stat} key={stat.label}>
            <dt className={`tabular ${styles.statValue}`}>{stat.value}</dt>
            <dd className={styles.statLabel}>{stat.label}</dd>
          </div>
        ))}
      </dl>

      <p className={`mono ${styles.stackNote}`}>{HIRE.card.stackNote}</p>

      <div className={styles.actions}>
        <a className={styles.primary} href={HIRE.card.resumeCta.href}>
          {HIRE.card.resumeCta.label}
        </a>
        <a
          className={styles.ghost}
          href={HIRE.card.contactCta.href}
          target="_blank"
          rel="noreferrer noopener"
        >
          {HIRE.card.contactCta.label}
        </a>
      </div>
    </section>
  );
}
