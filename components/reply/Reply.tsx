import Link from "next/link";
import { IDENTITY } from "@/lib/content";
import styles from "./Reply.module.css";

const SAY_WORDS = "Say hello and it runs for you.".split(" ");

/**
 * The close. The run that started in the world is totalled here and stops, and
 * the page arrives somewhere rather than trailing into a footer.
 */
export function Reply() {
  return (
    <section className={`spot grained ${styles.reply}`} id="contact" data-spot aria-labelledby="reply-heading">
      <div className={styles.inner}>
        <div className={styles.lead}>
          <p className={`mono ${styles.kicker}`} data-reveal data-reveal-tier="subtle">
            End of run
          </p>

          <h2 className={styles.heading} id="reply-heading" data-reveal data-reveal-tier="lift">
            You just watched the whole thing run once.
            <br />
            <span className={styles.say} data-reveal data-reveal-tier="subtle" data-reveal-children>
              {SAY_WORDS.map((word, i) => (
                <span className={styles.sayWord} key={word + i}>
                  {word}
                  {i < SAY_WORDS.length - 1 ? " " : ""}
                </span>
              ))}
            </span>
          </h2>

          <div className={styles.actions} data-reveal data-reveal-children>
            <a
              className={styles.primary}
              href={IDENTITY.linkedin}
              rel="noreferrer noopener"
              target="_blank"
              data-magnet="0.22"
            >
              Connect on LinkedIn
            </a>
            <Link className={styles.primary} href="/schedule" data-magnet="0.22">
              Schedule a call
            </Link>
          </div>
        </div>

        {/* The right half of the close was empty at every width above 900px.
            The card is the return address the two buttons imply — the same four
            facts the envelope rail opens the page with, closing it. Reachable
            in its own right (the phone dials), so it is content, not filler. */}
        <aside
          className={styles.card}
          data-reveal
          data-reveal-children
          data-tilt="3.5"
          aria-label="Direct contact"
        >
          <p className={`mono ${styles.cardLabel}`}>Reply to</p>
          <p className={styles.cardName}>{IDENTITY.name}</p>
          <p className={`mono ${styles.cardRole}`}>{IDENTITY.role}</p>
          <dl className={styles.meta}>
            <div className={styles.metaRow}>
              <dt className="mono">Based</dt>
              <dd>{IDENTITY.location}</dd>
            </div>
            <div className={styles.metaRow}>
              <dt className="mono">Direct</dt>
              <dd>
                <a className={styles.metaLink} href={IDENTITY.phoneHref}>
                  {IDENTITY.phone}
                </a>
              </dd>
            </div>
            <div className={styles.metaRow}>
              <dt className="mono">Telegram</dt>
              <dd>
                <a className={styles.metaLink} href={IDENTITY.telegram} rel="noreferrer noopener" target="_blank">
                  Message on Telegram
                </a>
              </dd>
            </div>
            <div className={styles.metaRow}>
              <dt className="mono">Email</dt>
              <dd>
                {IDENTITY.email ? (
                  <a className={styles.metaLink} href={IDENTITY.emailHref}>
                    {IDENTITY.email}
                  </a>
                ) : (
                  // Placeholder keeps the row's height until the address lands.
                  <span className={styles.metaPending}>—</span>
                )}
              </dd>
            </div>
          </dl>
        </aside>
      </div>
    </section>
  );
}
