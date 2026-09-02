/**
 * Access window durations, shared by the admin form and the route handlers
 * that create and extend grants. Isomorphic on purpose — the server must
 * compute seconds from the same table the client showed, and must never accept
 * a raw second count from a request body.
 */

export type DurationUnit = "hours" | "days";

export interface DurationPreset {
  id: string;
  label: string;
  seconds: number;
}

const HOUR = 60 * 60;
const DAY = 24 * HOUR;

/** Floor and ceiling mirror the course_access_seconds_check constraint. */
export const MIN_ACCESS_SECONDS = 15 * 60;
export const MAX_ACCESS_SECONDS = 365 * DAY;

/**
 * The four windows Sampath actually uses. 4h is first because it is the
 * default: long enough for a hiring panel to read the whole thing, short
 * enough that a forwarded link is worthless by tomorrow.
 */
export const DURATION_PRESETS: readonly DurationPreset[] = [
  { id: "4h", label: "4 hours", seconds: 4 * HOUR },
  { id: "6h", label: "6 hours", seconds: 6 * HOUR },
  { id: "24h", label: "24 hours", seconds: DAY },
  { id: "7d", label: "7 days", seconds: 7 * DAY },
] as const;

export const DEFAULT_PRESET_ID = "4h";
export const DEFAULT_REDEEM_BY_DAYS = 30;

export function presetById(id: string): DurationPreset | null {
  return DURATION_PRESETS.find((preset) => preset.id === id) ?? null;
}

export function durationToSeconds(amount: number, unit: DurationUnit): number {
  return Math.round(amount * (unit === "days" ? DAY : HOUR));
}

/** Clamps into the range the database will accept, so a bad value never 500s. */
export function clampAccessSeconds(seconds: number): number {
  if (!Number.isFinite(seconds)) return MIN_ACCESS_SECONDS;
  return Math.min(MAX_ACCESS_SECONDS, Math.max(MIN_ACCESS_SECONDS, Math.round(seconds)));
}

/**
 * "4 hours", "2 days 6 hours", "45 minutes". Used for both a window's total
 * length and the time left on a live one, so it has to stay readable at every
 * magnitude — hence the two-unit cap rather than a full breakdown.
 */
export function formatDuration(seconds: number): string {
  const total = Math.max(0, Math.round(seconds));
  if (total < HOUR) {
    const minutes = Math.max(1, Math.round(total / 60));
    return `${minutes} min`;
  }
  const days = Math.floor(total / DAY);
  const hours = Math.floor((total % DAY) / HOUR);
  const minutes = Math.floor((total % HOUR) / 60);

  if (days > 0) {
    return hours > 0 ? `${days}d ${hours}h` : `${days} day${days === 1 ? "" : "s"}`;
  }
  return minutes > 0 ? `${hours}h ${minutes}m` : `${hours} hour${hours === 1 ? "" : "s"}`;
}

/** Everything in the console is read in IST; the server runs UTC. */
export const DISPLAY_TIME_ZONE = "Asia/Kolkata";

export function formatMoment(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: DISPLAY_TIME_ZONE,
  });
}
