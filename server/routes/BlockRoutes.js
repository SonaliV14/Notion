import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { 
  createBlock,
  getPageBlocks,
  updateBlock,
  bulkUpdateBlocks,
  deleteBlock,
  permanentDeleteBlock
} from "../controllers/BlockController.js";

const router = express.Router();

// Create a new block
router.post("/", authMiddleware, createBlock);

// Get all blocks for a specific page
router.get("/page/:pageId", authMiddleware, getPageBlocks);

// Update a single block
router.put("/:id", authMiddleware, updateBlock);

// Bulk update multiple blocks (useful for reordering)
router.put("/bulk/update", authMiddleware, bulkUpdateBlocks);

// Soft delete a block
router.delete("/:id", authMiddleware, deleteBlock);

// Permanently delete a block
router.delete("/:id/permanent", authMiddleware, permanentDeleteBlock);

export default router;