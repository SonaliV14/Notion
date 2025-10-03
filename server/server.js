import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import UserRoutes from "./routes/UserRoutes.js";
import PageRoutes from "./routes/PageRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: "*"
}));
app.use(express.json());

// Routes
app.use("/api/auth", UserRoutes);  // Auth routes: /api/auth/signup, /api/auth/login
app.use("/api/pages", PageRoutes); // ✅ FIXED: Page routes should be /api/pages/*

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
    app.listen(process.env.PORT || 5000, () =>
      console.log(`Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch((err) => console.error("MongoDB connection error:", err));