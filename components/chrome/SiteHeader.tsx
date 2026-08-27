import { IDENTITY, NAV } from "@/lib/content";
import styles from "./SiteHeader.module.css";

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <a className={styles.wordmark} href="#top">
        {IDENTITY.name}
      </a>

      <nav aria-label="Main navigation">
        <ul className={styles.nav}>
          {NAV.map((item) => (
            <li key={item.label}>
              <a className={`mono ${styles.link}`} href={item.href}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
