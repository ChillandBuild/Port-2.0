import type { Metadata } from "next";
import { Footer } from "@/components/chrome/Footer";
import { TopNav } from "@/components/chrome/TopNav";
import { Estimator } from "@/components/estimator/Estimator";
import { PointerFX } from "@/components/motion/PointerFX";
import { ScrollFX } from "@/components/motion/ScrollFX";
import { ScheduleAgenda } from "@/components/schedule/ScheduleAgenda";
import { ScheduleContact } from "@/components/schedule/ScheduleContact";
import { ScheduleCta } from "@/components/schedule/ScheduleCta";
import { ScheduleEngagement } from "@/components/schedule/ScheduleEngagement";
import { ScheduleForm } from "@/components/schedule/ScheduleForm";
import { ScheduleHero } from "@/components/schedule/ScheduleHero";
import { ScheduleTracks } from "@/components/schedule/ScheduleTracks";

export const metadata: Metadata = {
  title: "Schedule a Call — Sampath Kumar",
  description:
    "Book a free 30–45 minute strategy call with Sampath Kumar. Then a USD 350 one-time setup, a 30–45–90 day research window, USD 50 per booked meeting, and commission on closed deals. Remote — video call.",
};

/**
 * The booking page. The offer is a ladder, so the page is one too: what the
 * free call covers, what each step costs, the numbers those costs buy, the two
 * ways the engagement can run, and then the ask. The estimator sits directly
 * under the ladder because that is where the price has just been named and the
 * question becomes what it returns. No world here — this is a plain document
 * from the first pixel, so the nav takes its ground immediately.
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
        <Estimator
          eyebrow="Interactive estimator"
          heading="Model the pipeline before you book."
          body="Set a market focus and a target monthly lead volume to see the meetings, the research cycle, and the tool spend those numbers imply — the same model the call starts from."
        />
        <ScheduleTracks />
        <ScheduleCta />
        <ScheduleForm />
        <ScheduleContact />
      </main>

      <Footer />
      <ScrollFX />
      <PointerFX />
    </>
  );
}
