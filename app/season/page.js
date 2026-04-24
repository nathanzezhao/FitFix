"use client";
import Link from "next/link";
import { useProfile } from "@/lib/store";
import { SEASONAL_PALETTES } from "@/lib/palettes";

// Season picker — biases outfit colors toward the selected seasonal palette.
// Orders the cards by what feels "current" at a glance: spring → summer →
// fall → winter, with the selected one highlighted.

const SEASONS = ["spring", "summer", "fall", "winter"];

export default function SeasonPage() {
  const { profile, update } = useProfile();

  const pick = (s) => update({ season: s });
  const clear = () => update({ season: null });

  return (
    <main>
      <header className="flex items-center justify-between">
        <Link href="/" className="text-sm text-ink/60 hover:text-ink">
          ← Home
        </Link>
        <Link href="/results" className="text-sm text-ink/60 hover:text-ink">
          Outfits →
        </Link>
      </header>

      <section className="mt-10">
        <p className="label">
          Current season · biases outfit colors toward seasonal tones
        </p>
        <div className="mt-2 flex items-end justify-between">
          <h2 className="display text-4xl md:text-5xl">Pick the season.</h2>
          {profile.season && (
            <button onClick={clear} className="btn-ghost">
              Clear
            </button>
          )}
        </div>

        <p className="mt-4 max-w-2xl text-sm text-ink/60">
          Each season has its own color story. Your outfits will lean toward
          those tones — spring reads airy, fall reads earthy, winter reads
          high-contrast. You can change it whenever the weather changes.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
          {SEASONS.map((s) => {
            const p = SEASONAL_PALETTES[s];
            const active = profile.season === s;
            return (
              <button
                key={s}
                onClick={() => pick(s)}
                className={`card text-left transition ${
                  active
                    ? "ring-2 ring-offset-2 ring-offset-cream ring-ink"
                    : "hover:-translate-y-0.5"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="label">{active ? "Selected" : "Tap to select"}</div>
                    <div className="display mt-1 text-3xl">{p.name}</div>
                  </div>
                  {active && (
                    <div className="rounded-full bg-ink px-3 py-1 text-xs text-cream">
                      active
                    </div>
                  )}
                </div>

                <p className="mt-3 text-sm text-ink/70">{p.blurb}</p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {p.hexes.map((h) => (
                    <div
                      key={h}
                      className="h-8 w-8 rounded-full border border-ink/15"
                      style={{ background: h }}
                      title={h}
                    />
                  ))}
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/results" className="btn-primary">
            See outfits →
          </Link>
          <Link href="/quiz" className="btn-ghost">
            Back to quiz
          </Link>
        </div>
      </section>
    </main>
  );
}
