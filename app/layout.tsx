import type { Metadata } from "next";
import { BackToTop } from "@/components/chrome/BackToTop";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { Bricolage_Grotesque, DM_Mono, Great_Vibes, Inter_Tight, Newsreader } from "next/font/google";
import { THEME_BOOT_SCRIPT } from "@/lib/frontend/theme";
import "@/styles/global.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bricolage",
  weight: ["700", "800"],
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter-tight",
  weight: ["400"],
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-mono",
  weight: ["400"],
});

/** The signature wordmark only — the cursive brand mark, nothing else on the
 *  page uses it. Ported from the portfolio site's identity system. */
const greatVibes = Great_Vibes({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-great-vibes",
  weight: ["400"],
});

/** Carries exactly one word — "hello." — so only the italic is loaded. */
const newsreader = Newsreader({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-newsreader",
  style: "italic",
  weight: ["300"],
});

export const metadata: Metadata = {
  // Resolves every relative Open Graph image and canonical URL on the site, so
  // a placeholder here silently points social previews at a domain that does
  // not exist. Kept in step with NEXT_PUBLIC_SITE_URL, which lib/backend/email.ts
  // uses to build the links inside course emails.
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.sampathkumar.in"),
  title: "Sampath Kumar — Pre Sales Head & Lead Generation",
  description:
    "Sampath Kumar is a Pre Sales Head and Lead Generation leader with 7+ years driving B2B SaaS, IT, staffing, and private-market deal origination pipeline growth globally.",
  openGraph: {
    title: "Sampath Kumar — Pre Sales Head & Lead Generation",
    description: "Every deal begins with hello. Outbound engines for B2B SaaS and private markets, built across 24 markets.",
    type: "profile",
    locale: "en_IN",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${interTight.variable} ${dmMono.variable} ${greatVibes.variable} ${newsreader.variable}`}
      data-theme="light"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        {/* Resolves the theme before first paint. The content is a constant this
            file owns, never user input, so there is nothing here to sanitise;
            doing it in React instead would paint one frame of the wrong ground,
            which on a single-polarity page is a full-screen flash. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }} />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        {children}
        <BackToTop />
        {/* The bot owns the bottom-right on every page, opposite BackToTop's
            bottom-left. Mounted once here rather than per page so there is a
            single conversation, not one per route. */}
        <ChatWidget />
      </body>
    </html>
  );
}
