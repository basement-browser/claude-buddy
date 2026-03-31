import type { Metadata } from "next";
import { generateBuddy } from "@/lib/generate-buddy";
import ClaudeBuddyPage from "@/components/ClaudeBuddyPage";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://claudebuddy.me";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ name?: string }>;
}): Promise<Metadata> {
  const { name } = await searchParams;

  if (!name) {
    return {};
  }

  const buddy = generateBuddy(name);
  const shinyLabel = buddy.isShiny ? "Shiny " : "";
  const title = `${shinyLabel}${buddy.species} — Claude Buddy`;
  const description = `${buddy.rarity} ${shinyLabel}${buddy.species} — Vibe: ${buddy.stats.vibe} / Chaos: ${buddy.stats.chaos} / Focus: ${buddy.stats.focus} / Luck: ${buddy.stats.luck}. "${buddy.soulDescription}"`;
  const ogImageUrl = `${siteUrl}/api/og?name=${encodeURIComponent(name)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/?name=${encodeURIComponent(name)}`,
      siteName: "Claude Buddy",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${shinyLabel}${buddy.species} — Claude Buddy pixel companion`,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default function Home() {
  return <ClaudeBuddyPage />;
}
