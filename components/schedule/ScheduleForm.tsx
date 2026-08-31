"use client";

/**
 * The page's actual ask. Four fields, because everything a longer form would
 * collect — product or service, region, industries, 30/60/90 goals — is the
 * published agenda of the free call itself, and asking twice is friction.
 *
 * State and validation follow HireCaptureForm.tsx exactly: plain useState per
 * field, inline regex, no form library. Posts to the shared /api/submissions
 * endpoint under the "schedule-call" source.
 */

import { useId, useState } from "react";
import { SCHEDULE } from "@/lib/content";
import { ScheduleCalendar } from "./ScheduleCalendar";
import styles from "./ScheduleForm.module.css";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DOMAIN_RE = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i;

type Status = "idle" | "submitting" | "success" | "error";

export function ScheduleForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [domain, setDomain] = useState("");
  const [phone, setPhone] = useState("");
  const [slot, setSlot] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const formId = useId();

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (name.trim().length < 1) return setFieldError(SCHEDULE.form.nameInvalid);
    if (!EMAIL_RE.test(email.trim())) return setFieldError(SCHEDULE.form.emailInvalid);
    if (!DOMAIN_RE.test(domain.trim())) return setFieldError(SCHEDULE.form.domainInvalid);
    setFieldError(null);
    setStatus("submitting");

    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "schedule-call",
          name: name.trim(),
          email: email.trim(),
          companyDomain: domain.trim(),
          // Omitted rather than sent empty: the column is nullable and the
          // route trims to null anyway, but an absent key keeps the payload
          // honest about what was actually filled in.
          ...(phone.trim() ? { phone: phone.trim() } : {}),
          // The calendar slot has no dedicated column, so it rides along to
          // the email notification only — the Supabase insert is untouched.
          ...(slot ? { slot } : {}),
        }),
      });
      if (!response.ok) throw new Error("Request failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className={styles.section} aria-labelledby="schedule-form-heading" id="book">
      <div className={styles.head} data-reveal data-reveal-children>
        <p className={`mono ${styles.eyebrow}`}>{SCHEDULE.form.eyebrow}</p>
        <h2 className={styles.heading} id="schedule-form-heading">
          {SCHEDULE.form.heading}
        </h2>
        <p className={styles.body}>{SCHEDULE.form.body}</p>
      </div>

      {status === "success" ? (
        <p className={styles.success} role="status">
          {SCHEDULE.form.success}
        </p>
      ) : (
        <form className={styles.form} onSubmit={submit} noValidate>
          <ScheduleCalendar selected={slot} onSelect={setSlot} />
          <div className={styles.fields}>
            <label className={styles.field}>
              <span className={`mono ${styles.label}`}>{SCHEDULE.form.nameLabel}</span>
              <input
                className={styles.input}
                type="text"
                name="name"
                id={`${formId}-name`}
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder={SCHEDULE.form.namePlaceholder}
                aria-invalid={fieldError === SCHEDULE.form.nameInvalid}
              />
            </label>
            <label className={styles.field}>
              <span className={`mono ${styles.label}`}>{SCHEDULE.form.emailLabel}</span>
              <input
                className={styles.input}
                type="email"
                name="email"
                id={`${formId}-email`}
                autoComplete="email"
                inputMode="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={SCHEDULE.form.emailPlaceholder}
                aria-invalid={fieldError === SCHEDULE.form.emailInvalid}
              />
            </label>
            <label className={styles.field}>
              <span className={`mono ${styles.label}`}>{SCHEDULE.form.domainLabel}</span>
              <input
                className={styles.input}
                type="text"
                name="domain"
                id={`${formId}-domain`}
                autoComplete="url"
                value={domain}
                onChange={(event) => setDomain(event.target.value)}
                placeholder={SCHEDULE.form.domainPlaceholder}
                aria-invalid={fieldError === SCHEDULE.form.domainInvalid}
              />
            </label>
            <label className={styles.field}>
              <span className={`mono ${styles.label}`}>{SCHEDULE.form.phoneLabel}</span>
              <input
                className={styles.input}
                type="tel"
                name="phone"
                id={`${formId}-phone`}
                autoComplete="tel"
                inputMode="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder={SCHEDULE.form.phonePlaceholder}
              />
            </label>
          </div>

          {fieldError ? (
            <p className={styles.error} role="alert">
              {fieldError}
            </p>
          ) : null}
          {status === "error" ? (
            <p className={styles.error} role="alert">
              {SCHEDULE.form.error}
            </p>
          ) : null}

          <button className={styles.submit} type="submit" disabled={status === "submitting"}>
            {status === "submitting" ? SCHEDULE.form.sending : SCHEDULE.form.submit}
          </button>
          <p className={styles.note}>{SCHEDULE.form.note}</p>
        </form>
      )}
    </section>
  );
}
