# FitFix

A prototype: answer a quiz - take a face scan - see suggested outfits off of stored catalog - plan your week using your own closet. 

This is a **single-app Next.js prototype**. No backend, no database — all state lives in React Context and resets on refresh. The catalog is a hand-curated JSON (`lib/catalog.js`) with 84 items, 39 brands across three tiers (Uniqlo/Muji/COS basics → Zara/COS/Arket → SSENSE/Lemaire/Our Legacy).

## Run it

```bash
cd FitFix
npm install
npm run dev
```

Then open http://localhost:3000.

## What's in here

```
app/
  page.js          Landing ("Find your vibe")
  quiz/            Style quiz (6 steps)
  camera/          Selfie color scan + override
  results/         3–5 outfit cards with shop links
  scheduler/       Mon–Sun calendar with shuffle / swap / lazy fit
  closet/          Log items by color + type (no brand)
lib/
  store.js         Profile state (React Context)
  catalog.js       Mock product catalog
  palettes.js      Warm / cool / neutral seasonal palettes
  colorAnalysis.js Quiz-based + pixel-sampling undertone detection
  outfitBuilder.js Scoring, compatibility, weekly plan, lazy fit
```

## How the engines map to your architecture

You described five core engines. Here's where each one lives in the prototype, and what production would look like:

| Engine              | Prototype                                                         | Production next step                                                    |
| ------------------- | ----------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Recommendation      | `outfitBuilder.scoreItem` — weighted scoring                      | Move to server; add learn-from-feedback (upvote/downvote outfits)        |
| Outfit Builder      | `outfitBuilder.buildOutfits` — hero top → compatible bottom/shoes | Add pairing rules (fabric clashes, formality matching), A/B test        |
| Scheduler           | `buildWeeklyPlan` (seeded shuffle) + per-day overrides            | Persist weekly plan to DB, add weather API, daily push                  |
| Fit Engine          | Height/weight/body type feed `scoreItem` via fit preference       | Map height/weight → size recommendations per brand                      |
| Color Analysis      | Quiz (`undertoneFromQuiz`) + selfie pixel sampling (`analyzeUndertoneFromImage`) | Replace heuristic with an actual model (e.g. MediaPipe face landmarks + trained classifier) |

## What's mocked, what's real

**Real:** Next.js App Router, Tailwind styling, React state, camera access (`getUserMedia`), canvas-based pixel sampling for undertone detection, outfit scoring and compatibility logic.

**Mocked:** Product catalog (hand-curated JSON, no real product lookups yet), user accounts (state lives in memory, resets on refresh), weather integration (scheduler is weather-agnostic today).

## Next steps when you're ready

1. **Backend** — Swap the in-memory `ProfileProvider` for calls to a FastAPI/Node API. Profile → Postgres. Closet → Postgres.
2. **Catalog ingestion** — Either an internal admin tool that adds items to the DB, or a scraper/API integration pipeline for Uniqlo/Zara/SSENSE. Sellers' ToS matter — affiliate APIs (RewardStyle, Amazon) are safer than scraping.
3. **Auth** — NextAuth or Clerk, both drop in cleanly.
4. **Better color analysis** — Replace the pixel heuristic with MediaPipe face segmentation + a trained undertone classifier. The current version is a reasonable v1 but will be wrong on edge cases (poor lighting, non-centered faces).
5. **Weather-aware scheduler** — Hit OpenWeather daily, bias outerwear/fabric choices.
6. **Persist the weekly plan** — Right now it resets on navigation; tie it to a user ID server-side.

## Known limitations

- State resets on page refresh (in-memory only) — intentional for the prototype.
- The undertone detector is a heuristic, not ML. Poor lighting will confuse it; that's why the user can override.
- No real image assets — outfit cards use colored swatches to show the palette. In v2 we'd hook in real product images.
- Closet items feed the type/color logger but don't yet feed the outfit recommender (TODO).

---

Built as a working prototype. Single-file artifacts are easy to kill; this one is meant to grow into the full multi-service architecture you sketched.
