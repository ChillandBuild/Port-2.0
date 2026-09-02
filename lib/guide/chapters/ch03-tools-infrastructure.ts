import type { GuideChapter } from "../types";

/**
 * Chapter 03 — Tools, Budget & Infrastructure. Merged from the assessment's
 * "Tools & Monthly Cost" and "Domains & Email Setup" sections
 * (`CANDIDATE ASSESSMENT - ANSWERS.pdf`) plus the Process/Tools/Pricing sheet
 * (`LEAD GENERATION PROCESS.pdf`). Every tool's pricing now appears exactly
 * once: the 2-page sheet's Apollo / verification / Maildoso combo / Sales
 * Navigator / Waalaxy rows are folded into the corresponding tables below,
 * and the standalone pricing table is gone.
 */
export const TOOLS_INFRASTRUCTURE: GuideChapter = {
  id: "tools-infrastructure",
  number: "03",
  title: "Tools, Budget & Infrastructure",
  source: "CANDIDATE ASSESSMENT - ANSWERS.pdf · LEAD GENERATION PROCESS.pdf",
  intro: [
    { type: "para", text: "The lean 2026 stack for high deliverability, scale, and ROI — what each tool costs, and the domain/inbox setup that everything runs on." },
  ],
  sections: [
    {
      id: "email-outreach-tools",
      title: "Email Outreach Tools",
      blocks: [
        { type: "para", text: "With 7+ years across diverse campaigns, tools mastered include HubSpot, Sales Handy, Mailometer, Mailchimp, Mailer Lite, Mailer Send, Zoho CRM, Fresh sales CRM, and more." },
        {
          type: "table",
          caption: "Must-Have Email Outreach Tools",
          headers: ["Tool", "Monthly Pricing", "Yearly Pricing", "Key Notes"],
          rows: [
            ["Maildoso", "$100–$733", "$1,200–$8,800", "Starts at $100 (32 mailboxes); $166 (68 mailboxes); $733 (400 mailboxes) — ideal for high-volume scaling."],
            ["Instantly", "$37–$97", "$444–$1,164", "Standard growth plans; perfect for warm-up and lead volume scaling."],
            ["Smartlead", "$39–$174+", "$468–$2,088+", "Basic: $39; Pro: $94; Custom: $174+; unlimited warm-up across all plans."],
            ["Woodpecker", "$29–$1,354", "$348–$16,248", "Starter: $29; Growth: $188; Scale: $1,354 — built-in warm-up + A/B testing."],
          ],
        },
        { type: "callout", variant: "note", text: "Integration: All connect seamlessly with Maildoso for optimized email flows." },
      ],
    },
    {
      id: "sourcing-verification-tools",
      title: "LinkedIn, Lead Database & Verification Tools",
      blocks: [
        { type: "para", text: "LinkedIn sourcing & outreach" },
        {
          type: "table",
          caption: "LinkedIn Sourcing & Outreach Tools",
          headers: ["Tool", "Monthly Pricing (India)", "Yearly Pricing (India)", "Key Notes"],
          rows: [
            ["Sales Navigator Advanced Core", "₹10,500", "₹126,000", "Official pricing; sourced via 3rd-party vendors at ~50% discount (₹5,000/mo or ₹63,000/year)."],
            ["Waalaxy / SalesRobot", "$25–$99", "$240–$950", "Safe LinkedIn automation; uses voucher links and fake accounts with proper warm-up to avoid blocks. Waalaxy: Pro ₹885, Advanced ₹2,541; SalesRobot: Basic $59, Advanced $79."],
          ],
        },
        { type: "para", text: "Lead databases & enrichment" },
        {
          type: "table",
          caption: "Lead Database & Enrichment Tools",
          headers: ["Tool", "Monthly Pricing", "Yearly Pricing", "Key Notes"],
          rows: [
            ["Instantly / Smartlead / Clay", "$37–$174", "$444–$2,088", "Built-in databases + enrichment; Clay excels for advanced workflows."],
            ["Apollo.io", "$49–$79", "—", "Basic: $49 (30,000 credits); Professional: $79 (48,000 credits)."],
          ],
        },
        { type: "para", text: "Email verification" },
        {
          type: "table",
          caption: "Email Verification Tools (Bounce Reduction)",
          headers: ["Tool", "Monthly Pricing", "Yearly Pricing", "Key Notes"],
          rows: [
            ["Million Verifier", "$29–$299", "$348–$3,588", "Pay-per-verification or unlimited plans; 10K emails ≈ $39."],
            ["ZeroBounce / NeverBounce", "$16–$499", "$192–$5,988", "High accuracy; reduces bounces to <1%. NeverBounce 10K emails ≈ $49."],
          ],
        },
      ],
    },
    {
      id: "crm-budget",
      title: "CRM Tools & Total Monthly Budget",
      blocks: [
        { type: "para", text: "CRM tools (by experience):" },
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
          text: "₹45,000–₹80,000 ($600–$800 USD) for full email + LinkedIn + verification. It varies as per selected tools and requirements.",
        },
      ],
    },
    {
      id: "domains-email-setup",
      title: "Domains, Inboxes & Warm-Up",
      blocks: [
        { type: "para", text: "The modern email infrastructure approach (2026 standard). Number of domains, inboxes per domain, warm-up duration, and daily sending limits all flow from this setup." },
        { type: "para", text: "Evolution of the domain & warm-up strategy" },
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
        { type: "para", text: "Recommended Maildoso plans (cost vs value)" },
        {
          type: "table",
          caption: "Maildoso Plans",
          headers: ["Plan", "Monthly Cost", "Key Features", "Why Worth It"],
          rows: [
            ["Quarterly SMTP", "$299/qtr ($99.67/mo)", "32 mailboxes, 8 FREE domains ($3.1/mailbox)", "Best value for scaling; no external domain costs."],
            ["SMTP + Google Workspace Combo (10+10)", "$50/mo", "10 GW + 10 SMTP mailboxes ($2.5 each), 4 domains needed", "Hybrid setup for flexibility; buy domains separately."],
            ["SMTP + Google Workspace Combo (15+15)", "$90/mo", "15 GW + 15 SMTP mailboxes ($3 each), 6 domains required (bought via Maildoso)", "Larger hybrid setup from the process & pricing sheet."],
            ["SMTP Only (30 mailboxes)", "$75/mo", "30 SMTP mailboxes ($2.5 per mailbox), 6 domains required", "Pure SMTP volume play."],
          ],
        },
        { type: "para", text: "Why Maildoso over traditional tools: higher upfront cost, but worth it for:" },
        {
          type: "list",
          items: [
            { text: "Guaranteed inbox placement (95% deliverability)." },
            { text: "Zero external warm-up hassle." },
            { text: "Enterprise-grade monitoring and reputation management." },
          ],
        },
      ],
    },
    {
      id: "setup-workflow",
      title: "The Setup-to-Launch Workflow",
      blocks: [
        {
          type: "process",
          title: "Execution Workflow",
          steps: [
            { name: "Setup", description: "Purchase domains → provision mailboxes via Maildoso (10 mins)." },
            { name: "Database Prep", description: "Build and enrich leads using Instantly, Smartlead, or Clay." },
            { name: "Integration", description: "Connect to CRM (Pipedrive/HubSpot/Zoho) for tracking." },
            { name: "Launch", description: "Run drip campaigns with built-in warm-up handling everything automatically." },
          ],
        },
        { type: "callout", variant: "result", text: "This streamlined approach eliminates 80% of setup time while maximizing deliverability and scale." },
      ],
    },
  ],
};
