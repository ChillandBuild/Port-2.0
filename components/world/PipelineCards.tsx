"use client";

/**
 * Pipeline Cards — glassmorphism card grid for the 8 pipeline stages.
 *
 * Appears between the world landing and Proof as a visual payoff: the world
 * runs through the pipeline as text gates, and this section shows the same
 * eight stages as illustrated cards on the paper surface.
 */

import { useRef, useEffect, useState, type JSX } from "react";
import { PIPELINE } from "@/lib/content";
import { prefersReducedMotion } from "@/lib/scroll-store";
import { subscribeTheme } from "@/lib/theme";
import styles from "./PipelineCards.module.css";

/** SVG illustrations — one per pipeline stage. Kept as inline JSX so they
 *  inherit --accent-soft from the document and adapt to both themes. */
const ILLUSTRATIONS: ((props: { cls: string }) => JSX.Element)[] = [
  // 01 — Target rings (ICP)
  ({ cls }) => (
    <svg className={cls} viewBox="0 0 200 200" fill="none" aria-hidden="true">
      <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="0.8" opacity="0.2" />
      <circle cx="100" cy="100" r="55" stroke="currentColor" strokeWidth="1" opacity="0.35" />
      <circle cx="100" cy="100" r="32" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      <circle cx="100" cy="100" r="12" stroke="currentColor" strokeWidth="2" opacity="0.7" />
      <circle cx="100" cy="100" r="4" fill="currentColor" opacity="0.9" />
      <line x1="100" y1="15" x2="100" y2="65" stroke="currentColor" strokeWidth="0.5" opacity="0.15" strokeDasharray="3 4" />
      <line x1="100" y1="135" x2="100" y2="185" stroke="currentColor" strokeWidth="0.5" opacity="0.15" strokeDasharray="3 4" />
      <line x1="15" y1="100" x2="65" y2="100" stroke="currentColor" strokeWidth="0.5" opacity="0.15" strokeDasharray="3 4" />
      <line x1="135" y1="100" x2="185" y2="100" stroke="currentColor" strokeWidth="0.5" opacity="0.15" strokeDasharray="3 4" />
    </svg>
  ),

  // 02 — Magnifying glass (Research)
  ({ cls }) => (
    <svg className={cls} viewBox="0 0 200 180" fill="none" aria-hidden="true">
      <circle cx="85" cy="75" r="42" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      <circle cx="85" cy="75" r="28" stroke="currentColor" strokeWidth="0.8" opacity="0.25" />
      <line x1="115" y1="105" x2="160" y2="150" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.45" />
      <line x1="68" y1="62" x2="102" y2="62" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
      <line x1="68" y1="75" x2="100" y2="75" stroke="currentColor" strokeWidth="0.8" opacity="0.25" />
      <line x1="68" y1="88" x2="96" y2="88" stroke="currentColor" strokeWidth="0.8" opacity="0.2" />
      <circle cx="85" cy="75" r="3" fill="currentColor" opacity="0.4" />
    </svg>
  ),

  // 03 — Network nodes (Prospect)
  ({ cls }) => (
    <svg className={cls} viewBox="0 0 200 160" fill="none" aria-hidden="true">
      <circle cx="100" cy="80" r="10" fill="currentColor" opacity="0.5" />
      <circle cx="40" cy="40" r="6" fill="currentColor" opacity="0.3" />
      <circle cx="160" cy="40" r="6" fill="currentColor" opacity="0.3" />
      <circle cx="45" cy="125" r="5" fill="currentColor" opacity="0.25" />
      <circle cx="155" cy="125" r="5" fill="currentColor" opacity="0.25" />
      <circle cx="20" cy="80" r="4" fill="currentColor" opacity="0.15" />
      <circle cx="180" cy="80" r="4" fill="currentColor" opacity="0.15" />
      <line x1="100" y1="80" x2="40" y2="40" stroke="currentColor" strokeWidth="0.8" opacity="0.25" />
      <line x1="100" y1="80" x2="160" y2="40" stroke="currentColor" strokeWidth="0.8" opacity="0.25" />
      <line x1="100" y1="80" x2="45" y2="125" stroke="currentColor" strokeWidth="0.8" opacity="0.2" />
      <line x1="100" y1="80" x2="155" y2="125" stroke="currentColor" strokeWidth="0.8" opacity="0.2" />
      <line x1="40" y1="40" x2="20" y2="80" stroke="currentColor" strokeWidth="0.5" opacity="0.12" />
      <line x1="160" y1="40" x2="180" y2="80" stroke="currentColor" strokeWidth="0.5" opacity="0.12" />
    </svg>
  ),

  // 04 — Paper plane + signal waves (Outreach)
  ({ cls }) => (
    <svg className={cls} viewBox="0 0 200 200" fill="none" aria-hidden="true">
      <path d="M30 170 L170 40 L130 180 L110 100 Z" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
      <path d="M170 40 L130 180" stroke="currentColor" strokeWidth="0.8" opacity="0.25" />
      <circle cx="170" cy="40" r="18" stroke="currentColor" strokeWidth="0.8" opacity="0.15" />
      <circle cx="170" cy="40" r="36" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
      <circle cx="170" cy="40" r="54" stroke="currentColor" strokeWidth="0.5" opacity="0.06" />
      <circle cx="165" cy="32" r="2" fill="currentColor" opacity="0.3" />
    </svg>
  ),

  // 05 — Filter funnel + check (Qualify)
  ({ cls }) => (
    <svg className={cls} viewBox="0 0 200 160" fill="none" aria-hidden="true">
      <path d="M25 30 L175 30 L125 100 L75 100 Z" stroke="currentColor" strokeWidth="1.5" opacity="0.35" />
      <line x1="75" y1="100" x2="75" y2="130" stroke="currentColor" strokeWidth="2" opacity="0.4" />
      <line x1="125" y1="100" x2="125" y2="130" stroke="currentColor" strokeWidth="2" opacity="0.4" />
      <line x1="75" y1="130" x2="125" y2="130" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <path d="M92 50 L100 62 L120 38" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
    </svg>
  ),

  // 06 — Calendar + check (Meeting)
  ({ cls }) => (
    <svg className={cls} viewBox="0 0 200 160" fill="none" aria-hidden="true">
      <rect x="35" y="30" width="130" height="110" rx="10" stroke="currentColor" strokeWidth="1.5" opacity="0.35" />
      <line x1="35" y1="60" x2="165" y2="60" stroke="currentColor" strokeWidth="0.8" opacity="0.25" />
      <line x1="68" y1="18" x2="68" y2="42" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.35" />
      <line x1="132" y1="18" x2="132" y2="42" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.35" />
      <circle cx="100" cy="95" r="14" stroke="currentColor" strokeWidth="1.5" opacity="0.45" />
      <path d="M93 95 L98 101 L108 87" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.55" />
    </svg>
  ),

  // 07 — Flow chart (Pipeline)
  ({ cls }) => (
    <svg className={cls} viewBox="0 0 200 200" fill="none" aria-hidden="true">
      <rect x="15" y="15" width="70" height="40" rx="8" stroke="currentColor" strokeWidth="1.5" opacity="0.35" />
      <rect x="115" y="15" width="70" height="40" rx="8" stroke="currentColor" strokeWidth="1.5" opacity="0.35" />
      <rect x="65" y="80" width="70" height="40" rx="8" stroke="currentColor" strokeWidth="1.5" opacity="0.45" />
      <rect x="15" y="145" width="70" height="40" rx="8" stroke="currentColor" strokeWidth="1.5" opacity="0.25" />
      <rect x="115" y="145" width="70" height="40" rx="8" stroke="currentColor" strokeWidth="1.5" opacity="0.25" />
      <path d="M50 55 L100 80" stroke="currentColor" strokeWidth="0.8" opacity="0.2" />
      <path d="M150 55 L100 80" stroke="currentColor" strokeWidth="0.8" opacity="0.2" />
      <path d="M85 120 L50 145" stroke="currentColor" strokeWidth="0.8" opacity="0.18" />
      <path d="M115 120 L150 145" stroke="currentColor" strokeWidth="0.8" opacity="0.18" />
      <circle cx="50" cy="35" r="4" fill="currentColor" opacity="0.35" />
      <circle cx="150" cy="35" r="4" fill="currentColor" opacity="0.35" />
      <circle cx="100" cy="100" r="5" fill="currentColor" opacity="0.45" />
    </svg>
  ),

  // 08 — Rising chart (Growth)
  ({ cls }) => (
    <svg className={cls} viewBox="0 0 200 160" fill="none" aria-hidden="true">
      <polyline points="20,130 55,105 85,112 120,65 155,48 185,18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
      <circle cx="185" cy="18" r="6" fill="currentColor" opacity="0.6" />
      <line x1="20" y1="130" x2="195" y2="130" stroke="currentColor" strokeWidth="0.5" opacity="0.15" />
      <line x1="20" y1="90" x2="195" y2="90" stroke="currentColor" strokeWidth="0.5" opacity="0.08" />
      <line x1="20" y1="50" x2="195" y2="50" stroke="currentColor" strokeWidth="0.5" opacity="0.08" />
      <path d="M175 28 L185 18 L180 32" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
    </svg>
  ),
];

