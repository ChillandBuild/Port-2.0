"use client";

/**
 * Block 4: the ask, taken at peak interest, right after the teardown. This is
 * Tier 2 of the exposure model — a human gate, not automation. A genuine
 * buyer types their real domain in ten seconds; a competitor has to lie
 * about theirs, and that lie is logged with the submission. No detection
 * logic beyond that asymmetry — see the design discussion this page came
 * out of.
 *
 * State and validation follow CaseStudiesGate.tsx's pattern exactly: plain
 * useState per field, inline regex, no form library.
 */

import { useId, useState } from "react";
import { HIRE } from "@/lib/content";
import { useLane } from "./LaneContext";
import styles from "./HireCaptureForm.module.css";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DOMAIN_RE = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i;

type Status = "idle" | "submitting" | "success" | "error";

export function HireCaptureForm() {
  const { lane } = useLane();
  const [domain, setDomain] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const formId = useId();

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!DOMAIN_RE.test(domain.trim())) return setFieldError(HIRE.captureCta.domainInvalid);
    if (!EMAIL_RE.test(email.trim())) return setFieldError(HIRE.captureCta.emailInvalid);
    if (name.trim().length < 1) return setFieldError(HIRE.captureCta.nameInvalid);
    setFieldError(null);
    setStatus("submitting");

    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "hire-form",
          email: email.trim(),
          name: name.trim(),
          companyDomain: domain.trim(),
          lane,
        }),
      });
      if (!response.ok) throw new Error("Request failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <section className={styles.section} aria-labelledby="capture-heading" data-reveal>
        <p className={`mono ${styles.eyebrow}`}>{HIRE.captureCta.heading}</p>
        <p className={styles.success} role="status">
          {HIRE.captureCta.success}
        </p>
      </section>
    );
  }

  return (
    <section className={styles.section} aria-labelledby="capture-heading" data-reveal>
      <h2 className={styles.heading} id="capture-heading">
        {HIRE.captureCta.heading}
      </h2>
      <p className={styles.body}>{HIRE.captureCta.body}</p>

      <form className={styles.form} onSubmit={submit} noValidate>
        <div className={styles.fields}>
          <label className={styles.field}>
            <span className={`mono ${styles.label}`}>{HIRE.captureCta.domainLabel}</span>
            <input
              className={styles.input}
              type="text"
              name="domain"
              id={`${formId}-domain`}
              autoComplete="url"
              value={domain}
              onChange={(event) => setDomain(event.target.value)}
              placeholder={HIRE.captureCta.domainPlaceholder}
              aria-invalid={fieldError === HIRE.captureCta.domainInvalid}
            />
          </label>
          <label className={styles.field}>
            <span className={`mono ${styles.label}`}>{HIRE.captureCta.emailLabel}</span>
            <input
              className={styles.input}
              type="email"
              name="email"
              id={`${formId}-email`}
              autoComplete="email"
              inputMode="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={HIRE.captureCta.emailPlaceholder}
              aria-invalid={fieldError === HIRE.captureCta.emailInvalid}
            />
          </label>
          <label className={styles.field}>
            <span className={`mono ${styles.label}`}>{HIRE.captureCta.nameLabel}</span>
            <input
              className={styles.input}
              type="text"
              name="name"
              id={`${formId}-name`}
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={HIRE.captureCta.namePlaceholder}
              aria-invalid={fieldError === HIRE.captureCta.nameInvalid}
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
            {HIRE.captureCta.error}
          </p>
        ) : null}

        <button className={styles.submit} type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? "Sending…" : HIRE.captureCta.submit}
        </button>
        <p className={styles.note}>{HIRE.captureCta.note}</p>
      </form>
    </section>
  );
}
