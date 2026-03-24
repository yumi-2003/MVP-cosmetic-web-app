import { Router } from "express";
import { body, header, oneOf, param } from "express-validator";
import {
  getOrder,
  getUserOrders,
  placeOrder,
  updateStatus,
} from "../controllers/orderController";
import validate from "../middleware/validate";
import { optionalProtect } from "../middleware/protect";

const router = Router();

const ownerValidators = [
  oneOf(
    [
      header("x-user-id").isMongoId(),
      header("x-session-id").isString().trim().notEmpty(),
      header("authorization").custom((value) => typeof value === "string" && value.startsWith("Bearer ")),
    ],
    { message: "x-user-id, x-session-id, or Authorization header is required" }
  ),
];

router.post(
  "/",
  optionalProtect,
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

router.patch(
  "/:id/status",
  [
    param("id").isMongoId(),
    body("status").isString().trim().notEmpty(),
  ],
  validate,
  updateStatus
);

export default router;
