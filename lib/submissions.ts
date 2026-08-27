/**
 * Shared shape for anything that reaches Sampath through a form on this site —
 * the /hire capture form and the case-studies gate both post here. One type
 * in one place, so the client body and the route handler's parsing can't
 * drift apart from each other.
 */

export type SubmissionSource = "hire-form" | "case-studies-gate";
export type Lane = "hiring" | "buying";

export interface SubmissionPayload {
  source: SubmissionSource;
  email: string;
  name?: string;
  companyDomain?: string;
  lane?: Lane;
  phone?: string;
}
