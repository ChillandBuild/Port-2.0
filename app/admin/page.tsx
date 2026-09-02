import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { GrantRow } from "@/components/admin/GrantRow";
import { QuickGrant } from "@/components/admin/QuickGrant";
import { requireAdmin } from "@/lib/backend/admin-auth";
import { listGrants, type GrantRow as GrantRecord } from "@/lib/backend/course-grants";
import { ADMIN } from "@/lib/content/admin";
import styles from "@/components/admin/Admin.module.css";

export const dynamic = "force-dynamic";

/**
 * The access-link console.
 *
 * requireAdmin() runs HERE, in the page, not in app/admin/layout.tsx. App
 * Router renders page children even when a layout never mounts them, so a
 * layout-level gate would still serialise this list — recipient emails,
 * company names, reading history — into the RSC payload of a signed-out
 * request. Same constraint documented on app/course/page.tsx.
 */
export default async function AdminPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  const requestHeaders = await headers();
  const host = requestHeaders.get("host") ?? "";
  const protocol = host.startsWith("localhost") || host.startsWith("127.") ? "http" : "https";
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? `${protocol}://${host}`;

  let grants: GrantRecord[] = [];
  try {
    grants = await listGrants();
  } catch (error) {
    // An empty console beats a 500 — Sampath may be mid-interview.
    console.error("admin grants list failed", error);
  }

  // Paid enrollments live in the same table but are not what this screen is
  // for; showing them would bury the handful of links Sampath is tracking.
  const demoGrants = grants.filter((grant) => grant.source === "demo");

  return (
    <main className={styles.main} id="main">
      <header className={styles.header}>
        <p className={`mono ${styles.eyebrow}`}>{ADMIN.grants.eyebrow}</p>
        <form action="/api/admin/logout" method="post">
          <button className={styles.signOut} type="submit">
            Sign out
          </button>
        </form>
      </header>

      <QuickGrant />

      {demoGrants.length === 0 ? (
        <section className={styles.empty}>
          <p className={styles.emptyHeading}>{ADMIN.grants.emptyHeading}</p>
          <p className={styles.hint}>{ADMIN.grants.emptyBody}</p>
        </section>
      ) : (
        <ul className={styles.grantList}>
          {demoGrants.map((grant) => (
            <GrantRow
              key={grant.id}
              grant={grant}
              url={`${origin}/c/${grant.accessCode}`}
            />
          ))}
        </ul>
      )}
    </main>
  );
}
