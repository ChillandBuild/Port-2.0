import type { Metadata } from "next";
import { Footer } from "@/components/chrome/Footer";
import { TopNav } from "@/components/chrome/TopNav";
import { PointerFX } from "@/components/motion/PointerFX";
import { ScrollFX } from "@/components/motion/ScrollFX";
import { LeadGenPage } from "@/components/leadgen/LeadGenPage";
import { LEADGEN } from "@/lib/content";

export const metadata: Metadata = {
  title: "Lead Generation — Sampath Kumar",
  description: LEADGEN.lede,
};

/**
 * /lead-generation: the free process overview — what lead generation means
 * here and the eight-stage pipeline. The paid course lives at its own route,
 * /course, not stacked under this one; the two used to share this URL and
 * the transition between them (a second "hero" appearing after a large gap)
 * read as two disconnected pages, so they were split back apart.
 */
export default function LeadGenerationPage() {
  return (
    <>
      <TopNav forceGrounded />
      <main id="main">
        <LeadGenPage />
      </main>
      <Footer />
      <ScrollFX />
      <PointerFX />
    </>
  );
}
