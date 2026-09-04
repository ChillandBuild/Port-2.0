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
import { GUIDE_DOCUMENT } from "@/lib/guide";
import type { GuideChapter, GuideDocument } from "@/lib/guide/types";

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

/* ---------------------------------------------------------------------- */
/* Phase 4 — chatbot answers and buyer-facing email templates             */
/* ---------------------------------------------------------------------- */

export interface ChatbotCta {
  label: string;
  href: string;
  solid?: boolean;
}

export interface ChatbotAnswer {
  id: string;
  /** Substrings matched (case-insensitively) against the visitor's message; the first answer with any match wins. */
  keywords: string[];
  /** May use {{phone}}, {{linkedin}}, {{telegram}}, {{resume}}, {{secondCallPrice}}, {{secondCallPriceUsd}}. */
  text: string;
  chips?: string[];
  ctas?: ChatbotCta[];
}

export interface ChatbotContent {
  answers: ChatbotAnswer[];
  /** Always matches last, when nothing above did. Same token set as any answer. */
  fallback: ChatbotAnswer;
}

/**
 * The "estimate my pipeline" intent stays code in app/api/chat/route.ts — it
 * runs estimateOutcome() on numbers parsed out of the message, which isn't
 * something a text template can express. Everything else the bot says is
 * data here, checked in array order before that one special case.
 */
