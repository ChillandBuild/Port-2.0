import type { GuideChapter } from "../types";

/**
 * Chapter 05 — LinkedIn Outreach. From the assessment's "LinkedIn Outreach
 * Plan" (§8, `CANDIDATE ASSESSMENT - ANSWERS.pdf`) — the daily-activities,
 * account-strategy and cadence content is kept as written — plus the
 * LinkedIn automation section of `Lead Generation Process (1)_.pdf`. The
 * deck's conflicting volume/response figures (500 connections, 15% response)
 * are dropped in favour of the assessment's numbers (650 connections, 43%
 * replies, benchmarked in Chapter 08); Dripify and the 4-week sequence are
 * folded in.
 */
export const LINKEDIN: GuideChapter = {
  id: "linkedin",
  number: "05",
  title: "LinkedIn Outreach",
  source: "CANDIDATE ASSESSMENT - ANSWERS.pdf · Lead Generation Process (1)_.pdf",
  intro: [
    { type: "para", text: "LinkedIn runs in parallel with email: a daily organic method, an automation method sequenced alongside the email drip, and Smart Links to measure real engagement." },
  ],
  sections: [
    {
      id: "linkedin-daily-activities",
      title: "Daily LinkedIn Activities: Two Methods",
      blocks: [
        { type: "para", text: "Dual methodology — two proven approaches based on scale and compliance needs:" },
        { type: "para", text: "1. Organic Method (No Automation)" },
        { type: "para", text: "Daily activities:" },
        {
          type: "list",
          items: [
            { text: "Using Sales Navigator or import lists from Clay/Instantly/Smartlead." },
            { text: "Visiting each prospect's profile — review recent activity, posts, comments." },
            { text: "Send personalized connection requests referencing their content/activity (never salesy)." },
            { text: "Post-connect approach: Commenting thoughtfully on their posts or sharing relevant insights before pitching." },
            { text: "Goal: Building genuine relationships (inbound-style leads)." },
          ],
        },
        { type: "para", text: "2. Automation Method (Full Sequence)" },
        { type: "para", text: "7-touch LinkedIn sequence (parallel to email):" },
        {
          type: "list",
          items: [
            { text: "No attachments/PDFs — using Smart Links (Sales Navigator Advanced Core)." },
            { text: "Upload all assets (testimonials, case studies, pricing comparisons) to Smart Links." },
            { text: "Key advantage: Tracking clicks, time spent on each page, receive email notifications." },
            { text: "Final follow-ups personalized based on Smart Link engagement data." },
          ],
        },
        { type: "para", text: "Automation tools: Waalaxy / SalesRobot for safe, sequenced messaging." },
      ],
    },
    {
      id: "linkedin-account-strategy",
      title: "Account Strategy for Automation",
      blocks: [
        {
          type: "list",
          items: [
            {
              text: "Fake Accounts (Primary for Scale):",
              children: [
                "10-year-old accounts purchased from 3rd-party vendors (₹50K–₹75K one-time investment).",
                "Vendor guarantee: 98% it won't get restricted/banned — free replacement if it is.",
              ],
            },
            {
              text: "Authenticity Build:",
              children: ["3 posts + 1 carousel/week (personal branding around product/services). (Fake accounts)"],
            },
            {
              text: "Personal Accounts (Inbound Focus):",
              children: [
                "2 posts + 1 carousel/week (thought leadership). (Original accounts)",
                "Generates high-quality inbound leads from organic engagement.",
              ],
            },
          ],
        },
      ],
    },
    {
      id: "linkedin-execution-cadence",
      title: "Daily Execution Cadence",
      blocks: [
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
      id: "linkedin-growth-sequence",
      title: "Thought Leadership & the 4-Week Sequence",
      blocks: [
        { type: "para", text: "Automation runs on aged LinkedIn accounts (10+ years) using Waalaxy or Dripify, with value-driven messaging throughout." },
        {
          type: "list",
          items: [
            { text: "Connection Strategy" },
            { text: "Profile Optimization" },
            { text: "Create thought leadership content with 2–3 posts/week per account focusing on industry insights and solution positioning." },
            { text: "Implement 4-week sequence: connection → welcome → value proposition → soft follow-up with content sharing." },
          ],
        },
      ],
    },
    {
      id: "smart-links",
      title: "Smart Links: Measuring Real Engagement",
      blocks: [
        { type: "para", text: "Alongside email campaigns, LinkedIn's advanced features improve engagement. Using Smart Links, product decks, portfolios, or case studies are attached and shared directly within LinkedIn messages or posts." },
        { type: "para", text: "Smart Links provide real-time analytics showing whether the recipient opened, clicked, or how long they viewed shared content. This helps gauge lead interest, prioritize highly engaged prospects, and tailor follow-ups more effectively." },
        { type: "callout", variant: "result", text: "Compared to traditional email campaigns, LinkedIn Smart Link campaigns show significantly higher response and meeting booking rates." },
      ],
    },
  ],
};
