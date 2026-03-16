import { Router } from "express";
import { body } from "express-validator";
import { recommendProducts } from "../controllers/skinAdvisorController";
import validate from "../middleware/validate";

const router = Router();

router.post(
  "/",
  [
    body("skinType").isString().trim().notEmpty(),
    body("concerns").isArray({ min: 1 }),
    body("concerns.*").isString().trim(),
  ],
  validate,
  recommendProducts
);

export default router;
