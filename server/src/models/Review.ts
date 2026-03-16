import mongoose, { Document, Schema, Types } from "mongoose";

export interface ReviewDocument extends Document {
  product: Types.ObjectId;
  name?: string;
  rating: number;
  comment?: string;
  user?: Types.ObjectId;
}

const ReviewSchema: Schema<ReviewDocument> = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true },
    user: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

ReviewSchema.index({ product: 1, createdAt: -1 });

export default mongoose.model<ReviewDocument>("Review", ReviewSchema);
