import mongoose, { Document, Schema, Types } from "mongoose";

export const ORDER_STATUSES = [
  "cart",
  "placed",
  "paid",
  "shipped",
  "delivered",
  "cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export interface OrderItem {
  product: Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface OrderDocument extends Document {
  user?: Types.ObjectId;
  sessionId?: string;
  items: OrderItem[];
  status: OrderStatus;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  placedAt?: Date;
}

const OrderItemSchema = new Schema<OrderItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    image: { type: String },
  },
  { _id: false }
);

const OrderSchema: Schema<OrderDocument> = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    sessionId: { type: String, index: true },
    items: { type: [OrderItemSchema], default: [] },
    status: {
      type: String,
      enum: ORDER_STATUSES,
      default: "cart",
      index: true,
    },
    subtotal: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    shipping: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    placedAt: { type: Date },
  },
  { timestamps: true }
);

OrderSchema.index(
  { user: 1, status: 1 },
  { unique: true, partialFilterExpression: { status: "cart" } }
);
OrderSchema.index(
  { sessionId: 1, status: 1 },
  { unique: true, partialFilterExpression: { status: "cart" } }
);

export default mongoose.model<OrderDocument>("Order", OrderSchema);
