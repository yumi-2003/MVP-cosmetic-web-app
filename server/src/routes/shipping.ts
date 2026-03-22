import { Router } from "express";
import { param } from "express-validator";
import validate from "../middleware/validate";
import Shipping from "../models/Shipping";
import ApiError from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

// GET /api/shipping/:orderId — get tracking info for a given order
router.get(
  "/:orderId",
  [param("orderId").isMongoId()],
  validate,
  asyncHandler(async (req, res) => {
    const shipping = await Shipping.findOne({ order: req.params.orderId }).lean();
    if (!shipping) {
      throw new ApiError(404, "Tracking info not found for this order");
    }
    res.status(200).json(shipping);
  })
);

export default router;
