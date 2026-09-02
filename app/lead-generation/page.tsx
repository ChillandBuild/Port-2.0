import type { Metadata } from "next";
import { Footer } from "@/components/chrome/Footer";
import { TopNav } from "@/components/chrome/TopNav";
import { PointerFX } from "@/components/motion/PointerFX";
import { ScrollFX } from "@/components/motion/ScrollFX";
import { CourseGate } from "@/components/course/CourseGate";
import { GuidePage } from "@/components/guide/GuidePage";
import { LeadGenPage } from "@/components/leadgen/LeadGenPage";
import { LEADGEN } from "@/lib/content";
import { getCurrentCourseAccess } from "@/lib/backend/course-access";

export const metadata: Metadata = {
  title: "Lead Generation Course — Sampath Kumar",
  description: LEADGEN.lede,
};

/**
 * /lead-generation: the free process page as a trailer, with the paid
 * course directly below it on the same URL. The access check happens in
 * this page — never in a layout — because App Router renders page children
 * even when a layout never mounts them, which would leak course content
 * into the RSC payload. Locked/expired visitors get the sales gate below
 * the trailer; enrolled buyers get the full documentation experience for
 * 30 days from payment.
 */
export default async function LeadGenerationPage() {
  const access = await getCurrentCourseAccess();

  return (
    <>
      <TopNav forceGrounded />
      <main id="main">
        <LeadGenPage />
        {access.state === "valid" ? (
          <GuidePage />
        ) : (
          <CourseGate state={access.state} />
        )}
      </main>
      <Footer />
      <ScrollFX />
      <PointerFX />
    </>
  );
}
