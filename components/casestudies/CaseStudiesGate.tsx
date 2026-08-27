"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CASE_STUDIES } from "@/lib/content";
import styles from "./CaseStudiesGate.module.css";

const UNLOCK_KEY = "sk-cs-unlock";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * The gate. The case studies are behind it: a visitor leaves an email and a
 * phone number, and the studies open. There is no backend on this site, so the
 * unlock is remembered in this browser only — the honest behaviour is stated
 * under the button rather than implied.
 *
 * The revealed content is passed in as children, so it stays a server-rendered
 * component; only the gate itself runs on the client.
 */
export function CaseStudiesGate({ children }: { children: React.ReactNode }) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [unlocked, setUnlocked] = useState(false);

  // Reads the stored unlock once, after first paint, so the server-rendered
  // gate matches hydration and the flip only happens for a returning visitor.
  useEffect(() => {
    let timer = 0;
    try {
      if (localStorage.getItem(UNLOCK_KEY) === "1") {
        timer = window.setTimeout(() => setUnlocked(true), 0);
      }
    } catch {
      // Storage unavailable: the gate just shows again next visit.
    }
    return () => window.clearTimeout(timer);
  }, []);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!EMAIL_RE.test(email.trim())) return setError(CASE_STUDIES.gate.emailInvalid);
    if (phone.replace(/\D/g, "").length < 7) return setError(CASE_STUDIES.gate.phoneInvalid);
    setError(null);
    try {
      localStorage.setItem(UNLOCK_KEY, "1");
    } catch {
      // Still unlock for this visit; only the memory of it is lost.
    }
    // Fire-and-forget: reaches Sampath directly, but a failed or slow request
    // must never block the unlock the visitor is already owed.
    fetch("/api/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source: "case-studies-gate", email: email.trim(), phone: phone.trim() }),
    }).catch(() => {
      // Still unlocked for this visit; only the notification is lost.
    });
    setUnlocked(true);
  };

  return (
    <section className={styles.section} aria-labelledby="casestudies-title">
      <Link className={styles.back} href="/">
        <span aria-hidden="true">←</span> Home
      </Link>
      <p className={`mono ${styles.eyebrow}`}>{CASE_STUDIES.eyebrow}</p>
      <h1 className={styles.title} id="casestudies-title">
        {CASE_STUDIES.title}
      </h1>
      <p className={styles.lede}>{CASE_STUDIES.lede}</p>

      {unlocked ? (
        <div className={styles.reveal} aria-live="polite">
          <p className={`mono ${styles.unlocked}`}>{CASE_STUDIES.unlockedEyebrow}</p>
          <h2 className={styles.unlockedHeading}>{CASE_STUDIES.unlockedHeading}</h2>
          <p className={styles.unlockedBody}>{CASE_STUDIES.unlockedBody}</p>
          {children}
        </div>
      ) : (
        <form className={styles.gate} onSubmit={submit} noValidate>
          <h2 className={styles.gateHeading}>{CASE_STUDIES.gate.heading}</h2>
          <p className={styles.gateBody}>{CASE_STUDIES.gate.body}</p>

          <div className={styles.fields}>
            <label className={styles.field}>
              <span className={`mono ${styles.label}`}>{CASE_STUDIES.gate.emailLabel}</span>
              <input
                className={styles.input}
                type="email"
                name="email"
                autoComplete="email"
                inputMode="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={CASE_STUDIES.gate.emailPlaceholder}
                aria-invalid={error === CASE_STUDIES.gate.emailInvalid}
              />
            </label>
            <label className={styles.field}>
              <span className={`mono ${styles.label}`}>{CASE_STUDIES.gate.phoneLabel}</span>
              <input
                className={styles.input}
                type="tel"
                name="phone"
                autoComplete="tel"
                inputMode="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder={CASE_STUDIES.gate.phonePlaceholder}
                aria-invalid={error === CASE_STUDIES.gate.phoneInvalid}
              />
            </label>
          </div>

          {error ? (
            <p className={styles.error} role="alert">
              {error}
            </p>
          ) : null}

          <button className={styles.submit} type="submit">
            {CASE_STUDIES.gate.submit}
          </button>
          <p className={styles.note}>{CASE_STUDIES.gate.note}</p>
        </form>
      )}
    </section>
  );
}