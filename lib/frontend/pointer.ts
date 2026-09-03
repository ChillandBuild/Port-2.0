/**
 * One pointer source for the whole page.
 *
 * Like the scroll store, this is a single rAF loop that every pointer-driven
 * effect reads from, rather than each component attaching its own listener.
 * Nothing here writes React state: subscribers write CSS custom properties or
 * transforms directly, because pointer motion at 60fps is not a re-render.
 *
 * Everything is gated to a real hovering pointer and to reduced-motion, so a
 * touch device never fires a false hover and a reader who asked for less motion
 * gets none of it.
 */

export interface PointerTarget {
  el: HTMLElement;
  /** Publishes --spot-x / --spot-y in px, relative to the element's own box. */
  spot?: boolean;
  /** Degrees of rotation toward the pointer. 5 to 9 reads as depth; past 12 it is a toy. */
  tilt?: number;
  /** Fraction of the distance to the pointer the element drifts. 0.2 to 0.35. */
  magnet?: number;
}

interface Tracked extends PointerTarget {
  /** Interpolated state, so nothing snaps to the cursor. */
  rx: number;
  ry: number;
  mx: number;
  my: number;
  inside: boolean;
}

const tracked: Tracked[] = [];
let running = false;
let rafId = 0;
let pointerX = 0;
let pointerY = 0;
let hasPointer = false;

const LERP = 0.14;

export function supportsPointerFX(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return (
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function registerPointerTargets(targets: PointerTarget[]): () => void {
  if (!supportsPointerFX()) return () => {};

  const added = targets.map((t) => ({ ...t, rx: 0, ry: 0, mx: 0, my: 0, inside: false }));
  tracked.push(...added);
  start();

  return () => {
    for (const item of added) {
      const i = tracked.indexOf(item);
      if (i >= 0) tracked.splice(i, 1);
      item.el.style.transform = "";
      item.el.style.removeProperty("--spot-x");
      item.el.style.removeProperty("--spot-y");
      item.el.removeAttribute("data-pointer-near");
    }
    if (tracked.length === 0) stop();
  };
}

function onMove(e: PointerEvent) {
  pointerX = e.clientX;
  pointerY = e.clientY;
  hasPointer = true;
}

function start() {
  if (running || typeof window === "undefined") return;
  running = true;
  window.addEventListener("pointermove", onMove, { passive: true });
  rafId = window.requestAnimationFrame(tick);
}

function stop() {
  if (!running) return;
  running = false;
  window.removeEventListener("pointermove", onMove);
  window.cancelAnimationFrame(rafId);
}

/** How far outside its own box an element still feels the pointer. */
const REACH = 130;

/** Minimum gap two magnet siblings keep between each other while pulled. */
const COLLIDE_GAP = 12;

/**
 * Magnet pulls are computed per element, so two side-by-side targets pulled
 * toward the same pointer can drift over each other. This pass runs after the
 * per-element update and splits the overlap between the pair, so they separate
 * like objects sharing space rather than one ghosting over the other. Vertical
 * overlap is required first so a magnet column above a magnet row never reacts
 * to its neighbour's horizontal drift.
 */
function resolveMagnetCollisions() {
  for (let i = 0; i < tracked.length; i++) {
    const a = tracked[i];
    if (!a.magnet) continue;
    for (let j = i + 1; j < tracked.length; j++) {
      const b = tracked[j];
      if (!b.magnet || a.el.parentElement !== b.el.parentElement) continue;

      const ra = a.el.getBoundingClientRect();
      const rb = b.el.getBoundingClientRect();
      // Rects come back with the transforms already applied this frame; strip
      // them to compare the boxes at rest.
      let left = tracked[i];
      let right = tracked[j];
      let leftRect = ra;
      let rightRect = rb;
      if (leftRect.left - left.mx > rightRect.left - right.mx) {
        // tracked order is registration order, not reading order — the pair is
        // compared left-to-right so the clamp always separates, never squeezes.
        [left, right] = [right, left];
        [leftRect, rightRect] = [rightRect, leftRect];
      }

      const aTop = leftRect.top - left.my;
      const aBottom = leftRect.bottom - left.my;
      const bTop = rightRect.top - right.my;
      const bBottom = rightRect.bottom - right.my;
      if (Math.min(aBottom, bBottom) - Math.max(aTop, bTop) <= 0) continue;

      // leftRect.right and rightRect.left are the transformed edges this frame.
      const overlap = leftRect.right + COLLIDE_GAP - rightRect.left;
      if (overlap <= 0) continue;

      left.mx -= overlap / 2;
      right.mx += overlap / 2;
    }
  }
}

function tick() {
  if (!running) return;
  if (hasPointer) {
    for (const item of tracked) {
      const r = item.el.getBoundingClientRect();
      if (r.bottom < -REACH || r.top > window.innerHeight + REACH) continue;

      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = pointerX - cx;
      const dy = pointerY - cy;

      const inside =
        pointerX >= r.left - REACH &&
        pointerX <= r.right + REACH &&
        pointerY >= r.top - REACH &&
        pointerY <= r.bottom + REACH;

      if (inside !== item.inside) {
        item.inside = inside;
        if (inside) item.el.setAttribute("data-pointer-near", "");
        else item.el.removeAttribute("data-pointer-near");
      }

      if (item.spot) {
        item.el.style.setProperty("--spot-x", `${(pointerX - r.left).toFixed(1)}px`);
        item.el.style.setProperty("--spot-y", `${(pointerY - r.top).toFixed(1)}px`);
      }

      if (item.tilt) {
        // Interpolated, never tracked directly: direct tracking carries no
        // momentum and reads as a diagram rather than as a physical object.
        const targetY = inside ? (dx / (r.width / 2)) * item.tilt : 0;
        const targetX = inside ? (-dy / (r.height / 2)) * item.tilt : 0;
        item.ry += (targetY - item.ry) * LERP;
        item.rx += (targetX - item.rx) * LERP;
      }

      if (item.magnet) {
        const pull = inside ? item.magnet : 0;
        item.mx += (dx * pull - item.mx) * LERP;
        item.my += (dy * pull - item.my) * LERP;
      }
    }

    resolveMagnetCollisions();

    for (const item of tracked) {
      if (item.tilt || item.magnet) {
        const t: string[] = [];
        if (item.magnet) t.push(`translate3d(${item.mx.toFixed(2)}px, ${item.my.toFixed(2)}px, 0)`);
        if (item.tilt) {
          t.push(`perspective(900px)`);
          t.push(`rotateX(${item.rx.toFixed(3)}deg)`);
          t.push(`rotateY(${item.ry.toFixed(3)}deg)`);
        }
        item.el.style.transform = t.join(" ");
      }
    }
  }
  rafId = window.requestAnimationFrame(tick);
}
