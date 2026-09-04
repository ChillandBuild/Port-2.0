import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/backend/admin-auth";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { ADMIN } from "@/lib/content/admin";
import {
  getIdentity,
  getCoursePricing,
  getSchedulePricing,
  getCourseFaq,
  getFooterContent,
  getLegalDoc,
} from "@/lib/backend/site-content-loaders";
import styles from "@/components/admin/Admin.module.css";

export const dynamic = "force-dynamic";

/**
 * requireAdmin() runs HERE, not in app/admin/layout.tsx — see the same note
 * on app/admin/page.tsx: a layout-level gate would still serialise this
 * content into the RSC payload of a signed-out request.
 */
export default async function AdminSettingsPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  const [identity, coursePricing, schedulePricing, courseFaq, footer, legalTerms, legalPrivacy, legalRefunds] =
    await Promise.all([
      getIdentity(),
      getCoursePricing(),
      getSchedulePricing(),
      getCourseFaq(),
      getFooterContent(),
      getLegalDoc("legal_terms"),
      getLegalDoc("legal_privacy"),
      getLegalDoc("legal_refunds"),
    ]);

  return (
    <main className={styles.main} id="main">
      <header className={styles.header}>
        <p className={`mono ${styles.eyebrow}`}>{ADMIN.settings.eyebrow}</p>
      </header>

      <h1 className={styles.quickHeading}>{ADMIN.settings.heading}</h1>
      <p className={styles.hint}>{ADMIN.settings.body}</p>

      <SettingsForm
        identity={identity}
        coursePricing={coursePricing}
        schedulePricing={schedulePricing}
        courseFaq={courseFaq}
        footer={footer}
        legalTerms={legalTerms}
        legalPrivacy={legalPrivacy}
        legalRefunds={legalRefunds}
      />
    </main>
  );
}
