import { Footer } from "@/components/chrome/Footer";
import { TopNav } from "@/components/chrome/TopNav";
import { Positioning } from "@/components/about/Positioning";
import { History } from "@/components/history/History";
import { FeaturedPosts } from "@/components/posts/FeaturedPosts";
import { PointerFX } from "@/components/motion/PointerFX";
import { Proof } from "@/components/proof/Proof";
import { Range } from "@/components/range/Range";
import { Reply } from "@/components/reply/Reply";
import { ScrollFX } from "@/components/motion/ScrollFX";
import { PlatformArchitecture } from "@/components/stack/PlatformArchitecture";
import { WorldStage } from "@/components/world/WorldStage";

/**
 * "Worldfall": a photograph settles into one continuous drawn world, the world
 * lands on paper, and the rest is a printed dossier.
 *
 * Order after Proof forks the read: the hero's two CTAs send a recruiter to
 * History and a client to Range, and each of those two runs gets its evidence
 * right before it — Positioning before History, Range before the stack —
 * instead of alternating between the two the whole way down. Education is
 * folded into Positioning's fact list. The estimator is no longer here: it
 * lives on /schedule under the ladder, where the cost it models is the next
 * thing on the page. The featured-posts rail precedes the closing CTA before
 * the footer.
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
        <Range />
        <PlatformArchitecture />
        <FeaturedPosts />
        <Reply />
      </main>

      <Footer />
      <ScrollFX />
      <PointerFX />
    </>
  );
}
