import type { MetadataRoute } from "next";
import { SPECIES_LIST } from "@/lib/species";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://claudebuddy.me";

  const speciesPages = SPECIES_LIST.map((species) => ({
    url: `${siteUrl}?name=${encodeURIComponent(species.name)}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...speciesPages,
  ];
}
