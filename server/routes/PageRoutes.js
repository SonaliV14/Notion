import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { 
  createPage, 
  getUserPages, 
  getTrashPages,
  getFavoritePages,
  getPage, 
  updatePage,
  toggleFavorite,
  duplicatePage,
  deletePage,
  restorePage,
  permanentDeletePage
} from "../controllers/PageController.js";

const router = express.Router();

// Create a new page
router.post("/", authMiddleware, createPage);

// Get all active pages belonging to logged-in user
// Supports query params: ?favorite=true&search=keyword&sortBy=updatedAt&order=desc
router.get("/", authMiddleware, getUserPages);

// Get all favorite pages
router.get("/favorites", authMiddleware, getFavoritePages);

// Get all trash pages
router.get("/trash", authMiddleware, getTrashPages);

// Get single page with all its blocks (only if owner)
router.get("/:id", authMiddleware, getPage);

// Update page metadata (title, icon, cover, etc.)
router.put("/:id", authMiddleware, updatePage);

// Toggle favorite status
router.patch("/:id/favorite", authMiddleware, toggleFavorite);

// Duplicate a page with all its blocks
router.post("/:id/duplicate", authMiddleware, duplicatePage);

// Soft delete page (move to trash)
router.delete("/:id", authMiddleware, deletePage);

// Restore page from trash
router.patch("/:id/restore", authMiddleware, restorePage);

// Permanently delete page
router.delete("/:id/permanent", authMiddleware, permanentDeletePage);

export default router;