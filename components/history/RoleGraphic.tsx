import type { CSSProperties } from "react";
import styles from "./History.module.css";

interface RoleGraphicProps {
  index: number;
  total: number;
  company: string;
}

/**
 * Abstract, procedural stand-in for a role photo — a hue-shifted gradient
 * panel derived from --accent, one per role. No image assets: the shift
 * comes from a CSS custom property, so it tracks the light/dark accent
 * automatically instead of needing its own palette.
 */
export function RoleGraphic({ index, total, company }: RoleGraphicProps) {
  const hue = total > 0 ? (360 / total) * index : 0;
  const style = { "--role-hue": `${hue}deg` } as CSSProperties;

  return (
    <div className={styles.graphic} data-history-image style={style}>
      <span className={`mono ${styles.graphicIndex}`}>{String(index + 1).padStart(2, "0")}</span>
      <span className={`mono ${styles.graphicCompany}`}>{company}</span>
    </div>
  );
}
