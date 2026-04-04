import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "../src/config/db";
import productRoutes from "../src/routes/product";
import categoryRoutes from "../src/routes/category";
import reviewRoutes from "../src/routes/review";
import cartRoutes from "../src/routes/cart";
import orderRoutes from "../src/routes/order";
import skinAdvisorRoutes from "../src/routes/skinAdvisor";
import newsletterRoutes from "../src/routes/newsletter";
import authRoutes from "../src/routes/authRoute";
import shippingRoutes from "../src/routes/shipping";
import userRoutes from "../src/routes/userRoute";
import blogRoutes from "../src/routes/blogRoutes";
import adminRoutes from "../src/routes/adminRoutes";
import { errorHandler, notFound } from "../src/middleware/errorHandler";

const app = express();

// CORS — allow the deployed client origin (set CLIENT_URL in Vercel env vars)
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
  })
);

app.use(express.json());

// Connect to MongoDB Atlas once per cold start
connectDB();

// Routes
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/skin-advisor", skinAdvisorRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/shipping", shippingRoutes);
app.use("/api/users", userRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/admin", adminRoutes);

app.use(notFound);
app.use(errorHandler);

// ✅ Export app — do NOT call app.listen() here.
// Vercel handles the server lifecycle for serverless functions.
export default app;
