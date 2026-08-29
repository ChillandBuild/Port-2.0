import type { Metadata } from "next";
import { Footer } from "@/components/chrome/Footer";
import { TopNav } from "@/components/chrome/TopNav";
import { PointerFX } from "@/components/motion/PointerFX";
import { ScrollFX } from "@/components/motion/ScrollFX";
import { ScheduleAgenda } from "@/components/schedule/ScheduleAgenda";
import { ScheduleContact } from "@/components/schedule/ScheduleContact";
import { ScheduleEngagement } from "@/components/schedule/ScheduleEngagement";
import { ScheduleForm } from "@/components/schedule/ScheduleForm";
import { ScheduleHero } from "@/components/schedule/ScheduleHero";
import { ScheduleTracks } from "@/components/schedule/ScheduleTracks";

export const metadata: Metadata = {
  title: "Schedule a Call — Sampath Kumar",
  description:
    "Book a free 30–45 minute strategy call with Sampath Kumar. Then a USD 350 one-hour setup session, a 45-day research window, and USD 50 per booked lead. IST (Indian Standard Time) availability.",
};

/**
 * The booking page. The offer is a ladder, so the page is one too: what the
 * free call covers, what each step costs, the two ways the engagement can run,
 * and then the ask. No world here — this is a plain document from the first
 * pixel, so the nav takes its ground immediately.
 */
export default function SchedulePage() {
  return (
    <>
      <span id="top" />
      <TopNav forceGrounded />

      <main id="main">
        <ScheduleHero />
        <ScheduleAgenda />
        <ScheduleEngagement />
        <ScheduleTracks />
        <ScheduleForm />
        <ScheduleContact />
      </main>

      <Footer />
      <ScrollFX />
      <PointerFX />
    </>
  );
}
