import { POSTS, SECTORS, TOOL_GROUPS } from "@/lib/content";
import styles from "./Range.module.css";

/**
 * Breadth, so it travels sideways: nine sectors as a rail, then the stack as a
 * dense index rather than a wall of logos. The heading rides in the rail as the
 * first item, which stops it competing with the fixed chrome and gives the
 * travel the width it needs to actually move.
 */
export function Range() {
  return (
    <>
      <section className={`spot ${styles.rail}`} id="range" data-pan data-spot aria-labelledby="range-heading">
        <div className={styles.track} data-pan-track>
          <div className={`${styles.item} ${styles.opener}`} data-pan-item>
            <h2 className={styles.heading} id="range-heading">
              Nine sectors.
              <br />
              Twenty-four markets.
            </h2>
            <p className={styles.openerBody}>
              The method holds across all of them. The message never does, which is
              the entire point.
            </p>
          </div>

          {SECTORS.map((sector) => (
            <article className={styles.item} key={sector.title} data-pan-item>
              <div className={styles.itemInner} data-tilt="4">
                <p className={`mono ${styles.tag}`}>{sector.tag}</p>
                <h3 className={styles.itemTitle}>{sector.title}</h3>
                <p className={styles.itemBody}>{sector.description}</p>
              </div>
            </article>
          ))}

          <div className={`${styles.item} ${styles.closer}`} data-pan-item>
            <p className={styles.closerBody}>
              Buyer norms change at every border. Cadence timing, proof style and how
              direct the first line can be are set per market, not per campaign.
            </p>
          </div>
        </div>
      </section>

      <section className={`spot ${styles.stack}`} data-spot aria-labelledby="stack-heading">
        <div className={styles.stackHead} data-reveal data-reveal-children>
          <h2 className={styles.stackHeading} id="stack-heading">
            The stack, by what it is for.
          </h2>
        </div>

        <div className={styles.groups}>
          {TOOL_GROUPS.map((group) => (
            <div className={styles.group} key={group.name} data-reveal>
              <h3 className={styles.groupName}>{group.name}</h3>
              <p className={styles.groupBody}>{group.description}</p>
              <ul className={styles.tools}>
                {group.tools.map((tool, i) => (
                  /* The index drives a transition delay, so hovering a group
                     brings its stack up left to right rather than all at once. */
                  <li
                    className={`mono ${styles.tool}`}
                    key={tool}
                    style={{ ["--i" as string]: i }}
                  >
                    {tool}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className={styles.writes} data-reveal data-reveal-children>
          <h3 className={styles.writesHeading}>And writes about</h3>
          <ul className={styles.writesList}>
            {POSTS.map((post) => (
              <li key={post.title}>
                <span className={styles.writesTitle}>{post.title}</span>
                <span className={styles.writesBody}>{post.summary}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
