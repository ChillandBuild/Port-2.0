import type { GuideChapter } from "../types";

/**
 * Chapter 08 — Metrics, Targets & Reporting. From the assessment's "Reporting
 * & Metrics" (§11) and the benchmark tables from "Meeting Generation Strategy"
 * (§9) (`CANDIDATE ASSESSMENT - ANSWERS.pdf`), plus the 90-day timeline from
 * `Lead Generation Process (1)_.pdf`. The benchmark tables appeared in two
 * sources; they live here once. The deck's contradictory metric cards (200+
 * SQLs/month, 45% opens, 15% LinkedIn response, 50% demo conversion) are
 * replaced with the assessment's benchmark numbers, which the email/LinkedIn
 * tables in this chapter actually support.
 */
export const METRICS_TARGETS: GuideChapter = {
  id: "metrics-targets",
  number: "08",
  title: "Metrics, Targets & Reporting",
  source: "CANDIDATE ASSESSMENT - ANSWERS.pdf · Lead Generation Process (1)_.pdf",
  intro: [
    { type: "para", text: "What to measure daily, weekly and monthly — and what the infrastructure you build should realistically produce in meetings, based on the benchmarks below." },
  ],
  sections: [
    {
      id: "daily-metrics",
      title: "Daily Metrics",
      blocks: [
        { type: "para", text: "Exact KPIs vary with the organization's fixed targets; these are the working benchmarks." },
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
      ],
    },
    {
      id: "weekly-metrics",
      title: "Weekly Metrics",
      blocks: [
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
      ],
    },
    {
      id: "monthly-metrics",
      title: "Monthly Success Metrics",
      blocks: [
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
      id: "mql-benchmarks",
      title: "MQL Benchmarks: Meetings by Infrastructure",
      blocks: [
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
      ],
    },
    {
      id: "ninety-day-roadmap",
      title: "The 90-Day Roadmap",
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
              description: "Soft launch with 50–70 leads/day, content creation, and performance optimization.",
              bullets: [
                "Pilot campaigns launched",
                "Personal branding content created",
                "Metrics tracking implemented",
              ],
            },
            {
              label: "Days 61–90",
              title: "Phase 3: Scale",
              description: "Full-scale operations across all channels, tracking toward the combined monthly projections above.",
              bullets: [
                "Full automation deployed",
                "Weekly video content released",
                "Continuous optimization loop",
              ],
            },
          ],
        },
      ],
    },
    {
      id: "improving-results",
      title: "Improving Results Over Time",
      blocks: [
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
  ],
};
