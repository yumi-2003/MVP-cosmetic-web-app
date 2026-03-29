import { useEffect, useState } from "react";
import { Loader2, Sparkles, Wand2 } from "lucide-react";

import ProductCard from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { getRecentlyViewedProductIds } from "@/lib/recommendationHistory";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getSkinAdvisorRecommendation } from "@/redux/slices/commonSlice";

const concernOptions = [
  "dullness",
  "dryness",
  "dehydration",
  "redness",
  "dark spots",
  "oil control",
  "large pores",
  "uneven texture",
  "anti-aging",
];

const skinTypes = ["normal", "dry", "combination", "oily", "sensitive"];
const undertones = ["neutral", "warm", "cool", "olive"] as const;
const normalizeToneHex = (value: string) => {
  const cleaned = value.trim().replace(/^#/, "");
  if (!/^[0-9a-fA-F]{6}$/.test(cleaned)) return undefined;
  return `#${cleaned.toLowerCase()}`;
};

const PersonalizedRecommendationSection = () => {
  const dispatch = useAppDispatch();
  const { advisorRecommendation, advisorStatus, error } = useAppSelector(
    (state) => state.common
  );
  const favoriteIds = useAppSelector((state) => state.favorites.itemIds);
  const cartItems = useAppSelector((state) => state.cart.items);

  const [skinType, setSkinType] = useState("combination");
  const [toneHexInput, setToneHexInput] = useState("#c99574");
  const [undertone, setUndertone] =
    useState<(typeof undertones)[number]>("neutral");
  const [concerns, setConcerns] = useState<string[]>([
    "dullness",
    "dehydration",
  ]);
  const [viewedProductIds, setViewedProductIds] = useState<string[]>([]);
  const requestToneHex = normalizeToneHex(toneHexInput);
  const cartProductIds = cartItems
    .map((item) => item.product)
    .filter((productId): productId is string => typeof productId === "string");

  useEffect(() => {
    setViewedProductIds(getRecentlyViewedProductIds());
  }, []);

  useEffect(() => {
    dispatch(
      getSkinAdvisorRecommendation({
        skinType,
        concerns,
        toneHex: requestToneHex,
        undertone,
        favoriteProductIds: favoriteIds,
        viewedProductIds,
        cartProductIds,
        limit: 4,
      })
    );
  }, [
    dispatch,
    skinType,
    requestToneHex,
    undertone,
    concerns,
    favoriteIds,
    viewedProductIds,
    cartItems,
  ]);

  const toggleConcern = (concern: string) => {
    setConcerns((current) =>
      current.includes(concern)
        ? current.filter((item) => item !== concern)
        : [...current, concern]
    );
  };

  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(130,79,90,0.16),transparent_40%),linear-gradient(180deg,rgba(248,242,239,0.9),transparent)] py-16 md:py-24 dark:bg-[radial-gradient(circle_at_top_left,rgba(215,167,177,0.12),transparent_35%),linear-gradient(180deg,rgba(34,25,30,0.75),transparent)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="rounded-[2rem] border border-border/60 bg-background/85 p-6 shadow-xl backdrop-blur md:p-8">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/12 text-primary">
                <Wand2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary/70">
                  Personalized Recommendation Engine
                </p>
                <h2 className="font-serif text-3xl text-foreground">
                  Build a "For You" shelf
                </h2>
              </div>
            </div>

            <p className="mt-5 max-w-xl text-sm leading-7 text-muted-foreground">
              This lightweight engine combines face-derived tone data with real
              shopping behavior. It uses a KNN-style similarity score to rank
              products, then explains every recommendation in plain language.
            </p>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Step 1: Skin Type
                </span>
                <select
                  value={skinType}
                  onChange={(event) => setSkinType(event.target.value)}
                  className="h-12 w-full rounded-2xl border border-input bg-background px-4 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
                >
                  {skinTypes.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Step 2: Undertone
                </span>
                <select
                  value={undertone}
                  onChange={(event) =>
                    setUndertone(event.target.value as (typeof undertones)[number])
                  }
                  className="h-12 w-full rounded-2xl border border-input bg-background px-4 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
                >
                  {undertones.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-5 rounded-3xl border border-border/60 bg-card/60 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Step 3: Face Mesh Tone Sample
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                In production, this hex comes from your Face Mesh pipeline. Here
                you can test the engine with a sample skin-tone swatch.
              </p>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                <input
                  type="color"
                  value={requestToneHex || "#c99574"}
                  onChange={(event) => setToneHexInput(event.target.value)}
                  className="h-14 w-full rounded-2xl border border-input bg-background p-2 sm:w-24"
                />
                <input
                  type="text"
                  value={toneHexInput}
                  onChange={(event) => setToneHexInput(event.target.value)}
                  className="h-14 flex-1 rounded-2xl border border-input bg-background px-4 text-sm uppercase outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
                />
              </div>
            </div>

            <div className="mt-5 rounded-3xl border border-border/60 bg-card/60 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Step 4: Select Concerns
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                These concern tags become part of the feature vector used in the
                similarity match.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {concernOptions.map((concern) => {
                  const isActive = concerns.includes(concern);

                  return (
                    <button
                      key={concern}
                      type="button"
                      onClick={() => toggleConcern(concern)}
                      className={`rounded-full border px-3 py-2 text-xs font-medium capitalize transition-colors ${
                        isActive
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background text-foreground hover:border-primary/40 hover:text-primary"
                      }`}
                    >
                      {concern}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-5 rounded-3xl border border-dashed border-primary/30 bg-primary/5 p-5">
              <div className="flex items-start gap-3">
                <Sparkles className="mt-0.5 h-5 w-5 text-primary" />
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>
                    Step 5: Blend in live behavior. Favorites, cart items, and
                    recently viewed products act as the nearest neighbors that
                    steer the ranking toward categories and ingredients the user
                    already responds to.
                  </p>
                  <p>
                    Active behavior signals:
                    <span className="ml-2 font-semibold text-foreground">
                      {advisorRecommendation?.summary.behaviorSignals ?? 0}
                    </span>
                  </p>
                  {advisorRecommendation?.summary.preferredCategory && (
                    <p>
                      Learned preference:
                      <span className="ml-2 font-semibold capitalize text-foreground">
                        {advisorRecommendation.summary.preferredCategory}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button
                onClick={() =>
                  dispatch(
                    getSkinAdvisorRecommendation({
                      skinType,
                      concerns,
                      toneHex: requestToneHex,
                      undertone,
                      favoriteProductIds: favoriteIds,
                      viewedProductIds,
                      cartProductIds,
                      limit: 4,
                    })
                  )
                }
                className="h-12 rounded-2xl px-6 text-xs font-bold uppercase tracking-[0.2em]"
              >
                {advisorStatus === "loading" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Ranking
                  </>
                ) : (
                  "Refresh Matches"
                )}
              </Button>
              <p className="text-xs text-muted-foreground">
                Every change updates the ranking automatically, and this button
                lets you rerun it manually as well.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] border border-border/60 bg-background/90 p-6 shadow-xl backdrop-blur md:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary/70">
                    Step-By-Step Output
                  </p>
                  <h3 className="mt-2 font-serif text-3xl text-foreground">
                    How the engine made its picks
                  </h3>
                </div>
                {advisorStatus === "loading" && (
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                )}
              </div>

              {error && advisorStatus === "failed" ? (
                <div className="mt-5 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                  {error}
                </div>
              ) : null}

              <div className="mt-6 space-y-4">
                {advisorRecommendation?.steps.map((step) => (
                  <article
                    key={step.title}
                    className="rounded-2xl border border-border/60 bg-card/60 p-5"
                  >
                    <h4 className="text-sm font-semibold text-foreground">
                      {step.title}
                    </h4>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">
                      {step.description}
                    </p>
                  </article>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-border/60 bg-background/90 p-6 shadow-xl backdrop-blur md:p-8">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary/70">
                    Curated Results
                  </p>
                  <h3 className="mt-2 font-serif text-3xl text-foreground">
                    Recommended for this profile
                  </h3>
                </div>
                <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  {advisorRecommendation?.recommendations.length ?? 0} matches
                </span>
              </div>

              <div className="mt-6 grid gap-8 md:grid-cols-2">
                {advisorRecommendation?.recommendations.map((match) => (
                  <article key={match.product._id} className="space-y-4">
                    <ProductCard product={match.product} />
                    <div className="rounded-3xl border border-border/60 bg-card/60 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                          Match Confidence
                        </span>
                        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                          {match.confidence}%
                        </span>
                      </div>
                      <div className="mt-4 space-y-2">
                        {match.reasons.map((reason) => (
                          <p
                            key={reason}
                            className="rounded-2xl bg-background px-3 py-2 text-sm text-muted-foreground"
                          >
                            {reason}
                          </p>
                        ))}
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {advisorStatus === "succeeded" &&
              !advisorRecommendation?.recommendations.length ? (
                <div className="mt-6 rounded-3xl border border-dashed border-border p-6 text-sm text-muted-foreground">
                  No products cleared the ranking yet. Try adding more concerns
                  or browsing a few products first so the engine has stronger
                  behavior signals.
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PersonalizedRecommendationSection;
