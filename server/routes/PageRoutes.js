import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { 
  createPage, 
  getUserPages,
  getSharedPages,
  getFavoritePages,
  getTrashPages,
  searchPages,
  getPage, 
  updatePage,
  toggleFavorite,
  duplicatePage,
  sharePage,
  removeSharedUser,
  generateShareLink,
  disableShareLink,
  getPageByShareLink,
  deletePage,
  restorePage,
  permanentDeletePage
} from "../controllers/PageController.js";

const router = express.Router();

// Create a new page
router.post("/", authMiddleware, createPage);

// Get all active pages belonging to logged-in user
router.get("/", authMiddleware, getUserPages);

// Get shared pages
router.get("/shared", authMiddleware, getSharedPages);

// Get favorite pages
router.get("/favorites", authMiddleware, getFavoritePages);

// Get all trash pages
router.get("/trash", authMiddleware, getTrashPages);

// Search pages
router.get("/search", authMiddleware, searchPages);

// Get page by public share link (no auth required)
router.get("/public/:shareLink", getPageByShareLink);

// Get single page (only if owner or shared with)
router.get("/:id", authMiddleware, getPage);

// Update page
router.put("/:id", authMiddleware, updatePage);

// Toggle favorite
router.patch("/:id/favorite", authMiddleware, toggleFavorite);

// Duplicate page
router.post("/:id/duplicate", authMiddleware, duplicatePage);

// Share page with users
router.post("/:id/share", authMiddleware, sharePage);

// Remove user from shared page
router.delete("/:id/share/:userId", authMiddleware, removeSharedUser);

// Generate public share link
router.post("/:id/share-link", authMiddleware, generateShareLink);

// Disable public share link
router.delete("/:id/share-link", authMiddleware, disableShareLink);

// Soft delete page (move to trash)
router.delete("/:id", authMiddleware, deletePage);

// Restore page from trash
router.patch("/:id/restore", authMiddleware, restorePage);

// Permanently delete page
router.delete("/:id/permanent", authMiddleware, permanentDeletePage);

export default router;