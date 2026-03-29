import { Router } from "express";
import { body } from "express-validator";
import { recommendProducts } from "../controllers/skinAdvisorController";
import validate from "../middleware/validate";

const router = Router();

router.post(
  "/",
  [
    body("skinType").optional().isString().trim(),
    body("concerns").optional().isArray(),
    body("concerns.*").optional().isString().trim(),
    body("toneHex").optional().matches(/^#?[0-9a-fA-F]{6}$/),
    body("undertone").optional().isIn(["warm", "cool", "neutral", "olive"]),
    body("favoriteProductIds").optional().isArray(),
    body("favoriteProductIds.*").optional().isString().trim().notEmpty(),
    body("viewedProductIds").optional().isArray(),
    body("viewedProductIds.*").optional().isString().trim().notEmpty(),
    body("cartProductIds").optional().isArray(),
    body("cartProductIds.*").optional().isString().trim().notEmpty(),
    body("limit").optional().isInt({ min: 1, max: 8 }).toInt(),
  ],
  validate,
  recommendProducts
);

export default router;
