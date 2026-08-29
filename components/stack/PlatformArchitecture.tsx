import type { CSSProperties } from "react";
import { TOOL_GROUPS } from "@/lib/content";
import styles from "./PlatformArchitecture.module.css";

/**
 * Four groups, one hairline grid — same shape as Terms' phases, because both
 * sections are enumerating a fixed set rather than ranking it. Tools are
 * listed, not described one by one: the group description carries the "why",
 * the tag list carries the "what".
 *
 * Entrance runs on plain CSS `@keyframes` (fill-mode: forwards), not
 * ScrollFX's GSAP reveal — it plays and settles on mount regardless of scroll
 * position, so it can't get stuck at opacity 0 the way a scan that only runs
 * once on ScrollFX's own mount can when this section's DOM shows up later.
 */
export function PlatformArchitecture() {
  return (
    <section className={styles.stack} id="stack" aria-labelledby="stack-heading">
      <div className={styles.head}>
        <h2 className={styles.heading} id="stack-heading">
          The stack behind every cadence.
        </h2>
        <p className={styles.standfirst}>
          Four layers, run together — discovery, pipeline, automation and
          intelligence, not a pile of logins.
        </p>
      </div>

      <div className={styles.groups}>
        {TOOL_GROUPS.map((group, i) => (
          <article
            className={styles.group}
            key={group.name}
            style={{ "--i": i } as CSSProperties}
          >
            <h3 className={styles.name}>{group.name}</h3>
            <p className={styles.description}>{group.description}</p>
            <ul className={styles.tools}>
              {group.tools.map((tool) => (
                <li key={tool.name}>
                  <a
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mono ${styles.tool}`}
                    title={`Visit ${tool.name} (opens in new tab)`}
                    aria-label={`${tool.name} website`}
                  >
                    {tool.name}
                  </a>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
