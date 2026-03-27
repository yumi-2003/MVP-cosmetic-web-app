import { Request, Response } from "express";
import { AuthRequest } from "../middleware/protect";
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

export const createReview = asyncHandler(async (req: AuthRequest, res: Response) => {
  const currentUser = req.user;
  const { rating, comment } = req.body as {
    rating: number;
    comment?: string;
  };

  if (!currentUser) {
    res.status(401).json({ message: "Not authorized" });
    return;
  }

  const review = await addReviewToProduct(req.params.productId, {
    rating,
    comment,
    name: `${currentUser.firstname} ${currentUser.lastname}`.trim(),
    userId: currentUser._id.toString(),
  });

  res.status(201).json(review);
});
