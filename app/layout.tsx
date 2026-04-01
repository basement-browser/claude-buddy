import type { Metadata } from "next";
import { Press_Start_2P, JetBrains_Mono, Inter } from "next/font/google";
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

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
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
  verification: {
    google: "RfpiirFHc_b4mjKKh4Gs0aoaJ5xYjBnAwMAr6ZOkxOo",
    other: { "msvalidate.01": "9F8B3E896C2C997A2752B220EAE9D53B" },
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Claude Buddy",
    alternateName: "Claude Buddy Hatchery",
    description:
      "Generate your own unique Claude Buddy pixel companion! Enter your name and hatch a one-of-a-kind pixel creature from Claude Code's hidden gacha system.",
    url: siteUrl,
    applicationCategory: "EntertainmentApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript",
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
    screenshot: `${siteUrl}/opengraph-image`,
    featureList: [
      "12 unique pixel art species",
      "5 rarity tiers",
      "Shiny variants",
      "Deterministic generation",
      "PNG export",
      "Claude Code statusline integration",
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is Claude Buddy?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Claude Buddy is a free pixel companion generator built on Claude Code's hidden gacha system. Enter any name and hatch a unique, deterministic pixel creature. There are 12 species across 5 rarity tiers (Common, Uncommon, Rare, Epic, Legendary), with a 1-in-20 chance of a shiny variant.",
        },
      },
      {
        "@type": "Question",
        name: "How does Claude Buddy work?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Claude Buddy uses a deterministic hash-based system: your name is hashed to select a species, rarity, stats (Vibe, Chaos, Focus, Luck), color palette, and pixel sprite. The same name always produces the same buddy. The buddy is drawn pixel-by-pixel on a 16x16 grid with a CRT-style animation.",
        },
      },
      {
        "@type": "Question",
        name: "What are the Claude Buddy species and rarities?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "There are 12 species: Common (45%) — Blobbit, Gruntle, Pebblix, Snorb; Uncommon (30%) — Flickmouse, Mosscap, Dustbunni; Rare (15%) — Glimworm, Thornpup; Epic (7%) — Voidmaw, Crystalfin; Legendary (3%) — Nebulynx. Each species has unique pixel art and color palettes.",
        },
      },
      {
        "@type": "Question",
        name: "Can I install Claude Buddy in Claude Code?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes! After hatching your buddy, you can install it as your Claude Code statusline companion. The buddy will appear in your terminal while you use Claude Code. You can also sync with your Claude Code user ID to get the same buddy your CLI generates.",
        },
      },
      {
        "@type": "Question",
        name: "Is Claude Buddy free?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, Claude Buddy is completely free to use. You can generate unlimited buddies, export them as PNG images, share them via URL, and install them in Claude Code at no cost.",
        },
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Hatch Your Claude Buddy",
    description:
      "Generate your own unique pixel companion from Claude Code's buddy system.",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Enter your name",
        text: "Type any name or your Claude Code user ID into the hatch input field.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Watch your buddy hatch",
        text: "Your unique pixel buddy is drawn pixel-by-pixel on a CRT-style screen. The species, rarity, stats, and colors are all determined by your name.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Export or install",
        text: "Save your buddy as a PNG image, share it via URL, or install it as your Claude Code statusline companion.",
      },
    ],
  },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${pressStart.variable} ${jetbrains.variable} ${inter.variable}`}>
      <body className="min-h-screen overflow-x-hidden">
        {jsonLd.map((schema, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
        {children}
        <Analytics />
      </body>
    </html>
  );
}
