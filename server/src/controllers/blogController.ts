import { Request, Response } from "express";
import Blog from "../models/Blog";

// Get all blogs
export const getAllBlogs = async (req: Request, res: Response) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Get blog by ID or Slug
export const getBlogByIdOrSlug = async (req: Request, res: Response) => {
  try {
    const { idOrSlug } = req.params;
    let blog;
    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      blog = await Blog.findById(idOrSlug);
    } else {
      blog = await Blog.findOne({ slug: idOrSlug });
    }

    if (!blog) {
      return res.status(404).json({ message: "Blog post not found" });
    }
    res.json(blog);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Create a blog post
export const createBlog = async (req: Request, res: Response) => {
  try {
    const { title, content, excerpt, authorName, authorId, image, tags } = req.body;

    // Basic slug generation
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const newBlog = new Blog({
      title,
      slug,
      content,
      excerpt,
      authorName,
      authorId, // may be undefined for guests
      image,
      tags,
    });

    const savedBlog = await newBlog.save();
    res.status(201).json(savedBlog);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
