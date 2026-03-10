import mongoose, { Document, Schema } from "mongoose";

export interface CategoryDocument extends Document {
  name: string;
  description?: string;
}

const CategorySchema: Schema<CategoryDocument> = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, trim: true },
  },
  { timestamps: true },
);

export default mongoose.model<CategoryDocument>("Category", CategorySchema);
