/**
 * The cadence clock.
 *
 * Scroll position is campaign time. Every value below is a pure function of it,
 * which is the whole point: scrolling back up genuinely rewinds the campaign —
 * sends un-send, replies un-arrive — because nothing was ever accumulated.
 *
 * The campaign is a simulation of the method in SITE-CONTENT.md §8. It is
 * labelled as such wherever it renders. The only figures presented as claims
 * about real work are the sourced ones in LEDGER.
 */

import { contactProgress, type Contact } from "@/lib/world";

export const CAMPAIGN_DAYS = 30;
/** IST working window the sends go out in. */
const SEND_START_MIN = 9 * 60 + 10;
const SEND_END_MIN = 17 * 60 + 40;

export interface CampaignState {
  day: number;
  /** "09:14" through "17:40", IST. */
  clock: string;
  sourced: number;
  verified: number;
  sent: number;
  replied: number;
  booked: number;
}

const SURVIVES_VERIFY = new Set(["bounced", "no-reply", "replied", "booked"]);
const GETS_SENT = new Set(["bounced", "no-reply", "replied", "booked"]);
const REPLIES = new Set(["replied", "booked"]);

/**
 * Campaign state at page progress `page` (0 to 1 across the whole document) and
 * world progress `world` (0 to 1 across the canvas travel).
 */
export function campaignAt(cohort: Contact[], page: number, world: number): CampaignState {
  const day = Math.min(CAMPAIGN_DAYS, 1 + Math.floor(clamp01(page) * CAMPAIGN_DAYS));
  const minutes = SEND_START_MIN + clamp01(page) * (SEND_END_MIN - SEND_START_MIN);
  const clock = `${pad(Math.floor(minutes / 60))}:${pad(Math.floor(minutes % 60))}`;

  let sourced = 0;
  let verified = 0;
  let sent = 0;
  let replied = 0;
  let booked = 0;

  for (const c of cohort) {
    const reached = contactProgress(c, world);
    if (reached >= 1) sourced += 1;
    if (reached >= 3 && SURVIVES_VERIFY.has(c.fate)) verified += 1;
    if (reached >= 4 && GETS_SENT.has(c.fate)) sent += 1;
    if (reached >= 5 && REPLIES.has(c.fate)) replied += 1;
    if (reached >= 8 && c.fate === "booked") booked += 1;
  }

  return { day, clock, sourced, verified, sent, replied, booked };
}

/**
 * Totals for the completed run. Contacts that failed a gate have faded out of the
 * world by then, so the totals are counted at the moment the last gate is passed
 * rather than at the end of the travel.
 */
export function campaignTotals(cohort: Contact[]): CampaignState {
  let verified = 0;
  let sent = 0;
  let replied = 0;
  let booked = 0;
  for (const c of cohort) {
    if (SURVIVES_VERIFY.has(c.fate)) verified += 1;
    if (GETS_SENT.has(c.fate)) sent += 1;
    if (REPLIES.has(c.fate)) replied += 1;
    if (c.fate === "booked") booked += 1;
  }
  return { day: CAMPAIGN_DAYS, clock: "17:40", sourced: cohort.length, verified, sent, replied, booked };
}

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n));
}

function pad(n: number) {
  return n.toString().padStart(2, "0");
}
