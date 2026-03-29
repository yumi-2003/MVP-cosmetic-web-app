import { Types } from "mongoose";
import Product from "../models/Product";

type Undertone = "warm" | "cool" | "neutral" | "olive";

interface PopulatedCategory {
  _id: Types.ObjectId | string;
  name: string;
  slug: string;
}

export interface RecommendationCandidate {
  _id: Types.ObjectId | string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  comparePrice?: number;
  category: PopulatedCategory | string;
  images: string[];
  tags: string[];
  skinTypes: string[];
  concerns: string[];
  ingredients: string[];
  routineStep?: string;
  rating: number;
  reviewCount: number;
  isNew: boolean;
  isBestSeller: boolean;
  countInStock: number;
}

export interface AdvisorInput {
  skinType?: string;
  concerns?: string[];
  toneHex?: string | null;
  undertone?: Undertone;
  favoriteProductIds?: string[];
  viewedProductIds?: string[];
  cartProductIds?: string[];
  limit?: number;
}

interface BehaviorProduct {
  product: RecommendationCandidate;
  source: "favorite" | "viewed" | "cart";
}

interface BehaviorProfile {
  sourceCount: number;
  preferredCategory: string | null;
  preferredIngredients: string[];
  preferredConcerns: string[];
  preferredRoutineSteps: string[];
}

interface RecommendationStep {
  title: string;
  description: string;
}

interface RecommendationMatch {
  product: RecommendationCandidate;
  score: number;
  confidence: number;
  reasons: string[];
}

export interface RecommendationResponse {
  summary: {
    skinType: string | null;
    concerns: string[];
    toneHex: string | null;
    undertone: Undertone | null;
    behaviorSignals: number;
    preferredCategory: string | null;
  };
  steps: RecommendationStep[];
  recommendations: RecommendationMatch[];
}

const MAX_LIMIT = 8;
const POPULARITY_REVIEW_BASE = 400;
const SOURCE_WEIGHT: Record<BehaviorProduct["source"], number> = {
  favorite: 1.2,
  cart: 1.1,
  viewed: 0.8,
};

const uniqueLowercase = (values: string[] = []) =>
  [...new Set(values.map((value) => value.trim().toLowerCase()).filter(Boolean))];

