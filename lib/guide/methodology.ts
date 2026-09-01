import type { GuideChapter } from "./types";

/**
 * Chapter 2 — LEAD GENERATION PROCESS & METHODOLOGY (source:
 * `Lead Generation Process (1)_.pdf`, 15 pages). The PDF extraction
 * letter-spaced several headings; the spacing is normalized here without
 * changing any wording. Author: Sampath Kumar.
 */
export const METHODOLOGY: GuideChapter = {
  id: "methodology",
  number: "02",
  title: "Lead Generation Process & Methodology",
  source: "Lead Generation Process (1)_.pdf · 15 pages",
  intro: [
    { type: "para", text: "LEAD GENERATION PROCESS & METHODOLOGY — Complete 90-Day Multi-Channel Strategy." },
    { type: "para", text: "Sampath Kumar — https://www.linkedin.com/in/sampath-kumar-tn66sk9699" },
  ],
  sections: [
    {
      id: "process-overview",
      title: "Lead Generation Process Overview",
      blocks: [
        {
          type: "process",
          steps: [
            { name: "Research", description: "ICP driven by clients/customers" },
            { name: "Prospecting" },
            { name: "Scraping & Validating" },
            { name: "Manual / Automating Email campaign by CRM" },
            { name: "Manual / Automating LinkedIn campaign by CRM" },
            { name: "Manual / Cold calling by AI (If required)" },
          ],
        },
        { type: "callout", variant: "note", text: "KPI achieved." },
      ],
    },
    {
      id: "icp-driven-research",
      title: "ICP-Driven Lead Research",
      blocks: [
        { type: "para", text: "ICP Foundation — Primary Research" },
        { type: "para", text: "As per Clients requirements inputs the Ideal Customer Profiles using Annual Revenue, Employee Size, Tech Stack, and Growth Indicators to identify high-value prospects ready for next step of prospecting leads" },
        {
          type: "list",
          items: [
            { text: "White-Label Service Interest" },
            { text: "Growth Indicators" },
            { text: "Customer Base / Use Cases" },
            { text: "Hiring Signals / Open Roles" },
            { text: "Website Traffic / Engagement Volume" },
          ],
        },
        { type: "para", text: "Intent-based Research — Secondary Research" },
        { type: "para", text: "Finding prospects who are already showing buying Intent, allowing for more targeted, relevant, and timely outreach." },
        { type: "para", text: "Tech stack Analysis" },
      ],
    },
    {
      id: "research-tools",
      title: "Tools Used for Research (Primary and Secondary)",
      blocks: [
        {
          type: "table",
          headers: ["Research Input", "Tools Used"],
          rows: [
            ["ICP Foundation — Annual revenue", "Zoominfo"],
            ["ICP Foundation — Employee size", "LinkedIn"],
            ["ICP Foundation — Tech stack, and growth Indicators", "Cruchbase, Bloomberg, Google, Company websites."],
            [
              "Intent based research",
              "Clay, Clearbit, Slintel, 6sense, vector, Bombora, G2 Buyer Intent, Leadfeeder, Reveal — to identify companies showing active buying signals.",
            ],
            [
              "Growth Signals",
              "Targeting recently funded companies and those with open sales / marketing roles indicating expansion needs.",
            ],
          ],
        },
      ],
    },
    {
      id: "prospecting-methodologies",
      title: "Prospecting Methodologies: 3-Tier Approach",
      blocks: [
        { type: "para", text: "Our key Audience / Prospects: Decision-Making Authorities Like CEO → CFO → COO → CTO → CIO → CMO. VP & Director of Sales → VP & Director of Marketing → VP & Director of Operations → VP & Director of Engineering → VP & Director of Product." },
        { type: "para", text: "Some companies also have: Senior VP (SVP) → Higher than VP, often with broader scope. Executive VP (EVP). If required — Senior Manager / Manager level." },
        { type: "para", text: "To effectively reach and convert them, we segment our prospecting into three strategic approaches:" },
        {
          type: "list",
          items: [
            {
              text: "Manual Prospecting",
              children: [
                "100% human-led research, Prospecting & outreach",
                "Deep personalization based on individual insights",
                "Best suited for high-value, low-volume targets.",
              ],
            },
            {
              text: "Semi-Automatic Prospecting",
              children: [
                "Blend of automation + human input",
                "Data collected via tools, messaging personalized by team",
                "Scalable yet retains relevance",
              ],
            },
            {
              text: "Fully Automated Prospecting",
              children: [
                "End-to-end automation: data collection, Prospecting, outreach & follow-ups",
                "Ideal for high-volume, top-of-funnel campaigns",
                "Minimal manual effort, A/B tested messaging",
              ],
            },
          ],
        },
      ],
    },
    {
      id: "outreach-strategy-tools",
      title: "Outreach Strategy & Tools",
      blocks: [
        { type: "para", text: "3 Prospecting Methods — Outreach is a critical pillar in our engagement process → and I approach it using three scalable methods based on the campaign goals and client preferences. Tool selection depends on budget, campaign volume, and specific feature needs. We work with:" },
        {
          type: "list",
          items: [
            { text: "CRM & Sales Platforms: HubSpot, Salesforce, Zoho CRM, SalesHandy" },
            { text: "Email Outreach Tools: Smartlead, Maildosa, Mailchimp" },
          ],
        },
        {
          type: "list",
          items: [
            {
              text: "1. Manual Outreach",
              children: [
                "Highly personalized emails",
                "Ideal for high-value, niche targets",
              ],
            },
            {
              text: "2. Semi-Automated Outreach",
              children: [
                "Uses CRM + email templates with smart personalization",
                "Balances scale and human touch",
              ],
            },
            {
              text: "3. Fully Automated Outreach",
              children: [
                "Large-scale campaigns",
                "Designed for speed, A/B testing, and lead nurturing",
              ],
            },
          ],
        },
      ],
    },
    {
      id: "tools-per-stage",
      title: "Tools I Use for Each Stages",
      blocks: [
        {
          type: "collapsible",
          summary: "Full tool lists per prospecting tier",
          blocks: [
            {
              type: "table",
              headers: ["Stage", "Tools used"],
              rows: [
                ["Manual Prospecting", "LinkedIn Sales Navigator / Recruiter, Hunter.io, Apollo.io, Snov.io, email & LinkedIn, manual CRM campaigns & updates"],
                ["Semi-Automatic Prospecting", "LinkedIn Sales Navigator / Recruiter, Apollo.io, Snov.io, Clay, Instantly, Phantom Buster, Waalaxy, Lusha"],
                ["Fully Automated Prospecting", "Clay, Instantly, Waalaxy, Lemlist, HeyReach.io, My Profilia, Make, Smartlead, n8n"],
              ],
            },
          ],
        },
      ],
    },
    {
      id: "scraping-validation",
      title: "Scraping & Validation: Data Accuracy Engine",
      blocks: [
        { type: "para", text: "2-Step Email Verification Methodology — To ensure high deliverability, minimize bounce rates, and stay fully compliant with legal standards, I implement a robust 2-step email verification process:" },
        { type: "para", text: "Step 1: Initial Verification" },
        {
          type: "list",
          items: [
            { text: "Performed using trusted tools like MillionVerifier and ZeroBounce" },
            { text: "Validates email syntax, domain, and mailbox existence" },
            {
              text: "Detects:",
              children: [
                "Invalid email addresses",
                "Disposable/temporary emails",
                "Role-based emails (e.g., info@, support@).",
              ],
            },
          ],
        },
        { type: "para", text: "Step 2: Deep Validation — Ensuring accuracy and quality with advanced tools" },
        {
          type: "list",
          items: [
            { text: "SMTP Checks (via MillionVerifier, ZeroBounce) — Verifies if the recipient mailbox exists and can receive messages in real-time." },
            { text: "Catch-All Domain Detection (via ZeroBounce) — Identifies domains that accept all emails, helping improve targeting and reduce false positives." },
          ],
        },
        { type: "para", text: "Bounce Rate Monitoring (Mailsuite for Gmail & Reach Inbox's via email analytics tools + ZeroBounce dashboard)" },
        { type: "para", text: "Tracks soft and hard bounces continuously to optimize list quality and sender reputation." },
      ],
    },
    {
      id: "compliance-data-hygiene",
      title: "Compliance & Data Hygiene",
      blocks: [
        { type: "para", text: "Built-in tools and practices to protect privacy and maintain trust" },
        {
          type: "list",
          items: [
            {
              text: "GDPR Compliance (via consent tracking systems / CRM integrations)",
              children: [
                "Tracks user consent status",
                "Ensures proper data handling and right-to-be-forgotten protocols",
              ],
            },
            {
              text: "CAN-SPAM Compliance (via automated email platforms like Mailchimp, SendGrid, etc.)",
              children: [
                "Automated opt-out/unsubscribe handling",
                "Clear sender identification in all outbound emails",
              ],
            },
            {
              text: "Database Hygiene (via MillionVerifier, ZeroBounce)",
              children: [
                "Routine list cleaning",
                "Removal of invalid, duplicate, and inactive addresses",
              ],
            },
          ],
        },
        {
          type: "metrics",
          items: [
            { value: "92%", label: "Deliverability Rate", note: "up to 92%" },
            { value: "Reduced", label: "Spam complaints and bounce rates" },
            { value: "Clean", label: "Permission-based database", note: "ready for high-performance campaigns" },
          ],
        },
      ],
    },
    {
      id: "linkedin-automation",
      title: "LinkedIn Automation: Thought Leadership & Outreach",
      blocks: [
        { type: "para", text: "Strategic LinkedIn Growth" },
        { type: "para", text: "Utilize aged LinkedIn accounts (10+ years) with Waalaxy and Dripify for 500 connections/month per account, achieving 15% response rates through value-driven messaging." },
        {
          type: "list",
          items: [
            { text: "Connection Strategy" },
            { text: "Profile Optimization" },
            { text: "Create thought leadership content with 2-3 posts/week per account focusing on industry insights and solution positioning." },
            { text: "Implement 4-week sequence: connection → welcome → value proposition → soft follow-up with content sharing." },
          ],
        },
      ],
    },
    {
      id: "drip-methodology",
      title: "Lead Generation with Drip Campaign Methodology",
      blocks: [
        { type: "para", text: "Drip Campaign Structure" },
        { type: "para", text: "Our lead generation approach centers on giving equal importance to content and engagement tracking. The strategy follows a structured drip campaign model, ensuring prospects receive timely, relevant information that guides them from awareness to conversion. I use a minimum of seven sequences to build consistent communication with potential leads. Each sequence has a specific purpose:" },
        {
          type: "process",
          steps: [
            { name: "Why we are reaching out", description: "Explain the intent behind our communication and the value we aim to bring." },
            { name: "Who we are", description: "Introduce our company, core values, capabilities, and expertise." },
            { name: "How we can help", description: "Describe how our products or services can improve productivity or solve business challenges." },
            { name: "Case studies", description: "Share real-world success stories that demonstrate measurable impact." },
            { name: "Portfolio", description: "Present a visual and detailed overview of completed projects or key clients." },
            { name: "Product or Service Decks", description: "Offer a deep dive into our solutions and deliverables." },
            { name: "Follow-up and Call to Action", description: "Encourage responses, meetings, or demos to move the lead forward." },
          ],
        },
        { type: "para", text: "This sequence ensures a natural storytelling flow built on trust and value creation." },
      ],
    },
    {
      id: "linkedin-integration",
      title: "Integration with LinkedIn Campaigns",
      blocks: [
        { type: "para", text: "Benefits of Using Smart Links — Alongside email campaigns, we leverage LinkedIn's advanced features to improve engagement. By using Smart Links, we directly attach and share product decks, portfolios, or case studies within LinkedIn messages or posts." },
        { type: "para", text: "Smart Links provide real-time analytics showing whether the recipient opened, clicked, or how long they viewed shared content. This helps us gauge lead interest, prioritize highly engaged prospects, and tailor follow-ups more effectively." },
        { type: "callout", variant: "result", text: "Compared to traditional email campaigns, LinkedIn Smart Link campaigns show significantly higher response and meeting booking rates." },
      ],
    },
    {
      id: "ai-cold-calling",
      title: "AI Cold Calling: Voice Automation at Scale",
      blocks: [
        {
          type: "list",
          items: [
            { text: "AI-Powered Calling — Deploy Regie.ai, Humantic AI, and Kore.ai for natural language processing calls with real-time adaptation, achieving 25% connection rates and 35% conversion to meetings." },
            { text: "Smart Dialing — AI auto-dials from CRM data, uses NLP for natural conversations, and transfers hot leads to human reps instantly." },
            { text: "Call Analytics — Record and transcribe all calls with Gong/Chorus for objection analysis, pitch improvement, and performance coaching." },
          ],
        },
      ],
    },
    {
      id: "ninety-day-targets",
      title: "90-Day Performance Targets & KPIs",
      blocks: [
        {
          type: "timeline",
          phases: [
            {
              label: "Days 0–30",
              title: "Phase 1: Setup",
              description: "Account warm up, ICP finalization, tool setup, and initial lead list building.",
              bullets: [
                "4 aged LinkedIn accounts acquired",
                "Email domains warmed up",
                "ICP lists built and validated",
              ],
            },
            {
              label: "Days 31–60",
              title: "Phase 2: Launch",
              description: "Soft launch with 50-70 leads/day, content creation, and performance optimization.",
              bullets: [
                "Pilot campaigns launched",
                "Personal branding content created",
                "Metrics tracking implemented",
              ],
            },
            {
              label: "Days 61–90",
              title: "Phase 3: Scale",
              description: "Full-scale operations achieving 200+ SQLs/month across all channels.",
              bullets: [
                "Full automation deployed",
                "Weekly video content released",
                "Continuous optimization loop",
              ],
            },
          ],
        },
        {
          type: "metrics",
          items: [
            { value: "200+", label: "SQLs / Month" },
            { value: "45%", label: "Email Open Rate" },
            { value: "15%", label: "LinkedIn Response" },
            { value: "50%", label: "Demo Conversion" },
          ],
        },
      ],
    },
    {
      id: "closing-reflection",
      title: "A Note on the Discipline",
      blocks: [
        {
          type: "quote",
          text: "Pre-Sales, Lead Generation, SDR, or LDR — these roles may seem small or go unnoticed by many, but the impact they create is anything but. The strategies, processes, and methodologies involved are complex, data-driven, and constantly evolving. This presentation is a reflection of my 7+ years of experience — built, refined, and updated over time with real-world learning and execution.\n\nOne key takeaway? Marketing doesn't win on Day 1. It's a time-consuming, trust-building process. Sometimes results show on Day 15... sometimes Day 25 — but rarely the next day. Don't expect instant outcomes. Focus on consistent efforts. Trust the process.",
        },
      ],
    },
  ],
};
