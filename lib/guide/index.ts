import type { Block, GuideChapter, GuideDocument, GuideSection } from "./types";
import { SYSTEM } from "./chapters/ch01-system";
import { ICP_RESEARCH } from "./chapters/ch02-icp-research";
import { TOOLS_INFRASTRUCTURE } from "./chapters/ch03-tools-infrastructure";
import { CAMPAIGNS } from "./chapters/ch04-campaigns";
import { LINKEDIN } from "./chapters/ch05-linkedin";
import { TRACKING_HYGIENE } from "./chapters/ch06-tracking-hygiene";
import { REPLIES_MEETINGS } from "./chapters/ch07-replies-meetings";
import { METRICS_TARGETS } from "./chapters/ch08-metrics-targets";
import { SUPPORT } from "./chapters/ch09-support";

/**
 * The full Lead Generation Strategy document, structured into nine chapters.
 * Rebuilt from the original three-source transcription (assessment answers,
 * process & methodology deck, 2-page process sheet) so each topic has one
 * canonical home — provenance for every section lives in each chapter file's
 * docstring.
 */
export const GUIDE_DOCUMENT: GuideDocument = {
  title: "Lead Generation Strategy",
  subtitle: "The complete 90-day multi-channel system — ICP, research, infrastructure, campaigns, LinkedIn, tracking, replies, metrics and support.",
  chapters: [SYSTEM, ICP_RESEARCH, TOOLS_INFRASTRUCTURE, CAMPAIGNS, LINKEDIN, TRACKING_HYGIENE, REPLIES_MEETINGS, METRICS_TARGETS, SUPPORT],
};

export interface GuideNavSection {
  id: string;
  title: string;
}

export interface GuideNavGroup {
  label: string | null;
  sections: GuideNavSection[];
}

export interface GuideNavChapter {
  id: string;
  number: string;
  title: string;
  groups: GuideNavGroup[];
}

/** Sidebar/navigation tree: sections grouped by their phase label. */
export function buildGuideNav(chapters: GuideChapter[]): GuideNavChapter[] {
  return chapters.map((chapter) => {
    const groups: GuideNavGroup[] = [];
    for (const section of chapter.sections) {
      const label = section.group ?? null;
      let group = groups.find((g) => g.label === label);
      if (!group) {
        group = { label, sections: [] };
        groups.push(group);
      }
      group.sections.push({ id: section.id, title: section.title });
    }
    return {
      id: chapter.id,
      number: chapter.number,
      title: chapter.title,
      groups,
    };
  });
}

/** Flattens blocks to plain text for search and for content diffing. */
function blockText(block: Block): string {
  switch (block.type) {
    case "para":
    case "quote":
    case "mono":
      return block.text;
    case "callout":
      return [block.title, block.text].filter(Boolean).join(" — ");
    case "list":
      return block.items
        .map((item) => [item.text, ...(item.children ?? [])].join(" "))
        .join(" ");
    case "table":
      return [block.caption, ...block.headers, ...block.rows.flat()].filter(Boolean).join(" ");
    case "metrics":
      return block.items.map((m) => [m.value, m.label, m.note].filter(Boolean).join(" ")).join(" ");
    case "process":
      return [block.title, ...block.steps.map((s) => [s.name, s.description].filter(Boolean).join(" "))]
        .filter(Boolean)
        .join(" ");
    case "timeline":
      return block.phases
        .map((p) => [p.label, p.title, p.description, ...(p.bullets ?? [])].filter(Boolean).join(" "))
        .join(" ");
    case "collapsible":
      return [block.summary, ...block.blocks.map(blockText)].join(" ");
    case "flow":
      return [block.title, ...block.steps.map((s) => [s.label, s.note].filter(Boolean).join(" "))]
        .filter(Boolean)
        .join(" ");
    case "tree":
      return [block.root, ...block.branches.map((b) => [b.label, b.outcome].join(" "))].join(" ");
    case "bars":
      return [block.title, ...block.items.map((b) => [b.label, b.display].join(" "))].join(" ");
  }
}

export function sectionText(section: GuideSection): string {
  return [section.title, ...section.blocks.map(blockText)].join(" ");
}

export type { GuideChapter, GuideSection, Block, DiagramTone } from "./types";
