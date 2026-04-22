"use client";
import Link from "next/link";
import { useState } from "react";
import { useProfile } from "@/lib/store";
import GarmentIcon from "@/lib/GarmentIcon";

// Grouped, granular subtypes so the weekly planner can tell a hoodie from
// a blazer — not just "a top".
const TYPE_GROUPS = [
  {
    label: "Tops",
    types: ["t-shirt", "shirt", "polo", "knit", "sweatshirt", "hoodie"],
  },
  {
    label: "Bottoms",
    types: ["jeans", "chinos", "trousers", "shorts", "skirt"],
  },
  {
    label: "Shoes",
    types: ["sneakers", "boots", "loafers", "dress-shoes"],
  },
  {
    label: "Outerwear",
    types: ["blazer", "overshirt", "coat", "denim-jacket", "puffer", "bomber"],
  },
  {
    label: "Accessories",
    types: [
      "ring",
      "necklace",
      "bracelet",
      "earrings",
      "watch",
      "belt",
      "hat",
      "sunglasses",
      "bag",
      "scarf",
    ],
  },
];

const COLORS = [
  "#0f0e0c", "#F3EFE6", "#2C3E50", "#8B2C5F", "#B45A3C",
  "#C48B3F", "#6B8E4E", "#8BA68B", "#8A7F72", "#D4B483",
  "#1C2E4A", "#98B4B7", "#E8C072", "#4A3828", "#2A2A2A",
];

// Human-facing label formatter: "dress-shoes" → "dress shoes"
function prettyType(t) {
  return t.replace(/-/g, " ");
}

export default function ClosetPage() {
  const { profile, addClosetItem, removeClosetItem } = useProfile();
  const [type, setType] = useState("t-shirt");
  const [color, setColor] = useState(COLORS[0]);
  const [note, setNote] = useState("");

  const add = () => {
    addClosetItem({ type, color, note: note || undefined });
    setNote("");
  };

  return (
    <main>
      <header className="flex items-center justify-between">
        <Link href="/" className="text-sm text-ink/60 hover:text-ink">← Home</Link>
        <Link href="/scheduler" className="text-sm text-ink/60 hover:text-ink">Week →</Link>
      </header>

      <section className="mt-10">
        <p className="label">Log by color and type — the week planner pulls straight from here</p>
        <h2 className="display mt-2 text-4xl md:text-5xl">My closet.</h2>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-5">
          <div className="card md:col-span-2">
            <div className="label">Add an item</div>

            {TYPE_GROUPS.map((g) => (
              <div key={g.label} className="mt-5">
                <div className="label">{g.label}</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {g.types.map((t) => (
                    <button
                      key={t}
                      onClick={() => setType(t)}
                      className={`chip ${type === t ? "chip-active" : ""}`}
                    >
                      {prettyType(t)}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <div className="mt-6">
              <div className="label">Color</div>
              <div className="mt-2 grid grid-cols-5 gap-2">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`h-10 w-10 rounded-full border transition ${
                      color === c
                        ? "border-ink ring-2 ring-offset-2 ring-offset-cream ring-ink"
                        : "border-ink/20"
                    }`}
                    style={{ background: c }}
                  />
                ))}
              </div>
            </div>

            <div className="mt-6">
              <div className="label">Note (optional)</div>
              <input
                className="input mt-2"
                placeholder="e.g. my favorite boxy tee"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            <button onClick={add} className="btn-primary mt-6">
              Add to closet
            </button>
          </div>

          <div className="md:col-span-3">
            {profile.closet.length === 0 ? (
              <div className="card text-center text-sm text-ink/60">
                Your closet is empty. Log a few staples — the week planner will
                compose outfits from what you actually own.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {profile.closet.map((it) => (
                  <div key={it.id} className="card">
                    <div className="flex h-24 w-full items-center justify-center rounded-xl border border-ink/10 bg-cream/60 p-2">
                      <GarmentIcon subtype={it.type} color={it.color} />
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div>
                        <div className="text-sm capitalize">{prettyType(it.type)}</div>
                        {it.note && (
                          <div className="text-xs text-ink/50">{it.note}</div>
                        )}
                      </div>
                      <button
                        onClick={() => removeClosetItem(it.id)}
                        className="text-xs text-ink/50 hover:text-rust"
                      >
                        remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {profile.closet.length > 0 && (
              <p className="mt-4 text-xs text-ink/50">
                {profile.closet.length} item{profile.closet.length === 1 ? "" : "s"} logged · color + type only (no brand)
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
