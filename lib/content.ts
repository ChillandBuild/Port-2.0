/**
 * Site copy, typed. Every string the homepage renders lives here so the
 * components stay presentational and the copy stays reviewable in one place.
 */

export const IDENTITY = {
  name: "Sampath Kumar",
  role: "Pre Sales Head · Lead Generation",
  location: "Coimbatore, Tamil Nadu, India",
  phone: "+91 99949 69699",
  phoneHref: "tel:+919994969699",
  linkedin: "https://www.linkedin.com/in/sampath-kumar-tn66sk9699",
  resume: "/assets/sampath-kumar-resume.pdf",
  tagline: "Every deal begins with hello.",
} as const;

/** The envelope rail. Four facts, framed the way an outbound message frames them. */
export const ENVELOPE = [
  { label: "To", value: "24 markets · NA · EU · APAC · MENA" },
  { label: "From", value: "Sampath Kumar, Coimbatore IN" },
  { label: "Re", value: "Pre-sales & lead generation" },
  { label: "Sent", value: "7+ years of hellos" },
] as const;

export const NAV = [
  { label: "About", href: "#about" },
  { label: "Case studies", href: "#track-record" },
  { label: "Hire me", href: "/hire" },
  { label: "Résumé", href: IDENTITY.resume },
  { label: "Schedule a call", href: "#contact" },
] as const;

export const HERO = {
  eyebrow: "Pre Sales Head · Lead Generation",
  headline: ["Every deal", "begins with", "hello."],
  lede:
    "Engineer-turned-sales leader with 7+ years driving B2B & B2C SaaS growth, service-based private markets, fractional pre-sales, and global account expansion across 24 major markets all over the globe.",
  primaryCta: { label: "Hire me", href: "#contact" },
  secondaryCta: { label: "Work with me", href: "#work-plan" },
  stats: [
    { value: "7+", label: "Years in pre-sales", count: { to: 7, suffix: "+" } },
    { value: "24", label: "Markets reached", count: { to: 24 } },
    { value: "200M+", label: "Records mapped", count: { to: 200, suffix: "M+" } },
  ],
} as const;

export interface Greeting {
  word: string;
  market: string;
}

/**
 * The rotating "hello." — the markets he's actually sold into, felt rather
 * than read. Sourced from `Portfolio/linkedin-profile.md`, not invented: US,
 * UK, Europe, Australia, New Zealand, Singapore, Malaysia, UAE, Kuwait, India,
 * Canada, MENA. Latin transliteration throughout, so every greeting sets in
 * the same serif — one typeface, no fallback jumble.
 */
export const GREETINGS: Greeting[] = [
  { word: "Vanakkam.", market: "India" },
  { word: "Hello.", market: "US & UK" },
  { word: "G'day.", market: "Australia" },
  { word: "Kia ora.", market: "New Zealand" },
  { word: "Nǐ hǎo.", market: "Singapore" },
  { word: "Selamat.", market: "Malaysia" },
  { word: "Marhaba.", market: "UAE & Kuwait" },
  { word: "Bonjour.", market: "France & Canada" },
  { word: "Hallo.", market: "Germany" },
  { word: "Hola.", market: "Spain" },
  { word: "Ciao.", market: "Italy" },
  { word: "Hej.", market: "Nordics" },
];

export const GREETING_MS = 2600;

/** The signature element: a cold open he'd actually send. */
export const DRAFT = {
  status: "Draft · 09:14 IST",
  tag: "Cold open",
  subject: "Worth twenty minutes?",
  body: [
    "I map private companies for a living — 200M+ of them — and route the ones that fit your thesis into your calendar, not your inbox.",
    "An engineer's head, a salesperson's calendar. If the fit is wrong I'll say so on the call.",
  ],
  replyLabel: "Lead-to-meeting lift",
  replyValue: "+35%",
} as const;

export interface LedgerRow {
  value: string;
  suffix?: string;
  label: string;
  source: string;
  /** Set only where the figure is a single number that can honestly count up. */
  count?: { to: number; prefix?: string; suffix?: string; decimals?: number };
  countRange?: { from: number; to: number; prefix?: string; suffix?: string };
}

export const LEDGER: LedgerRow[] = [
  {
    value: "+35%",
    label: "Lift in lead-to-meeting conversion, from thesis-matched messaging.",
    source: "Mid-market M&A · Finquest",
    count: { to: 35, prefix: "+", suffix: "%" },
  },
  {
    value: "300+",
    label: "Enterprise marketing qualified leads generated per year.",
    source: "Telecom SaaS · Ecosmob Technologies",
    count: { to: 300, suffix: "+" },
  },
  {
    value: "18–25",
    label: "Qualified pipeline meetings per client seat, per month.",
    source: "6 tech verticals · The Sales Group",
    countRange: { from: 18, to: 25 },
  },
  {
    value: "1.2%",
    label: "Email bounce ceiling held on every list, through multi-stage verification.",
    source: "Deliverability · Finquest",
    count: { to: 1.2, suffix: "%", decimals: 1 },
  },
  {
    value: "+30%",
    label: "Increase in deal velocity on complex enterprise deals.",
    source: "Pre-sales · Zinnov & Draup",
    count: { to: 30, prefix: "+", suffix: "%" },
  },
];

