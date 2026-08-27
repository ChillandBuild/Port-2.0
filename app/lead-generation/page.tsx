import type { Metadata } from "next";
import { Footer } from "@/components/chrome/Footer";
import { TopNav } from "@/components/chrome/TopNav";
import { LeadGenPage } from "@/components/leadgen/LeadGenPage";
import { PointerFX } from "@/components/motion/PointerFX";
import { ScrollFX } from "@/components/motion/ScrollFX";
import { LEADGEN } from "@/lib/content";

export const metadata: Metadata = {
  title: "Lead Generation — Sampath Kumar",
  description: LEADGEN.lede,
};

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