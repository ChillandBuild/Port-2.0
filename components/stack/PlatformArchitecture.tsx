import { SectionHeader } from "@/components/ui/SectionHeader";
import { TOOL_GROUPS } from "@/lib/content";
import styles from "./PlatformArchitecture.module.css";

export function PlatformArchitecture() {
  return (
    <section className={styles.section} aria-labelledby="stack-heading">
      <SectionHeader
        label="Re: what sends the mail"
        aside="4 layers"
        heading="The stack behind every cadence."
        id="stack-heading"
      />

      <div className={styles.grid}>
        {TOOL_GROUPS.map((group) => (
          <article className={styles.group} key={group.name}>
            <h3 className={styles.name}>{group.name}</h3>
            <p className={styles.description}>{group.description}</p>
            <ul className={styles.tools}>
              {group.tools.map((tool) => (
                <li className={`mono ${styles.tool}`} key={tool}>
                  {tool}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
