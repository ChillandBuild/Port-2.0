import type { ToolItem } from "@/lib/content";
import { getToolGroups } from "@/lib/backend/site-content-loaders";
import styles from "./PlatformArchitecture.module.css";

/**
 * Bento cards, one per tool group. Three surface roles (tint / dark / solid)
 * cycle across the 8 groups so the grid doesn't read as one repeated card
 * stamped eight times; Prospecting (the largest group) gets the big slot
 * since it's already first in the data and already the most tools.
 *
 * Icons are each tool's real favicon, fetched from Google's public favicon
 * endpoint by hostname — same "hotlink, don't run through next/image"
 * decision as FeaturedPosts' post covers: these are tiny, already-cached
 * images with nothing for an optimisation pass to gain.
 *
 * Two different reveal mechanisms, deliberately:
 *  - .head still plays on plain CSS @keyframes (fill-mode: forwards), not
 *    ScrollFX — it settles on mount regardless of scroll position, so it
 *    can't get stuck at opacity 0 if this section's DOM shows up after
 *    ScrollFX's own once-per-mount scan.
 *  - .bento uses ScrollFX's shared [data-reveal] system instead of a new
 *    animation dependency — the blur/-20px/0.4s-stagger drop-in is a
 *    per-instance override on that shared mechanism (see ScrollFX.tsx),
 *    the same system every other section's scroll-triggered reveal uses.
 */

const ROLE_BY_INDEX = ["tint", "dark", "solid", "tint", "tint", "dark", "solid", "tint"] as const;

function faviconUrl(toolUrl: string): string {
  let hostname = toolUrl;
  try {
    hostname = new URL(toolUrl).hostname;
  } catch {
    // Malformed url in the data — fall back to the raw string, which still
    // resolves to *something* from the favicon service.
  }
  return `https://www.google.com/s2/favicons?sz=64&domain=${encodeURIComponent(hostname)}`;
}

function ToolIcon({ tool }: { tool: ToolItem }) {
  return (
    <a
      className={styles.icon}
      href={tool.url}
      target="_blank"
      rel="noopener noreferrer"
      title={`Visit ${tool.name} (opens in new tab)`}
      aria-label={`${tool.name} website`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={faviconUrl(tool.url)} alt="" width={20} height={20} loading="lazy" decoding="async" />
    </a>
  );
}

export async function PlatformArchitecture() {
  const TOOL_GROUPS = await getToolGroups();
  return (
    <section className={`grained ${styles.stack}`} id="stack" aria-labelledby="stack-heading">
      <div className={styles.head}>
        <h2 className={styles.heading} id="stack-heading">
          The stack behind every cadence.
        </h2>
        <p className={styles.standfirst}>
          Eight layers, run together — prospecting, enrichment, engagement,
          deliverability, pipeline, deal execution, automation and
          intelligence, not a pile of logins.
        </p>
        <p className={`mono ${styles.expertise}`}>
          Hands-on expertise with all of them, built over seven years running outbound.
        </p>
      </div>

      <div
        className={styles.bento}
        data-reveal
        data-reveal-children
        data-reveal-y="-20"
        data-reveal-duration="0.5"
        data-reveal-stagger="0.4"
        data-reveal-blur
      >
        {TOOL_GROUPS.map((group, i) => {
          const role = ROLE_BY_INDEX[i % ROLE_BY_INDEX.length];
          const iconCap = i === 0 ? 8 : 5;
          const shown = group.tools.slice(0, iconCap);
          const rest = group.tools.length - shown.length;
          return (
            <article className={`${styles.card} ${styles[role]}${i === 0 ? ` ${styles.big}` : ""}`} key={group.name}>
              {role === "tint" && <div className={styles.grid} aria-hidden="true" />}
              <div className={styles.cardTop}>
                <h3 className={styles.name}>{group.name}</h3>
                <p className={`mono ${styles.count}`}>{group.tools.length} tools</p>
                <p className={styles.description}>{group.description}</p>
              </div>
              <div className={styles.iconRow}>
                {shown.map((tool) => (
                  <ToolIcon key={tool.name} tool={tool} />
                ))}
                {rest > 0 && (
                  <details className={styles.more}>
                    <summary className={`mono ${styles.moreLabel}`}>
                      <span className={styles.moreClosedText}>+{rest} more</span>
                      <span className={styles.moreOpenText}>Show less</span>
                    </summary>
                    <div className={styles.moreIcons}>
                      {group.tools.slice(iconCap).map((tool) => (
                        <ToolIcon key={tool.name} tool={tool} />
                      ))}
                    </div>
                  </details>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
