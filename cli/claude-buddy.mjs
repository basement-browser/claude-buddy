#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { homedir } from "os";
import { join } from "path";

// ─────────────────────────────────────────────────────────────────
// ANSI helpers
// ─────────────────────────────────────────────────────────────────
const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";
const DIM = "\x1b[2m";
const YELLOW = "\x1b[33m";
const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const CYAN = "\x1b[36m";
const GRAY = "\x1b[90m";
const BOLD_GREEN = "\x1b[32;1m";
const BOLD_YELLOW = "\x1b[33;1m";
const BOLD_RED = "\x1b[31;1m";
const BOLD_CYAN = "\x1b[36;1m";
const PURPLE = "\x1b[35m";

function ansi(code, text) { return `\x1b[${code}m${text}${RESET}`; }

function hexToRgb(hex) {
  return [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)];
}
function ansiBg(hex) {
  const [r, g, b] = hexToRgb(hex);
  return `\x1b[48;2;${r};${g};${b}m`;
}

function ctxColored(pct, text) {
  if (pct < 50) return ansi("32", text);
  if (pct < 80) return ansi("33", text);
  return ansi("31;1", text);
}

// ─────────────────────────────────────────────────────────────────
// Mulberry32 PRNG (from the leak)
// ─────────────────────────────────────────────────────────────────
function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(str) {
  const salted = str.toLowerCase().trim() + "friend-2026-401";
  let hash = 0;
  for (let i = 0; i < salted.length; i++) {
    const char = salted.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return hash;
}

// ─────────────────────────────────────────────────────────────────
// Species data
// ─────────────────────────────────────────────────────────────────
const SPECIES = [
  { name: "Blobbit",     rarity: "Common",    weight: 0.1125 },
  { name: "Gruntle",     rarity: "Common",    weight: 0.1125 },
  { name: "Pebblix",     rarity: "Common",    weight: 0.1125 },
  { name: "Snorb",       rarity: "Common",    weight: 0.1125 },
  { name: "Flickmouse",  rarity: "Uncommon",  weight: 0.10 },
  { name: "Mosscap",     rarity: "Uncommon",  weight: 0.10 },
  { name: "Dustbunni",   rarity: "Uncommon",  weight: 0.10 },
  { name: "Glimworm",    rarity: "Rare",      weight: 0.075 },
  { name: "Thornpup",    rarity: "Rare",      weight: 0.075 },
  { name: "Voidmaw",     rarity: "Epic",      weight: 0.035 },
  { name: "Crystalfin",  rarity: "Epic",      weight: 0.035 },
  { name: "Nebulynx",    rarity: "Legendary", weight: 0.03 },
];

const PALETTES = {
  Blobbit:    { normal: ["#7ec8a0","#5ba87e","#3d8a60","#2a5c40"], shiny: ["#a0f0c8","#70e0a0","#50d080","#30c060"] },
  Gruntle:    { normal: ["#d88a6e","#c47058","#a05842","#7a4030"], shiny: ["#ffb090","#ff9070","#ff7050","#ff5030"] },
  Pebblix:    { normal: ["#a0998e","#8a8378","#706a60","#585248"], shiny: ["#c8c0b0","#b0a898","#989080","#807868"] },
  Snorb:      { normal: ["#b8a0d0","#9880b0","#786090","#584070"], shiny: ["#e0c0ff","#c0a0ff","#a080ff","#8060ff"] },
  Flickmouse: { normal: ["#f0d060","#d0b040","#b09020","#907010"], shiny: ["#fff080","#ffe060","#ffd040","#ffc020"] },
  Mosscap:    { normal: ["#90c070","#70a050","#508030","#306020"], shiny: ["#b0ff90","#90ff70","#70ff50","#50ff30"] },
  Dustbunni:  { normal: ["#d0c0b8","#b8a8a0","#a09088","#887870"], shiny: ["#f0e0d8","#e0d0c8","#d0c0b8","#c0b0a8"] },
  Glimworm:   { normal: ["#80e0a0","#60c080","#40a060","#208040"], shiny: ["#a0ffc0","#80ffa0","#60ff80","#40ff60"] },
  Thornpup:   { normal: ["#c07050","#a05838","#804028","#602818"], shiny: ["#ff9070","#ff7858","#ff6040","#ff4828"] },
  Voidmaw:    { normal: ["#483858","#382848","#281838","#180828"], shiny: ["#6858a8","#5848a0","#483898","#382890"] },
  Crystalfin: { normal: ["#80c0e0","#60a0c8","#4080b0","#206098"], shiny: ["#a0e0ff","#80d0ff","#60c0ff","#40b0ff"] },
  Nebulynx:   { normal: ["#a070d0","#7850b0","#503890","#302070"], shiny: ["#d0a0ff","#c080ff","#b060ff","#a040ff"] },
};

const SOULS = {
  Blobbit:    ["Vibrates gently when content. Which is always.", "Has never had a bad thought. Literally incapable.", "Will sit on your keyboard and purr at 60hz.", "Somehow already knows your WiFi password."],
  Gruntle:    ["Snorts when it laughs. Which is constantly.", "Will eat literally anything you put in front of it.", "Thinks it's much bigger than it actually is.", "Has strong opinions about code formatting."],
  Pebblix:    ["Hasn't moved in three days. Might be meditating.", "Is technically older than the sun.", "Extremely patient. Will wait for your build to finish.", "Makes a satisfying *clonk* sound when tapped."],
  Snorb:      ["Leaves a trail of glitter wherever it goes.", "Moves at exactly one commit per hour.", "Its shell contains an entire git history.", "Somehow always knows the optimal database index."],
  Flickmouse: ["Moves so fast it appears to be in two terminals at once.", "Has chewed through seventeen USB cables this week.", "Types faster than you. Sorry.", "Its tail generates enough static to crash a MacBook."],
  Mosscap:    ["Photosynthesizes during standups.", "Has been growing since the last major version bump.", "Distributes spores that improve code coverage.", "Technically counts as a dev dependency."],
  Dustbunni:  ["Formed spontaneously under your desk last Tuesday.", "Allergic to clean code. Prefers legacy systems.", "Reproduces asexually in dusty server rooms.", "Has seen things in the node_modules folder."],
  Glimworm:   ["Bioluminescent. Doubles as a night light and a linter.", "Each segment represents a successfully merged PR.", "Glows brighter near well-documented code.", "Can debug your code just by crawling over it."],
  Thornpup:   ["Loyal. Will guard your staging environment with its life.", "The spikes are mostly decorative. Mostly.", "Fetches thrown exceptions and brings them back.", "Growls at anyone who pushes directly to main."],
  Voidmaw:    ["Consumes deprecated APIs. You're welcome.", "Where does the code go? Nobody knows.", "Has a mouth where its body should be. Works fine.", "Stares into the void. The void files a bug report."],
  Crystalfin: ["Each crystal contains a perfectly optimized algorithm.", "Swims through data streams like they're water.", "Its fins refract light into valid JSON.", "Was discovered in a deep lake of unprocessed logs."],
  Nebulynx:   ["Contains an entire universe in its fur. No big deal.", "Has seen every possible git timeline. Chose this one.", "Purrs at a frequency that resolves merge conflicts.", "Legends say it wrote the first line of code. Ever."],
};

const _ = null;
const SPRITES = {
  Blobbit: [
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],[_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,1,1,1,1,1,1,_,_,_,_,_],[_,_,_,_,1,0,0,0,0,0,0,1,_,_,_,_],
    [_,_,_,1,0,0,0,0,0,0,0,0,1,_,_,_],[_,_,1,0,0,0,0,0,0,0,0,0,0,1,_,_],
    [_,_,1,0,0,3,0,0,0,3,0,0,0,1,_,_],[_,_,1,0,0,0,0,0,0,0,0,0,0,1,_,_],
    [_,_,1,0,0,0,0,0,0,0,0,0,0,1,_,_],[_,_,1,0,0,0,2,2,2,0,0,0,0,1,_,_],
    [_,_,_,1,0,0,0,0,0,0,0,0,1,_,_,_],[_,_,_,1,0,0,0,0,0,0,0,0,1,_,_,_],
    [_,_,_,_,1,1,1,1,1,1,1,1,_,_,_,_],[_,_,_,_,_,2,2,_,_,2,2,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],[_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  ],
  Gruntle: [
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],[_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
    [_,_,_,1,1,_,_,_,_,_,_,1,1,_,_,_],[_,_,_,1,0,1,_,_,_,_,1,0,1,_,_,_],
    [_,_,_,_,1,0,1,1,1,1,0,1,_,_,_,_],[_,_,_,_,0,0,0,0,0,0,0,0,_,_,_,_],
    [_,_,_,0,0,3,0,0,0,0,3,0,0,_,_,_],[_,_,_,0,0,0,0,0,0,0,0,0,0,_,_,_],
    [_,_,0,0,0,0,2,2,2,2,0,0,0,0,_,_],[_,_,0,0,0,0,2,3,3,2,0,0,0,0,_,_],
    [_,_,0,0,0,0,0,0,0,0,0,0,0,0,_,_],[_,_,_,1,0,0,0,0,0,0,0,0,1,_,_,_],
    [_,_,_,_,1,1,1,1,1,1,1,1,_,_,_,_],[_,_,_,_,_,2,_,_,_,_,2,_,_,_,_,_],
    [_,_,_,_,2,2,_,_,_,2,2,_,_,_,_,_],[_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  ],
  Pebblix: [
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],[_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],[_,_,_,_,_,_,2,2,2,2,_,_,_,_,_,_],
    [_,_,_,_,_,2,1,1,1,1,2,_,_,_,_,_],[_,_,_,_,2,1,0,0,0,0,1,2,_,_,_,_],
    [_,_,_,2,1,0,0,0,0,0,0,1,2,_,_,_],[_,_,2,1,0,0,3,0,0,3,0,0,1,2,_,_],
    [_,_,2,0,0,0,0,0,0,0,0,0,0,2,_,_],[_,_,2,0,0,0,0,0,0,0,0,0,0,2,_,_],
    [_,_,_,2,0,0,0,2,2,0,0,0,2,_,_,_],[_,_,_,_,2,1,1,1,1,1,1,2,_,_,_,_],
    [_,_,_,_,_,2,2,2,2,2,2,_,_,_,_,_],[_,_,_,_,_,3,_,_,_,3,_,_,_,_,_,_],
    [_,_,_,_,3,3,_,_,3,3,_,_,_,_,_,_],[_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  ],
  Snorb: [
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],[_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,2,2,2,_,_,_,_],[_,_,_,_,_,_,_,_,2,1,1,1,2,_,_,_],
    [_,_,_,_,_,_,_,2,1,3,3,1,2,_,_,_],[_,_,_,_,_,_,_,2,1,3,1,1,2,_,_,_],
    [_,_,_,_,_,_,_,2,1,1,1,1,2,_,_,_],[_,_,_,1,1,_,_,_,2,2,2,2,_,_,_,_],
    [_,_,1,0,0,1,_,_,_,_,_,_,_,_,_,_],[_,_,1,0,3,0,1,1,1,1,1,1,_,_,_,_],
    [_,_,_,0,0,0,0,0,0,0,0,0,1,_,_,_],[_,_,_,0,0,0,0,0,0,0,0,0,0,_,_,_],
    [_,_,_,_,2,2,2,2,2,2,2,2,_,_,_,_],[_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],[_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  ],
  Flickmouse: [
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],[_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
    [_,_,1,1,_,_,_,_,_,_,1,1,_,_,_,_],[_,1,0,0,1,_,_,_,_,1,0,0,1,_,_,_],
    [_,1,2,0,0,1,_,_,1,0,0,2,1,_,_,_],[_,_,1,0,0,0,1,1,0,0,0,1,_,_,_,_],
    [_,_,_,1,0,3,0,0,3,0,1,_,_,_,_,_],[_,_,_,1,0,0,0,0,0,0,1,_,_,_,_,_],
    [_,_,_,_,1,0,2,2,0,1,_,_,_,_,_,_],[_,_,_,_,_,1,0,0,1,_,_,_,_,_,_,_],
    [_,_,_,_,_,1,0,0,1,_,_,_,_,_,_,_],[_,_,_,_,_,_,1,1,_,_,_,2,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,2,_,_,_,_,_],[_,_,_,_,_,3,_,_,3,2,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],[_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  ],
  Mosscap: [
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],[_,_,_,_,_,_,2,2,2,2,_,_,_,_,_,_],
    [_,_,_,_,2,2,0,0,0,0,2,2,_,_,_,_],[_,_,_,2,0,0,0,1,1,0,0,0,2,_,_,_],
    [_,_,2,0,0,1,0,0,0,0,1,0,0,2,_,_],[_,2,0,0,0,0,0,0,0,0,0,0,0,0,2,_],
    [_,2,0,0,1,0,0,0,0,0,0,1,0,0,2,_],[_,_,2,2,2,2,2,2,2,2,2,2,2,2,_,_],
    [_,_,_,_,_,_,3,3,3,3,_,_,_,_,_,_],[_,_,_,_,_,_,3,3,3,3,_,_,_,_,_,_],
    [_,_,_,_,_,3,1,3,3,1,3,_,_,_,_,_],[_,_,_,_,_,3,0,3,3,0,3,_,_,_,_,_],
    [_,_,_,_,_,_,3,3,3,3,_,_,_,_,_,_],[_,_,_,_,_,_,2,_,_,2,_,_,_,_,_,_],
    [_,_,_,_,_,2,2,_,_,2,2,_,_,_,_,_],[_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  ],
  Dustbunni: [
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],[_,_,_,2,2,_,_,_,_,2,2,_,_,_,_,_],
    [_,_,2,1,0,2,_,_,2,0,1,2,_,_,_,_],[_,_,2,0,0,2,_,_,2,0,0,2,_,_,_,_],
    [_,_,_,2,0,1,2,2,1,0,2,_,_,_,_,_],[_,_,_,2,0,0,0,0,0,0,2,_,_,_,_,_],
    [_,_,2,0,0,3,0,0,3,0,0,2,_,_,_,_],[_,_,2,0,0,0,0,0,0,0,0,2,_,_,_,_],
    [_,_,2,0,0,0,1,1,0,0,0,2,_,_,_,_],[_,_,_,2,0,0,0,0,0,0,2,_,_,_,_,_],
    [_,_,_,2,0,0,0,0,0,0,2,_,_,_,_,_],[_,_,_,_,2,0,0,0,0,2,_,_,_,_,_,_],
    [_,_,_,_,_,2,2,2,2,_,_,_,_,_,_,_],[_,_,_,_,_,1,_,_,1,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],[_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  ],
  Glimworm: [
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],[_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],[_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
    [_,_,_,2,2,2,_,_,_,_,_,_,_,_,_,_],[_,_,2,0,0,0,2,_,_,_,_,_,_,_,_,_],
    [_,_,2,3,0,3,2,_,_,_,_,_,_,_,_,_],[_,_,2,0,1,0,2,_,_,_,_,_,_,_,_,_],
    [_,_,_,2,0,2,1,2,_,_,_,_,_,_,_,_],[_,_,_,_,2,0,0,0,2,_,_,_,_,_,_,_],
    [_,_,_,_,_,2,1,2,0,2,_,_,_,_,_,_],[_,_,_,_,_,_,2,0,0,0,2,_,_,_,_,_],
    [_,_,_,_,_,_,_,2,1,2,0,2,_,_,_,_],[_,_,_,_,_,_,_,_,2,0,0,0,2,_,_,_],
    [_,_,_,_,_,_,_,_,_,2,2,2,_,_,_,_],[_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  ],
  Thornpup: [
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],[_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
    [_,_,2,2,_,_,_,2,_,2,_,2,_,_,_,_],[_,2,0,0,2,_,_,_,2,_,2,_,_,_,_,_],
    [_,2,0,0,0,2,2,2,2,2,2,2,_,_,_,_],[_,_,2,0,3,0,0,0,0,0,0,0,2,_,_,_],
    [_,_,2,0,0,0,0,0,0,0,0,0,2,_,_,_],[_,_,_,2,0,0,0,0,0,0,0,0,0,2,_,_],
    [_,_,_,2,0,0,0,0,0,0,0,0,0,2,_,_],[_,_,_,_,2,0,0,0,0,0,0,0,2,_,_,_],
    [_,_,_,_,2,0,0,0,0,0,0,0,2,_,_,_],[_,_,_,_,_,2,1,_,_,_,1,2,_,2,_,_],
    [_,_,_,_,_,2,2,_,_,_,2,2,_,2,_,_],[_,_,_,_,_,_,_,_,_,_,_,_,2,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],[_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  ],
  Voidmaw: [
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],[_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,0,_,_,_,_,_,0,_,_,_,_,_],[_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,2,2,2,2,2,2,2,2,_,_,_,_],[_,_,_,2,1,1,1,1,1,1,1,1,2,_,_,_],
    [_,_,2,1,1,1,1,1,1,1,1,1,1,2,_,_],[_,2,3,3,3,3,3,3,3,3,3,3,3,3,2,_],
    [_,2,0,3,0,3,0,3,0,3,0,3,0,3,2,_],[_,_,2,3,3,3,3,3,3,3,3,3,3,2,_,_],
    [_,_,_,2,1,1,1,1,1,1,1,1,2,_,_,_],[_,_,_,_,2,2,2,2,2,2,2,2,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],[_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],[_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  ],
  Crystalfin: [
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],[_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,2,_,_,_,_,_,_,_],[_,_,_,_,_,_,_,2,1,2,_,_,_,_,_,_],
    [_,_,_,_,_,2,2,1,0,1,2,_,_,_,_,_],[_,_,_,_,2,1,0,0,0,0,0,2,_,_,_,_],
    [_,_,2,2,1,0,0,3,0,0,0,0,2,2,_,_],[_,2,1,0,0,0,0,0,0,0,0,0,0,1,2,_],
    [_,_,2,0,0,0,0,0,0,0,0,0,0,2,_,_],[_,_,_,2,1,0,0,0,0,0,0,1,2,_,_,_],
    [_,_,_,_,2,2,0,0,0,0,2,2,_,_,_,_],[_,_,_,_,_,_,2,1,1,2,1,_,_,_,_,_],
    [_,_,_,_,_,_,_,2,2,_,1,2,_,_,_,_],[_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],[_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  ],
  Nebulynx: [
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],[_,_,2,2,_,_,_,_,_,_,_,2,2,_,_,_],
    [_,2,1,0,2,_,_,_,_,_,2,0,1,2,_,_],[_,_,2,0,0,2,2,2,2,2,0,0,2,_,_,_],
    [_,_,_,2,0,0,0,0,0,0,0,2,_,_,_,_],[_,_,_,2,0,3,0,0,0,3,0,2,_,_,_,_],
    [_,_,_,2,0,0,0,1,0,0,0,2,_,_,_,_],[_,_,2,0,0,0,0,0,0,0,0,0,2,_,_,_],
    [_,2,0,1,0,0,0,0,0,0,0,1,0,2,_,_],[_,2,0,0,0,0,1,0,1,0,0,0,0,2,_,_],
    [_,_,2,0,0,0,0,0,0,0,0,0,2,_,_,_],[_,_,_,2,0,0,0,0,0,0,0,2,_,_,_,_],
    [_,_,_,_,2,2,_,_,_,2,2,_,_,_,_,_],[_,_,_,_,3,_,_,_,_,_,3,_,_,_,_,_],
    [_,_,_,3,3,_,_,_,_,3,3,_,_,_,_,_],[_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  ],
};

const RARITY_ANSI = {
  Common:    "37",
  Uncommon:  "32",
  Rare:      "34",
  Epic:      "35",
  Legendary: "33;1",
};

// ─────────────────────────────────────────────────────────────────
// Buddy generation
// ─────────────────────────────────────────────────────────────────
function generateBuddy(input) {
  const seed = hashString(input);
  const rng = mulberry32(seed);
  const speciesRoll = rng();
  let cumulative = 0;
  let selected = SPECIES[0];
  for (const s of SPECIES) {
    cumulative += s.weight;
    if (speciesRoll < cumulative) { selected = s; break; }
  }
  const isShiny = rng() < 0.04;
  const stats = {
    vibe:  Math.floor(rng() * 99) + 1,
    chaos: Math.floor(rng() * 99) + 1,
    focus: Math.floor(rng() * 99) + 1,
    luck:  Math.floor(rng() * 99) + 1,
  };
  const souls = SOULS[selected.name];
  const soulIdx = Math.floor(rng() * souls.length);
  const palettes = PALETTES[selected.name];
  return {
    species: selected.name,
    rarity: selected.rarity,
    isShiny,
    stats,
    soul: souls[soulIdx],
    palette: isShiny ? palettes.shiny : palettes.normal,
    sprite: SPRITES[selected.name],
  };
}

// ─────────────────────────────────────────────────────────────────
// Usage tracking (mirrors claude-usage-rs logic)
// ─────────────────────────────────────────────────────────────────
function claudeConfigDir() {
  return process.env.CLAUDE_CONFIG_DIR || join(homedir(), ".claude");
}

function loadUsageState() {
  const p = join(claudeConfigDir(), "usage-tracker.json");
  if (!existsSync(p)) return { sessions: {}, daily: {}, weekly: {} };
  try { return JSON.parse(readFileSync(p, "utf-8")); } catch { return { sessions: {}, daily: {}, weekly: {} }; }
}

function isoWeekKey(d) {
  // ISO week calculation
  const date = new Date(d);
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((date - yearStart) / 86400000 + 1) / 7);
  return `${date.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

function loadWindowsConfig() {
  const searchPaths = [
    join(claudeConfigDir(), "usage-windows.json"),
    join(homedir(), ".claude", "usage-windows.json"),
  ];
  for (const p of searchPaths) {
    if (existsSync(p)) {
      try { return JSON.parse(readFileSync(p, "utf-8")); } catch { continue; }
    }
  }
  return null;
}

// ─────────────────────────────────────────────────────────────────
// Window evaluation (port of claude-usage-rs logic)
// ─────────────────────────────────────────────────────────────────
function matchesSchedule(schedule, now) {
  if (schedule.type === "always") return true;
  if (schedule.type === "inverse_recurring") return !matchesSchedule(schedule.base, now);
  if (schedule.type === "recurring") {
    const dayNames = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    const dayName = dayNames[now.getUTCDay()];
    if (!schedule.days.includes(dayName)) return false;
    const [sh, sm] = schedule.utc_start.split(":").map(Number);
    const [eh, em] = schedule.utc_end.split(":").map(Number);
    const startMin = sh * 60 + sm;
    const endMin = eh * 60 + em;
    const nowMin = now.getUTCHours() * 60 + now.getUTCMinutes();
    if (startMin <= endMin) return nowMin >= startMin && nowMin < endMin;
    return nowMin >= startMin || nowMin < endMin; // wraps midnight
  }
  return false;
}

function minsUntilBoundary(schedule, now, wantStart) {
  // Check up to 7 days ahead
  for (let m = 1; m <= 10080; m++) {
    const future = new Date(now.getTime() + m * 60000);
    const matches = matchesSchedule(schedule, future);
    if (wantStart && matches) return m;
    if (!wantStart && !matches) return m;
  }
  return null;
}

function evaluateWindows(config, now) {
  if (!config || !config.windows) return { multiplier: 1.0, favorable: false, windows: [] };

  let bestMult = 1.0;
  let favorable = false;
  const active = [];

  for (const w of config.windows) {
    const start = new Date(w.active_range.start);
    const end = new Date(w.active_range.end);
    if (now < start || now > end) continue;

    const activeTier = w.tiers.find(t => matchesSchedule(t.schedule, now));
    if (!activeTier) continue;

    const minsChange = minsUntilBoundary(activeTier.schedule, now, false);
    const minsFavorable = !activeTier.favorable
      ? w.tiers.filter(t => t.favorable).map(t => minsUntilBoundary(t.schedule, now, true)).filter(Boolean)[0]
      : null;

    if (activeTier.multiplier > bestMult) bestMult = activeTier.multiplier;
    if (activeTier.favorable) favorable = true;

    active.push({
      label: w.label,
      tier: activeTier,
      minsUntilChange: minsChange,
      minsUntilFavorable: minsFavorable,
      promoEndsIn: Math.max(0, Math.floor((end - now) / 60000)),
    });
  }

  return { multiplier: bestMult, favorable, windows: active };
}

// ─────────────────────────────────────────────────────────────────
// Formatting helpers
// ─────────────────────────────────────────────────────────────────
function fmtMins(m) {
  if (m == null) return "—";
  if (m >= 525600) return "ongoing";
  if (m >= 1440) return `${Math.floor(m / 1440)}d ${Math.floor((m % 1440) / 60)}h`;
  if (m >= 60) return `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, "0")}m`;
  return `${m}m`;
}

function fmtTokens(n) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}m`;
  if (n >= 10000) return `${Math.round(n / 1000)}k`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

function bar(val, max, width) {
  const filled = Math.round((val / max) * width);
  return "█".repeat(Math.min(filled, width)) + "░".repeat(width - Math.min(filled, width));
}

function ctxBar(pct, width) {
  return bar(pct, 100, width);
}

// ─────────────────────────────────────────────────────────────────
// Render buddy sprite as array of lines (for side-by-side layout)
// ─────────────────────────────────────────────────────────────────
function renderSpriteLines(buddy) {
  const { sprite, palette, isShiny } = buddy;
  const lines = [];
  if (isShiny) lines.push(`  ${YELLOW}${"* ".repeat(17)}${RESET}`);
  for (let y = 0; y < 16; y++) {
    let line = isShiny ? `  ${YELLOW}*${RESET}` : "  ";
    for (let x = 0; x < 16; x++) {
      const idx = sprite[y]?.[x];
      if (idx !== null && idx !== undefined) {
        line += ansiBg(palette[idx]) + "  " + RESET;
      } else {
        line += "  ";
      }
    }
    if (isShiny) line += `${YELLOW}*${RESET}`;
    lines.push(line);
  }
  if (isShiny) lines.push(`  ${YELLOW}${"* ".repeat(17)}${RESET}`);
  return lines;
}

// ─────────────────────────────────────────────────────────────────
// Main dashboard render
// ─────────────────────────────────────────────────────────────────
function renderDashboard(buddy, usageState, windowStatus) {
  const now = new Date();
  const dayKey = now.toISOString().slice(0, 10);
  const weekKey = isoWeekKey(now);
  const dayTotal = usageState.daily?.[dayKey] || 0;
  const weekTotal = usageState.weekly?.[weekKey] || 0;

  const spriteLines = renderSpriteLines(buddy);
  const shinyTag = buddy.isShiny ? ` ${YELLOW}${BOLD}SHINY${RESET}` : "";
  const rarityColor = RARITY_ANSI[buddy.rarity];

  // Build right-side info lines
  const info = [];

  // Header
  info.push(`${BOLD}${buddy.species}${RESET}${shinyTag}  ${ansi(rarityColor, `[${buddy.rarity}]`)}`);
  info.push("");

  // Stats
  info.push(`  ${DIM}VIBE ${RESET} ${bar(buddy.stats.vibe, 99, 12)}  ${buddy.stats.vibe}`);
  info.push(`  ${DIM}CHAOS${RESET} ${bar(buddy.stats.chaos, 99, 12)}  ${buddy.stats.chaos}`);
  info.push(`  ${DIM}FOCUS${RESET} ${bar(buddy.stats.focus, 99, 12)}  ${buddy.stats.focus}`);
  info.push(`  ${DIM}LUCK ${RESET} ${bar(buddy.stats.luck, 99, 12)}  ${buddy.stats.luck}`);
  info.push("");

  // Soul
  info.push(`  ${DIM}"${buddy.soul}"${RESET}`);
  info.push("");

  // Separator
  info.push(`  ${GRAY}${"─".repeat(36)}${RESET}`);
  info.push("");

  // Usage section
  info.push(`  ${BOLD}USAGE${RESET}`);

  // Window status (peak/off-peak)
  if (windowStatus.windows.length > 0) {
    if (windowStatus.favorable) {
      const w = windowStatus.windows.find(w => w.tier.favorable);
      const endsIn = w ? fmtMins(w.minsUntilChange) : "—";
      info.push(`  ${BOLD_GREEN}⚡ ${windowStatus.multiplier}x OFF-PEAK${RESET}  ${DIM}ends in ${endsIn}${RESET}`);
    } else {
      const w = windowStatus.windows.find(w => !w.tier.favorable);
      const nextFav = w?.minsUntilFavorable;
      info.push(`  ${BOLD_YELLOW}· ${windowStatus.multiplier}x PEAK${RESET}  ${DIM}off-peak in ${fmtMins(nextFav)}${RESET}`);
    }
  } else {
    info.push(`  ${DIM}No active promotions${RESET}`);
  }

  // Token counts
  if (dayTotal > 0 || weekTotal > 0) {
    const dayStr = dayTotal > 0 ? `day ${fmtTokens(dayTotal)}` : "day 0";
    const weekStr = weekTotal > 0 ? `week ${fmtTokens(weekTotal)}` : "week 0";
    info.push(`  ${DIM}tokens:${RESET} ${dayStr} │ ${weekStr}`);
  } else {
    info.push(`  ${DIM}tokens: no data yet${RESET}`);
  }

  // Now render side by side
  console.log();
  console.log(`  ${GRAY}┌${"─".repeat(34)}┐${RESET}`);

  const maxLines = Math.max(spriteLines.length, info.length);
  for (let i = 0; i < maxLines; i++) {
    const left = spriteLines[i] || " ".repeat(34);
    const right = info[i] || "";
    // Sprite is 34 chars visible (2px * 16 + 2 margin), then info on the right
    if (i < spriteLines.length) {
      console.log(`${left}  ${GRAY}│${RESET} ${right}`);
    } else {
      console.log(`${"  " + " ".repeat(32)}  ${GRAY}│${RESET} ${right}`);
    }
  }
  console.log(`  ${GRAY}└${"─".repeat(34)}┘${RESET}`);
  console.log();
}

// ─────────────────────────────────────────────────────────────────
// Statusline mode (compact, for Claude Code status bar)
// ─────────────────────────────────────────────────────────────────
function renderStatusline(buddy, windowStatus) {
  const parts = [];

  // Buddy emoji + name
  const shinyMark = buddy.isShiny ? "✦" : "";
  parts.push(ansi(RARITY_ANSI[buddy.rarity], `${shinyMark}${buddy.species}`));

  // Window status
  if (windowStatus.windows.length > 0) {
    if (windowStatus.favorable) {
      parts.push(ansi("32;1", `⚡${windowStatus.multiplier}x`));
    } else {
      parts.push(ansi("33;1", `·${windowStatus.multiplier}x`));
    }
  }

  console.log(parts.join(" │ "));
}

// ─────────────────────────────────────────────────────────────────
// Get userId
// ─────────────────────────────────────────────────────────────────
function getUserId() {
  const configPath = join(homedir(), ".claude.json");
  if (!existsSync(configPath)) return null;
  try {
    const config = JSON.parse(readFileSync(configPath, "utf-8"));
    return config.userID || null;
  } catch { return null; }
}

// ─────────────────────────────────────────────────────────────────
// CLI
// ─────────────────────────────────────────────────────────────────
function printHelp() {
  console.log(`
  ${BOLD}claude-buddy${RESET} — your Claude Code companion + usage tracker

  ${DIM}USAGE${RESET}
    node claude-buddy.mjs                  Show your buddy + usage dashboard
    node claude-buddy.mjs "name"           Generate buddy for any name
    node claude-buddy.mjs --statusline     Compact output for Claude Code status bar
    node claude-buddy.mjs --buddy-only     Just show the buddy (no usage)
    node claude-buddy.mjs --id             Print your Claude Code userId

  ${DIM}FLAGS${RESET}
    --auto, -a       Use your Claude Code userId (default when no args)
    --statusline     Compact 1-line output for status bar integration
    --buddy-only     Skip usage tracking, just show the buddy
    --id             Print your userId and exit
    --help, -h       Show this help
`);
}

function main() {
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.includes("-h")) {
    printHelp();
    return;
  }

  // --id: just print userId
  if (args.includes("--id")) {
    const userId = getUserId();
    if (userId) {
      console.log(userId);
    } else {
      console.error(`${BOLD}Could not find userId.${RESET} Make sure ~/.claude.json exists.`);
      console.error(`${DIM}Get your userId: cat ~/.claude.json | grep -o '"userID":"[^"]*"' | cut -d'"' -f4${RESET}`);
      process.exit(1);
    }
    return;
  }

  // Determine input
  const isStatusline = args.includes("--statusline");
  const isBuddyOnly = args.includes("--buddy-only");
  const isAuto = args.includes("--auto") || args.includes("-a");
  const nameArgs = args.filter(a => !a.startsWith("-"));

  let input;
  if (nameArgs.length > 0) {
    input = nameArgs.join(" ");
  } else {
    // Default: auto-detect from userId
    const userId = getUserId();
    if (!userId) {
      console.error(`\n  ${BOLD}Could not find ~/.claude.json${RESET}`);
      console.error(`  ${DIM}Pass a name manually:  node claude-buddy.mjs "your-name"${RESET}\n`);
      process.exit(1);
    }
    input = userId;
    if (!isStatusline) {
      console.log(`  ${DIM}Claude Code userId: ${userId.slice(0, 12)}...${RESET}`);
    }
  }

  const buddy = generateBuddy(input);

  // Load usage + window config
  const usageState = loadUsageState();
  const windowsConfig = loadWindowsConfig();
  const windowStatus = evaluateWindows(windowsConfig, new Date());

  if (isStatusline) {
    renderStatusline(buddy, windowStatus);
  } else if (isBuddyOnly) {
    // Just render the sprite + stats
    const spriteLines = renderSpriteLines(buddy);
    const shinyTag = buddy.isShiny ? ` ${YELLOW}${BOLD}SHINY${RESET}` : "";
    console.log();
    console.log(`  ${BOLD}${buddy.species}${RESET}${shinyTag}  ${ansi(RARITY_ANSI[buddy.rarity], `[${buddy.rarity}]`)}`);
    console.log();
    spriteLines.forEach(l => console.log(l));
    console.log();
    console.log(`  ${DIM}VIBE ${RESET} ${bar(buddy.stats.vibe, 99, 16)}  ${buddy.stats.vibe}`);
    console.log(`  ${DIM}CHAOS${RESET} ${bar(buddy.stats.chaos, 99, 16)}  ${buddy.stats.chaos}`);
    console.log(`  ${DIM}FOCUS${RESET} ${bar(buddy.stats.focus, 99, 16)}  ${buddy.stats.focus}`);
    console.log(`  ${DIM}LUCK ${RESET} ${bar(buddy.stats.luck, 99, 16)}  ${buddy.stats.luck}`);
    console.log();
    console.log(`  ${DIM}"${buddy.soul}"${RESET}`);
    console.log();
  } else {
    renderDashboard(buddy, usageState, windowStatus);
  }
}

main();
