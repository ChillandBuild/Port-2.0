import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/backend/admin-auth";
import { ChapterEditor } from "@/components/admin/ChapterEditor";
import { COURSE_CHAPTER_KEYS, getGuideChapter } from "@/lib/backend/site-content-loaders";
import styles from "@/components/admin/Admin.module.css";

export const dynamic = "force-dynamic";

/** requireAdmin() runs here, not in the layout — see app/admin/page.tsx for why. */
export default async function AdminCoursePage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  const chapters = await Promise.all(COURSE_CHAPTER_KEYS.map((_, i) => getGuideChapter(i)));

  return (
    <main className={styles.main} id="main">
      <header className={styles.header}>
        <p className={`mono ${styles.eyebrow}`}>Course</p>
        <form action="/api/admin/logout" method="post">
          <button className={styles.signOut} type="submit">
            Sign out
          </button>
        </form>
      </header>

      <h1 className={styles.quickHeading}>The 9-chapter course, editable.</h1>
      <p className={styles.hint}>
        Each chapter saves on its own. Section ids are a stable interface — renaming one loses that section&rsquo;s
        reading-history for anyone who already read it.
      </p>

      <div className={styles.settingsSections}>
        {chapters.map((chapter, i) => (
          <ChapterEditor key={COURSE_CHAPTER_KEYS[i]} chapterKey={COURSE_CHAPTER_KEYS[i]} initial={chapter} />
        ))}
      </div>
    </main>
  );
}
