import { POSTS } from "@/lib/content";
import styles from "./FeaturedPosts.module.css";

/** The LinkedIn glyph, inline so the page stays self-contained. */
function LinkedInMark() {
  return (
    <svg className={styles.glyph} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

/**
 * Featured LinkedIn posts, floating: a seamless marquee that drifts the cards
 * across on their own instead of sitting behind a scrollbar.
 *
 * Its own section down by the footer — the writing behind the reach Proof's
 * LinkedIn numbers claim — so it supplies its own page background, shell
 * padding, and section-level heading.
 *
 * The rail is doubled for the loop — the second set is the continuation of the
 * first, kept out of the tab order and hidden from screen readers so nobody
 * hears or tabs through the same four posts twice. Hover or keyboard focus
 * pauses the drift; under reduced motion there is no drift at all and the rail
 * becomes a plain scroll strip.
 */
export function FeaturedPosts() {
  const loop = [...POSTS, ...POSTS];

  return (
    <section
      className={`spot ${styles.section}`}
      id="posts"
      data-spot
      aria-labelledby="posts-heading"
    >
      <div className={styles.head} data-reveal data-reveal-children>
        <p className={`mono ${styles.eyebrow}`}>Thought leadership</p>
        <h2 className={styles.heading} id="posts-heading">
          Featured LinkedIn posts
        </h2>
        <p className={styles.standfirst}>
          Rolling notes on B2B lead generation, pre-sales architecture, and
          private-market deal origination.
        </p>
      </div>

      <div
        className={styles.rail}
        role="region"
        aria-label="Featured LinkedIn posts"
        tabIndex={0}
        data-reveal
      >
        <ul className={styles.track}>
          {loop.map((post, i) => {
            const duplicate = i >= POSTS.length;
            return (
              <li className={styles.slot} key={i} aria-hidden={duplicate}>
                <a
                  className={styles.card}
                  href={post.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  data-tilt="4"
                  tabIndex={duplicate ? -1 : undefined}
                >
                  <p className={`mono ${styles.topic}`}>
                    <LinkedInMark />
                    {post.topic}
                  </p>
                  <h4 className={styles.title}>{post.title}</h4>
                  <p className={styles.summary}>{post.summary}</p>
                  <span className={`mono ${styles.more}`}>
                    Read post on LinkedIn <span className={styles.arrow} aria-hidden="true">↗</span>
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}