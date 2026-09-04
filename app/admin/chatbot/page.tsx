import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/backend/admin-auth";
import { ChatbotForm } from "@/components/admin/ChatbotForm";
import { getChatbotContent } from "@/lib/backend/site-content-loaders";
import styles from "@/components/admin/Admin.module.css";

export const dynamic = "force-dynamic";

/** requireAdmin() runs here, not in the layout — see app/admin/page.tsx for why. */
export default async function AdminChatbotPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  const chatbot = await getChatbotContent();

  return (
    <main className={styles.main} id="main">
      <header className={styles.header}>
        <p className={`mono ${styles.eyebrow}`}>Chatbot</p>
        <form action="/api/admin/logout" method="post">
          <button className={styles.signOut} type="submit">
            Sign out
          </button>
        </form>
      </header>

      <h1 className={styles.quickHeading}>What the site chatbot says.</h1>
      <p className={styles.hint}>Add, remove or reword answers and their trigger keywords.</p>

      <ChatbotForm initial={chatbot} />
    </main>
  );
}
