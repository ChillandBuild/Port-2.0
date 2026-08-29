/**
 * Scroll-drawn connectors.
 *
 * A line draws itself from one card to the next as its section scrolls, with a
 * dot riding the growing tip. When the dot lands, that card's target element
 * latches on — and stays on, because scrolling back up rewinds the line but you
 * do not un-reach a step you have reached.
 *
 * Two sections use this. The engagement ladder is a single row that alternates
 * sides, so every connector leaves one card's side edge and meets the next.
 * The agenda is a wrapped grid, so some connectors have to get from the end of
 * one row back to the start of the next; those route through the gutter between
 * the rows instead. Which of the two a connector is comes from the live layout,
 * not from an index, so a breakpoint change re-decides it for free.
 *
 * Lives outside ScrollFX on purpose: ScrollFX is a router for the whole paper
 * half of the site, and this is a couple of sections' worth of geometry.
 */

type Gsap = typeof import("gsap").gsap;
type ScrollTriggerClass = typeof import("gsap/ScrollTrigger").ScrollTrigger;

/** Fallback for a host that does not name its own breakpoint. Matches the
 *  four-up breakpoint in ScheduleEngagement.module.css: below it the phases
 *  stack, so there is no left-to-right journey to trace. */
const DEFAULT_MIN_WIDTH = 1024;

/** Progress at which the destination card latches on. Deliberately not 1: the
 *  target should light as the dot arrives, not a frame after it has stopped. */
const ACTIVATE_AT = 0.9;

/** Fraction of a segment that adjacent connectors share. A hard handoff between
 *  two scrubbed tweens reads as a stutter. */
const OVERLAP = 0.1;

/** Where on a card's height the line leaves and arrives, as a fraction. Low on
 *  the card it leaves, high on the one it reaches — that asymmetry is what makes
 *  the diagonal read as descent rather than as a bracket. */
const EXIT_DEPTH = 0.72;
const ENTRY_DEPTH = 0.22;

/** Horizontal pull on the bezier handles, as a fraction of the run. Keeps the
 *  line close to straight with an eased departure and arrival. */
const CURVE = 0.14;

/** Ceiling on |Δy| per pixel of horizontal run for a same-row connector.
 *
 *  EXIT_DEPTH and ENTRY_DEPTH describe a descent, which is what they read as
 *  when the two cards are far apart — the engagement ladder's runs are ~650px
 *  wide against an 81px drop, so nothing there is clamped. Drop the same numbers
 *  into a three-up grid and the only horizontal room is the column gutter: a
 *  36px run against a 57px drop is a slope of 1.6, and the connector renders as
 *  a slash through the copy rather than as a link between two cards. Past this
 *  ceiling both depths are eased back toward their shared midpoint until the
 *  slope fits, which flattens a cramped connector without touching a roomy one.
 *
 *  Easing the depths can only move an anchor within its own card, so it cannot
 *  close the distance between two cards in different rows. A connector still
 *  over the ceiling once eased has been asked to cross rows down a column
 *  gutter, and is routed through the gutter between the rows instead. */
const MAX_SLOPE = 0.55;

/** Breathing room, in px, added around a card before testing whether a
 *  connector would run into it. A line that shaves a card's corner is as wrong
 *  as one that crosses its middle. */
const CLEARANCE = 8;

/** Row-crossing connectors leave and arrive on horizontal edges, offset toward
 *  the direction of travel so the sweep starts and ends somewhere deliberate
 *  rather than dead-centre under the card. */
const WRAP_LEAD = 0.7;
const WRAP_TRAIL = 0.3;

/** Handle pull for the row-crossing sweep. Much stronger than CURVE: the run is
 *  most of the section's width inside a gutter a few dozen pixels tall, and weak
 *  handles there produce a kinked line rather than a curve. */
const WRAP_CURVE = 0.42;

type Point = { x: number; y: number };

type Rect = { x: number; y: number; w: number; h: number };

/** The two points a connector spans, plus how it should be drawn between them. */
type Span = { from: Point; to: Point; wrapped: boolean };

type Connector = {
  path: SVGPathElement;
  dot: SVGCircleElement;
  from: HTMLElement;
  to: HTMLElement;
  /** The latching element at each end. `from` lights the moment the line leaves it. */
  fromChip: HTMLElement;
  toChip: HTMLElement;
  length: number;
};

