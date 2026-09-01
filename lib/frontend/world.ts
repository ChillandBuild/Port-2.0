/**
 * The world: geometry and camera for the continuous canvas the page travels
 * through before it lands on paper.
 *
 * Everything here is a pure function of world progress `t` (0 to 1). Nothing
 * accumulates. That is what makes the travel reversible: scrolling back up
 * recomputes an earlier state rather than undoing a later one.
 *
 * Plane units are pixels at zoom 1.
 */

/** Deterministic PRNG. The field must be identical on every load and on the server. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let x = Math.imul(a ^ (a >>> 15), 1 | a);
    x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x;
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

export const LANE_START_X = 1500;
export const LANE_END_X = 11800;
const LANE_WAVE = 210;
const LANE_PERIOD = 5200;

/** The lane is a single continuous path. Contacts travel it; the camera follows it. */
export function laneY(x: number): number {
  return Math.sin((x - LANE_START_X) / LANE_PERIOD) * LANE_WAVE;
}

export interface Gate {
  /** 1-based, matches PIPELINE[i].no */
  index: number;
  x: number;
  y: number;
  /** World progress at which the camera is level with this gate. */
  at: number;
}

const GATE_COUNT = 8;
const TRAVEL_FROM = 0.5;
const CAM_TRAVEL_START = 1500;
const CAM_TRAVEL_END = 12200;

/** First gate, and the spacing between them, in world progress. */
const GATE_FIRST_AT = 0.515;
/** Exported: the cue windows are derived from it, so they cannot drift apart. */
export const GATE_STEP_AT = 0.053;

/**
 * Gates are placed by *when the camera reaches them*, not by distance, so the
 * eight stages are evenly paced through the peak and the last one lands with
 * room to spare before the landing wipe.
 */
export const GATES: Gate[] = Array.from({ length: GATE_COUNT }, (_, i) => {
  const at = GATE_FIRST_AT + i * GATE_STEP_AT;
  const x = CAM_TRAVEL_START + ((at - TRAVEL_FROM) / (1 - TRAVEL_FROM)) * (CAM_TRAVEL_END - CAM_TRAVEL_START);
  return { index: i + 1, x, y: laneY(x), at };
});

/** World progress at which the last gate is passed and the arrival hold begins. */
export const RUN_ENDS_AT = GATE_FIRST_AT + (GATE_COUNT - 1) * GATE_STEP_AT;

export interface FieldPoint {
  x: number;
  y: number;
  /** 0 far, 1 mid, 2 near. Drives size, opacity and parallax rate. */
  depth: 0 | 1 | 2;
  /** Per-point phase so the field breathes without a global pulse. */
  phase: number;
}

/**
 * The record field.
 *
 * Points are stored in one repeating tile rather than as a fixed cloud. A fixed
 * cloud has a fixed number of points, so its density on screen collapses the
 * moment the camera pulls back, and the wide frame — the one that has to sell
 * two hundred million of anything — comes out as a starfield. A tile repeats,
 * so density per screen is constant at every zoom and the renderer decides how
 * many of them to actually draw.
 */
export const TILE = 1200;
/**
 * Sized so that a full screen at the run camera lands a few thousand records.
 * The renderer thins this with a stride when the camera pulls back.
 */
const POINTS_PER_TILE = 4400;

export const FIELD_DENSITY = POINTS_PER_TILE / (TILE * TILE);

export function buildField(): FieldPoint[] {
  const rand = mulberry32(0x5a3f11);
  const points: FieldPoint[] = [];
  for (let i = 0; i < POINTS_PER_TILE; i += 1) {
    const depth = (i % 9 === 0 ? 2 : i % 3 === 0 ? 1 : 0) as 0 | 1 | 2;
    points.push({
      x: rand() * TILE,
      y: rand() * TILE,
      depth,
      phase: rand() * Math.PI * 2,
    });
  }
  return points;
}

export interface Cluster {
  x: number;
  y: number;
  r: number;
  weight: number;
}

/**
 * Markets. At the wide camera the mass reads as bodies of light rather than as
 * individual records, which is both truer to the scale and far cheaper than
 * drawing enough points to fake it.
 */
