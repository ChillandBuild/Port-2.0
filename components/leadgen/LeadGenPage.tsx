import Link from "next/link";
import { LEADGEN, PIPELINE } from "@/lib/content";
import styles from "./LeadGenPage.module.css";

/**
 * The free trailer at the top of /lead-generation: what lead generation
 * means here and the eight-stage process, then straight into the paid
 * course gate mounted below it. It reuses the same typed PIPELINE the
 * homepage draws on, so the two cannot drift apart.
 */
export function LeadGenPage() {
  return (
    <>
      <section className={styles.hero} aria-labelledby="leadgen-title">
        <Link className={styles.back} href="/">
          <span aria-hidden="true">←</span> Home
        </Link>
        <p className={`mono ${styles.eyebrow}`}>{LEADGEN.eyebrow}</p>
        <h1 className={styles.title} id="leadgen-title">
          {LEADGEN.headline}
        </h1>
        <p className={styles.lede}>{LEADGEN.lede}</p>
      </section>

      <section className={styles.meaning} aria-labelledby="leadgen-meaning" data-reveal>
        <h2 className={styles.sectionHeading} id="leadgen-meaning">
          {LEADGEN.meaningHeading}
        </h2>
        {LEADGEN.meaning.map((para) => (
          <p className={styles.meaningBody} key={para}>
            {para}
          </p>
        ))}
      </section>

      <section className={styles.process} aria-labelledby="leadgen-process" data-reveal>
        <p className={`mono ${styles.eyebrow}`}>{LEADGEN.processEyebrow}</p>
        <h2 className={styles.sectionHeading} id="leadgen-process">
          {LEADGEN.processHeading}
        </h2>
        <p className={styles.sectionBody}>{LEADGEN.processBody}</p>

        <ol className={styles.stages}>
          {PIPELINE.map((stage) => (
            <li className={styles.stage} key={stage.no}>
              <span className={`mono ${styles.stageNo}`}>{stage.no}</span>
              <div>
                <h3 className={styles.stageName}>{stage.name}</h3>
                <p className={styles.stageBody}>{stage.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}