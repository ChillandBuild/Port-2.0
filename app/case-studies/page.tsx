import type { Metadata } from "next";
import { Footer } from "@/components/chrome/Footer";
import { TopNav } from "@/components/chrome/TopNav";
import { CaseStudies } from "@/components/casestudies/CaseStudies";
import { CaseStudiesGate } from "@/components/casestudies/CaseStudiesGate";
import { CASE_STUDIES } from "@/lib/content";

export const metadata: Metadata = {
  title: "Case Studies — Sampath Kumar",
  description: CASE_STUDIES.lede,
};

export default function CaseStudiesPage() {
  return (
    <>
      <TopNav forceGrounded />
      <main id="main">
        <CaseStudiesGate>
          <CaseStudies />
        </CaseStudiesGate>
      </main>
      <Footer />
    </>
  );
}