import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import {
  addReviewToProduct,
  getReviewsByProduct,
} from "../services/reviewService";

export const listReviewsByProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const reviews = await getReviewsByProduct(req.params.productId);
    res.status(200).json(reviews);
  }
);

export const createReview = asyncHandler(async (req: Request, res: Response) => {
  const { rating, comment, name, userId } = req.body as {
    rating: number;
    comment?: string;
    name?: string;
    userId?: string;
  };

  const review = await addReviewToProduct(req.params.productId, {
    rating,
    comment,
    name,
    userId,
  });

  res.status(201).json(review);
});
