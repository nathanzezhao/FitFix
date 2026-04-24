// Seasonal-style color palettes mapped to undertone.
// These are the "hero" colors we'll bias outfit selection toward.
export const PALETTES = {
  warm: {
    name: "Warm — Autumn/Spring",
    blurb:
      "Earthy, golden, sun-baked. Rust, olive, mustard, camel, cream, terracotta.",
    hexes: [
      "#B45A3C", // rust
      "#C48B3F", // mustard
      "#7A5E3B", // tobacco
      "#D4B483", // camel
      "#6B8E4E", // olive
      "#8B3A2F", // burnt brick
      "#E8C072", // honey
      "#4A3828", // espresso
    ],
  },
  cool: {
    name: "Cool — Winter/Summer",
    blurb:
      "Clean, jewel-toned, crisp. Navy, burgundy, plum, icy blue, charcoal, cool white.",
    hexes: [
      "#2C3E50", // deep navy
      "#5B7B9A", // slate blue
      "#8B2C5F", // plum
      "#3D5A80", // cool blue
      "#98B4B7", // sea glass
      "#BFA0C4", // dusty lilac
      "#1C2E4A", // ink navy
      "#E0E6EB", // cool white
    ],
  },
  neutral: {
    name: "Neutral",
    blurb:
      "Muted and versatile. Taupe, sage, stone, off-black, warm grey, soft white.",
    hexes: [
      "#2A2A2A", // off-black
      "#8A7F72", // taupe
      "#C2B7A3", // stone
      "#5E6B5E", // sage
      "#A69D8A", // oat
      "#463D33", // bark
      "#D4CBB7", // oat white
      "#6E6A62", // warm grey
    ],
  },
};

// Given a hex, classify which palette bucket it "feels" closest to.
export function bucketForHex(hex) {
  const { r, g, b } = hexToRgb(hex);
  const warmth = (r + g) / 2 - b; // yellow signal
  const chroma =
    Math.max(r, g, b) - Math.min(r, g, b); // colorfulness
  if (chroma < 30) return "neutral";
  if (warmth > 20) return "warm";
  return "cool";
}

