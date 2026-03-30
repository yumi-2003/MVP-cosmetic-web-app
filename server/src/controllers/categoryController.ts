import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import ApiError from "../utils/ApiError";
import {
  getCategoryBySlug as getCategoryBySlugService,
  listCategories,
  createCategory as serviceCreateCategory,
  updateCategory as serviceUpdateCategory,
  deleteCategory as serviceDeleteCategory,
} from "../services/categoryService";

export const getAllCategories = asyncHandler(
  async (_req: Request, res: Response) => {
    const categories = await listCategories();
    res.status(200).json(categories);
  }
);

export const getCategoryBySlug = asyncHandler(
  async (req: Request, res: Response) => {
    const category = await getCategoryBySlugService(req.params.slug);
    if (!category) throw new ApiError(404, "Category not found");
    res.status(200).json(category);
  }
);

export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const category = await serviceCreateCategory(req.body);
  res.status(201).json(category);
});

export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const category = await serviceUpdateCategory(req.params.id, req.body);
  if (!category) throw new ApiError(404, "Category not found");
  res.status(200).json(category);
});

export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  const category = await serviceDeleteCategory(req.params.id);
  if (!category) throw new ApiError(404, "Category not found");
  res.status(204).send();
});
