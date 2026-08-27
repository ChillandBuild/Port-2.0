"use client";

import { useId, useState } from "react";
import styles from "./History.module.css";

interface RoleSummaryProps {
  text: string;
}

/**
 * The role summary reads as two lines until asked for more. Keeps the spine
 * scannable; the full account is one tap away and never leaves the page.
 */
export function RoleSummary({ text }: RoleSummaryProps) {
  const [expanded, setExpanded] = useState(false);
  const bodyId = useId();

  return (
    <div className={styles.summaryBlock}>
      <p
        id={bodyId}
        className={`${styles.summary} ${expanded ? "" : styles.clamped}`}
      >
        {text}
      </p>
      <button
        type="button"
        className={`mono ${styles.moreBtn}`}
        aria-expanded={expanded}
        aria-controls={bodyId}
        onClick={() => setExpanded((v) => !v)}
      >
        {expanded ? "Read less" : "Read more"}
      </button>
    </div>
  );
}
