/**
 * Scroll-drawn connectors.
 *
 * A line draws itself from one item to the next as its section scrolls, with a
 * dot riding the growing tip. When the dot lands, that item's target element
 * latches on — and stays on, because scrolling back up rewinds the line but you
 * do not un-reach a step you have reached.
 *
 * Two sections use this, and they want different geometry, named by the host via
 * data-connector-shape:
 *
 *   "edge" (default) — the engagement ladder. One card per row, alternating
 *   sides, so a connector leaves the side edge of A that faces B and meets the
 *   facing edge of B. Long diagonal runs across open ground.
 *
 *   "rule" — the agenda. A wrapped grid whose items are columns of prose under a
 *   hairline rule, so a connector is a shallow arc riding that rule band from one
 *   item's midpoint to the next. Pairs that straddle a row break draw nothing:
 *   see ruleSpan.
 *
 * Lives outside ScrollFX on purpose: ScrollFX is a router for the whole paper
 * half of the site, and this is a couple of sections' worth of geometry.
 */

type Gsap = typeof import("gsap").gsap;
type ScrollTriggerClass = typeof import("gsap/ScrollTrigger").ScrollTrigger;

/** Fallback for a host that does not name its own breakpoint. Matches the
 *  breakpoint in ScheduleEngagement.module.css: below it the phases stack, so
 *  there is no journey to trace. */
const DEFAULT_MIN_WIDTH = 1024;

/** Progress at which the destination item latches on. Deliberately not 1: the
 *  target should light as the dot arrives, not a frame after it has stopped. */
const ACTIVATE_AT = 0.9;

/** Fraction of a segment that adjacent connectors share. A hard handoff between
 *  two scrubbed tweens reads as a stutter. */
const OVERLAP = 0.1;

/** "edge" shape. Where on a card's height the line leaves and arrives, as a
 *  fraction. Low on the card it leaves, high on the one it reaches — that
 *  asymmetry is what makes the diagonal read as descent rather than a bracket. */
const EXIT_DEPTH = 0.72;
const ENTRY_DEPTH = 0.22;

/** "edge" shape. Horizontal pull on the bezier handles, as a fraction of the
 *  run. Keeps the line close to straight with an eased departure and arrival. */
const CURVE = 0.14;

/** "rule" shape. How far the arc rises above the rule band, in px, and the
 *  handle pull that gets it there. The bow is what separates the connector from
 *  the hairline it rides — draw it flat and it reads as the rule itself. */
const BOW = 26;
const RULE_CURVE = 0.35;

/** Vertical slack, in px, before two items count as being on different rows.
 *  Items in one row share a top edge, so anything past a hairline of rounding is
 *  a genuine row break. */
const CLEARANCE = 8;

type Point = { x: number; y: number };

/** The two points a connector spans. */
type Span = { from: Point; to: Point };

type Connector = {
  path: SVGPathElement;
  dot: SVGCircleElement;
  from: HTMLElement;
  to: HTMLElement;
  /** The latching element at each end. `from` lights the moment the line leaves it. */
  fromChip: HTMLElement;
  toChip: HTMLElement;
  length: number;
  /** Set by measure(): this pair has no drawable run at the current layout. */
  dormant: boolean;
};

/**
 * Coordinates are summed up the offsetParent chain to the host rather than read
 * straight off the element, so the geometry does not depend on which ancestor
 * happens to be positioned.
 *
 * offsetLeft/offsetTop, NOT getBoundingClientRect(): the items carry data-reveal,
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

/**
 * "edge" shape. Which side faces which is derived from live positions rather
 * than from index, so the line always leaves the edge of A that points at B and
 * never crosses either card's content.
 */
function edgeSpan(a: HTMLElement, b: HTMLElement, host: HTMLElement): Span {
  const aAt = offsetWithin(a, host);
  const bAt = offsetWithin(b, host);
  const aIsLeft = aAt.x < bAt.x;
  return {
    from: {
      x: aIsLeft ? aAt.x + a.offsetWidth : aAt.x,
      y: aAt.y + a.offsetHeight * EXIT_DEPTH,
    },
    to: {
      x: aIsLeft ? bAt.x : bAt.x + b.offsetWidth,
      y: bAt.y + b.offsetHeight * ENTRY_DEPTH,
    },
  };
}

/**
 * "rule" shape. Both anchors sit on the midpoint of an item's top rule, so the
 * arc rides the band the hairlines already occupy and never enters the copy.
 *
 * Returns null when the two items are on different rows. Getting from the end of
 * one row back to the start of the next means travelling the section's whole
 * width backwards, and there is no route for that which does not cut across the
 * grid — a sweep through the gutter reads as a slash through the middle of the
 * section, which is the thing this shape exists to avoid. The pair draws nothing
 * instead; reading order already carries the eye to the next row, and the items
 * still latch (see paint()). Decided from live positions, so a breakpoint that
 * wraps differently re-decides for free.
 */
function ruleSpan(a: HTMLElement, b: HTMLElement, host: HTMLElement): Span | null {
  const aAt = offsetWithin(a, host);
  const bAt = offsetWithin(b, host);
  if (bAt.y > aAt.y + CLEARANCE) return null;
  return {
    from: { x: aAt.x + a.offsetWidth / 2, y: aAt.y },
    to: { x: bAt.x + b.offsetWidth / 2, y: bAt.y },
  };
}

