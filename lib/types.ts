export type Rarity = "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary";

export type Species =
  | "Blobbit"
  | "Gruntle"
  | "Pebblix"
  | "Snorb"
  | "Flickmouse"
  | "Mosscap"
  | "Dustbunni"
  | "Glimworm"
  | "Thornpup"
  | "Voidmaw"
  | "Crystalfin"
  | "Nebulynx";

export type SpriteGrid = (number | null)[][];

export interface BuddyStats {
  vibe: number;
  chaos: number;
  focus: number;
  luck: number;
}

export interface Buddy {
  species: Species;
  rarity: Rarity;
  isShiny: boolean;
  stats: BuddyStats;
  soulDescription: string;
  palette: string[];
  sprite: SpriteGrid;
  name: string;
}
