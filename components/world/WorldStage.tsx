"use client";

/**
 * The world.
 *
 * One canvas, sticky for the whole travel, and the page moves through it. There
 * are no sections in here and no cuts: copy arrives *inside* the frame at
 * waypoints and leaves again, and the only thing in document flow is the spacer
 * that gives the travel its length.
 *
 * It ends by landing — a single upward wipe hands the page over to paper — and
 * the world never comes back.
 */

import { useEffect, useRef } from "react";
import type { Stage } from "@/lib/content";
import type { HeroContent } from "@/lib/backend/site-content-loaders";
import { GATES, GATE_STEP_AT, RUN_ENDS_AT } from "@/lib/frontend/world";
import { CLUSTERS, COHORT, FIELD } from "@/lib/frontend/world-instance";
import { Greeting } from "./Greeting";
import {
  drawWorld,
  landingProgress,
  LANDING_FROM,
  readPalette,
  type Palette,
} from "@/lib/frontend/world-render";
import { prefersReducedMotion, registerWorld, scrollToId, subscribeScroll } from "@/lib/frontend/scroll-store";
import { subscribeTheme } from "@/lib/frontend/theme";
import styles from "./WorldStage.module.css";

/** Length of the travel, in viewport-heights. The peak owns most of it. */
export const WORLD_VH = 7.4;

interface Cue {
  from: number;
  to: number;
  rampIn?: number;
  rampOut?: number;
}

const CUES: Record<string, Cue> = {
  hero: { from: 0, to: 0.165, rampIn: 0, rampOut: 0.3 },
  field: { from: 0.15, to: 0.355, rampIn: 0.24, rampOut: 0.26 },
  // Gate 1's window opens at GATE_FIRST_AT - GATE_STEP_AT / 2 = 0.4885 (see
  // lib/world.ts), and the gates are a centred block now, same anchor as these
  // two. cost has to be fully gone before runHead starts, and runHead has to be
  // fully gone before that gate opens, or two headlines share one spot on
  // screen. Both windows are sized to land exactly on that boundary.
  cost: { from: 0.35, to: 0.44, rampIn: 0.22, rampOut: 0.28 },
  runHead: { from: 0.44, to: 0.4885, rampIn: 0.25, rampOut: 0.25 },
};

/**
 * Gate windows tile the run exactly: each stage owns one step, edge to edge,
 * and the swap at the boundary is a cut, not a fade.
 *
 * Windows that merely *abut* with fades leave a hole between every stage — a few
 * pixels of scroll with nothing on screen, seven times over. Windows that
 * overlap superimpose two headlines on the same anchor and both go illegible.
 * A cut can do neither. The incoming stage slides the last few pixels into
 * place so the change still reads as movement rather than a flicker.
 */
const GATE_SLIDE_PX = 12;
const GATE_SLIDE_PART = 0.22;

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

/**
 * Where a block's *type* ends, not where its box ends.
 *
 * The gates are centring containers now: each one spans the whole frame, so its
 * own box bottom is the bottom of the screen and measuring it would report the
 * last stage as permanently astride the wipe. The last child is the last line of
 * copy, which is the edge the landing actually has to clear.
 */
function typeBottom(node: HTMLElement): number {
  const last = node.lastElementChild as HTMLElement | null;
  if (!last) return node.offsetTop + node.offsetHeight;
  return node.offsetTop + last.offsetTop + last.offsetHeight;
}

function cueAt(t: number, cue: Cue): number {
  const { from, to } = cue;
  const span = Math.max(0.0001, to - from);
  const rampIn = (cue.rampIn ?? 0.3) * span;
  const rampOut = (cue.rampOut ?? 0.3) * span;
  if (t <= from) return rampIn === 0 && t === from ? 1 : t < from ? 0 : 1;
  if (t >= to) return 0;
  const intoIn = rampIn > 0 ? (t - from) / rampIn : 1;
  const intoOut = rampOut > 0 ? (to - t) / rampOut : 1;
  return Math.max(0, Math.min(1, intoIn, intoOut));
}

interface WorldStageProps {
  hero: HeroContent;
  pipeline: Stage[];
}

