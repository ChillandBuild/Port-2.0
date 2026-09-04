import { getSiteContent } from "@/lib/backend/site-content";
import { IDENTITY, FOOTER, TERMS, PRIVACY, REFUNDS, type LegalDoc } from "@/lib/content";
import { COURSE, COURSE_PRICE_USD, COURSE_PRICE_INR } from "@/lib/content/course";
import { SCHEDULE_SECOND_CALL_PRICE_USD, SCHEDULE_SECOND_CALL_PRICE_INR } from "@/lib/content/schedule-payment";

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
