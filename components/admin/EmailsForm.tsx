"use client";

/**
 * /admin/emails — the 4 buyer-facing email templates. The 3 internal
 * notification emails (to Sampath himself — new submission, course paid,
 * second call paid) stay code: they're structured fact dumps, not prose
 * anyone would want to reword. Tokens like {{amount}} and {{window}} get
 * filled in at send time — see lib/backend/template.ts.
 */

import type {
  ScheduleConfirmationTemplate,
  CourseAccessEmailTemplate,
  SchedulePaymentReceiptTemplate,
  CourseGrantEmailTemplate,
} from "@/lib/backend/site-content-loaders";
import { JsonCard } from "./form-kit";
import styles from "./Admin.module.css";

export interface EmailsFormProps {
  scheduleConfirmation: ScheduleConfirmationTemplate;
  courseAccess: CourseAccessEmailTemplate;
  scheduleReceipt: SchedulePaymentReceiptTemplate;
  courseGrant: CourseGrantEmailTemplate;
}

export function EmailsForm(props: EmailsFormProps) {
  return (
    <div className={styles.settingsSections}>
      <JsonCard
        heading="Free call — confirmation email"
        body="Sent to whoever fills out the free-call form. { subject, receivedLine, nextStepsLine, prepLine, reachOutLine, signoff }"
        jsonLabel="Template (JSON)"
        initial={props.scheduleConfirmation}
        contentKey="email_schedule_confirmation"
        rows={10}
      />
      <JsonCard
        heading="Course — access code email"
        body="Sent to a buyer right after payment. { subject, introLine, keepSafeLine, signoff }"
        jsonLabel="Template (JSON)"
        initial={props.courseAccess}
        contentKey="email_course_access"
        rows={8}
      />
      <JsonCard
        heading="Second call — payment receipt"
        body="Sent after the paid second call is booked. {{amount}} is filled in with the currency and price actually charged. { subject, paidLine, confirmLine, signoff }"
        jsonLabel="Template (JSON)"
        initial={props.scheduleReceipt}
        contentKey="email_schedule_receipt"
        rows={8}
      />
      <JsonCard
        heading="Course — demo access link email"
        body={'Sent when you create an access link from /admin. {{window}} is filled in with the access duration (e.g. "4 hours"). { subject, introLine, windowLine, signoff }'}
        jsonLabel="Template (JSON)"
        initial={props.courseGrant}
        contentKey="email_course_grant"
        rows={8}
      />
    </div>
  );
}
