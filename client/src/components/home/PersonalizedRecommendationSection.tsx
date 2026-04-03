import { useEffect, useState } from "react";
import { 
  Loader2, 
  Sparkles, 
  Wand2,
  Sun,
  Droplets,
  Droplet,
  Activity,
  Target,
  Wind,
  Maximize,
  Waves,
  Clock,
  CheckCircle2
} from "lucide-react";

import ProductCard from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { getRecentlyViewedProductIds } from "@/lib/recommendationHistory";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getSkinAdvisorRecommendation } from "@/redux/slices/commonSlice";

const concernOptions = [
  { id: "dullness", label: "Dullness", icon: Sun },
  { id: "dryness", label: "Dryness", icon: Droplets },
  { id: "dehydration", label: "Dehydration", icon: Droplet },
  { id: "redness", label: "Redness", icon: Activity },
  { id: "dark spots", label: "Dark Spots", icon: Target },
  { id: "oil control", label: "Oil Control", icon: Wind },
  { id: "large pores", label: "Large Pores", icon: Maximize },
  { id: "uneven texture", label: "Uneven Texture", icon: Waves },
  { id: "anti-aging", label: "Anti-Aging", icon: Clock },
];

const skinTypes = ["normal", "dry", "combination", "oily", "sensitive"];
const undertones = ["neutral", "warm", "cool", "olive"] as const;
const panelClass =
  "rounded-[2.5rem] border border-border bg-background backdrop-blur-xl shadow-2xl shadow-black/5 dark:border-border/40 dark:shadow-black/35";
const inputClass =
  "h-14 w-full rounded-2xl border border-border bg-background px-5 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 appearance-none cursor-pointer dark:border-border/60";
const subtleLabelClass =
  "text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground dark:text-zinc-400";
