import { FOOTER, IDENTITY } from "@/lib/content";
import styles from "./Footer.module.css";

/**
 * Deliberately thin. The page already resolves in the reply section above; a
 * footer that restates the pitch would overwrite the ending rather than follow
 * it, so this carries the legal links and nothing else.
 */
export function Footer() {
  return (
    <footer className={styles.footer}>
      <nav className={styles.sections} aria-label="Sections">
        <ul>
          <li>
            <a className={`mono ${styles.link}`} href="#run">
              Method
            </a>
          </li>
          <li>
            <a className={`mono ${styles.link}`} href="#proof">
              Results
            </a>
          </li>
          <li>
            <a className={`mono ${styles.link}`} href="#history">
              Experience
            </a>
          </li>
          <li>
            <a className={`mono ${styles.link}`} href="#range">
              Range
            </a>
          </li>
          <li>
            <a className={`mono ${styles.link}`} href={IDENTITY.resume}>
              Résumé
            </a>
          </li>
        </ul>
      </nav>

      <div className={styles.top}>
        <p className={styles.wordmark}>{FOOTER.wordmark}</p>
        <ul className={styles.links}>
          {FOOTER.links.map((link) => (
            <li key={link.href}>
              <a className={`mono ${styles.link}`} href={link.href}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.bottom}>
        <p className={`mono ${styles.fine}`}>{FOOTER.fineprint}</p>
        <a className={`mono ${styles.link}`} href={IDENTITY.phoneHref}>
          {IDENTITY.phone}
        </a>
      </div>
    </footer>
  );
}
