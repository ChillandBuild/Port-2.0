/**
 * Canvas painter for the world. Called once per frame with a world progress
 * value; holds no state of its own, so any frame can be drawn in isolation
 * (which is what makes scrubbing backwards identical to scrubbing forwards).
 */

import {
  cameraAt,
  contactState,
  GATES,
  laneY,
  LANE_END_X,
  LANE_START_X,
  FIELD_DENSITY,
  TILE,
  type Cluster,
  type Contact,
  type FieldPoint,
} from "@/lib/world";

export interface Palette {
  groundNear: string;
  groundWide: string;
  groundLane: string;
  /** The colour records are drawn in: ink on paper, or light on a dark field. */
  mark: string;
  accent: string;
  accentSoft: string;
  /** What the landing wipe paints: the dossier's ground, not a fixed pigment. */
  landing: string;
  /**
   * Dark marks on a light ground read considerably stronger than light marks on
   * a dark one at the same alpha, so the whole field would come out as soot if
   * the values tuned for the dark world were reused unchanged.
   */
  alphaScale: number;
  /**
   * The market bodies. On the dark theme they read as glows; on paper the same
   * shapes read as weather over the field, which is the look the light theme
   * keeps deliberately.
   */
  clusterAlpha: number;
}

const FALLBACK: Palette = {
  groundNear: "#04090f",
  groundWide: "#020609",
  groundLane: "#060e16",
  mark: "#eef0ea",
  accent: "#d0616f",
  accentSoft: "#f0b9c1",
  landing: "#101820",
  alphaScale: 1,
  clusterAlpha: 1,
};

/**
 * The canvas cannot read CSS, so the theme is read out of the document once per
 * theme change and handed in. One source of truth stays in tokens.css.
 */
export function readPalette(): Palette {
  if (typeof document === "undefined") return FALLBACK;
  const cs = getComputedStyle(document.documentElement);
  const v = (name: string, fallback: string) => cs.getPropertyValue(name).trim() || fallback;
  const light = document.documentElement.dataset.theme !== "dark";
  return {
    groundNear: v("--surface-world", FALLBACK.groundNear),
    groundWide: v("--surface-world-wide", FALLBACK.groundWide),
    groundLane: v("--surface-world-lane", FALLBACK.groundLane),
    mark: v("--on-world", FALLBACK.mark),
    accent: v("--accent", FALLBACK.accent),
    accentSoft: v("--accent-soft", FALLBACK.accentSoft),
    landing: v("--surface-page", FALLBACK.landing),
    alphaScale: light ? 0.62 : 1,
    clusterAlpha: 1,
  };
}

/**
 * The palette in force for the frame being drawn. Set once at the top of
 * drawWorld rather than threaded through eight painters; the renderer stays
 * stateless between frames, which is what makes scrubbing backwards identical
 * to scrubbing forwards.
 */
let P: Palette = FALLBACK;

/** Mark colour at a given alpha, already scaled for the theme's polarity. */
function ink(alpha: number): string {
  return withAlpha(P.mark, alpha * P.alphaScale);
}

/** Progress at which the world starts handing over to paper. */
export const LANDING_FROM = 0.9;

export interface DrawArgs {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  dpr: number;
  t: number;
  field: FieldPoint[];
  clusters: Cluster[];
  cohort: Contact[];
  /** Points to aim for on screen. Lower on a phone. */
  budget: number;
  palette: Palette;
  /** Pointer offset in -1..1, for the lean. Zero on touch and reduced motion. */
  px: number;
  py: number;
}

export function drawWorld({ ctx, width, height, t, field, clusters, cohort, budget, palette, px, py }: DrawArgs): void {
  P = palette;
  const cam = cameraAt(t);
  const cx = width / 2;
  const cy = height / 2;

  // The lean: the world shifts slightly with the pointer, the way a real space
  // does when you move your head. Small on purpose.
  const leanX = px * 26;
  const leanY = py * 18;

  ctx.fillStyle = groundFor(t);
  ctx.fillRect(0, 0, width, height);

  const project = (x: number, y: number, parallax: number) => ({
    sx: (x - cam.x) * cam.zoom * parallax + cx + leanX * parallax,
    sy: (y - cam.y) * cam.zoom * parallax + cy + leanY * parallax,
  });

  // Three states for the field: full during the pull-back, dimmed through the
  // doubt, and held back during the run so the stream reads on top of it.
  const doubt = t > 0.36 && t < 0.5 ? 1 - clamp01((t - 0.36) / 0.09) * 0.58 : 1;
  const dim = t >= 0.5 ? 0.42 : doubt;
  drawClusters(ctx, clusters, project, cam.zoom, width, height, dim, t);
  drawField(ctx, field, project, cam, width, height, dim, t, budget);

  if (t > 0.4) {
    const laneAlpha = clamp01((t - 0.4) / 0.08);
    drawLane(ctx, project, cam.zoom, width, laneAlpha);
    drawGates(ctx, project, cam.zoom, width, laneAlpha, t);
    drawCohort(ctx, cohort, project, cam.zoom, width, t);
    drawSendFlash(ctx, width, height, t);
  }

  if (t < 0.42) drawFocus(ctx, project, cam.zoom, t);

  if (t >= LANDING_FROM) drawLanding(ctx, width, height, t);
}

