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
  { label: "Resume", href: IDENTITY.resume },
  { label: "Schedule a call", href: "/schedule" },
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
    { value: "24", label: "Global markets reached", count: { to: 24 } },
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
    source: "Deliverability · Uplers & Mavlers",
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
  { tag: "Services", title: "Digital marketing conciliation and translation", description: "Performance-driven outreach for MarTech agencies and localisation firms.", core: true },
  { tag: "Staffing", title: "Staffing & recruiting", description: "Fractional pre-sales and BDR talent acceleration." },
  { tag: "Health", title: "MediTech, pharma & healthcare", description: "B2B lead gen across MedTech startups, pharma, and hospital networks." },
  { tag: "Finance", title: "Banking, finance & BPO", description: "Financial service pipelines and back-end solutions." },
  { tag: "Commerce", title: "E-commerce, retail & aviation", description: "Omnichannel B2B and B2C campaign strategy." },
  { tag: "Education", title: "EdTech & institutions", description: "Institutional lead gen and consultative selling." },
  { tag: "Engineering", title: "Energy, utilities & engineering", description: "Technical proposal scoping and enterprise demos." },
];

export interface ToolItem {
  name: string;
  url: string;
}

export interface ToolGroup {
  name: string;
  tools: ToolItem[];
  description: string;
}

export const TOOL_GROUPS: ToolGroup[] = [
  {
    name: "Prospecting & intent",
    tools: [
      { name: "Sales Nav", url: "https://business.linkedin.com/sales-solutions/sales-navigator" },
      { name: "Apollo", url: "https://www.apollo.io" },
      { name: "ZoomInfo", url: "https://www.zoominfo.com" },
      { name: "Crunchbase", url: "https://www.crunchbase.com" },
      { name: "Lusha", url: "https://www.lusha.com" },
      { name: "Cognism", url: "https://www.cognism.com" },
      { name: "Hunter", url: "https://hunter.io" },
      { name: "Lemlist", url: "https://www.lemlist.com" },
    ],
    description: "Executive lead discovery, buyer intent signals, direct dial and email verification, growth trigger tracking.",
  },
  {
    name: "CRM & pipeline OS",
    tools: [
      { name: "Salesforce", url: "https://www.salesforce.com" },
      { name: "HubSpot", url: "https://www.hubspot.com" },
      { name: "Pipedrive", url: "https://www.pipedrive.com" },
      { name: "Zoho", url: "https://www.zoho.com/crm/" },
      { name: "Close", url: "https://www.close.com" },
    ],
    description: "Pipeline data hygiene, automated lead routing, deal stage tracking, and executive reporting.",
  },
  {
    name: "n8n & agentic AI",
    tools: [
      { name: "n8n Workflows", url: "https://n8n.io" },
      { name: "Agentic AI Tools", url: "https://claude.ai" },
      { name: "Clay", url: "https://www.clay.com" },
      { name: "Instantly.ai", url: "https://instantly.ai" },
      { name: "Smartlead", url: "https://smartlead.ai" },
      { name: "PhantomBuster", url: "https://phantombuster.com" },
    ],
    description: "Workflow automation, agentic lead enrichment, personalised outreach, and deliverability infrastructure.",
  },
  {
    name: "Intelligence & pre-sales",
    tools: [
      { name: "Finquest AI", url: "https://finquest.com" },
      { name: "PitchBook", url: "https://pitchbook.com" },
      { name: "CB Insights", url: "https://www.cbinsights.com" },
      { name: "Gong.io", url: "https://www.gong.io" },
      { name: "Draup AI", url: "https://draup.com" },
      { name: "Chorus", url: "https://www.zoominfo.com/products/chorus" },
    ],
    description: "Mid-market M&A database mapping, deal intelligence, call analytics, and proposal engineering.",
  },
];

export interface Role {
  company: string;
  title: string;
  dates: string;
  place: string;
  /** Key deliverables, one per bullet — not a paragraph. */
  summary: string[];
  result: string;
}

