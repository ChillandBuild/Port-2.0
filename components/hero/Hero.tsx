import { Button } from "@/components/ui/Button";
import { HERO } from "@/lib/content";
import styles from "./Hero.module.css";

export function Hero() {
  const [first, second, third] = HERO.headline;

  return (
    <section className={styles.hero} aria-labelledby="hero-heading">
      {/*
        Placeholder, deliberately unmistakable. It must never be possible to ship
        this by accident, so it announces what it is rather than imitating a photo.
      */}
      <div className={styles.media} aria-hidden="true">
        <p className={`mono ${styles.placeholder}`}>
          Photo placeholder
          <span>Replace before launch · 2400×1600 min · subject left of centre</span>
        </p>
      </div>
      <div className={styles.scrim} aria-hidden="true" />

      <div className={styles.content}>
        <p className={`mono ${styles.eyebrow}`}>{HERO.eyebrow}</p>

        <h1 className={styles.headline} id="hero-heading">
          <span className={styles.line}>{first}</span>
          <span className={styles.line}>{second}</span>
          <span className={`${styles.line} ${styles.say}`}>{third}</span>
        </h1>

        <p className={styles.lede}>{HERO.lede}</p>

        <dl className={styles.stats}>
          {HERO.stats.map((stat) => (
            <div className={styles.stat} key={stat.label}>
              <dt className={`${styles.statValue} tabular`}>{stat.value}</dt>
              <dd className={`mono ${styles.statLabel}`}>{stat.label}</dd>
            </div>
          ))}
        </dl>

        <div className={styles.actions}>
          <Button href={HERO.primaryCta.href} variant="light">
            {HERO.primaryCta.label}
          </Button>
          <Button href={HERO.secondaryCta.href} variant="onDark">
            {HERO.secondaryCta.label}
          </Button>
        </div>
      </div>
    </section>
  );
}
