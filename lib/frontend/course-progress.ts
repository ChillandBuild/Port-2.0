/**
 * Course reading progress. Browser-scoped (localStorage), same
 * external-store pattern as theme.ts — a module-level cache plus a
 * listener set, read via useSyncExternalStore so components never call
 * setState synchronously inside an effect just to mirror it in.
 *
 * localStorage remains the source of truth for the reader's OWN progress bar:
 * it is instant, works offline, and survives an expired window.
 *
 * It is now also reported to the server. The access cookie identifies the
 * grant, which is the session key this file's original note said did not
 * exist — Sampath needs to know whether a company he sent a link to actually
 * read the material before he follows up. Reporting is best-effort and never
 * blocks or breaks reading.
 */

export const COURSE_PROGRESS_KEY = "sk-course-progress";

const EMPTY: Set<string> = new Set();

let cache: Set<string> | null = null;
const listeners = new Set<() => void>();

function read(): Set<string> {
  try {
    const raw = localStorage.getItem(COURSE_PROGRESS_KEY);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

/** Client snapshot for useSyncExternalStore. Stable reference until progress changes. */
export function getCourseProgress(): Set<string> {
  if (typeof window === "undefined") return EMPTY;
  if (!cache) cache = read();
  return cache;
}

/**
 * Server/first-hydration snapshot: always empty, same as a fresh visitor.
 * Must return the same reference every call — useSyncExternalStore compares
 * by identity, and a fresh `new Set()` each time trips React's "getServerSnapshot
 * should be cached" warning (and can loop).
 */
export function getCourseProgressServerSnapshot(): Set<string> {
  return EMPTY;
}

export function markSectionVisited(id: string): void {
  const current = getCourseProgress();
  if (current.has(id)) return;
  const next = new Set(current);
  next.add(id);
  cache = next;
  try {
    localStorage.setItem(COURSE_PROGRESS_KEY, JSON.stringify([...next]));
  } catch {
    // Private browsing, or storage disabled. Progress just won't persist.
  }
  for (const fn of listeners) fn();
}

export function subscribeCourseProgress(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/* --- Server reporting ----------------------------------------------------- */

/** How often accumulated dwell time is flushed while the tab stays open. */
const FLUSH_INTERVAL_MS = 20_000;

/** Seconds observed since the last successful flush, keyed by section id. */
const pending = new Map<string, number>();
let flushTimer: ReturnType<typeof setInterval> | null = null;
let listenersBound = false;

/**
 * Records dwell time against a section. Called by the observer in GuideShell
 * as sections enter and leave the reading band; the flush below batches it so
 * a scroll through 40 sections is a couple of requests, not forty.
 */
export function recordSectionTime(id: string, seconds: number): void {
  if (seconds <= 0) return;
  pending.set(id, (pending.get(id) ?? 0) + seconds);
}

function flush(useBeacon: boolean): void {
  if (pending.size === 0) return;
  const payload = JSON.stringify({ sections: Object.fromEntries(pending) });
  pending.clear();

  try {
    // sendBeacon is the only thing that reliably survives the tab closing,
    // which is exactly when the last and most complete reading data exists.
    if (useBeacon && typeof navigator !== "undefined" && navigator.sendBeacon) {
      navigator.sendBeacon(
        "/api/course/progress",
        new Blob([payload], { type: "application/json" }),
      );
      return;
    }
    void fetch("/api/course/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => {
      // Offline or blocked. The reader is unaffected; the numbers are a
      // nice-to-have and the next flush will carry fresh time anyway.
    });
  } catch {
    // Never let telemetry throw into a render or an unload handler.
  }
}

/**
 * Starts periodic reporting. Idempotent, and safe to call from an effect.
 * Returns a teardown that flushes whatever is still buffered.
 */
export function startProgressReporting(): () => void {
  if (typeof window === "undefined") return () => {};

  if (!flushTimer) {
    flushTimer = setInterval(() => flush(false), FLUSH_INTERVAL_MS);
  }
  if (!listenersBound) {
    listenersBound = true;
    // pagehide covers the bfcache and mobile-Safari cases that "unload" misses.
    window.addEventListener("pagehide", () => flush(true));
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") flush(true);
    });
  }

  return () => {
    flush(true);
  };
}
