import type { Metadata } from "next";
import { Footer } from "@/components/chrome/Footer";
import { TopNav } from "@/components/chrome/TopNav";
import { LegalPage } from "@/components/legal/LegalPage";
import { TERMS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Terms of Service — Sampath Kumar",
  description:
    "Terms of service for Sampath Kumar's remote lead-generation and pre-sales consulting: a 60-minute USD 350 session, booking and payment, delivery, and no-guaranteed-outcome advisory terms.",
};

export default function TermsPage() {
  return (
    <>
      <TopNav forceGrounded />
      <main id="main">
        <LegalPage doc={TERMS} />
      </main>
      <Footer />
    </>
  );
}
