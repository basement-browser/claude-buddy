import type { Metadata } from "next";
import { Press_Start_2P, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const pressStart = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://claudebuddy.me";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Claude Buddy — Hatch Your Claude Code Companion",
    template: "%s | Claude Buddy",
  },
  description:
    "Generate your own unique Claude Buddy pixel companion! Enter your name and hatch a one-of-a-kind pixel creature from Claude Code's hidden gacha system. 12 species, 5 rarities, and shiny variants — same name, same buddy, every time.",
  keywords: [
    "claude buddy",
    "claude code",
    "claude code buddy",
    "pixel buddy",
    "gacha",
    "pixel art generator",
    "claude companion",
    "anthropic claude",
    "claude code easter egg",
    "pixel creature generator",
    "claude buddy generator",
    "hatch claude buddy",
  ],
  authors: [{ name: "Basement Team", url: "https://basementbrowser.com" }],
  creator: "Basement Team",
  publisher: "Basement Team",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Claude Buddy — Hatch Your Claude Code Companion",
    description:
      "Generate your own unique Claude Buddy pixel companion! 12 species, 5 rarities, shiny variants. Enter your name → get your buddy. Same hash, same buddy, every time.",
    url: "/",
    siteName: "Claude Buddy",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Claude Buddy — Hatch Your Claude Code Companion",
    description:
      "Generate your own unique Claude Buddy pixel companion! 12 species, 5 rarities, shiny variants. Enter your name → get your buddy.",
  },
  category: "entertainment",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Claude Buddy",
  alternateName: "Claude Buddy Hatchery",
  description:
    "Generate your own unique Claude Buddy pixel companion! Enter your name and hatch a one-of-a-kind pixel creature from Claude Code's hidden gacha system.",
  url: siteUrl,
  applicationCategory: "EntertainmentApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  creator: {
    "@type": "Organization",
    name: "Basement Team",
    url: "https://basementbrowser.com",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${pressStart.variable} ${jetbrains.variable}`}>
      <body className="bg-[#1a1a1a] text-white font-mono min-h-screen overflow-hidden">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <Analytics />
        {/* CRT scanline overlay */}
        <div className="crt-overlay" />
      </body>
    </html>
  );
}
