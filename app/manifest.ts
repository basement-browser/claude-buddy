import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Claude Buddy — Hatch Your Claude Code Companion",
    short_name: "Claude Buddy",
    description:
      "Generate your own unique Claude Buddy pixel companion! Enter your name and hatch a one-of-a-kind pixel creature from Claude Code's hidden gacha system. 12 species, 5 rarities, and shiny variants.",
    start_url: "/",
    display: "standalone",
    background_color: "#1A1714",
    theme_color: "#E8734A",
    categories: ["entertainment", "games", "utilities"],
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
