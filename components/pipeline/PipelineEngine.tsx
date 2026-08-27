import { SectionHeader } from "@/components/ui/SectionHeader";
import { PIPELINE } from "@/lib/content";
import styles from "./PipelineEngine.module.css";

/** Numbered because this genuinely is a sequence — stage 04 cannot precede stage 02. */
export function PipelineEngine() {
  return (
    <section className={styles.section} id="pipeline" aria-labelledby="pipeline-heading">
      <SectionHeader
        label="Re: how the pipeline runs"
        aside="8 stages"
        heading="The same way they do it on a CRM board."
        body="A structured pipeline that takes targeted prospects from ICP definition through handoff, meeting delivery, and OKR growth."
        id="pipeline-heading"
      />

      <ol className={styles.stages}>
        {PIPELINE.map((stage) => (
          <li className={styles.stage} key={stage.no}>
            <span className={`mono ${styles.no} tabular`}>{stage.no}</span>
            <h3 className={styles.name}>{stage.name}</h3>
            <p className={styles.description}>{stage.description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
