"use client";

/**
 * The page's chrome, replacing the cadence rail.
 *
 * A floating pill rather than an edge-to-edge bar. Transparent (outline only)
 * while it sits over the hero photo, so the first screen is the photograph
 * and nothing else; once the hero is behind us it takes a real ground and
 * shadow, because an outline-only pill over the scrolling dossier reads as
 * barely there. The ink swaps on the same trigger.
 *
 * Below 900px the pill collapses to logo + theme + a hamburger. The links
 * used to live only in the footer on mobile — deliberately, on the theory
 * that a page this short-labelled didn't earn a menu. That's reversed here:
 * a floating pill without a way to open it reads as broken chrome, so the
 * menu is back, staged through `motion`'s AnimatePresence.
 */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { Monogram } from "@/components/brand/Monogram";
import { ThemeToggle } from "./ThemeToggle";
import { IDENTITY } from "@/lib/content";
import { scrollToId, subscribeScroll, prefersReducedMotion } from "@/lib/frontend/scroll-store";
import styles from "./TopNav.module.css";

// Homepage-qualified, so the bar works unchanged from an inner route like
// /schedule: "/#about" jumps home and scrolls; on "/" itself it's the same as
// "#about" since the pathname already matches.
const LINKS = [
  { label: "About", href: "/#about" },
  { label: "Lead generation", href: "/lead-generation" },
  { label: "Case studies", href: "/case-studies" },
  { label: "Resume", href: IDENTITY.resume },
] as const;

interface TopNavProps {
  /** Inner pages have no world hero to sit transparently over, so they skip
   *  the scroll-triggered grounding and take their ground from the first
   *  pixel. */
  forceGrounded?: boolean;
}

export function TopNav({ forceGrounded = false }: TopNavProps) {
  const ref = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);

  // The open menu is a dialog over the page, not chrome — closing it on route
  // change stops a stale overlay from surviving an in-page jump. Adjusted
  // during render rather than in an effect: the close belongs to the same
  // commit as the new route, so the overlay never paints on the wrong page.
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }
  const reduced = prefersReducedMotion();

  // The wordmark is a plain <a href="/">, not a Next Link: a real reload
  // every time, not a client-side transition.
  //
  // Same reasoning below for in-page jumps: on "/" already, drive the jump
  // ourselves rather than trust native anchor scrolling across the world's
  // 7.4-viewport spacer.
  const jumpTo = (id: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    setOpen(false);
    if (pathname !== "/") return;
    event.preventDefault();
    scrollToId(id);
  };

  useEffect(() => {
    if (forceGrounded) return;
    const nav = ref.current;
    if (!nav) return;
    // The hero owns the first tenth of the world's travel; past that the bar
    // needs its own ground.
    return subscribeScroll((frame) => {
      const past = frame.world > 0.1 ? "true" : "false";
      if (nav.dataset.grounded !== past) nav.dataset.grounded = past;
    });
  }, [forceGrounded]);

  return (
    <header
      className={styles.nav}
      ref={ref}
      data-grounded={forceGrounded ? "true" : "false"}
    >
      <div className={styles.pill}>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- deliberate full reload, not a client-side transition */}
        <a className={styles.home} href="/" aria-label="Sampath Kumar, back to top">
          <Monogram className={styles.monogram} />
        </a>

        <nav className={styles.links} aria-label="Sections">
          <ul>
            {LINKS.map((link) => (
              <li key={link.label}>
                {link.href === IDENTITY.resume ? (
                  <motion.a
                    className={styles.link}
                    href={link.href}
                    whileHover={reduced ? undefined : { scale: 1.05 }}
                    whileTap={reduced ? undefined : { scale: 0.97 }}
                  >
                    {link.label}
                  </motion.a>
                ) : (
                  <Link
                    className={styles.link}
                    href={link.href}
                    onClick={link.href.startsWith("/#") ? jumpTo(link.href.slice(2)) : undefined}
                  >
                    <motion.span
                      className={styles.linkInner}
                      whileHover={reduced ? undefined : { scale: 1.05 }}
                      whileTap={reduced ? undefined : { scale: 0.97 }}
                    >
                      {link.label}
                    </motion.span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.tail}>
          <ThemeToggle />
          <motion.div whileHover={reduced ? undefined : { scale: 1.05 }} whileTap={reduced ? undefined : { scale: 0.97 }}>
            <Link className={styles.cta} href="/schedule">
              Schedule a call
            </Link>
          </motion.div>

          <motion.button
            className={styles.menuButton}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="top-nav-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            whileTap={reduced ? undefined : { scale: 0.9 }}
          >
            {open ? <X className={styles.menuIcon} /> : <Menu className={styles.menuIcon} />}
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="top-nav-menu"
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.2 }}
          >
            <ul className={styles.overlayLinks}>
              {LINKS.map((link, i) => (
                <motion.li
                  key={link.label}
                  initial={{ opacity: 0, y: reduced ? 0 : 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: reduced ? 0 : 12 }}
                  transition={{ duration: reduced ? 0 : 0.25, delay: reduced ? 0 : i * 0.05 }}
                >
                  {link.href === IDENTITY.resume ? (
                    <a className={styles.overlayLink} href={link.href} onClick={() => setOpen(false)}>
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      className={styles.overlayLink}
                      href={link.href}
                      onClick={link.href.startsWith("/#") ? jumpTo(link.href.slice(2)) : () => setOpen(false)}
                    >
                      {link.label}
                    </Link>
                  )}
                </motion.li>
              ))}
              <motion.li
                initial={{ opacity: 0, y: reduced ? 0 : 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduced ? 0 : 12 }}
                transition={{ duration: reduced ? 0 : 0.25, delay: reduced ? 0 : LINKS.length * 0.05 }}
              >
                <Link className={styles.overlayCta} href="/schedule" onClick={() => setOpen(false)}>
                  Schedule a call
                </Link>
              </motion.li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
