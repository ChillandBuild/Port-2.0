import type { Metadata } from "next";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import styles from "@/components/admin/Admin.module.css";

export const metadata: Metadata = {
  title: "Admin — Sampath Kumar",
  // Never index the console, and never follow out of it.
  robots: { index: false, follow: false },
};

/**
 * Chrome only — deliberately NO auth check here.
 *
 * App Router renders page children even when a layout never mounts them, so a
 * gate placed in a layout would still put the grants list (recipient emails,
 * company names, reading history) into the RSC payload for a signed-out
 * visitor. Every admin page performs its own requireAdmin() for that reason.
 * This mirrors the same constraint documented on app/course/page.tsx.
 *
 * AdminSidebar is chrome only too — it renders for a signed-out visitor, but
 * carries no data, just static nav labels and the current path — and it
 * suppresses itself entirely on /admin/login.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.shell}>
      <div className={styles.frame}>
        <AdminSidebar />
        <div className={styles.document}>{children}</div>
      </div>
    </div>
  );
}
