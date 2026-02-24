import productRoutes from "./routes/product";
import authRoutes from "./routes/authRoute";
import express from "express";
import cors from "cors";
import connectDB from "./config/db";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

// connect db (ONCE)
connectDB();

// routes
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
