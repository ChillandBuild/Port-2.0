"use client";

import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { ADMIN } from "@/lib/content/admin";
import styles from "./Admin.module.css";

type Status = "idle" | "submitting";
type Failure = "invalid" | "server" | null;

const FAILURE_COPY: Record<Exclude<Failure, null>, string> = {
  invalid: ADMIN.login.invalid,
  server: ADMIN.login.error,
};

export function LoginForm() {
  const router = useRouter();
  const emailId = useId();
  const passwordId = useId();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [failure, setFailure] = useState<Failure>(null);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status !== "idle") return;
    setStatus("submitting");
    setFailure(null);
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const payload = (await response.json()) as { success: boolean; error?: string };
      if (payload.success) {
        // The session cookie is on the response. refresh() re-runs the server
        // tree, and the proxy stops redirecting once it sees the cookie.
        router.replace("/admin");
        router.refresh();
        return;
      }
      setFailure(payload.error === "invalid" ? "invalid" : "server");
    } catch {
      setFailure("server");
    }
    setStatus("idle");
  }

  return (
    <form className={styles.loginForm} onSubmit={submit} noValidate>
      <label className={styles.label} htmlFor={emailId}>
        {ADMIN.login.emailLabel}
      </label>
      <input
        className={styles.input}
        id={emailId}
        type="email"
        name="email"
        autoComplete="username"
        value={email}
        onChange={(event) => {
          setEmail(event.target.value);
          if (failure) setFailure(null);
        }}
        disabled={status !== "idle"}
        required
      />

      <label className={styles.label} htmlFor={passwordId}>
        {ADMIN.login.passwordLabel}
      </label>
      <input
        className={styles.input}
        id={passwordId}
        type="password"
        name="password"
        autoComplete="current-password"
        value={password}
        onChange={(event) => {
          setPassword(event.target.value);
          if (failure) setFailure(null);
        }}
        disabled={status !== "idle"}
        required
      />

      <button className={styles.submit} type="submit" disabled={status !== "idle"}>
        {status === "submitting" && <span className={styles.spinner} aria-hidden="true" />}
        {status === "submitting" ? ADMIN.login.submitting : ADMIN.login.submit}
      </button>

      {failure && (
        <p className={styles.error} role="alert">
          {FAILURE_COPY[failure]}
        </p>
      )}
    </form>
  );
}
