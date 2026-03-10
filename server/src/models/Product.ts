import mongoose, { Document, Schema } from "mongoose";

export interface ProductDocument extends Document {
  name: string;
  price: number;
  brand: string;
  description?: string;
  imageUrl?: string[];
  inStock: boolean;
  category: string;
}

const ProductSchema: Schema<ProductDocument> = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    brand: { type: String, required: true },
    description: { type: String },
    imageUrl: { type: [String], required: true },
    category: { type: String, required: true },
  },
  { timestamps: true },
);

export default mongoose.model<ProductDocument>("Product", ProductSchema);
