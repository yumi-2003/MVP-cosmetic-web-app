import Product from "../models/Product";

interface AdvisorInput {
  skinType: string;
  concerns: string[];
}

export const getRecommendations = async (input: AdvisorInput) => {
  const filter: Record<string, unknown> = {};

  if (input.skinType) filter.skinTypes = { $in: [input.skinType] };
  if (input.concerns?.length) filter.concerns = { $in: input.concerns };

  return Product.find(filter)
    .sort({ isBestSeller: -1, rating: -1, isNew: -1 })
    .limit(12)
    .lean();
};
