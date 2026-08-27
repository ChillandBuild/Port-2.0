import styles from "./SectionHeader.module.css";

interface SectionHeaderProps {
  /** Mono label on the left — reads as a message header field. */
  label: string;
  /** Mono value on the right, when the section has a fact worth stamping. */
  aside?: string;
  heading?: string;
  body?: string;
  id?: string;
}

export function SectionHeader({ label, aside, heading, body, id }: SectionHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.rail}>
        <span className="mono">{label}</span>
        {aside ? <span className={`mono ${styles.aside}`}>{aside}</span> : null}
      </div>
      {heading ? (
        <h2 className={styles.heading} id={id}>
          {heading}
        </h2>
      ) : null}
      {body ? <p className={styles.body}>{body}</p> : null}
    </header>
  );
}
