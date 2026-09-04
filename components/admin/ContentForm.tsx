"use client";

/**
 * /admin/content — marketing content that isn't pricing/contact/legal: the
 * homepage's hero stat line, pipeline stages, sectors, proof-ledger rows,
 * about copy, work history, tool stack, LinkedIn posts, and case studies.
 * Every one of these is naturally a list of records, so every card here is a
 * JsonCard — the same JSON-textarea escape hatch as /admin/settings' FAQ and
 * legal-sections cards, just applied to a different set of keys.
 */

import type {
  HeroContent,
  AboutContent,
} from "@/lib/backend/site-content-loaders";
import type { Stage, Sector, LedgerRow, Role, ToolGroup, Post, CaseStudy } from "@/lib/content";
import { JsonCard } from "./form-kit";
import styles from "./Admin.module.css";

export interface ContentFormProps {
  hero: HeroContent;
  pipeline: Stage[];
  sectors: Sector[];
  ledger: LedgerRow[];
  about: AboutContent;
  roles: Role[];
  toolGroups: ToolGroup[];
  posts: Post[];
  caseStudies: CaseStudy[];
}

export function ContentForm(props: ContentFormProps) {
  return (
    <div className={styles.settingsSections}>
      <JsonCard
        heading="Hero stats"
        body="The lede paragraph and the three stat counters at the top of the world/hero section. { lede: string, stats: [{ value, label, count?: { to, suffix? } }] }"
        jsonLabel="Hero (JSON)"
        initial={props.hero}
        contentKey="hero"
        rows={10}
      />
      <JsonCard
        heading="Pipeline stages"
        body="The 8-stage process shown on the homepage and /lead-generation. Add, remove or reorder stages freely — the array order is the display order. { no, name, description }"
        jsonLabel="Pipeline (JSON array)"
        initial={props.pipeline}
        contentKey="pipeline"
        rows={16}
      />
      <JsonCard
        heading="Sectors"
        body="The industry/vertical list. Set core: true on the ones that should lead with the accent treatment. { tag, title, description, core? }"
        jsonLabel="Sectors (JSON array)"
        initial={props.sectors}
        contentKey="sectors"
        rows={16}
      />
      <JsonCard
        heading="Proof ledger"
        body="The results rail — one row per proof point. { value, label, source, count?: { to, prefix?, suffix?, decimals? }, countRange?: { from, to, prefix?, suffix? } }"
        jsonLabel="Ledger (JSON array)"
        initial={props.ledger}
        contentKey="ledger"
        rows={16}
      />
      <JsonCard
        heading="About"
        body="The positioning section: heading, body paragraphs, the pull-quote exchange, and the fact list (education/background rows). { eyebrow, heading, body: string[], stamp, exchange: { asked, answered }, facts: [{ label, degree, school }] }"
        jsonLabel="About (JSON)"
        initial={props.about}
        contentKey="about"
        rows={14}
      />
      <JsonCard
        heading="Work history"
        body="One entry per role, most recent first. { company, title, dates, place, summary: string[], result }"
        jsonLabel="Roles (JSON array)"
        initial={props.roles}
        contentKey="roles"
        rows={20}
      />
      <JsonCard
        heading="Tool stack"
        body="Grouped tool list shown under /#range. { name, description, tools: [{ name, url }] }"
        jsonLabel="Tool groups (JSON array)"
        initial={props.toolGroups}
        contentKey="tool_groups"
        rows={20}
      />
      <JsonCard
        heading="LinkedIn posts"
        body="The featured-posts rail. Image is optional — carousel/document posts have none. { topic, title, summary, url, image?: { src, width, height } }"
        jsonLabel="Posts (JSON array)"
        initial={props.posts}
        contentKey="posts"
        rows={20}
      />
      <JsonCard
        heading="Case studies"
        body="The gated case-study entries. { company, whatHappened, whatWasDone, problem, resolution }"
        jsonLabel="Case studies (JSON array)"
        initial={props.caseStudies}
        contentKey="case_studies"
        rows={20}
      />
    </div>
  );
}
