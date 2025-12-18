import mongoose, { Document, Schema } from "mongoose";
import { ProductType } from "../types/Product";

export interface ProductDocument extends Document {
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
  category: string;
}

const ProductSchema: Schema<ProductDocument> = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    imageUrl: { type: String },
    category: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<ProductDocument>("Product", ProductSchema);
