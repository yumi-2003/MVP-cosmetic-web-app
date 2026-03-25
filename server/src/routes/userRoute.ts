import { Router } from "express";
import { toggleFavorite, getFavorites } from "../controllers/userController";
import { protect } from "../middleware/protect";

const router = Router();

// @route   POST /api/users/favorites/:productId
// @desc    Toggle favorite product
// @access  Private
router.post("/favorites/:productId", protect, toggleFavorite);

// @route   GET /api/users/favorites
// @desc    Get user favorites
// @access  Private
router.get("/favorites", protect, getFavorites);

export default router;
