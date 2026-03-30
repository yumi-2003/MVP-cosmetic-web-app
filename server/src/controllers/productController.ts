import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import ApiError from "../utils/ApiError";
import {
  listProducts,
  getProductBySlug as fetchProductBySlug,
  createProduct as serviceCreateProduct,
  updateProduct as serviceUpdateProduct,
  deleteProduct as serviceDeleteProduct,
  type ProductQuery
} from "../services/productService";

export const getAllProducts = asyncHandler(async (req: Request, res: Response) => {
  const result = await listProducts(req.query as unknown as ProductQuery);
  res.status(200).json(result);
});

export const getProductBySlug = asyncHandler(async (req: Request, res: Response) => {
  const product = await fetchProductBySlug(req.params.slug);
  if (!product) throw new ApiError(404, "Product not found");
  res.status(200).json(product);
});

export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await serviceCreateProduct(req.body);
  res.status(201).json(product);
});

export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await serviceUpdateProduct(req.params.id, req.body);
  if (!product) throw new ApiError(404, "Product not found");
  res.status(200).json(product);
});

export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await serviceDeleteProduct(req.params.id);
  if (!product) throw new ApiError(404, "Product not found");
  res.status(204).send();
});
