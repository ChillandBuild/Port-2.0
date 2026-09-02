import type { GuideChapter } from "../types";

/**
 * Chapter 07 — Replies → Meetings & Nurture. From the assessment's "Meeting
 * Generation Strategy" (§9) and "Nurturing & Follow-ups" (§10)
 * (`CANDIDATE ASSESSMENT - ANSWERS.pdf`). §10 was almost entirely duplicated
 * content — its neutral-reply follow-ups (already in §9) now appear once in
 * "Negative & Neutral Replies", and its only unique thread (nurturing
 * not-ready leads on the 90-day drip) is the closing section, which
 * cross-references Chapter 04's sequence framework instead of repeating it.
 */
export const REPLIES_MEETINGS: GuideChapter = {
  id: "replies-meetings",
  number: "07",
  title: "Replies → Meetings & Nurture",
  source: "CANDIDATE ASSESSMENT - ANSWERS.pdf",
  intro: [
    { type: "para", text: "Replies only become revenue when they're handled fast and routed by role. This chapter is the categorization → action framework that converts responses into booked meetings — and parks the not-ready-yet leads where they'll keep warming." },
  ],
  sections: [
    {
      id: "positive-replies",
      title: "Positive Replies (Interest Signals)",
      blocks: [
        { type: "para", text: "Characteristics:" },
        {
          type: "list",
          items: [
            { text: "Questioning about product/service details." },
            { text: "Requesting time slots/meetings." },
          ],
        },
        { type: "para", text: "Immediate actions:" },
        {
          type: "list",
          items: [
            { text: "Auto-reply template → offering 3 calendar slots (15/20-min discovery)." },
            { text: "Internal Slack/Email: Notify BDE/ops team + attach Smart Link engagement data." },
            { text: "CRM: Move to \"Meeting Booked\" → pause sequence." },
            { text: "Follow-up: If no slot picked in 24hrs → 1 nudge email + LI message + get contact number from Lusha and share to SDR/BDR for cold calling." },
          ],
        },
        { type: "callout", variant: "target", title: "Conversion Target", text: "60–80% → booked meeting." },
      ],
    },
    {
      id: "negative-neutral-replies",
      title: "Negative & Neutral Replies",
      blocks: [
        { type: "para", text: "Negative replies (\"Not Interested\") — role-based action:" },
        {
          type: "list",
          items: [
            { text: "C-Level: Full company suppress (final authority)." },
            { text: "Manager/Director: Individual suppress + continue outreach to other company contacts." },
            { text: "CRM: Tag \"Closed Lost\" + reason logged." },
          ],
        },
        { type: "para", text: "Neutral replies (\"Tell me more\" / vague) — characteristics: \"Send info\" / \"What's this about?\" / \"Not sure if relevant.\"" },
        { type: "para", text: "Tailored follow-ups:" },
        {
          type: "list",
          items: [
            { text: "Response 1 (24hrs): 1-paragraph value + Smart Link (case study matching their reply)." },
            { text: "Response 2 (48hrs): Specific objection handling + calendar link." },
            { text: "Max 2 follow-ups → Nurture if no reply." },
          ],
        },
      ],
    },
    {
      id: "reply-workflow",
      title: "The Reply Handling Workflow",
      blocks: [
        {
          type: "mono",
          text: "Reply Detected → Categorizing\n├── Positive → Calendar + Team Alert → Meeting\n├── Negative → Suppress (role-based)\n└── Neutral → 2x Follow-up → Nurture",
        },
        { type: "para", text: "Tech stack for conversion:" },
        {
          type: "list",
          items: [
            { text: "Instantly/Smartlead: Auto-reply triggers + calendar integration." },
            { text: "CRM: Auto-stage progression + team notifications." },
            { text: "Smart Links: Pre-qualify with content engagement before call." },
          ],
        },
        { type: "callout", variant: "result", text: "Proven result: 25–40% reply-to-meeting conversion through role-specific handling and rapid response." },
      ],
    },
    {
      id: "nurture-not-ready",
      title: "Nurturing Not-Ready Leads",
      blocks: [
        { type: "para", text: "Interested-but-not-ready leads — the \"Not Now\"s, neutrals who went quiet, and completed sequences with no reply — move to the long-term 90-day nurture drip rather than being deleted." },
        {
          type: "list",
          items: [
            { text: "Full sequence complete + no reply → Nurture (90-day drip)." },
            { text: "\"Not Now\" / interested later → Long-term nurture; C-Level moves entirely, individual contacts at Manager/Director level nurture while the rest of the company continues." },
            { text: "Silent after full sequence → Archive + quarterly re-engagement." },
            { text: "Nurture sequences follow the same 7-touch framework from Chapter 04, paced for a 90-day window instead of 45." },
          ],
        },
      ],
    },
  ],
};
