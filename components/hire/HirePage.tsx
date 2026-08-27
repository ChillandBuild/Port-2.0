import Link from "next/link";
import { HIRE, IDENTITY, LEDGER, TOOL_GROUPS } from "@/lib/content";
import { LaneProvider } from "./LaneContext";
import { LaneToggle } from "./LaneToggle";
import { RecruiterCard } from "./RecruiterCard";
import { Teardown } from "./Teardown";
import { HireCaptureForm } from "./HireCaptureForm";
import { MoneyFit } from "./MoneyFit";
import styles from "./HirePage.module.css";

/**
 * The /hire page. Nine blocks: recruiter card, lane toggle, teardown,
 * capture form, money & fit, tool stack, results, deeper proof, contact.
 * Blocks 2–5 share lane state through LaneProvider; 6–9 reuse the same typed
 * content the rest of the site draws on (TOOL_GROUPS, LEDGER) so this page
 * cannot drift from them.
 */
export function HirePage() {
  return (
    <>
      <RecruiterCard />

      <LaneProvider>
        <LaneToggle />
        <Teardown />
        <HireCaptureForm />
        <MoneyFit />
      </LaneProvider>

      <section className={styles.stack} aria-labelledby="hire-stack" data-reveal>
        <p className={`mono ${styles.eyebrow}`}>{HIRE.stackIntro.eyebrow}</p>
        <h2 className={styles.sectionHeading} id="hire-stack">
          {HIRE.stackIntro.heading}
        </h2>
        <div className={styles.groups}>
          {TOOL_GROUPS.map((group) => (
            <div className={styles.group} key={group.name}>
              <h3 className={styles.groupName}>{group.name}</h3>
              <p className={styles.groupTools}>{group.tools.join(" · ")}</p>
              <p className={styles.groupBody}>{group.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.results} aria-labelledby="hire-results" data-reveal>
        <p className={`mono ${styles.eyebrow}`}>{HIRE.resultsIntro.eyebrow}</p>
        <h2 className={styles.sectionHeading} id="hire-results">
          {HIRE.resultsIntro.heading}
        </h2>
        <dl className={styles.ledger}>
          {LEDGER.map((row) => (
            <div className={styles.ledgerRow} key={row.label}>
              <dt className={`tabular ${styles.ledgerValue}`}>{row.value}</dt>
              <dd className={styles.ledgerLabel}>
                {row.label}
                <span className={styles.ledgerSource}>{row.source}</span>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className={styles.proof} aria-labelledby="hire-proof" data-reveal>
        <p className={`mono ${styles.eyebrow}`}>{HIRE.proofLink.eyebrow}</p>
        <h2 className={styles.sectionHeading} id="hire-proof">
          {HIRE.proofLink.heading}
        </h2>
        <p className={styles.sectionBody}>{HIRE.proofLink.body}</p>
        <Link className={styles.proofLink} href={HIRE.proofLink.cta.href}>
          {HIRE.proofLink.cta.label} <span aria-hidden="true">→</span>
        </Link>
      </section>

      <section className={styles.cta} aria-labelledby="hire-cta">
        <h2 className={styles.ctaHeading} id="hire-cta">
          {HIRE.contact.heading}
        </h2>
        <p className={styles.ctaBody}>{HIRE.contact.body}</p>
        <div className={styles.ctaActions}>
          <a className={styles.primary} href={IDENTITY.phoneHref}>
            Call {IDENTITY.phone}
          </a>
          <a
            className={styles.ghost}
            href={IDENTITY.linkedin}
            target="_blank"
            rel="noreferrer noopener"
          >
            Connect on LinkedIn
          </a>
        </div>
      </section>
    </>
  );
}