/**
 * Coordinates are summed up the offsetParent chain to the host rather than read
 * straight off the card, so the geometry does not depend on which ancestor
 * happens to be positioned.
 *
 * offsetLeft/offsetTop, NOT getBoundingClientRect(): the cards carry data-reveal,
 * so ScrollFX is tweening them from y:26. A rect read mid-reveal is 26px wrong
 * and the line detaches from its anchor. Offsets report the layout position and
 * ignore transforms, which removes the timing dependency outright instead of
 * papering over it with a delay.
 */
function offsetWithin(el: HTMLElement, host: HTMLElement): Point {
  let x = 0;
  let y = 0;
  let node: HTMLElement | null = el;
  // Walk the chain rather than trusting el.offsetLeft to already be host-relative:
  // any positioned element between the two silently becomes the offsetParent, and
  // then every anchor is measured against the wrong origin.
  while (node && node !== host) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return { x, y };
}

function rectOf(el: HTMLElement, host: HTMLElement): Rect {
  const at = offsetWithin(el, host);
  return { x: at.x, y: at.y, w: el.offsetWidth, h: el.offsetHeight };
}

/**
 * Does the straight run from `from` to `to` enter `rect`?
 *
 * Liang–Barsky: clip the segment against each of the rectangle's four slabs in
 * turn, narrowing the surviving parameter range. Anything left when all four are
 * done is a stretch of the segment that lies inside.
 */
function segmentHitsRect(from: Point, to: Point, rect: Rect): boolean {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const edges: Array<[number, number]> = [
    [-dx, from.x - (rect.x - CLEARANCE)],
    [dx, rect.x + rect.w + CLEARANCE - from.x],
    [-dy, from.y - (rect.y - CLEARANCE)],
    [dy, rect.y + rect.h + CLEARANCE - from.y],
  ];

  let enter = 0;
  let exit = 1;
  for (const [p, q] of edges) {
    if (p === 0) {
      // Parallel to this slab: outside it means the segment can never be inside.
      if (q < 0) return false;
      continue;
    }
    const t = q / p;
    if (p < 0) {
      if (t > exit) return false;
      if (t > enter) enter = t;
    } else {
      if (t < enter) return false;
      if (t < exit) exit = t;
    }
  }
  return enter <= exit;
}

/**
 * Where a connector leaves card A and where it meets card B.
 *
 * By default: side edges. Which edge faces which is derived from live positions
 * rather than from index, so the line always leaves the edge of A that points at
 * B and never crosses either card's content. This is the engagement ladder's
 * whole geometry — its cards alternate sides down a column, and the side-edge
 * run between two of them is clear.
 *
 * Two things send a connector through the gutter between the rows instead,
 * leaving A's bottom edge and meeting B's top edge. Either the side-edge run
 * would cut through some third card — what happens getting from the end of a
 * three-up row back to the start of the next, where every card in between is in
 * the way. Or the run is too steep to be a link at all: at the two-up
 * breakpoint the same journey is a column gutter a couple of dozen pixels wide
 * against a drop of a whole card, and threading it diagonally reads as a stray
 * vertical stroke rather than as a line going somewhere.
 *
 * Deciding this from the live rectangles rather than from a row heuristic means
 * a layout with no wrap is never touched, and a layout that wraps differently at
 * another breakpoint re-decides on its own.
 */
