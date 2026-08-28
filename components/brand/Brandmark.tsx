import styles from "./Brandmark.module.css";

/**
 * The wordmark — the site signature.
 *
 * "Sampath Kumar" set in Great Vibes, a cursive signature face reserved for this
 * one mark, under a single orchid underline sweep. Ported from the portfolio
 * site so the two share an identity. The accent full stop that lived here before
 * is gone with it: the sweep now carries the flourish.
 */

export function Brandmark({ className }: { className?: string }) {
  return (
    <span className={`${styles.wordmark} ${className ?? ""}`}>Sampath Kumar</span>
  );
}