export const ABOUT = {
  eyebrow: "Pre-sales leadership & fractional strategy",
  heading: "Building high-volume lead generation and pre-sales engines.",
  body: [
    "I bring an engineer's analytical rigour to B2B and B2C outbound lead generation, automated prospect enrichment, and pre-sales deal architecture — specialising in B2B SaaS, service-based private markets, and global account expansion.",
    "From structuring multi-channel cold email and LinkedIn cadences to running enterprise solution demos, delivering Marketing Qualified Leads, and managing commercial proposal handoffs, I engineer pipelines that convert targeted prospects into booked meetings.",
  ],
  stamp: "7+ years",
  exchange: {
    asked: "How does an engineer end up in sales?",
    answered: "An engineer's head, a salesperson's calendar.",
  },
  facts: [
    { label: "Diploma", value: "Diploma in Mechanical Engineering, Sree Narayana Guru Polytechnic College" },
    { label: "Engineering", value: "B.E. Mechanical, Sri Krishna College of Technology · 2020" },
    { label: "Business", value: "MBA Marketing, Amrita Vishwa Vidyapeetham · 2026" },
  ],
} as const;

export interface Stage {
  no: string;
  name: string;
  description: string;
}

export const PIPELINE: Stage[] = [
  { no: "01", name: "Understand ICP", description: "Segment the market, map the buyer journey, define who's actually worth reaching." },
  { no: "02", name: "Research", description: "Account and market intelligence from Draup, ZoomInfo, Crunchbase, and direct web research." },
  { no: "03", name: "Prospect", description: "Source contacts and verify them through multi-stage checks before they ever get an email." },
  { no: "04", name: "Outreach", description: "Multi-channel cadences across cold email and LinkedIn, monitored for SPF, DKIM and DMARC health." },
  { no: "05", name: "Qualification", description: "Track hand-raiser quality, not just volume, and report it back to sales and research." },
  { no: "06", name: "Meeting", description: "Schedule discovery calls and demos, connect qualified prospects with Account Executives." },
  { no: "07", name: "Pipeline", description: "CRM data management and funnel reporting, with ROI defined before a campaign ever launches." },
  { no: "08", name: "Growth", description: "OKR-aligned production plans, team training and process fixes feed straight into the next cycle." },
];

export interface Sector {
  tag: string;
  title: string;
  description: string;
  /** Core verticals lead the section and take the accent treatment. */
  core?: boolean;
}

export const SECTORS: Sector[] = [
  { tag: "SaaS", title: "B2B & B2C SaaS", description: "High-velocity growth across IT and SaaS platforms.", core: true },
  { tag: "Markets", title: "Service-based private markets", description: "Global account expansion and deal origination.", core: true },
  { tag: "Services", title: "Digital marketing & translation", description: "Performance-driven outreach for MarTech agencies and localisation firms.", core: true },
  { tag: "Staffing", title: "Staffing & recruiting", description: "Fractional pre-sales and BDR talent acceleration." },
  { tag: "Health", title: "MediTech, pharma & healthcare", description: "B2B lead gen across MedTech startups, pharma, and hospital networks." },
  { tag: "Finance", title: "Banking, finance & BPO", description: "Financial service pipelines and back-end solutions." },
  { tag: "Commerce", title: "E-commerce, retail & aviation", description: "Omnichannel B2B and B2C campaign strategy." },
  { tag: "Education", title: "EdTech & institutions", description: "Institutional lead gen and consultative selling." },
  { tag: "Engineering", title: "Energy, utilities & engineering", description: "Technical proposal scoping and enterprise demos." },
];

export interface ToolGroup {
  name: string;
  tools: string[];
  description: string;
}

export const TOOL_GROUPS: ToolGroup[] = [
  {
    name: "Prospecting & intent",
    tools: ["Sales Nav", "Apollo", "ZoomInfo", "Crunchbase", "Lusha", "Cognism", "Hunter", "Lemlist"],
    description: "Executive lead discovery, buyer intent signals, direct dial and email verification, growth trigger tracking.",
  },
  {
    name: "CRM & pipeline OS",
    tools: ["Salesforce", "HubSpot", "Pipedrive", "Zoho", "Close"],
    description: "Pipeline data hygiene, automated lead routing, deal stage tracking, and executive reporting.",
  },
  {
    name: "n8n & agentic AI",
    tools: ["n8n Workflows", "Agentic AI Tools", "Clay", "Instantly.ai", "Smartlead", "PhantomBuster"],
    description: "Workflow automation, agentic lead enrichment, personalised outreach, and deliverability infrastructure.",
  },
  {
    name: "Intelligence & pre-sales",
    tools: ["Finquest AI", "PitchBook", "CB Insights", "Gong.io", "Draup AI", "Chorus"],
    description: "Mid-market M&A database mapping, deal intelligence, call analytics, and proposal engineering.",
  },
];

