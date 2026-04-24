import { CATALOG, tierOf, TIER_RANK } from "./catalog";
import {
  bucketForHex,
  nearestFavDistance,
  koreanHarmony,
  koreanPaletteScore,
  closestKoreanPalette,
  nearestSeasonDistance,
} from "./palettes";

// Score an item 0..100 against the profile. Higher is better.
function scoreItem(item, profile) {
  let score = 50;
  const tier = tierOf(profile.budget);

  // tier match — primary filter signal (soft, distance-based so luxury still
  // has a chance when the user says 'ssense')
  const dist = Math.abs((TIER_RANK[item.tier] ?? 0) - (TIER_RANK[tier] ?? 0));
  if (dist === 0) score += 25;
  else if (dist === 1) score += 6;
  else if (dist === 2) score -= 12;
  else score -= 28;

  // gender match
  if (item.gender === "unisex") score += 6;
  else if (profile.gender && item.gender === profile.gender) score += 10;
  else if (profile.gender && item.gender !== profile.gender) score -= 40;

  // undertone / palette match
  if (profile.undertone && item.palette.includes(profile.undertone)) {
    score += 18;
  } else if (profile.undertone && !item.palette.includes(profile.undertone)) {
    score -= 8;
  }

  // current season — boost items whose color lives in the active seasonal palette.
  if (profile.season) {
    const sd = nearestSeasonDistance(item.color, profile.season);
    if (sd < 30) score += 18;
    else if (sd < 65) score += 11;
    else if (sd < 110) score += 4;
    else score -= 4; // off-season colors get a soft penalty
  }

  // favorite color affinity — proper RGB distance to the closest favorite.
  // This is the strongest taste lever by design: the user picked these hexes.
  if (profile.favoriteColors?.length) {
    const d = nearestFavDistance(item.color, profile.favoriteColors);
    if (d < 25) score += 32;        // near-exact match
    else if (d < 55) score += 22;   // very close shade
    else if (d < 95) score += 12;   // same family
    else if (d < 140) score += 4;   // adjacent
    // else no bonus
    // Bucket overlap is still a small tiebreaker for neutrals.
    const favBuckets = new Set(profile.favoriteColors.map(bucketForHex));
    if (favBuckets.has(bucketForHex(item.color))) score += 3;
  }

  // occasion
  if (item.occasions?.includes(profile.occasion)) score += 14;

  // fit preference — stronger signal. Exact match pulls baggy items up
  // when the user picked loose/oversized; opposite extreme gets penalized
  // so slim picks don't surface parachute pants and vice versa.
  const fitOrder = ["slim", "regular", "loose", "oversized"];
  if (profile.fitPreference && item.fit?.length) {
    if (item.fit.includes(profile.fitPreference)) {
      score += 16;
    } else if (item.fit.includes("any")) {
      score += 3;
    } else {
      const userIdx = fitOrder.indexOf(profile.fitPreference);
      const itemIdxs = item.fit
        .map((f) => fitOrder.indexOf(f))
        .filter((i) => i >= 0);
      if (itemIdxs.length) {
        const minGap = Math.min(...itemIdxs.map((i) => Math.abs(i - userIdx)));
        if (minGap === 1) score += 4;
        else if (minGap >= 3) score -= 12; // slim ↔ oversized
        else if (minGap === 2) score -= 4;
      }
    }
  }

  // style aesthetic match — biggest taste lever after palette
  if (profile.styles?.length && item.styles?.length) {
    const matches = item.styles.filter((s) => profile.styles.includes(s)).length;
    if (matches) score += matches * 14;
  }

  // interest-based nudges
  const interests = new Set(profile.interests || []);
  if (interests.has("gym") && item.occasions?.includes("gym")) score += 4;
  if (interests.has("streetwear") && item.fit?.includes("oversized")) score += 8;
  // K-street Musinsa brands — boost when user leans streetwear or minimalist,
  // since these are the silhouettes that carry the K look.
  const kStreetBrands = new Set([
    "LIKETHEMOST",
    "DECET",
    "Fear of God Essentials",
    "Andersson Bell",
    "Matin Kim",
    "BEENTRILL",
    "LMC",
    "999Humanity",
  ]);
  if (kStreetBrands.has(item.brand)) {
    if (profile.styles?.includes("streetwear")) score += 10;
    if (profile.styles?.includes("minimalist")) score += 4;
    if (profile.fitPreference === "loose" || profile.fitPreference === "oversized")
      score += 6;
  }
  if (interests.has("outdoors") && item.styles?.includes("gorpcore")) score += 5;
  if (interests.has("finance") && item.occasions?.includes("work")) score += 4;
  if (interests.has("art") && (item.tier === "premium" || item.tier === "luxury"))
    score += 3;

  // Musinsa-core bias — favor neutral, tonal pieces and classic K-fashion
  // subtypes (knits, pleated trousers, chinos, loafers, leather sneakers).
  // These together bias the whole outfit toward the Korean-minimalist look.
  if (item.palette.includes("neutral")) score += 6;
  const musinsaSubtypes = new Set([
    "knit",
    "trousers",
    "chinos",
    "loafers",
    "blazer",
    "shirt",
  ]);
  if (musinsaSubtypes.has(item.subtype)) score += 4;
  // White leather sneakers are a Musinsa staple
  if (item.subtype === "sneakers" && item.palette.includes("neutral")) score += 3;

  return score;
}

