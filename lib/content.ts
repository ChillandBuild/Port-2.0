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
  { label: "Résumé", href: IDENTITY.resume },
  { label: "Schedule a call", href: "#contact" },
] as const;

export const HERO = {
  eyebrow: "Pre Sales Head · Lead Generation",
  headline: ["Every deal", "begins with", "hello."],
  lede:
    "Engineer-turned-sales leader. Seven years building outbound engines for B2B & B2C SaaS, service-based private markets, fractional pre-sales, and global account expansion.",
  primaryCta: { label: "Hire me", href: "#contact" },
  secondaryCta: { label: "Work with me", href: "#work-plan" },
  stats: [
    { value: "7+", label: "Years in pre-sales" },
    { value: "24", label: "Markets worked" },
    { value: "200M+", label: "Records mapped" },
  ],
} as const;

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
    { label: "Based", value: "Coimbatore, IN · GMT+5:30" },
    { label: "Working", value: "Every time zone that answers" },
    { label: "Studying", value: "MBA Marketing, Amrita · 2024–2026" },
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
}

export const SECTORS: Sector[] = [
  { tag: "SaaS", title: "B2B & B2C SaaS", description: "High-velocity growth across IT and SaaS platforms." },
  { tag: "Markets", title: "Service-based private markets", description: "Global account expansion and deal origination." },
  { tag: "Staffing", title: "Staffing & recruiting", description: "Fractional pre-sales and BDR talent acceleration." },
  { tag: "Health", title: "MediTech, pharma & healthcare", description: "B2B lead gen across MedTech startups, pharma, and hospital networks." },
  { tag: "Finance", title: "Banking, finance & BPO", description: "Financial service pipelines and back-end solutions." },
  { tag: "Commerce", title: "E-commerce, retail & aviation", description: "Omnichannel B2B and B2C campaign strategy." },
  { tag: "Education", title: "EdTech & institutions", description: "Institutional lead gen and consultative selling." },
  { tag: "Engineering", title: "Energy, utilities & engineering", description: "Technical proposal scoping and enterprise demos." },
  { tag: "Services", title: "Digital marketing & translation", description: "Performance-driven outreach for MarTech agencies and localisation firms." },
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

export interface Qualification {
  degree: string;
  institution: string;
  dates: string;
}

/** Sourced from the LinkedIn profile and the résumé; both agree on these three. */
export const EDUCATION: Qualification[] = [
  {
    degree: "MBA, Marketing Management",
    institution: "Amrita Vishwa Vidyapeetham",
    dates: "Apr 2024 – Apr 2026",
  },
  {
    degree: "B.E., Mechanical Engineering",
    institution: "Sri Krishna College of Technology",
    dates: "2017 – 2020",
  },
  {
    degree: "Diploma, Mechanical Engineering",
    institution: "Sree Narayana Guru Polytechnic College",
    dates: "2013 – 2016",
  },
];

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
    "A model, not a quote. The conversion rates track the method on this page; a real number comes out of a scoping call.",
  toolsLink: { label: "See the stack behind the cost", href: "#range" },
  sectors: [
    { key: "saas", label: "B2B SaaS growth", meetingRate: 0.15, baseToolCost: 450, costPerLead: 5 },
    { key: "services", label: "Service-based sector", meetingRate: 0.12, baseToolCost: 350, costPerLead: 4 },
    { key: "midmarket", label: "Mid-market & digital marketing", meetingRate: 0.14, baseToolCost: 500, costPerLead: 6 },
  ] as EstimatorSector[],
  mqlTiers: [
    { upTo: 30, label: "45–90 days to first MQL" },
    { upTo: 70, label: "75–100 days to first MQL" },
    { upTo: 120, label: "90–120 days to first MQL" },
    { upTo: 180, label: "110–140 days to first MQL" },
    { upTo: 250, label: "130–160 days to first MQL" },
    { upTo: Number.POSITIVE_INFINITY, label: "150–180 days to first MQL" },
  ] as EstimatorTier[],
};

export const LINKEDIN = {
  eyebrow: "Live LinkedIn impact",
  heading: "Where the inbound arrives from.",
  body:
    "Verified Creator Analytics and Social Selling Index framework driving steady B2B and B2C inbound leads.",
  stats: [
    { value: "10,000+", label: "Followers" },
    { value: "2.6M+", label: "Impressions" },
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
  heading: "Pay for tools alone. Leads come later.",
  body:
    "A structured engagement model built for accountability — you control the spend, the results arrive before the retainer does.",
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
}

export const POSTS: Post[] = [
  {
    topic: "Lead gen strategy",
    title: "Achieving +35% lift in lead-to-meeting conversions",
    summary: "Why hyper-segmented industry value propositions outperform generic cold outreach across private markets.",
  },
  {
    topic: "Pre-sales engineering",
    title: "Bridging complex SaaS features to C-suite value",
    summary: "How structured product demos and proposal scoping turn discovery calls into confident closures.",
  },
  {
    topic: "Market intelligence",
    title: "Mapping 200M+ global private companies",
    summary: "Building proprietary database architectures for PE deal sourcing and target acquisition modelling.",
  },
  {
    topic: "Global expansion",
    title: "Navigating 12 international markets",
    summary: "Adapting cadences and buyer communication norms across North America, Europe, APAC and MENA.",
  },
];

export const CONTACT = {
  eyebrow: "Reply",
  heading: "Start a conversation. I'll say hello first.",
  body:
    "A focused remote consulting session for lead generation, outbound strategy, and pre-sales planning. Sessions run against IST availability.",
  terms: [
    { label: "Fee", value: "USD 350" },
    { label: "Length", value: "60 minutes" },
    { label: "Format", value: "Remote, IST hours" },
    { label: "Booking", value: "After approval" },
  ],
  note:
    "A payment link and IST slot selector appear here once payment setup is approved. Until then, reach me on LinkedIn or by phone.",
  primaryCta: { label: "Connect on LinkedIn", href: IDENTITY.linkedin },
  secondaryCta: { label: "Call +91 99949 69699", href: IDENTITY.phoneHref },
} as const;

export const FOOTER = {
  wordmark: "Sampath Kumar",
  fineprint: "© 2026 Sampath Kumar · Coimbatore, Tamil Nadu, India",
  links: [
    { label: "Terms of service", href: "/terms" },
    { label: "Privacy policy", href: "/privacy" },
    { label: "Refunds & cancellations", href: "/refunds" },
  ],
} as const;
