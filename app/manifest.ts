import type { MetadataRoute } from "next";

/**
 * Web app manifest. Icons and colours are the client's design tokens
 * (styles/tokens.css): the page ground --surface-page and the chrome tint
 * --surface-chrome. The maskable icon carries the ground itself, because
 * Android's adaptive mask has to crop into something.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sampath Kumar — Pre Sales Head & Lead Generation",
    short_name: "Sampath Kumar",
    description:
      "Pre Sales Head and Lead Generation leader — outbound engines for B2B SaaS and private markets.",
    start_url: "/",
    display: "standalone",
    background_color: "#f5f3ff",
    theme_color: "#f1ebfb",
    icons: [
      { src: "/favicon.ico", sizes: "any", type: "image/x-icon" },
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      {
        src: "/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
