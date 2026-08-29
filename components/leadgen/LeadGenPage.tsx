import Link from "next/link";
import { LEADGEN, PIPELINE, TOOL_GROUPS, WORK_PLAN } from "@/lib/content";
import styles from "./LeadGenPage.module.css";

/**
 * The /lead-generation page. A plain document from the first pixel: what lead
 * generation means here, the eight-stage process, the engagement model, the
 * stack, and the way in. It reuses the same typed PIPELINE / WORK_PLAN /
 * TOOL_GROUPS the homepage draws on, so the two cannot drift apart.
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

      <section className={styles.model} aria-labelledby="leadgen-model" data-reveal>
        <p className={`mono ${styles.eyebrow}`}>{LEADGEN.modelEyebrow}</p>
        <h2 className={styles.sectionHeading} id="leadgen-model">
          {LEADGEN.modelHeading}
        </h2>
        <p className={styles.sectionBody}>{LEADGEN.modelBody}</p>

        <ol className={styles.phases}>
          {WORK_PLAN.steps.map((step) => (
            <li className={styles.phase} key={step.no}>
              <p className={`mono ${styles.stageNo}`}>Phase {step.no}</p>
              <h3 className={styles.stageName}>{step.name}</h3>
              <p className={styles.stageBody}>{step.description}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.stack} aria-labelledby="leadgen-stack" data-reveal>
        <p className={`mono ${styles.eyebrow}`}>{LEADGEN.stackEyebrow}</p>
        <h2 className={styles.sectionHeading} id="leadgen-stack">
          {LEADGEN.stackHeading}
        </h2>
        <p className={styles.sectionBody}>{LEADGEN.stackBody}</p>

        <div className={styles.groups}>
          {TOOL_GROUPS.map((group) => (
            <div className={styles.group} key={group.name}>
              <h3 className={styles.groupName}>{group.name}</h3>
              <p className={styles.groupTools}>
                {group.tools.map((tool, idx) => (
                  <span key={tool.name}>
                    {idx > 0 && " · "}
                    <a
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.toolLink}
                      title={`Visit ${tool.name}`}
                    >
                      {tool.name}
                    </a>
                  </span>
                ))}
              </p>
              <p className={styles.groupBody}>{group.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.cta} aria-labelledby="leadgen-cta">
        <h2 className={styles.ctaHeading} id="leadgen-cta">
          {LEADGEN.cta.heading}
        </h2>
        <p className={styles.ctaBody}>{LEADGEN.cta.body}</p>
        <div className={styles.ctaActions}>
          <Link className={styles.primary} href={LEADGEN.cta.primary.href}>
            {LEADGEN.cta.primary.label}
          </Link>
          <a
            className={styles.ghost}
            href={LEADGEN.cta.secondary.href}
            target="_blank"
            rel="noreferrer noopener"
          >
            {LEADGEN.cta.secondary.label}
          </a>
        </div>
      </section>
    </>
  );
}