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
  title: "Lead Generation Strategy Course — Sampath Kumar",
  description: COURSE.lede,
};

/**
 * Never cache this route. Rendering it is what starts a time-limited grant's
 * clock, so a cached render would hand out an access window that never counts
 * down. Today the route is dynamic anyway, as a side effect of cookies() being
 * read in getCurrentCourseAccess — this makes the requirement explicit so
 * enabling cacheComponents/PPR later cannot silently void every demo grant.
 */
export const dynamic = "force-dynamic";

/**
 * The paid Lead Generation Course, its own route again (was folded into
 * /lead-generation as a single scrolling page — split back apart because
 * the transition between the free trailer and this content read as two
 * disconnected pages). The access check happens in this page — never in a
 * layout — because App Router renders page children even when a layout
 * never mounts them, which would leak course content into the RSC payload.
 * Locked/expired/revoked visitors get the sales gate; everyone else gets the
 * full documentation experience until their window closes.
 *
 * Any new <Link> pointing here must set prefetch={false}: a speculative
 * prefetch would otherwise start someone's four-hour window before they have
 * clicked. getCurrentCourseAccess also checks the prefetch headers, but that
 * is a second line of defence, not the first.
 */
export default async function CoursePage() {
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
