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
