import { DraftMessage } from "@/components/hero/DraftMessage";
import { SectionHeader } from "@/components/ui/SectionHeader";
import styles from "./SampleOutreach.module.css";

/**
 * The drafted message, moved off the hero. Here it illustrates stage 04 rather
 * than competing with the headline for the reader's first look.
 */
export function SampleOutreach() {
  return (
    <section className={styles.section} aria-labelledby="sample-heading">
      <div className={styles.grid}>
        <SectionHeader
          label="Re: what stage 04 looks like"
          heading="A cold open he would actually send."
          body="Nothing in a cadence works if the first message doesn't. This is the shape of one — short, specific about the recipient, and honest about the fit."
          id="sample-heading"
        />
        <DraftMessage />
      </div>
    </section>
  );
}