/** Horizontal-only handles, so the line eases out of one anchor and into the
 *  next instead of arriving at an angle. Derived from the two points, so it
 *  survives any width the layout resolves to. */
function edgePath({ from, to }: Span): string {
  const reach = (to.x - from.x) * CURVE;
  return `M ${from.x} ${from.y} C ${from.x + reach} ${from.y}, ${to.x - reach} ${to.y}, ${to.x} ${to.y}`;
}

/** Both handles are lifted by the same bow, so the arc leaves and meets the rule
 *  level with it and peaks in the middle. */
function rulePath({ from, to }: Span): string {
  const reach = (to.x - from.x) * RULE_CURVE;
  return `M ${from.x} ${from.y} C ${from.x + reach} ${from.y - BOW}, ${to.x - reach} ${to.y - BOW}, ${to.x} ${to.y}`;
}

/** The target is usually a child — the engagement ladder lights a price chip.
 *  A section can also nominate the anchor itself: the agenda lights the item's
 *  own number. */
function chipOf(step: HTMLElement): HTMLElement | null {
  const inner = step.querySelector<HTMLElement>("[data-connector-target]");
  if (inner) return inner;
  return step.hasAttribute("data-connector-target") ? step : null;
}

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

  const shape = host.dataset.connectorShape === "rule" ? "rule" : "edge";

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
      dormant: false,
    });
  }

  const section = host.closest("section") ?? host;

  const measure = () => {
    for (const c of connectors) {
      const span = shape === "rule" ? ruleSpan(c.from, c.to, host) : edgeSpan(c.from, c.to, host);
      c.dormant = span === null;

      if (!span) {
        // No geometry at all, rather than a zero-length path: an empty `d` keeps
        // getTotalLength() from reporting a stale length from the last layout.
        c.path.removeAttribute("d");
        c.length = 0;
        c.dot.style.opacity = "0";
        continue;
      }

      c.path.setAttribute("d", shape === "rule" ? rulePath(span) : edgePath(span));
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
    //
    // The card itself (c.from/c.to) is latched alongside its chip, not only the
    // chip: on the engagement ladder the chip is a descendant of the card, so a
    // card-level glow keyed to :hover alone never fires on arrival — the pointer
    // is not there. Where chip and card are the same element (the agenda), this
    // is a harmless repeat of the same write.
    if (p > 0) {
      c.fromChip.dataset.active = "true";
      c.from.dataset.active = "true";
    }
    if (p >= ACTIVATE_AT) {
      c.toChip.dataset.active = "true";
      c.to.dataset.active = "true";
    }
  };

  /** Sub-ranges are shared out across drawable connectors only. Giving a dormant
   *  pair a slice of the scroll would buy a stretch where the section is being
   *  scrolled and nothing at all is moving. */
  const paint = (t: number) => {
    const live = connectors.filter((c) => !c.dormant);

    if (live.length > 0) {
      const span = live.length === 1 ? 1 : 1 / (live.length - (live.length - 1) * OVERLAP);
      live.forEach((c, i) => {
        const local = (t - i * span * (1 - OVERLAP)) / span;
        render(c, local < 0 ? 0 : local > 1 ? 1 : local);
      });
    }

    // A dormant pair still spans two real items, and the row break it straddles
    // is not a reason for the item after it to stay dark — at the two-up
    // breakpoint the last item is reached only across a break, so without this
    // it would never light at all. Treated as instantaneous: the tail lights as
    // soon as the head is lit. Document order, so a run of them chains.
    for (const c of connectors) {
      if (c.dormant && c.fromChip.dataset.active === "true") {
        c.toChip.dataset.active = "true";
      }
    }
  };

  const mm = gsap.matchMedia();

  mm.add({ wide: minWidthOf(host), reduced: "(prefers-reduced-motion: reduce)" }, (context) => {
    const { wide, reduced } = (context.conditions ?? {}) as Record<string, boolean>;
    if (!wide) return;

    measure();

    if (reduced) {
      // Fully drawn, dots parked, every target lit. Same contract as the rest of
      // ScrollFX: reduced motion loses the animation, never the content.
      paint(1);
      return;
    }

    // One scalar drives the whole ladder and each connector maps a sub-range of
    // it, so connector 1 finishes before connector 2 starts. Deriving all of them
    // from a single value every frame — rather than giving each its own tween —
    // is what makes this correct across a refresh: a tween that has already
    // completed stops firing onUpdate, so it could never correct its own dot
    // after ScrollTrigger invalidated and re-read its start value.
    const drive = { t: 0 };
    const repaint = () => paint(drive.t);

    repaint();

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        end: "bottom 40%",
        scrub: 0.4,
        invalidateOnRefresh: true,
      },
    });
    timeline.to(drive, { t: 1, ease: "none", duration: 1, onUpdate: repaint });

    // A path `d` computed once assumes fixed endpoints, and these grids are
    // fluid. Recompute the curves, then let ScrollTrigger re-measure against them.
    let frame = 0;
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        // Order matters: new curves first, then repaint at the progress the
        // ladder is actually at, then let ScrollTrigger re-measure. Without the
        // middle step the dots keep coordinates from the old geometry. measure()
        // also re-decides which pairs are dormant, so a resize that rewraps the
        // grid redistributes the sub-ranges on the next repaint.
        measure();
        repaint();
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
