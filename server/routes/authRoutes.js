import express from "express";
import { signup, login, googleLogin } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/google", googleLogin);

// Protected route (only accessible with valid JWT)
router.get("/profile", authMiddleware, (req, res) => {
  res.json({ message: "Profile data", user: req.user });
});

export default router;
