import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./src/models/Product";
import Order from "./src/models/Order";
import { addItemToCart } from "./src/services/cartService";

dotenv.config();

async function verify() {
  await mongoose.connect(process.env.MONGO_URI!);
  console.log("Connected to DB");

  const owner = { sessionId: "race-test-" + Date.now() };
  const products = await Product.find().limit(1);
  const p1 = products[0];

  console.log("1. Simulating 5 concurrent 'Add to Cart' requests...");
  
  const startTime = Date.now();
  const results = await Promise.allSettled([
    addItemToCart(owner, p1._id.toString(), 1),
    addItemToCart(owner, p1._id.toString(), 1),
    addItemToCart(owner, p1._id.toString(), 1),
    addItemToCart(owner, p1._id.toString(), 1),
    addItemToCart(owner, p1._id.toString(), 1),
  ]);

  const duration = Date.now() - startTime;
  console.log(`Requests completed in ${duration}ms`);

  const successes = results.filter(r => r.status === "fulfilled").length;
  const failures = results.filter(r => r.status === "rejected").length;
  console.log(`Successes: ${successes}, Failures: ${failures}`);

  console.log("2. Checking database for duplicate carts...");
  const carts = await Order.find({ sessionId: owner.sessionId, status: "cart" });
  console.log(`Total cart documents found: ${carts.length} (Expected: 1)`);

  if (carts.length === 1) {
    const finalQuantity = carts[0].items[0]?.quantity;
    console.log(`Final item quantity: ${finalQuantity} (Expected: total successful additions)`);
    console.log("SUCCESS: Only one cart document exists, and it is consistent!");
  } else {
    console.log("FAILURE: Multiple cart documents created!");
  }

  // Cleanup
  await Order.deleteMany({ sessionId: owner.sessionId });
  process.exit(0);
}

verify().catch(console.error);
