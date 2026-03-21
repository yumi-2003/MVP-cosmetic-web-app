import mongoose, { HydratedDocument, Schema, Types } from "mongoose";

export interface ProductProps {
  name: string;
  slug: string;
  description?: string;
  price: number;
  comparePrice?: number;
  category: Types.ObjectId;
  images: string[];
  tags: string[];
  skinTypes: string[];
  concerns: string[];
  ingredients: string[];
  routineStep?: string;
  rating: number;
  reviewCount: number;
  isNew: boolean;
  isBestSeller: boolean;
}

export type ProductDocument = HydratedDocument<ProductProps>;

const ProductSchema = new Schema<ProductProps>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String },
    price: { type: Number, required: true, min: 0 },
    comparePrice: { type: Number, min: 0 },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    images: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    skinTypes: { type: [String], default: [] },
    concerns: { type: [String], default: [] },
    ingredients: { type: [String], default: [] },
    routineStep: { type: String },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    isNew: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// No explicit index needed for slug as unique: true already creates one
ProductSchema.index({ category: 1 });
ProductSchema.index({ skinTypes: 1 });
ProductSchema.index({ concerns: 1 });
ProductSchema.index({ name: "text", description: "text" });

export default mongoose.model<ProductProps>("Product", ProductSchema);
