"use client";

/**
 * Scroll behaviour for the paper half of the page.
 *
 * The world runs on its own rAF loop because it needs a camera. Everything below
 * the landing is document-shaped, so it runs on ScrollTrigger instead, wired from
 * one place off data attributes. Section components stay server components and
 * stay presentational.
 *
 * GSAP is imported dynamically, so it is not in the bundle that paints the hero.
 */

import { useEffect } from "react";

import { initConnectors } from "./connectors";

export function ScrollFX() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cleanup = () => {};
    let cancelled = false;

    (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      // DrawSVG is only used by the engagement ladder on /schedule, so it is
      // fetched only where that markup exists. Every other page pays nothing.
      const ladder = document.querySelector("[data-connectors]");
      if (ladder) {
        const { DrawSVGPlugin } = await import("gsap/DrawSVGPlugin");
        if (cancelled) return;
        gsap.registerPlugin(DrawSVGPlugin);
      }

      // Owns its own matchMedia, so it is reverted explicitly rather than by ctx.
      const revertConnectors = ladder ? initConnectors(gsap, ScrollTrigger) : () => {};

      const ctx = gsap.context(() => {
        // Entrances fire once. Content that re-hides on the way back up is a
        // defect, not an effect.
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
          const children = el.hasAttribute("data-reveal-children")
            ? Array.from(el.children)
            : [el];
          gsap.from(children, {
            opacity: 0,
            y: reduced ? 0 : 26,
            duration: reduced ? 0.3 : 0.9,
            ease: "power3.out",
            stagger: reduced ? 0 : 0.06,
            scrollTrigger: { trigger: el, start: "top 86%", once: true },
          });
        });

        gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
          const target = Number(el.dataset.count);
          if (!Number.isFinite(target)) return;
          const prefix = el.dataset.countPrefix ?? "";
          const suffix = el.dataset.countSuffix ?? "";
          const decimals = Number(el.dataset.countDecimals ?? 0);
          const obj = { n: 0 };
          gsap.to(obj, {
            n: target,
            duration: reduced ? 0 : 2.5,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 92%", toggleActions: "restart none none reverse" },
            onUpdate: () => {
              el.textContent = `${prefix}${obj.n.toLocaleString("en-US", {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals,
              })}${suffix}`;
            },
          });
        });

        gsap.utils.toArray<HTMLElement>("[data-count-range]").forEach((el) => {
          const from = Number(el.dataset.countRangeFrom ?? 0);
          const to = Number(el.dataset.countRangeTo ?? 0);
          if (!Number.isFinite(to)) return;
          const prefix = el.dataset.countPrefix ?? "";
          const suffix = el.dataset.countSuffix ?? "";
          const obj = { a: 0, b: 0 };
          gsap.to(obj, {
            a: from,
            b: to,
            duration: reduced ? 0 : 2.5,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 92%", toggleActions: "restart none none reverse" },
            onUpdate: () => {
              el.textContent = `${prefix}${Math.round(obj.a)}–${Math.round(obj.b)}${suffix}`;
            },
          });
        });

        // The chart draws itself in on every pass, same as the counters beside it.
        gsap.utils.toArray<HTMLElement>("[data-chart-draw]").forEach((wrap) => {
          const linePath = wrap.querySelector<SVGPathElement>("[data-chart-line]");
          const areaPath = wrap.querySelector<SVGPathElement>("[data-chart-area]");
          const dot = wrap.querySelector<SVGElement>("[data-chart-dot]");
          const marker = wrap.querySelector<HTMLElement>("[data-chart-marker]");
          if (!linePath) return;
          const length = linePath.getTotalLength();

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: wrap,
              start: "top 85%",
              toggleActions: "restart none none reverse",
            },
          });
          tl.fromTo(
            linePath,
            { strokeDasharray: length, strokeDashoffset: length },
            { strokeDashoffset: 0, duration: reduced ? 0 : 1.4, ease: "power2.out" },
          )
            .fromTo(
              areaPath,
              { opacity: 0 },
              { opacity: 1, duration: reduced ? 0 : 0.8, ease: "power1.out" },
              reduced ? 0 : "-=0.9",
            )
            .fromTo(
              [dot, marker].filter(Boolean),
              { opacity: 0, scale: 0.6 },
              { opacity: 1, scale: 1, duration: reduced ? 0 : 0.5, ease: "back.out(2)" },
              reduced ? 0 : "-=0.3",
            );
        });

        // Lateral travel reads as breadth. Vertical reads as argument.
        if (!reduced) {
          gsap.utils.toArray<HTMLElement>("[data-pan]").forEach((section) => {
            const track = section.querySelector<HTMLElement>("[data-pan-track]");
            if (!track) return;

            // Below 900px the rail is stacked in CSS, so there is nothing to pan.
            if (window.innerWidth < 900) return;

            const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
            if (distance() < window.innerWidth * 0.4) return; // nothing to travel: leave it as a scroll region

            gsap.to(track, {
              x: () => -distance(),
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top top",
                end: () => `+=${distance() + window.innerHeight * 0.15}`,
                pin: true,
                scrub: 0.6,
                invalidateOnRefresh: true,
                anticipatePin: 1,
              },
            });

            gsap.utils.toArray<HTMLElement>("[data-pan-item]", track).forEach((item, i) => {
              if (i === 0) return;
              gsap.from(item, {
                opacity: 0.55,
                y: 26,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: item,
                  containerAnimation: undefined,
                  start: "top 92%",
                  once: true,
                },
              });
            });
          });

          // The spine draws itself as the history passes it.
          gsap.utils.toArray<HTMLElement>("[data-spine]").forEach((spine) => {
            gsap.fromTo(
              spine,
              { scaleY: 0 },
              {
                scaleY: 1,
                ease: "none",
                transformOrigin: "top",
                scrollTrigger: {
                  trigger: spine.parentElement ?? spine,
                  start: "top 70%",
                  end: "bottom 80%",
                  scrub: 0.4,
                },
              },
            );
          });

          // The footer's wordmark is set wider than the viewport; the scroll
          // through the footer carries it across the gap. Falls back to static
          // when there is nothing to travel.
          gsap.utils.toArray<HTMLElement>("[data-drift]").forEach((el) => {
            const distance = () =>
              Math.max(0, el.scrollWidth - (el.parentElement?.clientWidth ?? window.innerWidth));
            if (!distance()) return;
            gsap.fromTo(
              el,
              { x: 0 },
              {
                x: () => -distance(),
                ease: "none",
                scrollTrigger: {
                  trigger: el.parentElement ?? el,
                  start: "top 85%",
                  end: "bottom bottom",
                  scrub: 0.5,
                  invalidateOnRefresh: true,
                },
              },
            );
          });
        }
      });

      // The world's height is set in svh and the rail measures against real
      // offsets, so a late font or image load has to re-measure everything.
      const refresh = () => ScrollTrigger.refresh();
      document.fonts?.ready.then(refresh);
      window.addEventListener("load", refresh);

      // Safety net. A reveal that never fires is content lost: opacity 0 has
      // no fallback. So anything the reveal system still holds hidden once it
      // has entered the viewport is force-revealed here — the triggers stay
      // in charge of the animation, this only catches what they drop.
      let queued = false;
      const revealStragglers = () => {
        queued = false;
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
          if (
            el.getBoundingClientRect().top < window.innerHeight &&
            getComputedStyle(el).opacity === "0"
          ) {
            gsap.set(el, { clearProps: "opacity,transform" });
          }
        });
      };
      const queueRevealCheck = () => {
        if (!queued) {
          queued = true;
          requestAnimationFrame(revealStragglers);
        }
      };
      window.addEventListener("scroll", queueRevealCheck, { passive: true });
      window.addEventListener("resize", queueRevealCheck, { passive: true });

      cleanup = () => {
        window.removeEventListener("load", refresh);
        window.removeEventListener("scroll", queueRevealCheck);
        window.removeEventListener("resize", queueRevealCheck);
        revertConnectors();
        ctx.revert();
      };
    })();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  return null;
}
