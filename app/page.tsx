import type { Metadata } from "next";
import { generateBuddy } from "@/lib/generate-buddy";
import { SPECIES_LIST } from "@/lib/species";
import { STAT_NAMES, SPECIES } from "@/lib/types";
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
  const statLine = STAT_NAMES.map((s) => `${s}: ${buddy.stats[s]}`).join(" / ");
  const description = `${buddy.rarity} ${shinyLabel}${buddy.species} — ${statLine}. "${buddy.soulDescription}"`;
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

const RARITY_TIERS = [
  { name: "Common", chance: "60%", description: "Any species can appear at common rarity" },
  { name: "Uncommon", chance: "25%", description: "Unlocks hat accessories" },
  { name: "Rare", chance: "10%", description: "Higher stat floors" },
  { name: "Epic", chance: "4%", description: "Strong stats with rare hats" },
  { name: "Legendary", chance: "1%", description: "The rarest roll — peak stats" },
];

export default function Home() {
  return (
    <main>
      <ClaudeBuddyPage />

      {/* Server-rendered content for SEO / AEO / GEO crawlers */}
      <article className="max-w-3xl mx-auto px-6 py-16 font-sans text-[#8A8480]">
        <h2 className="text-2xl font-bold text-[#F5F0EB] mb-6">
          What is Claude Buddy?
        </h2>
        <p className="mb-4 leading-relaxed">
          Claude Buddy is a free pixel companion generator built on{" "}
          <strong>Claude Code&apos;s hidden gacha system</strong>. Enter any name
          and hatch a unique, deterministic pixel creature. The same name always
          produces the same buddy — your companion is yours forever.
        </p>
        <p className="mb-8 leading-relaxed">
          There are <strong>{SPECIES.length} species</strong> across{" "}
          <strong>5 rarity tiers</strong> (Common, Uncommon, Rare, Epic,
          Legendary), with a <strong>1-in-100 chance</strong> of a shiny variant
          featuring an alternate color palette. Any species can appear at any
          rarity — rarity is rolled independently.
        </p>

        <h2 className="text-2xl font-bold text-[#F5F0EB] mb-6">
          How to Hatch Your Buddy
        </h2>
        <ol className="list-decimal list-inside mb-8 space-y-3 leading-relaxed">
          <li>
            <strong>Enter your name</strong> — type any name or your Claude Code
            user ID into the hatch input field.
          </li>
          <li>
            <strong>Watch it hatch</strong> — your unique pixel buddy is drawn
            pixel-by-pixel on a CRT-style screen. Species, rarity, stats, eye,
            hat, and colors are all determined by your name.
          </li>
          <li>
            <strong>Export or install</strong> — save as PNG, share via URL, or
            install as your Claude Code statusline companion.
          </li>
        </ol>

        <h2 className="text-2xl font-bold text-[#F5F0EB] mb-6">
          Rarity Tiers
        </h2>
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#3A3530]">
                <th className="py-3 pr-4 text-[#F5F0EB] font-semibold">Rarity</th>
                <th className="py-3 pr-4 text-[#F5F0EB] font-semibold">Chance</th>
                <th className="py-3 text-[#F5F0EB] font-semibold">Description</th>
              </tr>
            </thead>
            <tbody>
              {RARITY_TIERS.map((tier) => (
                <tr key={tier.name} className="border-b border-[#2A2520]">
                  <td className="py-3 pr-4 font-medium">{tier.name}</td>
                  <td className="py-3 pr-4">{tier.chance}</td>
                  <td className="py-3">{tier.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mb-8 text-sm leading-relaxed">
          Rarity is independent of species — any of the 18 species can appear at
          any rarity tier. Higher rarities unlock hats and have higher stat floors.
        </p>

        <h2 className="text-2xl font-bold text-[#F5F0EB] mb-6">
          Buddy Stats
        </h2>
        <p className="mb-4 leading-relaxed">
          Every buddy has five stats, generated with a peak/dump system based on
          rarity. Higher rarities have higher stat floors:
        </p>
        <ul className="list-disc list-inside mb-8 space-y-2 leading-relaxed">
          <li><strong>Debugging</strong> — bug-finding prowess</li>
          <li><strong>Patience</strong> — how long they&apos;ll wait for your build</li>
          <li><strong>Chaos</strong> — unpredictability factor</li>
          <li><strong>Wisdom</strong> — code review insight</li>
          <li><strong>Snark</strong> — sass level in comments</li>
        </ul>

        <h2 className="text-2xl font-bold text-[#F5F0EB] mb-6">
          Frequently Asked Questions
        </h2>
        <dl className="space-y-6 mb-8">
          <div>
            <dt className="font-semibold text-[#F5F0EB]">
              Is Claude Buddy free?
            </dt>
            <dd className="mt-1 leading-relaxed">
              Yes, completely free. Generate unlimited buddies, export as PNG,
              share via URL, and install in Claude Code at no cost.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-[#F5F0EB]">
              Will my buddy always be the same?
            </dt>
            <dd className="mt-1 leading-relaxed">
              Yes. Claude Buddy uses deterministic generation — the same name
              always produces the same species, rarity, stats, palette, and
              sprite. Your buddy is uniquely yours.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-[#F5F0EB]">
              Can I use my Claude Code user ID?
            </dt>
            <dd className="mt-1 leading-relaxed">
              Yes! Use the &ldquo;Sync with Claude Code&rdquo; feature to enter
              your Claude Code user ID and get the exact same buddy your CLI
              would generate.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-[#F5F0EB]">
              How do I install my buddy in Claude Code?
            </dt>
            <dd className="mt-1 leading-relaxed">
              After hatching your buddy, click &ldquo;Install as Claude Code
              Buddy&rdquo; to add it as your statusline companion. It will
              appear in your terminal while you use Claude Code.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-[#F5F0EB]">
              What is a shiny buddy?
            </dt>
            <dd className="mt-1 leading-relaxed">
              Shiny buddies are rare variants (1% chance) with alternate color
              palettes. They have the same species and stats but a unique,
              glowing appearance.
            </dd>
          </div>
        </dl>

        <h2 className="text-2xl font-bold text-[#F5F0EB] mb-6">
          All {SPECIES_LIST.length} Species
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          {SPECIES_LIST.map((species) => (
            <div
              key={species.name}
              className="p-3 rounded-lg border border-[#2A2520] bg-[#1E1B18]"
            >
              <p className="font-semibold text-[#F5F0EB] capitalize">{species.name}</p>
            </div>
          ))}
        </div>
      </article>
    </main>
  );
}
