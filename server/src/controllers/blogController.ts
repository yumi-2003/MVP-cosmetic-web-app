import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import ApiError from "../utils/ApiError";
import * as blogService from "../services/blogService";

export const getAllBlogs = asyncHandler(async (req: Request, res: Response) => {
  const result = await blogService.listBlogs(req.query as any);
  res.status(200).json(result);
});

export const getBlogByIdOrSlug = asyncHandler(async (req: Request, res: Response) => {
  const { idOrSlug } = req.params;
  let blog;
  if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
    blog = await (await import("../models/Blog")).default.findById(idOrSlug);
  } else {
    blog = await (await import("../models/Blog")).default.findOne({ slug: idOrSlug });
  }

  if (!blog) throw new ApiError(404, "Blog post not found");
  res.status(200).json(blog);
});

export const createBlog = asyncHandler(async (req: Request, res: Response) => {
  const blog = await blogService.createBlog(req.body);
  res.status(201).json(blog);
});

export const updateBlog = asyncHandler(async (req: Request, res: Response) => {
  const blog = await blogService.updateBlog(req.params.id, req.body);
  if (!blog) throw new ApiError(404, "Blog not found");
  res.status(200).json(blog);
});

export const deleteBlog = asyncHandler(async (req: Request, res: Response) => {
  const blog = await blogService.deleteBlog(req.params.id);
  if (!blog) throw new ApiError(404, "Blog not found");
  res.status(204).send();
});
