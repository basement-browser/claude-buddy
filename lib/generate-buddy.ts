import { mulberry32, hashString } from "./prng";
import { SPECIES_DATA } from "./species";
import { SPRITES } from "./sprites";
import {
  Buddy,
  Species,
  Rarity,
  Eye,
  Hat,
  StatName,
  SPECIES,
  RARITIES,
  RARITY_WEIGHTS,
  EYES,
  HATS,
  STAT_NAMES,
} from "./types";

const SALT = "friend-2026-401";

function pick<T>(rng: () => number, arr: readonly T[]): T {
  return arr[Math.floor(rng() * arr.length)]!;
}

function rollRarity(rng: () => number): Rarity {
  const total = Object.values(RARITY_WEIGHTS).reduce((a, b) => a + b, 0);
  let roll = rng() * total;
  for (const rarity of RARITIES) {
    roll -= RARITY_WEIGHTS[rarity];
    if (roll < 0) return rarity;
  }
  return "common";
}

const RARITY_FLOOR: Record<Rarity, number> = {
  common: 5,
  uncommon: 15,
  rare: 25,
  epic: 35,
  legendary: 50,
};

// One peak stat, one dump stat, rest scattered. Rarity bumps the floor.
function rollStats(
  rng: () => number,
  rarity: Rarity,
): Record<StatName, number> {
  const floor = RARITY_FLOOR[rarity];
  const peak = pick(rng, STAT_NAMES);
  let dump = pick(rng, STAT_NAMES);
  while (dump === peak) dump = pick(rng, STAT_NAMES);

  const stats = {} as Record<StatName, number>;
  for (const name of STAT_NAMES) {
    if (name === peak) {
      stats[name] = Math.min(100, floor + 50 + Math.floor(rng() * 30));
    } else if (name === dump) {
      stats[name] = Math.max(1, floor - 10 + Math.floor(rng() * 15));
    } else {
      stats[name] = floor + Math.floor(rng() * 40);
    }
  }
  return stats;
}

export function generateBuddy(input: string): Buddy {
  const key = input + SALT;
  const seed = hashString(key);
  const rng = mulberry32(seed);

  // Roll rarity first (independent of species)
  const rarity = rollRarity(rng);

  // Pick species from the full 18 list
  const species: Species = pick(rng, SPECIES);

  // Pick eye
  const eye: Eye = pick(rng, EYES);

  // Hat: only non-common rarities get hats
  const hat: Hat = rarity === "common" ? "none" : pick(rng, HATS);

  // Shiny check (1% — matches source)
  const isShiny = rng() < 0.01;

  // Stats with peak/dump system
  const stats = rollStats(rng, rarity);

  // Inspiration seed (consumed to stay in sync with source)
  const _inspirationSeed = Math.floor(rng() * 1e9);

  // Soul description
  const speciesData = SPECIES_DATA[species];
  const soulIdx = Math.floor(rng() * speciesData.soulDescriptions.length);
  const soulDescription = speciesData.soulDescriptions[soulIdx];

  // Palette
  const palette = isShiny ? speciesData.shinyPalette : speciesData.palette;

  return {
    species,
    rarity,
    eye,
    hat,
    isShiny,
    stats,
    soulDescription,
    palette,
    sprite: SPRITES[species],
    name: input,
  };
}
