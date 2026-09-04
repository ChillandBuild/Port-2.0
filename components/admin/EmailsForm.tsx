"use client";

/**
 * /admin/emails — the 4 buyer-facing email templates. The 3 internal
 * notification emails (to Sampath himself — new submission, course paid,
 * second call paid) stay code: they're structured fact dumps, not prose
 * anyone would want to reword. Tokens like {{amount}} and {{window}} get
 * filled in at send time — see lib/backend/template.ts.
 *
 * Plain fields, not JSON — every field here is a flat string, so there's no
 * escape-hatch reason to make Sampath type quoted, comma-separated JSON to
 * reword a line of copy.
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import type {
  ScheduleConfirmationTemplate,
  CourseAccessEmailTemplate,
  SchedulePaymentReceiptTemplate,
  CourseGrantEmailTemplate,
} from "@/lib/backend/site-content-loaders";
import { saveKey, TextField, TextAreaField, SaveRow, type SaveStatus } from "./form-kit";
import styles from "./Admin.module.css";

interface FieldSpec<T> {
  key: keyof T & string;
  label: string;
  multiline?: boolean;
}

function TemplateCard<T extends { [K in keyof T]: string }>({
  heading,
  body,
  contentKey,
  initial,
  fields,
}: {
  heading: string;
  body: string;
  contentKey: string;
  initial: T;
  fields: FieldSpec<T>[];
}) {
  const router = useRouter();
  const [values, setValues] = useState<T>(initial);
  const [status, setStatus] = useState<SaveStatus>("idle");

  function set(key: keyof T & string, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("saving");
    const ok = await saveKey(contentKey, values);
    setStatus(ok ? "saved" : "error");
    if (ok) router.refresh();
  }

  return (
    <form className={styles.settingsCard} onSubmit={submit}>
      <h2 className={styles.settingsCardHeading}>{heading}</h2>
      <p className={styles.hint}>{body}</p>
      {fields.map((field) =>
        field.multiline ? (
          <TextAreaField
            key={field.key}
            label={field.label}
            value={values[field.key]}
            onChange={(v) => set(field.key, v)}
          />
        ) : (
          <TextField key={field.key} label={field.label} value={values[field.key]} onChange={(v) => set(field.key, v)} />
        ),
      )}
      <SaveRow status={status} />
    </form>
  );
}

export interface EmailsFormProps {
  scheduleConfirmation: ScheduleConfirmationTemplate;
  courseAccess: CourseAccessEmailTemplate;
  scheduleReceipt: SchedulePaymentReceiptTemplate;
  courseGrant: CourseGrantEmailTemplate;
}

export function EmailsForm(props: EmailsFormProps) {
  return (
    <div className={styles.settingsSections}>
      <TemplateCard
        heading="Free call — confirmation email"
        body="Sent to whoever fills out the free-call form."
        contentKey="email_schedule_confirmation"
        initial={props.scheduleConfirmation}
        fields={[
          { key: "subject", label: "Subject" },
          { key: "receivedLine", label: "Received line", multiline: true },
          { key: "nextStepsLine", label: "Next steps line", multiline: true },
          { key: "prepLine", label: "Prep line", multiline: true },
          { key: "reachOutLine", label: "Reach-out line", multiline: true },
          { key: "signoff", label: "Signoff" },
        ]}
      />
      <TemplateCard
        heading="Course — access code email"
        body="Sent to a buyer right after payment."
        contentKey="email_course_access"
        initial={props.courseAccess}
        fields={[
          { key: "subject", label: "Subject" },
          { key: "introLine", label: "Intro line", multiline: true },
          { key: "keepSafeLine", label: "Keep-safe line", multiline: true },
          { key: "signoff", label: "Signoff" },
        ]}
      />
      <TemplateCard
        heading="Second call — payment receipt"
        body="Sent after the paid second call is booked. {{amount}} is filled in with the currency and price actually charged."
        contentKey="email_schedule_receipt"
        initial={props.scheduleReceipt}
        fields={[
          { key: "subject", label: "Subject" },
          { key: "paidLine", label: "Paid line", multiline: true },
          { key: "confirmLine", label: "Confirm line", multiline: true },
          { key: "signoff", label: "Signoff" },
        ]}
      />
      <TemplateCard
        heading="Course — demo access link email"
        body={'Sent when you create an access link from /admin. {{window}} is filled in with the access duration (e.g. "4 hours").'}
        contentKey="email_course_grant"
        initial={props.courseGrant}
        fields={[
          { key: "subject", label: "Subject" },
          { key: "introLine", label: "Intro line", multiline: true },
          { key: "windowLine", label: "Window line", multiline: true },
          { key: "signoff", label: "Signoff" },
        ]}
      />
    </div>
  );
}