export function buildClusters(count: number): Cluster[] {
  const rand = mulberry32(0x77c2a1);
  return Array.from({ length: count }, () => ({
    x: -1400 + rand() * 15600,
    y: (rand() + rand() - 1) * 1750,
    r: 420 + rand() * 1150,
    weight: 0.3 + rand() * 0.7,
  }));
}

/** What happens to one contact, and where it leaves the lane. */
export const FATES = [
  { key: "outside-icp", weight: 0.46, gate: 1 },
  { key: "unverified", weight: 0.2, gate: 3 },
  { key: "bounced", weight: 0.012, gate: 4 },
  { key: "no-reply", weight: 0.26, gate: 5 },
  { key: "replied", weight: 0.048, gate: 7 },
  { key: "booked", weight: 0.02, gate: 8 },
] as const;

export type FateKey = (typeof FATES)[number]["key"];

export interface Contact {
  /** World progress at which this contact joins the run. */
  enter: number;
  fate: FateKey;
  /** Gate index it survives to. Beyond that it stops and the run leaves it behind. */
  exitGate: number;
  /** Longitudinal position relative to the camera, in plane units. */
  lag: number;
  /** Lateral offset from the lane centreline, so the cohort reads as a stream. */
  offset: number;
  phase: number;
}

export const COHORT_ENTER_FROM = 0.5;
export const COHORT_ENTER_TO = 0.63;

export function buildCohort(count: number): Contact[] {
  const rand = mulberry32(0x2b17c3);
  const cumulative: { key: FateKey; upTo: number; gate: number }[] = [];
  let acc = 0;
  for (const f of FATES) {
    acc += f.weight;
    cumulative.push({ key: f.key, upTo: acc, gate: f.gate });
  }
  const total = acc;

  return Array.from({ length: count }, (_, i) => {
    const r = rand() * total;
    const hit = cumulative.find((c) => r <= c.upTo) ?? cumulative[cumulative.length - 1];
    return {
      enter: COHORT_ENTER_FROM + (i / count) * (COHORT_ENTER_TO - COHORT_ENTER_FROM) + (rand() - 0.5) * 0.006,
      fate: hit.key,
      exitGate: hit.gate,
      lag: -620 + rand() * 1240,
      offset: (rand() - 0.5) * 900,
      phase: rand() * Math.PI * 2,
    };
  });
}

export interface ContactState {
  x: number;
  y: number;
  alpha: number;
  /** How many gates this contact has cleared. */
  passed: number;
  stopped: boolean;
}

/**
 * Where a contact is at world progress `t`.
 *
 * The cohort rides *with* the camera rather than racing ahead of it. An earlier
 * version gave every contact a fixed speed along the lane, and the camera simply
 * outran them: by the fifth gate the frame was empty and the run the page is
 * built around had nothing in it. Riding with the camera means the stream is
 * always in view and the funnel is legible as a thinning, which is the point.
 *
 * A contact that fails a gate stops there in world space, so the run visibly
 * leaves it behind. Booked contacts never stop: they are in the calendar, and
 * they travel to the end.
 */
export function contactState(c: Contact, t: number): ContactState | null {
  if (t < c.enter) return null;

  const cam = cameraAt(t);
  const rides = c.fate === "booked";

  // Booked contacts draw in toward the middle of the stream over the back half
  // of the run. They have to stay in frame to the end, and at the closing zoom
  // the full stream spread is wider and taller than the viewport.
  const settle = rides ? smooth(clamp01((t - GATES[4].at) / (GATES[7].at - GATES[4].at))) : 0;
  // Each survivor gets its own resting place, derived from its own phase.
  // Settling them by the sign of their offset lands two of the three on the same
  // spot and their halos merge into one mark.
  const lag = c.lag * (1 - settle) + Math.cos(c.phase) * 330 * settle;
  const offset = c.offset * (1 - settle) + Math.sin(c.phase) * 210 * settle;

  const free = cam.x + lag;
  const exit = GATES[c.exitGate - 1];
  const stopped = !rides && free > exit.x;
  const x = stopped ? exit.x : free;

  const behind = stopped ? free - exit.x : 0;
  // A long decay, deliberately. A contact that vanishes soon after it fails
  // takes the evidence of the funnel with it, and the late stages come out
  // empty because by then almost everything has failed.
  const fade = stopped ? Math.max(0, 1 - behind / 9000) : 1;
  const arrive = Math.min(1, (t - c.enter) / 0.012);
  const alpha = fade * arrive;
  if (alpha <= 0.02) return null;

  const sag = stopped ? Math.min(900, (behind / 9000) ** 2 * 1800) : 0;
  const y = laneY(x) + offset + sag;

  let passed = 0;
  for (const g of GATES) if (x >= g.x) passed = g.index;

  return { x, y, alpha, passed, stopped };
}

