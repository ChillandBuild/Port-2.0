"use client";

import { useId, useState } from "react";
import styles from "./History.module.css";

interface RoleSummaryProps {
  items: string[];
}

/** Bullets shown while collapsed — enough to read as a role, not the whole job. */
const COLLAPSED_COUNT = 2;

/**
 * The role summary reads as two bullets until asked for more. Keeps the spine
 * scannable; the full deliverable list is one tap away and never leaves the page.
 */
export function RoleSummary({ items }: RoleSummaryProps) {
  const [expanded, setExpanded] = useState(false);
  const bodyId = useId();
  const visible = expanded ? items : items.slice(0, COLLAPSED_COUNT);

  return (
    <div className={styles.summaryBlock}>
      <ul id={bodyId} className={styles.summary}>
        {visible.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      {items.length > COLLAPSED_COUNT && (
        <button
          type="button"
          className={`mono ${styles.moreBtn}`}
          aria-expanded={expanded}
          aria-controls={bodyId}
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? "Read less" : "Read more"}
        </button>
      )}
    </div>
  );
}
