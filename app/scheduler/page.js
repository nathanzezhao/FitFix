"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useProfile } from "@/lib/store";
import {
  buildWeeklyPlanFromCloset,
  closetCanPlan,
  lazyFit,
} from "@/lib/outfitBuilder";
import GarmentIcon from "@/lib/GarmentIcon";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function SchedulerPage() {
  const { profile } = useProfile();
  const [seed, setSeed] = useState(1);
  const [overrides, setOverrides] = useState({}); // { dayIdx: outfit }

  const plan = useMemo(
    () => buildWeeklyPlanFromCloset(profile, seed),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [profile, seed]
  );

  const canPlan = closetCanPlan(profile);
  const resolved = plan.map((o, i) => overrides[i] || o);

  if (!profile.undertone) {
    return (
      <main className="mt-20 text-center">
        <h2 className="display text-4xl">First, the quiz.</h2>
        <Link href="/quiz" className="btn-primary mt-6 inline-flex">Start →</Link>
      </main>
    );
  }

  const shuffle = () => setSeed((s) => s + 1);

  const lazyForDay = (dayIdx) => {
    setOverrides((o) => ({ ...o, [dayIdx]: lazyFit(profile) }));
  };

  const resetDay = (dayIdx) => {
    setOverrides((o) => {
      const n = { ...o };
      delete n[dayIdx];
      return n;
    });
  };

  return (
    <main>
      <header className="flex items-center justify-between">
        <Link href="/results" className="text-sm text-ink/60 hover:text-ink">← Outfits</Link>
        <Link href="/closet" className="text-sm text-ink/60 hover:text-ink">My closet →</Link>
      </header>

      <section className="mt-10">
        <p className="label">Your week — composed from your closet</p>
        <div className="mt-2 flex items-end justify-between">
          <h2 className="display text-4xl md:text-5xl">7 outfits, ready.</h2>
          {canPlan && (
            <button onClick={shuffle} className="btn-ghost">Shuffle week</button>
          )}
        </div>

        {!canPlan ? (
          <div className="card mt-10 text-center">
            <p className="text-ink/70">
              Add a few staples to your closet and we’ll lay out your week.
              You need at least one <strong>top</strong>, one <strong>bottom</strong>,
              and one pair of <strong>shoes</strong>.
            </p>
            <Link href="/closet" className="btn-primary mt-6 inline-flex">
              Go to my closet →
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
            {DAYS.map((day, i) => (
              <DayCard
                key={day}
                day={day}
                outfit={resolved[i]}
                overridden={!!overrides[i]}
                onLazy={() => lazyForDay(i)}
                onReset={() => resetDay(i)}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function DayCard({ day, outfit, overridden, onLazy, onReset }) {
  if (!outfit) {
    return (
      <div className="card text-center text-sm text-ink/50">
        <div className="label">{day}</div>
        <div className="mt-6">No fit</div>
      </div>
    );
  }
  const items = [
    outfit.dress,
    outfit.top,
    outfit.bottom,
    outfit.outer,
    outfit.shoes,
    outfit.jewelry,
  ].filter(Boolean);

  return (
    <div className="card flex flex-col">
      <div className="flex items-center justify-between">
        <div className="label">{day}</div>
        {overridden && (
          <button onClick={onReset} className="text-[10px] text-ink/50 underline">
            reset
          </button>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-1.5">
        {items.map((it) => (
          <div
            key={it.id}
            className="flex aspect-square items-center justify-center rounded-lg border border-ink/10 bg-cream/60 p-1"
            title={`${it.name} (${it.subtype})`}
          >
            <GarmentIcon subtype={it.subtype} color={it.color} />
          </div>
        ))}
      </div>

      <div className="mt-3 space-y-1 text-[11px] text-ink/60">
        {items.slice(0, 3).map((it) => (
          <div key={it.id}>· {prettySubtype(it.subtype)}</div>
        ))}
      </div>

      <div className="mt-auto flex gap-1 pt-4">
        <button
          onClick={onLazy}
          className="flex-1 rounded-full border border-ink/15 px-2 py-1 text-xs hover:bg-ink hover:text-cream"
        >
          lazy
        </button>
      </div>
    </div>
  );
}

function prettySubtype(t) {
  return (t || "").replace(/-/g, " ");
}
