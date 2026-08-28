"use client";

/**
 * The way home, floating.
 *
 * Bottom-left corner — the deliberate mirror of the chat dock, which owns the
 * bottom-right — so the two fixed elements can never collide at any viewport
 * size. It stays out of the way until the page has actually travelled, then
 * fades in and carries you back to the top. Replaces the footer's text link,
 * which it outlives: the footer is shared chrome, and so is this.
 */

import { useEffect, useState } from "react";
import { prefersReducedMotion } from "@/lib/scroll-store";
import styles from "./BackToTop.module.css";

/** The scroll past which the arrow earns its place on screen. */
const SHOW_FROM = 0.9;

export function BackToTop() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const arm = () => setShown(window.scrollY > window.innerHeight * SHOW_FROM);
    // Next frame, not synchronously in the effect body: the first render keeps
    // the arrow hidden (matching the server markup), then the scroll position
    // decides. Same pattern the greeting uses to stay hydration-clean.
    const frame = requestAnimationFrame(arm);
    window.addEventListener("scroll", arm, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", arm);
    };
  }, []);

  const toTop = () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  };

  return (
    <button
      type="button"
      className={`${styles.dock} ${shown ? styles.shown : ""}`}
      onClick={toTop}
      aria-label="Back to top"
      aria-hidden={!shown}
      tabIndex={shown ? 0 : -1}
    >
      <span aria-hidden="true">↑</span>
    </button>
  );
}
