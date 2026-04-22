"use client";
import Link from "next/link";

export default function Landing() {
  return (
    <main className="flex min-h-[85vh] flex-col">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-ink" />
          <span className="text-sm font-medium tracking-tight">FitFix</span>
        </div>
        <nav className="flex items-center gap-5 text-sm text-ink/70">
          <Link href="/closet" className="hover:text-ink">Closet</Link>
          <Link href="/scheduler" className="hover:text-ink">Week</Link>
        </nav>
      </header>

      <section className="mt-24 md:mt-32 max-w-3xl">
        <p className="label">Personal stylist · built around you</p>
        <h1 className="display mt-4 text-[56px] md:text-[88px] leading-[0.95]">
          Find your vibe.
        </h1>
        <p className="mt-6 max-w-xl text-lg text-ink/70">
          Answer a short quiz, sample your color palette from a selfie, and
          FitFix turns your measurements, taste, and closet into an outfit for
          every day of the week.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Link href="/quiz" className="btn-primary">
            Start the quiz →
          </Link>
          <Link href="/camera" className="btn-ghost">
            Jump to color scan
          </Link>
        </div>
      </section>

      <section className="mt-24 grid grid-cols-1 gap-4 md:grid-cols-3">
        {[
          {
            k: "01",
            h: "Tell us about you",
            d: "Gender, fit preference, height, weight, budget, the things you care about.",
          },
          {
            k: "02",
            h: "Scan your palette",
            d: "Quiz-based undertone, with an optional selfie for a second opinion.",
          },
          {
            k: "03",
            h: "Get dressed",
            d: "3–5 outfits, plus a shuffle-able week of fits — or just hit lazy fit.",
          },
        ].map((s) => (
          <div className="card" key={s.k}>
            <div className="label">{s.k}</div>
            <div className="display mt-3 text-2xl">{s.h}</div>
            <p className="mt-2 text-sm text-ink/70">{s.d}</p>
          </div>
        ))}
      </section>

      <footer className="mt-auto pt-20 text-xs text-ink/50">
        FitFix · a prototype. No data leaves your browser.
      </footer>
    </main>
  );
}
