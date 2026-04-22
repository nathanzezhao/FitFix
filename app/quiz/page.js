"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useProfile } from "@/lib/store";
import { undertoneFromQuiz } from "@/lib/colorAnalysis";

const INTERESTS = [
  "gym",
  "finance",
  "art",
  "music",
  "outdoors",
  "tech",
  "streetwear",
];
const STYLES = [
  { key: "minimalist", blurb: "clean lines, few colors" },
  { key: "streetwear", blurb: "hoodies, sneakers, logos" },
  { key: "gothic", blurb: "black, silver, sharp" },
  { key: "y2k", blurb: "low-rise, chrome, shine" },
  { key: "gorpcore", blurb: "outdoors tech, trail runners" },
  { key: "workwear", blurb: "carhartt, boots, heavy cotton" },
  { key: "preppy", blurb: "oxford, loafers, knits" },
];
const OCCASIONS = ["casual", "work", "date", "party", "gym", "formal"];
const BUDGETS = [
  { key: "uniqlo", label: "Everyday", blurb: "Uniqlo, Muji, COS basics" },
  { key: "zara", label: "Mid", blurb: "Zara, COS, Arket" },
  { key: "ssense", label: "Premium", blurb: "SSENSE, Lemaire, Our Legacy" },
];
const FAV_COLORS = [
  "#0f0e0c", "#F6F2EA", "#8B2C5F", "#1C2E4A", "#B45A3C",
  "#C48B3F", "#6B8E4E", "#8BA68B", "#8A7F72", "#2C3E50",
];

