import { Button } from "@/components/ui/Button";
import { CONTACT } from "@/lib/content";
import styles from "./ContactCta.module.css";

export function ContactCta() {
  return (
    <section className={styles.section} id="contact" aria-labelledby="contact-heading">
      <div className={styles.rail}>
        <span className="mono">{CONTACT.eyebrow}</span>
        <span className={`mono ${styles.aside}`}>One session · USD 350</span>
      </div>

      <div className={styles.grid}>
        <div className={styles.pitch}>
          <h2 className={styles.heading} id="contact-heading">
            {CONTACT.heading}
          </h2>
          <p className={styles.body}>{CONTACT.body}</p>

          <div className={styles.actions}>
            <Button href={CONTACT.primaryCta.href}>{CONTACT.primaryCta.label}</Button>
            <Button href={CONTACT.secondaryCta.href} variant="ghost">
              {CONTACT.secondaryCta.label}
            </Button>
          </div>
        </div>

        <div className={styles.terms}>
          <dl className={styles.list}>
            {CONTACT.terms.map((term) => (
              <div className={styles.term} key={term.label}>
                <dt className="mono">{term.label}</dt>
                <dd className={styles.termValue}>{term.value}</dd>
              </div>
            ))}
          </dl>
          <p className={styles.note}>{CONTACT.note}</p>
        </div>
      </div>
    </section>
  );
}
