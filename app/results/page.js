"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useProfile } from "@/lib/store";
import { buildOutfits } from "@/lib/outfitBuilder";
import GarmentIcon from "@/lib/GarmentIcon";

export default function ResultsPage() {
  const { profile } = useProfile();
  const [refreshKey, setRefreshKey] = useState(0);

  const outfits = useMemo(
    () => buildOutfits(profile, 5, refreshKey),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [profile, refreshKey]
  );

  if (!profile.undertone) {
    return (
      <main className="mt-20 text-center">
        <h2 className="display text-4xl">We need a bit more info.</h2>
        <p className="mt-3 text-ink/70">Start with the quiz so we can tailor the fits.</p>
        <Link href="/quiz" className="btn-primary mt-8 inline-flex">
          Take the quiz
        </Link>
      </main>
    );
  }

  return (
    <main>
      <header className="flex items-center justify-between">
        <Link href="/camera" className="text-sm text-ink/60 hover:text-ink">← Palette</Link>
        <div className="flex items-center gap-3">
          <Link href="/scheduler" className="text-sm text-ink/60 hover:text-ink">Plan my week →</Link>
        </div>
      </header>

      <section className="mt-10">
        <p className="label">For your {profile.occasion} · {profile.undertone} palette · {profile.budget} tier</p>
        <div className="mt-2 flex items-end justify-between">
          <h2 className="display text-4xl md:text-5xl">Outfits for you.</h2>
          <button onClick={() => setRefreshKey((k) => k + 1)} className="btn-ghost">
            Shuffle
          </button>
        </div>

        {outfits.length === 0 ? (
          <p className="mt-10 text-ink/60">
            No outfits matched — try widening your budget or occasion in the quiz.
          </p>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            {outfits.map((o) => (
              <OutfitCard key={o.id} outfit={o} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function OutfitCard({ outfit }) {
  const items = [
    outfit.dress,
    outfit.top,
    outfit.bottom,
    outfit.outer,
    outfit.shoes,
    outfit.jewelry,
  ].filter(Boolean);
  return (
    <article className="card flex flex-col">
      <div className="flex flex-wrap gap-3">
        {items.map((it) => (
          <Swatch key={it.id} item={it} />
        ))}
      </div>

      <div className="mt-5 space-y-2">
        {items.map((it) => (
          <div key={it.id} className="flex items-center justify-between text-sm">
            <div>
              <span className="text-ink">{it.name}</span>
              <span className="ml-2 text-ink/50">· {it.brand}</span>
            </div>
            <div className="text-ink/70">${Math.round(it.price)}</div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-ink/10 pt-4">
        <div className="text-sm text-ink/60">Total</div>
        <div className="display text-xl">${Math.round(outfit.totalPrice)}</div>
      </div>

      <PaletteRow items={items} />
    </article>
  );
}

function PaletteRow({ items }) {
  // Pick up to 4 distinct garment colors (skip duplicates).
  const colors = [];
  for (const it of items) {
    if (!colors.includes(it.color)) colors.push(it.color);
    if (colors.length >= 4) break;
  }
  return (
    <div className="mt-5 flex items-center gap-3">
      <span className="label">Palette</span>
      <div className="flex gap-2">
        {colors.map((c) => (
          <div
            key={c}
            className="h-7 w-7 rounded-full border border-ink/15"
            style={{ background: c }}
            title={c}
          />
        ))}
      </div>
    </div>
  );
}

function Swatch({ item }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="flex h-24 w-20 items-center justify-center rounded-xl border border-ink/10 bg-cream/60 p-1.5"
        title={`${item.name} — ${item.color}`}
      >
        <GarmentIcon subtype={item.subtype} color={item.color} />
      </div>
      <div className="mt-1 text-[10px] uppercase tracking-wider text-ink/50">
        {item.subtype}
      </div>
    </div>
  );
}
