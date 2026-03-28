import { Router } from "express";
import { toggleFavorite, getFavorites, updateUserProfile } from "../controllers/userController";
import { protect } from "../middleware/protect";
import userUpload from "../middleware/userUpload";

const router = Router();

// @route   POST /api/users/favorites/:productId
// @desc    Toggle favorite product
// @access  Private
router.post("/favorites/:productId", protect, toggleFavorite);

// @route   GET /api/users/favorites
// @desc    Get user favorites
// @access  Private
router.get("/favorites", protect, getFavorites);

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put("/profile", protect, userUpload.single("image"), updateUserProfile);

export default router;
