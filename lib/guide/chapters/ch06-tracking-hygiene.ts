import type { GuideChapter } from "../types";

/**
 * Chapter 06 — Tracking, CRM & Data Hygiene. Merged from the assessment's
 * "Lead Tracking Process" (§7), "CRM stages" and "Data Hygiene" (§8)
 * (`CANDIDATE ASSESSMENT - ANSWERS.pdf`) plus "Scraping & Validation" and
 * "Compliance & Data Hygiene" from `Lead Generation Process (1)_.pdf`. Email
 * verification previously appeared three times across those sources; it is
 * consolidated once below, with the assessment's bounce table kept as the
 * canonical numbers. The deck's "92% deliverability" metric card is dropped
 * as it contradicts the 95% figure in Chapter 03.
 */
export const TRACKING_HYGIENE: GuideChapter = {
  id: "tracking-hygiene",
  number: "06",
  title: "Tracking, CRM & Data Hygiene",
  source: "CANDIDATE ASSESSMENT - ANSWERS.pdf · Lead Generation Process (1)_.pdf",
  intro: [
    { type: "para", text: "What happens after launch: how replies are routed by role and seniority, how leads move through the CRM, and how the list stays clean enough to protect deliverability." },
  ],
  sections: [
    {
      id: "multi-contact-strategy",
      title: "Multi-Contact Strategy & Reply Decision Tree",
      blocks: [
        { type: "para", text: "Never targeting just one person per company. Decision tree based on reply & role:" },
        { type: "para", text: "Company-level logic" },
        {
          type: "list",
          items: [
            { text: "C-Level \"No\": Stops all outreach to that company (final authority)." },
            { text: "Manager/Director \"No\": Remove individual only → target 3–5 other decision makers in same company." },
            { text: "Multi-Threading: Always maintaining 3–7 active contacts per targeted company / account." },
            { text: "C-Level Positive → Booking calendar + notifying AE" },
            { text: "C-Level Negative → Company-wide suppress" },
            { text: "Manager Reply → Individual suppress + alerting SDR for manual review" },
            { text: "\"Not Now\" → Long-term nurture list" },
          ],
        },
      ],
    },
    {
      id: "response-handling",
      title: "Response Handling by Reply Type & Seniority",
      blocks: [
        {
          type: "table",
          caption: "Response handling by reply type and seniority",
          headers: ["Response Type", "C-Level (CEO/CFO/CMO)", "Manager/Director Level"],
          rows: [
            ["Opens (No Reply)", "Continue sequence + add to nurture drip", "Continue sequence + test 2nd variant"],
            ["Positive Reply", "Immediate discovery call with Sales + pause sequence", "Qualify → Intro call + pause sequence"],
            ["\"Not Now\" / Interested Later", "Move to long-term nurture (90-day drip)", "Nurture that person + continue outreach to others in company"],
            ["Negative Reply (\"Not Interested\")", "Remove from outreach (final decision authority)", "Remove ONLY that person + continue outreach to ALL other contacts in company"],
            ["Silent (No Response After Full Sequence)", "Archive + quarterly re-engagement", "Archive that person + continue with remaining company contacts"],
          ],
        },
      ],
    },
    {
      id: "crm-stages",
      title: "CRM Stages: Cold → Meeting → Nurture",
      blocks: [
        {
          type: "process",
          steps: [
            { name: "New" },
            { name: "Engaged" },
            { name: "Contacted" },
            { name: "Qualified (MQL)" },
            { name: "Meeting Booked (SDR / BDR)" },
            { name: "Opportunity" },
            { name: "Nurture" },
          ],
        },
        {
          type: "list",
          items: [
            { text: "Auto-Advance: Open rates >3% → Engaged; Replies → Contacted." },
            { text: "Auto-Nurture: Full sequence complete + no reply → Nurture (90-day drip)." },
            { text: "C-Level Block: Negative C-Level reply → Company suppressed tag." },
            { text: "Multi-Contact: Manager reply → Individual nurture, company contacts continue." },
          ],
        },
        {
          type: "flow",
          title: "Lead journey",
          steps: [
            { label: "Cold Lead" },
            { label: "Email/LI Sequence" },
            { label: "Engaged" },
            { label: "Reply/Click" },
            { label: "MQL" },
            { label: "Meeting Booked", tone: "positive" },
            { label: "Opportunity" },
            { label: "Nurture", tone: "neutral", note: "\"Not Now\"/Silent" },
          ],
        },
      ],
    },
    {
      id: "email-verification",
      title: "Email Verification: The 2-Step Process",
      blocks: [
        { type: "para", text: "To ensure high deliverability, minimize bounce rates, and stay fully compliant with legal standards, every list goes through a 2-step verification process before a single sequence starts:" },
        { type: "para", text: "Step 1: Initial Verification (Million Verifier)" },
        {
          type: "list",
          items: [
            { text: "Every email undergoes Million Verifier → Catch-all email validation." },
            { text: "Validates email syntax, domain, and mailbox existence." },
            {
              text: "Detects:",
              children: [
                "Invalid email addresses",
                "Disposable/temporary emails",
                "Role-based emails (e.g., info@, support@).",
              ],
            },
            { text: "Zero tolerance: ALL invalid emails removed before sequences start." },
          ],
        },
        { type: "callout", variant: "result", text: "Result: campaigns launch with 100% verified, deliverable emails only." },
        { type: "para", text: "Step 2: Deep Validation" },
        {
          type: "list",
          items: [
            { text: "SMTP Checks (via MillionVerifier, ZeroBounce) — verifies if the recipient mailbox exists and can receive messages in real-time." },
            { text: "Catch-All Domain Detection (via ZeroBounce) — identifies domains that accept all emails, helping improve targeting and reduce false positives." },
          ],
        },
      ],
    },
    {
      id: "bounce-handling",
      title: "Bounce Monitoring & Handling",
      blocks: [
        { type: "para", text: "Secondary tools (NeverBounce / ZeroBounce) for ongoing monitoring during campaigns, with soft and hard bounces tracked continuously via email analytics and the ZeroBounce dashboard to optimize list quality and sender reputation." },
        { type: "para", text: "Handling rules:" },
        {
          type: "list",
          items: [
            { text: "Soft bounce retry: 2 attempts (48hr intervals)." },
            { text: "Hard bounce: Immediate permanent suppress." },
          ],
        },
        {
          type: "table",
          headers: ["Bounce Type", "Action", "Frequency"],
          rows: [
            ["Hard Bounce (<1% target)", "Permanent suppress + remove from all sequences", "Immediate"],
            ["Soft Bounce", "Retry 2x (48hr intervals) → suppress if persistent", "Auto 72hrs"],
            ["Above 2% Bounce Rate", "Pause domain → investigate + clean list", "Daily check"],
          ],
        },
        { type: "callout", variant: "result", text: "Result: double verification upfront + secondary monitoring = industry-leading <0.5% bounce rates." },
      ],
    },
    {
      id: "hygiene-compliance",
      title: "Unsubscribes, Duplicates & Compliance",
      blocks: [
        { type: "para", text: "Unsubscribes (GDPR/CAN-SPAM):" },
        {
          type: "list",
          items: [
            { text: "One-click unsubscribe in every email footer." },
            { text: "Automation: Instantly/HubSpot auto-suppresses across campaigns." },
            { text: "Double Opt-Out: Confirmation email + log in CRM." },
            { text: "Clear sender identification in all outbound emails (via automated email platforms like Mailchimp, SendGrid)." },
          ],
        },
        { type: "para", text: "Privacy & consent:" },
        {
          type: "list",
          items: [
            { text: "GDPR compliance (via consent tracking systems / CRM integrations): tracks user consent status, ensures proper data handling and right-to-be-forgotten protocols." },
          ],
        },
        { type: "para", text: "Duplicate leads & old/inactive data:" },
        {
          type: "list",
          items: [
            { text: "Duplicate leads → Pipedrive/HubSpot CRM auto-merge duplicates." },
            { text: "Inactive data → routine list cleaning; removal of invalid, duplicate, and inactive addresses, with CRM records and master Excel sheets kept up to date." },
          ],
        },
      ],
    },
  ],
};
