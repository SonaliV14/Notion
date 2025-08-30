import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/db.js";
import UserRouter from "./routes/UserRoutes.js";
import cors from "cors";

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cors());

app.use("/", UserRouter);

// app.get("/", (req, res) => {
//   res.send("API is running...");
// });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
