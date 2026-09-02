import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { requireAdmin } from "@/lib/backend/admin-auth";
import { ADMIN } from "@/lib/content/admin";
import styles from "@/components/admin/Admin.module.css";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  // Already signed in and allowlisted — no reason to show the form again.
  const admin = await requireAdmin();
  if (admin) redirect("/admin");

  return (
    <main className={styles.loginMain} id="main">
      <section className={styles.loginCard} aria-labelledby="admin-login-title">
        <p className={`mono ${styles.eyebrow}`}>{ADMIN.login.eyebrow}</p>
        <h1 className={styles.loginHeading} id="admin-login-title">
          {ADMIN.login.heading}
        </h1>
        <p className={styles.loginBody}>{ADMIN.login.body}</p>
        <LoginForm />
      </section>
    </main>
  );
}
