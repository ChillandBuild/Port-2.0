"use client";

/**
 * /admin/availability — add open slots (a date plus one or more times), see
 * what's upcoming, delete anything not needed. Booked slots show who/what
 * claimed them (a payment id or "submission:<email>") so a double-check
 * against the submissions/schedule_payments tables is possible, but they
 * can't be edited here — only removed.
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./Admin.module.css";

interface AdminSlot {
  id: string;
  date: string;
  time: string;
  status: "open" | "booked";
  bookedReference: string | null;
}

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function plusDaysKey(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function AvailabilityManager() {
  const router = useRouter();
  const [slots, setSlots] = useState<AdminSlot[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [date, setDate] = useState(todayKey());
  const [timesText, setTimesText] = useState("09:30, 11:00, 14:30");
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function load() {
    setLoadError(false);
    try {
      const res = await fetch(`/api/admin/availability?from=${todayKey()}&to=${plusDaysKey(90)}`);
      const payload = (await res.json()) as { success: boolean; slots?: AdminSlot[] };
      if (!payload.success || !payload.slots) {
        setLoadError(true);
        return;
      }
      setSlots(payload.slots);
    } catch {
      setLoadError(true);
    }
  }

  useEffect(() => {
    fetch(`/api/admin/availability?from=${todayKey()}&to=${plusDaysKey(90)}`)
      .then((res) => res.json())
      .then((payload: { success: boolean; slots?: AdminSlot[] }) => {
        if (!payload.success || !payload.slots) {
          setLoadError(true);
          return;
        }
        setSlots(payload.slots);
      })
      .catch(() => setLoadError(true));
  }, []);

  async function addSlots(event: React.FormEvent) {
    event.preventDefault();
    const times = timesText
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    if (!date || times.length === 0 || !times.every((t) => /^\d{2}:\d{2}$/.test(t))) {
      setAddError("Enter a date and one or more times as HH:MM, comma-separated.");
      return;
    }
    setAdding(true);
    setAddError(null);
    try {
      const res = await fetch("/api/admin/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, times }),
      });
      const payload = (await res.json()) as { success: boolean };
      if (!payload.success) throw new Error("failed");
      await load();
      router.refresh();
    } catch {
      setAddError("Couldn't add those slots. Try again.");
    }
    setAdding(false);
  }

  async function remove(id: string) {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/availability/${id}`, { method: "DELETE" });
      const payload = (await res.json()) as { success: boolean };
      if (payload.success) {
        setSlots((current) => current?.filter((s) => s.id !== id) ?? null);
      }
    } finally {
      setDeletingId(null);
    }
  }

  const grouped = (slots ?? []).reduce<Record<string, AdminSlot[]>>((acc, slot) => {
    (acc[slot.date] ??= []).push(slot);
    return acc;
  }, {});

  return (
    <section className={styles.settingsSections}>
      <form className={styles.settingsCard} onSubmit={addSlots}>
        <h2 className={styles.settingsCardHeading}>Open a slot</h2>
        <p className={styles.hint}>Add a date and one or more times (HH:MM, 24-hour, comma-separated).</p>
        <div className={styles.settingsGrid}>
          <label className={styles.settingsField}>
            <span className={styles.label}>Date</span>
            <input
              className={styles.input}
              type="date"
              value={date}
              min={todayKey()}
              onChange={(event) => setDate(event.target.value)}
            />
          </label>
          <label className={styles.settingsField}>
            <span className={styles.label}>Times</span>
            <input
              className={styles.input}
              type="text"
              value={timesText}
              onChange={(event) => setTimesText(event.target.value)}
              placeholder="09:30, 11:00, 14:30"
            />
          </label>
        </div>
        <div className={styles.settingsSaveRow}>
          <button className={styles.submit} type="submit" disabled={adding}>
            {adding && <span className={styles.spinner} aria-hidden="true" />}
            {adding ? "Adding…" : "Add slots"}
          </button>
          {addError && <span className={styles.error}>{addError}</span>}
        </div>
      </form>

      <div className={styles.settingsCard}>
        <h2 className={styles.settingsCardHeading}>Upcoming — next 90 days</h2>
        {loadError ? (
          <p className={styles.error}>Couldn&rsquo;t load slots.</p>
        ) : slots === null ? (
          <p className={styles.hint}>Loading…</p>
        ) : Object.keys(grouped).length === 0 ? (
          <p className={styles.hint}>No slots open yet — add one above.</p>
        ) : (
          <ul className={styles.grantList}>
            {Object.entries(grouped).map(([day, daySlots]) => (
              <li key={day} className={styles.grant}>
                <p className={styles.grantLabel}>{day}</p>
                <div className={styles.grantActions}>
                  {daySlots.map((slot) => (
                    <span key={slot.id} className={styles.badge} data-state={slot.status === "open" ? "live" : undefined}>
                      {slot.time}
                      {slot.status === "booked" ? ` · booked (${slot.bookedReference ?? "?"})` : ""}
                      <button
                        type="button"
                        className={`${styles.ghost} ${styles.slotRemove}`}
                        onClick={() => remove(slot.id)}
                        disabled={deletingId === slot.id}
                      >
                        {deletingId === slot.id ? "…" : "Remove"}
                      </button>
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
