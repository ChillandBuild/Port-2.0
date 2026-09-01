import type { Metadata } from "next";
import { Footer } from "@/components/chrome/Footer";
import { TopNav } from "@/components/chrome/TopNav";
import { PointerFX } from "@/components/motion/PointerFX";
import { ScrollFX } from "@/components/motion/ScrollFX";
import { CourseGate } from "@/components/course/CourseGate";
import { GuidePage } from "@/components/guide/GuidePage";
import { COURSE } from "@/lib/content/course";
import { getCurrentCourseAccess } from "@/lib/backend/course-access";

export const metadata: Metadata = {
  title: "Lead Generation Course — Sampath Kumar",
  description: COURSE.lede,
};

/**
 * The paid Lead Generation Course. The access check happens in this page —
 * never in a layout — because App Router renders page children even when a
 * layout never mounts them, which would leak course content into the RSC
 * payload. Locked/expired visitors get the sales gate; enrolled buyers get
 * the full documentation experience for 30 days from payment.
 */
export default async function LeadGenerationPage() {
  const access = await getCurrentCourseAccess();

  return (
    <>
      <TopNav forceGrounded />
      <main id="main">
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