export const ROLES: Role[] = [
  {
    company: "Emotii",
    title: "Lead Generation Manager",
    dates: "Mar 2026 – Present",
    place: "Bengaluru, India",
    summary: [
      "Lead Generation Strategy: managed market research and multi-channel outreach campaigns, increasing lead pipeline by 25%.",
      "Email & LinkedIn Campaigns: developed targeted outbound strategies using aged LinkedIn accounts and Waalaxy automation, compliant with GDPR and CAN-SPAM.",
      "CRM & Data Management: oversaw cold email campaigns, monitoring SPF, DKIM and DMARC records to maintain email account health.",
      "Automation & Prospecting Tools: worked across Clay, Mailchimp, HubSpot, Smartlead, Instantly and Buying Leads for data-driven outreach.",
      "Market Research & Analysis: delivered projects on prospecting, candidate sourcing, salary benchmarking and competitive analysis.",
      "Performance Tracking: designed monthly and daily production plans against OKRs, optimising lead handover to sales.",
    ],
    result: "+25% lead pipeline growth",
  },
  {
    company: "Finquest",
    title: "Lead Generation Manager",
    dates: "Jan 2024 – Dec 2025",
    place: "Bengaluru, India",
    summary: [
      "Demand Generation & Lead Qualification: executed campaigns with sales and marketing, improving lead quality, conversion and pipeline growth across SEA, MENA, US, UK, Singapore, Malaysia, Australia and Europe.",
      "Prospect Engagement & Appointment Setting: scheduled discovery calls and product demos, connecting qualified prospects with Account Executives.",
      "Customer Experience & Quality Assurance: delivered a high-quality customer experience, adhering to quality standards throughout the outreach process.",
      "Project & Campaign Management: planned and managed end-to-end deliverables, including pre- and post-campaign activity and CRM data management.",
      "Reporting & Performance Analytics: monitored outbound campaign metrics, providing insights on lead generation, effectiveness and revenue contribution.",
      "Cross-Functional Collaboration: worked with sales and marketing stakeholders to streamline lead handover and outreach efficiency.",
    ],
    result: "Demand generation & appointment setting across 8 global markets",
  },
  {
    company: "The Sales Group",
    title: "Lead Generation Manager",
    dates: "Jan 2024 – Jun 2024",
    place: "Toronto, Canada (remote)",
    summary: [
      "Fractional SDR leadership for North American business owners buying part-time BD support, fractional sales leadership and permanent sales-team placement.",
      "Built a custom outbound strategy per client against their ICP and growth goals.",
      "Managed part-time BDR resources.",
      "Launched and optimised email and LinkedIn campaigns by industry and vertical.",
    ],
    result: "18–25 meetings per seat, per month",
  },
  {
    company: "Ecosmob Technologies",
    title: "Lead Generation Manager",
    dates: "Jun 2022 – Apr 2023",
    place: "Ahmedabad, India",
    summary: [
      "Led a lead-generation team serving a diverse client portfolio for enterprise VoIP and telecom SaaS platforms.",
      "Territory-based allocation across the US, UK, MENA and APAC.",
      "Ran automated inbound and outbound email campaigns through Sales Navigator and CRM tooling.",
      "Designed outreach templates and built the monthly conversion and engagement analytics.",
    ],
    result: "300+ enterprise MQLs a year",
  },
  {
    company: "Uplers Pvt Limited",
    title: "Senior Lead Generation Specialist",
    dates: "Jul 2021 – Dec 2023",
    place: "Gujarat, India",
    summary: [
      "Outbound Campaigns: designed and executed multi-touch lead generation strategies, elevating brand awareness and increasing conversion rates.",
      "Campaign Performance Optimization: analysed ROI metrics, optimised outbound campaigns, and ensured alignment with revenue goals.",
      "Client Engagement & Quality Assurance: ensured a seamless customer experience, enhancing satisfaction scores and refining outreach processes.",
      "Marketing Collateral Development: created case studies, email templates and sales presentations to support lead generation.",
      "Stakeholder Collaboration: partnered with BDR and marketing teams to enhance business development initiatives and optimise CRM data.",
      "Data-Driven Sales Support: monitored email responses, nurtured hand-raisers, and provided structured updates to sales and market research teams.",
    ],
    result: "Multi-touch outbound campaigns lifting brand awareness & conversion",
  },
  {
    company: "Alore (Growth OS)",
    title: "Lead Generation Specialist",
    dates: "Apr 2021 – May 2022",
    place: "Bengaluru, India",
    summary: [
      "In-depth prospect research and qualification — domain expertise, product fit and system requirements.",
      "Fed targeted outbound email campaigns across the US, UK and Australia.",
      "Handled client communication and appointment setting.",
      "Oversaw lead assignment and QA workflows across research, outreach and sales, with daily and monthly bounce and lead reporting.",
    ],
    result: "Research, QA and reporting rigour",
  },
  {
    company: "Zinnov & Draup",
    title: "Lead Generation Specialist",
    dates: "Jun 2019 – Jul 2021",
    place: "Coimbatore, India",
    summary: [
      "Market Research Execution: conducted in-depth industry research, sourcing verified leads for IT and technology sales teams.",
      "Data Validation & Enrichment: used multi-stage verification techniques to extract and validate prospect information.",
      "CRM & Email Tracking: maintained records in Salesforce, tracking lead engagement and sales conversion data.",
      "Competitive Intelligence: leveraged Draup, Hoovers, ZoomInfo and Crunchbase to enhance outreach strategies.",
      "Performance Optimization: aligned lead generation strategies with OKRs, ensuring consistent achievement of targets.",
    ],
    result: "Verified lead sourcing & multi-stage data validation for IT/tech sales teams",
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
  /** Concrete ramp length in months for projection table. */
  rampMonths: number;
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
    { key: "saas", label: "B2B product based", meetingRate: 0.15, baseToolCost: 450, costPerLead: 5 },
    { key: "services", label: "Service-based sector", meetingRate: 0.12, baseToolCost: 350, costPerLead: 4 },
  ] as EstimatorSector[],
  mqlTiers: [
    { upTo: 30, label: "45–90 days", rampMonths: 3 },
    { upTo: 70, label: "75–100 days", rampMonths: 3 },
    { upTo: 120, label: "90–120 days", rampMonths: 4 },
    { upTo: 180, label: "110–140 days", rampMonths: 5 },
    { upTo: 250, label: "130–160 days", rampMonths: 5 },
    { upTo: Number.POSITIVE_INFINITY, label: "150–180 days", rampMonths: 6 },
  ] as EstimatorTier[],
};

