import type { ReactNode } from "react";
import styles from "./guide.module.css";

/**
 * Inline text treatment for the guide: tool names are highlighted wherever
 * they appear in prose, lists, tables and callouts. The list is matched
 * case-sensitively with word boundaries — the content never uses these
 * words generically (verified: no lowercase "instantly", "make", "reveal"
 * outside tool contexts), so plain string alternation is safe. Longest
 * names first so "Million Verifier" wins over a shorter overlapping match.
 */
const TOOL_NAMES = [
  // Email infrastructure & outreach
  "Maildoso",
  "Instantly",
  "Smartlead",
  "Woodpecker",
  "SalesHandy",
  "Sales Handy",
  "Mailometer",
  "Mailchimp",
  "MailerLite",
  "Mailer Lite",
  "MailerSend",
  "Mailer Send",
  "SendGrid",
  "Mailivery",
  "Warmy.io",
  "Google Workspace",
  // LinkedIn
  "Sales Navigator",
  "Waalaxy",
  "SalesRobot",
  "Dripify",
  "HeyReach.io",
  "Phantom Buster",
  "My Profilia",
  "Lemlist",
  "Lusha",
  // Research, data & enrichment
  "ZoomInfo",
  "Crunchbase",
  "Bombora",
  "Clearbit",
  "Slintel",
  "6sense",
  "Leadfeeder",
  "Apollo.io",
  "Hunter.io",
  "Snov.io",
  "Clay",
  "Bloomberg",
  "G2 Buyer Intent",
  "G2",
  "Vector",
  // Verification
  "Million Verifier",
  "MillionVerifier",
  "ZeroBounce",
  "NeverBounce",
  "Never Bounce",
  // CRM & automation
  "HubSpot",
  "Pipedrive",
  "Salesforce",
  "Zoho CRM",
  "Fresh sales CRM",
  "n8n",
  "Make",
  "Regie.ai",
  "Humantic AI",
  "Kore.ai",
  "Gong",
  "Chorus",
];

const TOOL_PATTERN = new RegExp(
  `(?<![\\w.])(${TOOL_NAMES.sort((a, b) => b.length - a.length)
    .map(escapeRegExp)
    .join("|")})(?![\\w.])`,
  "g",
);

function escapeRegExp(name: string): string {
  return name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Splits text on tool names, wrapping each match in a styled <strong>.
 *  Also glues " → " to the word before it with a non-breaking space, so
 *  arrow chains (CEO → CFO → CIO) break after an arrow, never dangling one
 *  at the end of a line or starting one mid-chain. */
export function withToolHighlights(text: string): ReactNode {
  const normalized = text.replace(/ +→/g, "\u00A0→");
  const parts = normalized.split(TOOL_PATTERN);
  if (parts.length === 1) return normalized;
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className={styles.guideTool}>
        {part}
      </strong>
    ) : (
      part
    ),
  );
}
