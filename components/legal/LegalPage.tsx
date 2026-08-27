import Link from "next/link";
import { IDENTITY, LEGAL_CONTACT, type LegalDoc } from "@/lib/content";
import styles from "./LegalPage.module.css";

/**
 * The legal document. One component renders /terms, /privacy and /refunds so
 * the three pages cannot drift apart in structure or chrome.
 *
 * Deliberately still — a policy is a document, not a scroll story. The "Re:"
 * eyebrow keeps the site's message-field framing, and the close reuses the same
 * two contact channels every page on the site points at.
 */
export function LegalPage({ doc }: { doc: LegalDoc }) {
  return (
    <article className={styles.page} aria-labelledby="legal-title">
      <Link className={styles.back} href="/">
        <span aria-hidden="true">←</span> Home
      </Link>

      <p className={`mono ${styles.eyebrow}`}>{doc.eyebrow}</p>

      <h1 className={styles.title} id="legal-title">
        {doc.title}
      </h1>

      <p className={`mono ${styles.updated}`}>{doc.updated}</p>

      <div className={styles.sections}>
        {doc.sections.map((section) => (
          <section className={styles.section} key={section.heading}>
            <h2 className={styles.sectionHeading}>{section.heading}</h2>
            {section.body.map((para, i) => (
              <p className={styles.body} key={i}>
                {para}
              </p>
            ))}
          </section>
        ))}
      </div>

      <footer className={styles.contact}>
        <p className={`mono ${styles.contactEyebrow}`}>{LEGAL_CONTACT.eyebrow}</p>
        <p className={styles.contactBody}>{LEGAL_CONTACT.body}</p>
        <div className={styles.actions}>
          <a
            className={styles.link}
            href={IDENTITY.linkedin}
            target="_blank"
            rel="noreferrer noopener"
          >
            {LEGAL_CONTACT.linkedinLabel} <span aria-hidden="true">→</span>
          </a>
          <a className={styles.link} href={IDENTITY.phoneHref}>
            {LEGAL_CONTACT.phoneLabel}
          </a>
        </div>
      </footer>
    </article>
  );
}
