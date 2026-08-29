/**
 * The engagement ladder's connectors.
 *
 * A line draws itself from one phase to the next as the section scrolls, with a
 * dot riding the growing tip. When the dot lands, that phase's price chip fills
 * in — and stays filled, because scrolling back up rewinds the line but you do
 * not un-reach a step you have reached.
 *
 * Lives outside ScrollFX on purpose: ScrollFX is a router for the whole paper
 * half of the site, and this is one section's worth of geometry.
 */

type Gsap = typeof import("gsap").gsap;
type ScrollTriggerClass = typeof import("gsap/ScrollTrigger").ScrollTrigger;

/** Matches the four-up breakpoint in ScheduleEngagement.module.css. Below it the
 *  phases stack, so there is no left-to-right journey to trace. */
const WIDE = "(min-width: 1024px)";

/** Progress at which the destination phase latches on. Deliberately not 1: the
 *  chip should light as the dot arrives, not a frame after it has stopped. */
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

type Point = { x: number; y: number };

type Connector = {
  path: SVGPathElement;
  dot: SVGCircleElement;
  from: HTMLElement;
  to: HTMLElement;
  /** The price chips at each end. `from` lights the moment the line leaves it. */
  fromChip: HTMLElement;
  toChip: HTMLElement;
  length: number;
};

/**
 * The two points a connector spans: where it leaves card A and where it meets
 * card B. The cards alternate sides, so which edge faces which is derived from
 * their live positions rather than from their index — the line always leaves the
 * edge of A that points at B, and never crosses either card's content.
 *
 * Coordinates are summed up the offsetParent chain to the host rather than read
 * straight off the card, so the geometry does not depend on which ancestor
 * happens to be positioned.
 *
 * offsetLeft/offsetTop, NOT getBoundingClientRect(): .step carries data-reveal,
 * so ScrollFX is tweening it from y:26. A rect read mid-reveal is 26px wrong and
 * the line detaches from its anchor. Offsets report the layout position and
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

function edgesBetween(a: HTMLElement, b: HTMLElement, host: HTMLElement): { from: Point; to: Point } {
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

/** Handles are pulled horizontally only, so the line eases out of one card edge
 *  and into the next instead of arriving at an angle. Derived from the two
 *  points, so it survives any width the layout resolves to. */
function pathBetween(a: Point, b: Point): string {
  const reach = (b.x - a.x) * CURVE;
  return `M ${a.x} ${a.y} C ${a.x + reach} ${a.y}, ${b.x - reach} ${b.y}, ${b.x} ${b.y}`;
}

function chipOf(step: HTMLElement): HTMLElement | null {
  return step.querySelector<HTMLElement>("[data-connector-target]");
}

export function initConnectors(gsap: Gsap, ScrollTrigger: ScrollTriggerClass): () => void {
  const noop = () => {};
  const host = document.querySelector<HTMLElement>("[data-connectors]");
  if (!host) return noop;

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
      const { from, to } = edgesBetween(c.from, c.to, host);
      c.path.setAttribute("d", pathBetween(from, to));
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

  mm.add({ wide: WIDE, reduced: "(prefers-reduced-motion: reduce)" }, (context) => {
    const { wide, reduced } = (context.conditions ?? {}) as Record<string, boolean>;
    if (!wide) return;

    measure();

    if (reduced) {
      // Fully drawn, dots parked, every chip lit. Same contract as the rest of
      // ScrollFX: reduced motion loses the animation, never the content.
      connectors.forEach((c) => render(c, 1));
      return;
    }

    // One scalar drives the whole ladder and each connector maps a sub-range of
    // it, so connector 1 finishes before connector 2 starts. Deriving all three
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

    // A path `d` computed once assumes fixed endpoints, and this grid is fluid.
    // Recompute the curves, then let ScrollTrigger re-measure against them.
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
