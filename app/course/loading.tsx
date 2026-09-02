import { Footer } from "@/components/chrome/Footer";
import { TopNav } from "@/components/chrome/TopNav";
import styles from "./loading.module.css";

/**
 * Next.js shows this instantly (client-side) the moment navigation into
 * /course starts, while CoursePage awaits getCurrentCourseAccess() and,
 * for enrolled buyers, server-renders the full guide. Without this file
 * there was no Suspense fallback for that gap — the browser just sat on
 * the previous page.
 */
export default function CourseLoading() {
  return (
    <>
      <TopNav forceGrounded />
      <main id="main" className={styles.wrap}>
        <div className={styles.spinner} aria-hidden="true" />
        <p className={styles.label}>Loading the course…</p>
      </main>
      <Footer />
    </>
  );
}
