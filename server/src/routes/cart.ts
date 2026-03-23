import { Router } from "express";
import { body, header, oneOf, param } from "express-validator";
import {
  addCartItem,
  getCart,
  removeCartItemByProduct,
  updateCartItemQuantity,
} from "../controllers/cartController";
import validate from "../middleware/validate";
import { protect } from "../middleware/protect";

const router = Router();

// For cart routes, we now STRICTLY require authentication.
// No extra headers like x-user-id or x-session-id are needed for security.

router.get("/", protect, getCart);

router.post(
  "/items",
  [
    protect,
    body("productId").isMongoId(),
    body("quantity").isInt({ min: 1 }).toInt(),
  ],
  validate,
  addCartItem
);

router.patch(
  "/items/:productId",
  [
    protect,
    param("productId").isMongoId(),
    body("quantity").isInt({ min: 0 }).toInt(),
  ],
  validate,
  updateCartItemQuantity
);

router.delete(
  "/items/:productId",
  [protect, param("productId").isMongoId()],
  validate,
  removeCartItemByProduct
);

export default router;
