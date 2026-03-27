import { Router } from "express";
import { body, param } from "express-validator";
import {
  createReview,
  listReviewsByProduct,
} from "../controllers/reviewController";
import { protect } from "../middleware/protect";
import validate from "../middleware/validate";

const router = Router();

router.get(
  "/product/:productId",
  [param("productId").isMongoId()],
  validate,
  listReviewsByProduct
);

router.post(
  "/product/:productId",
  [
    param("productId").isMongoId(),
    body("rating").isFloat({ min: 1, max: 5 }).toFloat(),
    body("comment").optional().isString().trim(),
  ],
  protect,
  validate,
  createReview
);

export default router;
