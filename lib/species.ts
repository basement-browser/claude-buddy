import { Rarity, Species } from "./types";

export interface SpeciesEntry {
  name: Species;
  rarity: Rarity;
  palette: string[];
  shinyPalette: string[];
  soulDescriptions: string[];
}

export const RARITY_COLORS: Record<Rarity, string> = {
  Common: "#9ca3af",
  Uncommon: "#4ade80",
  Rare: "#60a5fa",
  Epic: "#c084fc",
  Legendary: "#f59e0b",
};

// Weighted species list - order matters for deterministic selection
export const SPECIES_LIST: SpeciesEntry[] = [
  // Common (45%) - 4 species, ~11.25% each
  {
    name: "Blobbit",
    rarity: "Common",
    palette: ["#7ec8a0", "#5ba87e", "#3d8a60", "#2a5c40"],
    shinyPalette: ["#a0f0c8", "#70e0a0", "#50d080", "#30c060"],
    soulDescriptions: [
      "Vibrates gently when content. Which is always.",
      "Has never had a bad thought. Literally incapable.",
      "Will sit on your keyboard and purr at 60hz.",
      "Somehow already knows your WiFi password.",
    ],
  },
  {
    name: "Gruntle",
    rarity: "Common",
    palette: ["#d88a6e", "#c47058", "#a05842", "#7a4030"],
    shinyPalette: ["#ffb090", "#ff9070", "#ff7050", "#ff5030"],
    soulDescriptions: [
      "Snorts when it laughs. Which is constantly.",
      "Will eat literally anything you put in front of it.",
      "Thinks it's much bigger than it actually is.",
      "Has strong opinions about code formatting.",
    ],
  },
  {
    name: "Pebblix",
    rarity: "Common",
    palette: ["#a0998e", "#8a8378", "#706a60", "#585248"],
    shinyPalette: ["#c8c0b0", "#b0a898", "#989080", "#807868"],
    soulDescriptions: [
      "Hasn't moved in three days. Might be meditating.",
      "Is technically older than the sun.",
      "Extremely patient. Will wait for your build to finish.",
      "Makes a satisfying *clonk* sound when tapped.",
    ],
  },
  {
    name: "Snorb",
    rarity: "Common",
    palette: ["#b8a0d0", "#9880b0", "#786090", "#584070"],
    shinyPalette: ["#e0c0ff", "#c0a0ff", "#a080ff", "#8060ff"],
    soulDescriptions: [
      "Leaves a trail of glitter wherever it goes.",
      "Moves at exactly one commit per hour.",
      "Its shell contains an entire git history.",
      "Somehow always knows the optimal database index.",
    ],
  },
  // Uncommon (30%) - 3 species, 10% each
  {
    name: "Flickmouse",
    rarity: "Uncommon",
    palette: ["#f0d060", "#d0b040", "#b09020", "#907010"],
    shinyPalette: ["#fff080", "#ffe060", "#ffd040", "#ffc020"],
    soulDescriptions: [
      "Moves so fast it appears to be in two terminals at once.",
      "Has chewed through seventeen USB cables this week.",
      "Types faster than you. Sorry.",
      "Its tail generates enough static to crash a MacBook.",
    ],
  },
  {
    name: "Mosscap",
    rarity: "Uncommon",
    palette: ["#90c070", "#70a050", "#508030", "#306020"],
    shinyPalette: ["#b0ff90", "#90ff70", "#70ff50", "#50ff30"],
    soulDescriptions: [
      "Photosynthesizes during standups.",
      "Has been growing since the last major version bump.",
      "Distributes spores that improve code coverage.",
      "Technically counts as a dev dependency.",
    ],
  },
  {
    name: "Dustbunni",
    rarity: "Uncommon",
    palette: ["#d0c0b8", "#b8a8a0", "#a09088", "#887870"],
    shinyPalette: ["#f0e0d8", "#e0d0c8", "#d0c0b8", "#c0b0a8"],
    soulDescriptions: [
      "Formed spontaneously under your desk last Tuesday.",
      "Allergic to clean code. Prefers legacy systems.",
      "Reproduces asexually in dusty server rooms.",
      "Has seen things in the node_modules folder.",
    ],
  },
  // Rare (15%) - 2 species, 7.5% each
  {
    name: "Glimworm",
    rarity: "Rare",
    palette: ["#80e0a0", "#60c080", "#40a060", "#208040"],
    shinyPalette: ["#a0ffc0", "#80ffa0", "#60ff80", "#40ff60"],
    soulDescriptions: [
      "Bioluminescent. Doubles as a night light and a linter.",
      "Each segment represents a successfully merged PR.",
      "Glows brighter near well-documented code.",
      "Can debug your code just by crawling over it.",
    ],
  },
  {
    name: "Thornpup",
    rarity: "Rare",
    palette: ["#c07050", "#a05838", "#804028", "#602818"],
    shinyPalette: ["#ff9070", "#ff7858", "#ff6040", "#ff4828"],
    soulDescriptions: [
      "Loyal. Will guard your staging environment with its life.",
      "The spikes are mostly decorative. Mostly.",
      "Fetches thrown exceptions and brings them back.",
      "Growls at anyone who pushes directly to main.",
    ],
  },
  // Epic (7%) - 2 species, 3.5% each
  {
    name: "Voidmaw",
    rarity: "Epic",
    palette: ["#483858", "#382848", "#281838", "#180828"],
    shinyPalette: ["#6858a8", "#5848a0", "#483898", "#382890"],
    soulDescriptions: [
      "Consumes deprecated APIs. You're welcome.",
      "Where does the code go? Nobody knows.",
      "Has a mouth where its body should be. Works fine.",
      "Stares into the void. The void files a bug report.",
    ],
  },
  {
    name: "Crystalfin",
    rarity: "Epic",
    palette: ["#80c0e0", "#60a0c8", "#4080b0", "#206098"],
    shinyPalette: ["#a0e0ff", "#80d0ff", "#60c0ff", "#40b0ff"],
    soulDescriptions: [
      "Each crystal contains a perfectly optimized algorithm.",
      "Swims through data streams like they're water.",
      "Its fins refract light into valid JSON.",
      "Was discovered in a deep lake of unprocessed logs.",
    ],
  },
  // Legendary (3%) - 1 species
  {
    name: "Nebulynx",
    rarity: "Legendary",
    palette: ["#a070d0", "#7850b0", "#503890", "#302070"],
    shinyPalette: ["#d0a0ff", "#c080ff", "#b060ff", "#a040ff"],
    soulDescriptions: [
      "Contains an entire universe in its fur. No big deal.",
      "Has seen every possible git timeline. Chose this one.",
      "Purrs at a frequency that resolves merge conflicts.",
      "Legends say it wrote the first line of code. Ever.",
    ],
  },
];
