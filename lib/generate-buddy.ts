import { mulberry32, hashString } from "./prng";
import { SPECIES_LIST } from "./species";
import { SPRITES } from "./sprites";
import { Buddy, Species, Rarity } from "./types";

interface WeightedSpecies {
  species: Species;
  rarity: Rarity;
  cumulativeWeight: number;
}

const WEIGHTED_TABLE: WeightedSpecies[] = (() => {
  const rarityWeights: Record<Rarity, number> = {
    Common: 0.45,
    Uncommon: 0.30,
    Rare: 0.15,
    Epic: 0.07,
    Legendary: 0.03,
  };

  const rarityCounts: Record<Rarity, number> = { Common: 0, Uncommon: 0, Rare: 0, Epic: 0, Legendary: 0 };
  for (const s of SPECIES_LIST) rarityCounts[s.rarity]++;

  const table: WeightedSpecies[] = [];
  let cumulative = 0;
  for (const s of SPECIES_LIST) {
    const weight = rarityWeights[s.rarity] / rarityCounts[s.rarity];
    cumulative += weight;
    table.push({ species: s.name, rarity: s.rarity, cumulativeWeight: cumulative });
  }
  return table;
})();

export function generateBuddy(input: string): Buddy {
  const seed = hashString(input);
  const rng = mulberry32(seed);

  // Species selection
  const speciesRoll = rng();
  let selectedIdx = 0;
  for (let i = 0; i < WEIGHTED_TABLE.length; i++) {
    if (speciesRoll < WEIGHTED_TABLE[i].cumulativeWeight) {
      selectedIdx = i;
      break;
    }
    if (i === WEIGHTED_TABLE.length - 1) selectedIdx = i;
  }
  const speciesEntry = SPECIES_LIST[selectedIdx];

  // Shiny check (4%)
  const isShiny = rng() < 0.04;

  // Stats (1-99)
  const stats = {
    vibe: Math.floor(rng() * 99) + 1,
    chaos: Math.floor(rng() * 99) + 1,
    focus: Math.floor(rng() * 99) + 1,
    luck: Math.floor(rng() * 99) + 1,
  };

  // Soul description
  const soulIdx = Math.floor(rng() * speciesEntry.soulDescriptions.length);
  const soulDescription = speciesEntry.soulDescriptions[soulIdx];

  // Palette
  const palette = isShiny ? speciesEntry.shinyPalette : speciesEntry.palette;

  return {
    species: speciesEntry.name,
    rarity: speciesEntry.rarity,
    isShiny,
    stats,
    soulDescription,
    palette,
    sprite: SPRITES[speciesEntry.name],
    name: input,
  };
}
