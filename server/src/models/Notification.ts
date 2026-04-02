import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
  message: string;
  type: "order" | "user" | "inventory";
  relatedId?: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    message: { type: String, required: true },
    type: { type: String, enum: ["order", "user", "inventory"], required: true },
    relatedId: { type: String },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<INotification>("Notification", notificationSchema);
