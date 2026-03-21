import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./config/db";
import productRoutes from "./routes/product";
import categoryRoutes from "./routes/category";
import reviewRoutes from "./routes/review";
import cartRoutes from "./routes/cart";
import orderRoutes from "./routes/order";
import skinAdvisorRoutes from "./routes/skinAdvisor";
import newsletterRoutes from "./routes/newsletter";
import authRoutes from "./routes/authRoute";
import { errorHandler, notFound } from "./middleware/errorHandler";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

// connect db
connectDB();

// routes
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/skin-advisor", skinAdvisorRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/auth", authRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});