export async function getChatbotContent(): Promise<ChatbotContent> {
  return getSiteContent<ChatbotContent>("chatbot_answers", {
    answers: [
      {
        id: "hiring",
        keywords: ["hire", "full-time", "full time", "open to", "recruit"],
        text:
          "Yes — open to full-time roles and fractional / contract engagements.\n\nCoimbatore, IN (GMT+5:30) — replies land across IST, GMT and PT hours. 7+ years across 24 markets (NA, EU, APAC, MENA). Market rate for a Pre-Sales / Lead Gen leadership role — no fixed number on a page, prefers a real conversation.\n\nBuilt and led research + outreach teams, not just IC work. Owns a number: pipeline, MQLs, meetings booked, CRM hygiene.",
        chips: ["Show work history", "What sectors?", "Resume"],
        ctas: [
          { label: "Resume", href: "{{resume}}", solid: true },
          { label: "Message on LinkedIn", href: "{{linkedin}}" },
        ],
      },
      {
        id: "pricing",
        keywords: ["350", "cost", "price", "pricing", "session", "call"],
        text:
          "First call is free — 30–45 minutes, strategy & pipeline deep-dive (IST hours, remote video). Second call is {{secondCallPrice}} for 1 hour — infrastructure, tool alignment, methodology.\n\nBoth are bookable directly on /schedule — the free call by form, the second by on-site payment. Or reach out on LinkedIn, phone, or Telegram ({{phone}}).",
        chips: ["How to book?", "What's in the {{secondCallPriceUsd}}?", "Is first call really free?"],
        ctas: [
          { label: "Schedule → /schedule", href: "/schedule", solid: true },
          { label: "How to book", href: "/schedule" },
        ],
      },
      {
        id: "performance",
        keywords: ["performance", "pay for results", "engagement", "retainer", "tools first", "work plan"],
        text:
          "Tools first. Pay when leads land.\n\n01 — Pay for tools only (direct cost, no markup, no retainer yet).\n02 — Research & build: ICP, account research, prospect sourcing, cadence launched.\n03 — Leads flow → pay for results. Payment linked to conversion, not activity.",
        chips: ["Which tools?", "What's the research cycle?", "Estimate for me"],
        ctas: [{ label: "Work plan → /#work-plan", href: "/#work-plan", solid: true }],
      },
      {
        id: "results",
        keywords: ["result", "proof", "200m", "35%", "bounce", "mql", "meeting"],
        text:
          "Some highlights:\n\n• +35% lead-to-meeting lift (thesis-matched messaging) — Finquest\n• 200M+ private companies mapped — Finquest M&A\n• 300+ enterprise MQLs / year — Ecosmob\n• 18–25 meetings / seat / month — The Sales Group (6 verticals)\n• <1.2% bounce ceiling — multi-stage verification\n• +30% deal velocity — Zinnov & Draup",
        chips: ["Work history", "Which sectors?", "How achieved?"],
        ctas: [
          { label: "Case studies (gated) → /case-studies", href: "/case-studies", solid: true },
          { label: "See proof rail", href: "/#track-record" },
        ],
      },
      {
        id: "work-history",
        keywords: ["work history", "experience", "finquest", "ecosmob", "uplers", "alore", "zinnov"],
        text:
          "7 roles, most recent first:\n\n• Emotii (Senior Lead Gen Specialist) Mar 2026–present, Bengaluru — multi-channel outreach, +25% pipeline.\n• Finquest (Senior Lead Gen Mgr) Jul 2024–Sep 2025, Bengaluru — M&A origination across NA/EU/APAC, 200M+ mapped, +35% lift.\n• The Sales Group Jan–Jun 2024, Toronto (remote) — fractional SDR leadership, 18–25 meetings/seat/mo.\n• Uplers & Mavlers May–Dec 2023 — cross-border outreach, bounce <1.5%.\n• Ecosmob Jun 2022–Apr 2023 — telecom SaaS, 300+ MQLs/yr.\n• Alore Apr 2021–May 2022 — research & QA.\n• Zinnov & Draup (Lead Gen Executive) Jun 2019–Jul 2021 — first sales role, +30% velocity.",
        chips: ["Show proof", "Which sectors?", "Education?"],
        ctas: [{ label: "Full history → /#history", href: "/#history" }],
      },
      {
        id: "process",
        keywords: ["process", "pipeline", "icp", "outreach", "cadence", "method"],
        text:
          "8 stages, in order (each depends on the last):\n\n01 Understand ICP → 02 Research → 03 Prospect (verify before any send) → 04 Outreach (cold email + LinkedIn, SPF/DKIM/DMARC monitored) → 05 Qualification (quality > count) → 06 Meeting (discovery + AE handoff) → 07 Pipeline (CRM + ROI) → 08 Growth (OKRs, training, process fixes).",
        chips: ["Which tools per stage?", "Show estimator", "Show results"],
        ctas: [{ label: "Lead gen → /lead-generation", href: "/lead-generation" }],
      },
      {
        id: "tools",
        keywords: ["tool", "stack", "sales nav", "salesforce", "apollo", "clay"],
        text:
          "Stack grouped by job:\n\n• Prospecting & intent: Sales Nav, Apollo, ZoomInfo, Crunchbase, Lusha, Cognism, Hunter, Lemlist\n• CRM & pipeline OS: Salesforce, HubSpot, Pipedrive, Zoho, Close\n• Automation & enrichment: n8n, agentic AI, Clay, Instantly.ai, Smartlead, PhantomBuster\n• Intelligence & pre-sales: Finquest AI, PitchBook, CB Insights, Gong.io, Draup AI, Chorus",
        chips: ["Estimate cost", "Process steps", "Work history"],
        ctas: [{ label: "Stack → /#range", href: "/#range" }],
      },
      {
        id: "location",
        keywords: ["where", "based", "coimbatore", "phone", "linkedin", "ist", "location", "contact"],
        text:
          "Based Coimbatore, Tamil Nadu, India (GMT+5:30) — {{phone}}. Works across IST, GMT and PT hours. Best contact: LinkedIn, phone or Telegram. First call is free via /schedule.",
        chips: ["Book a call", "Is he available now?", "Hiring?"],
        ctas: [
          { label: "LinkedIn", href: "{{linkedin}}", solid: true },
          { label: "Call {{phone}}", href: "{{phoneHref}}" },
        ],
      },
      {
        id: "sectors",
        keywords: ["sector", "industry", "vertical"],
        text:
          "Core: B2B & B2C SaaS, service-based private markets, digital marketing & translation.\n\nAlso: staffing & recruiting, MedTech/pharma/healthcare, banking/finance/BPO, e-commerce/retail/aviation, EdTech, energy/utilities/engineering.",
        chips: ["Process", "Tool stack", "Results"],
        ctas: [{ label: "Sectors → /#range", href: "/#range" }],
      },
    ],
    fallback: {
      id: "fallback",
      keywords: [],
      text:
        "I don't have that handy — try asking about hiring availability, the {{secondCallPrice}} session, the performance model, process (8 stages), results, or tools. Or reach him direct — he says hello first.",
      chips: ["Is Sampath open to full-time roles?", "What does the {{secondCallPriceUsd}} cover?", "Show results"],
      ctas: [
        { label: "Ask on LinkedIn", href: "{{linkedin}}", solid: true },
        { label: "Schedule a call", href: "/schedule" },
      ],
    },
  });
}

/* --- Email templates ----------------------------------------------------
 * Structural assembly (which optional lines appear, date/duration
 * formatting) stays in lib/backend/email.ts; only the prose itself — the
 * paragraphs a reader actually reads — lives here as {{token}} strings.
 */

