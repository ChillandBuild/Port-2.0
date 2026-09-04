"use client";

/**
 * Shared primitives for every /admin/* content editor: a save-to-site_content
 * helper plus the plain-input and JSON-textarea field types the "friendly UI
 * + JSON escape hatch" split uses throughout (settings, marketing content,
 * and — later — the course lesson editor).
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ADMIN } from "@/lib/content/admin";
import styles from "./Admin.module.css";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

export async function saveKey(key: string, value: unknown): Promise<boolean> {
  try {
    const response = await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value }),
    });
    const payload = (await response.json()) as { success: boolean };
    return payload.success;
  } catch {
    return false;
  }
}

export function TextField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className={styles.settingsField}>
      <span className={styles.label}>{label}</span>
      <input
        className={styles.input}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

export function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className={styles.settingsField}>
      <span className={styles.label}>{label}</span>
      <input
        className={styles.input}
        type="number"
        min={0}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

export function SaveRow({ status, error }: { status: SaveStatus; error?: string }) {
  return (
    <div className={styles.settingsSaveRow}>
      <button className={styles.submit} type="submit" disabled={status === "saving"}>
        {status === "saving" && <span className={styles.spinner} aria-hidden="true" />}
        {status === "saving" ? ADMIN.settings.saving : ADMIN.settings.save}
      </button>
      {status === "saved" && <span className={styles.savedNote}>{ADMIN.settings.saved}</span>}
      {status === "error" && <span className={styles.error}>{error ?? ADMIN.settings.saveError}</span>}
    </div>
  );
}

/** A JSON textarea that only overwrites its own field once the parse succeeds — an invalid edit stays visible with an error instead of silently reverting. */
export function JsonField({
  label,
  text,
  onChange,
  rows = 10,
}: {
  label: string;
  text: string;
  onChange: (text: string) => void;
  rows?: number;
}) {
  return (
    <label className={styles.settingsField}>
      <span className={styles.label}>{label}</span>
      <textarea
        className={styles.textarea}
        rows={rows}
        value={text}
        onChange={(event) => onChange(event.target.value)}
        spellCheck={false}
      />
    </label>
  );
}

/**
 * One self-contained card: heading, hint, a single JSON textarea, its own
 * save button. Used for every content_key whose shape is "a list of records"
 * rather than a handful of scalar fields — marketing content on /admin/content
 * is entirely built from this one component, one instance per key.
 */
export function JsonCard({
  heading,
  body,
  jsonLabel,
  initial,
  contentKey,
  rows = 16,
}: {
  heading: string;
  body: string;
  jsonLabel: string;
  initial: unknown;
  contentKey: string;
  rows?: number;
}) {
  const router = useRouter();
  const [text, setText] = useState(() => JSON.stringify(initial, null, 2));
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [error, setError] = useState<string | undefined>(undefined);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      setStatus("error");
      setError(ADMIN.settings.jsonInvalid);
      return;
    }
    setStatus("saving");
    const ok = await saveKey(contentKey, parsed);
    setStatus(ok ? "saved" : "error");
    setError(undefined);
    if (ok) router.refresh();
  }

  return (
    <form className={styles.settingsCard} onSubmit={submit}>
      <h2 className={styles.settingsCardHeading}>{heading}</h2>
      <p className={styles.hint}>{body}</p>
      <JsonField label={jsonLabel} text={text} onChange={setText} rows={rows} />
      <SaveRow status={status} error={error} />
    </form>
  );
}
