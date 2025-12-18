import { Request, Response } from "express";
import Product from "../models/Product";
import { ProductType } from "../types/Product";

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
    if (!product) res.status(404).json({ msg: "Product doesn't exist" });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

//create a new product
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, price, description, category } = req.body;
    const imageUrl = req.file?.path;

    const newProduct: ProductType = {
      name,
      price,
      description,
      category,
      imageUrl,
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
    const { name, price, description, category } = req.body;
    const imageUrl = req.file?.path;

    const updateFields: Partial<ProductType> = {
      name,
      price,
      description,
      category,
    };
    if (imageUrl) updateFields.imageUrl = imageUrl;
    const updateProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );
    if (!updateProduct) res.status(404).json({ msg: "Product not found" });
    res.status(200).json(updateProduct);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

//delete product
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const deleteProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deleteProduct) res.status(404).json({ msg: "Product not found" });
    res.status(200).json({ msg: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};
