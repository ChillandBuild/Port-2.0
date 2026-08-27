import Link from "next/link";
import { FOOTER } from "@/lib/content";
import styles from "./Footer.module.css";

/**
 * The colophon.
 *
 * Its own ground, deliberately: flat white against the themed page above, so
 * the close reads as a signature block rather than one more panel. Identity
 * rides left, links right, and the wordmark closes the page as a full-width
 * banner that drifts with the scroll — the last thing on the page is the name,
 * and pressing it returns you to the first.
 */

function footerLink(link: { label: string; href: string }): React.ReactNode {
  const { label, href } = link;
  const external = href.startsWith("http");
  if (external) {
    return (
      <a className={styles.link} href={href} target="_blank" rel="noreferrer noopener">
        {label} <span className={styles.arrow} aria-hidden="true">↗</span>
      </a>
    );
  }
  if (href.startsWith("tel:") || href.endsWith(".pdf")) {
    return (
      <a className={styles.link} href={href}>
        {label}
      </a>
    );
  }
  return (
    <Link className={styles.link} href={href}>
      {label}
    </Link>
  );
}

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.body} data-reveal data-reveal-children>
        <div className={styles.identity}>
          <p className={styles.tagline}>{FOOTER.tagline}</p>
        </div>

        <nav className={styles.groups} aria-label="Footer">
          {FOOTER.groups.map((group) => (
            <div className={styles.group} key={group.title}>
              <p className={`mono ${styles.groupTitle}`}>{group.title}</p>
              <ul>
                {group.links.map((link) => (
                  <li key={link.label}>{footerLink(link)}</li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className={styles.bottom} data-reveal>
        <p className={`mono ${styles.fine}`}>{FOOTER.fineprint}</p>
        {/* Same-page anchor, not a router link: it scrolls whichever page you
            are on, and every page carries its own #top. */}
        <a className={styles.back} href="#top">
          {FOOTER.backToTop} <span aria-hidden="true">↑</span>
        </a>
      </div>

      <Link
        className={styles.wordmark}
        href="/#top"
        data-drift
        aria-label="Sampath Kumar — back to top"
      >
        {FOOTER.wordmark}
        <span className={styles.stop}>.</span>
      </Link>
    </footer>
  );
}
