import { Router } from "express";
import { body, header, oneOf, param } from "express-validator";
import {
  addCartItem,
  getCart,
  removeCartItemByProduct,
  updateCartItemQuantity,
} from "../controllers/cartController";
import validate from "../middleware/validate";

const router = Router();

const cartOwnerValidators = [
  oneOf(
    [
      header("x-user-id").isMongoId(),
      header("x-session-id").isString().trim().notEmpty(),
    ],
    { message: "x-user-id or x-session-id header is required" }
  ),
];

router.get("/", cartOwnerValidators, validate, getCart);

router.post(
  "/items",
  [
    ...cartOwnerValidators,
    body("productId").isMongoId(),
    body("quantity").isInt({ min: 1 }).toInt(),
  ],
  validate,
  addCartItem
);

router.patch(
  "/items/:productId",
  [
    ...cartOwnerValidators,
    param("productId").isMongoId(),
    body("quantity").isInt({ min: 0 }).toInt(),
  ],
  validate,
  updateCartItemQuantity
);

router.delete(
  "/items/:productId",
  [...cartOwnerValidators, param("productId").isMongoId()],
  validate,
  removeCartItemByProduct
);

export default router;