/**
 * How many gates a contact has cleared by `t`, ignoring whether it is still
 * visible. Counting off the drawn state would make the rail's totals fall as
 * dropped contacts faded out, which is not what "sourced" means.
 */
export function contactProgress(c: Contact, t: number): number {
  if (t < c.enter) return 0;
  const exit = GATES[c.exitGate - 1];
  const rides = c.fate === "booked";
  const settle = rides ? smooth(clamp01((t - GATES[4].at) / (GATES[7].at - GATES[4].at))) : 0;
  const lag = c.lag * (1 - settle) + Math.cos(c.phase) * 330 * settle;
  const free = cameraAt(t).x + lag;
  const x = rides ? free : Math.min(free, exit.x);
  let passed = 0;
  for (const g of GATES) if (x >= g.x) passed = g.index;
  return passed;
}

export interface Camera {
  x: number;
  y: number;
  zoom: number;
}

interface Key {
  t: number;
  x: number;
  zoom: number;
  /** Segments starting at this key interpolate linearly instead of easing. */
  linear?: boolean;
}

/**
 * The camera keyframes. One continuous move: close on a single record, pull back
 * to the mass, hold wide through the silence, then travel the lane to the end.
 */
const KEYS: Key[] = [
  { t: 0.0, x: -40, zoom: 3.4 },
  { t: 0.13, x: 60, zoom: 2.5 },
  { t: 0.33, x: 1150, zoom: 0.3 },
  { t: 0.44, x: 1350, zoom: 0.3 },
  // The run holds one pace. A camera that changes speed between gates reads as
  // broken rather than expressive, and it also decouples gate positions from the
  // scroll time at which their copy is cued. Every key below sits on the same
  // straight line in x, so the travel speed is constant and only the framing
  // changes: in on the send, back for the thinning, in hard on the survivors.
  { t: TRAVEL_FROM, x: CAM_TRAVEL_START, zoom: 1.05, linear: true },
  { t: 0.63, x: 4282, zoom: 1.28, linear: true },
  { t: 0.74, x: 6636, zoom: 0.82, linear: true },
  { t: 0.9, x: 10060, zoom: 1.3, linear: true },
  { t: 1.0, x: CAM_TRAVEL_END, zoom: 1.24 },
];

const smooth = (u: number) => u * u * (3 - 2 * u);

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

export function cameraAt(t: number): Camera {
  const p = Math.min(1, Math.max(0, t));
  let a = KEYS[0];
  let b = KEYS[KEYS.length - 1];
  for (let i = 0; i < KEYS.length - 1; i += 1) {
    if (p >= KEYS[i].t && p <= KEYS[i + 1].t) {
      a = KEYS[i];
      b = KEYS[i + 1];
      break;
    }
  }
  const span = b.t - a.t || 1;
  const raw = (p - a.t) / span;
  const u = a.linear ? raw : smooth(raw);
  const x = a.x + (b.x - a.x) * u;
  const zoom = a.zoom + (b.zoom - a.zoom) * u;
  // Below the lane the camera holds the horizon; on the lane it rides it.
  const onLane = p >= 0.46;
  const y = onLane ? laneY(x) * smooth(Math.min(1, (p - 0.46) / 0.06)) : 0;
  return { x, y, zoom };
}
