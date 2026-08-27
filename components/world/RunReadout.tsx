"use client";

/**
 * The cadence clock, rehoused.
 *
 * It used to be a bar pinned to the bottom of all sixteen screens. The campaign
 * is only meaningful while the run is on screen, so it now lives inside the
 * world, anchored diagonally opposite the stage labels, and leaves with the
 * landing wipe.
 *
 * Every figure is still a pure function of scroll position, so scrolling back up
 * still un-sends the sends and un-arrives the replies.
 */

import { useEffect, useRef } from "react";
import { campaignAt, type CampaignState } from "@/lib/campaign";
import { prefersReducedMotion, subscribeScroll } from "@/lib/scroll-store";
import { COHORT } from "@/lib/world-instance";
import styles from "./RunReadout.module.css";

const METERS: { key: keyof CampaignState; label: string }[] = [
  { key: "sourced", label: "Sourced" },
  { key: "verified", label: "Verified" },
  { key: "sent", label: "Sent" },
  { key: "replied", label: "Replied" },
  { key: "booked", label: "Booked" },
];

/** The run's own span, plus a breath either side. */
const IN_FROM = 0.44;
const IN_TO = 0.5;
const OUT_FROM = 0.9;
const OUT_TO = 0.96;

export function RunReadout() {
  const rootRef = useRef<HTMLDivElement>(null);
  const clockRef = useRef<HTMLParagraphElement>(null);
  const valueRefs = useRef<Record<string, HTMLSpanElement | null>>({});

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const previous: Record<string, string> = {};
    const write = (key: string, value: string) => {
      if (previous[key] === value) return;
      previous[key] = value;
      const node = key === "clock" ? clockRef.current : valueRefs.current[key];
      if (node) node.textContent = value;
    };

    const render = (page: number, world: number) => {
      const state = campaignAt(COHORT, page, world);
      write("clock", `Day ${state.day.toString().padStart(2, "0")} · ${state.clock} IST`);
      for (const meter of METERS) write(meter.key, String(state[meter.key]));

      const shown =
        world < IN_FROM
          ? 0
          : world < IN_TO
            ? (world - IN_FROM) / (IN_TO - IN_FROM)
            : world < OUT_FROM
              ? 1
              : Math.max(0, 1 - (world - OUT_FROM) / (OUT_TO - OUT_FROM));
      root.style.opacity = shown.toFixed(3);
      root.style.visibility = shown < 0.01 ? "hidden" : "visible";
    };

    if (prefersReducedMotion()) {
      // No travel to read, so it holds the completed run instead of nothing.
      render(1, OUT_FROM);
      root.style.opacity = "1";
      root.style.visibility = "visible";
      return;
    }

    return subscribeScroll((frame) => render(frame.page, frame.world));
  }, []);

  return (
    <div
      className={styles.readout}
      ref={rootRef}
      role="status"
      aria-label="Campaign cadence"
      data-world-readout
    >
      <p className={`mono ${styles.clock}`} ref={clockRef}>
        Day 01 · 09:10 IST
      </p>

      <dl className={styles.meters}>
        {METERS.map((meter) => (
          <div key={meter.key}>
            <dt className="mono">{meter.label}</dt>
            <dd className="tabular">
              <span
                ref={(node) => {
                  valueRefs.current[meter.key] = node;
                }}
              >
                0
              </span>
            </dd>
          </div>
        ))}
      </dl>

      <p className={`mono ${styles.note}`}>Simulated cadence</p>
    </div>
  );
}
