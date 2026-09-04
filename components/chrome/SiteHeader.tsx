import { NAV } from "@/lib/content";
import { getIdentity } from "@/lib/backend/site-content-loaders";
import styles from "./SiteHeader.module.css";

export async function SiteHeader() {
  const identity = await getIdentity();
  return (
    <header className={styles.header}>
      <a className={styles.wordmark} href="#top">
        {identity.name}
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