export interface Role {
  company: string;
  title: string;
  dates: string;
  place: string;
  summary: string;
  result: string;
}

export const ROLES: Role[] = [
  {
    company: "Finquest",
    title: "Senior Lead Generation Manager",
    dates: "Jul 2024 – Sep 2025",
    place: "Bengaluru, India",
    summary:
      "Led outbound strategy for sourcing proprietary mid-market M&A opportunities across North America, Europe and APAC. Built target lists on Finquest's AI platform using firmographic filters, trigger events and investment signals, and ran a cross-functional team of researchers and outreach specialists on email and LinkedIn. Owned CRM pipeline hygiene and the tracking behind lead quality and conversion stages.",
    result: "+35% lead-to-meeting conversion · 200M+ private companies mapped",
  },
  {
    company: "The Sales Group",
    title: "Lead Generation Manager",
    dates: "Jan 2024 – Jun 2024",
    place: "Toronto, Canada (remote)",
    summary:
      "Fractional SDR leadership for North American business owners buying part-time BD support, fractional sales leadership and permanent sales-team placement. Built a custom outbound strategy per client against their ICP and growth goals, managed part-time BDR resources, and launched and optimised email and LinkedIn campaigns by industry and vertical.",
    result: "18–25 meetings per seat, per month",
  },
  {
    company: "Uplers & Mavlers",
    title: "Business Development Manager",
    dates: "May 2023 – Dec 2023",
    place: "Ahmedabad, India",
    summary:
      "Cross-border outbound across the US, UK, Africa and Asia for two sister agency brands. Ran QA on team-generated data lists and verified uploads into Salesforce, built segmented databases of investors and strategic partners, and produced daily performance reporting for the senior marketing director alongside prospect, company and competitive analysis.",
    result: "Bounce rate held under 1.5%",
  },
  {
    company: "Ecosmob Technologies",
    title: "Lead Generation Manager",
    dates: "Jun 2022 – Apr 2023",
    place: "Ahmedabad, India",
    summary:
      "Led a lead-generation team serving a diverse client portfolio for enterprise VoIP and telecom SaaS platforms, with territory-based allocation across the US, UK, MENA and APAC. Ran automated inbound and outbound email campaigns through Sales Navigator and CRM tooling, designed the outreach templates, and built the monthly conversion and engagement analytics.",
    result: "300+ enterprise MQLs a year",
  },
  {
    company: "Alore (Growth OS)",
    title: "Lead Generation Specialist",
    dates: "Apr 2021 – May 2022",
    place: "Bengaluru, India",
    summary:
      "In-depth prospect research and qualification — domain expertise, product fit and system requirements — feeding targeted outbound email campaigns across the US, UK and Australia. Handled client communication and appointment setting, and oversaw lead assignment and QA workflows across research, outreach and sales, with daily and monthly bounce and lead reporting.",
    result: "Research, QA and reporting rigour",
  },
  {
    company: "Zinnov & Draup",
    title: "Lead Generation Specialist (Pre-Sales Lead)",
    dates: "Jul 2020 – Mar 2021",
    place: "Coimbatore, India",
    summary:
      "Solution consulting across IT and non-IT domains in the Digital & Analytics portfolio, with product depth in core HR, workforce management, talent acquisition, reskilling and diversity. Generated and validated leads through targeted research and cold calling, ran product demos, prepared commercial and technical proposals, and scoped projects with time and resource estimates.",
    result: "Deal velocity up 30%",
  },
];

/* Education used to run as its own section (see git history for the removed
   Qualification/EDUCATION shape). Both degrees are now stated inline as two
   rows in ABOUT.facts instead — a full section was doing a fact list's job,
   and it repeated the "engineer into sales" point Positioning already makes. */

export interface EstimatorSector {
  key: string;
  label: string;
  /** Share of monthly lead volume that becomes a booked meeting / MQL. */
  meetingRate: number;
  /** Fixed monthly tool spend before per-lead enrichment cost. */
  baseToolCost: number;
  /** Added tool cost per lead in the monthly volume. */
  costPerLead: number;
}

export interface EstimatorTier {
  /** Applies when monthly volume is at or below this number. */
  upTo: number;
  label: string;
}

/**
 * A model, not a claim. The rates below are the same ones the earlier site
 * shipped; they describe the method on this page, not a guaranteed outcome, and
 * the component labels itself as an estimate wherever it renders.
 */
