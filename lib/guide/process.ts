import type { GuideChapter } from "./types";

/**
 * Chapter 3 — LEAD GENERATION PROCESS (source: `LEAD GENERATION PROCESS.pdf`,
 * 2 pages). The six-step process plus the process/tools/pricing sheet. The
 * two MQL benchmark tables at the end are repeated in the source itself.
 */
export const PROCESS: GuideChapter = {
  id: "process",
  number: "03",
  title: "Lead Generation Process",
  source: "LEAD GENERATION PROCESS.pdf · 2 pages",
  intro: [],
  sections: [
    {
      id: "six-step-process",
      title: "The Six-Step Process",
      blocks: [
        {
          type: "process",
          steps: [
            { name: "Researching" },
            { name: "Prospecting" },
            { name: "Scraping & Validating" },
            { name: "Automating Email campaign by CRM" },
            { name: "Automating LinkedIn campaign by CRM" },
            { name: "Cold Calling by AI (If required)" },
          ],
        },
      ],
    },
    {
      id: "process-tools-pricing",
      title: "Process, Tools Used & Pricing",
      blocks: [
        {
          type: "table",
          headers: ["Process", "Tools Used", "Pricing"],
          rows: [
            ["Research", "Apollo.io", "Basic $49 (30,000 credits); Professional $79 (48,000 credits)"],
            ["Validating", "Never Bounce Or Million Verifier", "10K Emails cost around ($49); 10K Emails cost around ($39)"],
            [
              "CRM software for email Campaign",
              "Maildoso integrating with Apollo.io",
              "Combo: SMTP + Google Workspace (15 GW + 15 SMTP mailboxes) — $90/mo ($3 per SMTP and GW); SMTP 30 mailboxes — $75/mo ($2.5 per mailbox); 6 domains required (buy them here)",
            ],
            [
              "Sales Navigator Advanced Core (If required Smartlinks)",
              "—",
              "₹10,500 Monthly; ₹126,000 Yearly. Official pricing; sourced via 3rd-party vendors at ~50% discount (₹5,000/mo or ₹63,000/year).",
            ],
            ["CRM software for LinkedIn", "Waalaxy / Salesrobot", "Pro ₹885; Advanced ₹2,541; Basic $59; Advanced $79"],
          ],
        },
      ],
    },
    {
      id: "mql-benchmarks",
      title: "MQL Benchmarks (Meetings Booked)",
      blocks: [
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
      ],
    },
  ],
};
