import Block from "../models/Block.js";
import Page from "../models/Page.js";
import Collaborator from "../models/Collaborator.js";

// Helper function to check if user can edit page
const canEditPage = async (pageId, userId) => {
  const page = await Page.findById(pageId);
  if (!page) return false;

  // Check if user is owner
  if (page.owner.toString() === userId.toString()) return true;

  // Check if user is editor or admin collaborator
  const collaboration = await Collaborator.findOne({
    pageId,
    userId,
    status: 'accepted',
    role: { $in: ['editor', 'admin'] }
  });

  return !!collaboration;
};

// Create a new block
export const createBlock = async (req, res) => {
  try {
    const { pageId, type, content, order, properties, parentBlockId } = req.body;

    // Check if user can edit this page
    const canEdit = await canEditPage(pageId, req.user._id);
    if (!canEdit) {
      return res.status(403).json({ success: false, error: "Not authorized to edit this page" });
    }

    const newBlock = new Block({
      pageId,
      type: type || 'paragraph',
      content: content || '',
      order: order || 0,
      properties: properties || {},
      parentBlockId: parentBlockId || null,
      isDeleted: false
    });

    await newBlock.save();
    res.status(201).json({ success: true, block: newBlock });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get all blocks for a page
export const getPageBlocks = async (req, res) => {
  try {
    const { pageId } = req.params;

    // Check if page exists
    const page = await Page.findById(pageId);
    if (!page) {
      return res.status(404).json({ success: false, error: "Page not found" });
    }

    // Check if user has access (owner or any collaborator)
    const isOwner = page.owner.toString() === req.user._id.toString();
    const isCollaborator = await Collaborator.findOne({
      pageId,
      userId: req.user._id,
      status: 'accepted'
    });

    if (!isOwner && !isCollaborator) {
      return res.status(403).json({ success: false, error: "Not authorized to view this page" });
    }

    const blocks = await Block.find({ 
      pageId, 
      isDeleted: false 
    }).sort({ order: 1 });

    res.status(200).json({ success: true, blocks });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Update a single block
export const updateBlock = async (req, res) => {
  try {
    const block = await Block.findById(req.params.id);

    if (!block) {
      return res.status(404).json({ success: false, error: "Block not found" });
    }

    // Check if user can edit this page
    const canEdit = await canEditPage(block.pageId, req.user._id);
    if (!canEdit) {
      return res.status(403).json({ success: false, error: "Not authorized to edit this page" });
    }

    const { type, content, properties, order, parentBlockId } = req.body;

    if (type !== undefined) block.type = type;
    if (content !== undefined) block.content = content;
    if (properties !== undefined) block.properties = properties;
    if (order !== undefined) block.order = order;
    if (parentBlockId !== undefined) block.parentBlockId = parentBlockId;

    await block.save();
    res.status(200).json({ success: true, block });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Bulk update blocks (for reordering)
export const bulkUpdateBlocks = async (req, res) => {
  try {
    const { pageId, blocks } = req.body;

    if (!blocks || !Array.isArray(blocks)) {
      return res.status(400).json({ success: false, error: "Invalid blocks data" });
    }

    // Check if user can edit this page
    const canEdit = await canEditPage(pageId, req.user._id);
    if (!canEdit) {
      return res.status(403).json({ success: false, error: "Not authorized to edit this page" });
    }

    // Update each block
    const updatePromises = blocks.map(blockData => 
      Block.findByIdAndUpdate(
        blockData._id,
        { 
          order: blockData.order,
          parentBlockId: blockData.parentBlockId 
        },
        { new: true }
      )
    );

    const updatedBlocks = await Promise.all(updatePromises);

    res.status(200).json({ 
      success: true, 
      blocks: updatedBlocks,
      message: "Blocks updated successfully"
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Soft delete a block
export const deleteBlock = async (req, res) => {
  try {
    const block = await Block.findById(req.params.id);

    if (!block) {
      return res.status(404).json({ success: false, error: "Block not found" });
    }

    // Check if user can edit this page
    const canEdit = await canEditPage(block.pageId, req.user._id);
    if (!canEdit) {
      return res.status(403).json({ success: false, error: "Not authorized to edit this page" });
    }

    block.isDeleted = true;
    await block.save();

    res.status(200).json({ 
      success: true, 
      message: "Block deleted successfully" 
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Permanently delete a block
export const permanentDeleteBlock = async (req, res) => {
  try {
    const block = await Block.findById(req.params.id);

    if (!block) {
      return res.status(404).json({ success: false, error: "Block not found" });
    }

    // Check if user can edit this page
    const canEdit = await canEditPage(block.pageId, req.user._id);
    if (!canEdit) {
      return res.status(403).json({ success: false, error: "Not authorized to edit this page" });
    }

    await block.deleteOne();

    res.status(200).json({ 
      success: true, 
      message: "Block permanently deleted" 
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};