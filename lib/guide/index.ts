import type { Block, GuideChapter, GuideDocument, GuideSection } from "./types";
import { ASSESSMENT } from "./assessment";
import { METHODOLOGY } from "./methodology";
import { PROCESS } from "./process";

/**
 * The full Lead Generation Course document, structured. Source of record:
 * content/lead-generation.md — every claim, table and figure on the guide
 * page comes from this transcription.
 */
export const GUIDE_DOCUMENT: GuideDocument = {
  title: "The Lead Generation Course",
  subtitle: "The complete 90-day multi-channel playbook — assessment answers, process, methodology, tools and pricing.",
  chapters: [ASSESSMENT, METHODOLOGY, PROCESS],
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
  }
}

export function sectionText(section: GuideSection): string {
  return [section.title, ...section.blocks.map(blockText)].join(" ");
}

export type { GuideChapter, GuideSection, Block } from "./types";
