import type { Metadata } from "next";
import { Footer } from "@/components/chrome/Footer";
import { TopNav } from "@/components/chrome/TopNav";
import { LegalPage } from "@/components/legal/LegalPage";
import { getLegalDoc } from "@/lib/backend/site-content-loaders";

export const metadata: Metadata = {
  title: "Refunds & Cancellations — Sampath Kumar",
  description:
    "Refund and cancellation policy for Sampath Kumar's remote consulting sessions: the 24-hour cancellation window, rescheduling, late cancellation, and refund processing.",
};

export default async function RefundsPage() {
  const doc = await getLegalDoc("legal_refunds");
  return (
    <>
      <TopNav forceGrounded />
      <main id="main">
        <LegalPage doc={doc} />
      </main>
      <Footer />
    </>
  );
}
