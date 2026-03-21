import mongoose, { Document, Schema } from "mongoose";

export interface CategoryDocument extends Document {
  name: string;
  slug: string;
  description?: string;
}

const CategorySchema: Schema<CategoryDocument> = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, trim: true },
  },
  { timestamps: true }
);

// No explicit index needed for slug as unique: true already creates one

export default mongoose.model<CategoryDocument>("Category", CategorySchema);