function groundFor(t: number): string {
  // Three stops, small steps, one theme family. The change is invisible frame to
  // frame and obvious top to bottom.
  if (t < 0.3) return mix(P.groundNear, P.groundWide, clamp01(t / 0.3));
  if (t < 0.5) return mix(P.groundWide, P.groundLane, clamp01((t - 0.3) / 0.2));
  return P.groundLane;
}

type Project = (x: number, y: number, parallax: number) => { sx: number; sy: number };

/**
 * Bodies of light for the markets. Only meaningful when the camera is far
 * enough back that individual records stop being readable.
 */
function drawClusters(
  ctx: CanvasRenderingContext2D,
  clusters: Cluster[],
  project: Project,
  zoom: number,
  width: number,
  height: number,
  dim: number,
  t: number,
) {
  const presence = clamp01((0.85 - zoom) / 0.45) * dim * clamp01(t / 0.08);
  if (presence <= 0.01) return;

  for (const c of clusters) {
    const { sx, sy } = project(c.x, c.y, 1);
    const r = c.r * zoom;
    if (sx + r < 0 || sx - r > width || sy + r < 0 || sy - r > height) continue;

    const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, r);
    const a = 0.2 * c.weight * presence * P.clusterAlpha;
    g.addColorStop(0, ink(a));
    g.addColorStop(0.55, ink(a * 0.4));
    g.addColorStop(1, withAlpha(P.mark, 0));
    ctx.fillStyle = g;
    ctx.fillRect(sx - r, sy - r, r * 2, r * 2);
  }
}

/**
 * The records themselves, drawn from a repeating tile.
 *
 * The renderer walks only the tiles the camera can see and thins the sample
 * with a stride, so roughly the same number of points lands on screen whether
 * the camera is on top of one company or looking at the whole market.
 */
function drawField(
  ctx: CanvasRenderingContext2D,
  field: FieldPoint[],
  project: Project,
  cam: { x: number; y: number; zoom: number },
  width: number,
  height: number,
  dim: number,
  t: number,
  budget: number,
) {
  const zoom = cam.zoom;
  // A floor rather than a fade from nothing: the first screen should already be
  // inside the world, not waiting for it to arrive.
  const rise = 0.3 + 0.7 * clamp01(t / 0.07);

  const halfW = width / 2 / zoom;
  const halfH = height / 2 / zoom;
  const x0 = Math.floor((cam.x - halfW) / TILE);
  const x1 = Math.floor((cam.x + halfW) / TILE);
  const y0 = Math.floor((cam.y - halfH) / TILE);
  const y1 = Math.floor((cam.y + halfH) / TILE);

  // Stride is set from how many points would actually land on screen, not from
  // how many are walked. Those two diverge by roughly a factor of five, which is
  // exactly how a field ends up looking like a starfield.
  const expected = FIELD_DENSITY * (halfW * 2) * (halfH * 2);
  const stride = Math.max(1, Math.round(expected / budget));
  // Thinning the sample would thin the mass too, so the survivors carry the
  // weight of the ones that were skipped.
  const compensate = Math.min(1.9, 1 + Math.log2(stride) * 0.24);

  for (let tx = x0; tx <= x1; tx += 1) {
    for (let ty = y0; ty <= y1; ty += 1) {
      const ox = tx * TILE;
      const oy = ty * TILE;
      // Offsetting the start index per tile stops the stride carving visible
      // lattice lines through the field.
      const offset = (((tx * 73856093) ^ (ty * 19349663)) >>> 0) % stride;
      for (let i = offset; i < field.length; i += stride) {
        const p = field[i];
        const parallax = p.depth === 0 ? 0.86 : p.depth === 1 ? 0.94 : 1;
        const { sx, sy } = project(ox + p.x, oy + p.y, parallax);
        if (sx < -20 || sx > width + 20 || sy < -20 || sy > height + 20) continue;

        const base = p.depth === 0 ? 0.24 : p.depth === 1 ? 0.4 : 0.66;
        const breathe = 0.86 + Math.sin(p.phase + t * 5) * 0.14;
        const alpha = base * breathe * dim * rise * compensate;
        if (alpha < 0.015) continue;

        const size = Math.max(1.3, (p.depth === 2 ? 2.4 : p.depth === 1 ? 1.8 : 1.35) * Math.min(2.2, zoom) * compensate);
        ctx.fillStyle = ink(Math.min(0.95, alpha));
        ctx.fillRect(sx, sy, size, size);
      }
    }
  }
}

