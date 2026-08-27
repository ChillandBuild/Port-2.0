/**
 * Theme state.
 *
 * The resolved theme lives on <html data-theme>, set by a tiny script that runs
 * before first paint (see layout). Anything that needs to react to a change —
 * the canvas, which cannot read CSS on its own — subscribes here.
 */

export type Theme = "light" | "dark";

export const THEME_KEY = "sk-theme";

/**
 * Runs before paint, inlined in the document head. Written as a string because
 * it has to execute ahead of hydration: resolving the theme in React means one
 * frame of the wrong ground, which on a page that is entirely one polarity is a
 * full-screen flash.
 */
export const THEME_BOOT_SCRIPT = `(function(){try{var s=localStorage.getItem('${THEME_KEY}');var d=window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.dataset.theme=(s==='light'||s==='dark')?s:(d?'dark':'light')}catch(e){document.documentElement.dataset.theme='light'}})()`;

const listeners = new Set<(theme: Theme) => void>();

export function currentTheme(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

export function setTheme(theme: Theme, remember = true): void {
  document.documentElement.dataset.theme = theme;
  if (remember) {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      // Private browsing, or storage disabled. The theme still applies for this
      // visit; only the memory of it is lost, which is not worth failing over.
    }
  }
  for (const fn of listeners) fn(theme);
}

export function subscribeTheme(fn: (theme: Theme) => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** True while the reader has expressed no preference, so the OS still governs. */
export function isFollowingSystem(): boolean {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    return stored !== "light" && stored !== "dark";
  } catch {
    return true;
  }
}

/** Keeps an un-chosen theme in step with the OS while the page is open. */
export function watchSystemTheme(): () => void {
  if (typeof window === "undefined" || !window.matchMedia) return () => {};
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  const onChange = (e: MediaQueryListEvent) => {
    if (isFollowingSystem()) setTheme(e.matches ? "dark" : "light", false);
  };
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}
