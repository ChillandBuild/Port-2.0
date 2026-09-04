import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/backend/admin-auth";
import { AvailabilityManager } from "@/components/admin/AvailabilityManager";
import styles from "@/components/admin/Admin.module.css";

export const dynamic = "force-dynamic";

/** requireAdmin() runs here, not in the layout — see app/admin/page.tsx for why. */
export default async function AdminAvailabilityPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  return (
    <main className={styles.main} id="main">
      <header className={styles.header}>
        <p className={`mono ${styles.eyebrow}`}>Availability</p>
      </header>

      <h1 className={styles.quickHeading}>Open slots for the schedule page.</h1>
      <p className={styles.hint}>
        Only dates and times added here show as bookable on /schedule — both the free call and the paid second call
        draw from the same list.
      </p>

      <AvailabilityManager />
    </main>
  );
}
