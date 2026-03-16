import mongoose from "mongoose";
import Product from "../models/Product";
import Review from "../models/Review";
import ApiError from "../utils/ApiError";

interface ReviewInput {
  name?: string;
  rating: number;
  comment?: string;
  userId?: string;
}

const updateProductRating = async (productId: string) => {
  const stats = await Review.aggregate([
    { $match: { product: new mongoose.Types.ObjectId(productId) } },
    {
      $group: {
        _id: "$product",
        avgRating: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);

  const rating = stats[0]?.avgRating ?? 0;
  const reviewCount = stats[0]?.count ?? 0;

  await Product.findByIdAndUpdate(productId, {
    rating: Math.round(rating * 10) / 10,
    reviewCount,
  });
};

export const getReviewsByProduct = async (productId: string) => {
  return Review.find({ product: productId })
    .sort({ createdAt: -1 })
    .lean();
};

export const addReviewToProduct = async (
  productId: string,
  input: ReviewInput
) => {
  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, "Product not found");

  const review = await Review.create({
    product: productId,
    name: input.name,
    rating: input.rating,
    comment: input.comment,
    user: input.userId,
  });

  await updateProductRating(productId);

  return review;
};