/**
 * Back-loaded ramp curves keyed by ramp length in months.
 * Each array sums to the fraction of target volume reached that month.
 * Month 1 is always the lowest — domain warming, list building, sequence setup.
 */
const RAMP_CURVES: Record<number, number[]> = {
  3: [0.30, 0.65, 1.00],
  4: [0.20, 0.45, 0.75, 1.00],
  5: [0.15, 0.30, 0.55, 0.80, 1.00],
  6: [0.10, 0.25, 0.45, 0.65, 0.85, 1.00],
};

/** One row in the month-by-month projection table. */
export interface ProjectionMonth {
  month: number;
  /** Whether this month is still ramping or at steady state. */
  isRamp: boolean;
  leads: number;
  meetings: number;
  toolCost: number;
  cumulativeCost: number;
}

export interface EstimateResult {
  sector: EstimatorSector;
  /** Booked meetings / MQL leads per month, at steady state (min 1). */
  meetings: number;
  /** Modelled monthly tool spend at steady state. */
  toolsCost: number;
  /** How long before output reaches the steady-state rate above. */
  rampLabel: string;
  /** Month-by-month projection: ramp months + 2 steady-state months. */
  projection: ProjectionMonth[];
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
  const tier = tiers.find((t) => leads <= t.upTo) ?? tiers[tiers.length - 1];

  const steadyMeetings = Math.max(1, Math.round(leads * sector.meetingRate));
  const steadyToolsCost = sector.baseToolCost + leads * sector.costPerLead;

  // Build month-by-month projection
  const rampMonths = tier.rampMonths;
  const curve = RAMP_CURVES[rampMonths] ?? RAMP_CURVES[4];
  const totalMonths = rampMonths + 2; // ramp + 2 steady-state months
  const projection: ProjectionMonth[] = [];
  let cumulativeCost = 0;

