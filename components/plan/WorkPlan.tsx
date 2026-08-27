import { SectionHeader } from "@/components/ui/SectionHeader";
import { WORK_PLAN } from "@/lib/content";
import styles from "./WorkPlan.module.css";

/** Numbered because the money moves in this order and no other. */
export function WorkPlan() {
  return (
    <section className={styles.section} id="work-plan" aria-labelledby="plan-heading">
      <SectionHeader
        label="Re: how we'd work together"
        aside={WORK_PLAN.eyebrow}
        heading={WORK_PLAN.heading}
        body={WORK_PLAN.body}
        id="plan-heading"
      />

      <ol className={styles.steps}>
        {WORK_PLAN.steps.map((step) => (
          <li className={styles.step} key={step.no}>
            <span className={`mono ${styles.no} tabular`}>{step.no}</span>
            <h3 className={styles.name}>{step.name}</h3>
            <p className={styles.description}>{step.description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
