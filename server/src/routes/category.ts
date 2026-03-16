import { Router } from "express";
import { param } from "express-validator";
import {
  getAllCategories,
  getCategoryBySlug,
} from "../controllers/categoryController";
import validate from "../middleware/validate";

const router = Router();

router.get("/", getAllCategories);

router.get(
  "/:slug",
  [param("slug").isString().trim().notEmpty()],
  validate,
  getCategoryBySlug
);

export default router;
