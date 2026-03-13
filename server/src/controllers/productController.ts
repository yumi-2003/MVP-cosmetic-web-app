import { Request, Response } from "express";
import Product from "../models/Product";
import type { ProductDocument as ProductType } from "../models/Product";

//get all products
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ msg: "server error" });
  }
};

//get product by id
export const getProductbyId = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ msg: "Product doesn't exist" });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

//create a new product
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, price, description, category, brand, stock } = req.body;
    const images = req.file?.path ? [req.file.path] : undefined;

    const newProduct: Pick<ProductType, "name" | "price" | "description" | "category" | "brand" | "stock" | "rating" | "images"> = {
      name,
      price,
      description,
      category,
      brand,
      stock: Number(stock) || 0,
      rating: 0,
      images,
    };
    const product = new Product(newProduct);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

//update a product
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { name, price, description, category, brand, stock } = req.body;
    const images = req.file?.path ? [req.file.path] : undefined;

    const updateFields: Partial<ProductType> = {
      name,
      price,
      description,
      category,
      brand,
      ...(stock !== undefined && { stock: Number(stock) }),
    };
    if (images) updateFields.images = images;
    const updateProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );
    if (!updateProduct) return res.status(404).json({ msg: "Product not found" });
    res.status(200).json(updateProduct);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

//delete product
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const deleteProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deleteProduct) return res.status(404).json({ msg: "Product not found" });
    res.status(200).json({ msg: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};
