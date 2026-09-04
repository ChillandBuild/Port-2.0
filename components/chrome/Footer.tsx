import Link from "next/link";
import { getFooterContent, getIdentity, type FooterGroup } from "@/lib/backend/site-content-loaders";
import styles from "./Footer.module.css";

/**
 * The colophon.
 *
 * Its own ground, deliberately: flat white against the themed page above, so
 * the close reads as a signature block rather than one more panel. Identity
 * rides left — the tagline with the name directly under it, one composed
 * signature — links right, and the fine print strip closes the page. Pressing
 * the name returns you to the first.
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

export async function Footer() {
  const [footer, identity] = await Promise.all([getFooterContent(), getIdentity()]);
  const contactGroup: FooterGroup = {
    title: "Contact",
    links: [
      { label: "LinkedIn", href: identity.linkedin },
      { label: identity.phone, href: identity.phoneHref },
    ],
  };
  const groups = [...footer.groups, contactGroup];

  return (
    <footer className={styles.footer}>
      <div className={styles.body} data-reveal data-reveal-children>
        <div className={styles.identity}>
          <p className={styles.tagline}>{identity.tagline}</p>
          <Link
            className={styles.wordmark}
            href="/#top"
            aria-label="Sampath Kumar — back to top"
          >
            {footer.wordmark}
            <span className={styles.stop}>.</span>
          </Link>
        </div>

        <nav className={styles.groups} aria-label="Footer">
          {groups.map((group) => (
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
        <p className={`mono ${styles.fine}`}>{footer.fineprint}</p>
        {/* Back to top moved out of here: it is the floating arrow now
            (BackToTop), mounted once in the layout so every page carries it,
            and the giant name above is also a way home. */}
      </div>
    </footer>
  );
}