function drawLane(
  ctx: CanvasRenderingContext2D,
  project: Project,
  zoom: number,
  width: number,
  alpha: number,
) {
  ctx.beginPath();
  const step = 120;
  let started = false;
  for (let x = LANE_START_X; x <= LANE_END_X; x += step) {
    const { sx, sy } = project(x, laneY(x), 1);
    if (sx < -600 || sx > width + 600) {
      started = false;
      continue;
    }
    if (!started) {
      ctx.moveTo(sx, sy);
      started = true;
    } else {
      ctx.lineTo(sx, sy);
    }
  }
  ctx.strokeStyle = ink(0.34 * alpha);
  ctx.lineWidth = Math.max(1, zoom * 1.2);
  ctx.stroke();
}

function drawGates(
  ctx: CanvasRenderingContext2D,
  project: Project,
  zoom: number,
  width: number,
  alpha: number,
  t: number,
) {
  const h = 320;
  for (const g of GATES) {
    const { sx, sy } = project(g.x, g.y, 1);
    if (sx < -260 || sx > width + 260) continue;

    const live = t >= g.at - 0.012;
    const a = alpha * (live ? 1 : 0.42);
    // A gate is a threshold, so it is drawn as one: a band the stream passes
    // through, bracketed top and bottom, rather than a hairline.
    if (live) {
      const band = ctx.createLinearGradient(sx - 26 * zoom, 0, sx + 26 * zoom, 0);
      band.addColorStop(0, withAlpha(P.accent, 0));
      band.addColorStop(0.5, withAlpha(P.accent, 0.16 * alpha));
      band.addColorStop(1, withAlpha(P.accent, 0));
      ctx.fillStyle = band;
      ctx.fillRect(sx - 26 * zoom, sy - h * zoom, 52 * zoom, h * 2 * zoom);
    }

    ctx.strokeStyle = live ? withAlpha(P.accent, a) : ink(a * 0.55);
    ctx.lineWidth = Math.max(1.2, zoom * 1.8);
    ctx.beginPath();
    ctx.moveTo(sx, sy - h * zoom);
    ctx.lineTo(sx, sy + h * zoom);
    ctx.stroke();

    const bracket = 30 * zoom;
    ctx.beginPath();
    ctx.moveTo(sx - bracket, sy - h * zoom);
    ctx.lineTo(sx + bracket, sy - h * zoom);
    ctx.moveTo(sx - bracket, sy + h * zoom);
    ctx.lineTo(sx + bracket, sy + h * zoom);
    ctx.stroke();

    if (zoom > 0.5) {
      ctx.fillStyle = ink(alpha * (live ? 0.72 : 0.3));
      ctx.font = `${Math.round(11 * Math.min(1.6, zoom))}px ui-monospace, SFMono-Regular, monospace`;
      ctx.fillText(g.index.toString().padStart(2, "0"), sx + 8 * zoom, sy - h * zoom - 6);
    }
  }
}

function drawCohort(
  ctx: CanvasRenderingContext2D,
  cohort: Contact[],
  project: Project,
  zoom: number,
  width: number,
  t: number,
) {
  for (const c of cohort) {
    const pos = contactState(c, t);
    if (!pos) continue;
    const { sx, sy } = project(pos.x, pos.y, 1);
    if (sx < -30 || sx > width + 30) continue;

    // A booked contact reads as one from the moment the replied ones stop at
    // gate seven: fourteen halt, three carry on, and that is the whole point of
    // the last stretch. The rail's Booked figure still only moves at gate eight.
    const booked = c.fate === "booked" && pos.passed >= 7;
    const bloom = booked ? clamp01((t - GATES[6].at) / 0.08) : 0;
    const answered = (c.fate === "replied" || c.fate === "booked") && pos.passed >= 5;
    const live = !pos.stopped;

    const size = Math.max(2.6, (booked ? 6.4 : answered ? 5 : live ? 4.2 : 3) * Math.min(1.7, zoom));

    if (booked) {
      const r = size * (4.5 + bloom * 5.5);
      const halo = ctx.createRadialGradient(sx, sy, 0, sx, sy, r);
      halo.addColorStop(0, withAlpha(P.accentSoft, (0.5 + bloom * 0.34) * pos.alpha));
      halo.addColorStop(1, withAlpha(P.accentSoft, 0));
      ctx.fillStyle = halo;
      ctx.fillRect(sx - r, sy - r, r * 2, r * 2);
    }

    // The send. Everything that clears verification leaves at once, and this is
    // the only moment on the page where the whole cohort does the same thing.
    const pulse = sendPulse(t);
    if (pulse > 0.01 && pos.passed >= 4 && !pos.stopped) {
      const reach = size * (5 + pulse * 22);
      ctx.fillStyle = withAlpha(P.accentSoft, 0.6 * pulse * pos.alpha);
      ctx.fillRect(sx - reach, sy - Math.max(1, size / 5), reach, Math.max(1, size / 2.5));
    }

    ctx.fillStyle = booked
      ? withAlpha(P.accent, pos.alpha)
      : answered
        ? withAlpha(P.accent, pos.alpha * 0.84)
        : live
          ? ink(pos.alpha)
          : ink(pos.alpha * 0.42);
    ctx.fillRect(sx - size / 2, sy - size / 2, size, size);

    // A short trail on anything still moving: a stream of squares reads as a
    // scatter plot, a stream with direction reads as travel.
    if (live && zoom > 0.6) {
      ctx.fillStyle = ink(pos.alpha * 0.22);
      ctx.fillRect(sx - size * 4.5, sy - size / 6, size * 3.6, Math.max(1, size / 3));
    }
  }
}

