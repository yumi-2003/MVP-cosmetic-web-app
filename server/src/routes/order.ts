import { Router } from "express";
import { body, header, oneOf, param } from "express-validator";
import {
  getOrder,
  getUserOrders,
  placeOrder,
} from "../controllers/orderController";
import validate from "../middleware/validate";

const router = Router();

const ownerValidators = [
  oneOf(
    [
      header("x-user-id").isMongoId(),
      header("x-session-id").isString().trim().notEmpty(),
    ],
    { message: "x-user-id or x-session-id header is required" }
  ),
];

router.post(
  "/",
  [
    ...ownerValidators,
    body("items").optional().isArray(),
    body("items.*.productId").optional().isMongoId(),
    body("items.*.quantity").optional().isInt({ min: 1 }).toInt(),
  ],
  validate,
  placeOrder
);

router.get(
  "/:id",
  [param("id").isMongoId()],
  validate,
  getOrder
);

router.get(
  "/user/:userId",
  [param("userId").isMongoId()],
  validate,
  getUserOrders
);

export default router;