function spanBetween(a: HTMLElement, b: HTMLElement, host: HTMLElement, others: HTMLElement[]): Span {
  const aAt = offsetWithin(a, host);
  const bAt = offsetWithin(b, host);
  const aIsLeft = aAt.x < bAt.x;

  const fromX = aIsLeft ? aAt.x + a.offsetWidth : aAt.x;
  const toX = aIsLeft ? bAt.x : bAt.x + b.offsetWidth;

  // Flatten the descent to whatever the horizontal run can carry. See MAX_SLOPE.
  const midDepth = (EXIT_DEPTH + ENTRY_DEPTH) / 2;
  const run = Math.abs(toX - fromX);
  const rawDrop = Math.abs(
    aAt.y + a.offsetHeight * EXIT_DEPTH - (bAt.y + b.offsetHeight * ENTRY_DEPTH)
  );
  const ease = rawDrop > 0 ? Math.min(1, (run * MAX_SLOPE) / rawDrop) : 1;

  const sideFrom = {
    x: fromX,
    y: aAt.y + a.offsetHeight * (midDepth + (EXIT_DEPTH - midDepth) * ease),
  };
  const sideTo = {
    x: toX,
    y: bAt.y + b.offsetHeight * (midDepth + (ENTRY_DEPTH - midDepth) * ease),
  };

  // The gutter route runs A's bottom edge into B's top edge, which only means
  // anything when B genuinely begins on a lower row. Between two cards level
  // with each other it would draw upwards through both of them, so this is a
  // precondition on the whole branch rather than a tie-breaker inside it.
  const rowsApart = bAt.y > aAt.y + CLEARANCE;

  // The tolerance is not cosmetic: `ease` clamps the drop to exactly
  // run * MAX_SLOPE, so an exact comparison decides this case on float noise in
  // the last bit and flips connectors between the two routes at random widths.
  const tooSteep = run === 0 || Math.abs(sideFrom.y - sideTo.y) > run * MAX_SLOPE + 0.5;

  const wrapped =
    rowsApart &&
    (tooSteep ||
      others.some((other) => segmentHitsRect(sideFrom, sideTo, rectOf(other, host))));

  if (wrapped) {
    const lead = aIsLeft ? WRAP_LEAD : WRAP_TRAIL;
    const trail = aIsLeft ? WRAP_TRAIL : WRAP_LEAD;
    return {
      wrapped,
      from: { x: aAt.x + a.offsetWidth * lead, y: aAt.y + a.offsetHeight },
      to: { x: bAt.x + b.offsetWidth * trail, y: bAt.y },
    };
  }

  return { wrapped, from: sideFrom, to: sideTo };
}

/** Handles are pulled horizontally only, so the line eases out of one card edge
 *  and into the next instead of arriving at an angle. Horizontal-only handles
 *  also keep a row-crossing sweep monotonic in y, which is what confines it to
 *  the gutter. Derived from the two points, so it survives any width the layout
 *  resolves to. */
function pathFor({ from, to, wrapped }: Span): string {
  const reach = (to.x - from.x) * (wrapped ? WRAP_CURVE : CURVE);
  if (!wrapped) {
    return `M ${from.x} ${from.y} C ${from.x + reach} ${from.y}, ${to.x - reach} ${to.y}, ${to.x} ${to.y}`;
  }

  // Both handles sit on the gutter's centre line, so the sweep leaves the card
  // it is under, settles into the empty band between the rows for the whole of
  // its horizontal run, and only rises again at the far end. Handles level with
  // their own endpoints instead would keep the curve pinned to the card edges
  // for most of the run, where it clips the last line of body copy.
  const gutter = (from.y + to.y) / 2;
  return `M ${from.x} ${from.y} C ${from.x + reach} ${gutter}, ${to.x - reach} ${gutter}, ${to.x} ${to.y}`;
}

/** The target is usually a child — the engagement ladder lights a price chip.
 *  A section can also nominate the anchor itself: the agenda lights the item's
 *  own top rule, which has no inner element to hang the state on. */
function chipOf(step: HTMLElement): HTMLElement | null {
  const inner = step.querySelector<HTMLElement>("[data-connector-target]");
  if (inner) return inner;
  return step.hasAttribute("data-connector-target") ? step : null;
}

/** Each host names the width below which its cards stop being a journey. */
function minWidthOf(host: HTMLElement): string {
  const declared = Number(host.dataset.connectorsMin);
  const px = Number.isFinite(declared) && declared > 0 ? declared : DEFAULT_MIN_WIDTH;
  return `(min-width: ${px}px)`;
}

