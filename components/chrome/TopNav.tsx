"use client";

/**
 * The page's chrome, replacing the cadence rail.
 *
 * Transparent while it sits over the hero photo, so the first screen is the
 * photograph and nothing else. Once the hero is behind us it takes a ground and
 * a hairline, because a transparent bar over a scrolling dossier is unreadable
 * about a third of the time and unreadable-sometimes is worse than always-there.
 */

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Brandmark } from "@/components/brand/Brandmark";
import { ThemeToggle } from "./ThemeToggle";
import { IDENTITY } from "@/lib/content";
import { scrollToId, subscribeScroll } from "@/lib/frontend/scroll-store";
import styles from "./TopNav.module.css";

// Homepage-qualified, so the bar works unchanged from an inner route like
// /schedule: "/#about" jumps home and scrolls; on "/" itself it's the same as
// "#about" since the pathname already matches.
const LINKS = [
  { label: "About", href: "/#about" },
  { label: "Lead generation", href: "/lead-generation" },
  { label: "Case studies", href: "/case-studies" },
  { label: "Hire me", href: "/hire" },
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

  // The wordmark is a plain <a href="/">, not a Next Link: a real reload
  // every time, not a client-side transition.
  //
  // Same reasoning below for in-page jumps: on "/" already, drive the jump
  // ourselves rather than trust native anchor scrolling across the world's
  // 7.4-viewport spacer.
  const jumpTo = (id: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
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
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- deliberate full reload, not a client-side transition */}
      <a className={styles.home} href="/" aria-label="Sampath Kumar, back to top">
        <Brandmark />
      </a>

      <nav className={styles.links} aria-label="Sections">
        <ul>
          {LINKS.map((link) => (
            <li key={link.label}>
              {link.href === IDENTITY.resume ? (
                <a className={styles.link} href={link.href}>
                  {link.label}
                </a>
              ) : (
                <Link
                  className={styles.link}
                  href={link.href}
                  onClick={link.href.startsWith("/#") ? jumpTo(link.href.slice(2)) : undefined}
                >
                  {link.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles.tail}>
        <ThemeToggle />
        <Link className={styles.cta} href="/schedule">
          Schedule a call
        </Link>
      </div>
    </header>
  );
}
