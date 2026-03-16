import { Router } from "express";
import { query, param } from "express-validator";
import { getAllProducts, getProductBySlug } from "../controllers/productController";
import validate from "../middleware/validate";

const router = Router();

router.get(
  "/",
  [
    query("page").optional().isInt({ min: 1 }).toInt(),
    query("limit").optional().isInt({ min: 1, max: 100 }).toInt(),
    query("sort").optional().isString(),
    query("category").optional().isString(),
    query("tags").optional().isString(),
    query("skinTypes").optional().isString(),
    query("concerns").optional().isString(),
  ],
  validate,
  getAllProducts
);

router.get(
  "/:slug",
  [param("slug").isString().trim().notEmpty()],
  validate,
  getProductBySlug
);

export default router;