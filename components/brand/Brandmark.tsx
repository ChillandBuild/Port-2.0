import styles from "./Brandmark.module.css";

/**
 * The wordmark.
 *
 * There was a monogram here. It went because it was not earning its place: the
 * name is short, the nav has room for it in full, and a mark that needs
 * explaining is a mark that is not working.
 *
 * The full stop stays, and stays in the accent. It is his voice rather than
 * punctuation: "Every deal begins with hello."
 */

export function Brandmark({ className }: { className?: string }) {
  return (
    <span className={`${styles.wordmark} ${className ?? ""}`}>
      Sampath Kumar<span className={styles.stop}>.</span>
    </span>
  );
}
