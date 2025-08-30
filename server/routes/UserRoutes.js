import express from "express";
import { signup, login, googleLogin } from "../controllers/UserController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const UserRouter = express.Router();

UserRouter.post("/signup", signup);
UserRouter.post("/login", login);
UserRouter.post("/google", googleLogin);

// Protected route (only accessible with valid JWT)
UserRouter.get("/profile", authMiddleware, (req, res) => {
  res.json({ message: "Profile data", user: req.user });
});

export default UserRouter;
