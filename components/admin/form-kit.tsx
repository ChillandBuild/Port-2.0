"use client";

/**
 * Shared primitives for every /admin/* content editor: a save-to-site_content
 * helper plus the plain-input and JSON-textarea field types the "friendly UI
 * + JSON escape hatch" split uses throughout (settings, marketing content,
 * and — later — the course lesson editor).
 */

import { useState } from "react";
import { ADMIN } from "@/lib/content/admin";
import styles from "./Admin.module.css";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

let listKeySeq = 0;

export interface EditableItem<T> {
  key: string;
  value: T;
}

/**
 * A reorderable array as React state — every "list of records" content card
 * (pipeline stages, sectors, roles, FAQ entries, ...) needs the same
 * add/remove/move-up/move-down mechanics, so this is written once. Keys are
 * client-side only, generated once per item and stable across reorders —
 * never sent to the server.
 */
export function useEditableList<T>(initial: T[]) {
  const [items, setItems] = useState<EditableItem<T>[]>(() => initial.map((value) => ({ key: `k${listKeySeq++}`, value })));

  function update(key: string, value: T) {
    setItems((current) => current.map((item) => (item.key === key ? { key, value } : item)));
  }
  function add(value: T) {
    setItems((current) => [...current, { key: `k${listKeySeq++}`, value }]);
  }
  function remove(key: string) {
    setItems((current) => current.filter((item) => item.key !== key));
  }
  function move(key: string, direction: -1 | 1) {
    setItems((current) => {
      const index = current.findIndex((item) => item.key === key);
      const target = index + direction;
      if (index === -1 || target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  return { items, update, add, remove, move };
}

/** The move-up/move-down/remove row every list item ends with. */
export function ListItemActions({
  onMoveUp,
  onMoveDown,
  onRemove,
  removeLabel = "Remove",
}: {
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onRemove: () => void;
  removeLabel?: string;
}) {
  return (
    <div className={styles.settingsSaveRow}>
      <button type="button" className={styles.ghost} onClick={onMoveUp} disabled={!onMoveUp}>
        Move up
      </button>
      <button type="button" className={styles.ghost} onClick={onMoveDown} disabled={!onMoveDown}>
        Move down
      </button>
      <button type="button" className={`${styles.ghost} ${styles.danger}`} onClick={onRemove}>
        {removeLabel}
      </button>
    </div>
  );
}

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

/** Multi-line plain-text field — email/chatbot copy, not JSON. Body font, not mono. */
export function TextAreaField({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <label className={styles.settingsField}>
      <span className={styles.label}>{label}</span>
      <textarea
        className={styles.textareaProse}
        rows={rows}
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

