/**
 * The scripting-capability flag, resolved before first paint.
 *
 * Several surfaces — the world above all — ship a no-JS fallback layout that is
 * real and must never be permanently hidden. The mistake is gating that
 * fallback on a signal that only arrives *after* hydration: the browser then
 * paints the fallback first and swaps to the real layout a second or two later,
 * which reads as the page loading broken and then repairing itself.
 *
 * "Will script run at all" is knowable synchronously, in the head, before a
 * single pixel is painted — that is exactly what this is. The fallback stays
 * gated on the absence of this flag, so a browser with scripting off still gets
 * the stacked document and nothing is hidden behind state that never resolves.
 *
 * Distinct from `data-ready`, which the world sets once its canvas has a frame
 * on it. That one is genuinely post-hydration and stays that way.
 */
export const JS_BOOT_SCRIPT = `document.documentElement.dataset.js='true'`;
