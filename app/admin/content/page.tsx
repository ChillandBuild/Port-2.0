import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/backend/admin-auth";
import { ContentForm } from "@/components/admin/ContentForm";
import {
  getHero,
  getPipeline,
  getSectors,
  getLedger,
  getAbout,
  getVideoTeaser,
  getRoles,
  getToolGroups,
  getPosts,
  getCaseStudyEntries,
} from "@/lib/backend/site-content-loaders";
import styles from "@/components/admin/Admin.module.css";

export const dynamic = "force-dynamic";

/** requireAdmin() runs here, not in the layout — see app/admin/page.tsx for why. */
export default async function AdminContentPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  const [hero, pipeline, sectors, ledger, about, videoTeaser, roles, toolGroups, posts, caseStudies] =
    await Promise.all([
      getHero(),
      getPipeline(),
      getSectors(),
      getLedger(),
      getAbout(),
      getVideoTeaser(),
      getRoles(),
      getToolGroups(),
      getPosts(),
      getCaseStudyEntries(),
    ]);

  return (
    <main className={styles.main} id="main">
      <header className={styles.header}>
        <p className={`mono ${styles.eyebrow}`}>Marketing content</p>
      </header>

      <h1 className={styles.quickHeading}>Everything else on the site.</h1>
      <p className={styles.hint}>
        Prices, contact info and legal pages live under Settings — this is the rest: hero stats, pipeline, sectors,
        proof numbers, about copy, work history, tool stack, LinkedIn posts and case studies.
      </p>

      <ContentForm
        hero={hero}
        pipeline={pipeline}
        sectors={sectors}
        ledger={ledger}
        about={about}
        videoTeaser={videoTeaser}
        roles={roles}
        toolGroups={toolGroups}
        posts={posts}
        caseStudies={caseStudies}
      />
    </main>
  );
}
