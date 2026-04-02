import express from "express";
import notificationRoutes from "./notification";
import { protect, admin } from "../middleware/protect";
import { getDashboardStats } from "../controllers/adminController";
import {
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController";
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController";
import {
  getUsers,
  updateUser,
  deleteUser,
} from "../controllers/userController";
import {
  getAllOrders,
  updateStatus,
} from "../controllers/orderController";
import {
  getAllBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
} from "../controllers/blogController";

const router = express.Router();

// All routes here are protected and require admin privileges
router.use(protect);
router.use(admin);

// Notifications
router.use("/notifications", notificationRoutes);

// Dashboard
router.get("/stats", getDashboardStats);

// Products
router.post("/products", createProduct);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

// Categories
router.post("/categories", createCategory);
router.put("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);

// Users
router.get("/users", getUsers);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

// Orders
router.get("/orders", getAllOrders);
router.put("/orders/:id", updateStatus);

// Blogs
router.get("/blogs", getAllBlogs);
router.post("/blogs", createBlog);
router.put("/blogs/:id", updateBlog);
router.delete("/blogs/:id", deleteBlog);

export default router;
