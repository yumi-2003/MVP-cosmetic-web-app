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
  "rounded-[2.5rem] border border-[#e5d8dc] bg-white/98 backdrop-blur-xl shadow-2xl shadow-[#8f5b67]/8 dark:border-[#4a363e] dark:bg-[#20161c]/90 dark:shadow-black/35";
const inputClass =
  "h-14 w-full rounded-2xl border border-[#d8c9ce] bg-white px-5 text-sm text-[#24191d] outline-none transition-all focus:border-[#8c5261] focus:ring-4 focus:ring-[#8c5261]/10 appearance-none cursor-pointer dark:border-[#57414a] dark:bg-[#2b2026] dark:text-[#f8edf1]";
const subtleLabelClass =
  "text-[10px] font-bold uppercase tracking-[0.25em] text-[#5f4b52] dark:text-[#d5c0c7]";
const bodyCopyClass =
  "text-sm leading-relaxed text-[#37292f] dark:text-[#f0e2e7]";

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
    <section className="relative min-h-screen overflow-hidden bg-white px-0 pt-14 pb-12 text-[#1f1418] transition-colors duration-500 dark:bg-[#130d11] dark:text-[#f7edf0] md:pt-16 md:pb-20">
      {/* Dynamic background gradient overlays */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(248,227,232,0.42),transparent_30%),radial-gradient(circle_at_82%_14%,rgba(244,231,236,0.5),transparent_28%),radial-gradient(circle_at_70%_76%,rgba(236,220,212,0.36),transparent_30%)] dark:bg-[radial-gradient(circle_at_18%_18%,rgba(124,73,89,0.28),transparent_30%),radial-gradient(circle_at_82%_14%,rgba(213,146,166,0.16),transparent_24%),radial-gradient(circle_at_70%_76%,rgba(94,54,66,0.2),transparent_30%)]" />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-white via-white/92 to-[#fbf6f7] dark:from-transparent dark:via-[#180f14]/35 dark:to-[#130d11]" />
      {/* Decorative background elements */}
      <div className="pointer-events-none absolute top-0 right-0 h-[600px] w-[600px] translate-x-1/4 -translate-y-1/2 rounded-full bg-[#eed8de]/30 blur-[120px] dark:bg-[#8c5261]/16" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-[500px] w-[500px] -translate-x-1/4 translate-y-1/2 rounded-full bg-[#f1e0d8]/26 blur-[100px] dark:bg-[#5b3642]/18" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        {/* Header Section */}
        <div className="mb-16 text-center max-w-2xl mx-auto">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#caa8b1] bg-white/92 px-4 py-1.5 shadow-lg shadow-[#d5b7bf]/25 animate-in fade-in slide-in-from-bottom-4 duration-700 dark:border-[#5c3c47] dark:bg-[#261a21]/88 dark:shadow-black/20">
            <Sparkles className="h-3.5 w-3.5 text-[#8c5261] dark:text-[#e1a7b8]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#8c5261] dark:text-[#e1a7b8]">AI Beauty Intelligence</span>
          </div>
          <h1 className="mb-6 font-serif text-4xl leading-tight tracking-tight text-[#23171c] md:text-5xl lg:text-7xl dark:text-[#fbf0f3]">
            Your Personal <br /> <span className="italic text-[#8c5261] dark:text-[#e1a7b8]">Beauty Concierge</span>
          </h1>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-[#37292f] md:text-base dark:text-[#f5e8ed]">
            Discover a curated collection tailored precisely to your unique skin profile, 
            driven by advanced digital mapping and real-time aesthetic analysis.
          </p>
        </div>

        <div className="grid gap-12 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] items-start">
          {/* Consultation Sidebar */}
          <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000">
            <div className={`${panelClass} p-8 md:p-10`}>
              <div className="flex items-center gap-4 mb-10">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#8c5261] text-white shadow-lg shadow-[#8c5261]/25 dark:bg-[#e1a7b8] dark:text-[#2c1c22]">
                  <Wand2 className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-serif text-2xl tracking-tight text-[#23171c] dark:text-[#fbf0f3]">The Consultation</h2>
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

              <div className="mt-8 rounded-[2rem] border border-[#eadde0] bg-[#fff8f9] p-6 md:p-8 dark:border-[#49353d] dark:bg-[#2a1d24]">
                <div className="flex items-center gap-3 mb-6">
                  <div className="rounded-xl bg-[#8c5261]/10 p-2 text-[#8c5261] dark:bg-[#e1a7b8]/12 dark:text-[#e1a7b8]">
                    <Maximize className="h-4 w-4" />
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8c5261] dark:text-[#e1a7b8]">
                    III. Digital Skin Scan
                  </p>
                </div>
                <p className={`${bodyCopyClass} mb-6`}>
                  Our AI maps your unique complexion profile. Sample the scan data below to adjust your selection.
                </p>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="relative group overflow-hidden rounded-2xl border border-[#d8c9ce] bg-white w-full sm:w-28 dark:border-[#4f3941] dark:bg-[#2d2127]">
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
                      className="h-14 w-full rounded-2xl border border-[#d8c9ce] bg-white px-6 text-sm uppercase tracking-widest text-[#24191d] outline-none transition-all focus:border-[#8c5261] focus:ring-4 focus:ring-[#8c5261]/10 dark:border-[#57414a] dark:bg-[#2b2026] dark:text-[#f8edf1]"
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
                            ? "scale-[1.02] border-[#8c5261] bg-[#8c5261] text-white shadow-xl shadow-[#8c5261]/20 dark:border-[#e1a7b8] dark:bg-[#e1a7b8] dark:text-[#2a1c22]"
                            : "border-[#d8c9ce] bg-white text-[#37292f] backdrop-blur hover:border-[#8c5261]/55 hover:bg-[#fdf4f6] hover:text-[#23171c] dark:border-[#4b373f] dark:bg-[#261b21]/82 dark:text-[#e5d7dc] dark:hover:border-[#e1a7b8]/55 dark:hover:bg-[#e1a7b8]/10 dark:hover:text-[#fff5f7]"
                        }`}
                      >
                        <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-current' : 'text-[#8c5261] dark:text-[#e1a7b8]'}`} strokeWidth={2.5} />
                        <span>{concern.label}</span>
                        {isActive && (
                          <CheckCircle2 className="h-3 w-3 ml-0.5 animate-in zoom-in" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-10 border-t border-[#e1d3d7] pt-8 dark:border-[#3d2c33]">
                <div className="flex items-start gap-4">
                  <div className="mt-1 rounded-xl bg-[#8c5261]/10 p-2 text-[#8c5261] dark:bg-[#e1a7b8]/12 dark:text-[#e1a7b8]">
                    <Activity className="h-4 w-4" />
                  </div>
                  <div className="space-y-3">
                    <p className="text-xs font-semibold tracking-tight text-[#23171c] dark:text-[#fbf0f3]">V. Behavioral Intelligence</p>
                    <p className="text-xs leading-relaxed text-[#37292f] dark:text-[#f0e2e7]">
                      Analyzing <span className="font-bold text-[#8c5261] dark:text-[#e1a7b8]">{advisorRecommendation?.summary.behaviorSignals ?? 0} active signals</span> from your browsing history and favorites to refine your matches.
                    </p>
                    {advisorRecommendation?.summary.preferredCategory && (
                      <div className="inline-block rounded-full border border-[#e3c9d1] bg-[#fff7f9] px-3 py-1 dark:border-[#5c3f48] dark:bg-[#e1a7b8]/10">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-[#8c5261] dark:text-[#e1a7b8]">
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
                  className="group h-16 w-full rounded-[2rem] bg-[#23171c] text-[11px] font-bold uppercase tracking-[0.3em] text-white shadow-xl transition-all duration-500 hover:bg-[#8c5261] hover:text-white hover:shadow-[#8c5261]/20 dark:bg-[#f4dfe5] dark:text-[#24161c] dark:hover:bg-[#e1a7b8]"
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
                  <h3 className="font-serif text-2xl tracking-tight text-[#23171c] dark:text-[#fbf0f3]">Concierge Analysis</h3>
                  <p className={subtleLabelClass}>Deep Learning Logic</p>
                </div>
                {advisorStatus === "loading" && (
                  <div className="grid h-8 w-8 place-items-center rounded-full bg-[#8c5261]/7 dark:bg-[#e1a7b8]/10">
                    <Loader2 className="h-4 w-4 animate-spin text-[#8c5261] dark:text-[#e1a7b8]" />
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
                    className="group relative rounded-2xl border border-[#e2d4d8] bg-white p-5 transition-all duration-500 hover:border-[#cb9fab] hover:bg-[#fffafb] dark:border-[#46333b] dark:bg-[#281c23] dark:hover:border-[#7d5160] dark:hover:bg-[#302127]"
                    style={{ animationDelay: `${idx * 150}ms` }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[9px] font-bold tracking-widest text-[#604c53] dark:text-[#b18a97]">{String(idx + 1).padStart(2, '0')}</span>
                      <h4 className="text-xs font-bold uppercase tracking-widest text-[#23171c] transition-colors group-hover:text-[#8c5261] dark:text-[#fbf0f3] dark:group-hover:text-[#e1a7b8]">
                        {step.title}
                      </h4>
                    </div>
                    <p className="pl-7 text-xs leading-relaxed text-[#37292f] dark:text-[#f0e2e7]">
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
                  <h3 className="font-serif text-3xl tracking-tight text-[#23171c] dark:text-[#fbf0f3]">Your Signature Collection</h3>
                  <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.2em] text-[#8c5261] dark:text-[#e1a7b8]">Curated Matches</p>
                </div>
                <div className="text-right">
                   <p className="text-2xl font-serif text-[#8c5261] dark:text-[#e1a7b8]">{advisorRecommendation?.recommendations.length ?? 0}</p>
                   <p className={subtleLabelClass}>Selections</p>
                </div>
              </div>

              <div className="grid gap-10 md:grid-cols-2">
                {advisorRecommendation?.recommendations.map((match, idx) => (
                  <article key={match.product._id} className="group rounded-[2rem] border border-[#e4d7db] bg-white p-5 animate-in fade-in slide-in-from-bottom-8 duration-1000 dark:border-[#433038] dark:bg-[#21171d]/70" style={{ animationDelay: `${idx * 200}ms` }}>
                    <div className="relative mb-6 transform transition-transform duration-700 group-hover:scale-[1.02]">
                      <ProductCard product={match.product} />
                      <div className="absolute top-4 right-4 z-10">
                        <div className="rounded-full border border-[#ddc6cd] bg-white px-3 py-1.5 shadow-xl backdrop-blur-md dark:border-[#5a4049] dark:bg-[#241920]/92">
                           <p className="text-[10px] font-bold tracking-tighter text-[#8c5261] dark:text-[#e1a7b8]">
                             {match.confidence}% <span className="ml-0.5 text-[8px] font-medium uppercase tracking-normal text-[#6d5860] dark:text-[#d5c0c7]">Match</span>
                           </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <p className="px-2 text-[9px] font-bold uppercase tracking-[0.15em] text-[#8c5261] dark:text-[#e1a7b8]">Analysis Findings</p>
                      <div className="space-y-2">
                        {match.reasons.map((reason) => (
                          <div
                            key={reason}
                            className="group/item flex items-start gap-2 rounded-xl border border-[#e1d2d7] bg-[#fff8fa] px-4 py-3 text-[11px] font-medium text-[#35242b] transition-all duration-300 hover:border-[#8c5261] hover:bg-[#fbeef1] dark:border-[#433038] dark:bg-[#e1a7b8]/[0.08] dark:text-[#f2e6ea] dark:hover:border-[#7a5360] dark:hover:bg-[#e1a7b8]/[0.13]"
                          >
                            <Droplet className="mt-0.5 h-3 w-3 shrink-0 text-[#7d5360] transition-colors group-hover/item:text-[#8c5261] dark:text-[#9f7784] dark:group-hover/item:text-[#e1a7b8]" />
                            <span className="flex-1 leading-relaxed text-[#35242b] dark:text-inherit">{reason}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {advisorStatus === "succeeded" &&
              !advisorRecommendation?.recommendations.length ? (
                <div className="mt-6 rounded-[2rem] border border-dashed border-[#d7c9ce] p-12 text-center text-sm text-[#4f3d45] dark:border-[#47343c] dark:text-[#cebfc5]">
                  <div className="mb-4 inline-grid h-16 w-16 place-items-center rounded-full bg-[#8c5261]/8 text-[#8c5261] dark:bg-[#e1a7b8]/10 dark:text-[#e1a7b8]">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <p className="max-w-xs mx-auto leading-relaxed italic text-[#37292f] dark:text-[#f0e2e7]">
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