const bodyCopyClass =
  "text-sm leading-relaxed text-foreground/80 dark:text-zinc-300";

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
    <section className="relative min-h-screen overflow-hidden bg-background px-0 pt-14 pb-12 text-foreground transition-colors duration-500 md:pt-16 md:pb-20">
      {/* Dynamic background gradient overlays */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(0,0,0,0.03),transparent_30%),radial-gradient(circle_at_82%_14%,rgba(0,0,0,0.02),transparent_28%),radial-gradient(circle_at_70%_76%,rgba(0,0,0,0.02),transparent_30%)] dark:bg-none" />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-background via-background/92 to-muted dark:from-background dark:via-background/80 dark:to-background" />
      {/* Decorative background elements */}
      <div className="pointer-events-none absolute top-0 right-0 h-[600px] w-[600px] translate-x-1/4 -translate-y-1/2 rounded-full bg-zinc-100/30 blur-[120px] dark:bg-zinc-800/16" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-[500px] w-[500px] -translate-x-1/4 translate-y-1/2 rounded-full bg-zinc-100/26 blur-[100px] dark:bg-zinc-800/18" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        {/* Header Section */}
        <div className="mb-16 text-center max-w-2xl mx-auto">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-white/92 px-4 py-1.5 shadow-lg shadow-black/5 animate-in fade-in slide-in-from-bottom-4 duration-700 dark:border-border/40 dark:bg-zinc-900/88 dark:shadow-black/20">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">AI Beauty Intelligence</span>
          </div>
          <h1 className="mb-6 font-serif text-4xl leading-tight tracking-tight text-foreground md:text-5xl lg:text-7xl">
            Your Personal <br /> <span className="italic text-primary">Beauty Concierge</span>
          </h1>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-muted-foreground md:text-base">
            Discover a curated collection tailored precisely to your unique skin profile, 
            driven by advanced digital mapping and real-time aesthetic analysis.
          </p>
        </div>

        <div className="grid gap-12 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] items-start">
          {/* Consultation Sidebar */}
          <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000">
            <div className={`${panelClass} p-8 md:p-10`}>
              <div className="flex items-center gap-4 mb-10">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-black text-white shadow-lg shadow-black/20 dark:bg-white dark:text-black">
                  <Wand2 className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-serif text-2xl tracking-tight text-foreground">The Consultation</h2>
                  <p className={subtleLabelClass}>Profile Refinement</p>
                </div>
              </div>

              <div className="mt-8 grid gap-6 md:grid-cols-2">
                <label className="space-y-3">
                    <span className={subtleLabelClass}>
                    I. Aesthetic Base
                  </span>
                  <select
                    value={skinType}
                    onChange={(event) => setSkinType(event.target.value)}
                    className={inputClass}
                  >
                    {skinTypes.map((option) => (
                      <option key={option} value={option}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-3">
                    <span className={subtleLabelClass}>
                    II. Tonal Variance
                  </span>
                  <select
                    value={undertone}
                    onChange={(event) =>
                      setUndertone(event.target.value as (typeof undertones)[number])
                    }
                    className={inputClass}
                  >
                    {undertones.map((option) => (
                      <option key={option} value={option}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="mt-8 rounded-[2rem] border border-border bg-muted/30 p-6 md:p-8 dark:bg-zinc-900/40">
                <div className="flex items-center gap-3 mb-6">
                  <div className="rounded-xl bg-primary/10 p-2 text-primary">
                    <Maximize className="h-4 w-4" />
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                    III. Digital Skin Scan
                  </p>
                </div>
                <p className={`${bodyCopyClass} mb-6`}>
                  Our AI maps your unique complexion profile. Sample the scan data below to adjust your selection.
                </p>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="relative group overflow-hidden rounded-2xl border border-border bg-background w-full sm:w-28 dark:bg-zinc-950">
                    <input
                      type="color"
                      value={requestToneHex || "#c99574"}
                      onChange={(event) => setToneHexInput(event.target.value)}
                      className="h-14 w-full cursor-pointer bg-transparent scale-150 transition-transform hover:scale-[2]"
                    />
                  </div>
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={toneHexInput}
                      onChange={(event) => setToneHexInput(event.target.value)}
                      className="h-14 w-full rounded-2xl border border-border bg-background px-6 text-sm uppercase tracking-widest text-foreground outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
                      placeholder="#HEXCODE"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <p className={`mb-6 ${subtleLabelClass}`}>
                  IV. Precision Focus Areas
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {concernOptions.map((concern) => {
                    const isActive = concerns.includes(concern.id);
                    const Icon = concern.icon;

                    return (
                      <button
                        key={concern.id}
                        type="button"
                        onClick={() => toggleConcern(concern.id)}
                        className={`inline-flex items-center gap-2.5 rounded-full border px-5 py-3 text-[11px] font-semibold tracking-wide transition-all duration-500 ${
                          isActive
                            ? "scale-[1.02] border-black bg-black text-white shadow-xl shadow-black/20 dark:border-white dark:bg-white dark:text-black"
                            : "border-border bg-background text-foreground backdrop-blur hover:border-primary hover:bg-muted dark:hover:border-white/55 dark:hover:bg-zinc-800"
                        }`}
                      >
                        <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-current' : 'text-primary'}`} strokeWidth={2.5} />
                        <span>{concern.label}</span>
                        {isActive && (
                          <CheckCircle2 className="h-3 w-3 ml-0.5 animate-in zoom-in" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-10 border-t border-border pt-8">
                <div className="flex items-start gap-4">
                  <div className="mt-1 rounded-xl bg-primary/10 p-2 text-primary">
                    <Activity className="h-4 w-4" />
                  </div>
                  <div className="space-y-3">
                    <p className="text-xs font-semibold tracking-tight text-foreground">V. Behavioral Intelligence</p>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      Analyzing <span className="font-bold text-primary">{advisorRecommendation?.summary.behaviorSignals ?? 0} active signals</span> from your browsing history and favorites to refine your matches.
                    </p>
                    {advisorRecommendation?.summary.preferredCategory && (
                      <div className="inline-block rounded-full border border-border bg-muted px-3 py-1 dark:bg-zinc-800">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-primary">
                          Preferred Focus: {advisorRecommendation.summary.preferredCategory}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-10">
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
                  className="group h-16 w-full rounded-[2rem] bg-black text-[11px] font-bold uppercase tracking-[0.3em] text-white shadow-xl transition-all duration-500 hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                >
                  {advisorStatus === "loading" ? (
                    <>
                      <Loader2 className="mr-3 h-4 w-4 animate-spin" />
                      Analyzing Profile...
                    </>
                  ) : (
                    <span className="flex items-center gap-2">
                      Refresh Intelligence
                      <Sparkles className="h-4 w-4 transition-transform group-hover:rotate-12" />
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Results Side */}
          <div className="space-y-10">
            {/* Analysis Log */}
            <div className={`${panelClass} p-8 md:p-10`}>
              <div className="flex items-center justify-between gap-4 mb-8">
                <div>
                  <h3 className="font-serif text-2xl tracking-tight text-foreground">Concierge Analysis</h3>
                  <p className={subtleLabelClass}>Deep Learning Logic</p>
                </div>
                {advisorStatus === "loading" && (
                  <div className="grid h-8 w-8 place-items-center rounded-full bg-primary/10">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  </div>
                )}
              </div>

              {error && advisorStatus === "failed" ? (
                <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-5 text-xs text-destructive flex items-center gap-3">
                  <Activity className="h-4 w-4" />
                  {error}
                </div>
              ) : null}

              <div className="space-y-4">
                {advisorRecommendation?.steps.map((step, idx) => (
                  <article
                    key={step.title}
                    className="group relative rounded-2xl border border-border bg-background p-5 transition-all duration-500 hover:border-primary/50 hover:bg-muted dark:hover:bg-zinc-900"
                    style={{ animationDelay: `${idx * 150}ms` }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[9px] font-bold tracking-widest text-muted-foreground">{String(idx + 1).padStart(2, '0')}</span>
                      <h4 className="text-xs font-bold uppercase tracking-widest text-foreground transition-colors group-hover:text-primary">
                        {step.title}
                      </h4>
                    </div>
                    <p className="pl-7 text-xs leading-relaxed text-muted-foreground dark:text-zinc-400">
                      {step.description}
                    </p>
                  </article>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className={`${panelClass} p-8 md:p-10`}>
              <div className="flex items-end justify-between gap-4 mb-10">
                <div>
                  <h3 className="font-serif text-3xl tracking-tight text-foreground">Your Signature Collection</h3>
                  <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.2em] text-primary">Curated Matches</p>
                </div>
                <div className="text-right">
                   <p className="text-2xl font-serif text-primary">{advisorRecommendation?.recommendations.length ?? 0}</p>
                   <p className={subtleLabelClass}>Selections</p>
                </div>
              </div>

              <div className="grid gap-10 md:grid-cols-2">
                {advisorRecommendation?.recommendations.map((match, idx) => (
                  <article key={match.product._id} className="group rounded-[2rem] border border-border bg-background p-5 animate-in fade-in slide-in-from-bottom-8 duration-1000" style={{ animationDelay: `${idx * 200}ms` }}>
                    <div className="relative mb-6 transform transition-transform duration-700 group-hover:scale-[1.02]">
                      <ProductCard product={match.product} />
                      <div className="absolute top-4 right-4 z-10">
                        <div className="rounded-full border border-border bg-background px-3 py-1.5 shadow-xl backdrop-blur-md">
                           <p className="text-[10px] font-bold tracking-tighter text-primary">
                             {match.confidence}% <span className="ml-0.5 text-[8px] font-medium uppercase tracking-normal text-muted-foreground">Match</span>
                           </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <p className="px-2 text-[9px] font-bold uppercase tracking-[0.15em] text-primary">Analysis Findings</p>
                      <div className="space-y-2">
                        {match.reasons.map((reason) => (
                          <div
                            key={reason}
                            className="group/item flex items-start gap-2 rounded-xl border border-border bg-muted/40 px-4 py-3 text-[11px] font-medium text-foreground transition-all duration-300 hover:border-primary hover:bg-muted dark:bg-zinc-900/40 dark:hover:bg-zinc-900"
                          >
                            <Droplet className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground transition-colors group-hover/item:text-primary" />
                            <span className="flex-1 leading-relaxed text-foreground dark:text-inherit">{reason}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {advisorStatus === "succeeded" &&
              !advisorRecommendation?.recommendations.length ? (
                <div className="mt-6 rounded-[2rem] border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
                  <div className="mb-4 inline-grid h-16 w-16 place-items-center rounded-full bg-primary/10 text-primary">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <p className="max-w-xs mx-auto leading-relaxed italic text-foreground">
                    Our AI is still learning your preferences. Try adjusting your focus areas or exploring more products to calibrate the concierge.
                  </p>
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
