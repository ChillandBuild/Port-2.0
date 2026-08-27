import { SectionHeader } from "@/components/ui/SectionHeader";
import { SECTORS } from "@/lib/content";
import styles from "./SectorBreadth.module.css";

export function SectorBreadth() {
  return (
    <section className={styles.section} aria-labelledby="sectors-heading">
      <SectionHeader
        label="Re: who I've written to"
        aside="9 sectors"
        heading="Seven years of domain experience, sector by sector."
        id="sectors-heading"
      />

      <ul className={styles.grid}>
        {SECTORS.map((sector) => (
          <li className={styles.sector} key={sector.tag}>
            <span className={`mono ${styles.tag}`}>{sector.tag}</span>
            <h3 className={styles.title}>{sector.title}</h3>
            <p className={styles.description}>{sector.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
