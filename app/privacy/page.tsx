import type { Metadata } from "next";
import { Footer } from "@/components/chrome/Footer";
import { TopNav } from "@/components/chrome/TopNav";
import { LegalPage } from "@/components/legal/LegalPage";
import { getLegalDoc } from "@/lib/backend/site-content-loaders";

export const metadata: Metadata = {
  title: "Privacy Policy — Sampath Kumar",
  description:
    "Privacy policy for Sampath Kumar's remote consulting site: what information is collected, how it is used, payment and service providers, sharing and retention, and your choices.",
};

export default async function PrivacyPage() {
  const doc = await getLegalDoc("legal_privacy");
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
