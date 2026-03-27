import Product from "../models/Product";
import Review from "../models/Review";
import ApiError from "../utils/ApiError";

interface ReviewInput {
  name: string;
  rating: number;
  comment?: string;
  userId: string;
}

export const getReviewsByProduct = async (productId: string) => {
  return Review.find({ product: productId })
    .populate("user", "firstname lastname")
    .sort({ createdAt: -1 })
    .lean();
};

export const addReviewToProduct = async (
  productId: string,
  input: ReviewInput
) => {
  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, "Product not found");

  const existingReview = await Review.findOne({
    product: productId,
    user: input.userId,
  }).lean();

  if (existingReview) {
    throw new ApiError(400, "You have already reviewed this product");
  }

  const review = await Review.create({
    product: productId,
    name: input.name,
    rating: input.rating,
    comment: input.comment,
    user: input.userId,
  });

  const nextReviewCount = product.reviewCount + 1;
  const nextRating =
    nextReviewCount === 1
      ? input.rating
      : Math.round(
          (((product.rating * product.reviewCount) + input.rating) /
            nextReviewCount) *
            10
        ) / 10;

  product.reviewCount = nextReviewCount;
  product.rating = nextRating;
  await product.save();

  return Review.findById(review._id)
    .populate("user", "firstname lastname")
    .lean();
};
