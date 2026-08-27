import type { Metadata } from "next";
import { Footer } from "@/components/chrome/Footer";
import { TopNav } from "@/components/chrome/TopNav";
import { PointerFX } from "@/components/motion/PointerFX";
import { ScrollFX } from "@/components/motion/ScrollFX";
import { ScheduleContact } from "@/components/schedule/ScheduleContact";
import { ScheduleHero } from "@/components/schedule/ScheduleHero";

export const metadata: Metadata = {
  title: "Schedule a Call — Sampath Kumar",
  description:
    "Book a free 30–45 minute strategy call with Sampath Kumar, followed by a USD 350 one-hour setup session. IST (Indian Standard Time) availability.",
};

/**
 * The dedicated booking page. A free strategy call first, a paid setup
 * session second — the current live offer, which superseded this site's
 * original single $350 session. No world here: this is a plain document from
 * the first pixel, so the nav takes its ground immediately.
 */
export default function SchedulePage() {
  return (
    <>
      <span id="top" />
      <TopNav forceGrounded />

      <main id="main">
        <ScheduleHero />
        <ScheduleContact />
      </main>

      <Footer />
      <ScrollFX />
      <PointerFX />
    </>
  );
}
