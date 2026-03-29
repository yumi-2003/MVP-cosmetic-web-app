import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/db";
import Category from "../models/Category";
import Product from "../models/Product";
import Blog from "../models/Blog";
import slugify from "../utils/slugify";
import { categories, products, blogs } from "./sampleData";

dotenv.config();

const seed = async () => {
  try {
    await connectDB();

    await Promise.all([
      Category.deleteMany({}),
      Product.deleteMany({}),
      Blog.deleteMany({}),
    ]);

    const createdCategories = await Category.insertMany(categories);
    const categoryMap = new Map(
      createdCategories.map((category) => [category.slug, category._id])
    );

    const productDocs = products.map((product) => {
      const categoryId = categoryMap.get(product.categorySlug);
      if (!categoryId) {
        throw new Error(`Category not found for slug: ${product.categorySlug}`);
      }

      return {
        name: product.name,
        slug: slugify(product.name),
        description: product.description,
        price: product.price,
        comparePrice: product.comparePrice,
        category: categoryId,
        images: product.images,
        tags: product.tags,
        skinTypes: product.skinTypes,
        concerns: product.concerns,
        ingredients: product.ingredients,
        routineStep: product.routineStep,
        rating: product.rating,
        reviewCount: product.reviewCount,
        isNew: product.isNew,
        isBestSeller: product.isBestSeller,
        countInStock: product.countInStock || 0,
      };
    });

    await Product.insertMany(productDocs);
    await Blog.insertMany(blogs);

    console.log("Seed completed: categories, products and blogs inserted.");
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seed();
