import Link from "next/link";
import { LEADGEN, PIPELINE } from "@/lib/content";
import { COURSE } from "@/lib/content/course";
import styles from "./LeadGenPage.module.css";

/**
 * The free /lead-generation trailer: what lead generation means here and
 * the eight-stage process, closing with a compact CTA into the paid course
 * at its own route, /course (not embedded here — a full gate+guide under
 * this trailer read as two disconnected pages, see decisions log). Both
 * buttons point to /course: buying and redeeming a code both happen there.
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

      <section className={styles.cta} aria-labelledby="leadgen-course-cta">
        <p className={`mono ${styles.eyebrow}`}>{COURSE.enroll.eyebrow}</p>
        <h2 className={styles.ctaHeading} id="leadgen-course-cta">
          {COURSE.enroll.heading}
        </h2>
        <p className={styles.ctaBody}>{COURSE.enroll.body}</p>
        <div className={styles.ctaActions}>
          <Link className={styles.primary} href="/course">
            {COURSE.enroll.buyLabel}
          </Link>
          <Link className={styles.ghost} href="/course">
            {COURSE.enroll.memberLabel}
          </Link>
        </div>
      </section>
    </>
  );
}