// Straight-line RGB distance between two hex colors. 0 = identical, ~441 = max.
// Good enough for "is this item color close to a favorite color" scoring.
export function hexDistance(a, b) {
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  const dr = A.r - B.r;
  const dg = A.g - B.g;
  const db = A.b - B.b;
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

// Closest distance from `hex` to any color in `favs`. Useful for scoring.
export function nearestFavDistance(hex, favs) {
  if (!favs || !favs.length) return Infinity;
  let min = Infinity;
  for (const f of favs) {
    const d = hexDistance(hex, f);
    if (d < min) min = d;
  }
  return min;
}

// ——— Korean-celeb / Musinsa color palettes ———
// Curated clusters you see on K-drama actors, idols off-duty, and Musinsa
// street snaps. Outfits that fall inside one of these clusters read Korean.
// Keep the list tight on purpose — too many clusters and nothing is special.
export const KOREAN_PALETTES = [
  {
    name: "Cream & Camel",
    hexes: [
      "#ECE5D3", "#F3EFE6", "#E8DDC6", "#D4CBB7", "#D4B483",
      "#C2B7A3", "#A69D8A", "#C48B3F", "#B45A3C", "#8A7F72",
      "#7A5E3B", "#4A3828", "#463D33",
    ],
  },
  {
    name: "Ink & Shadow",
    hexes: [
      "#0f0e0c", "#1A1916", "#151311", "#2A2A2A", "#4A4A52",
      "#6A6A72", "#8A8A92", "#A6A6A6", "#C0C0C8",
    ],
  },
  {
    name: "Navy & Slate",
    hexes: [
      "#1C2E4A", "#2C3E50", "#3D5A80", "#5B7B9A", "#6A8BB5",
      "#98B4B7", "#E0E6EB", "#4A6B87",
    ],
  },
  {
    name: "Olive & Sage",
    hexes: [
      "#5E6B3A", "#6B8E4E", "#4A4E2A", "#8BA68B", "#5E6B5E",
      "#0C4A2A",
    ],
  },
  {
    name: "Oxblood & Plum",
    hexes: [
      "#8B2C5F", "#8B3A2F", "#6B1F3D",
    ],
  },
  {
    name: "Soft Pastels",
    hexes: [
      "#E8B4B8", "#BFA0C4", "#E8C072", "#E8E0D2",
    ],
  },
];

// True-neutral colors act as bridges — they pair with any K-palette.
const TRUE_NEUTRAL_HEXES = [
  "#F3EFE6", "#ECE5D3", "#F6F2EA", "#E8DDC6", // creams / whites
  "#0f0e0c", "#1A1916", "#151311", // black / ink
  "#A6A6A6", "#8A8A92", "#C0C0C8", // greys / silver
  "#2A2A2A", "#463D33", "#8A7F72", // warm greys
];

export function isTrueNeutral(hex, threshold = 25) {
  for (const n of TRUE_NEUTRAL_HEXES) {
    if (hexDistance(hex, n) < threshold) return true;
  }
  return false;
}

// Which Korean palette is this hex closest to? Returns name + min distance.
export function closestKoreanPalette(hex) {
  let best = { name: null, dist: Infinity };
  for (const p of KOREAN_PALETTES) {
    for (const h of p.hexes) {
      const d = hexDistance(hex, h);
      if (d < best.dist) best = { name: p.name, dist: d };
    }
  }
  return best;
}

// Do two colors sit comfortably inside one Korean palette? Threshold = 70
// means "within the same cluster of the palette."
export function inSameKoreanPalette(a, b, threshold = 70) {
  const A = closestKoreanPalette(a);
  const B = closestKoreanPalette(b);
  return (
    A.name &&
    A.name === B.name &&
    A.dist < threshold &&
    B.dist < threshold
  );
}

// Color-harmony score between two garment colors, K-style.
// High = they belong together on the same body.
// 0..35 range.
export function koreanHarmony(a, b) {
  if (!a || !b) return 0;
  const d = hexDistance(a, b);
  // Near-tonal: the same color with a slight value shift. Very K.
  if (d < 25) return 34;
  if (d < 55) return 28;
  // Same K-palette cluster (e.g. cream + camel, navy + slate, olive + sage).
  if (inSameKoreanPalette(a, b)) return 26;
  // Neutral bridge — a true cream/black/grey with anything.
  if (isTrueNeutral(a) || isTrueNeutral(b)) return 18;
  // Palette-distance fallback — still related but not as K-clean.
  if (d < 110) return 10;
  return 0;
}

// ——— Seasonal palettes ———
// Classical four-season color theory, tuned to what actually reads current
// on Korean celebs / Musinsa each season. "Current season" biases the final
// outfit color so summer shows airier tones, winter shows richer ones, etc.
export const SEASONAL_PALETTES = {
  spring: {
    name: "Spring",
    blurb:
      "Light, warm, fresh. Butter cream, soft coral, periwinkle, mint, washed denim.",
    hexes: [
      "#F3EFE6", "#ECE5D3", "#E8DDC6", // creams
      "#E8B4B8", "#E8C072", "#C48B3F", // coral / honey / apricot
      "#98B4B7", "#BFA0C4", // periwinkle / lilac
      "#8BA68B", "#6B8E4E", // mint / spring green
      "#6A8BB5", // washed denim
    ],
  },
  summer: {
    name: "Summer",
    blurb:
      "Cool, soft, muted. Sky blue, rose, sage, taupe, icy white, dusty lavender.",
    hexes: [
      "#E0E6EB", "#F6F2EA", // icy white / cool cream
      "#98B4B7", "#5B7B9A", "#6A8BB5", // seaglass / slate blue
      "#E8B4B8", "#BFA0C4", // rose / lilac
      "#8BA68B", "#5E6B5E", // sage
      "#8A7F72", "#C2B7A3", // taupe / stone
    ],
  },
  fall: {
    name: "Fall",
    blurb:
      "Warm, rich, earthy. Rust, mustard, olive, camel, burgundy, chocolate.",
    hexes: [
      "#B45A3C", "#8B3A2F", "#C48B3F", // rust / brick / mustard
      "#D4B483", "#C19A6B", "#7A5E3B", // camel / wheat / tobacco
      "#6B8E4E", "#5E6B3A", "#4A4E2A", // olive / army
      "#8B2C5F", "#6B1F3D", // burgundy / plum
      "#4A3828", "#463D33", // chocolate / espresso
    ],
  },
  winter: {
    name: "Winter",
    blurb:
      "Cool, sharp, high-contrast. Ink black, snow white, deep navy, burgundy, emerald.",
    hexes: [
      "#0f0e0c", "#151311", "#1A1916", "#2A2A2A", // ink / shadow
      "#F3EFE6", "#ECE5D3", // snow
      "#1C2E4A", "#2C3E50", // deep navy
      "#8B2C5F", "#6B1F3D", // burgundy / oxblood
      "#0C4A2A", "#2A4535", // emerald / forest
      "#C0C0C8", "#A6A6A6", // silver / steel
    ],
  },
};

// Nearest distance from a color to any color in the given season's palette.
export function nearestSeasonDistance(hex, season) {
  if (!season || !SEASONAL_PALETTES[season]) return Infinity;
  return nearestFavDistance(hex, SEASONAL_PALETTES[season].hexes);
}

// Does this hex sit comfortably inside the given season's palette?
export function inSeason(hex, season, threshold = 55) {
  return nearestSeasonDistance(hex, season) < threshold;
}

// Score the overall K-feel of a set of garment colors (an outfit).
// Returns 0..100-ish. Higher = more Korean-looking.
export function koreanPaletteScore(colors) {
  if (!colors || colors.length < 2) return 0;
  // Every pair contributes a harmony score — average them.
  let total = 0;
  let count = 0;
  for (let i = 0; i < colors.length; i++) {
    for (let j = i + 1; j < colors.length; j++) {
      total += koreanHarmony(colors[i], colors[j]);
      count++;
    }
  }
  const avg = count ? total / count : 0;
  // Bonus if all items map to one palette (monopalette) — this is the
  // signature "tonal K-look."
  const names = new Set(
    colors.map((c) => closestKoreanPalette(c).name).filter(Boolean)
  );
  const monopalette = names.size === 1 ? 15 : 0;
  return avg + monopalette;
}

export function hexToRgb(hex) {
  const h = hex.replace("#", "");
  const n = parseInt(
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h,
    16
  );
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}
