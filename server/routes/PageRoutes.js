import express from "express";
import authMiddleware, { isPageOwner } from "../middlewares/authMiddleware.js";
import { createPage, getUserPages, getPage, updatePage, deletePage } from "../controllers/PageController.js";

const router = express.Router();

// Create a new page
router.post("/", authMiddleware, createPage);

// Get all pages belonging to logged-in user
router.get("/", authMiddleware, getUserPages);

// Get single page (only if owner)
router.get("/:id", authMiddleware, isPageOwner, getPage);

// Update page
router.put("/:id", authMiddleware, isPageOwner, updatePage);

// Delete page
router.delete("/:id", authMiddleware, isPageOwner, deletePage);

export default router;