export const ESTIMATOR = {
  eyebrow: "Interactive estimator",
  heading: "Estimate pipeline outcomes for your target market.",
  body:
    "Set a market focus and a target monthly lead volume to model projected meeting conversions, the research cycle, and the tool spend behind them.",
  volume: { min: 30, max: 400, step: 10, default: 120, unit: "leads / mo" },
  researchCycle: "30 days, held constant",
  note:
    "A model, not a quote. The monthly figure is a steady-state rate — the ramp row is how long it takes to reach it, and months inside that window run below it. The conversion rates track the method on this page; a real number comes out of a scoping call.",
  toolsLink: { label: "See the stack behind the cost", href: "#range" },
  /** Surfaced right under the modelled numbers, where interest in a real
   *  answer peaks — the same free first call CONTACT and SCHEDULE describe,
   *  said again at the moment it's most likely to be acted on. */
  freeCallNote: {
    text: "First call is free — 30 to 45 minutes to go through your numbers.",
    cta: { label: "Say hello", href: "#contact" },
  },
  sectors: [
    { key: "saas", label: "B2B SaaS growth", meetingRate: 0.15, baseToolCost: 450, costPerLead: 5 },
    { key: "services", label: "Service-based sector", meetingRate: 0.12, baseToolCost: 350, costPerLead: 4 },
    { key: "midmarket", label: "Mid-market & digital marketing", meetingRate: 0.14, baseToolCost: 500, costPerLead: 6 },
  ] as EstimatorSector[],
  mqlTiers: [
    { upTo: 30, label: "45–90 days" },
    { upTo: 70, label: "75–100 days" },
    { upTo: 120, label: "90–120 days" },
    { upTo: 180, label: "110–140 days" },
    { upTo: 250, label: "130–160 days" },
    { upTo: Number.POSITIVE_INFINITY, label: "150–180 days" },
  ] as EstimatorTier[],
};

export interface EstimateResult {
  sector: EstimatorSector;
  /** Booked meetings / MQL leads per month, at steady state (min 1). */
  meetings: number;
  /** Modelled monthly tool spend. */
  toolsCost: number;
  /** How long before output reaches the steady-state rate above. */
  rampLabel: string;
}

/**
 * The one estimator model. Both the interactive panel and the chat route call
 * this — do not re-implement the arithmetic anywhere else. Output is a pure
 * function of monthly lead volume and sector key; an unknown key falls back to
 * the first sector.
 */
export function estimateOutcome(leads: number, sectorKey: string): EstimateResult {
  const sector = ESTIMATOR.sectors.find((s) => s.key === sectorKey) ?? ESTIMATOR.sectors[0];
  const tiers = ESTIMATOR.mqlTiers;
  return {
    sector,
    meetings: Math.max(1, Math.round(leads * sector.meetingRate)),
    toolsCost: sector.baseToolCost + leads * sector.costPerLead,
    rampLabel: (tiers.find((tier) => leads <= tier.upTo) ?? tiers[tiers.length - 1]).label,
  };
}

export const LINKEDIN = {
  eyebrow: "Live LinkedIn impact",
  heading: "Where the inbound arrives from.",
  body:
    "Verified Creator Analytics and Social Selling Index framework driving steady B2B and B2C inbound leads.",
  stats: [
    { value: "10,000+", label: "Followers", count: { to: 10000, suffix: "+" } },
    { value: "2.6M+", label: "Impressions", count: { to: 2.6, suffix: "M+", decimals: 1 } },
  ],
  chart: {
    title: "Audience momentum",
    subtitle: "Organic impressions over time",
    caption: "Illustrative trend — connect actual analytics for production",
    legend: "Organic impressions",
    months: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    /** Relative index, not absolute impressions. Peaks are campaign months. */
    values: [28, 41, 36, 62, 88, 71, 84, 96, 78],
    marker: { index: 7, label: "10K followers" },
  },
} as const;

export const WORK_PLAN = {
  eyebrow: "Sampath work plan",
  heading: "Tools first. Pay when leads land.",
  body:
    "You control the spend. Results arrive before the retainer does.",
  steps: [
    {
      no: "01",
      name: "Pay for tools only",
      description: "The mandatory tool stack is activated. You pay direct tool cost — no markup, no retainer yet.",
    },
    {
      no: "02",
      name: "Research & build",
      description: "ICP definition, account research, prospect sourcing, and a multi-channel cadence built and launched.",
    },
    {
      no: "03",
      name: "Leads flow — pay for results",
      description: "MQL leads and qualified meetings delivered. Payment is linked to conversion, not activity.",
    },
  ],
} as const;

export interface Post {
  topic: string;
  title: string;
  summary: string;
  /** Direct permalink to the LinkedIn post, so "Read post on LinkedIn" opens
   *  the post itself rather than the profile. */
  url: string;
}

export const POSTS: Post[] = [
  {
    topic: "Lead gen strategy",
    title: "Achieving +35% lift in lead-to-meeting conversions",
    summary: "Why hyper-segmented industry value propositions outperform generic cold outreach across private markets.",
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7329332336322400256/",
  },
  {
    topic: "Pre-sales engineering",
    title: "Bridging complex SaaS features to C-suite value",
    summary: "How structured product demos and proposal scoping turn discovery calls into confident closures.",
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7406615365746823170/",
  },
  {
    topic: "Market intelligence",
    title: "Mapping 200M+ global private companies",
    summary: "Building proprietary database architectures for PE deal sourcing and target acquisition modelling.",
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7373673254269628416/",
  },
  {
    topic: "Global expansion",
    title: "Navigating 24 international markets",
    summary: "Adapting cadences and buyer communication norms across North America, Europe, APAC and MENA.",
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7404506078937292800/",
  },
];

