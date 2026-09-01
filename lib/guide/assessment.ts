import type { GuideChapter } from "./types";

/**
 * Chapter 1 — CANDIDATE ASSESSMENT - ANSWERS (source:
 * `CANDIDATE ASSESSMENT - ANSWERS.pdf`, 19 pages). Transcribed from
 * content/lead-generation.md verbatim: source question numbering (including
 * the document's own 5 → 8 → 7 → 8 sequence), claims and terminology are
 * preserved as written.
 */
export const ASSESSMENT: GuideChapter = {
  id: "assessment",
  number: "01",
  title: "Candidate Assessment — Answers",
  source: "CANDIDATE ASSESSMENT - ANSWERS.pdf · 19 pages",
  intro: [
    { type: "para", text: "30-60-90 Day Plan Assignment — Role: Email Marketing + LinkedIn Marketing Specialist. Objective: Generate qualified meetings consistently." },
    { type: "para", text: "Please share a clear, practical 30-60-90 day plan. Assume you will execute this yourself. Keep it simple, step-by-step, and focused on real execution." },
  ],
  sections: [
    // ---------------------------------------------------------- FIRST 30 DAYS
    {
      id: "icp-understanding",
      title: "1. ICP Understanding",
      group: "FIRST 30 DAYS – SETUP & FOUNDATIONS",
      blocks: [
        { type: "para", text: "After the ICP is shared: How will you segment the ICP?" },
        { type: "para", text: "My ICP Segmentation Process — once the ICP is defined, I create precise, actionable outbound segments that go beyond basic demographics:" },
        { type: "para", text: "Company-Level Segmentation" },
        {
          type: "list",
          items: [
            {
              text: "Industry: Narrowing focus on the most relevant verticals where the product / Service solves acute problems.",
            },
            {
              text: "Company Size:",
              children: [
                "LinkedIn headcount ranges (1–10, 11–50, 51–200, 200-500, 500-1000, etc.)",
                "Revenue filters via ZoomInfo for precise targeting.",
              ],
            },
            {
              text: "Geography: Prioritizing highest-converting regions first, adapting based on product maturity and service reach.",
            },
            {
              text: "Growth Stage: Identifying using buying intent signals:",
              children: [
                "Tools: ZoomInfo (funding rounds), Crunchbase (funding status), LinkedIn Sales Navigator (recent hires/expansion posts), Bombora (intent data).",
              ],
            },
          ],
        },
        { type: "para", text: "2. Which roles will you target first and why?" },
        { type: "para", text: "Role-Level Segmentation — Priority Order:" },
        {
          type: "list",
          ordered: true,
          items: [
            { text: "C-Level Decision Makers First: CEO, Co-Founder, CMO, CFO (Immediate buying authority)." },
            { text: "Director & Manager Level: Second tier for larger organizations." },
          ],
        },
        {
          type: "list",
          items: [
            {
              text: "Company Size Adaptation:",
              children: [
                "Startups (Low employee count): Direct C-level outreaches work best.",
                "Established Companies (High employee count): Navigating hierarchy → Manager → Director → C-Level for better context and buy-in.",
              ],
            },
            {
              text: "Pain-Based Segmentation",
              children: ["Segmenting list by PROBLEM SOLVED, Solution required / Production output scale growth"],
            },
          ],
        },
      ],
    },
    {
      id: "tools-monthly-cost",
      title: "2. Tools & Monthly Cost (Mandatory)",
      group: "FIRST 30 DAYS – SETUP & FOUNDATIONS",
      blocks: [
        { type: "para", text: "My Proven Outbound Tools Stack (7+ Years Experience)" },
        { type: "para", text: "Email outreach tool" },
        { type: "para", text: "With 7+ years across diverse campaigns, I've mastered tools like HubSpot, Sales Handy, Mailometer, Mailchimp, Mailer Lite, Mailer Send, Zoho CRM, Fresh sales CRM, and more." },
        { type: "para", text: "Here's my current 2026 lean stack optimized for high deliverability, scale, and ROI:" },
        {
          type: "table",
          caption: "Must-Have Email Outreach Tools",
          headers: ["Tool", "Monthly Pricing", "Yearly Pricing", "Key Notes"],
          rows: [
            ["Maildoso", "$100–$733", "$1,200–$8,800", "Starts at $100 (32 mailboxes); $166 (68 mailboxes); $733 (400 mailboxes) — ideal for high-volume scaling."],
            ["Instantly", "$37–$97", "$444–$1,164", "Standard growth plans; perfect for warm-up and lead volume scaling."],
            ["Smart lead", "$39–$174+", "$468–$2,088+", "Basic: $39; Pro: $94; Custom: $174+; unlimited warm-up across all plans."],
            ["Woodpecker", "$29–$1,354", "$348–$16,248", "Starter: $29; Growth: $188; Scale: $1,354 — built-in warm-up + A/B testing."],
          ],
        },
        { type: "callout", variant: "note", text: "Integration: All connect seamlessly with Maildoso for optimized email flows." },
        { type: "para", text: "LinkedIn tool (Sales Navigator / automation if any)" },
        {
          type: "table",
          caption: "LinkedIn Sourcing & Outreach Tools",
          headers: ["Tool", "Monthly Pricing (India)", "Yearly Pricing (India)", "Key Notes"],
          rows: [
            ["Sales Navigator Advanced Core", "₹10,500", "₹126,000", "Official pricing; sourced via 3rd-party vendors at ~50% discount (₹5,000/mo or ₹63,000/year)."],
            ["Waalaxy / SalesRobot", "$25–$99", "$240–$950", "Safe LinkedIn automation; uses voucher links and fake accounts with proper warm-up to avoid blocks."],
          ],
        },
        { type: "para", text: "Lead database(s)" },
        {
          type: "table",
          caption: "Lead Database & Enrichment Tools",
          headers: ["Tool", "Monthly Pricing", "Yearly Pricing", "Key Notes"],
          rows: [
            ["Instantly / Smart lead / Clay", "$37–$174", "$444–$2,088", "Built-in databases + enrichment; Clay excels for advanced workflows."],
          ],
        },
        { type: "para", text: "Email verification / enrichment tool" },
        {
          type: "table",
          caption: "Email Verification Tools (Bounce Reduction)",
          headers: ["Tool", "Monthly Pricing", "Yearly Pricing", "Key Notes"],
          rows: [
            ["Million Verifier", "$29–$299", "$348–$3,588", "Pay-per-verification or unlimited plans."],
            ["ZeroBounce / NeverBounce", "$16–$499", "$192–$5,988", "High accuracy; reduces bounces to <1%."],
          ],
        },
        { type: "para", text: "CRM (if different from ours)" },
        { type: "para", text: "CRM Tools (My Experience)" },
        {
          type: "list",
          items: [
            { text: "HubSpot (Free tier for startups; scales to $20+/user/mo)" },
            { text: "Pipedrive ($14–$99/user/mo)" },
            { text: "Zoho CRM ($14–$52/user/mo)" },
          ],
        },
        {
          type: "callout",
          variant: "target",
          title: "Total Estimated Monthly Cost (Core Stack)",
          text: "₹45,000–₹80,000 ($600–$800 USD) for full email + LinkedIn + verification.",
        },
        { type: "para", text: "It varies as per selected tools and requirements. I have costed over all tools" },
        { type: "para", text: "Campaign Methodology" },
        { type: "para", text: "All email + LinkedIn campaigns run as drip methodology:" },
        {
          type: "list",
          items: [
            { text: "Weekly cadence over 45 days (1.5 months)." },
            { text: "7 strategic follow-ups building value progressively." },
            { text: "Multi-channel sync: Email + LinkedIn + Personal branding in LinkedIn for maximum response rates." },
          ],
        },
      ],
    },
    {
      id: "domains-email-setup",
      title: "3. Domains & Email Setup",
      group: "FIRST 30 DAYS – SETUP & FOUNDATIONS",
      blocks: [
        { type: "para", text: "Explain: Number of domains needed · Inboxes per domain · Warm-up duration · Daily sending limits (initial and after scale)" },
        { type: "para", text: "My Modern Email Infrastructure Approach (2026 Standard)" },
        { type: "para", text: "Evolution of My Domain & Warm-up Strategy" },
        {
          type: "list",
          items: [
            {
              text: "Earlier Approach (Traditional):",
              children: [
                "Purchased domains from GoDaddy/Hostinger.",
                "Used external warm-up tools (Warmy.io, Instantly, Mailivery).",
                "Manual ramp: 30 emails/day → +15–30 emails/month → 30–90 days for full warm-up.",
              ],
            },
            {
              text: "Current Approach (Maildoso-Style All-in-One):",
              children: [
                "Domain Strategy: Buy organization-related variants (.io, .is, .us) directly through provider.",
                "Built-in Warm-up: No external tools needed — achieves 95% deliverability with reputable mailboxes/domains optimized for outreach.",
                "Setup Speed: Domains + mailboxes ready in under 10 minutes.",
              ],
            },
          ],
        },
        { type: "para", text: "Recommended Maildoso Plans (Cost vs Value)" },
        {
          type: "table",
          headers: ["Plan", "Monthly Cost", "Key Features", "Why Worth It"],
          rows: [
            ["Quarterly SMTP", "$299/qtr ($99.67/mo)", "32 mailboxes, 8 FREE domains ($3.1/mailbox)", "Best value for scaling; no external domain costs."],
            ["SMTP + Google Workspace Combo", "$50/mo", "10 GW + 10 SMTP mailboxes ($2.5 each), 4 domains needed", "Hybrid setup for flexibility; buy domains separately."],
          ],
        },
        { type: "para", text: "Why Maildoso > Traditional Tools: Higher upfront cost, but worth every penny for:" },
        {
          type: "list",
          items: [
            { text: "Guaranteed inbox placement (95% deliverability)." },
            { text: "Zero external warm-up hassle." },
            { text: "Enterprise-grade monitoring and reputation management." },
          ],
        },
        {
          type: "process",
          title: "Execution Workflow",
          steps: [
            { name: "Setup", description: "Purchase domains → Provision mailboxes via Maildoso (10 mins)." },
            { name: "Database Prep", description: "Build/enriching leads using Instantly, Smartlead, or Clay." },
            { name: "Integration", description: "Connect to CRM (Pipedrive/HubSpot/Zoho) for tracking." },
            { name: "Launch", description: "Run drip campaigns with built-in warm-up handling everything automatically." },
          ],
        },
        { type: "callout", variant: "result", text: "This streamlined approach eliminates 80% of setup time while maximizing deliverability and scale." },
      ],
    },
    {
      id: "content-ownership",
      title: "4. Content Ownership",
      group: "FIRST 30 DAYS – SETUP & FOUNDATIONS",
      blocks: [
        { type: "para", text: "4. Content Ownership" },
        { type: "para", text: "Clarify: Will you write email + LinkedIn copy yourself?" },
        { type: "callout", variant: "target", text: "Yes, I write ALL email + LinkedIn copy myself — from subject lines to sequences to LinkedIn messaging." },
        { type: "para", text: "Initial Ramp-Up (First 30–45 Days):" },
        {
          type: "list",
          items: [
            { text: "Need time to fully understand services, core USPs, and specific terminology." },
            { text: "Will shadow calls, review materials, and clarify doubts for precision." },
          ],
        },
        { type: "para", text: "What input do you need from your manager?" },
        { type: "para", text: "Input Needed from Manager" },
        {
          type: "list",
          items: [
            { text: "ICP Details: Target industries, roles, key pain points, company size/geography." },
            { text: "Core Messaging: 2–3 key USPs, main offer/outcome, specific terminology." },
            { text: "Assets Available: Website links, case studies, testimonials, metrics." },
            { text: "Knowledge Transfer: Training/shadowing sessions for construction industry specifics (since my background is IT/SaaS/services)." },
            { text: "Tone/Voice Guidelines: Formal/professional vs conversational vs authority-driven." },
          ],
        },
        { type: "para", text: "How will you source content (website, case studies, competitors, etc.)?" },
        { type: "para", text: "Content Sourcing Process" },
        {
          type: "list",
          items: [
            { text: "Primary: Client Website — Extracting services, features, testimonials, metrics." },
            { text: "Case Studies/Testimonials — Specific outcomes for credibility." },
            { text: "Competitor Analysis — Identify gaps for differentiation." },
            { text: "Industry Research — Construction pain points, regulations, trends." },
            { text: "ICP Pain Mapping — Match solutions to buyer problems." },
          ],
        },
      ],
    },
    // ---------------------------------------------------------- 31–60 DAYS
    {
      id: "email-campaign-plan",
      title: "5. Email Campaign Plan",
      group: "31–60 DAYS – EXECUTION",
      blocks: [
        { type: "para", text: "Explain: Number of campaigns you will run" },
        { type: "para", text: "Number of Campaigns I Will Run" },
        { type: "para", text: "Campaign Strategy is Multi-Dimensional & Highly Segmented:" },
        { type: "para", text: "1. Region/Time Zone Segmentation" },
        {
          type: "list",
          items: [
            {
              text: "US Markets: Separating campaigns by high-priority states (New York, San Francisco, Ohio, etc.).",
              children: ["Timing: Launching at IST midnight to hit US morning (EST/PST)."],
            },
            {
              text: "Australia Markets: Dedicated campaigns.",
              children: ["Timing: Launching IST early morning to align with AUS business hours."],
            },
            { text: "Other Regions: Time zone-optimized scheduling for Europe, Middle East, etc." },
          ],
        },
        { type: "para", text: "2. Industry Segmentation" },
        {
          type: "list",
          items: [
            { text: "Separating campaigns per vertical when ICP spans multiple industries (e.g., Pharma vs Construction vs SaaS)." },
            { text: "Each gets tailored pain points, case studies, and terminology." },
          ],
        },
        { type: "para", text: "3. Role-Level Segmentation — Custom content per hierarchy level (never same copy):" },
        {
          type: "list",
          items: [
            { text: "C-Level (CEO, CFO, CMO): Strategic vision, ROI, competitive edge." },
            { text: "Director Level: Implementation details, team efficiency, compliance." },
            { text: "Manager Level: Day-to-day pain relief, ease of use, quick wins." },
          ],
        },
        { type: "para", text: "4. Compliance-Driven Approach — Strict GDPR/CAN-SPAM adherence:" },
        {
          type: "list",
          items: [
            { text: "No mass emailing — hyper-personalized sequences only." },
            { text: "Region-specific consent language and unsubscribe flows." },
            { text: "No generic blasts across levels/regions — each segment gets unique copy." },
          ],
        },
        { type: "para", text: "As per Experience (20+) Campaign Volume" },
        {
          type: "list",
          items: [
            { text: "Week 1–2: 2–4 campaigns (test highest-priority ICP segments)." },
            { text: "Ongoing: 6–12 active campaigns (2–3 per region/industry/role combo)." },
            { text: "Scale: Up to 20+ campaigns for mature operations." },
          ],
        },
        { type: "para", text: "Add to follow-up: Typical email sequence length · Types of campaigns (cold, follow-ups, re-engagement) — Drip Campaign" },
        { type: "para", text: "My 7-Touch Drip Campaign Framework" },
        { type: "para", text: "Each sequence follows this proven structure (adapted from IT/SaaS/services success):" },
        {
          type: "process",
          steps: [
            { name: "Intro Email", description: "Attention grab + ICP pain acknowledgment." },
            { name: "Value Prop Email", description: "Why we're reaching out + specific help offered + who we are in detail." },
            { name: "Social Proof", description: "Testimonials from previous clients/prospects." },
            { name: "Case Studies", description: "Deep dive into relevant success stories." },
            { name: "Competitive Edge", description: "Pricing/value comparison vs competitors." },
            { name: "Irresistible Offer", description: "Time-sensitive deal or exclusive benefit." },
            { name: "Final Close", description: "Free 7–14-day demo (SaaS) OR problem-solution offer (services/construction)." },
          ],
        },
      ],
    },
    {
      id: "linkedin-outreach-plan",
      title: "8. LinkedIn Outreach Plan",
      group: "31–60 DAYS – EXECUTION",
      blocks: [
        { type: "para", text: "Explain: Daily LinkedIn activities" },
        { type: "para", text: "Daily LinkedIn Activities (Dual Methodology) — I deploy two proven approaches based on scale and compliance needs:" },
        { type: "para", text: "1. Organic Method (No Automation)" },
        { type: "para", text: "Daily Activities:" },
        {
          type: "list",
          items: [
            { text: "Using Sales Navigator or import lists from Clay/Instantly/Smartlead." },
            { text: "Visiting each prospect's profile — review recent activity, posts, comments." },
            { text: "Send personalized connection requests referencing their content/activity (never salesy)." },
            { text: "Post-connect approach: Commenting thoughtfully on their posts or share relevant insights before pitching." },
            { text: "Goal: Building genuine relationships (inbound-style leads)." },
          ],
        },
        { type: "para", text: "Connection request approach & Follow-up message flow" },
        { type: "para", text: "2. Automation Method (Full Sequence)" },
        { type: "para", text: "7-Touch LinkedIn Sequence (Parallel to Email):" },
        {
          type: "list",
          items: [
            { text: "No attachments/PDFs — using Smart Links (Sales Navigator Advanced Core)." },
            { text: "Upload all assets (testimonials, case studies, pricing comparisons) to Smart Links." },
            { text: "Key Advantage: Tracking clicks, time spent on each page, receive email notifications." },
            { text: "Final follow-ups personalized based on Smart Link engagement data." },
          ],
        },
        { type: "para", text: "Automation Tools: Waalaxy / SalesRobot for safe, sequenced messaging." },
        { type: "para", text: "Account Strategy for Automation" },
        {
          type: "list",
          items: [
            {
              text: "Fake Accounts (Primary for Scale):",
              children: [
                "10-year-old accounts purchased from 3rd-party vendors (₹50K–₹75K one-time investment).",
                "Vendor Guarantee: 98% it won't if it restricted/banned. Free replacement.",
              ],
            },
            {
              text: "Authenticity Build:",
              children: ["3 posts + 1 carousel/week (personal branding around product/services). (Fake Accounts)"],
            },
            {
              text: "Personal Accounts (Inbound Focus):",
              children: [
                "2 posts + 1 carousel/week (thought leadership). (Original Accounts)",
                "Generates high-quality inbound leads from organic engagement.",
              ],
            },
          ],
        },
        { type: "para", text: "Daily Execution Cadence" },
        {
          type: "table",
          headers: ["Activity", "Time Investment", "Output"],
          rows: [
            ["Organic Visits/Connections", "1–2 hours", "20–50 personalized requests"],
            ["Automation Monitoring", "45 mins per account", "Reviewing Smart Link clicks + follow-ups"],
            ["Content Posting (All Accounts)", "30 mins per account", "3–4 posts across fake/personal accounts"],
            ["Engagement/Comments", "30 mins per account", "Building relationships on accepted connections"],
          ],
        },
      ],
    },
    {
      id: "lead-tracking-process",
      title: "7. Lead Tracking Process",
      group: "31–60 DAYS – EXECUTION",
      blocks: [
        { type: "para", text: "Explain step-by-step: What happens when someone opens, replies, says \"not now\", or goes silent" },
        { type: "para", text: "Multi-Contact Per Company Strategy — Never targeting just one person per company." },
        { type: "para", text: "Decision Tree Based on Reply & Role" },
        { type: "para", text: "Company-Level Logic" },
        {
          type: "list",
          items: [
            { text: "C-Level \"No\": Stops all outreach to that company (final authority)." },
            { text: "Manager/Director \"No\": Remove individual only → target 3–5 other decision makers in same company." },
            { text: "Multi-Threading: Always maintaining 3–7 active contacts per targeted company / account." },
            { text: "C-Level Positive → Booking calendar + notifying AE" },
            { text: "C-Level Negative → Company-wide suppress" },
            { text: "Manager Reply → Individual suppress + alerting SDR for manual review" },
            { text: "\"Not Now\" → Long-term nurture list" },
          ],
        },
        {
          type: "table",
          caption: "Response handling by reply type and seniority",
          headers: ["Response Type", "C-Level (CEO/CFO/CMO)", "Manager/Director Level"],
          rows: [
            ["Opens (No Reply)", "Continue sequence + add to nurture drip", "Continue sequence + test 2nd variant"],
            ["Positive Reply", "Immediate discovery call with Sales + pause sequence", "Qualify → Intro call + pause sequence"],
            ["\"Not Now\" / Interested Later", "Move to long-term nurture (90-day drip)", "Nurture that person + continue outreach to others in company"],
            ["Negative Reply (\"Not Interested\")", "Remove from outreach (final decision authority)", "Remove ONLY that person + continue outreach to ALL other contacts in company"],
            ["Silent (No Response After Full Sequence)", "Archive + quarterly re-engagement", "Archive that person + continue with remaining company contacts"],
          ],
        },
      ],
    },
    {
      id: "crm-stages",
      title: "CRM stages you will use",
      group: "31–60 DAYS – EXECUTION",
      blocks: [
        { type: "para", text: "How leads move from cold → meeting → nurture" },
        {
          type: "process",
          steps: [
            { name: "New" },
            { name: "Engaged" },
            { name: "Contacted" },
            { name: "Qualified (MQL)" },
            { name: "Meeting Booked (SDR / BDR)" },
            { name: "Opportunity" },
            { name: "Nurture" },
          ],
        },
        {
          type: "list",
          items: [
            { text: "Auto-Advance: Open rates >3 → Engaged; Replies → Contacted." },
            { text: "Auto-Nurture: Full sequence complete + no reply → Nurture (90-day drip)." },
            { text: "C-Level Block: Negative C-Level reply → Company suppresses tag." },
            { text: "Multi-Contact: Manager reply → Individual nurture, company contacts continue." },
          ],
        },
        {
          type: "mono",
          text: "Cold Lead → Email/LI Sequence → Engaged → Reply/Click → MQL\nMeeting Booked → (Call Done) → Opportunity\n\"Not Now\"/Silent → Nurture",
        },
      ],
    },
    {
      id: "data-hygiene",
      title: "8. Data Hygiene",
      group: "31–60 DAYS – EXECUTION",
      blocks: [
        { type: "para", text: "Explain: How you handle bounces" },
        { type: "para", text: "Primary Verification (Million Verifier)" },
        {
          type: "list",
          items: [
            { text: "2-Step Process: Every email undergoes Million Verifier → Catchy all email validation." },
            { text: "Zero Tolerance: ALL invalid emails removed before sequences start." },
          ],
        },
        { type: "callout", variant: "result", text: "Result: Launching campaigns with 100% verified, deliverable emails only." },
        { type: "para", text: "Secondary Tools (NeverBounce / ZeroBounce):" },
        {
          type: "list",
          items: [
            { text: "Used for ongoing monitoring during campaigns." },
            { text: "Soft bounce retry: 2 attempts (48hr intervals)." },
            { text: "Hard bounce: Immediate permanent suppress." },
          ],
        },
        {
          type: "table",
          headers: ["Bounce Type", "Action", "Frequency"],
          rows: [
            ["Hard Bounce (<1% target)", "Permanent suppress + remove from all sequences", "Immediate"],
            ["Soft Bounce", "Retry 2x (48hr intervals) → suppress if persistent", "Auto 72hrs"],
            ["Above 2% Bounce Rate", "Pause domain → investigate + clean list", "Daily check"],
          ],
        },
        { type: "callout", variant: "result", text: "Result: Double verification upfront + secondary monitoring = industry-leading <0.5% bounce rates." },
        { type: "para", text: "Unsubscribes" },
        {
          type: "list",
          items: [
            { text: "As we are following GDPR/CAN-SPAM: One-click unsubscribe in every email footer." },
            { text: "Automation: Instantly/HubSpot auto-suppresses across campaigns." },
            { text: "Double Opt-Out: Confirmation email + log in CRM." },
          ],
        },
        { type: "para", text: "Duplicate leads & Old or inactive data" },
        {
          type: "list",
          items: [
            { text: "Duplicate Leads Handling → Pipedrive/HubSpot CRM auto-merge duplicates." },
            { text: "Inactive data → Updating CRM Focused and maintain proper track records Master Excel sheets" },
          ],
        },
      ],
    },
    // ---------------------------------------------------------- 61–90 DAYS
    {
      id: "meeting-generation",
      title: "9. Meeting Generation Strategy",
      group: "61–90 DAYS – SCALE & OPTIMISE",
      blocks: [
        { type: "para", text: "Explain: How you convert replies into meetings" },
        { type: "para", text: "How I Convert Replies into Meetings — Reply Categorization → Automated Action Framework:" },
        { type: "para", text: "1. Positive Replies (Interest Signals)" },
        { type: "para", text: "Characteristics:" },
        {
          type: "list",
          items: [
            { text: "Questioning about product/service details." },
            { text: "Requesting for time slots/meetings." },
          ],
        },
        { type: "para", text: "Immediate Actions:" },
        {
          type: "list",
          items: [
            { text: "Auto-reply template → Offering 3 calendar slots (15/20-min discovery)." },
            { text: "Internal Slack/Email: Notify BDE/ops team + attach Smart Link engagement data." },
            { text: "CRM: Move to \"Meeting Booked\" → Pause sequence." },
            { text: "Follow-up: If no slot picked in 24hrs → 1 nudge email + LI message + Getting Contact number from Lusha and sharing to SDR / BDR for cold calling" },
          ],
        },
        { type: "callout", variant: "target", title: "Conversion Target", text: "60–80% → booked meeting." },
        { type: "para", text: "2. Negative Replies (\"Not Interested\")" },
        { type: "para", text: "Role-Based Action:" },
        {
          type: "list",
          items: [
            { text: "C-Level: Full company suppress (final authority)." },
            { text: "Manager/Director: Individual suppress + continue outreach to other company contacts." },
            { text: "CRM: Tag \"Closed Lost\" + reason logged." },
          ],
        },
        { type: "para", text: "3. Neutral Replies (\"Tell me more\" / Vague)" },
        { type: "para", text: "Characteristics: \"Send info\" / \"What's this about?\" / \"Not sure if relevant.\"" },
        { type: "para", text: "Tailored Follow-Ups:" },
        {
          type: "list",
          items: [
            { text: "Response 1 (24hrs): 1-paragraph value + Smart Link (case study matching their reply)." },
            { text: "Response 2 (48hrs): Specific objection handling + calendar link." },
            { text: "Max 2 follow-ups → Nurture if no reply." },
          ],
        },
        { type: "para", text: "Execution Workflow" },
        {
          type: "mono",
          text: "Reply Detected → Categorizing\n├── Positive → Calendar + Team Alert → Meeting\n├── Negative → Suppress (role-based)\n└── Neutral → 2x Follow-up → Nurture",
        },
        { type: "para", text: "Tech Stack for Conversion" },
        {
          type: "list",
          items: [
            { text: "Instantly/Smart lead: Auto-reply triggers + calendar integration." },
            { text: "CRM: Auto-stage progression + team notifications." },
            { text: "Smart Links: Pre-qualify with content engagement before call." },
          ],
        },
        { type: "callout", variant: "result", text: "Proven Result: 25–40% reply-to-meeting conversion through role-specific handling and rapid response." },
        { type: "para", text: "Target meetings per month" },
        { type: "para", text: "Target Meetings Per Month (Resource-Based)" },
        { type: "para", text: "Meetings scale directly with email volume + LinkedIn connections. Realistic benchmarks from 7+ years:" },
        {
          type: "table",
          caption: "Email-Based MQLs (Meetings Booked)",
          headers: ["Setup", "Emails/Day per Inbox", "Total Emails/Day", "Monthly Emails (22 days)", "MQL Conversion", "Monthly Meetings"],
          rows: [
            ["1 Domain + 3 New Inboxes", "30–35", "90–105", "~2,000", "0.1–0.15%", "2 meetings"],
            ["1 Domain + 3 Mature Inboxes", "150–175", "450–525", "~10,000", "0.08–0.1%", "4–5 meetings"],
            ["2 Domains + 6 Inboxes", "150–175", "900–1,050", "~20,000", "0.08–0.1%", "6–8 meetings"],
            ["3 Domains + 9 Inboxes", "150–175", "1,350–1,575", "~30,000", "0.08–0.1%", "9–12 meetings"],
          ],
        },
        {
          type: "table",
          caption: "LinkedIn-Based MQLs (Meetings Booked)",
          headers: ["Setup", "Monthly Connections Sent", "Acceptance Rate", "Replies", "MQL Conversion", "Monthly Meetings"],
          rows: [
            ["1 Account", "650", "~54% (350 accepted)", "~43% (150 replies)", "1.3–2.7%", "2–4 meetings"],
            ["2 Accounts", "1,300", "~54% (700 accepted)", "~43% (300 replies)", "1.3–2.7%", "4–6 meetings"],
            ["3 Accounts", "1,950", "~54% (1,050 accepted)", "~43% (450 replies)", "1.3–2.7%", "7–12 meetings"],
          ],
        },
        {
          type: "table",
          caption: "Combined Monthly Projections",
          headers: ["Infrastructure", "Email Meetings", "LinkedIn Meetings", "Total Meetings"],
          rows: [
            ["Starter (1 domain + 1 LI)", "2", "2–4", "4–6"],
            ["Growth (1 domain + 2 LI)", "4–5", "4–6", "8–11"],
            ["Scale (2 domains + 3 LI)", "6–8", "7–12", "14–22"],
            ["Enterprise (3+ domains + 5+ LI)", "9–12+", "10–20+", "22–35+"],
          ],
        },
        { type: "para", text: "How you will improve results over time" },
        {
          type: "metrics",
          items: [
            { value: "0.08–0.15%", label: "Email MQL rate", note: "industry benchmark for hyper-personalized outbound" },
            { value: "54% / 43%", label: "LinkedIn acceptance / reply rate", note: "1.3–2.7% MQL (Smart Link qualified)" },
            { value: "21–30 days", label: "Ramp time", note: "new infrastructure hits full volume post-warming-up" },
            { value: "2×", label: "Scale multiplier", note: "doubling the infrastructure → doubling the meetings. Linear growth with proper execution." },
          ],
        },
      ],
    },
    {
      id: "nurturing-followups",
      title: "10. Nurturing & Follow-ups",
      group: "61–90 DAYS – SCALE & OPTIMISE",
      blocks: [
        { type: "para", text: "How you nurture interested but not-ready leads" },
        { type: "para", text: "Neutral Replies (\"Tell me more\" / Vague)" },
        { type: "para", text: "Characteristics: \"Send info\" / \"What's this about?\" / \"Not sure if relevant.\"" },
        { type: "para", text: "Tailored Follow-Ups:" },
        {
          type: "list",
          items: [
            { text: "Response 1 (24hrs): 1-paragraph value + Smart Link (case study matching their reply)." },
            { text: "Response 2 (48hrs): Specific objection handling + calendar link." },
            { text: "Max 2 follow-ups → Nurture if no reply." },
          ],
        },
        { type: "para", text: "Email + LinkedIn follow-up approaches" },
        { type: "para", text: "My 7-Touch Drip Campaign Framework" },
        { type: "para", text: "Each sequence follows this proven structure (adapted from IT/SaaS/services success):" },
        {
          type: "process",
          steps: [
            { name: "Intro Email", description: "Attention grab + ICP pain acknowledgment." },
            { name: "Value Prop Email", description: "Why we're reaching out + specific help offered + who we are in detail." },
            { name: "Social Proof", description: "Testimonials from previous clients/prospects." },
            { name: "Case Studies", description: "Deep dive into relevant success stories." },
            { name: "Competitive Edge", description: "Pricing/value comparison vs competitors." },
            { name: "Irresistible Offer", description: "Time-sensitive deal or exclusive benefit." },
            { name: "Final Close", description: "Free 7–14-day demo (SaaS) OR problem-solution offer (services/construction)." },
          ],
        },
      ],
    },
    {
      id: "reporting-metrics",
      title: "11. Reporting & Metrics",
      group: "61–90 DAYS – SCALE & OPTIMISE",
      blocks: [
        { type: "para", text: "List: Daily metrics · Weekly metrics · Monthly success metrics" },
        { type: "para", text: "Based on KPI fixed up organization it varies" },
        {
          type: "table",
          caption: "Daily metrics",
          headers: ["Metric", "Target", "Action if Off-Target"],
          rows: [
            ["Email Opens", "40–60%", "A/B test subjects + personalization"],
            ["Email Clicks", "10–20%", "Improve CTA + Smart Link content"],
            ["LI Connection Acceptance", "50–60%", "Refine connection messaging"],
            ["Bounces", "<1%", "Suppress + verify list"],
            ["New Replies", "2–5 (scale-dependent)", "Review categorization + follow-up"],
          ],
        },
        {
          type: "table",
          caption: "Weekly metrics",
          headers: ["Metric", "Target", "Action"],
          rows: [
            ["Total Replies", "15–50", "Segment analysis (positive/neutral/negative)"],
            ["Meetings Booked", "1–4", "Conversion rate review + sequence optimization"],
            ["LI Smart Link Clicks", "20–40% of connections", "Content refresh + follow-up timing"],
            ["Unsubscribes", "<0.5%", "Footer/compliance review"],
            ["Pipeline Velocity", "20% stage progression", "Bottleneck identification"],
          ],
        },
        {
          type: "table",
          caption: "Monthly success metrics",
          headers: ["Metric", "Target", "Success Indicator"],
          rows: [
            ["Total Meetings Booked", "8–25+ (per infrastructure)", "Core revenue driver"],
            ["Reply Rate", "2–5%", "Campaign effectiveness"],
            ["MQL Conversion (Reply→Meeting)", "25–40%", "Qualification quality"],
            ["Pipeline Value", "$50K–$250K+ (qualified opps)", "Revenue forecast"],
            ["CAC Efficiency", "<20% of LTV", "Cost per opportunity"],
            ["List Health", "<1% bounce, <0.5% unsubscribe", "Sustainability"],
          ],
        },
      ],
    },
    {
      id: "support-needed",
      title: "12. Support Needed from Us",
      group: "61–90 DAYS – SCALE & OPTIMISE",
      blocks: [
        { type: "para", text: "Clearly mention: What support you need from your manager" },
        { type: "para", text: "What I Need" },
        {
          type: "list",
          ordered: true,
          items: [
            {
              text: "ICP Clarification (One-time + updates):",
              children: [
                "Target industries, roles, company size, geography.",
                "Key pain points and buying objections.",
                "Construction industry specifics (terminology, compliance, decision process).",
              ],
            },
            {
              text: "Core Assets (One-time setup):",
              children: [
                "Website links, case studies, testimonials.",
                "Pricing overview + competitor positioning.",
                "2–3 core USPs and messaging guardrails.",
              ],
            },
            {
              text: "Knowledge Transfer (First 30 days):",
              children: [
                "1–2 sessions for service understanding.",
                "Answers on terminology/edge cases.",
              ],
            },
            {
              text: "Sequence Approval (Ongoing):",
              children: ["1-round review per campaign (tracked Google Doc)."],
            },
            {
              text: "Escalations (As needed):",
              children: [
                "High-value replies needing intro/approval.",
                "C-level objections requiring authority input.",
                "(Previous run email and LinkedIn templates for reference reply msg too)",
              ],
            },
          ],
        },
        { type: "para", text: "How often & in what format" },
        {
          type: "table",
          headers: ["Need", "Frequency", "Format"],
          rows: [
            ["ICP/Assets", "One-time (Week 1)", "Loom video + shared doc"],
            ["Knowledge Transfer", "2x first month", "30-min calls + Slack Q&A"],
            ["Sequence Review", "Per campaign (1–2/week)", "Google Doc (comments)"],
            ["Escalations", "As needed (2–5/mo)", "Slack"],
            ["Daily / Weekly Sync", "Weekly (15 mins)", "Slack huddle + metrics review"],
            ["Monthly Strategy", "Monthly (30 mins)", "Deck + call"],
          ],
        },
      ],
    },
    {
      id: "risks-backup-plan",
      title: "13. Risks & Backup Plan",
      group: "61–90 DAYS – SCALE & OPTIMISE",
      blocks: [
        { type: "para", text: "Briefly explain: What could go wrong in the first 90 days · How you will adjust if results are poor" },
        { type: "para", text: "My Confidence: Practically nothing will go wrong if we execute the proven plan outlined above." },
        { type: "para", text: "Why I'm Certain (7+ Years Proof)" },
        {
          type: "list",
          items: [
            { text: "All processes battle-tested across IT, SaaS, Pharma, Edutech, & Fintech campaigns." },
            { text: "Deliverability obsession (75% to 85% inbox + <4% bounce guarantees results)." },
            { text: "ICP-hyper-targeting eliminates spray-and-pray failures." },
            { text: "No spam tactics — only compliant, personalized outreach." },
          ],
        },
        { type: "para", text: "The tools mentioned above (Maildoso, Instantly, Smartlead, Sales Navigator, etc.) have been detailed in my LinkedIn posts — check there for full reasoning. Plenty of tools exist, but these are proven for 2026 deliverability + scale." },
        {
          type: "callout",
          variant: "guarantee",
          title: "My 90-Day Performance Guarantee",
          text: "If you provide the tools/resources I mentioned above — Deal: I'll work 90 days FREE. Track every metric transparently. Post 90 days: 5K INR per meeting booked. Challenge Accepted. This removes all risk for you.",
        },
        { type: "para", text: "Only Risk if We Deviate" },
        {
          type: "mono",
          text: "Your plan + my execution = No guarantees (need full alignment).\nMy plan + my execution = Results or no pay.\n\n= Provide tools + trust the process → meetings guaranteed.",
        },
        { type: "para", text: "Ready to start?" },
      ],
    },
  ],
};