  for (let i = 0; i < totalMonths; i++) {
    const isRamp = i < rampMonths;
    const fraction = isRamp ? curve[i] : 1.0;
    const monthLeads = Math.round(leads * fraction);
    const monthMeetings = Math.max(1, Math.round(monthLeads * sector.meetingRate));
    const monthToolCost = sector.baseToolCost + monthLeads * sector.costPerLead;
    cumulativeCost += monthToolCost;

    projection.push({
      month: i + 1,
      isRamp,
      leads: monthLeads,
      meetings: monthMeetings,
      toolCost: monthToolCost,
      cumulativeCost,
    });
  }

  return {
    sector,
    meetings: steadyMeetings,
    toolsCost: steadyToolsCost,
    rampLabel: tier.label,
    projection,
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
    "First call is free — 30 to 45 minutes to unpack your pipeline and strategy. Booked over a video call, wherever you are.",
  terms: [
    { label: "First call", value: "Free, 30–45 min" },
    { label: "Second call", value: "USD 350, one-time setup" },
    { label: "Format", value: "Remote — video call" },
    { label: "Booking", value: "After approval" },
  ],
  note:
    "Payment setup is still in progress — pick a slot and book the free call on the schedule page, or reach me on LinkedIn or by phone.",
  primaryCta: { label: "Connect on LinkedIn", href: IDENTITY.linkedin },
  secondaryCta: { label: "Call +91 99949 69699", href: IDENTITY.phoneHref },
} as const;

/**
 * The dedicated /schedule page. The offer is a ladder, and the page states it
 * in the order a buyer meets it: a free discovery call with a published
 * agenda, a paid second call that starts the engagement, then one of two
 * ongoing tracks. Source of record is SITE-CONTENT.md §10.
 *
 * The commission rate and the full-time monthly rate are deliberately absent —
 * both are agreed per client on the call, so publishing a number here would be
 * inventing one.
 */
export const SCHEDULE = {
  eyebrow: "Strategy calendar",
  headline: ["You bring the idea. I'll bring the ", "plan", "."],
  chip: "First call is free",
  cta: { label: "Pick a free slot", href: "#book" },
  sub: {
    lead: "30 to 45 minutes, no charge",
    rest: " — enough to see whether your pipeline is worth building and whether I'm the one to build it.",
  },
  summary: [
    { title: "First call — free", detail: "30–45 min · Discovery, pipeline fit & strategy", free: true },
    { title: "Second call — USD 350", detail: "One-time setup · Infrastructure, tool estimation, methodology, process flow" },
    { title: "Remote", detail: "Video call — Google Meet or your preferred platform" },
  ],

  agenda: {
    eyebrow: "Call one",
    heading: "What the free call covers.",
    body:
      "Six questions, asked in this order. By the end of them I can tell you whether outbound is the right spend for you — including when the answer is no.",
    items: [
      {
        no: "01",
        name: "Product or service",
        description: "What you actually sell decides the cadence. A product demo and a service consult are not the same outreach.",
      },
      {
        no: "02",
        name: "The company",
        description: "Size, sales, sales motion, who closes today, and what has already been tried on the outbound side.",
      },
      {
        no: "03",
        name: "Target region",
        description: "NA, EU, APAC or MENA. Buying norms, timing and tone shift with each one.",
      },
      {
        no: "04",
        name: "Industries & ICP",
        description: "Which verticals and account types are worth the list, and which ones quietly waste it.",
      },
      {
        no: "05",
        name: "30 / 60 / 90 day goals",
        description: "What has to be true in three months. This is what the whole engagement gets measured against.",
      },
      {
        no: "06",
        name: "B2B or B2C",
        description: "Who you sell to changes the channels, the message and the length of the cycle. B2B and B2C outbound are built differently.",
      },
    ],
  },

  engagement: {
    eyebrow: "The ladder",
    heading: "Tools first. Pay when leads land.",
    standfirst:
      "You control the spend, and the results arrive before the retainer does. Four steps, in order, with the cost of each stated up front.",
    phases: [
      {
        no: "01",
        name: "Free discovery call",
        price: "No charge",
        description:
          "A free 30–45 minute call where we talk through your product, your ideal customers and your next 90 days of goals. You'll walk away with a clear picture of how I can help — continuing is entirely your choice.",
      },
      {
        no: "02",
        name: "One-time setup",
        price: "USD 350 · one time",
        description:
          "Infrastructure setup, tool estimation, methodology and process flow. The mandatory tool stack is activated at direct cost — no markup, no retainer.",
      },
      {
        no: "03",
        name: "Research & build",
        price: "30–45–90 days · included",
        description:
          "ICP definition, account research, prospect sourcing, and a multi-channel cadence built and launched. Nothing further is billed in this window.",
      },
      {
        no: "04",
        name: "Leads flow",
        price: "USD 50 per booked meeting",
        description:
          "You pay USD 50 for each meeting booked off my work (MQL), plus a commission when that meeting turns into a closed deal (SQL). Payment is linked to outcomes, not activity.",
      },
    ],
  },

  tracks: {
    eyebrow: "After the setup call",
    heading: "Two ways to run it.",
    body: "Pick the one that fits how you want the function owned. Both start from the same two calls.",
    items: [
      {
        kind: "Track A",
        name: "Performance-linked",
        rate: "USD 50 / booked meeting",
        featured: true,
        body: "You pay for outcomes. My upside only exists if your pipeline moves, which keeps the incentive pointed the same way as yours.",
        points: [
          "30–45–90 day research and build window, included",
          "MQL — USD 50 per meeting booked",
          "SQL — commission when the deal closes, agreed per deal on the setup call",
          "No monthly retainer",
        ],
      },
      {
        kind: "Track B",
        name: "Full-time",
        rate: "Annual CTC · monthly compensation",
        featured: false,
        body: "I run the lead-generation function as part of your team rather than alongside it — the same work, owned end to end, on an annual arrangement.",
        points: [
          "Research, sourcing, cadence, outreach and booking, all in-house",
          "Reporting and pipeline ownership as a team member",
          "Your plan, your tools — my execution and experience, working to bring you exposure and leads",
          "Compensation structured as an annual CTC, paid monthly — scoped to the mandate on the call",
          "No per-lead or commission billing",
        ],
      },
    ],
  },

  form: {
    eyebrow: "Book the free call",
    heading: "Four fields. Then we talk.",
    body:
      "Pick a slot, leave enough to check you're real, and I'll get back to you with a confirmation. Everything else is what the call itself is for — no questionnaire.",
    nameLabel: "Your name",
    namePlaceholder: "Sampath Kumar",
    nameInvalid: "Please add your name.",
    emailLabel: "Work email",
    emailPlaceholder: "you@company.com",
    emailInvalid: "That email doesn't look right.",
    domainLabel: "Company domain",
    domainPlaceholder: "company.com",
    domainInvalid: "Please use a domain, like company.com.",
    phoneLabel: "Phone (optional)",
    phonePlaceholder: "+91 99949 69699",
    submit: "Request the free call",
    sending: "Sending…",
    success:
      "Got it. You'll hear back from me confirming the slot you picked. Payment setup isn't live yet, so payment instructions for the second call come by email once the first one is done.",
    error: "That didn't send. Try again, or reach me on LinkedIn below.",
    note:
      "Pick a slot above and send the form — you'll get a confirmation by email. Payment for the second call is arranged separately.",
  },

  fallback: {
    eyebrow: "Direct contact",
    heading: "Or skip the form.",
    body: "Reach me on LinkedIn or by phone. Same free first call, same terms — the form just means I have your details written down.",
    primaryCta: { label: "Connect on LinkedIn", href: IDENTITY.linkedin },
    secondaryCta: { label: `Call ${IDENTITY.phone}`, href: IDENTITY.phoneHref },
  },
  links: [
    { label: "How the lead generation works", href: "/lead-generation" },
    { label: "Review case studies", href: "/case-studies" },
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
        { label: "Resume", href: IDENTITY.resume },
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
    stackNote: "Runs on: " + TOOL_GROUPS.flatMap((group) => group.tools.map((t) => t.name)).slice(0, 6).join(" · ") + " and more",
    resumeCta: { label: "Resume", href: IDENTITY.resume },
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
      sessionLabel: "One-time setup",
      sessionValue: "USD 350 · one time",
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