// Seeded PRNG — deterministic per seed, lets us reshuffle on demand.
function seededRandom(seed) {
  let s = (Math.abs(seed | 0) || 1) * 9301 + 49297;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

// Pick the top N of a given type, scored. When seed != 0, add small jitter
// so the ordering varies deterministically — this is how "Shuffle" works.
function topByType(type, profile, n = 5, exclude = new Set(), rand = null) {
  return CATALOG
    .filter((it) => it.type === type && !exclude.has(it.id))
    .map((it) => {
      const base = scoreItem(it, profile);
      const noise = rand ? (rand() - 0.5) * 22 : 0;
      return { item: it, score: base + noise };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, n);
}

// Some "tops" are full-length pieces (dresses) — treat them as complete outfits.
function isFullLook(item) {
  return item.subtype === "dress";
}

function diversifyHero(outfits) {
  // Avoid repeating the same hero top across outfits.
  const seen = new Set();
  return outfits.filter((o) => {
    const key = o.hero?.id || o.top?.id;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// Generate a reason string for why an outfit works.
function explainOutfit(outfit, profile) {
  const bits = [];
  if (outfit.kPaletteName) {
    bits.push(`palette: ${outfit.kPaletteName.toLowerCase()}`);
  }
  if (outfit.musinsaCore) {
    bits.push("reads Musinsa — tonal, relaxed, well-proportioned");
  }
  if (outfit.baggyLook && !outfit.musinsaCore) {
    bits.push("baggy K-silhouette top to bottom");
  }
  if (profile.undertone) {
    bits.push(
      `${outfit.paletteMatch ? "plays to" : "balances"} your ${
        profile.undertone
      } undertone`
    );
  }
  if (outfit.occasionMatch) {
    bits.push(`built for ${profile.occasion}`);
  }
  if (profile.styles?.length && outfit.styleMatch) {
    bits.push(`leans ${profile.styles.slice(0, 2).join("/")}`);
  }
  if (outfit.classicPairing && !outfit.musinsaCore) {
    bits.push("classic Korean-style pairing");
  }
  if (profile.interests?.includes("streetwear") && outfit.hasOversized) {
    bits.push("loose proportions nod to streetwear");
  }
  if (profile.interests?.includes("finance") && outfit.hasTailored) {
    bits.push("tailored enough to read 'work'");
  }
  if (outfit.jewelry) {
    bits.push("finished with one piece of jewelry");
  }
  if (!bits.length) bits.push("a clean, easy combo");
  return capitalize(bits.join(" · "));
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// Main entry — returns ~3-5 outfit objects. seed changes the shuffle.
export function buildOutfits(profile, count = 5, seed = 0) {
  const rand = seed ? seededRandom(seed * 131 + 7) : null;

  const topsScored = topByType("top", profile, 14, undefined, rand);
  const bottomsScored = topByType("bottom", profile, 14, undefined, rand);
  const shoesScored = topByType("shoes", profile, 14, undefined, rand);
  const outerwearScored = topByType("outerwear", profile, 8, undefined, rand);
  const jewelryScored = topByType("jewelry", profile, 14, undefined, rand);

  const outfits = [];
  // Track what we've already used so each outfit gets a fresh bottom/shoes/jewelry/outer.
  const used = {
    bottoms: new Set(),
    shoes: new Set(),
    jewelry: new Set(),
    outer: new Set(),
  };

  // Prefer an unused candidate that K-pairs with the anchor color; fall back
  // gracefully. This is what makes outfits read Korean: every piece after the
  // top is chosen for color harmony, not just "did palette overlap happen."
  const pickFresh = (scored, compatFn, usedSet, anchorColor = null) => {
    const candidates = scored.filter(({ item }) => compatFn(item));
    if (!candidates.length) return null;
    // Rank by (K-harmony with anchor) * 0.7 + (base score) * 0.3, and lightly
    // penalize already-used items so we get variety across the 5 cards.
    const ranked = candidates
      .map(({ item, score }) => {
        const harmony = anchorColor ? koreanHarmony(anchorColor, item.color) : 0;
        const usedPenalty = usedSet.has(item.id) ? -18 : 0;
        return { item, rank: harmony * 1.4 + score * 0.3 + usedPenalty };
      })
      .sort((a, b) => b.rank - a.rank);
    return ranked[0]?.item || null;
  };

  for (const { item: top, score: topScore } of topsScored) {
    if (outfits.length >= count * 2) break;

    if (isFullLook(top)) {
      const shoes = pickFresh(
        shoesScored,
        (s) => compatible(top, s, profile),
        used.shoes,
        top.color
      ) || shoesScored[0]?.item;
      if (!shoes) continue;
      used.shoes.add(shoes.id);

      const outer =
        profile.occasion === "formal" || profile.occasion === "work"
          ? pickFresh(
              outerwearScored,
              (o) => compatible(top, o, profile),
              used.outer,
              top.color
            )
          : null;
      if (outer) used.outer.add(outer.id);

      const jewelry = pickJewelry(profile, jewelryScored, [top, shoes], used.jewelry);
      if (jewelry) used.jewelry.add(jewelry.id);

      outfits.push(
        buildOutfitObject({ top, bottom: null, shoes, outer, jewelry, profile, topScore })
      );
      continue;
    }

    const bottom = pickFresh(
      bottomsScored,
      (b) => compatible(top, b, profile),
      used.bottoms,
      top.color
    );
    if (!bottom) continue;
    used.bottoms.add(bottom.id);

    const shoes = pickFresh(
      shoesScored,
      (s) => compatible(bottom, s, profile),
      used.shoes,
      bottom.color
    ) || shoesScored[0]?.item;
    if (!shoes) continue;
    used.shoes.add(shoes.id);

    const outer =
      profile.occasion === "work" ||
      profile.occasion === "formal" ||
      profile.occasion === "date"
        ? pickFresh(
            outerwearScored,
            (o) => compatible(top, o, profile),
            used.outer,
            top.color
          )
        : null;
    if (outer) used.outer.add(outer.id);

    const jewelry = pickJewelry(
      profile,
      jewelryScored,
      [top, bottom, shoes, outer],
      used.jewelry
    );
    if (jewelry) used.jewelry.add(jewelry.id);

    outfits.push(
      buildOutfitObject({ top, bottom, shoes, outer, jewelry, profile, topScore })
    );
  }

  const diversified = diversifyHero(outfits);
  return diversified.slice(0, count);
}

// Add jewelry when it makes sense: skip for gym, prefer unused items, and
// require palette compatibility with the rest of the outfit.
function pickJewelry(profile, jewelryScored, otherItems, usedSet = new Set()) {
  if (profile.occasion === "gym") return null;
  const anchor = otherItems.find(Boolean);
  if (!anchor) return null;
  const fresh = jewelryScored.find(
    ({ item }) => !usedSet.has(item.id) && compatible(anchor, item, profile)
  );
  if (fresh) return fresh.item;
  const any = jewelryScored.find(({ item }) => compatible(anchor, item, profile));
  if (any) return any.item;
  const firstUnused = jewelryScored.find(({ item }) => !usedSet.has(item.id));
  return firstUnused?.item || jewelryScored[0]?.item || null;
}

// Two items "compatible" if palettes overlap OR one is a neutral.
function compatible(a, b, profile) {
  if (!a || !b) return false;
  const abNeutral =
    a.palette.includes("neutral") || b.palette.includes("neutral");
  const overlap = a.palette.some((p) => b.palette.includes(p));
  const underMatches =
    !profile.undertone ||
    a.palette.includes(profile.undertone) ||
    b.palette.includes(profile.undertone);
  return (abNeutral || overlap) && underMatches;
}

function buildOutfitObject({ top, bottom, shoes, outer, jewelry, profile, topScore }) {
  const items = [top, bottom, shoes, outer, jewelry].filter(Boolean);
  const totalPrice = items.reduce((sum, it) => sum + (it.price || 0), 0);
  const paletteMatch = profile.undertone
    ? items.some((it) => it.palette.includes(profile.undertone))
    : true;
  const occasionMatch = items.every(
    (it) => !it.occasions || it.occasions.includes(profile.occasion)
  );
  const hasOversized = items.some((it) => it.fit?.includes("oversized"));
  const hasTailored = items.some(
    (it) => it.subtype === "trousers" || it.subtype === "blazer"
  );
  const styleMatch =
    profile.styles?.length
      ? items.some((it) => it.styles?.some((s) => profile.styles.includes(s)))
      : false;

  // Musinsa / Korean-core detection: outfit reads tonal if ≥3 garments sit in
  // the neutral palette (cream, beige, navy, olive, grey, black, brown).
  // Plus a nod for classic K-fashion pairings (loafer+trouser, sneaker+chino,
  // oversized knit + wide trouser).
  const garments = items.filter((it) => it.type !== "jewelry");
  const neutralCount = garments.filter((it) => it.palette.includes("neutral"))
    .length;
  const isTonal = neutralCount >= 3;
  const classicPairing =
    (shoes?.subtype === "loafers" && bottom?.subtype === "trousers") ||
    (shoes?.subtype === "sneakers" &&
      (bottom?.subtype === "chinos" || bottom?.subtype === "trousers")) ||
    (top?.fit?.includes("oversized") &&
      (bottom?.fit?.includes("loose") || bottom?.fit?.includes("oversized")));

  // K-palette signature: use actual garment colors to determine which Korean
  // color cluster the outfit lives in, and how tightly it coheres.
  const garmentColors = garments.map((it) => it.color);
  const kScore = koreanPaletteScore(garmentColors);
  const paletteNameCounts = {};
  for (const c of garmentColors) {
    const n = closestKoreanPalette(c).name;
    if (n) paletteNameCounts[n] = (paletteNameCounts[n] || 0) + 1;
  }
  const dominantPalette = Object.entries(paletteNameCounts).sort(
    (a, b) => b[1] - a[1]
  )[0]?.[0] || null;
  const musinsaCore =
    (isTonal || kScore >= 30) && (classicPairing || hasTailored || kScore >= 35);

  // Full-baggy silhouette — both top and bottom are loose or oversized.
  // This is the Musinsa signature when paired with K-palette harmony.
  const baggyLook =
    (top?.fit?.includes("loose") || top?.fit?.includes("oversized")) &&
    (bottom?.fit?.includes("loose") || bottom?.fit?.includes("oversized"));

  const obj = {
    id: items.map((i) => i.id).join("::"),
    hero: top,
    top: isFullLook(top) ? null : top,
    dress: isFullLook(top) ? top : null,
    bottom,
    shoes,
    outer,
    jewelry: jewelry || null,
    totalPrice,
    paletteMatch,
    occasionMatch,
    hasOversized,
    hasTailored,
    styleMatch,
    isTonal,
    classicPairing,
    musinsaCore,
    baggyLook,
    kScore,
    kPaletteName: dominantPalette,
  };
  obj.reasoning = explainOutfit(obj, profile);
  return obj;
}

export function buildWeeklyPlan(profile, outfits, seed = 1) {
  if (!outfits.length) return new Array(7).fill(null);
  const rand = seededRandom(seed);
  const plan = [];
  for (let i = 0; i < 7; i++) {
    const idx = Math.floor(rand() * outfits.length);
    plan.push(outfits[idx]);
  }
  return plan;
}

// ---------- Closet-based weekly planner ----------
// The user logs real items in their closet (type + color, no brand). This
// composes a week of outfits using only what they own.

// Map a granular closet subtype to a coarse slot the outfit needs.
const CLOSET_SLOTS = {
  // tops
  "t-shirt": "top",
  shirt: "top",
  polo: "top",
  knit: "top",
  sweatshirt: "top",
  hoodie: "top",
  // bottoms
  jeans: "bottom",
  chinos: "bottom",
  trousers: "bottom",
  shorts: "bottom",
  skirt: "bottom",
  // shoes
  sneakers: "shoes",
  boots: "shoes",
  loafers: "shoes",
  "dress-shoes": "shoes",
  // outerwear
  blazer: "outer",
  overshirt: "outer",
  coat: "outer",
  "denim-jacket": "outer",
  puffer: "outer",
  bomber: "outer",
  // accessories (we pick at most one per outfit)
  ring: "accessory",
  necklace: "accessory",
  bracelet: "accessory",
  earrings: "accessory",
  watch: "accessory",
  belt: "accessory",
  hat: "accessory",
  sunglasses: "accessory",
  bag: "accessory",
  scarf: "accessory",
  // legacy coarse types (before the closet expansion)
  top: "top",
  bottom: "bottom",
  shoes: "shoes",
  outerwear: "outer",
  accessory: "accessory",
};

// Wrap a closet item so it looks enough like a catalog item for downstream
// rendering (name, brand, subtype, price).
function closetItemToGarment(item) {
  if (!item) return null;
  const subtype = item.type;
  const slot = CLOSET_SLOTS[subtype] || "top";
  const name = item.note || prettyName(subtype);
  return {
    id: item.id,
    subtype,
    type: slot === "outer" ? "outerwear" : slot === "accessory" ? "jewelry" : slot,
    slot, // our internal helper
    color: item.color,
    name,
    brand: "From your closet",
    price: 0,
    palette: [], // unknown — treat as wildcard
    styles: [],
    fit: ["any"],
    occasions: [],
    gender: "unisex",
    tier: "mid",
  };
}

function prettyName(t) {
  const s = (t || "").replace(/-/g, " ");
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// Group the user's closet by slot.
function groupCloset(closet) {
  const groups = { top: [], bottom: [], shoes: [], outer: [], accessory: [] };
  for (const raw of closet || []) {
    const g = closetItemToGarment(raw);
    if (!g) continue;
    const slot = g.slot;
    if (groups[slot]) groups[slot].push(g);
  }
  return groups;
}

// Build an outfit object purely from closet garments. Skips palette/score
// logic because we don't know the semantics of user items — we just lay them
// out in the same shape buildOutfitObject produces.
function buildClosetOutfitObject({ top, bottom, shoes, outer, jewelry, profile }) {
  const items = [top, bottom, shoes, outer, jewelry].filter(Boolean);
  const totalPrice = 0; // closet items don't have prices
  const paletteMatch = true;
  const occasionMatch = true;
  const hasOversized = false;
  const hasTailored = items.some(
    (it) => it.subtype === "trousers" || it.subtype === "blazer"
  );

  const obj = {
    id: "closet::" + items.map((i) => i.id).join("::"),
    fromCloset: true,
    hero: top,
    top,
    dress: null,
    bottom,
    shoes,
    outer,
    jewelry: jewelry || null,
    totalPrice,
    paletteMatch,
    occasionMatch,
    hasOversized,
    hasTailored,
    styleMatch: false,
    isTonal: false,
    classicPairing: false,
    musinsaCore: false,
  };
  obj.reasoning = "Built from your closet";
  return obj;
}

// Compose a week of outfits from the user's closet. Rotates through the
// available items so every day reads different when possible, then repeats
// gracefully when the closet is thin.
export function buildWeeklyPlanFromCloset(profile, seed = 1) {
  const groups = groupCloset(profile.closet);
  const hasBase = groups.top.length && groups.bottom.length && groups.shoes.length;
  if (!hasBase) return new Array(7).fill(null);

  const rand = seededRandom(seed);
  // Shuffle each bucket deterministically per seed so the Shuffle button moves things around.
  const shuffled = (arr) =>
    arr
      .map((x) => ({ x, k: rand() }))
      .sort((a, b) => a.k - b.k)
      .map(({ x }) => x);

  const tops = shuffled(groups.top);
  const bottoms = shuffled(groups.bottom);
  const shoes = shuffled(groups.shoes);
  const outers = shuffled(groups.outer);
  const accs = shuffled(groups.accessory);

  const plan = [];
  for (let i = 0; i < 7; i++) {
    const top = tops[i % tops.length];
    const bottom = bottoms[i % bottoms.length];
    const shoe = shoes[i % shoes.length];
    const outer = outers.length ? outers[i % outers.length] : null;
    const jewelry = accs.length ? accs[i % accs.length] : null;
    plan.push(
      buildClosetOutfitObject({
        top,
        bottom,
        shoes: shoe,
        outer,
        jewelry,
        profile,
      })
    );
  }
  return plan;
}

// Convenience: does the closet have the minimum for the planner to work?
export function closetCanPlan(profile) {
  const g = groupCloset(profile.closet);
  return g.top.length > 0 && g.bottom.length > 0 && g.shoes.length > 0;
}

export function lazyFit(profile) {
  // Deliberately minimalist: ink tee + stone chino + white sneaker, or the
  // closest budget-tier approximations available.
  const find = (type, filter) =>
    CATALOG.find((it) => it.type === type && filter(it));
  const top =
    find("top", (i) => i.subtype === "t-shirt" && i.palette.includes("neutral"))
    || CATALOG.find((i) => i.type === "top");
  const bottom =
    find("bottom", (i) => i.palette.includes("neutral") && i.subtype !== "shorts")
    || CATALOG.find((i) => i.type === "bottom");
  const shoes =
    find("shoes", (i) => i.subtype === "sneakers")
    || CATALOG.find((i) => i.type === "shoes");
  return buildOutfitObject({
    top, bottom, shoes, outer: null, jewelry: null, profile, topScore: 0,
  });
}