export default function QuizPage() {
  const { profile, update } = useProfile();
  const router = useRouter();
  const [step, setStep] = useState(0);

  // Undertone quiz answers
  const [vein, setVein] = useState(profile.vein || null);
  const [jewelry, setJewelry] = useState(profile.jewelry || null);
  const [sun, setSun] = useState(profile.sun || null);

  const totalSteps = 7;
  const progress = ((step + 1) / totalSteps) * 100;

  const next = () => setStep((s) => Math.min(s + 1, totalSteps - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const toggle = (arr, val) =>
    arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];

  const finish = () => {
    const undertone = undertoneFromQuiz({ vein, jewelry, sun });
    update({
      undertoneFromQuiz: undertone,
      undertone: profile.undertone || undertone, // don't overwrite if already set
    });
    router.push("/camera");
  };

  return (
    <main>
      <header className="flex items-center justify-between">
        <Link href="/" className="text-sm text-ink/60 hover:text-ink">← Home</Link>
        <div className="text-xs text-ink/60">Step {step + 1} / {totalSteps}</div>
      </header>

      <div className="mt-4 h-1 w-full rounded-full bg-ink/10">
        <div
          className="h-1 rounded-full bg-ink transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <section className="mt-12 max-w-2xl">
        {step === 0 && (
          <>
            <h2 className="display text-4xl md:text-5xl">Who are we dressing?</h2>
            <p className="mt-2 text-ink/70">Pick whichever feels most like you.</p>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {["men", "women", "unisex"].map((g) => (
                <button
                  key={g}
                  onClick={() => update({ gender: g })}
                  className={`card text-left capitalize ${profile.gender === g ? "card-active" : ""}`}
                >
                  {g}
                </button>
              ))}
            </div>

            <div className="mt-8">
              <div className="label">Fit preference</div>
              <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
                {["slim", "regular", "loose", "oversized"].map((f) => (
                  <button
                    key={f}
                    onClick={() => update({ fitPreference: f })}
                    className={`btn-option ${profile.fitPreference === f ? "btn-option-active" : ""}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <h2 className="display text-4xl md:text-5xl">Your measurements.</h2>
            <p className="mt-2 text-ink/70">Used for fit, never shared.</p>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div>
                <label className="label">Height (cm)</label>
                <input
                  className="input mt-2"
                  type="number"
                  value={profile.heightCm}
                  onChange={(e) => update({ heightCm: +e.target.value })}
                />
              </div>
              <div>
                <label className="label">Weight (kg)</label>
                <input
                  className="input mt-2"
                  type="number"
                  value={profile.weightKg}
                  onChange={(e) => update({ weightKg: +e.target.value })}
                />
              </div>
            </div>
            <div className="mt-8">
              <label className="label">Body type (optional)</label>
              <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
                {["slim", "athletic", "average", "heavy"].map((b) => (
                  <button
                    key={b}
                    onClick={() => update({ bodyType: b })}
                    className={`btn-option ${profile.bodyType === b ? "btn-option-active" : ""}`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="display text-4xl md:text-5xl">What are you into?</h2>
            <p className="mt-2 text-ink/70">Pick all that apply — this shapes the vibe, not a category.</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {INTERESTS.map((i) => (
                <button
                  key={i}
                  onClick={() => update({ interests: toggle(profile.interests, i) })}
                  className={`chip ${profile.interests.includes(i) ? "chip-active" : ""}`}
                >
                  {i}
                </button>
              ))}
            </div>

            <div className="mt-10">
              <div className="label">Occasion you're dressing for right now</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {OCCASIONS.map((o) => (
                  <button
                    key={o}
                    onClick={() => update({ occasion: o })}
                    className={`chip ${profile.occasion === o ? "chip-active" : ""}`}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="display text-4xl md:text-5xl">Your aesthetic.</h2>
            <p className="mt-2 text-ink/70">
              Pick one or more — this steers the actual outfits (jewelry, shoes, silhouettes). Skip if nothing resonates.
            </p>
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {STYLES.map((s) => {
                const selected = profile.styles.includes(s.key);
                return (
                  <button
                    key={s.key}
                    onClick={() =>
                      update({ styles: toggle(profile.styles, s.key) })
                    }
                    className={`card text-left capitalize ${
                      selected ? "card-active" : ""
                    }`}
                  >
                    <div className="display text-2xl">{s.key}</div>
                    <div className="mt-1 text-sm text-ink/60 normal-case">
                      {s.blurb}
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <h2 className="display text-4xl md:text-5xl">Budget.</h2>
            <p className="mt-2 text-ink/70">We'll bias recommendations to this tier (but show adjacent finds too).</p>
            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {BUDGETS.map((b) => (
                <button
                  key={b.key}
                  onClick={() => update({ budget: b.key })}
                  className={`card text-left ${profile.budget === b.key ? "card-active" : ""}`}
                >
                  <div className="display text-2xl">{b.label}</div>
                  <div className="mt-1 text-sm text-ink/60">{b.blurb}</div>
                </button>
              ))}
            </div>
          </>
        )}

        {step === 5 && (
          <>
            <h2 className="display text-4xl md:text-5xl">Colors you love.</h2>
            <p className="mt-2 text-ink/70">Pick 2–4. Don't overthink it.</p>
            <div className="mt-6 grid grid-cols-5 gap-3 md:grid-cols-10">
              {FAV_COLORS.map((c) => {
                const selected = profile.favoriteColors.includes(c);
                return (
                  <button
                    key={c}
                    onClick={() =>
                      update({ favoriteColors: toggle(profile.favoriteColors, c) })
                    }
                    className={`h-14 w-14 rounded-full border transition ${
                      selected
                        ? "border-ink ring-2 ring-offset-2 ring-offset-cream ring-ink"
                        : "border-ink/20"
                    }`}
                    style={{ background: c }}
                    aria-label={c}
                  />
                );
              })}
            </div>
          </>
        )}

        {step === 6 && (
          <>
            <h2 className="display text-4xl md:text-5xl">Undertone, quickly.</h2>
            <p className="mt-2 text-ink/70">
              Three questions that estimate your undertone before we optionally confirm it with a selfie.
            </p>

            <div className="mt-8 space-y-6">
              <QRow
                label="Veins on your inner wrist look…"
                options={["green", "blue", "both"]}
                value={vein}
                onChange={setVein}
              />
              <QRow
                label="Jewelry you reach for…"
                options={["gold", "silver", "both"]}
                value={jewelry}
                onChange={setJewelry}
              />
              <QRow
                label="In strong sun you…"
                options={["tan", "burn", "both"]}
                value={sun}
                onChange={setSun}
              />
            </div>
          </>
        )}

        <div className="mt-12 flex items-center justify-between">
          <button onClick={back} className="btn-ghost" disabled={step === 0}>
            ← Back
          </button>
          {step < totalSteps - 1 ? (
            <button onClick={next} className="btn-primary">
              Next →
            </button>
          ) : (
            <button
              onClick={finish}
              disabled={!vein || !jewelry || !sun}
              className="btn-primary"
            >
              Scan color palette →
            </button>
          )}
        </div>
      </section>
    </main>
  );
}

function QRow({ label, options, value, onChange }) {
  return (
    <div>
      <div className="label">{label}</div>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o}
            onClick={() => onChange(o)}
            className={`chip ${value === o ? "chip-active" : ""}`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}
