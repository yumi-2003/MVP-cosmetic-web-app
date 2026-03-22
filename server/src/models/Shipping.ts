import mongoose, { Document, Schema, Types } from "mongoose";

export interface IShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface IShipping extends Document {
  order: Types.ObjectId;
  address: IShippingAddress;
  distanceKm: number;
  status: "pending" | "processing" | "shipped" | "out_for_delivery" | "delivered" | "failed" | "returned";
  carrier?: string;
  trackingNumber?: string;
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  statusHistory: Array<{
    status: string;
    description: string;
    timestamp: Date;
  }>;
}

const ShippingAddressSchema = new Schema<IShippingAddress>(
  {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  { _id: false }
);

const ShippingSchema = new Schema<IShipping>(
  {
    order: { type: Schema.Types.ObjectId, ref: "Order", required: true, unique: true },
    address: { type: ShippingAddressSchema, required: true },
    distanceKm: { type: Number, required: true, default: 0 },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "out_for_delivery", "delivered", "failed", "returned"],
      default: "pending",
      index: true,
    },
    carrier: { type: String, default: "Standard Shipping" },
    trackingNumber: { type: String },
    estimatedDelivery: { type: Date },
    actualDelivery: { type: Date },
    statusHistory: [
      {
        status: { type: String, required: true },
        description: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// Add initial status to history when created
ShippingSchema.pre("save", async function () {
  if (this.isNew) {
    this.statusHistory.push({
      status: this.status,
      description: "Order received; awaiting processing.",
      timestamp: new Date(),
    });
  }
});

export default mongoose.model<IShipping>("Shipping", ShippingSchema);
