import { Footer } from "@/components/chrome/Footer";
import { TopNav } from "@/components/chrome/TopNav";
import { History } from "@/components/history/History";
import { PointerFX } from "@/components/motion/PointerFX";
import { Proof } from "@/components/proof/Proof";
import { Range } from "@/components/range/Range";
import { Reply } from "@/components/reply/Reply";
import { ScrollFX } from "@/components/motion/ScrollFX";
import { Terms } from "@/components/terms/Terms";
import { WorldStage } from "@/components/world/WorldStage";

/**
 * "Worldfall": a photograph settles into one continuous drawn world, the world
 * lands on paper, and the rest is a printed dossier.
 */
export default function HomePage() {
  return (
    <>
      <span id="top" />
      <TopNav />

      <main id="main">
        <WorldStage />
        <Proof />
        <History />
        <Range />
        <Terms />
        <Reply />
      </main>

      <Footer />
      <ScrollFX />
      <PointerFX />
    </>
  );
}
