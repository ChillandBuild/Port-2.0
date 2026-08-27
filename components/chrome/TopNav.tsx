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
import { Brandmark } from "@/components/brand/Brandmark";
import { ThemeToggle } from "./ThemeToggle";
import { IDENTITY } from "@/lib/content";
import { subscribeScroll } from "@/lib/scroll-store";
import styles from "./TopNav.module.css";

const LINKS = [
  { label: "Method", href: "#run" },
  { label: "Results", href: "#proof" },
  { label: "Résumé", href: IDENTITY.resume },
] as const;

export function TopNav() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const nav = ref.current;
    if (!nav) return;
    // The hero owns the first tenth of the world's travel; past that the bar
    // needs its own ground.
    return subscribeScroll((frame) => {
      const past = frame.world > 0.1 ? "true" : "false";
      if (nav.dataset.grounded !== past) nav.dataset.grounded = past;
    });
  }, []);

  return (
    <header className={styles.nav} ref={ref} data-grounded="false">
      <a className={styles.home} href="#top" aria-label="Sampath Kumar, back to top">
        <Brandmark />
      </a>

      <nav className={styles.links} aria-label="Sections">
        <ul>
          {LINKS.map((link) => (
            <li key={link.label}>
              <a className={styles.link} href={link.href}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles.tail}>
        <ThemeToggle />
        <a className={styles.cta} href="#contact">
          Get in touch
        </a>
      </div>
    </header>
  );
}
