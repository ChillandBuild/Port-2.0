/**
 * One scroll source for the whole page.
 *
 * Every scroll-driven thing on this site (the world camera, the cadence rail,
 * the waypoint markers) reads from this single rAF loop rather than attaching
 * its own listener. Two loops racing each other is how a scroll page starts
 * to feel loose.
 *
 * Nothing here writes to React state. Subscribers write to the DOM or to a
 * canvas directly, because a 60fps re-render of a page this size is a stutter.
 */

export interface ScrollFrame {
  /** 0 to 1 across the whole scrollable document. */
  page: number;
  /** 0 to 1 across the world spacer. 0 before it, 1 after it. */
  world: number;
  /** Pixels per frame, smoothed. Negative means scrolling up. */
  velocity: number;
  /** Absolute scroll position, for anything that needs real pixels. */
  y: number;
}

type Listener = (frame: ScrollFrame) => void;

const listeners = new Set<Listener>();
let worldEl: HTMLElement | null = null;
let running = false;
let rafId = 0;
let lastY = 0;
let smoothedVelocity = 0;

const frame: ScrollFrame = { page: 0, world: 0, velocity: 0, y: 0 };

export function registerWorld(el: HTMLElement | null): void {
  worldEl = el;
}

export function subscribeScroll(fn: Listener): () => void {
  listeners.add(fn);
  start();
  fn(frame);
  return () => {
    listeners.delete(fn);
    if (listeners.size === 0) stop();
  };
}

export function readScroll(): ScrollFrame {
  return frame;
}

function start() {
  if (running || typeof window === "undefined") return;
  running = true;
  lastY = window.scrollY;
  rafId = window.requestAnimationFrame(tick);
}

function stop() {
  running = false;
  if (typeof window !== "undefined") window.cancelAnimationFrame(rafId);
}

function tick() {
  if (!running) return;
  const y = window.scrollY;
  const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);

  const raw = y - lastY;
  lastY = y;
  smoothedVelocity += (raw - smoothedVelocity) * 0.2;

  frame.y = y;
  frame.page = clamp01(y / max);
  frame.velocity = smoothedVelocity;
  frame.world = worldEl ? worldProgress(worldEl, y) : 0;

  for (const fn of listeners) fn(frame);
  rafId = window.requestAnimationFrame(tick);
}

/**
 * The world spacer is taller than the viewport and its stage is sticky, so the
 * travel runs from the moment the spacer's top hits the top of the viewport to
 * the moment its bottom does. That is exactly `scrollHeight - viewport`.
 */
function worldProgress(el: HTMLElement, y: number): number {
  const top = el.offsetTop;
  const travel = Math.max(1, el.offsetHeight - window.innerHeight);
  return clamp01((y - top) / travel);
}

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n));
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Same-page hash links (`#about`, `#history`, ...) are driven from here
 * instead of a plain `<a href="#...">`. The world spacer alone is 7.4
 * viewport-heights, and native anchor scrolling shares the main thread with
 * the world's rAF paint loop across that whole distance — long enough that a
 * browser's smooth-scroll can stall or settle short of the target. Driving it
 * ourselves via scrollIntoView keeps the jump deterministic.
 */
export function scrollToId(id: string): boolean {
  if (typeof document === "undefined") return false;
  const el = document.getElementById(id);
  if (!el) return false;
  el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
  return true;
}
