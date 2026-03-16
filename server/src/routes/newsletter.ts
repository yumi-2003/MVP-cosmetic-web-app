import { Router } from "express";
import { body } from "express-validator";
import { subscribeNewsletter } from "../controllers/newsletterController";
import validate from "../middleware/validate";

const router = Router();

router.post(
  "/",
  [body("email").isEmail().normalizeEmail()],
  validate,
  subscribeNewsletter
);

export default router;
