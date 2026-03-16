import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { getRecommendations } from "../services/skinAdvisorService";

export const recommendProducts = asyncHandler(
  async (req: Request, res: Response) => {
    const { skinType, concerns } = req.body as {
      skinType: string;
      concerns: string[];
    };

    const products = await getRecommendations({ skinType, concerns });
    res.status(200).json(products);
  }
);
