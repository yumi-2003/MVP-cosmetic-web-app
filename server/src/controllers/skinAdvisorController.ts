import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { getRecommendations } from "../services/skinAdvisorService";

export const recommendProducts = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      skinType,
      concerns,
      toneHex,
      undertone,
      favoriteProductIds,
      viewedProductIds,
      cartProductIds,
      limit,
    } = req.body as {
      skinType?: string;
      concerns?: string[];
      toneHex?: string;
      undertone?: "warm" | "cool" | "neutral" | "olive";
      favoriteProductIds?: string[];
      viewedProductIds?: string[];
      cartProductIds?: string[];
      limit?: number;
    };

    const result = await getRecommendations({
      skinType,
      concerns,
      toneHex,
      undertone,
      favoriteProductIds,
      viewedProductIds,
      cartProductIds,
      limit,
    });

    res.status(200).json(result);
  }
);
