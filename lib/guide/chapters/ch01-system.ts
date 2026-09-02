import type { GuideChapter } from "../types";

/**
 * Chapter 01 — The System. Merged from two near-duplicate sources:
 * `Lead Generation Process (1)_.pdf` (process overview, 15 pages) and
 * `LEAD GENERATION PROCESS.pdf` (2 pages). The two variants of the six-step
 * process are reconciled into one canonical list; prospecting tiers and the
 * per-tier tool list come from the 15-page source unchanged.
 */
export const SYSTEM: GuideChapter = {
  id: "system",
  number: "01",
  title: "The System",
  source: "Lead Generation Process (1)_.pdf · LEAD GENERATION PROCESS.pdf",
  intro: [
    { type: "para", text: "Lead Generation Process & Methodology — a complete 90-day multi-channel strategy. Everything in this course hangs off one six-step system; the chapters that follow break down each step in the order you will actually execute them." },
  ],
  sections: [
    {
      id: "six-step-process",
      title: "The Six-Step Process",
      blocks: [
        {
          type: "process",
          steps: [
            { name: "Research", description: "ICP driven by client/customer inputs." },
            { name: "Prospecting" },
            { name: "Scraping & Validating" },
            { name: "Email Campaign — manual or automated via CRM" },
            { name: "LinkedIn Campaign — manual or automated via CRM" },
            { name: "Cold Calling by AI (if required)" },
          ],
        },
      ],
    },
    {
      id: "prospecting-tiers",
      title: "Prospecting Methodologies: The 3-Tier Approach",
      blocks: [
        { type: "para", text: "Key Audience / Prospects: Decision-making authorities like CEO → CFO → COO → CTO → CIO → CMO. VP & Director of Sales → VP & Director of Marketing → VP & Director of Operations → VP & Director of Engineering → VP & Director of Product." },
        { type: "para", text: "Some companies also have: Senior VP (SVP) → higher than VP, often with broader scope. Executive VP (EVP). If required — Senior Manager / Manager level." },
        { type: "para", text: "To effectively reach and convert them, prospecting is segmented into three strategic approaches:" },
        {
          type: "list",
          items: [
            {
              text: "Manual Prospecting",
              children: [
                "100% human-led research, prospecting & outreach",
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
                "End-to-end automation: data collection, prospecting, outreach & follow-ups",
                "Ideal for high-volume, top-of-funnel campaigns",
                "Minimal manual effort, A/B tested messaging",
              ],
            },
          ],
        },
      ],
    },
    {
      id: "tools-per-tier",
      title: "Tools Used for Each Tier",
      blocks: [
        {
          type: "collapsible",
          summary: "Full tool lists per prospecting tier",
          blocks: [
            {
              type: "table",
              headers: ["Tier", "Tools used"],
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
  ],
};
