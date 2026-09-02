import type { GuideChapter } from "../types";

/**
 * Chapter 04 — Campaign Content & Sequences. From the assessment's
 * "Content Ownership" (§4) and "Email Campaign Plan" (§5) sections
 * (`CANDIDATE ASSESSMENT - ANSWERS.pdf`) plus the drip methodology from
 * `Lead Generation Process (1)_.pdf`. The 7-touch framework appears here ONCE
 * (the assessment's version is canonical); the process deck's alternative
 * seven-step storytelling order is kept as a collapsed note instead of a
 * second framework.
 */
export const CAMPAIGNS: GuideChapter = {
  id: "campaigns",
  number: "04",
  title: "Campaign Content & Sequences",
  source: "CANDIDATE ASSESSMENT - ANSWERS.pdf · Lead Generation Process (1)_.pdf",
  intro: [
    { type: "para", text: "How campaigns are segmented, how much copy is written by hand, and the sequence structure every email and LinkedIn touch follows." },
  ],
  sections: [
    {
      id: "content-ownership",
      title: "Writing the Copy: Ownership & Sourcing",
      blocks: [
        { type: "callout", variant: "target", text: "All email + LinkedIn copy is written in-house — from subject lines to sequences to LinkedIn messaging." },
        { type: "para", text: "Initial ramp-up (first 30–45 days):" },
        {
          type: "list",
          items: [
            { text: "Time needed to fully understand services, core USPs, and specific terminology." },
            { text: "Shadowing calls, reviewing materials, and clarifying doubts for precision." },
          ],
        },
        { type: "para", text: "Input needed from the client / manager" },
        {
          type: "list",
          items: [
            { text: "ICP Details: Target industries, roles, key pain points, company size/geography." },
            { text: "Core Messaging: 2–3 key USPs, main offer/outcome, specific terminology." },
            { text: "Assets Available: Website links, case studies, testimonials, metrics." },
            { text: "Knowledge Transfer: Training/shadowing sessions for industry specifics." },
            { text: "Tone/Voice Guidelines: Formal/professional vs conversational vs authority-driven." },
          ],
        },
        { type: "para", text: "Content sourcing process" },
        {
          type: "list",
          items: [
            { text: "Primary: Client website — extracting services, features, testimonials, metrics." },
            { text: "Case studies / testimonials — specific outcomes for credibility." },
            { text: "Competitor analysis — identify gaps for differentiation." },
            { text: "Industry research — pain points, regulations, trends." },
            { text: "ICP pain mapping — match solutions to buyer problems." },
          ],
        },
      ],
    },
    {
      id: "campaign-segmentation",
      title: "Campaign Segmentation: Four Dimensions",
      blocks: [
        { type: "para", text: "Campaign strategy is multi-dimensional & highly segmented:" },
        { type: "para", text: "1. Region / time zone segmentation" },
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
        { type: "para", text: "2. Industry segmentation" },
        {
          type: "list",
          items: [
            { text: "Separating campaigns per vertical when ICP spans multiple industries (e.g., Pharma vs Construction vs SaaS)." },
            { text: "Each gets tailored pain points, case studies, and terminology." },
          ],
        },
        { type: "para", text: "3. Role-level segmentation — custom content per hierarchy level (never same copy):" },
        {
          type: "list",
          items: [
            { text: "C-Level (CEO, CFO, CMO): Strategic vision, ROI, competitive edge." },
            { text: "Director Level: Implementation details, team efficiency, compliance." },
            { text: "Manager Level: Day-to-day pain relief, ease of use, quick wins." },
          ],
        },
        { type: "para", text: "4. Compliance-driven approach — strict GDPR/CAN-SPAM adherence:" },
        {
          type: "list",
          items: [
            { text: "No mass emailing — hyper-personalized sequences only." },
            { text: "Region-specific consent language and unsubscribe flows." },
            { text: "No generic blasts across levels/regions — each segment gets unique copy." },
          ],
        },
      ],
    },
    {
      id: "campaign-volume",
      title: "Campaign Volume: From Pilot to Scale",
      blocks: [
        {
          type: "list",
          items: [
            { text: "Week 1–2: 2–4 campaigns (test highest-priority ICP segments)." },
            { text: "Ongoing: 6–12 active campaigns (2–3 per region/industry/role combo)." },
            { text: "Scale: Up to 20+ campaigns for mature operations." },
          ],
        },
      ],
    },
    {
      id: "drip-methodology",
      title: "The Drip Methodology",
      blocks: [
        { type: "para", text: "All email + LinkedIn campaigns run as drip methodology:" },
        {
          type: "list",
          items: [
            { text: "Weekly cadence over 45 days (1.5 months)." },
            { text: "7 strategic follow-ups building value progressively." },
            { text: "Multi-channel sync: Email + LinkedIn + personal branding on LinkedIn for maximum response rates." },
          ],
        },
        { type: "para", text: "The approach centers on giving equal importance to content and engagement tracking — prospects receive timely, relevant information that guides them from awareness to conversion." },
      ],
    },
    {
      id: "seven-touch-framework",
      title: "The 7-Touch Drip Campaign Framework",
      blocks: [
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
        {
          type: "collapsible",
          summary: "Alternative storytelling order (same seven touches, content-first sequencing)",
          blocks: [
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
            { type: "para", text: "This ordering ensures a natural storytelling flow built on trust and value creation." },
          ],
        },
      ],
    },
  ],
};