function initLadder(gsap: Gsap, ScrollTrigger: ScrollTriggerClass, host: HTMLElement): () => void {
  const noop = () => {};

  const steps = Array.from(host.querySelectorAll<HTMLElement>("[data-connector-anchor]"));
  const paths = Array.from(host.querySelectorAll<SVGPathElement>("[data-connector-path]"));
  const dots = Array.from(host.querySelectorAll<SVGCircleElement>("[data-connector-dot]"));

  // One connector per gap. Anything else means the markup and this file have
  // drifted apart, and a half-wired ladder is worse than none.
  if (steps.length < 2 || paths.length !== steps.length - 1 || dots.length !== paths.length) {
    return noop;
  }

  const connectors: Connector[] = [];
  for (let i = 0; i < paths.length; i += 1) {
    const fromChip = chipOf(steps[i]);
    const toChip = chipOf(steps[i + 1]);
    if (!fromChip || !toChip) return noop;
    connectors.push({
      path: paths[i],
      dot: dots[i],
      from: steps[i],
      to: steps[i + 1],
      fromChip,
      toChip,
      length: 0,
    });
  }

  const section = host.closest("section") ?? host;

  const measure = () => {
    for (const c of connectors) {
      const others = steps.filter((step) => step !== c.from && step !== c.to);
      c.path.setAttribute("d", pathFor(spanBetween(c.from, c.to, host, others)));
      c.length = c.path.getTotalLength();
    }
  };

  const render = (c: Connector, p: number) => {
    gsap.set(c.path, { drawSVG: `0% ${p * 100}%` });

    if (c.length > 0) {
      const point = c.path.getPointAtLength(p * c.length);
      // Written straight to the attribute. Routing this through React state
      // would re-render on every scroll frame and the dot would trail the tip.
      c.dot.setAttribute("cx", String(point.x));
      c.dot.setAttribute("cy", String(point.y));
    }
    c.dot.style.opacity = p > 0 ? "1" : "0";

    // Latched, never unset. The `from` chip is already lit for every connector
    // but the first, so this is idempotent rather than special-cased.
    if (p > 0) c.fromChip.dataset.active = "true";
    if (p >= ACTIVATE_AT) c.toChip.dataset.active = "true";
  };

  const mm = gsap.matchMedia();

  mm.add({ wide: minWidthOf(host), reduced: "(prefers-reduced-motion: reduce)" }, (context) => {
    const { wide, reduced } = (context.conditions ?? {}) as Record<string, boolean>;
    if (!wide) return;

    measure();

    if (reduced) {
      // Fully drawn, dots parked, every target lit. Same contract as the rest of
      // ScrollFX: reduced motion loses the animation, never the content.
      connectors.forEach((c) => render(c, 1));
      return;
    }

    // One scalar drives the whole ladder and each connector maps a sub-range of
    // it, so connector 1 finishes before connector 2 starts. Deriving all of them
    // from a single value every frame — rather than giving each its own tween —
    // is what makes this correct across a refresh: a tween that has already
    // completed stops firing onUpdate, so it could never correct its own dot
    // after ScrollTrigger invalidated and re-read its start value.
    const span = 1 / (connectors.length - (connectors.length - 1) * OVERLAP);
    const drive = { t: 0 };

    const paint = () => {
      connectors.forEach((c, i) => {
        const local = (drive.t - i * span * (1 - OVERLAP)) / span;
        render(c, local < 0 ? 0 : local > 1 ? 1 : local);
      });
    };

    paint();

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        end: "bottom 40%",
        scrub: 0.4,
        invalidateOnRefresh: true,
      },
    });
    timeline.to(drive, { t: 1, ease: "none", duration: 1, onUpdate: paint });

    // A path `d` computed once assumes fixed endpoints, and these grids are
    // fluid. Recompute the curves, then let ScrollTrigger re-measure against them.
    let frame = 0;
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        // Order matters: new curves first, then repaint at the progress the
        // ladder is actually at, then let ScrollTrigger re-measure. Without the
        // middle step the dots keep coordinates from the old geometry.
        measure();
        paint();
        ScrollTrigger.refresh();
      });
    });
    observer.observe(host);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  });

  return () => mm.revert();
}

/** Every ladder on the page, each with its own breakpoint and its own geometry.
 *  They share nothing but this file — a section's connectors are driven by that
 *  section's own scroll position. */
export function initConnectors(gsap: Gsap, ScrollTrigger: ScrollTriggerClass): () => void {
  const hosts = Array.from(document.querySelectorAll<HTMLElement>("[data-connectors]"));
  if (hosts.length === 0) return () => {};

  const reverts = hosts.map((host) => initLadder(gsap, ScrollTrigger, host));
  return () => reverts.forEach((revert) => revert());
}
