import { getSiteContent } from "@/lib/backend/site-content";
import {
  IDENTITY,
  FOOTER,
  TERMS,
  PRIVACY,
  REFUNDS,
  HERO,
  PIPELINE,
  SECTORS,
  LEDGER,
  ABOUT,
  ROLES,
  TOOL_GROUPS,
  POSTS,
  CASE_STUDY_ENTRIES,
  type LegalDoc,
  type Stage,
  type Sector,
  type LedgerRow,
  type Role,
  type ToolGroup,
  type Post,
  type CaseStudy,
} from "@/lib/content";
import { COURSE, COURSE_PRICE_USD, COURSE_PRICE_INR } from "@/lib/content/course";
import { SCHEDULE_SECOND_CALL_PRICE_USD, SCHEDULE_SECOND_CALL_PRICE_INR } from "@/lib/content/schedule-payment";

/** Deep JSON clone — strips `as const` readonly-ness so a hardcoded literal can serve as a mutable fallback. Safe here: every fallback below is plain JSON-shaped data (strings, numbers, arrays, objects), nothing with functions or dates. */
function deepMutable<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

/**
 * Server-only admin-editable content, one function per site_content key.
 * Every function's second argument to getSiteContent is the current
 * hardcoded value from lib/content.ts / lib/content/*.ts — the seed data and
 * the safety-net default if the row is missing or Supabase is unreachable.
 * Never import this from a "use client" file.
 */

export interface IdentityContent {
  name: string;
  role: string;
  location: string;
  phone: string;
  phoneHref: string;
  telegram: string;
  email: string;
  emailHref: string;
  linkedin: string;
  resume: string;
  tagline: string;
}

export async function getIdentity(): Promise<IdentityContent> {
  return getSiteContent<IdentityContent>("identity", { ...IDENTITY });
}

export interface CoursePricing {
  priceUsd: number;
  priceInr: number;
}

export async function getCoursePricing(): Promise<CoursePricing> {
  return getSiteContent<CoursePricing>("course_pricing", {
    priceUsd: COURSE_PRICE_USD,
    priceInr: COURSE_PRICE_INR,
  });
}

export interface SchedulePricing {
  secondCallPriceUsd: number;
  secondCallPriceInr: number;
}

export async function getSchedulePricing(): Promise<SchedulePricing> {
  return getSiteContent<SchedulePricing>("schedule_pricing", {
    secondCallPriceUsd: SCHEDULE_SECOND_CALL_PRICE_USD,
    secondCallPriceInr: SCHEDULE_SECOND_CALL_PRICE_INR,
  });
}

export interface FaqItem {
  q: string;
  a: string;
}

export async function getCourseFaq(): Promise<FaqItem[]> {
  return getSiteContent<FaqItem[]>("course_faq", [...COURSE.sales.faq]);
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterGroup {
  title: string;
  links: FooterLink[];
}

export interface FooterContent {
  wordmark: string;
  fineprint: string;
  backToTop: string;
  /** Site + Legal groups only — the Contact group is built live from identity(). */
  groups: FooterGroup[];
}

export async function getFooterContent(): Promise<FooterContent> {
  const [siteGroup, legalGroup] = FOOTER.groups;
  const toMutableGroup = (group: (typeof FOOTER.groups)[number]): FooterGroup => ({
    title: group.title,
    links: group.links.map((link) => ({ label: link.label, href: link.href })),
  });
  return getSiteContent<FooterContent>("footer", {
    wordmark: FOOTER.wordmark,
    fineprint: FOOTER.fineprint,
    backToTop: FOOTER.backToTop,
    groups: [toMutableGroup(siteGroup), toMutableGroup(legalGroup)],
  });
}

export type LegalKey = "legal_terms" | "legal_privacy" | "legal_refunds";

const LEGAL_DEFAULTS: Record<LegalKey, LegalDoc> = {
  legal_terms: TERMS,
  legal_privacy: PRIVACY,
  legal_refunds: REFUNDS,
};

export async function getLegalDoc(key: LegalKey): Promise<LegalDoc> {
  return getSiteContent<LegalDoc>(key, LEGAL_DEFAULTS[key]);
}

export const ALL_LEGAL_KEYS: LegalKey[] = ["legal_terms", "legal_privacy", "legal_refunds"];

/* ---------------------------------------------------------------------- */
/* Phase 3 — marketing content (WorldStage, homepage sections, /lead-generation) */
/* ---------------------------------------------------------------------- */

export interface HeroStat {
  value: string;
  label: string;
  count?: { to: number; suffix?: string; prefix?: string; decimals?: number };
}

export interface HeroContent {
  lede: string;
  stats: HeroStat[];
}

/** Only the two fields WorldStage actually renders — headline/eyebrow/CTAs live on the orphaned, unmounted Hero.tsx and aren't worth exposing here. */
export async function getHero(): Promise<HeroContent> {
  return getSiteContent<HeroContent>(
    "hero",
    deepMutable<HeroContent>({ lede: HERO.lede, stats: HERO.stats as unknown as HeroStat[] }),
  );
}

export async function getPipeline(): Promise<Stage[]> {
  return getSiteContent<Stage[]>("pipeline", [...PIPELINE]);
}

export async function getSectors(): Promise<Sector[]> {
  return getSiteContent<Sector[]>("sectors", [...SECTORS]);
}

export async function getLedger(): Promise<LedgerRow[]> {
  return getSiteContent<LedgerRow[]>("ledger", [...LEDGER]);
}

export interface AboutFact {
  label: string;
  degree: string;
  school: string;
}

export interface AboutContent {
  eyebrow: string;
  heading: string;
  body: string[];
  stamp: string;
  exchange: { asked: string; answered: string };
  facts: AboutFact[];
}

export async function getAbout(): Promise<AboutContent> {
  return getSiteContent<AboutContent>(
    "about",
    deepMutable<AboutContent>({
      eyebrow: ABOUT.eyebrow,
      heading: ABOUT.heading,
      body: [...ABOUT.body],
      stamp: ABOUT.stamp,
      exchange: { ...ABOUT.exchange },
      facts: ABOUT.facts.map((f) => ({ ...f })),
    }),
  );
}

export async function getRoles(): Promise<Role[]> {
  return getSiteContent<Role[]>("roles", [...ROLES]);
}

export async function getToolGroups(): Promise<ToolGroup[]> {
  return getSiteContent<ToolGroup[]>("tool_groups", [...TOOL_GROUPS]);
}

export async function getPosts(): Promise<Post[]> {
  return getSiteContent<Post[]>("posts", [...POSTS]);
}

export async function getCaseStudyEntries(): Promise<CaseStudy[]> {
  return getSiteContent<CaseStudy[]>("case_studies", [...CASE_STUDY_ENTRIES]);
}
