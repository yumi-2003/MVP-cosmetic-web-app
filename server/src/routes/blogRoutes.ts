import express from "express";
import { getAllBlogs, getBlogByIdOrSlug, createBlog } from "../controllers/blogController";
import { protect } from "../middleware/protect";

const router = express.Router();

// Public routes for blog posts
router.get("/", getAllBlogs);
router.get("/:idOrSlug", getBlogByIdOrSlug);

// Protected route to create blog post
router.post("/", protect, createBlog);

export default router;
