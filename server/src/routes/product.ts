import { Router } from "express";
import {
  getAllProducts,
  getProductbyId,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController";
import parser from "../middleware/upload";
import { protect } from "../middleware/protect";

const router = Router();
router.get("/", getAllProducts);
router.get("/:id", getProductbyId);
router.post("/", protect, parser.single("image"), createProduct);
router.put("/:id", protect, parser.single("image"), updateProduct);
router.delete("/:id", protect, deleteProduct);

export default router;
