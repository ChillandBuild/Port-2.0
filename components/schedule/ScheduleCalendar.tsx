"use client";

/**
 * Slot picker for the free call. A two-month date grid plus a per-day slot
 * row, with some slots pre-marked as booked — availability is a deterministic
 * hash of the date string, so the pattern is stable across reloads without a
 * backend, and the calendar reads as a real, partially-filled schedule.
 *
 * Everything renders only after mount: the booked pattern is derived from the
 * viewer's local clock, which can differ from the server's, so a static
 * prerender would mismatch on hydration. All buttons are type="button" because
 * the picker sits inside the booking form.
 */

import { useMemo, useState, useSyncExternalStore } from "react";
import styles from "./ScheduleCalendar.module.css";

const noopSubscribe = () => () => {};

const TIME_SLOTS = ["09:30", "11:00", "14:30", "16:30", "18:00"];
const WEEKDAY_LABELS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const MONTHS_SHOWN = 2;
/** Roughly half the slots read as taken — enough to signal demand without closing the week out. */
const BOOKED_THRESHOLD = 45;

type Cell = { key: string; day: number; bookedAll: boolean } | null;

function hash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function isSlotBooked(dateKey: string, time: string): boolean {
  return hash(`${dateKey}T${time}`) % 100 < BOOKED_THRESHOLD;
}

function dateKeyOf(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

interface ScheduleCalendarProps {
  selected: string | null;
  onSelect: (slot: string | null) => void;
}

export function ScheduleCalendar({ selected, onSelect }: ScheduleCalendarProps) {
  // Hydration-safe mount flag: the server snapshot is false so the prerendered
  // HTML matches the first client render, and the grid (which depends on the
  // local clock) only appears on the post-hydration render.
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);
  // null = "auto" — the user hasn't navigated months yet, so the view follows
  // the default below.
  const [monthOffset, setMonthOffset] = useState<number | null>(null);
  const [dateKey, setDateKey] = useState<string | null>(null);
  const [pickedTime, setPickedTime] = useState<string | null>(null);

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

  // First of activeOffset months from now, normalized to the 1st so the grid
  // never shifts mid-session.
  const viewMonth = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + activeOffset, 1);
  }, [activeOffset]);

  const { weeks } = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const minKeyLocal = dateKeyOf(today);
    const maxDay = new Date(today.getFullYear(), today.getMonth() + MONTHS_SHOWN, 0);

    const first = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1);
    // Monday-first offset.
    const lead = (first.getDay() + 6) % 7;
    const dayCount = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0).getDate();

    const cells: Cell[] = Array.from({ length: lead }, () => null);
    for (let day = 1; day <= dayCount; day++) {
      const date = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), day);
      const key = dateKeyOf(date);
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      const inRange = date >= today && date <= maxDay;
      const bookedAll =
        !isWeekend && inRange && TIME_SLOTS.every((time) => isSlotBooked(key, time));
      cells.push({ key, day, bookedAll: !inRange || isWeekend || bookedAll });
    }
    while (cells.length % 7 !== 0) cells.push(null);

    const result: Cell[][] = [];
    for (let i = 0; i < cells.length; i += 7) result.push(cells.slice(i, i + 7));
    return { weeks: result, minKey: minKeyLocal };
  }, [viewMonth]);

  const slots = useMemo(() => {
    if (!dateKey) return [];
    return TIME_SLOTS.map((time) => ({ time, booked: isSlotBooked(dateKey, time) }));
  }, [dateKey]);

  const monthLabel = viewMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const lastMonthOffset = MONTHS_SHOWN - 1;

  const pickSlot = (time: string) => {
    if (!dateKey) return;
    const date = new Date(`${dateKey}T00:00:00`);
    const label = date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
    setPickedTime(time);
    onSelect(`${label} · ${time}`);
  };

  const clear = () => {
    setDateKey(null);
    setPickedTime(null);
    onSelect(null);
  };

  return (
    <div className={styles.calendar}>
      <p className={`mono ${styles.label}`}>Pick a slot for the free call</p>

      {!mounted ? (
        <div className={styles.placeholder} aria-hidden="true" />
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
                        cell.bookedAll ? styles.dayFull : ""
                      }`}
                      disabled={cell.bookedAll}
                      aria-label={
                        cell.bookedAll
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
            <div className={styles.slots}>
              {slots.map(({ time, booked }) => (
                <button
                  key={time}
                  type="button"
                  className={`${styles.slot} ${pickedTime === time ? styles.slotSelected : ""}`}
                  disabled={booked}
                  onClick={() => pickSlot(time)}
                >
                  {time}
                  {booked ? <span className={`mono ${styles.booked}`}>booked</span> : null}
                </button>
              ))}
            </div>
          ) : (
            <p className={styles.hint}>
              Choose a day to see open times. Crossed-out slots are already taken.
            </p>
          )}

          {selected ? (
            <p className={styles.picked}>
              You picked <strong>{selected}</strong>
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
