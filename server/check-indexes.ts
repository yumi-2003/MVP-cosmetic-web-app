import mongoose from "mongoose";
import dotenv from "dotenv";
import Order from "./src/models/Order";

dotenv.config();

async function check() {
  await mongoose.connect(process.env.MONGO_URI!);
  const indexes = await Order.collection.getIndexes();
  console.log(JSON.stringify(indexes, null, 2));
  process.exit(0);
}

check().catch(console.error);