export interface ScheduleConfirmationTemplate {
  subject: string;
  receivedLine: string;
  nextStepsLine: string;
  prepLine: string;
  reachOutLine: string;
  signoff: string;
}

export async function getScheduleConfirmationTemplate(): Promise<ScheduleConfirmationTemplate> {
  return getSiteContent<ScheduleConfirmationTemplate>("email_schedule_confirmation", {
    subject: "Your free call request — received",
    receivedLine:
      "Your request for the free 30-45 minute discovery call has been received, and it's now in my queue for a personal review — this note confirms it landed, nothing more is needed from you right now.",
    nextStepsLine:
      "Here's what happens next: I'll go through what you've shared, and reply by email within a day or two to confirm the exact time for your slot (adjusting it if needed to fit both our calendars). The call itself runs 30-45 minutes over video, and by the end of it you'll know whether outbound is the right spend for you right now — including if the honest answer is no.",
    prepLine:
      "A few things worth having ready before we talk, so the 30-45 minutes goes further: a one-line description of what you sell, the regions you're targeting, and a rough picture of where you want your pipeline to be in the next 90 days. No need to prepare slides or a formal brief — a plain-spoken answer to each is plenty.",
    reachOutLine: "If anything changes on your end, or you'd rather sort scheduling directly instead of waiting on email, you can reach me any of these ways:",
    signoff: "Talk soon,\n— Sampath Kumar",
  });
}

export interface CourseAccessEmailTemplate {
  subject: string;
  introLine: string;
  keepSafeLine: string;
  signoff: string;
}

export async function getCourseAccessEmailTemplate(): Promise<CourseAccessEmailTemplate> {
  return getSiteContent<CourseAccessEmailTemplate>("email_course_access", {
    subject: "Your Lead Generation course access code",
    introLine: "Thank you for enrolling in the Lead Generation course.",
    keepSafeLine: "Keep this email safe — you will need the code again if you switch devices or clear your browser.",
    signoff: "— Sampath Kumar",
  });
}

export interface SchedulePaymentReceiptTemplate {
  subject: string;
  paidLine: string;
  confirmLine: string;
  signoff: string;
}

export async function getSchedulePaymentReceiptTemplate(): Promise<SchedulePaymentReceiptTemplate> {
  return getSiteContent<SchedulePaymentReceiptTemplate>("email_schedule_receipt", {
    subject: "Receipt — your setup call payment",
    paidLine:
      "We've received your payment of {{amount}} for the one-time setup call — infrastructure, tool estimation, methodology and process flow.",
    confirmLine: "Sampath will confirm the exact time by email shortly.",
    signoff: "— Sampath Kumar",
  });
}

/* ---------------------------------------------------------------------- */
/* Phase 5 — the course itself, one site_content row per chapter          */
/* ---------------------------------------------------------------------- */

export const COURSE_CHAPTER_KEYS = [
  "course_chapter_1",
  "course_chapter_2",
  "course_chapter_3",
  "course_chapter_4",
  "course_chapter_5",
  "course_chapter_6",
  "course_chapter_7",
  "course_chapter_8",
  "course_chapter_9",
] as const;

export type CourseChapterKey = (typeof COURSE_CHAPTER_KEYS)[number];

export async function getGuideChapter(index: number): Promise<GuideChapter> {
  const key = COURSE_CHAPTER_KEYS[index];
  const fallback = GUIDE_DOCUMENT.chapters[index];
  return getSiteContent<GuideChapter>(key, deepMutable(fallback));
}

/**
 * The live course document — title/subtitle stay static (not worth an admin
 * field), but every chapter is its own site_content row so an edit to one
 * chapter's content never risks another's.
 */
export async function getGuideDocument(): Promise<GuideDocument> {
  const chapters = await Promise.all(COURSE_CHAPTER_KEYS.map((_, i) => getGuideChapter(i)));
  return { title: GUIDE_DOCUMENT.title, subtitle: GUIDE_DOCUMENT.subtitle, chapters };
}

export interface CourseGrantEmailTemplate {
  subject: string;
  introLine: string;
  windowLine: string;
  signoff: string;
}

export async function getCourseGrantEmailTemplate(): Promise<CourseGrantEmailTemplate> {
  return getSiteContent<CourseGrantEmailTemplate>("email_course_grant", {
    subject: "Your access to the Lead Generation system",
    introLine:
      "Here is the full lead generation system I run — ICP, research, infrastructure, campaigns, tracking and the numbers, written out in 40 sections.",
    windowLine: "Your {{window}} of access starts when you open it, not now — so there is no rush to click.",
    signoff: "— Sampath Kumar",
  });
}
