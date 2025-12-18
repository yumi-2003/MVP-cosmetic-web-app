import { Router } from "express";
import {
  getAllProducts,
  getProductbyId,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController";
import parser from "../middleware/upload";

const router = Router();
router.get("/", getAllProducts);
router.get("/:id", getProductbyId);
router.post("/", parser.single("image"), createProduct);
router.put("/:id", parser.single("image"), updateProduct);
router.delete("/:id", deleteProduct);

export default router;
