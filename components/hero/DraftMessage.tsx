import { DRAFT } from "@/lib/content";
import styles from "./DraftMessage.module.css";

/**
 * The signature element. A cold open he would actually send, sitting where a
 * portfolio would normally put a headshot — the work, not a picture of the worker.
 */
export function DraftMessage() {
  return (
    <div className={styles.wrap}>
      <article className={styles.message} aria-label="Sample cold outreach message">
        <div className={styles.head}>
          <span className="mono">{DRAFT.status}</span>
          <span className={`mono ${styles.tag}`}>{DRAFT.tag}</span>
        </div>

        <h2 className={styles.subject}>{DRAFT.subject}</h2>

        <div className={styles.body}>
          {DRAFT.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <div className={styles.signature}>
          <span className="mono">Sampath Kumar</span>
          <span className="mono">+91 99949 69699</span>
        </div>
      </article>

      <div className={styles.reply}>
        <span className="mono">{DRAFT.replyLabel}</span>
        <span className={`${styles.replyValue} tabular`}>{DRAFT.replyValue}</span>
      </div>
    </div>
  );
}
