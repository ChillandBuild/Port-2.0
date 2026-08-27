"use client";

/**
 * Theme control, living in the cadence rail because the rail is this page's
 * chrome and a floating button would be a second, competing piece of it.
 *
 * The mark is the same diamond the rail stamps for a waypoint and the run uses
 * for a booked contact: filled for dark, hollow for light.
 */

import { useEffect, useState } from "react";
import { currentTheme, setTheme, subscribeTheme, watchSystemTheme, type Theme } from "@/lib/theme";
import styles from "./ThemeToggle.module.css";

export function ThemeToggle() {
  // Starts as the server-rendered default and corrects on mount, so the markup
  // the server sent and the markup React expects agree.
  const [theme, setLocal] = useState<Theme>("light");

  useEffect(() => {
    setLocal(currentTheme());
    const unsubscribe = subscribeTheme(setLocal);
    const unwatch = watchSystemTheme();
    return () => {
      unsubscribe();
      unwatch();
    };
  }, []);

  const next = theme === "dark" ? "light" : "dark";

  return (
    <button
      className={styles.toggle}
      type="button"
      onClick={() => setTheme(next)}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
    >
      <span className={styles.mark} aria-hidden="true" />
      <span className={`mono ${styles.label}`}>{theme === "dark" ? "Dark" : "Light"}</span>
    </button>
  );
}
