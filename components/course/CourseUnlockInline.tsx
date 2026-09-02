"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { COURSE } from "@/lib/content/course";
import styles from "./CourseUnlockInline.module.css";

type Phase = "idle" | "checking" | "opening";
type Failure = "invalid" | "expired" | "revoked" | "server" | null;

const PHASE_COPY: Record<Phase, string> = {
  idle: COURSE.gate.submit,
  checking: COURSE.gate.checking,
  opening: COURSE.gate.opening,
};

const FAILURE_COPY: Record<Exclude<Failure, null>, string> = {
  invalid: COURSE.gate.invalidCode,
  expired: COURSE.gate.invalidCode,
  revoked: COURSE.gate.revokedCode,
  server: COURSE.gate.error,
};

/** Anything the route handler can return that we have copy for. */
function toFailure(error: string | undefined): Exclude<Failure, null> {
  return error === "expired" || error === "invalid" || error === "revoked" || error === "server"
    ? error
    : "server";
}

/**
 * Inline unlock form — a <details> toggle that expands to reveal the access
 * code input. Used on pages outside the course gate (e.g. lead generation)
 * where the full gate panel isn't present.
 */
export function CourseUnlockInline() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [failure, setFailure] = useState<Failure>(null);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (phase !== "idle") return;
    setPhase("checking");
    setFailure(null);
    try {
      const response = await fetch("/api/course/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const payload = (await response.json()) as { success: boolean; error?: string };
      if (payload.success) {
        // The cookie is set by the route handler. Unlike the /course gate —
        // where router.refresh() re-renders the page and swaps this form for
        // the guide — this inline form sits on /lead-generation, which shows
        // it unconditionally, so refreshing would spin forever. Navigate to
        // the course instead; the server render picks up the cookie.
        setPhase("opening");
        router.push("/course");
        return;
      }
      setFailure(toFailure(payload.error));
    } catch {
      setFailure("server");
    }
    setPhase("idle");
  }

  return (
    <details className={styles.toggle}>
      <summary className={styles.summary}>{COURSE.gate.unlockToggleLabel}</summary>
      <form className={styles.form} onSubmit={submit}>
        <label className={styles.label} htmlFor="leadgen-code">
          {COURSE.gate.codeLabel}
        </label>
        <input
          className={styles.input}
          id="leadgen-code"
          name="code"
          type="text"
          inputMode="text"
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          placeholder={COURSE.gate.codePlaceholder}
          value={code}
          onChange={(event) => {
            setCode(event.target.value);
            if (failure) setFailure(null);
          }}
          disabled={phase !== "idle"}
          required
        />
        <button className={styles.submit} type="submit" disabled={phase !== "idle"}>
          {phase !== "idle" && <span className={styles.spinner} aria-hidden="true" />}
          {PHASE_COPY[phase]}
        </button>
        {failure && (
          <p className={styles.error} role="alert">
            {FAILURE_COPY[failure]}
          </p>
        )}
      </form>
    </details>
  );
}
