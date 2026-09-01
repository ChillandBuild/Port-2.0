/**
 * Typed block model for the Lead Generation Course document
 * (content/lead-generation.md). The document is transcribed here as
 * structured data so presentation lives entirely in components/guide/ —
 * nothing on the page paraphrases or re-wraps the source.
 */

export interface ListItem {
  text: string;
  children?: string[];
}

export interface MetricItem {
  value: string;
  label: string;
  note?: string;
}

export interface ProcessStep {
  name: string;
  description?: string;
}

export interface TimelinePhase {
  label: string;
  title: string;
  description?: string;
  bullets?: string[];
}

export type CalloutVariant = "result" | "target" | "note" | "guarantee";

export type Block =
  | { type: "para"; text: string }
  | { type: "list"; ordered?: boolean; items: ListItem[] }
  | { type: "table"; caption?: string; headers: string[]; rows: string[][] }
  | { type: "metrics"; items: MetricItem[] }
  | { type: "process"; title?: string; steps: ProcessStep[] }
  | { type: "timeline"; phases: TimelinePhase[] }
  | { type: "callout"; variant: CalloutVariant; title?: string; text: string }
  | { type: "quote"; text: string }
  /** Pre-formatted ASCII flow from the source, rendered as-is in mono. */
  | { type: "mono"; text: string }
  /** Long reference material rendered inside a native <details>. */
  | { type: "collapsible"; summary: string; blocks: Block[] };

export interface GuideSection {
  /** Unique anchor id used by the sticky nav, search and deep links. */
  id: string;
  title: string;
  /** Optional group label (e.g. the 30/60/90 phases) shown in the nav. */
  group?: string;
  blocks: Block[];
}

export interface GuideChapter {
  id: string;
  number: string;
  title: string;
  /** Source provenance from the document header. */
  source: string;
  intro?: Block[];
  sections: GuideSection[];
}

export interface GuideDocument {
  title: string;
  subtitle: string;
  chapters: GuideChapter[];
}