export function WorldStage({ hero, pipeline }: WorldStageProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const heroScrimRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    const copy = copyRef.current;
    if (!section || !canvas || !copy) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const stageEl = canvas.parentElement as HTMLElement;

    registerWorld(section);
    const reduced = prefersReducedMotion();
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const cueNodes = Array.from(copy.querySelectorAll<HTMLElement>("[data-cue]"));
    const arrival = copy.querySelector<HTMLElement>('[data-cue="arrival"]');

    let width = 0;
    let height = 0;
    let dpr = 1;
    let pointerX = 0;
    let pointerY = 0;
    let targetX = 0;
    let targetY = 0;

    // The canvas has no CSS of its own, so the theme is read out of the document
    // and re-read whenever it changes.
    let palette: Palette = readPalette();
    const unsubscribeTheme = subscribeTheme(() => {
      palette = readPalette();
      if (reduced) paint(0.62);
    });

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(2, window.devicePixelRatio || 1);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    // Fewer points on a phone: the frame budget is smaller and the field reads
    // dense at that width anyway.
    const budget = width < 720 ? 1600 : 4200;

    const onPointer = (e: PointerEvent) => {
      targetX = (e.clientX / window.innerWidth) * 2 - 1;
      targetY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    if (!reduced && !coarse) window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("resize", resize);

    const paint = (t: number) => {
      pointerX += (targetX - pointerX) * 0.06;
      pointerY += (targetY - pointerY) * 0.06;
      drawWorld({
        ctx,
        width,
        height,
        dpr,
        t,
        field: FIELD,
        clusters: CLUSTERS,
        cohort: COHORT,
        budget,
        palette,
        px: reduced ? 0 : pointerX,
        py: reduced ? 0 : pointerY,
      });

      // The scrim and grain belong to the world. Once the wipe starts they have
      // to go with it, or they render as a grey haze over the landed paper.
      const landed = Math.max(0, Math.min(1, (t - LANDING_FROM) / (1 - LANDING_FROM)));
      stageEl.style.setProperty("--world-veil", (1 - landed).toFixed(3));

      // Where the paper has risen to, in viewport pixels. The curve is the
      // canvas's own, not a copy of it.
      const eased = landingProgress(t);
      const wipeTop = height - height * eased;
      // The veil is clipped to the part of the frame that is still world, so it
      // never greys the paper coming up underneath it.
      stageEl.style.setProperty("--world-wipe", eased.toFixed(4));

      for (const node of cueNodes) {
        const key = node.dataset.cue as string;
        const gate = node.dataset.gate;
        let a: number;
        let slide: number | null = null;
        if (node === arrival) {
          // The arrival is ink, and ink only reads on paper. So it is not on a
          // clock at all: it fades in as the wipe edge rises through it and
          // holds to the end of the travel. Riding the edge instead put it below
          // the fold for the first half of the landing, behind the rail.
          a = clamp01((node.offsetTop + 60 - wipeTop) / 96);
        } else if (gate) {
          const index = Number(gate);
          const at = GATES[index - 1].at;
          const local = (t - (at - GATE_STEP_AT / 2)) / GATE_STEP_AT;
          if (index === GATES.length) {
            // The last stage is bone type at the foot of the frame and the paper
            // comes up underneath it, so it is not dismissed on a clock: it is
            // driven out by the approaching wipe edge. On a clock it clears the
            // screen well before the sheet has risen far enough for the arrival —
            // an empty frame at the one moment the whole travel is building to.
            // It has to be gone *before* the edge arrives, not as the edge
            // crosses it: bone type astride the wipe is dark-on-dark above the
            // line and bone-on-bone below it, and the headline reads as sliced.
            const clearance = (wipeTop - typeBottom(node)) / 70;
            a = local >= 0 ? clamp01(clearance) : 0;
          } else {
            a = local >= 0 && local < 1 ? 1 : 0;
          }
          slide = (1 - clamp01(local / GATE_SLIDE_PART)) * GATE_SLIDE_PX;
        } else {
          a = cueAt(t, CUES[key]);
        }
        node.style.opacity = a.toFixed(3);
        node.style.visibility = a < 0.01 ? "hidden" : "visible";
        const shift = node === arrival ? 0 : (slide ?? (1 - a) * 14);
        node.style.transform = shift === 0 ? "none" : `translate3d(0, ${shift.toFixed(2)}px, 0)`;
      }

      if (heroScrimRef.current) {
        heroScrimRef.current.style.opacity = cueAt(t, CUES.hero).toFixed(3);
      }

      if (countRef.current) {
        const c = cueAt(t, CUES.field);
        const shown = Math.round(200 * Math.min(1, c * 1.35));
        countRef.current.textContent = `${shown}M+`;
      }
    };

    if (reduced) {
      // No travel: one representative frame, and every cue held open so the
      // meaning survives without the motion.
      section.dataset.ready = "true";
      resize();
      paint(0.62);
      for (const node of cueNodes) {
        node.style.opacity = "1";
        node.style.transform = "none";
        node.style.visibility = "visible";
      }
      if (countRef.current) countRef.current.textContent = "200M+";
      return () => {
        window.removeEventListener("resize", resize);
        unsubscribeTheme();
        registerWorld(null);
      };
    }

    // Only now does the stage take over its own layout: everything above this
    // point renders as a plain stacked document.
    section.dataset.ready = "true";
    resize();
    paint(0);

    const unsubscribe = subscribeScroll((frame) => paint(frame.world));

    return () => {
      unsubscribe();
      unsubscribeTheme();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      delete section.dataset.ready;
      registerWorld(null);
    };
  }, []);

  return (
    <div
      className={styles.world}
      ref={sectionRef}
      style={{ ["--world-vh" as string]: `${WORLD_VH}` }}
    >
      <div className={styles.stage} data-world-stage>
        <canvas className={styles.canvas} ref={canvasRef} data-world-canvas aria-hidden="true" />
        <div className={styles.heroScrim} ref={heroScrimRef} aria-hidden="true" />
        <div className={styles.grain} aria-hidden="true" />
        <div className={styles.scrim} aria-hidden="true" />

        <div className={styles.copy} ref={copyRef} data-world-copy>
          <section className={`${styles.block} ${styles.heroAnchor}`} data-cue="hero" data-hero-actions aria-labelledby="hero-heading">
            <p className={`mono ${styles.eyebrow}`}>Pre Sales Head · Lead Generation</p>
            <h1
              className={styles.headline}
              id="hero-heading"
              aria-label="Every deal begins with hello."
            >
              {/* The trailing spaces are for assistive tech: three block spans
                  otherwise announce as one unspaced run. The accessible name is
                  fixed by aria-label above, so the greeting cycling underneath
                  never changes what a screen reader hears. */}
              <span className={styles.line}>
                <span>Every deal </span>
              </span>
              <span className={styles.line}>
                <span>begins with </span>
              </span>
              <span className={`${styles.line} ${styles.say}`}>
                <Greeting />
              </span>
            </h1>
            <p className={styles.lede}>{hero.lede}</p>

            <dl className={styles.stats}>
              {hero.stats.map((stat) => (
                <div key={stat.label} className={styles.statItem}>
                  <dt className={`${styles.statValue} tabular`}>
                    {"count" in stat && stat.count ? (
                      <span
                        data-count={stat.count.to}
                        data-count-prefix={"prefix" in stat.count ? stat.count.prefix : ""}
                        data-count-suffix={"suffix" in stat.count ? stat.count.suffix : ""}
                        data-count-decimals={"decimals" in stat.count ? stat.count.decimals : 0}
                      >
                        {stat.value}
                      </span>
                    ) : (
                      stat.value
                    )}
                  </dt>
                  <dd className={`mono ${styles.statLabel}`}>{stat.label}</dd>
                </div>
              ))}
            </dl>

            <div className={styles.actions}>
              {/* One line: the two calls to action and the jump link read as a
                  single row of choices rather than as a primary pair with an
                  afterthought under it. The assistant is no longer among them —
                  it is the page-wide dock mounted in app/layout.tsx. */}
              <div className={styles.actionRow}>
                <a
                  className={styles.primary}
                  href="#history"
                  onClick={(event) => {
                    event.preventDefault();
                    scrollToId("history");
                  }}
                >
                  Hire me
                </a>
                <a
                  className={styles.ghost}
                  href="#range"
                  onClick={(event) => {
                    event.preventDefault();
                    scrollToId("range");
                  }}
                >
                  Work with me
                </a>
                <a
                  className={styles.skipLink}
                  href="#proof"
                  onClick={(event) => {
                    event.preventDefault();
                    scrollToId("proof");
                  }}
                >
                  <span>Skip to the numbers</span>
                  <span className={styles.skipArrow} aria-hidden="true">↓</span>
                </a>
              </div>
            </div>
          </section>

          <section className={`${styles.block} ${styles.trail}`} data-cue="field" id="field">
            <p className={`mono ${styles.kicker}`}>The addressable market, honestly</p>
            <p className={styles.figure}>
              <span className="tabular" ref={countRef}>
                200M+
              </span>
            </p>
            <p className={styles.body}>
              Private companies, mapped into a sourcing database for mid-market
              origination. Every one of them is a company somebody could sell to.
              Almost none of them are worth your Tuesday.
            </p>
          </section>

          <section className={`${styles.block} ${styles.centre}`} data-cue="cost">
            <p className={styles.statement}>
              More leads is not a strategy.
              <br />
              The right leads, followed up, is.
            </p>
          </section>

          <section className={`${styles.block} ${styles.centre}`} data-cue="runHead" id="run">
            <h2 className={styles.runHeading}>So it runs like an engine.</h2>
            <p className={styles.body}>
              Eight stages, in order, each one depending on the one before it. Keep scrolling
              and it runs.
            </p>
          </section>

          <ol className={styles.gates}>
            {pipeline.map((stage, i) => (
              <li
                className={styles.gate}
                key={stage.no}
                data-cue={`gate-${stage.no}`}
                data-gate={i + 1}
              >
                    <p className={`mono ${styles.gateNo}`}>{stage.no}</p>
                <h3 className={styles.gateName}>{stage.name}</h3>
                <p className={styles.gateBody}>{stage.description}</p>
              </li>
            ))}
          </ol>

          {/* The last beat of the world, and the only copy set in ink: it fades in
              as the paper edge rises through it. The flat in/out framing is
              deliberate — the second line is what gives the eight gates above
              their weight, and it hands off to the ledger without stealing
              Proof's "that was the method" line. */}
          <section className={`${styles.block} ${styles.lead} ${styles.arrival}`} data-cue="arrival">
            <p className={styles.marks} aria-hidden="true">
              <span />
              <span />
              <span />
            </p>
            <p className={styles.statement}>
              Leads in. Meetings out.
              <br />
              <span className={styles.between}>Everything hard happens in between.</span>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export { RUN_ENDS_AT, LANDING_FROM };
