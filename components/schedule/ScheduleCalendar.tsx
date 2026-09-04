"use client";

/**
 * Slot picker for the free call. Fetches real open slots from
 * /api/schedule/availability (backed by availability_slots, managed from
 * /admin/availability) — a day is selectable only if Sampath has actually
 * opened a slot on it. Booking itself is claimed atomically server-side when
 * the form submits; this component only picks, it never reserves.
 *
 * Everything renders only after mount: "today" depends on the viewer's local
 * clock, which can differ from the server's, so a static prerender would
 * mismatch on hydration. All buttons are type="button" because the picker
 * sits inside the booking form.
 */

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import styles from "./ScheduleCalendar.module.css";

const noopSubscribe = () => () => {};

const WEEKDAY_LABELS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const MONTHS_SHOWN = 2;

type Cell = { key: string; day: number; hasOpenSlots: boolean; inRange: boolean } | null;

export interface PickedSlot {
  date: string;
  time: string;
  label: string;
}

function dateKeyOf(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

interface ScheduleCalendarProps {
  selected: PickedSlot | null;
  onSelect: (slot: PickedSlot | null) => void;
}

export function ScheduleCalendar({ selected, onSelect }: ScheduleCalendarProps) {
  // Hydration-safe mount flag: the server snapshot is false so the prerendered
  // HTML matches the first client render, and the grid only appears once the
  // viewer's local "today" is known.
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const [monthOffset, setMonthOffset] = useState<number | null>(null);
  const [dateKey, setDateKey] = useState<string | null>(null);
  const [openByDate, setOpenByDate] = useState<Record<string, string[]> | null>(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (!mounted) return;
    const today = new Date();
    const from = dateKeyOf(today);
    const to = dateKeyOf(new Date(today.getFullYear(), today.getMonth() + MONTHS_SHOWN, 0));
    let cancelled = false;

    fetch(`/api/schedule/availability?from=${from}&to=${to}`)
      .then((res) => res.json())
      .then((payload: { success: boolean; slots?: { date: string; time: string }[] }) => {
        if (cancelled) return;
        if (!payload.success || !payload.slots) {
          setLoadError(true);
          return;
        }
        const grouped: Record<string, string[]> = {};
        for (const slot of payload.slots) {
          (grouped[slot.date] ??= []).push(slot.time);
        }
        setOpenByDate(grouped);
      })
      .catch(() => {
        if (!cancelled) setLoadError(true);
      });

    return () => {
      cancelled = true;
    };
  }, [mounted]);

  // If the current month is nearly spent, open on next month so the grid
  // doesn't present a wall of crossed-out days.
  const autoOffset = useMemo(() => {
    if (!mounted) return 0;
    const now = new Date();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    let weekdaysLeft = 0;
    for (const d = new Date(now); d <= endOfMonth; d.setDate(d.getDate() + 1)) {
      if (d.getDay() !== 0 && d.getDay() !== 6) weekdaysLeft++;
    }
    return weekdaysLeft < 8 ? 1 : 0;
  }, [mounted]);
  const activeOffset = monthOffset ?? autoOffset;

  const viewMonth = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + activeOffset, 1);
  }, [activeOffset]);

  const weeks = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const maxDay = new Date(today.getFullYear(), today.getMonth() + MONTHS_SHOWN, 0);

    const first = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1);
    // Monday-first offset.
    const lead = (first.getDay() + 6) % 7;
    const dayCount = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0).getDate();

    const cells: Cell[] = Array.from({ length: lead }, () => null);
    for (let day = 1; day <= dayCount; day++) {
      const date = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), day);
      const key = dateKeyOf(date);
      const inRange = date >= today && date <= maxDay;
      const hasOpenSlots = inRange && Boolean(openByDate?.[key]?.length);
      cells.push({ key, day, hasOpenSlots, inRange });
    }
    while (cells.length % 7 !== 0) cells.push(null);

    const result: Cell[][] = [];
    for (let i = 0; i < cells.length; i += 7) result.push(cells.slice(i, i + 7));
    return result;
  }, [viewMonth, openByDate]);

  const times = useMemo(() => {
    if (!dateKey) return [];
    return [...(openByDate?.[dateKey] ?? [])].sort();
  }, [dateKey, openByDate]);

  const monthLabel = viewMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const lastMonthOffset = MONTHS_SHOWN - 1;

  const pickSlot = (time: string) => {
    if (!dateKey) return;
    const date = new Date(`${dateKey}T00:00:00`);
    const label = date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
    onSelect({ date: dateKey, time, label: `${label} · ${time}` });
  };

  const clear = () => {
    setDateKey(null);
    onSelect(null);
  };

  return (
    <div className={styles.calendar}>
      <p className={`mono ${styles.label}`}>Pick a slot for the free call</p>

      {!mounted ? (
        <div className={styles.placeholder} aria-hidden="true" />
      ) : loadError ? (
        <p className={styles.hint}>
          Couldn&rsquo;t load open times right now. You can still send the form below — mention a time that works
          and it&rsquo;ll be confirmed by email.
        </p>
      ) : (
        <>
          <div className={styles.monthNav}>
            <button
              type="button"
              className={styles.navButton}
              onClick={() => setMonthOffset(Math.max(0, activeOffset - 1))}
              disabled={activeOffset === 0}
              aria-label="Previous month"
            >
              ←
            </button>
            <span className={styles.month}>{monthLabel}</span>
            <button
              type="button"
              className={styles.navButton}
              onClick={() => setMonthOffset(Math.min(lastMonthOffset, activeOffset + 1))}
              disabled={activeOffset === lastMonthOffset}
              aria-label="Next month"
            >
              →
            </button>
          </div>

          <div className={styles.grid} role="grid" aria-label="Available dates">
            <div className={styles.weekdays} role="row">
              {WEEKDAY_LABELS.map((label) => (
                <span key={label} className={`mono ${styles.weekday}`} role="columnheader">
                  {label}
                </span>
              ))}
            </div>
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className={styles.week} role="row">
                {week.map((cell, cellIndex) =>
                  cell ? (
                    <button
                      key={cell.key}
                      type="button"
                      role="gridcell"
                      className={`${styles.day} ${dateKey === cell.key ? styles.daySelected : ""} ${
                        cell.hasOpenSlots ? "" : styles.dayFull
                      }`}
                      disabled={!cell.hasOpenSlots}
                      aria-label={
                        !cell.hasOpenSlots
                          ? `${cell.day} — unavailable`
                          : dateKey === cell.key
                            ? `${cell.day} — selected, showing slots`
                            : `${cell.day} — show available slots`
                      }
                      onClick={() => setDateKey(cell.key)}
                    >
                      {cell.day}
                    </button>
                  ) : (
                    <span key={`${weekIndex}-${cellIndex}`} className={styles.dayEmpty} />
                  ),
                )}
              </div>
            ))}
          </div>

          {dateKey ? (
            times.length === 0 ? (
              <p className={styles.hint}>No open times left on this day — pick another.</p>
            ) : (
              <div className={styles.slots}>
                {times.map((time) => (
                  <button
                    key={time}
                    type="button"
                    className={`${styles.slot} ${selected?.date === dateKey && selected?.time === time ? styles.slotSelected : ""}`}
                    onClick={() => pickSlot(time)}
                  >
                    {time}
                  </button>
                ))}
              </div>
            )
          ) : (
            <p className={styles.hint}>Choose a day to see open times.</p>
          )}

          {selected ? (
            <p className={styles.picked}>
              You picked <strong>{selected.label}</strong>
              <button type="button" className={styles.clear} onClick={clear}>
                change
              </button>
            </p>
          ) : null}
        </>
      )}
    </div>
  );
}
