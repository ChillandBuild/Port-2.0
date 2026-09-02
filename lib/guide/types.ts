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

/** Outcome tone for tree branches and flow steps. */
export type DiagramTone = "positive" | "negative" | "neutral" | "accent";

export interface FlowStep {
  label: string;
  /** Optional sub-line under the chip. */
  note?: string;
  tone?: DiagramTone;
}

export interface TreeBranch {
  label: string;
  /** What happens on this branch, shown as the card body. */
  outcome: string;
  tone: DiagramTone;
}

export interface BarItem {
  label: string;
  /** Numeric value the bar length is proportional to. */
  value: number;
  /** Display form (e.g. "4–6" or "22–35+"). */
  display: string;
}

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
  /** Horizontal arrow-rail diagram: chips joined by → connectors. */
  | { type: "flow"; title?: string; steps: FlowStep[] }
  /** Branching decision diagram: a root with tone-colored outcome cards. */
  | { type: "tree"; root: string; branches: TreeBranch[] }
  /** Horizontal CSS bar chart — value-proportional bars, no JS. */
  | { type: "bars"; title?: string; items: BarItem[] }
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
