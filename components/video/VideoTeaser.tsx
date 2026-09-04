import { getVideoTeaser } from "@/lib/backend/site-content-loaders";
import styles from "./VideoTeaser.module.css";

export async function VideoTeaser() {
  const VIDEO = await getVideoTeaser();
  return (
    <section className={styles.section} id="video" aria-labelledby="video-heading">
      <div className={styles.card} data-reveal data-reveal-tier="lift" data-reveal-children>
        <span className={styles.badge}>{VIDEO.badge}</span>
        <p className={`mono ${styles.eyebrow}`}>{VIDEO.eyebrow}</p>
        <h2 className={styles.heading} id="video-heading">
          {VIDEO.heading}
        </h2>
      </div>
    </section>
  );
}
