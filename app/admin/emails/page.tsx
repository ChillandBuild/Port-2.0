import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/backend/admin-auth";
import { EmailsForm } from "@/components/admin/EmailsForm";
import {
  getScheduleConfirmationTemplate,
  getCourseAccessEmailTemplate,
  getSchedulePaymentReceiptTemplate,
  getCourseGrantEmailTemplate,
} from "@/lib/backend/site-content-loaders";
import styles from "@/components/admin/Admin.module.css";

export const dynamic = "force-dynamic";

/** requireAdmin() runs here, not in the layout — see app/admin/page.tsx for why. */
export default async function AdminEmailsPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  const [scheduleConfirmation, courseAccess, scheduleReceipt, courseGrant] = await Promise.all([
    getScheduleConfirmationTemplate(),
    getCourseAccessEmailTemplate(),
    getSchedulePaymentReceiptTemplate(),
    getCourseGrantEmailTemplate(),
  ]);

  return (
    <main className={styles.main} id="main">
      <header className={styles.header}>
        <p className={`mono ${styles.eyebrow}`}>Email templates</p>
      </header>

      <h1 className={styles.quickHeading}>What the site emails to buyers.</h1>
      <p className={styles.hint}>
        The 4 buyer-facing emails. Internal notifications (to you) aren&rsquo;t here — they&rsquo;re plain fact
        dumps, not wording anyone edits.
      </p>

      <EmailsForm
        scheduleConfirmation={scheduleConfirmation}
        courseAccess={courseAccess}
        scheduleReceipt={scheduleReceipt}
        courseGrant={courseGrant}
      />
    </main>
  );
}
