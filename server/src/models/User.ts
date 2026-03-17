import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  // isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    firstname: { type: String, required: true, trim: true },
    lastname: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);
