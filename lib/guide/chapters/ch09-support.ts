import type { GuideChapter } from "../types";

/**
 * Chapter 09 — Support & Working Together. From the assessment's "Support
 * Needed from Us" (§12, `CANDIDATE ASSESSMENT - ANSWERS.pdf`). §13 ("Risks &
 * Backup Plan" — the 90-days-free / ₹5K-per-meeting guarantee pitch and the
 * "Ready to start?" close) was dropped when the course was restructured from
 * the job-application source into course content.
 */
export const SUPPORT: GuideChapter = {
  id: "support",
  number: "09",
  title: "Support & Working Together",
  source: "CANDIDATE ASSESSMENT - ANSWERS.pdf",
  intro: [
    { type: "para", text: "The system runs on inputs. This is what's needed from the client or manager, how often, and in what format — so execution never stalls waiting on assets or answers." },
  ],
  sections: [
    {
      id: "support-needed",
      title: "What Support Is Needed",
      blocks: [
        {
          type: "list",
          ordered: true,
          items: [
            {
              text: "ICP Clarification (One-time + updates):",
              children: [
                "Target industries, roles, company size, geography.",
                "Key pain points and buying objections.",
                "Industry specifics (terminology, compliance, decision process).",
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
                "Previous email and LinkedIn templates for reference replies.",
              ],
            },
          ],
        },
      ],
    },
    {
      id: "support-frequency",
      title: "Frequency & Format",
      blocks: [
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
  ],
};
