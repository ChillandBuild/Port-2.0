"use client";

/**
 * The rotating "hello." — cycles through the markets he's sold into instead of
 * sitting on the one English word. Progressive enhancement: server and first
 * paint render the literal "hello." from the markup (matches the tagline
 * everywhere else on the site, zero hydration mismatch); only once mounted,
 * with motion allowed, does it start cycling — from India outward, in order.
 *
 * The market label rides underneath, absolutely positioned, so a longer or
 * shorter greeting never reflows the CTAs below it. One stable accessible
 * name lives on the parent `<h1>`; this slot itself is `aria-hidden` so a
 * screen reader hears the sentence once, not twelve greetings cycling under it.
 */

import { useEffect, useState } from "react";
import { GREETING_MS, GREETINGS } from "@/lib/content";
import { prefersReducedMotion } from "@/lib/scroll-store";
import styles from "./WorldStage.module.css";

export function Greeting() {
  const [index, setIndex] = useState<number | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    // Kick off on the next frame rather than synchronously in the effect body:
    // the first paint keeps the server-rendered "hello.", then cycling starts.
    let id: ReturnType<typeof setInterval> | undefined;
    const frame = requestAnimationFrame(() => {
      setIndex(0);
      id = setInterval(() => {
        setIndex((current) => ((current ?? 0) + 1) % GREETINGS.length);
      }, GREETING_MS);
    });
    return () => {
      cancelAnimationFrame(frame);
      if (id !== undefined) clearInterval(id);
    };
  }, []);

  if (index === null) {
    return <span>hello.</span>;
  }

  const { word, market } = GREETINGS[index];

  return (
    <span className={styles.greet} aria-hidden="true">
      <em key={word} className={styles.greetWord}>
        {word}
      </em>
      <span key={market} className={styles.greetMarket}>
        {market}
      </span>
    </span>
  );
}
