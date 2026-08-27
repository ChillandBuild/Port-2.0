import type { Metadata } from "next";
import { Footer } from "@/components/chrome/Footer";
import { TopNav } from "@/components/chrome/TopNav";
import { LegalPage } from "@/components/legal/LegalPage";
import { PRIVACY } from "@/lib/content";

export const metadata: Metadata = {
  title: "Privacy Policy — Sampath Kumar",
  description:
    "Privacy policy for Sampath Kumar's remote consulting site: what information is collected, how it is used, payment and service providers, sharing and retention, and your choices.",
};

export default function PrivacyPage() {
  return (
    <>
      <TopNav forceGrounded />
      <main id="main">
        <LegalPage doc={PRIVACY} />
      </main>
      <Footer />
    </>
  );
}
