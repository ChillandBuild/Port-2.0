/**
 * Shared shape for anything that reaches Sampath through a form on this site —
 * the /hire capture form, the case-studies gate and the /schedule booking form
 * all post here. One type in one place, so the client body and the route
 * handler's parsing can't drift apart from each other.
 */

export type SubmissionSource = "hire-form" | "case-studies-gate" | "schedule-call";
export type Lane = "hiring" | "buying";

export interface SubmissionPayload {
  source: SubmissionSource;
  email: string;
  name?: string;
  companyDomain?: string;
  companyName?: string;
  lane?: Lane;
  phone?: string;
  /** Schedule page only — the slot picked in the calendar, e.g. "Tue, Sep 2 · 11:00". */
  slot?: string;
}