export const CONTACT = {
  eyebrow: "Reply",
  heading: "Start a conversation. I'll say hello first.",
  body:
    "First call is free — 30 to 45 minutes to unpack your pipeline and strategy. Sessions run against IST availability.",
  terms: [
    { label: "First call", value: "Free, 30–45 min" },
    { label: "Second call", value: "USD 350, 1 hour" },
    { label: "Format", value: "Remote, IST hours" },
    { label: "Booking", value: "After approval" },
  ],
  note:
    "A payment link and IST slot selector appear here once payment setup is approved. Until then, reach me on LinkedIn or by phone.",
  primaryCta: { label: "Connect on LinkedIn", href: IDENTITY.linkedin },
  secondaryCta: { label: "Call +91 99949 69699", href: IDENTITY.phoneHref },
} as const;

/** The dedicated /schedule page. Two-call model: a free strategy call, then a
 * paid setup session — sourced from the live Portfolio/schedule/index.html,
 * which supersedes the single-session offer this site launched with. */
export const SCHEDULE = {
  eyebrow: "Strategy calendar",
  headline: ["You bring the idea. I'll bring the ", "plan", "."],
  freeBadge: ["Free", "Free", "Free"],
  sub: {
    lead: "First call is free",
    rest: " — 30 to 45 minutes to unpack your pipeline and strategy.",
  },
  summary: [
    { title: "First call — free", detail: "30–45 min · Strategy & pipeline deep-dive", free: true },
    { title: "USD 350 — 1 hour setup", detail: "Infrastructure · Tool alignment · Methodology" },
    { title: "Remote (IST)", detail: "Video call, Indian Standard Time" },
    { title: "After approval", detail: "Payment link & scheduling instructions" },
  ],
  paymentStatus: {
    eyebrow: "Payment & calendar setup",
    body: "Payment link will be added after approval. A live booking button and slot selector will appear here once account setup is approved.",
  },
  fallback: {
    eyebrow: "Direct contact & LinkedIn",
    heading: "Start a conversation with Sampath",
    body: "Connect via LinkedIn or phone. First call is free (30–45 min). Second call is USD 350 for one hour — infrastructure setup, tool alignment and methodology deep-dive.",
    primaryCta: { label: "Connect on LinkedIn", href: IDENTITY.linkedin },
    secondaryCta: { label: "View case studies", href: "/#history" },
  },
  links: [
    { label: "Explore lead-gen background", href: "/#range" },
    { label: "Review case studies", href: "/#history" },
  ],
} as const;

