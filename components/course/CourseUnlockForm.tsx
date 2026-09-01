"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { COURSE } from "@/lib/content/course";
import styles from "./CourseGate.module.css";

type Phase = "idle" | "checking" | "done";
type Failure = "invalid" | "expired" | "server" | null;

const FAILURE_COPY: Record<Exclude<Failure, null>, string> = {
  invalid: COURSE.gate.invalidCode,
  expired: COURSE.gate.invalidCode,
  server: COURSE.gate.error,
};

/**
 * Redeems the access code emailed after payment. The route handler sets the
 * httpOnly cookie on success, so the client only refreshes — the server
 * component tree re-renders with the gate open.
 */
export function CourseUnlockForm() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [failure, setFailure] = useState<Failure>(null);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (phase === "checking") return;
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
        setPhase("done");
        router.refresh();
        return;
      }
      setFailure(
        payload.error === "expired" || payload.error === "invalid" || payload.error === "server"
          ? payload.error
          : "server",
      );
    } catch {
      setFailure("server");
    }
    setPhase("idle");
  }

  return (
    <form className={styles.form} onSubmit={submit}>
      <label className={styles.label} htmlFor="course-code">
        {COURSE.gate.codeLabel}
      </label>
      <input
        className={styles.input}
        id="course-code"
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
        disabled={phase === "checking"}
        required
      />
      <button className={styles.submit} type="submit" disabled={phase === "checking"}>
        {phase === "checking" ? COURSE.gate.checking : COURSE.gate.submit}
      </button>
      {failure && (
        <p className={styles.error} role="alert">
          {FAILURE_COPY[failure]}
        </p>
      )}
    </form>
  );
}
