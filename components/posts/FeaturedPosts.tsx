import { SectionHeader } from "@/components/ui/SectionHeader";
import { IDENTITY, POSTS } from "@/lib/content";
import styles from "./FeaturedPosts.module.css";

export function FeaturedPosts() {
  return (
    <section className={styles.section} aria-labelledby="posts-heading">
      <SectionHeader
        label="Re: thinking out loud"
        aside="Featured on LinkedIn"
        heading="Rolling notes on outbound and deal origination."
        id="posts-heading"
      />

      <ul className={styles.grid}>
        {POSTS.map((post) => (
          <li key={post.title}>
            <a
              className={styles.card}
              href={IDENTITY.linkedin}
              target="_blank"
              rel="noreferrer noopener"
            >
              <span className={`mono ${styles.topic}`}>{post.topic}</span>
              <h3 className={styles.title}>{post.title}</h3>
              <p className={styles.summary}>{post.summary}</p>
              <span className={`mono ${styles.more}`}>Read post on LinkedIn ↗</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
