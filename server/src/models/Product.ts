import mongoose, { Document, Schema } from "mongoose";

export interface ProductDocument extends Document {
  name: string;
  price: number;
  brand?: string;
  description?: string;
  images?: string[];
  stock: number;
  rating: number;
  numReviews?: number;
  category: string;
}

const ProductSchema: Schema<ProductDocument> = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    brand: { type: String },
    description: { type: String },
    images: { type: [String], default: [] },
    stock: { type: Number, required: true, default: 0 },
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, default: 0 },
    category: { type: String, required: true },
  },
  { timestamps: true },
);

export default mongoose.model<ProductDocument>("Product", ProductSchema);
