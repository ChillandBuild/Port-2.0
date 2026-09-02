import type { GuideChapter } from "../types";

/**
 * Chapter 02 — ICP & Research. From Chapter 1 §1 of the assessment answers
 * (`CANDIDATE ASSESSMENT - ANSWERS.pdf`) and the ICP/research sections of
 * `Lead Generation Process (1)_.pdf`. Question headings rewritten as lesson
 * titles; the dangling "Tech stack analysis" stub is covered by the research
 * tools table ("Crunchbase" typo fixed).
 */
export const ICP_RESEARCH: GuideChapter = {
  id: "icp-research",
  number: "02",
  title: "ICP & Research",
  source: "CANDIDATE ASSESSMENT - ANSWERS.pdf · Lead Generation Process (1)_.pdf",
  intro: [
    { type: "para", text: "Everything starts from a sharply defined Ideal Customer Profile. Once the ICP is shared, the job is to turn it into precise, actionable outbound segments that go beyond basic demographics." },
  ],
  sections: [
    {
      id: "icp-segmentation",
      title: "ICP Segmentation",
      blocks: [
        { type: "para", text: "Company-Level Segmentation" },
        {
          type: "list",
          items: [
            {
              text: "Industry: Narrowing focus on the most relevant verticals where the product / service solves acute problems.",
            },
            {
              text: "Company Size:",
              children: [
                "LinkedIn headcount ranges (1–10, 11–50, 51–200, 200–500, 500–1000, etc.)",
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
            {
              text: "Pain-Based Segmentation",
              children: ["Segmenting list by problem solved, solution required / production output scale growth"],
            },
          ],
        },
      ],
    },
    {
      id: "priority-roles",
      title: "Priority Roles & Company-Size Adaptation",
      blocks: [
        { type: "para", text: "Which roles to target first — priority order:" },
        {
          type: "list",
          ordered: true,
          items: [
            { text: "C-Level Decision Makers First: CEO, Co-Founder, CMO, CFO (immediate buying authority)." },
            { text: "Director & Manager Level: Second tier for larger organizations." },
          ],
        },
        {
          type: "list",
          items: [
            {
              text: "Company Size Adaptation:",
              children: [
                "Startups (low employee count): Direct C-level outreaches work best.",
                "Established companies (high employee count): Navigating hierarchy → Manager → Director → C-Level for better context and buy-in.",
              ],
            },
          ],
        },
      ],
    },
    {
      id: "icp-foundation",
      title: "ICP Foundation: Primary & Intent-Based Research",
      blocks: [
        { type: "para", text: "ICP Foundation — Primary Research" },
        { type: "para", text: "Per client requirements, the Ideal Customer Profile is built using Annual Revenue, Employee Size, Tech Stack, and Growth Indicators to identify high-value prospects ready for the next step of prospecting leads." },
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
        { type: "para", text: "Intent-Based Research — Secondary Research" },
        { type: "para", text: "Finding prospects who are already showing buying intent, allowing for more targeted, relevant, and timely outreach." },
      ],
    },
    {
      id: "research-tools",
      title: "Research Tools: Primary and Secondary",
      blocks: [
        {
          type: "table",
          headers: ["Research Input", "Tools Used"],
          rows: [
            ["ICP Foundation — Annual revenue", "Zoominfo"],
            ["ICP Foundation — Employee size", "LinkedIn"],
            ["ICP Foundation — Tech stack and growth indicators", "Crunchbase, Bloomberg, Google, company websites."],
            [
              "Intent-based research",
              "Clay, Clearbit, Slintel, 6sense, Vector, Bombora, G2 Buyer Intent, Leadfeeder, Reveal — to identify companies showing active buying signals.",
            ],
            [
              "Growth Signals",
              "Targeting recently funded companies and those with open sales / marketing roles indicating expansion needs.",
            ],
          ],
        },
      ],
    },
  ],
};
