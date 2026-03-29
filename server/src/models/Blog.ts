import mongoose, { Schema, Document } from "mongoose";

export interface IBlog extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  authorName: string;
  authorId?: mongoose.Types.ObjectId;
  image: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const blogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    authorName: { type: String, required: true },
    authorId: { type: Schema.Types.ObjectId, ref: "User" },
    image: { type: String, required: true },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model<IBlog>("Blog", blogSchema);
