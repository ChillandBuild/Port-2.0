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
    "An engineer's head, a pre-salesperson's calendar. If the fit is wrong I'll say so on the call.",
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
    answered: "An engineer's head, a pre-salesperson's calendar.",
  },
  facts: [
    {
      label: "Diploma",
      degree: "Diploma in Mechanical Engineering",
      school: "Sree Narayana Guru Polytechnic College · 2016",
    },
    {
      label: "Engineering",
      degree: "Bachelor of Engineering in Mechanical Engineering",
      school: "Sri Krishna College of Technology · 2020",
    },
    {
      label: "Business",
      degree: "Master of Business Administration with a specialization in Marketing",
      school: "Amrita Vishwa Vidyapeetham · 2026",
    },
  ],
} as const;

export interface Stage {
  no: string;
  name: string;
  description: string;
}

export const PIPELINE: Stage[] = [
  { no: "01", name: "Understand ICP", description: "Segment the market, map the buyer journey, define who's actually worth reaching." },
  { no: "02", name: "Research", description: "Deep account and market intelligence from intent platforms, firmographic databases, and direct web research." },
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
  { tag: "Services", title: "Digital marketing localisation and translation", description: "Performance-driven outreach for MarTech agencies and localisation firms.", core: true },
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
    name: "Prospecting & lead intelligence",
    tools: [
      { name: "Adyntel", url: "https://www.adyntel.com" },
      { name: "Ahrefs", url: "https://ahrefs.com" },
      { name: "Apollo.io", url: "https://www.apollo.io" },
      { name: "Audience.co", url: "https://audience.co" },
      { name: "BuiltWith", url: "https://builtwith.com" },
      { name: "Buska.io", url: "https://www.buska.io" },
      { name: "Capterra", url: "https://www.capterra.com" },
      { name: "Champify", url: "https://www.champify.io" },
      { name: "Cognism", url: "https://www.cognism.com" },
      { name: "Common Room", url: "https://www.commonroom.io" },
      { name: "Coresignal", url: "https://coresignal.com" },
      { name: "Clearbit", url: "https://clearbit.com" },
      { name: "Datagma", url: "https://datagma.com" },
      { name: "Demandbase", url: "https://www.demandbase.com" },
      { name: "FullEnrich", url: "https://fullenrich.com" },
      { name: "G2", url: "https://www.g2.com" },
      { name: "GetLatka", url: "https://getlatka.com" },
      { name: "GetSales.io", url: "https://getsales.io" },
      { name: "HG Insights", url: "https://hginsights.com" },
      { name: "Kleo", url: "https://www.kleo.so" },
      { name: "Leadfeeder", url: "https://www.leadfeeder.com" },
      { name: "LeadMagic", url: "https://leadmagic.io" },
      { name: "LinkedIn Sales Navigator", url: "https://business.linkedin.com/sales-solutions/sales-navigator" },
      { name: "LoneScale", url: "https://www.lonescale.com" },
      { name: "Lusha", url: "https://www.lusha.com" },
      { name: "MadKudu", url: "https://www.madkudu.com" },
      { name: "Ocean.io", url: "https://ocean.io" },
      { name: "Openmart", url: "https://www.openmart.com" },
      { name: "Pocus", url: "https://www.pocus.com" },
      { name: "PredictLeads", url: "https://predictleads.com" },
      { name: "Prospeo.io", url: "https://prospeo.io" },
      { name: "RB2B", url: "https://www.rb2b.com" },
      { name: "saasyDB", url: "https://www.saasydb.com" },
      { name: "Store Leads", url: "https://storeleads.app" },
      { name: "Tamtam", url: "https://www.tamtam.ai" },
      { name: "Teamfluence", url: "https://teamfluence.io" },
      { name: "TheirStack", url: "https://theirstack.com" },
      { name: "Trustpilot", url: "https://www.trustpilot.com" },
      { name: "Trigify.io", url: "https://www.trigify.io" },
      { name: "UserGems", url: "https://www.usergems.com" },
      { name: "ZoomInfo", url: "https://www.zoominfo.com" },
    ],
    description:
      "Executive lead discovery, buyer intent signals, verified direct dials and email, and the growth triggers that say an account is ready to hear from you.",
  },
  {
    name: "Data scraping & enrichment",
    tools: [
      { name: "AI Ark", url: "https://ai-ark.com" },
      { name: "Apify", url: "https://apify.com" },
      { name: "Bardeen", url: "https://www.bardeen.ai" },
      { name: "Clay", url: "https://www.clay.com" },
      { name: "Crunchbase", url: "https://www.crunchbase.com" },
      { name: "Crustdata", url: "https://crustdata.com" },
      { name: "Dropcontact", url: "https://www.dropcontact.com" },
      { name: "Instant Data Scraper", url: "https://webrobots.io/instantdata/" },
      { name: "Lix", url: "https://lix-it.com" },
      { name: "Octave", url: "https://www.octavehq.com" },
      { name: "PhantomBuster", url: "https://phantombuster.com" },
      { name: "Serper", url: "https://serper.dev" },
      { name: "Shovels", url: "https://www.shovels.ai" },
    ],
    description:
      "Turning a name into a record — firmographics, tech stack, headcount moves and contact detail, filled in before a rep ever reads the row.",
  },
  {
    name: "Outbound & sales engagement",
    tools: [
      { name: "11x", url: "https://www.11x.ai" },
      { name: "Artisan", url: "https://www.artisan.co" },
      { name: "Boomerang", url: "https://www.boomerangapp.com" },
      { name: "Breakcold", url: "https://www.breakcold.com" },
      { name: "EasyGen", url: "https://www.easy-gen.com" },
      { name: "Extrovert", url: "https://www.goextrovert.com" },
      { name: "Instantly.ai", url: "https://instantly.ai" },
      { name: "Jason AI", url: "https://reply.io/jason-ai/" },
      { name: "Lemlist", url: "https://www.lemlist.com" },
      { name: "Letterdrop", url: "https://letterdrop.com" },
      { name: "Lyne.ai", url: "https://lyne.ai" },
      { name: "Orum", url: "https://www.orum.com" },
      { name: "OutboundSync", url: "https://outboundsync.com" },
      { name: "Regie.ai", url: "https://www.regie.ai" },
      { name: "RevReply", url: "https://www.revreply.com" },
      { name: "Salee", url: "https://salee.pro" },
      { name: "Salesfinity", url: "https://www.salesfinity.co" },
      { name: "Salesloft", url: "https://www.salesloft.com" },
      { name: "Scripe", url: "https://www.scripe.io" },
      { name: "Smartlead", url: "https://www.smartlead.ai" },
      { name: "Snov.io", url: "https://snov.io" },
      { name: "Supergrow", url: "https://www.supergrow.ai" },
      { name: "Taplio", url: "https://taplio.com" },
      { name: "TheBoomerang.co", url: "https://theboomerang.co" },
      { name: "Twain", url: "https://www.twain.ai" },
    ],
    description:
      "Sequencing across email, LinkedIn and phone, with the personalisation and reply handling that keeps a cadence human at volume.",
  },
  {
    name: "GTM infrastructure & deliverability",
    tools: [
      { name: "BounceBan", url: "https://bounceban.com" },
      { name: "EmailGuard", url: "https://emailguard.io" },
      { name: "Findymail", url: "https://www.findymail.com" },
      { name: "HeyReach.io", url: "https://www.heyreach.io" },
      { name: "Hunter.io", url: "https://hunter.io" },
      { name: "Icypeas", url: "https://icypeas.com" },
      { name: "Maildoso", url: "https://maildoso.com" },
      { name: "MailTracker", url: "https://mailtracker.io" },
      { name: "Marketo", url: "https://business.adobe.com/products/marketo.html" },
      { name: "MxToolBox", url: "https://mxtoolbox.com" },
      { name: "NeverBounce", url: "https://www.neverbounce.com" },
      { name: "Porkbun", url: "https://porkbun.com" },
      { name: "Premium Inboxes", url: "https://premiuminboxes.com" },
      { name: "Rocketreach", url: "https://rocketreach.co" },
      { name: "ScaledMail", url: "https://scaledmail.com" },
      { name: "TitanX", url: "https://titanx.io" },
      { name: "Warmy", url: "https://warmy.io" },
      { name: "Zapmail", url: "https://zapmail.ai" },
      { name: "ZeroBounce", url: "https://www.zerobounce.net" },
    ],
    description:
      "Domains, mailboxes, DNS records and warm-up — the plumbing that decides whether a campaign lands in an inbox or a spam folder.",
  },
  {
    name: "CRM & pipeline",
    tools: [
      { name: "Airtable", url: "https://www.airtable.com" },
      { name: "ChurnZero", url: "https://churnzero.com" },
      { name: "folk", url: "https://www.folk.app" },
      { name: "HubSpot CRM", url: "https://www.hubspot.com/products/crm" },
      { name: "Notion", url: "https://www.notion.com" },
      { name: "Pipedrive CRM", url: "https://www.pipedrive.com" },
      { name: "Salesforce CRM", url: "https://www.salesforce.com" },
      { name: "Saleshandy CRM", url: "https://www.saleshandy.com" },
      { name: "Salesrobot", url: "https://www.salesrobot.co" },
      { name: "Velaris", url: "https://www.velaris.io" },
      { name: "Waalaxy", url: "https://www.waalaxy.com" },
      { name: "Woodpecker.co", url: "https://woodpecker.co" },
      { name: "Zoho CRM", url: "https://www.zoho.com/crm/" },
    ],
    description:
      "Pipeline data hygiene, automated lead routing, deal stage tracking, and the executive reporting that comes out the other end.",
  },
  {
    name: "Content, meetings & deal execution",
    tools: [
      { name: "Adobe Photoshop", url: "https://www.adobe.com/products/photoshop.html" },
      { name: "Canva", url: "https://www.canva.com" },
      { name: "Chili Piper", url: "https://www.chilipiper.com" },
      { name: "Conga", url: "https://conga.com" },
      { name: "Demio", url: "https://www.demio.com" },
      { name: "Figma", url: "https://www.figma.com" },
      { name: "Howly", url: "https://howly.io" },
      { name: "RingCentral", url: "https://www.ringcentral.com" },
      { name: "SalesCloser AI", url: "https://salescloser.ai" },
      { name: "Sendspark", url: "https://www.sendspark.com" },
      { name: "ShareFile", url: "https://www.sharefile.com" },
      { name: "Stripe", url: "https://stripe.com" },
      { name: "SurveyMonkey", url: "https://www.surveymonkey.com" },
      { name: "Trumpet", url: "https://www.sendtrumpet.com" },
      { name: "Zoom", url: "https://www.zoom.com" },
      { name: "Zuora", url: "https://www.zuora.com" },
    ],
    description:
      "Decks, demos, scheduling, proposals and payment — everything between a booked meeting and a signed contract.",
  },
  {
    name: "Automation & agentic AI",
    tools: [
      { name: "11x", url: "https://www.11x.ai" },
      { name: "Aomni", url: "https://www.aomni.com" },
      { name: "Artisan", url: "https://www.artisan.co" },
      { name: "Bardeen", url: "https://www.bardeen.ai" },
      { name: "Induced", url: "https://induced.ai" },
      { name: "Jason AI", url: "https://reply.io/jason-ai/" },
      { name: "Make", url: "https://www.make.com" },
      { name: "n8n", url: "https://n8n.io" },
      { name: "Relevance AI", url: "https://relevanceai.com" },
      { name: "Salee", url: "https://salee.pro" },
      { name: "Synthflow AI", url: "https://synthflow.ai" },
      { name: "Topo", url: "https://www.topo.io" },
      { name: "Zapier", url: "https://zapier.com" },
    ],
    description:
      "Workflow orchestration and AI agents that run research, enrichment and follow-up in the background instead of on a rep's calendar.",
  },
  {
    name: "Intelligence, research & AI",
    tools: [
      { name: "Avoma", url: "https://www.avoma.com" },
      { name: "CB Insights", url: "https://www.cbinsights.com" },
      { name: "ChatGPT", url: "https://chatgpt.com" },
      { name: "Claude", url: "https://claude.ai" },
      { name: "Demodesk", url: "https://demodesk.com" },
      { name: "Fathom", url: "https://fathom.video" },
      { name: "Google Gemini", url: "https://gemini.google.com" },
      { name: "Gong", url: "https://www.gong.io" },
      { name: "Hyperbound", url: "https://www.hyperbound.ai" },
      { name: "Koala", url: "https://getkoala.com" },
      { name: "Metabase", url: "https://www.metabase.com" },
      { name: "Peeker AI", url: "https://peeker.ai" },
      { name: "Perplexity", url: "https://www.perplexity.ai" },
      { name: "Telescope AI", url: "https://trytelescope.io" },
    ],
    description:
      "Deal intelligence, call analytics, market research and reasoning models — the layer that says what to do before the outreach starts.",
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
    title: "Senior Lead Generation Specialist",
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
    title: "Lead Generation Executive",
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
  toolsLink: { label: "See the stack behind the cost", href: "/#range" },
  /** Surfaced right under the modelled numbers, where interest in a real
   *  answer peaks — the same free first call CONTACT and SCHEDULE describe,
   *  said again at the moment it's most likely to be acted on. */
  freeCallNote: {
    text: "First call is free — 30 to 45 minutes to go through your numbers.",
    cta: { label: "Book the call", href: "#book" },
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
  /** The post's own image, hotlinked from LinkedIn's CDN. Carousel and
   *  document posts have none — LinkedIn only serves their covers to a signed-in
   *  session — so those cards render the typographic cover instead. */
  image?: { src: string; width: number; height: number };
}

export const POSTS: Post[] = [
  {
    topic: "Clay & allbound",
    title: "Three Clay-powered allbound motions",
    summary: "Ad audiences, engagement tracking and qualification in one table, so inbound and outbound stop living in separate silos.",
    url: "https://www.linkedin.com/posts/sampath-kumar-tn66sk9699_allbound-claytools-b2bgrowth-activity-7417124571570573312-61q6",
    image: { src: "https://media.licdn.com/dms/image/v2/D5622AQHhA2ZpPmty_Q/feedshare-shrink_1280/B56Zu5xJloKkAs-/0/1768348229003?e=2147483647&v=beta&t=XF_mpmHYi2IevuFBv5CWg2SNELVMMe15qgCDM3Bf6vo", width: 940, height: 788 },
  },
  {
    topic: "Outbound architecture",
    title: "Most B2B teams have a system problem, not an outbound one",
    summary: "Disconnected tools, weak data, rushed infrastructure — what a complete outbound engine looks like, layer by layer.",
    url: "https://www.linkedin.com/posts/sampath-kumar-tn66sk9699_b2b-outboundsystems-leadgeneration-activity-7431604320183283712-OvIj",
    image: { src: "https://media.licdn.com/dms/image/v2/D5622AQHGqkPlb6fWdg/feedshare-image-high-res/B56ZyJcv_AJQAY-/0/1771832541439?e=2147483647&v=beta&t=vIAMvOFCwYiOZmoDeujiElL8S3VibZof4XN9gELQA78", width: 1085, height: 1536 },
  },
  {
    topic: "Positioning",
    title: "The one difference between B2B and B2C marketing",
    summary: "Multiple stakeholders, a shared buying project, ROI over impulse — why the decision process changes every other choice.",
    url: "https://www.linkedin.com/posts/sampath-kumar-tn66sk9699_b2bmarketing-b2cmarketing-marketingstrategy-activity-7409564958717292544-dKhZ",
    image: { src: "https://media.licdn.com/dms/image/v2/D5622AQH2fhBAaq683Q/feedshare-shrink_1280/B56ZtQQDZZG4As-/0/1766577947580?e=2147483647&v=beta&t=X5jkBjdR0BQOjrYYDejtam0rhDgSSMfNrY9qP0N1mHc", width: 1080, height: 1350 },
  },
  {
    topic: "Cold email",
    title: "Five steps to a cold email campaign that lands",
    summary: "ICP definition, a clean list, warmed infrastructure and tested angles — the order that keeps a campaign out of the spam folder.",
    url: "https://www.linkedin.com/posts/sampath-kumar-tn66sk9699_5steps-to-build-your-coldemailcampaigns-activity-7451907793202155520-q7pQ",
  },
  {
    topic: "Sales stack",
    title: "The SDR stack of 2021 against the stack of 2026",
    summary: "Sales Navigator, ZoomInfo and a sequencer used to be enough. What top outbound teams actually run now.",
    url: "https://www.linkedin.com/posts/sampath-kumar-tn66sk9699_b2bmarketing-coldoutreach-aiinsales-activity-7449364764016922624-6ZXs",
    image: { src: "https://media.licdn.com/dms/image/v2/D5622AQEfRg4HmbjjQA/feedshare-shrink_1280/B56Z2F1xwzKcAM-/0/1776066960657?e=2147483647&v=beta&t=XGPdX8lvL_t2O2Wq8km_KynEq_xDVC1IOvgRk6DfIwQ", width: 1080, height: 1350 },
  },
  {
    topic: "LinkedIn outreach",
    title: "Finding B2B clients without scraping, ads or spam",
    summary: "Spot niche-relevant engagement, warm the connection, then reach out — a system built on who is already paying attention.",
    url: "https://www.linkedin.com/posts/sampath-kumar-tn66sk9699_b2bmarketing-leadgeneration-outboundmarketing-activity-7378349069892706304-YLCJ",
    image: { src: "https://media.licdn.com/dms/image/v2/D5622AQHvgrD1Dxmmrw/feedshare-image-high-res/B56ZmR_Cr4HkAo-/0/1759090849007?e=2147483647&v=beta&t=XfhoiAKZCWxDUuUK0LNU3LmuXRGYz36ftrsmsZf9KfM", width: 1080, height: 1350 },
  },
  {
    topic: "Warm outreach",
    title: "Cold outreach isn't dead, but relying on it alone is",
    summary: "When content works people view, click and read. Tracking that behaviour beats posting more and waiting for replies.",
    url: "https://www.linkedin.com/posts/sampath-kumar-tn66sk9699_b2bmarketing-leadgeneration-salesautomation-activity-7371463701452931072-JF-a",
    image: { src: "https://media.licdn.com/dms/image/v2/D5622AQF0S8xCRlF-Lw/feedshare-image-high-res/B56Zkv_z_JKMAo-/0/1757446882272?e=2147483647&v=beta&t=EVHi6UK3XofYb_8BOx6PxYXQqA4-DN75vTXYgh4g1NE", width: 1080, height: 1350 },
  },
  {
    topic: "Lead generation",
    title: "The six-step system behind 14–16 leads a month",
    summary: "AI research, verified data, warmed inboxes and multichannel follow-up. Lead gen run as a science instead of a hope.",
    url: "https://www.linkedin.com/posts/sampath-kumar-tn66sk9699_6-step-system-to-generate-14-16-leads-activity-7425118210376556544-lFUJ",
  },
  {
    topic: "Outbound",
    title: "The six commandments of outbound sales",
    summary: "Relevance over volume, and five more rules separating teams who adapted from teams still running the 2019 playbook.",
    url: "https://www.linkedin.com/posts/sampath-kumar-tn66sk9699_b2bmarketing-outboundsales-leadgeneration-activity-7394294135563829248-5Uog",
    image: { src: "https://media.licdn.com/dms/image/v2/D5622AQEZ_0fhJfra0Q/feedshare-shrink_1280/B56Zp0waL.J8Aw-/0/1762895440804?e=2147483647&v=beta&t=1aSWwHK4VrC8cki0L4fqMyRV0Sj_z7fCYXIPZCzlYEc", width: 1080, height: 1350 },
  },
  {
    topic: "Buyer intent",
    title: "The workflow that books three to five meetings a week",
    summary: "Uncover anonymous visitors, enrich them, then reach out on real intent — automated, with no spray-and-pray.",
    url: "https://www.linkedin.com/posts/sampath-kumar-tn66sk9699_b2bmarketing-salesautomation-buyerintent-activity-7397608667824607233-d0vY",
    image: { src: "https://media.licdn.com/dms/image/v2/D5622AQEUtuYn8ZlESg/feedshare-image-high-res/B56ZqmV3EBKAAo-/0/1763727345656?e=2147483647&v=beta&t=OisIRs1-4uXYmx2s3oOzB6Y6I39apgUuW5yJA4xuAb4", width: 1085, height: 1536 },
  },
  {
    topic: "Clay",
    title: "Clay as the operating system for go-to-market",
    summary: "Inbound enrichment, CRM checks, routing and outbound in one connected revenue workflow, not a lead-gen side tool.",
    url: "https://www.linkedin.com/posts/sampath-kumar-tn66sk9699_clayos-gtmstrategy-salesautomation-activity-7347908490830499840-vZhM",
    image: { src: "https://media.licdn.com/dms/image/v2/D5622AQE54rK8S5BBDA/feedshare-shrink_800/B56ZfgLRRMHQAg-/0/1751812743915?e=2147483647&v=beta&t=YjudYE1-7fVpW9IbvWFagqOnpWGyecxHaNmPyjOJh_E", width: 800, height: 565 },
  },
  {
    topic: "LinkedIn ops",
    title: "Clay and Aimfox, for an inbox that stopped scaling",
    summary: "Multiple accounts, lost threads, endless tabs — how the LinkedIn outreach layer got rebuilt into something manageable.",
    url: "https://www.linkedin.com/posts/sampath-kumar-tn66sk9699_clayaimfox-activity-7442890543405191168-6tja",
  },
  {
    topic: "Cold email",
    title: "The four-stage cold email funnel",
    summary: "Not more tools, not better copy, not another AI agent. The funnel is what turns cold prospects into paying clients.",
    url: "https://www.linkedin.com/posts/sampath-kumar-tn66sk9699_coldemail-outboundmarketing-leadgeneration-activity-7403736925888692225-ZlnN",
    image: { src: "https://media.licdn.com/dms/image/v2/D5622AQHMiESwtUfZzQ/feedshare-image-high-res/B56Zr9bfqfJwAo-/0/1765188436114?e=2147483647&v=beta&t=Vkbl7stTMm62qfB-kpZftfIEbV7wg48dcGkfg84Nxq0", width: 1080, height: 1350 },
  },
  {
    topic: "Cold email",
    title: "$5M in revenue from 1,200 emails and 150 replies",
    summary: "The six-step outreach process behind it: precise data, tight segments and a cadence built to earn the reply.",
    url: "https://www.linkedin.com/posts/sampath-kumar-tn66sk9699_coldemailing-leadgeneration-b2bmarketing-activity-7389220731965915136-C8Jq",
    image: { src: "https://media.licdn.com/dms/image/v2/D4D22AQHRTgyJOTm5Tw/feedshare-shrink_1280/B4DZoulq84H0As-/0/1761718219973?e=2147483647&v=beta&t=BqUnUU_huTPSMfSZ8jhb_WpqOojgcK64w5Hr-m237wk", width: 1080, height: 1350 },
  },
  {
    topic: "Content engine",
    title: "Your outbound problem is probably a content problem",
    summary: "Deliverability fine, ICP clear, messaging on point, $55k spent, nothing converting — what was actually missing.",
    url: "https://www.linkedin.com/posts/sampath-kumar-tn66sk9699_contentengine-b2bmarketing-pipelinegrowth-activity-7402657370654629888-TMxe",
    image: { src: "https://media.licdn.com/dms/image/v2/D5622AQFGnzT6k0wXiw/feedshare-shrink_1280/B56ZruFl8pIYAs-/0/1764931036594?e=2147483647&v=beta&t=08uLUPxRDS-B4cntWzmwvIjsiXxMeIYoNaaW0voQfE8", width: 1080, height: 1350 },
  },
  {
    topic: "Clay",
    title: "10,000 Clay credits a month, spent so you don't have to",
    summary: "If Clay feels like it is burning budget, it is usually the system, not the tool. Operators treat it as infrastructure.",
    url: "https://www.linkedin.com/posts/sampath-kumar-tn66sk9699_clayhacks-activity-7427639913195479040-DSme",
  },
  {
    topic: "Deliverability",
    title: "What cold email actually involves",
    summary: "Domains, mailboxes, DNS records, warm-up. The infrastructure behind what looks like write an email and hit send.",
    url: "https://www.linkedin.com/posts/sampath-kumar-tn66sk9699_deliverability-leadgeneration-emailmarketing-activity-7472162233037246464-0Vpn",
    image: { src: "https://media.licdn.com/dms/image/v2/D5622AQEfV-37RlSsCg/feedshare-image-high-res/B56Z7Hsbu7G0AU-/0/1781466774736?e=2147483647&v=beta&t=lqeSoUr_bisq0UG5Nf-7FqPp7uAygyCYOdD_I9TDzoo", width: 1080, height: 1350 },
  },
  {
    topic: "GTM automation",
    title: "Running the whole GTM engine on Clay",
    summary: "Sales, growth, RevOps and HR — what it looks like when Clay is treated as infrastructure the team adapts to.",
    url: "https://www.linkedin.com/posts/sampath-kumar-tn66sk9699_gtmstrategy-outboundautomation-b2bgrowth-activity-7434167807837208577-q058",
    image: { src: "https://media.licdn.com/dms/image/v2/D5622AQE3x3vVEzW0dA/feedshare-shrink_1280/B56Zyt4OjlIIAc-/0/1772443724249?e=2147483647&v=beta&t=fvIV-mJGybo6R4JJBxzmH7FY4UblKiq7tmAKr56z3IE", width: 940, height: 788 },
  },
  {
    topic: "GTM strategy",
    title: "Did the channel stop working, or did product-market fit?",
    summary: "When growth drops the instinct is to spend more. Better GTM leaders ask a different question before opening the wallet.",
    url: "https://www.linkedin.com/posts/sampath-kumar-tn66sk9699_gtmstrategy-productmarketfit-b2bmarketing-activity-7475472643597545472-uQ4K",
    image: { src: "https://media.licdn.com/dms/image/v2/D5622AQF5TqgmXnIsUQ/feedshare-image-high-res/B56Z742wWuHcAU-/0/1782291564313?e=2147483647&v=beta&t=OshNBsr_QgQKdO1EwB3ezJIy4Dn6WzS4IUr5Ev_iz-Q", width: 1080, height: 1350 },
  },
  {
    topic: "Channel choice",
    title: "Cold email against LinkedIn outreach",
    summary: "Two channels that still deliver, broken down by setup, infrastructure and tooling, so you can pick the one that fits.",
    url: "https://www.linkedin.com/posts/sampath-kumar-tn66sk9699_cold-email-vs-linkedin-outreach-activity-7343922224719880192-vzDx",
  },
  {
    topic: "GTM strategy",
    title: "From founder-led sales to a repeatable revenue engine",
    summary: "Define the ICP, validate the offer, then build the team — the transition most founders get stuck in the middle of.",
    url: "https://www.linkedin.com/posts/sampath-kumar-tn66sk9699_gtmstrategy-startupgrowth-revenuegrowth-activity-7469633116312268800-KXcH",
    image: { src: "https://media.licdn.com/dms/image/v2/D4D22AQH2xIkhG9yL_w/feedshare-shrink_1280/B4DZ6kIZqNIIAM-/0/1780870126487?e=2147483647&v=beta&t=4U9IPDIldpFrr6ePCgVlMTNWWcm8-cFgtsOAh7URsbI", width: 1080, height: 1350 },
  },
  {
    topic: "Research",
    title: "The mistakes that break lead generation research",
    summary: "Undefined audiences, single-source data, no buyer personas. Where outreach goes broad and conversion quietly drops.",
    url: "https://www.linkedin.com/posts/sampath-kumar-tn66sk9699_leadgeneration-b2bmarketing-salesresearch-activity-7388495930527776769-l8_2",
    image: { src: "https://media.licdn.com/dms/image/v2/D5622AQGPFb3dv-2ZUQ/feedshare-shrink_1280/B56ZoiQyk9G0A4-/0/1761511418884?e=2147483647&v=beta&t=7RP7t8yH419FADGxVrsEYft9Ylq9psFKzMbu66bcWLw", width: 1080, height: 1350 },
  },
  {
    topic: "Warm leads",
    title: "The 15-minute window sales teams keep missing",
    summary: "A prospect likes, checks your profile, maybe sends a DM. Wait a day and the interest is gone — so the reply got automated.",
    url: "https://www.linkedin.com/posts/sampath-kumar-tn66sk9699_leadgeneration-b2bsales-pipelinegrowth-activity-7412056425629294592-Q8HG",
    image: { src: "https://media.licdn.com/dms/image/v2/D5622AQGzMq_xuxZ5uw/feedshare-shrink_1280/B56ZtzqCRJJAAs-/0/1767171959690?e=2147483647&v=beta&t=EZz0a_sd9X7ACeyptfdWiKgTDUdagA9FtGOpag9W5Oo", width: 1080, height: 1350 },
  },
  {
    topic: "Cold email",
    title: "The cold email cheat sheet for 2026",
    summary: "Infrastructure, data, validation, sending and automation — the full stack named, with what each layer is actually for.",
    url: "https://www.linkedin.com/posts/sampath-kumar-tn66sk9699_coldemail2026-activity-7445408627122876416-kgrn",
  },
  {
    topic: "Lead generation",
    title: "A great lead is more than a contact record",
    summary: "A clear ideal customer profile, real qualification and nurtured relationships — what separates a list from a pipeline.",
    url: "https://www.linkedin.com/posts/sampath-kumar-tn66sk9699_leadgeneration-b2bsales-salesstrategy-activity-7320729397999652866-_XUS",
    image: { src: "https://media.licdn.com/dms/image/v2/D5622AQHiLIeFvZ0QfA/feedshare-shrink_1280/B56ZZfQ4q_GUAo-/0/1745354984900?e=2147483647&v=beta&t=5A48yM6eKohdEFKahMbnfUD24drv23RAomJUmXDm2iA", width: 940, height: 788 },
  },
  {
    topic: "Growth strategy",
    title: "One in a thousand actually executes",
    summary: "Modern growth strategies that scale are not secret. The gap between knowing them and running them is the whole game.",
    url: "https://www.linkedin.com/posts/sampath-kumar-tn66sk9699_leadgeneration-gtmstrategy-saasgrowth-activity-7411688616969551872-z42h",
    image: { src: "https://media.licdn.com/dms/image/v2/D5622AQGp-1XsX9HH4A/feedshare-image-high-res/B56ZtubaeyJAAs-/0/1767084239914?e=2147483647&v=beta&t=6yjAKKFCegrh7J_2P5ErsHmtByvSi9iPN_6hS8sj7vA", width: 940, height: 788 },
  },
  {
    topic: "AI agents",
    title: "Building a no-code AI sales agent",
    summary: "Research the lead, make a personalised voice call, follow up — the simplest build, without the buried technical detail.",
    url: "https://www.linkedin.com/posts/sampath-kumar-tn66sk9699_leadgeneration-salesautomation-nocodetools-activity-7388858321400819713-n6AY",
    image: { src: "https://media.licdn.com/dms/image/v2/D5622AQEVpb-SXe_ZOw/feedshare-shrink_1280/B56ZonY4_YJ4As-/0/1761597429780?e=2147483647&v=beta&t=4iDRqsw4aS3tvbFoQIrJwVaIrAZrVExsydryPJeeFqQ", width: 940, height: 788 },
  },
  {
    topic: "Signal-based selling",
    title: "Find the signal, reach the buyer, win the deal",
    summary: "Outbound fails on breadth, not effort. Targeting people with a reason to care beats exporting every VP title.",
    url: "https://www.linkedin.com/posts/sampath-kumar-tn66sk9699_findthesignal-reachthebuyer-winthedeal-activity-7494985114817445890-5POB",
  },
  {
    topic: "LinkedIn outreach",
    title: "The workflow that books 60+ calls a month",
    summary: "Multiple LinkedIn accounts, Make and Airtable orchestration, bulk DMs through Waalaxy — cold and warm campaigns both.",
    url: "https://www.linkedin.com/posts/sampath-kumar-tn66sk9699_linkedingrowth-outboundsales-leadgentools-activity-7404506078937292800-Z6CS",
    image: { src: "https://media.licdn.com/dms/image/v2/D5622AQHppCglkWj4Cg/feedshare-shrink_1280/B56ZsIXCfAJsAs-/0/1765371816863?e=2147483647&v=beta&t=c4N4YZc8SVCsJIkxr6D5g_0ERRLgFip1A6OjZVuVjbo", width: 1080, height: 1350 },
  },
  {
    topic: "Voice & video",
    title: "Four times more replies with voice and video",
    summary: "Ninety percent of DMs look identical. A voice-first sequence is what cuts through an inbox flooded with text.",
    url: "https://www.linkedin.com/posts/sampath-kumar-tn66sk9699_linkedinoutreach-coldoutreach-aivoice-activity-7454787846931939328-8vSJ",
    image: { src: "https://media.licdn.com/dms/image/v2/D5622AQGjsKjxbNxNfw/feedshare-shrink_800/B56Z3S6C3FH4Ak-/0/1777359924908?e=2147483647&v=beta&t=eLySb-_z0kmixBihyLFYYBbT0Ozjge0bCuDDnyKDH7Q", width: 800, height: 800 },
  },
  {
    topic: "Allbound",
    title: "800+ qualified leads and $1.5M in pipeline",
    summary: "Outbound is crowded, inbound is slow. The system that combines both, and why neither one works alone any more.",
    url: "https://www.linkedin.com/posts/sampath-kumar-tn66sk9699_outbound-inboundmarketing-b2b-activity-7424790988356739072-hn_c",
    image: { src: "https://media.licdn.com/dms/image/v2/D5622AQHYwfkOCYsHmA/feedshare-image-high-res/B56ZwooDpAK8AU-/0/1770208115488?e=2147483647&v=beta&t=I1uxo2kkzsvYfVRITL5ZAvGA6WNVWRjciGXa-UvuWB8", width: 1086, height: 1536 },
  },
  {
    topic: "Cold email",
    title: "From 5% to 14% reply rates",
    summary: "The five-step cold email OS behind hundreds of booked meetings and 250+ reps trained on the same system.",
    url: "https://www.linkedin.com/posts/sampath-kumar-tn66sk9699_from-5-to-14-reply-rates-activity-7361679240221642756-Sc0t",
  },
  {
    topic: "Sales stack",
    title: "The outbound tool stack that is now the baseline",
    summary: "Prospecting databases, enrichment, email validation and sequencing — named tool by tool, layer by layer.",
    url: "https://www.linkedin.com/posts/sampath-kumar-tn66sk9699_outboundsales-b2bgrowth-salestech-activity-7413863897033523201-VcXA",
    image: { src: "https://media.licdn.com/dms/image/v2/D5622AQFRsl2M-PaNqg/feedshare-shrink_1280/B56ZuNV6v7IcAs-/0/1767602894236?e=2147483647&v=beta&t=tNvUhWif3BSjvfrnQ9CBlFxL523fRWhkJxCaGgKNpGg", width: 1080, height: 1350 },
  },
  {
    topic: "Outbound",
    title: "What a real outbound stack looks like",
    summary: "Tools picked on hype, nothing integrated, stale data. The exact way to stay stuck, and what to do instead.",
    url: "https://www.linkedin.com/posts/sampath-kumar-tn66sk9699_outboundsales-leadgeneration-salesautomation-activity-7446927900857257984-T8Zx",
    image: { src: "https://media.licdn.com/dms/image/v2/D5622AQHJhvMhEg36mg/feedshare-image-high-res/B56Z1jNdkHKcAU-/0/1775485966835?e=2147483647&v=beta&t=kVAD_lBut_019xBe6yFv6eZ7wtImF4P2gtDOF33HL7w", width: 1080, height: 1350 },
  },
  {
    topic: "Mindset",
    title: "The science behind manifestation",
    summary: "Not the law of attraction but the law of vibration — visualisation and inner state, framed through quantum possibility.",
    url: "https://www.linkedin.com/posts/sampath-kumar-tn66sk9699_quantummanifestation-lawofvibration-mindsetmatters-activity-7373673254269628416-TyAG",
    image: { src: "https://media.licdn.com/dms/image/v2/D5622AQG4Kquqc4GanQ/feedshare-image-high-res/B56ZlSKAMbIAAo-/0/1758019983278?e=2147483647&v=beta&t=1FRXRt9xwjIILbofJWz6UA8VlNpYQ_3URd4hWVAGS9k", width: 1024, height: 1536 },
  },
  {
    topic: "GTM stack",
    title: "The GTM stack that actually drives revenue",
    summary: "Founders buy tools that look impressive. After 15+ builds, the stack judged only on whether it helps close deals.",
    url: "https://www.linkedin.com/posts/sampath-kumar-tn66sk9699_gtmtools2026-activity-7422584179730706432-QYkk",
  },
  {
    topic: "Pipeline",
    title: "The best sales reps are pipeline architects, not closers",
    summary: "Average teams obsess over closing. Top teams build a pipeline that closes on its own, and revenue stops being a fire drill.",
    url: "https://www.linkedin.com/posts/sampath-kumar-tn66sk9699_salespipeline-b2bsales-revenuegrowth-activity-7406615365746823170-zrtG",
    image: { src: "https://media.licdn.com/dms/image/v2/D5622AQEeqL_RZWBmbg/feedshare-image-high-res/B56ZskIECVJ8As-/0/1765837653338?e=2147483647&v=beta&t=EnmoJ80Et20Qcgdx2UPD_N9K6gd63K_iUIFVFYEtDws", width: 1080, height: 1350 },
  },
  {
    topic: "SDR workflow",
    title: "The system I would build for an SDR team today",
    summary: "AI is replacing the repetitive half of the role. The reps who win run signals, systems and workflows better than anyone.",
    url: "https://www.linkedin.com/posts/sampath-kumar-tn66sk9699_sdrworkflow-salesautomation-intentdata-activity-7462736426556612608-NELa",
    image: { src: "https://media.licdn.com/dms/image/v2/D5622AQHxv9M6wY1gVg/feedshare-shrink_1280/B56Z5CYjgwJwAQ-/0/1779230193950?e=2147483647&v=beta&t=3fL6sb4YeNVdQ-WrZBD8WAv_czzzkZFzAON46eSiglk", width: 1200, height: 1200 },
  },
  {
    topic: "Signal-based selling",
    title: "Building a warm email allbound system",
    summary: "Capture intent from site visitors, LinkedIn engagement and job changes first — then the email is never really cold.",
    url: "https://www.linkedin.com/posts/sampath-kumar-tn66sk9699_signalbasedselling-warmemail-pipelineautomation-activity-7460214145502818304-61KS",
    image: { src: "https://media.licdn.com/dms/image/v2/D5622AQFNpbK71KQzKg/feedshare-image-high-res/B56Z4gBPB_H4AU-/0/1778653655417?e=2147483647&v=beta&t=FTKTNPnchWISnfV6YamlIdlx2If81Lo9z3H2XnjqGss", width: 1080, height: 1350 },
  },
  {
    topic: "Prospecting",
    title: "Prospecting past Sales Navigator",
    summary: "General databases, niche sources and signal tools — where to look, depending on exactly who you are targeting.",
    url: "https://www.linkedin.com/posts/sampath-kumar-tn66sk9699_leadgen-prospectingtools-activity-7450483123412295680-77fF",
  },
  {
    topic: "Warm email",
    title: "Cold email is dying, warm email is the future",
    summary: "Google keeps tightening the rules, and rightly so. What replaces scrape-and-blast when the inbox stops forgiving it.",
    url: "https://www.linkedin.com/posts/sampath-kumar-tn66sk9699_warmemail-leadgeneration-b2bmarketing-activity-7386017699916787712-rtRu",
    image: { src: "https://media.licdn.com/dms/image/v2/D5622AQE2NnekEPncPA/feedshare-image-high-res/B56ZoBn9LnKEAo-/0/1760963844148?e=2147483647&v=beta&t=LIvS8m8RiSw8mub5_ymhH-iY8G3OrCKWeLIkUaM37NM", width: 1080, height: 1350 },
  },
  {
    topic: "Tooling",
    title: "The toolkit powering client delivery right now",
    summary: "Intent data, enrichment, sourcing and sending. Every tool named, with the one job each of them is there to do.",
    url: "https://www.linkedin.com/posts/sampath-kumar-tn66sk9699_tool-kit-for-outreach-activity-7397193248634494976-_ger",
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
    emailLabel: "Email",
    emailPlaceholder: "you@company.com",
    emailInvalid: "That email doesn't look right.",
    companyLabel: "Company name (optional)",
    companyPlaceholder: "Acme Inc.",
    phoneLabel: "Phone",
    phonePlaceholder: "+91 99949 69699",
    phoneInvalid: "Enter a valid phone number.",
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
  unlockedHeading: "One client engagement, seven roles.",
  unlockedBody: "The client case study leads. Each role after it is a case study too: the work, then the headline result.",
  workLabel: "The work",
  resultLabel: "The result",
  footnote: "Employers and figures as recorded in the source content.",
  /**
   * A client outcome rather than an employer role, so it sits above the ROLES
   * list as its own card. It stays inside the gate like everything else here.
   */
  featured: {
    label: "Client case study",
    title: "From 1 to 25+ meetings a month",
    body: "A SaaS accounting platform with a strong product and no pipeline. The whole outbound engine was rebuilt on Instantly.ai — targeting, infrastructure, messaging and automation — and monthly meetings went from one or two to twenty-five and holding.",
    meta: "Carousel · 13 pages",
    cta: "Read the full breakdown on LinkedIn",
    url: "https://www.linkedin.com/posts/sampath-kumar-tn66sk9699_instantlycasestudy-activity-7437835571751886848-X2dy",
  },
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