export const FOOTER = {
  wordmark: "Sampath Kumar",
  tagline: IDENTITY.tagline,
  fineprint: "© 2026 Sampath Kumar · Coimbatore, Tamil Nadu, India",
  backToTop: "Back to top",
  groups: [
    {
      title: "Site",
      links: [
        { label: "About", href: "/#about" },
        { label: "Lead generation", href: "/lead-generation" },
        { label: "Case studies", href: "/case-studies" },
        { label: "Hire me", href: "/hire" },
        { label: "Range", href: "/#range" },
        { label: "Résumé", href: IDENTITY.resume },
        { label: "Schedule", href: "/schedule" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Terms of service", href: "/terms" },
        { label: "Privacy policy", href: "/privacy" },
        { label: "Refunds & cancellations", href: "/refunds" },
      ],
    },
    {
      title: "Contact",
      links: [
        { label: "LinkedIn", href: IDENTITY.linkedin },
        { label: IDENTITY.phone, href: IDENTITY.phoneHref },
      ],
    },
  ],
} as const;

/**
 * Legal pages — /terms, /privacy, /refunds. Source copy is SITE-CONTENT.md §13
 * ("Legal and policy content"), which is the facts-only record; these documents
 * render that text and carry no design intent.
 */

export interface LegalSection {
  heading: string;
  body: string[];
}

export interface LegalDoc {
  title: string;
  eyebrow: string;
  updated: string;
  sections: LegalSection[];
}

/** Shared close for all three policy pages. The contact channels are IDENTITY's. */
export const LEGAL_CONTACT = {
  eyebrow: "Questions",
  body: "Questions about this policy go through LinkedIn or the phone number on this site.",
  linkedinLabel: "Connect on LinkedIn",
  phoneLabel: IDENTITY.phone,
} as const;

const LEGAL_UPDATED = "Last updated 2 August 2026";

export const TERMS: LegalDoc = {
  title: "Terms of service",
  eyebrow: "Re: terms of service",
  updated: LEGAL_UPDATED,
  sections: [
    {
      heading: "The service",
      body: [
        "One-to-one remote consulting for lead generation, outbound strategy, pre-sales and related commercial pipeline work. The standard paid offer is a 60-minute online consultation at USD 350. This is a remote service; no physical product is sold and no shipping applies.",
      ],
    },
    {
      heading: "Booking and payment",
      body: [
        "A consultation is confirmed only once the appointment is accepted and payment is received. Payment instructions or a payment link are provided after payment setup is approved. Where a payment link is used, the payment is processed by the named provider; card details are not stored on this website.",
      ],
    },
    {
      heading: "Delivery",
      body: [
        "After payment, the client receives confirmation and scheduling instructions via the contact details they provide. The session runs online on an agreed video-call platform. The client is responsible for accurate contact details, joining on time, and a suitable connection.",
      ],
    },
    {
      heading: "Client responsibilities",
      body: [
        "Provide accurate booking and contact information; share only information they are authorised to share; use any strategy or recommendation at their own business risk; do not record or redistribute a session without prior agreement.",
      ],
    },
    {
      heading: "Cancellations and refunds",
      body: [
        "Governed by the refund and cancellation policy. Booking constitutes agreement to it.",
      ],
    },
    {
      heading: "Intellectual property",
      body: [
        "General methods, frameworks and examples remain the property of their respective owners. A client may use advice from their own session for internal business purposes, but may not resell or publish the material as their own training product.",
      ],
    },
    {
      heading: "No guaranteed outcome",
      body: [
        "Consulting is advisory. No specific revenue, lead, conversion, hiring or investment outcome is guaranteed. The client remains responsible for decisions and implementation.",
      ],
    },
    {
      heading: "Contact",
      body: [
        "Questions about these terms or a booking go through LinkedIn or the phone number on this site.",
      ],
    },
  ],
};

export const PRIVACY: LegalDoc = {
  title: "Privacy policy",
  eyebrow: "Re: privacy policy",
  updated: LEGAL_UPDATED,
  sections: [
    {
      heading: "Information collected",
      body: [
        "Depending on how someone makes contact or books: name, contact details, company information, booking preferences, consultation notes they choose to share, and payment or refund status. This site does not ask for or store full card numbers, CVV codes, or banking passwords.",
      ],
    },
    {
      heading: "How it is used",
      body: [
        "To reply to enquiries and provide requested information; to schedule, deliver, reschedule or refund a consultation; to maintain transaction and service records; to improve the clarity and reliability of the site and service.",
      ],
    },
    {
      heading: "Payment and service providers",
      body: [
        "Where a payment provider is used, payment details are entered on that provider's secure page under its own privacy policy. Only the information needed to confirm the transaction and deliver the service is used by Sampath Kumar. No physical shipping applies.",
      ],
    },
    {
      heading: "Sharing and retention",
      body: [
        "Information may be shared with service providers assisting with scheduling, communications, payment processing or video calls. It is not sold as a mailing list. It is retained only as long as reasonably needed for the service, accounting, dispute handling, or legal obligations.",
      ],
    },
    {
      heading: "Your choices",
      body: [
        "You may ask what personal information is held, request correction of inaccurate information, or ask a service-related question. Some records may need to be retained for accounting, security or legal reasons.",
      ],
    },
    {
      heading: "Contact",
      body: [
        "Privacy questions go through LinkedIn or the phone number on this site.",
      ],
    },
  ],
};

export const REFUNDS: LegalDoc = {
  title: "Refund & cancellation policy",
  eyebrow: "Re: refunds & cancellations",
  updated: LEGAL_UPDATED,
  sections: [
    {
      heading: "Cancelling before the session",
      body: [
        "A full refund is available when the client cancels at least 24 hours before the scheduled start time, requested through the same contact method used for booking.",
      ],
    },
    {
      heading: "Rescheduling",
      body: [
        "One reschedule may be requested at least 24 hours before the session, subject to availability, normally within 30 days of the original booking.",
      ],
    },
    {
      heading: "Late cancellation or no-show",
      body: [
        "Cancellations made less than 24 hours before the session, or a missed session without notice, may not qualify for a refund. A reschedule may be offered at his discretion.",
      ],
    },
    {
      heading: "If he cancels",
      body: [
        "The client may choose a replacement time or receive a full refund for the undelivered session.",
      ],
    },
    {
      heading: "Refund processing",
      body: [
        "Approved refunds go to the original payment method through the payment provider. Timing depends on the provider and the client's bank or card issuer. No physical shipping applies.",
      ],
    },
    {
      heading: "Requesting one",
      body: [
        "Contact via LinkedIn or phone, including the booking name, scheduled time, and payment reference if available.",
      ],
    },
  ],
};

/**
 * The dedicated /lead-generation page. Copy draws on SITE-CONTENT.md §2 (what
 * he does) and reuses the typed process/model/stack already on the site
 * (PIPELINE, WORK_PLAN, TOOL_GROUPS) so the page cannot drift from the rest.
 */
export const LEADGEN = {
  eyebrow: "Lead generation",
  headline: "Outbound, engineered like a pipeline.",
  lede: "I build and run outbound lead generation and pre-sales systems for B2B and B2C companies — defining who is worth contacting, researching and sourcing those contacts, running multi-channel outreach, qualifying the replies, booking meetings, and handing qualified prospects to account executives with the CRM data and reporting to match.",
  meaningHeading: "What that means in practice.",
  meaning: [
    "It is the whole funnel, run as one system: the ideal customer profile is defined, the accounts researched, the contacts sourced and verified, the cadence launched, the replies qualified, and the meetings booked with the data to back the hand-off.",
    "The same system also carries direct pre-sales work — discovery calls, enterprise product demos, RFP and proposal responses, and ROI modelling for C-suite buyers.",
  ],
  processEyebrow: "The method",
  processHeading: "Eight stages, in order.",
  processBody: "Each depends on the one before it. This is the sequence the homepage world runs as you scroll.",
  modelEyebrow: "The engagement model",
  modelHeading: WORK_PLAN.heading,
  modelBody: WORK_PLAN.body,
  stackEyebrow: "The stack",
  stackHeading: "The tools the pipeline runs on.",
  stackBody: "Grouped by what they do — finding prospects, managing the pipeline, automating the work, and the market intelligence behind it.",
  cta: {
    heading: "Want this running for your pipeline?",
    body: "Start with a free strategy call, then a performance-linked setup — pay the tool cost first, and pay for results once qualified leads and meetings are landing.",
    primary: { label: "Schedule a call", href: "/schedule" },
    secondary: { label: "Connect on LinkedIn", href: IDENTITY.linkedin },
  },
} as const;

/**
 * The /case-studies page. Content is gated: a visitor enters an email and a
 * phone number, and the case studies open below. Employers are named and the
 * figures come from ROLES / SITE-CONTENT.md — nothing here is invented.
 */
export const CASE_STUDIES = {
  eyebrow: "Case studies",
  title: "The proof, opened on request.",
  lede: "Named employers, real numbers — each case is a role with the work and the result. Leave an email and a phone number to unlock them.",
  gate: {
    eyebrow: "Unlock",
    heading: "Case studies are behind a short gate.",
    body: "An email and a phone number open them below. The unlock is remembered in this browser only.",
    emailLabel: "Email",
    phoneLabel: "Phone",
    emailPlaceholder: "you@company.com",
    phonePlaceholder: "+91 99999 99999",
    submit: "Unlock case studies",
    emailInvalid: "Enter a valid email address.",
    phoneInvalid: "Enter a valid phone number.",
    note: "The unlock is remembered in this browser. Your email and phone reach Sampath directly — nothing else.",
  },
  unlockedEyebrow: "Unlocked",
  unlockedHeading: "Six engagements, named.",
  unlockedBody: "Each role is a case study: the work, then the headline result.",
  workLabel: "The work",
  resultLabel: "The result",
  footnote: "Employers and figures as recorded in the source content.",
} as const;

/**
 * The /hire page. Built for a recruiter reading this in a DM: an 8-second
 * answer up top, then the actual pre-sales move instead of a static
 * portfolio — a worked teardown (see TEARDOWN below), applied to a real
 * company, followed by "want this for yours?" and a capture form. A lane
 * toggle (hiring vs. buying) swaps only the money & fit section; every other
 * block is shared between both readers.
 */
export const HIRE = {
  eyebrow: "Hire",
  title: "Send your domain. I'll show you the outbound.",
  lede: "A DM from a recruiter usually asks for two things: past work, and a price. This page answers both in under a minute — then shows exactly how the outbound would run for your company, instead of just claiming it can.",
  card: {
    eyebrow: "The 8-second version",
    availability: "Open to full-time roles and fractional / contract engagements.",
    timezone: "Coimbatore, India · GMT+5:30 — replies land across IST, GMT and PT hours.",
    stackNote: "Runs on: " + TOOL_GROUPS.flatMap((group) => group.tools).slice(0, 6).join(" · ") + " and more",
    resumeCta: { label: "Résumé", href: IDENTITY.resume },
    contactCta: { label: "Message on LinkedIn", href: IDENTITY.linkedin },
  },
  lane: {
    heading: "Which one are you?",
    hiringLabel: "Hiring for a role",
    buyingLabel: "Buying outbound",
    hiringHint: "Full-time or fractional leadership.",
    buyingHint: "A client project, agency, or engagement.",
  },
  teardownIntro: {
    eyebrow: "How I'd actually run this",
    heading: "Not a portfolio. A worked example.",
    body: "Anyone can list numbers from old jobs. Here's the method instead: a full outbound teardown, built the way it would be built for you — on a company everyone already knows, so nothing here is a real client's data.",
  },
  captureCta: {
    heading: "Want this built for your company?",
    body: "Send a domain and the same teardown gets run on it — real ICP, real triggers, real message — back within a day.",
    domainLabel: "Company domain",
    emailLabel: "Work email",
    nameLabel: "Name",
    domainPlaceholder: "acme.com",
    emailPlaceholder: "you@acme.com",
    namePlaceholder: "Jane Doe",
    domainInvalid: "Enter a company domain, like acme.com.",
    emailInvalid: "Enter a valid work email address.",
    nameInvalid: "Enter your name.",
    submit: "Send it over",
    success: "Sent. A reply lands within a day — check the email you gave.",
    error: "Something broke on this end. Try LinkedIn instead — link below.",
    note: "Goes straight to Sampath's inbox. No newsletter, no CRM signup.",
  },
  moneyFit: {
    hiring: {
      eyebrow: "For recruiters",
      heading: "What I'm looking for, and what it costs.",
      compLabel: "Expected compensation",
      compBand: "Market rate for a Pre-Sales / Lead Generation leadership role in your region — open to a real conversation rather than a fixed number on a page.",
      points: [
        "7+ years running outbound and pre-sales across 24 markets — NA, EU, APAC, MENA.",
        "Built and led research and outreach teams, not only individual-contributor work.",
        "Comfortable owning a number: pipeline, MQLs, meetings booked, CRM hygiene.",
      ],
    },
    buying: {
      eyebrow: "For buyers",
      heading: WORK_PLAN.heading,
      body: WORK_PLAN.body,
      rateLabel: "Strategy call",
      rateValue: "Free · 30–45 min",
      sessionLabel: "Setup session",
      sessionValue: "USD 350 · 1 hour",
    },
  },
  stackIntro: {
    eyebrow: "The stack",
    heading: "The tools this runs on.",
  },
  resultsIntro: {
    eyebrow: "Results",
    heading: "What the method has actually produced.",
  },
  proofLink: {
    eyebrow: "Deeper proof",
    heading: "Real named clients, on request.",
    body: "The teardown above is illustrative, on purpose. The case studies behind it are real — named employers, real figures — gated behind a short form so it's clear who's asking.",
    cta: { label: "View case studies", href: "/case-studies" },
  },
  contact: {
    heading: "Or just say hello.",
    body: "First call is free. LinkedIn, phone, or the form above — whichever is faster.",
  },
} as const;

export interface TeardownSection {
  key: string;
  label: string;
  body?: string[];
  bullets?: string[];
  subject?: string;
  note?: string;
  stats?: { value: string; label: string }[];
}

/**
 * The public teardown. His method, applied in full to a real, globally
 * recognisable CONSUMER brand — deliberately outside every sector he has
 * actually sold into (see SITE-CONTENT.md: mid-market M&A/PE, fractional
 * SDR, HR-tech, telecom SaaS). No real data about the company appears
 * anywhere below: every account fact, trigger, and number is constructed to
 * demonstrate method, not a claim of engagement with that company.
 */
export const TEARDOWN = {
  brand: "Peloton",
  disclaimer: "Illustrative only. No real data about Peloton was used to build this — it's a worked example of method, not a claim of work done for them.",
  eyebrow: "Teardown",
  heading: "How I'd run B2B outbound for a brand like Peloton.",
  lede: "Peloton sells hardware to consumers, but it also runs a real B2B arm — Peloton Corporate Wellness — selling into hotels, gyms and corporate campuses. That's the account this teardown targets.",
  sections: [
    {
      key: "account",
      label: "The account",
      body: [
        "Peloton Corporate Wellness is a distinct business line inside Peloton, selling fleet hardware and content licensing to hotel groups, corporate campuses and gyms — not the consumer subscription most people know it for.",
        "The buyer here isn't a Peloton rider. It's a Director of Facilities, a VP of People, or a hotel brand's Head of Guest Experience — someone with a wellness or amenity budget and a reason to spend it this quarter.",
      ],
    },
    {
      key: "icp",
      label: "Segment logic",
      bullets: [
        "Hotel groups with 200+ properties currently renovating or opening amenity spaces — fitness is already a line item in that budget.",
        "Corporate campuses of 500+ employees with an active wellness stipend or a benefits refresh underway.",
        "Boutique gym chains expanding into a new metro, where branded hardware is a differentiator against a plain rack of dumbbells.",
      ],
    },
    {
      key: "triggers",
      label: "Trigger events",
      bullets: [
        "A property announces a renovation or a new opening — construction and amenity budgets are live.",
        "A company posts a new VP of People or Head of Workplace Experience — new leaders reopen vendor conversations in their first 90 days.",
        "A competitor's wellness contract nears renewal — tracked the same way a trigger-event tool tracks funding rounds.",
      ],
    },
    {
      key: "message",
      label: "Message reasoning",
      subject: "A line item for the renovation, not a new vendor search",
      body: [
        "Opens with the trigger, not the pitch — the renovation or the budget cycle, named specifically, so it reads as researched rather than templated.",
        "Names the actual decision Peloton Corporate Wellness sells into — amenity differentiation, not fitness for its own sake — so the reader feels understood in one line, not sold to.",
        "Closes with a specific, low-friction ask: a 15-minute call to see if the timing lines up. Never a generic \"let's connect.\"",
      ],
    },
    {
      key: "numbers",
      label: "Projected numbers",
      note: "Modelled, not real — the same \"a model, not a claim\" framing used everywhere else on this site.",
      stats: [
        { value: "~15%", label: "Modelled reply rate on trigger-matched sends" },
        { value: "<1.2%", label: "Bounce ceiling this list would be held to" },
        { value: "8–12", label: "Qualified meetings per month, at this account volume" },
      ],
    },
  ] as TeardownSection[],
} as const;
