import Link from "next/link";
import { IDENTITY } from "@/lib/content";
import styles from "./Reply.module.css";

/**
 * The close. The run that started in the world is totalled here and stops, and
 * the page arrives somewhere rather than trailing into a footer.
 */
export function Reply() {
  return (
    <section className={`spot ${styles.reply}`} id="contact" data-spot aria-labelledby="reply-heading">
      <div className={styles.inner}>
        <p className={`mono ${styles.kicker}`}>End of run</p>

        <h2 className={styles.heading} id="reply-heading">
          You just watched the whole thing run once.
          <br />
          <span className={styles.say}>Say hello and it runs for you.</span>
        </h2>

        <div className={styles.actions}>
          <a
            className={styles.primary}
            href={IDENTITY.linkedin}
            rel="noreferrer noopener"
            target="_blank"
            data-magnet="0.22"
          >
            Connect on LinkedIn
          </a>
          <Link className={styles.ghost} href="/schedule" data-magnet="0.22">
            Schedule a call
          </Link>
        </div>
      </div>
    </section>
  );
}