const normalizeHex = (value?: string | null) => {
  if (!value) return null;

  const cleaned = value.trim().replace(/^#/, "");
  if (!/^[0-9a-fA-F]{6}$/.test(cleaned)) return null;

  return `#${cleaned.toLowerCase()}`;
};

const hexToRgb = (value: string): [number, number, number] => {
  const normalized = value.replace("#", "");

  return [
    parseInt(normalized.slice(0, 2), 16) / 255,
    parseInt(normalized.slice(2, 4), 16) / 255,
    parseInt(normalized.slice(4, 6), 16) / 255,
  ];
};

const colorSimilarity = (leftHex: string, rightHex: string) => {
  const [lr, lg, lb] = hexToRgb(leftHex);
  const [rr, rg, rb] = hexToRgb(rightHex);
  const distance = Math.sqrt(
    (lr - rr) ** 2 + (lg - rg) ** 2 + (lb - rb) ** 2
  );

  return Math.max(0, 1 - distance / Math.sqrt(3));
};

const average = (values: number[]) => {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
};

const overlapScore = (left: string[] = [], right: string[] = []) => {
  if (left.length === 0 || right.length === 0) return 0;

  const leftSet = new Set(left);
  const intersection = right.filter((value) => leftSet.has(value));

  return intersection.length / Math.max(left.length, right.length);
};

const categoryKey = (product: RecommendationCandidate) => {
  if (typeof product.category === "string") return product.category.toLowerCase();
  return (product.category.slug || product.category.name || "").toLowerCase();
};

const categoryLabel = (product: RecommendationCandidate) => {
  if (typeof product.category === "string") return product.category;
  return product.category.name || product.category.slug;
};

const routineKey = (product: RecommendationCandidate) =>
  (product.routineStep || "").trim().toLowerCase();

const findToneAnchors = (product: RecommendationCandidate) => {
  const name = product.name.toLowerCase();
  const category = categoryKey(product);

  if (name.includes("foundation")) {
    return [
      "#f6ede4",
      "#f3d6c1",
      "#d8a27d",
      "#b97a56",
      "#8f5a3c",
      "#5a3a29",
    ];
  }

  if (name.includes("contour") || name.includes("highlight")) {
    return ["#f1d6bf", "#d0a07a", "#a16a45", "#6a412b"];
  }

  if (name.includes("blush")) {
    return ["#f2b4ac", "#df8f85", "#c76666", "#974848"];
  }

  if (name.includes("powder")) {
    return ["#f2e5d8", "#dec2a8", "#bc9572", "#8f674a"];
  }

  if (name.includes("lipstick") || name.includes("tint")) {
    return ["#d57974", "#b8575e", "#933d47", "#6f2933"];
  }

  if (name.includes("eye shadow") || name.includes("palette")) {
    return ["#d0a07a", "#a06f4d", "#7f5639", "#5f3c27"];
  }

  if (category === "makeup") {
    return ["#f0d7bf", "#d6a17e", "#ad7351", "#75452f"];
  }

  return [];
};

const toneCompatibilityScore = (
  product: RecommendationCandidate,
  toneHex: string | null
) => {
  if (!toneHex) return 0.5;

  const anchors = findToneAnchors(product);
  if (anchors.length === 0) return 0.45;

  return Math.max(...anchors.map((anchor) => colorSimilarity(anchor, toneHex)));
};

const undertoneCompatibilityScore = (
  product: RecommendationCandidate,
  undertone?: Undertone
) => {
  if (!undertone) return 0.5;

  const category = categoryKey(product);
  const name = product.name.toLowerCase();

  if (category !== "makeup") return 0.65;
  if (name.includes("contour")) return undertone === "warm" || undertone === "neutral" ? 1 : 0.75;
  if (name.includes("blush")) return undertone === "cool" || undertone === "neutral" ? 0.95 : 0.8;
  if (name.includes("lipstick")) return undertone === "warm" ? 0.95 : 0.85;

  return 0.9;
};

const popularityScore = (product: RecommendationCandidate) => {
  const ratingComponent = Math.min(product.rating / 5, 1);
  const reviewComponent = Math.min(product.reviewCount / POPULARITY_REVIEW_BASE, 1);
  const bestsellerBonus = product.isBestSeller ? 0.08 : 0;
  const newnessBonus = product.isNew ? 0.04 : 0;

  return Math.min(
    ratingComponent * 0.55 + reviewComponent * 0.35 + bestsellerBonus + newnessBonus,
    1
  );
};

const buildBehaviorProducts = (
  products: RecommendationCandidate[],
  input: AdvisorInput
) => {
  const byId = new Map(products.map((product) => [String(product._id), product]));
  const collected: BehaviorProduct[] = [];

  for (const id of input.favoriteProductIds || []) {
    const product = byId.get(id);
    if (product) collected.push({ product, source: "favorite" });
  }

  for (const id of input.cartProductIds || []) {
    const product = byId.get(id);
    if (product) collected.push({ product, source: "cart" });
  }

  for (const id of input.viewedProductIds || []) {
    const product = byId.get(id);
    if (product) collected.push({ product, source: "viewed" });
  }

  return collected;
};

const topEntries = (values: Map<string, number>, limit = 4) =>
  [...values.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, limit)
    .map(([value]) => value);

const buildBehaviorProfile = (behaviorProducts: BehaviorProduct[]): BehaviorProfile => {
  const categories = new Map<string, number>();
  const ingredients = new Map<string, number>();
  const concerns = new Map<string, number>();
  const routineSteps = new Map<string, number>();

  for (const { product, source } of behaviorProducts) {
    const weight = SOURCE_WEIGHT[source];
    const category = categoryKey(product);
    const routineStep = routineKey(product);

    if (category) {
      categories.set(category, (categories.get(category) || 0) + weight);
    }

    if (routineStep) {
      routineSteps.set(routineStep, (routineSteps.get(routineStep) || 0) + weight);
    }

    for (const ingredient of uniqueLowercase(product.ingredients)) {
      ingredients.set(ingredient, (ingredients.get(ingredient) || 0) + weight);
    }

    for (const concern of uniqueLowercase(product.concerns)) {
      concerns.set(concern, (concerns.get(concern) || 0) + weight);
    }
  }

  return {
    sourceCount: behaviorProducts.length,
    preferredCategory: topEntries(categories, 1)[0] || null,
    preferredIngredients: topEntries(ingredients),
    preferredConcerns: topEntries(concerns),
    preferredRoutineSteps: topEntries(routineSteps, 2),
  };
};

const behaviorNeighborScore = (
  candidate: RecommendationCandidate,
  behaviorProducts: BehaviorProduct[],
  toneHex: string | null
) => {
  if (behaviorProducts.length === 0) return 0.4;

  const candidateConcerns = uniqueLowercase(candidate.concerns);
  const candidateIngredients = uniqueLowercase(candidate.ingredients);
  const candidateCategory = categoryKey(candidate);
  const candidateRoutine = routineKey(candidate);
  const candidateTone = toneCompatibilityScore(candidate, toneHex);

  const similarities = behaviorProducts
    .map(({ product, source }) => {
      const weight = SOURCE_WEIGHT[source];
      const categorySimilarity =
        candidateCategory && candidateCategory === categoryKey(product) ? 1 : 0;
      const routineSimilarity =
        candidateRoutine && candidateRoutine === routineKey(product) ? 1 : 0;
      const concernSimilarity = overlapScore(
        candidateConcerns,
        uniqueLowercase(product.concerns)
      );
      const ingredientSimilarity = overlapScore(
        candidateIngredients,
        uniqueLowercase(product.ingredients)
      );
      const priceSimilarity =
        1 - Math.min(Math.abs(candidate.price - product.price) / 120, 1);
      const toneSimilarity =
        toneHex && findToneAnchors(product).length > 0
          ? Math.min(
              candidateTone,
              toneCompatibilityScore(product, toneHex)
            )
          : 0.55;

      return (
        (categorySimilarity * 0.3 +
          routineSimilarity * 0.15 +
          concernSimilarity * 0.25 +
          ingredientSimilarity * 0.2 +
          priceSimilarity * 0.1 +
          toneSimilarity * 0.1) *
        weight
      );
    })
    .sort((left, right) => right - left)
    .slice(0, 3);

  return Math.min(average(similarities), 1);
};

const buildReasons = (
  product: RecommendationCandidate,
  input: Required<Pick<AdvisorInput, "skinType" | "concerns">> & {
    toneHex: string | null;
    undertone?: Undertone;
  },
  behaviorProfile: BehaviorProfile,
  componentScores: {
    skin: number;
    concerns: number;
    tone: number;
    undertone: number;
    behavior: number;
    popularity: number;
  }
) => {
  const reasons: string[] = [];

  if (input.skinType && componentScores.skin >= 0.85) {
    reasons.push(`Suitable for ${input.skinType} skin.`);
  }

  const matchingConcerns = uniqueLowercase(product.concerns).filter((concern) =>
    input.concerns.includes(concern)
  );
  if (matchingConcerns.length > 0) {
    reasons.push(`Targets ${matchingConcerns.slice(0, 2).join(" and ")}.`);
  }

  if (
    behaviorProfile.preferredCategory &&
    categoryKey(product) === behaviorProfile.preferredCategory
  ) {
    reasons.push(`Aligned with your recent interest in ${categoryLabel(product)}.`);
  }

  const favoriteIngredients = uniqueLowercase(product.ingredients).filter((ingredient) =>
    behaviorProfile.preferredIngredients.includes(ingredient)
  );
  if (favoriteIngredients.length > 0) {
    reasons.push(
      `Shares ingredients you have explored lately, like ${favoriteIngredients[0]}.`
    );
  }

  if (input.toneHex && componentScores.tone >= 0.72) {
    reasons.push(`Its shade family sits close to your detected tone ${input.toneHex}.`);
  }

  if (input.undertone && componentScores.undertone >= 0.9) {
    reasons.push(`Works well with a ${input.undertone} undertone profile.`);
  }

  if (componentScores.popularity >= 0.78) {
    reasons.push("Strong ratings and shopper momentum boosted its rank.");
  }

  if (reasons.length === 0) {
    reasons.push("Balanced fit across profile, behavior, and popularity signals.");
  }

  return reasons.slice(0, 3);
};

const buildSteps = (
  input: Required<Pick<AdvisorInput, "skinType" | "concerns">> & {
    toneHex: string | null;
    undertone?: Undertone;
    limit: number;
  },
  behaviorProfile: BehaviorProfile
): RecommendationStep[] => [
  {
    title: "Step 1: Capture your profile",
    description: [
      input.skinType ? `Skin type: ${input.skinType}.` : "No skin type selected.",
      input.concerns.length
        ? `Concerns: ${input.concerns.join(", ")}.`
        : "No concerns selected.",
      input.toneHex ? `Face Mesh tone sample: ${input.toneHex}.` : "No tone hex provided.",
    ].join(" "),
  },
  {
    title: "Step 2: Read behavior signals",
    description:
      behaviorProfile.sourceCount > 0
        ? `Used ${behaviorProfile.sourceCount} recent favorites, cart items, or product views to learn category and ingredient preferences.`
        : "No recent behavior was available, so ranking leaned more heavily on profile and catalog data.",
  },
  {
    title: "Step 3: Run KNN-style similarity scoring",
    description:
      "Each product is converted into a compact feature vector, then compared with your profile using distance-based scoring across skin fit, concern overlap, tone affinity, behavior similarity, and popularity.",
  },
  {
    title: "Step 4: Explain the top matches",
    description: `Returned the top ${input.limit} products with confidence scores and plain-language reasons so the ranking stays transparent.`,
  },
];

export const getRecommendations = async (
  rawInput: AdvisorInput
): Promise<RecommendationResponse> => {
  const limit = Math.min(MAX_LIMIT, Math.max(1, rawInput.limit || 4));
  const input = {
    skinType: rawInput.skinType?.trim().toLowerCase() || "",
    concerns: uniqueLowercase(rawInput.concerns),
    toneHex: normalizeHex(rawInput.toneHex),
    undertone: rawInput.undertone,
    favoriteProductIds: [...new Set(rawInput.favoriteProductIds || [])],
    viewedProductIds: [...new Set(rawInput.viewedProductIds || [])],
    cartProductIds: [...new Set(rawInput.cartProductIds || [])],
    limit,
  };

  const products = await Product.find({ countInStock: { $gt: 0 } })
    .populate("category", "name slug")
    .lean<RecommendationCandidate[]>();

  const behaviorProducts = buildBehaviorProducts(products, input);
  const behaviorProfile = buildBehaviorProfile(behaviorProducts);
  const excludedIds = new Set(
    [
      ...input.favoriteProductIds,
      ...input.viewedProductIds,
      ...input.cartProductIds,
    ].map(String)
  );

  const weights = {
    skin: 1.35,
    concerns: 1.3,
    tone: input.toneHex ? 0.95 : 0.2,
    undertone: input.undertone ? 0.35 : 0.1,
    behavior: behaviorProducts.length > 0 ? 1.25 : 0.3,
    popularity: 0.8,
  };

  const maxDistance = Math.sqrt(
    weights.skin +
      weights.concerns +
      weights.tone +
      weights.undertone +
      weights.behavior +
      weights.popularity
  );

  const matches = products
    .filter((product) => !excludedIds.has(String(product._id)))
    .map((product) => {
      const normalizedSkinTypes = uniqueLowercase(product.skinTypes);
      const normalizedConcerns = uniqueLowercase(product.concerns);
      const normalizedIngredients = uniqueLowercase(product.ingredients);

      const skinScore = input.skinType
        ? normalizedSkinTypes.includes("all")
          ? 0.85
          : normalizedSkinTypes.includes(input.skinType)
          ? 1
          : 0
        : 0.6;
      const concernScore = input.concerns.length
        ? overlapScore(input.concerns, normalizedConcerns)
        : 0.6;
      const toneScore = toneCompatibilityScore(product, input.toneHex);
      const undertoneScore = undertoneCompatibilityScore(product, input.undertone);
      const behaviorScore = behaviorNeighborScore(
        product,
        behaviorProducts,
        input.toneHex
      );
      const productPopularity = popularityScore(product);

      const distance = Math.sqrt(
        weights.skin * (1 - skinScore) ** 2 +
          weights.concerns * (1 - concernScore) ** 2 +
          weights.tone * (1 - toneScore) ** 2 +
          weights.undertone * (1 - undertoneScore) ** 2 +
          weights.behavior * (1 - behaviorScore) ** 2 +
          weights.popularity * (1 - productPopularity) ** 2
      );

      const confidence = Math.max(
        0,
        Math.min(100, Math.round((1 - distance / maxDistance) * 100))
      );
      const score = Number((confidence / 100).toFixed(3));

      return {
        product,
        score,
        confidence,
        reasons: buildReasons(
          product,
          {
            skinType: input.skinType,
            concerns: input.concerns,
            toneHex: input.toneHex,
            undertone: input.undertone,
          },
          behaviorProfile,
          {
            skin: skinScore,
            concerns: concernScore,
            tone: toneScore,
            undertone: undertoneScore,
            behavior: behaviorScore,
            popularity: productPopularity,
          }
        ),
        distance,
        tieBreakers: {
          behaviorScore,
          concernCount: normalizedConcerns.length,
          ingredientCount: normalizedIngredients.length,
        },
      };
    })
    .sort((left, right) => {
      if (left.distance !== right.distance) return left.distance - right.distance;
      if (left.tieBreakers.behaviorScore !== right.tieBreakers.behaviorScore) {
        return right.tieBreakers.behaviorScore - left.tieBreakers.behaviorScore;
      }
      if (left.product.isBestSeller !== right.product.isBestSeller) {
        return Number(right.product.isBestSeller) - Number(left.product.isBestSeller);
      }
      return right.product.rating - left.product.rating;
    })
    .slice(0, limit)
    .map(({ product, score, confidence, reasons }) => ({
      product,
      score,
      confidence,
      reasons,
    }));

  return {
    summary: {
      skinType: input.skinType || null,
      concerns: input.concerns,
      toneHex: input.toneHex,
      undertone: input.undertone || null,
      behaviorSignals: behaviorProducts.length,
      preferredCategory: behaviorProfile.preferredCategory,
    },
    steps: buildSteps(
      {
        skinType: input.skinType,
        concerns: input.concerns,
        toneHex: input.toneHex,
        undertone: input.undertone,
        limit: input.limit,
      },
      behaviorProfile
    ),
    recommendations: matches,
  };
};