export function PipelineCards() {
  const ref = useRef<HTMLDivElement>(null);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.dataset.theme === "dark");
    check();
    const unsub = subscribeTheme(check);
    return unsub;
  }, []);

  return (
    <section
      className={`${styles.section} ${isDark ? styles.dark : styles.light}`}
      ref={ref}
      aria-labelledby="pipeline-cards-heading"
    >
      <div className={styles.gridBg} aria-hidden="true" />

      <header className={styles.header}>
        <p className={`mono ${styles.eyebrow}`}>The engine</p>
        <h2 className={styles.heading} id="pipeline-cards-heading">
          Eight stages. In order.
        </h2>
        <p className={styles.body}>
          Each depends on the one before it. The pipeline runs from first name to
          booked meeting — no shortcuts, no skipped steps.
        </p>
      </header>

      <div className={styles.masonry}>
        {PIPELINE.map((stage, i) => {
          const Illustration = ILLUSTRATIONS[i];
          const isTall = i === 0 || i === 3 || i === 6;
          return (
            <article
              key={stage.no}
              className={`${styles.card} ${isTall ? styles.tall : ""}`}
            >
              <div className={styles.visual}>
                <Illustration cls={styles.icon} />
              </div>
              <p className={`mono ${styles.cardEyebrow}`}>Stage {stage.no}</p>
              <h3 className={styles.cardTitle}>{stage.name}</h3>
              <p className={styles.cardDesc}>{stage.description}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
