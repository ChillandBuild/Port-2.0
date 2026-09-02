/**
 * Course reading progress. Browser-scoped (localStorage), same
 * external-store pattern as theme.ts — a module-level cache plus a
 * listener set, read via useSyncExternalStore so components never call
 * setState synchronously inside an effect just to mirror it in. No
 * account/session system exists to key a server-side record off, and
 * cross-device sync isn't worth a new Supabase table for a nice-to-have
 * reading tracker.
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
