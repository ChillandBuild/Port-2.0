import { Footer } from "@/components/chrome/Footer";
import { TopNav } from "@/components/chrome/TopNav";
import { Positioning } from "@/components/about/Positioning";
import { Education } from "@/components/education/Education";
import { Estimator } from "@/components/estimator/Estimator";
import { History } from "@/components/history/History";
import { PointerFX } from "@/components/motion/PointerFX";
import { FeaturedPosts } from "@/components/posts/FeaturedPosts";
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
        <Positioning />
        <History />
        <Education />
        <Range />
        <FeaturedPosts />
        <Estimator />
        <Terms />
        <Reply />
      </main>

      <Footer />
      <ScrollFX />
      <PointerFX />
    </>
  );
}
