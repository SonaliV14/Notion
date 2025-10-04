import express from "express";
import authMiddleware, { isPageOwner } from "../middlewares/authMiddleware.js";
import { 
  createPage, 
  getUserPages, 
  getTrashPages,
  getPage, 
  updatePage, 
  deletePage,
  restorePage,
  permanentDeletePage
} from "../controllers/PageController.js";

const router = express.Router();

// Create a new page
router.post("/", authMiddleware, createPage);

// Get all active pages belonging to logged-in user
router.get("/", authMiddleware, getUserPages);

// Get all trash pages
router.get("/trash", authMiddleware, getTrashPages);

// Get single page (only if owner)
router.get("/:id", authMiddleware, isPageOwner, getPage);

// Update page
router.put("/:id", authMiddleware, isPageOwner, updatePage);

// Soft delete page (move to trash)
router.delete("/:id", authMiddleware, isPageOwner, deletePage);

// Restore page from trash
router.patch("/:id/restore", authMiddleware, isPageOwner, restorePage);

// Permanently delete page
router.delete("/:id/permanent", authMiddleware, isPageOwner, permanentDeletePage);

export default router;