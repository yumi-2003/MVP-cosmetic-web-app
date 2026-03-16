import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import ApiError from "../utils/ApiError";
import { getCategoryBySlug, listCategories } from "../services/categoryService";

export const getAllCategories = asyncHandler(
  async (_req: Request, res: Response) => {
    const categories = await listCategories();
    res.status(200).json(categories);
  }
);

export const getCategoryBySlug = asyncHandler(
  async (req: Request, res: Response) => {
    const category = await getCategoryBySlug(req.params.slug);
    if (!category) throw new ApiError(404, "Category not found");
    res.status(200).json(category);
  }
);
