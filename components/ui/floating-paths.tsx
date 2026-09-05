"use client";

import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

const DEFAULT_PATH_COUNT = 20;
const MIN_STROKE_OPACITY = 0.12;
const MAX_STROKE_OPACITY = 0.55;
const MIN_STROKE_WIDTH = 0.5;
const MAX_STROKE_WIDTH = 1.4;

/** Artwork space. Lines are drawn past every edge so nothing terminates on screen. */
const VIEW_W = 696;
const VIEW_H = 316;
const BLEED = 60;
/** Horizontal rise of one line from bottom edge to top edge. Sets the diagonal angle. */
const DIAGONAL_RUN = 420;

const BASE_DURATION_S = 14;
const DURATION_SPREAD_S = 10;

/** Deterministic 0..1 spread per index. Math.random() would mismatch on hydration. */
function jitter(index: number) {
  return (Math.sin(index * 12.9898) + 1) / 2;
}

/**
 * Parallel diagonals sweeping across the full artwork, bottom edge to top edge.
 * `direction` -1 leans up-right, 1 leans up-left.
 */
function buildPaths(direction: number, count: number) {
  const run = DIAGONAL_RUN * -direction;
  // Start far enough off-canvas that the skewed band still covers the near edge.
  const spanStart = Math.min(0, -run) - BLEED;
  const spanEnd = VIEW_W + Math.max(0, -run) + BLEED;
  const step = count > 1 ? (spanEnd - spanStart) / (count - 1) : 0;

  return Array.from({ length: count }, (_, i) => {
    const t = count > 1 ? i / (count - 1) : 1;
    const x = spanStart + i * step;
    const bottom = VIEW_H + BLEED;
    const top = -BLEED;

    return {
      id: i,
      // Gentle bow so the field reads as drawn, not as a hatch pattern.
      d: `M${x} ${bottom} C${x + run * 0.28} ${bottom * 0.68} ${x + run * 0.72} ${
        bottom * 0.32
      } ${x + run} ${top}`,
      opacity: MIN_STROKE_OPACITY + t * (MAX_STROKE_OPACITY - MIN_STROKE_OPACITY),
      width: MIN_STROKE_WIDTH + t * (MAX_STROKE_WIDTH - MIN_STROKE_WIDTH),
      duration: BASE_DURATION_S + jitter(i) * DURATION_SPREAD_S,
      delay: -jitter(i * 3) * DURATION_SPREAD_S,
    };
  });
}

export function FloatingPathsBackground({
  position,
  children,
  className,
  count = DEFAULT_PATH_COUNT,
  color = "currentColor",
  /** Visible fraction of each line. The lit segment travels; the rest is gap. */
  segment = 0.4,
}: {
  position: number;
  className?: string;
  children: React.ReactNode;
  /** Number of stroked paths. Lower is cheaper; each path repaints every frame. */
  count?: number;
  /** Stroke colour. Scoped to the SVG so it never leaks into `children`. */
  color?: string;
  segment?: number;
}) {
  const prefersReducedMotion = useReducedMotion();
  const paths = buildPaths(position, count);

  return (
    <div className={cn("w-full relative", className)}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true" style={{ color }}>
        <svg
          className="w-full h-full text-current"
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          preserveAspectRatio="xMidYMid slice"
          fill="none"
        >
          {paths.map((path) => (
            <motion.path
              key={path.id}
              d={path.d}
              stroke="currentColor"
              strokeWidth={path.width}
              strokeOpacity={path.opacity}
              strokeLinecap="round"
              initial={{ pathLength: prefersReducedMotion ? 1 : segment, pathOffset: 0 }}
              animate={prefersReducedMotion ? { pathOffset: 0 } : { pathOffset: 1 }}
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : {
                      duration: path.duration,
                      delay: path.delay,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }
              }
            />
          ))}
        </svg>
      </div>
      {children}
    </div>
  );
}
