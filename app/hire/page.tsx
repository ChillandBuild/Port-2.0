import type { Metadata } from "next";
import { Footer } from "@/components/chrome/Footer";
import { TopNav } from "@/components/chrome/TopNav";
import { HirePage } from "@/components/hire/HirePage";
import { PointerFX } from "@/components/motion/PointerFX";
import { ScrollFX } from "@/components/motion/ScrollFX";
import { HIRE } from "@/lib/content";

export const metadata: Metadata = {
  title: "Hire — Sampath Kumar",
  description: HIRE.lede,
};

export default function Hire() {
  return (
    <>
      <TopNav forceGrounded />
      <main id="main">
        <HirePage />
      </main>
      <Footer />
      <ScrollFX />
      <PointerFX />
    </>
  );
}
