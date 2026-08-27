import type { Metadata } from "next";
import { Footer } from "@/components/chrome/Footer";
import { TopNav } from "@/components/chrome/TopNav";
import { LegalPage } from "@/components/legal/LegalPage";
import { REFUNDS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Refunds & Cancellations — Sampath Kumar",
  description:
    "Refund and cancellation policy for Sampath Kumar's remote consulting sessions: the 24-hour cancellation window, rescheduling, late cancellation, and refund processing.",
};

export default function RefundsPage() {
  return (
    <>
      <TopNav forceGrounded />
      <main id="main">
        <LegalPage doc={REFUNDS} />
      </main>
      <Footer />
    </>
  );
}
