import { Router } from "express";
import { body } from "express-validator";
import { signUp, login } from "../controllers/authController";

const router = Router();

//sign up route
router.post(
  "/signUp",
  body("name").not().isEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  signUp
);

//login route
router.post(
  "/login",
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password").not().isEmpty().withMessage("Password is required"),
  login
);

export default router;
