import mongoose, { Document, Schema } from "mongoose";

export interface NewsletterSubscriberDocument extends Document {
  email: string;
  subscribedAt: Date;
}

const NewsletterSubscriberSchema: Schema<NewsletterSubscriberDocument> = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    subscribedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

NewsletterSubscriberSchema.index({ email: 1 });

export default mongoose.model<NewsletterSubscriberDocument>(
  "NewsletterSubscriber",
  NewsletterSubscriberSchema
);
