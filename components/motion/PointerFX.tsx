"use client";

/**
 * Wires the pointer engine to whatever the markup asks for.
 *
 * Sections declare what they want with data attributes and stay server
 * components. Everything registered here is gated to a real hovering pointer and
 * off under reduced motion, so this layer simply does not exist on a phone or
 * for a reader who asked for less movement.
 */

import { useEffect } from "react";
import { registerPointerTargets, supportsPointerFX, type PointerTarget } from "@/lib/pointer";

export function PointerFX() {
  useEffect(() => {
    if (!supportsPointerFX()) return;

    const collect = (selector: string, make: (el: HTMLElement) => PointerTarget) =>
      Array.from(document.querySelectorAll<HTMLElement>(selector)).map(make);

    const targets: PointerTarget[] = [
      ...collect("[data-spot]", (el) => ({ el, spot: true })),
      ...collect("[data-tilt]", (el) => ({ el, tilt: Number(el.dataset.tilt) || 6 })),
      ...collect("[data-magnet]", (el) => ({ el, magnet: Number(el.dataset.magnet) || 0.24 })),
    ];

    if (targets.length === 0) return;
    return registerPointerTargets(targets);
  }, []);

  return null;
}
