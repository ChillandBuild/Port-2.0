import type { Metadata } from "next";
import { Footer } from "@/components/chrome/Footer";
import { TopNav } from "@/components/chrome/TopNav";
import { LegalPage } from "@/components/legal/LegalPage";
import { getLegalDoc } from "@/lib/backend/site-content-loaders";

export const metadata: Metadata = {
  title: "Terms of Service — Sampath Kumar",
  description:
    "Terms of service for Sampath Kumar's remote lead-generation and pre-sales consulting: a 60-minute USD 350 session, booking and payment, delivery, and no-guaranteed-outcome advisory terms.",
};

export default async function TermsPage() {
  const doc = await getLegalDoc("legal_terms");
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