/** How hot the send is at `t`. Peaks exactly on gate four and is over quickly. */
function sendPulse(t: number): number {
  return clamp01(1 - Math.abs(t - GATES[3].at) / 0.028);
}

/**
 * A brief lift across the whole frame on the send, so the moment registers
 * peripherally rather than only where the reader happens to be looking. Short
 * and low: this is an event, not a scrim.
 */
function drawSendFlash(ctx: CanvasRenderingContext2D, width: number, height: number, t: number) {
  const pulse = sendPulse(t);
  if (pulse <= 0.01) return;
  const g = ctx.createLinearGradient(0, 0, width, 0);
  g.addColorStop(0, withAlpha(P.accent, 0.075 * pulse));
  g.addColorStop(0.5, withAlpha(P.accentSoft, 0.06 * pulse));
  g.addColorStop(1, withAlpha(P.accent, 0.075 * pulse));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, width, height);
}

/** The one record the page opens on. A mark, not a label: the words are real DOM. */
function drawFocus(ctx: CanvasRenderingContext2D, project: Project, zoom: number, t: number) {
  const fade = 1 - clamp01((t - 0.24) / 0.16);
  if (fade <= 0) return;
  const { sx, sy } = project(0, 0, 1);
  const r = 13 * Math.min(3.4, zoom);
  const pulse = 0.72 + Math.sin(t * 30) * 0.12;

  ctx.strokeStyle = withAlpha(P.accent, 0.85 * fade);
  ctx.lineWidth = Math.max(1, zoom * 0.6);
  ctx.beginPath();
  ctx.arc(sx, sy, r * pulse, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = ink(fade);
  const s = Math.max(2, 3 * Math.min(3.4, zoom));
  ctx.fillRect(sx - s / 2, sy - s / 2, s, s);

  const tick = r * 2.1 * pulse;
  ctx.strokeStyle = ink(0.34 * fade);
  ctx.beginPath();
  ctx.moveTo(sx - tick, sy);
  ctx.lineTo(sx - r * pulse - 4, sy);
  ctx.moveTo(sx + r * pulse + 4, sy);
  ctx.lineTo(sx + tick, sy);
  ctx.stroke();
}

/**
 * How far the paper has risen, 0 to 1, eased.
 *
 * Exported because the copy layer has to agree with the canvas to the pixel:
 * the arrival is ink and may only appear once this edge is above it. Two
 * separately-written curves drift, and the drift shows up as dark type on a
 * dark world.
 *
 * The curve is fast-then-settling on purpose. A symmetric ease crawls at the
 * start, and the whole time it crawls there is nothing on screen: the last
 * stage has gone and the paper has not yet reached the line the arrival sits on.
 */
export function landingProgress(t: number): number {
  const u = clamp01((t - LANDING_FROM) / (1 - LANDING_FROM));
  return 1 - (1 - u) * (1 - u);
}

/** The landing. One wipe, upward, and the world has become paper. */
function drawLanding(ctx: CanvasRenderingContext2D, width: number, height: number, t: number) {
  const h = height * landingProgress(t);
  ctx.fillStyle = P.landing;
  ctx.fillRect(0, height - h, width, h);
}

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n));
}

function withAlpha(hex: string, alpha: number): string {
  const { r, g, b } = parse(hex);
  return `rgba(${r}, ${g}, ${b}, ${Math.max(0, Math.min(1, alpha)).toFixed(3)})`;
}

function mix(a: string, b: string, u: number): string {
  const A = parse(a);
  const B = parse(b);
  const r = Math.round(A.r + (B.r - A.r) * u);
  const g = Math.round(A.g + (B.g - A.g) * u);
  const bl = Math.round(A.b + (B.b - A.b) * u);
  return `rgb(${r}, ${g}, ${bl})`;
}

function parse(hex: string) {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}
