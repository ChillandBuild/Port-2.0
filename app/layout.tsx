import type { Metadata } from "next";
import { Bricolage_Grotesque, DM_Mono, Inter_Tight, Newsreader } from "next/font/google";
import { THEME_BOOT_SCRIPT } from "@/lib/theme";
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

/** Carries exactly one word — "hello." — so only the italic is loaded. */
const newsreader = Newsreader({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-newsreader",
  style: "italic",
  weight: ["300"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sampathkumar.example"),
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
      className={`${bricolage.variable} ${interTight.variable} ${dmMono.variable} ${newsreader.variable}`}
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
      </body>
    </html>
  );
}
