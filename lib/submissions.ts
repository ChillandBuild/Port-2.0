/**
 * Shared shape for anything that reaches Sampath through a form on this site —
 * the case-studies gate and the /schedule booking form both post here. One type in one place, so the client body and the route
 * handler's parsing can't drift apart from each other.
 */

export type SubmissionSource = "case-studies-gate" | "schedule-call";

export interface SubmissionPayload {
  source: SubmissionSource;
  email: string;
  name?: string;
  companyDomain?: string;
  companyName?: string;
  phone?: string;
  /** Schedule page only — the slot picked in the calendar, e.g. "Tue, Sep 2 · 11:00". */
  slot?: string;
}
