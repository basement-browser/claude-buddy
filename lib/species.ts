import { Species, Rarity } from "./types";

export interface SpeciesData {
  palette: string[];
  shinyPalette: string[];
  soulDescriptions: string[];
}

export const RARITY_COLORS: Record<Rarity, string> = {
  common: "#9ca3af",
  uncommon: "#4ade80",
  rare: "#60a5fa",
  epic: "#c084fc",
  legendary: "#f59e0b",
};

// Species data — palettes and soul descriptions for each of the 18 species.
// Species are NOT tied to rarity; rarity is rolled independently.
export const SPECIES_DATA: Record<Species, SpeciesData> = {
  duck: {
    palette: ["#f0d060", "#d0a030", "#e0b040", "#2a2a2a"],
    shinyPalette: ["#fff8a0", "#ffe060", "#fff070", "#1a1a3a"],
    soulDescriptions: [
      "Quacks at bugs until they fix themselves.",
      "Will rubber-duck debug your code. Literally.",
      "Has never met a pond it didn't like.",
      "Waddles with purpose. Always.",
    ],
  },
  goose: {
    palette: ["#e8e8e0", "#b0b0a8", "#d0d0c8", "#2a2a28"],
    shinyPalette: ["#ffffff", "#d0d0ff", "#e8e8ff", "#1a1a40"],
    soulDescriptions: [
      "Will honk at your bad code. Loudly.",
      "Steals your keyboard when you're not looking.",
      "Has chosen violence. And also your codebase.",
      "Intimidates bugs into fixing themselves.",
    ],
  },
  blob: {
    palette: ["#7ec8a0", "#5ba87e", "#3d8a60", "#2a5c40"],
    shinyPalette: ["#a0f0c8", "#70e0a0", "#50d080", "#30c060"],
    soulDescriptions: [
      "Vibrates gently when content. Which is always.",
      "Has never had a bad thought. Literally incapable.",
      "Will sit on your keyboard and purr at 60hz.",
      "Somehow already knows your WiFi password.",
    ],
  },
  cat: {
    palette: ["#e0a060", "#c08040", "#a06830", "#2a2a28"],
    shinyPalette: ["#ffc880", "#ffb060", "#ff9840", "#1a1a40"],
    soulDescriptions: [
      "Knocks your coffee off the desk. On purpose.",
      "Will sit on your keyboard at the worst possible moment.",
      "Judges your code silently. Always judging.",
      "Purrs at a frequency that resolves merge conflicts.",
    ],
  },
  dragon: {
    palette: ["#c04040", "#901818", "#e05050", "#f0d020"],
    shinyPalette: ["#e060e0", "#b030b0", "#f080f0", "#f0f020"],
    soulDescriptions: [
      "Breathes fire at deprecated APIs.",
      "Guards your production server like a hoard of gold.",
      "Has never lost a code review. Ever.",
      "Its scales are made of merged pull requests.",
    ],
  },
  octopus: {
    palette: ["#c070c0", "#9040a0", "#a050b0", "#e0e0e0"],
    shinyPalette: ["#e0a0ff", "#c070ff", "#d080ff", "#ffffff"],
    soulDescriptions: [
      "Can type on eight keyboards simultaneously.",
      "Each tentacle handles a different microservice.",
      "Squirts ink on bad code reviews.",
      "Has seen things in the deep end of the codebase.",
    ],
  },
  owl: {
    palette: ["#c0a070", "#907040", "#a08050", "#f0e020"],
    shinyPalette: ["#e0c8a0", "#c0a870", "#d0b880", "#f0f060"],
    soulDescriptions: [
      "Debugs best at 3am. Refuses to explain why.",
      "Knows where every bug is hiding. All of them.",
      "Rotates its head to read your code from any angle.",
      "The wisest creature in any codebase. Probably.",
    ],
  },
  penguin: {
    palette: ["#303030", "#f0f0f0", "#484848", "#f0a020"],
    shinyPalette: ["#2020a0", "#f0f0ff", "#3838c0", "#f0d060"],
    soulDescriptions: [
      "Waddles through your codebase with great confidence.",
      "Thrives in cold server rooms.",
      "Slides through deployments like ice.",
      "Looks great in a tuxedo. Always formal.",
    ],
  },
  turtle: {
    palette: ["#60a060", "#408040", "#80c080", "#2a2a28"],
    shinyPalette: ["#80d0a0", "#50b070", "#a0f0c0", "#1a1a40"],
    soulDescriptions: [
      "Slow and steady wins the code review.",
      "Its shell contains an entire git history.",
      "Has been working on this PR since last month. Almost done.",
      "Extremely patient. Will wait for your build to finish.",
    ],
  },
  snail: {
    palette: ["#b8a0d0", "#9880b0", "#a890c0", "#2a2a28"],
    shinyPalette: ["#e0c0ff", "#c0a0ff", "#d0b0ff", "#1a1a40"],
    soulDescriptions: [
      "Leaves a trail of glitter wherever it goes.",
      "Moves at exactly one commit per hour.",
      "Its shell contains perfectly optimized algorithms.",
      "Somehow always knows the optimal database index.",
    ],
  },
  ghost: {
    palette: ["#d0d0e0", "#a0a0c0", "#b8b8d0", "#4040a0"],
    shinyPalette: ["#e8e8ff", "#c0c0ff", "#d0d0ff", "#6060f0"],
    soulDescriptions: [
      "Haunts your codebase but in a helpful way.",
      "Phases through firewalls. For debugging purposes only.",
      "The last developer's spirit. Still shipping features.",
      "Boo! Just kidding. Here to help with that segfault.",
    ],
  },
  axolotl: {
    palette: ["#f0a0b0", "#d07080", "#e08898", "#2a2a28"],
    shinyPalette: ["#ffc0d0", "#ffa0b0", "#ffb0c0", "#1a1a40"],
    soulDescriptions: [
      "Can regenerate deleted code from memory.",
      "Its gills filter out bad commits.",
      "Smiles at every stack trace. Genuinely enjoys them.",
      "Lives in the data stream. Breathes JSON.",
    ],
  },
  capybara: {
    palette: ["#c09060", "#a07040", "#b08050", "#2a2a28"],
    shinyPalette: ["#e0b880", "#c09860", "#d0a870", "#1a1a40"],
    soulDescriptions: [
      "Gets along with every framework. All of them.",
      "The most relaxed code reviewer you'll ever meet.",
      "Will chill next to your terminal. Very supportive.",
      "Friends with literally every other buddy species.",
    ],
  },
  cactus: {
    palette: ["#50a050", "#308030", "#70c070", "#f0e020"],
    shinyPalette: ["#80d080", "#50b050", "#a0f0a0", "#f0f060"],
    soulDescriptions: [
      "Thrives on neglect. Perfect for long-running services.",
      "Don't touch it. It doesn't need your help.",
      "Has been running in production for years. Untouched.",
      "Prickly about code quality. Literally.",
    ],
  },
  robot: {
    palette: ["#8090a0", "#506070", "#a0b0c0", "#40f0f0"],
    shinyPalette: ["#a0b0d0", "#7090b0", "#c0d0e0", "#60f0ff"],
    soulDescriptions: [
      "Beep boop. Your code has been optimized.",
      "Runs diagnostics on everything. Everything.",
      "01001000 01101001. That means hello.",
      "Has calculated the optimal review comment. Deploying.",
    ],
  },
  rabbit: {
    palette: ["#e0d0c8", "#c0b0a0", "#d0c0b8", "#d07070"],
    shinyPalette: ["#f0e8e0", "#e0d0c8", "#e8d8d0", "#f08080"],
    soulDescriptions: [
      "Hops between branches faster than you can git checkout.",
      "Multiplies like feature requests.",
      "Its ears pick up race conditions from across the room.",
      "Burrows deep into your codebase. Always finds the root cause.",
    ],
  },
  mushroom: {
    palette: ["#d05030", "#f0e0c0", "#e06040", "#2a2a28"],
    shinyPalette: ["#e070f0", "#f0e8ff", "#f080ff", "#1a1a40"],
    soulDescriptions: [
      "Technically counts as a dev dependency.",
      "Distributes spores that improve code coverage.",
      "Has been growing since the last major version bump.",
      "Photosynthesizes during standups.",
    ],
  },
  chonk: {
    palette: ["#e0a050", "#c08030", "#d09040", "#2a2a28"],
    shinyPalette: ["#ffc870", "#ffb050", "#ffc060", "#1a1a40"],
    soulDescriptions: [
      "Round. Very round. Impressively round.",
      "Takes up 80% of available memory. Worth it.",
      "Sits on your bugs. They stop moving.",
      "Cannot be moved. Has decided this is its desk now.",
    ],
  },
};

// Flat list of species entries for UI display
export const SPECIES_LIST = Object.entries(SPECIES_DATA).map(([name, data]) => ({
  name: name as Species,
  ...data,
}));
