import Block from "../models/Block.js";
import Page from "../models/Page.js";

// Create a new block
export const createBlock = async (req, res) => {
  try {
    const { pageId, type, content, properties, order, parentBlockId } = req.body;

    // Verify page exists and user owns it
    const page = await Page.findById(pageId);
    if (!page) {
      return res.status(404).json({ success: false, error: "Page not found" });
    }
    if (page.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: "Not authorized" });
    }

    // If order not provided, get the next available order
    let blockOrder = order;
    if (blockOrder === undefined) {
      const lastBlock = await Block.findOne({ pageId, isDeleted: false })
        .sort({ order: -1 })
        .limit(1);
      blockOrder = lastBlock ? lastBlock.order + 1 : 0;
    }

    const newBlock = new Block({
      pageId,
      type: type || 'paragraph',
      content: content || "",
      properties: properties || {},
      order: blockOrder,
      parentBlockId: parentBlockId || null,
      isDeleted: false
    });

    await newBlock.save();
    
    // Update page's updatedAt
    page.updatedAt = new Date();
    await page.save();

    res.status(201).json({ success: true, block: newBlock });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get all blocks for a page
export const getPageBlocks = async (req, res) => {
  try {
    const { pageId } = req.params;

    // Verify page exists and user owns it
    const page = await Page.findById(pageId);
    if (!page) {
      return res.status(404).json({ success: false, error: "Page not found" });
    }
    if (page.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: "Not authorized" });
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

// Update a block
export const updateBlock = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, content, properties, order, parentBlockId } = req.body;

    const block = await Block.findById(id);
    if (!block) {
      return res.status(404).json({ success: false, error: "Block not found" });
    }

    // Verify user owns the page
    const page = await Page.findById(block.pageId);
    if (!page || page.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: "Not authorized" });
    }

    // Update fields
    if (type !== undefined) block.type = type;
    if (content !== undefined) block.content = content;
    if (properties !== undefined) block.properties = properties;
    if (order !== undefined) block.order = order;
    if (parentBlockId !== undefined) block.parentBlockId = parentBlockId;

    await block.save();

    // Update page's updatedAt
    page.updatedAt = new Date();
    await page.save();

    res.status(200).json({ success: true, block });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Bulk update blocks (reorder, update multiple)
export const bulkUpdateBlocks = async (req, res) => {
  try {
    const { pageId, blocks } = req.body;

    // Verify page exists and user owns it
    const page = await Page.findById(pageId);
    if (!page) {
      return res.status(404).json({ success: false, error: "Page not found" });
    }
    if (page.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: "Not authorized" });
    }

    // Update blocks in bulk
    const updatePromises = blocks.map(blockData => {
      return Block.findByIdAndUpdate(
        blockData.id,
        {
          order: blockData.order,
          content: blockData.content,
          type: blockData.type,
          properties: blockData.properties,
          parentBlockId: blockData.parentBlockId
        },
        { new: true }
      );
    });

    const updatedBlocks = await Promise.all(updatePromises);

    // Update page's updatedAt
    page.updatedAt = new Date();
    await page.save();

    res.status(200).json({ success: true, blocks: updatedBlocks });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Delete a block (soft delete)
export const deleteBlock = async (req, res) => {
  try {
    const { id } = req.params;

    const block = await Block.findById(id);
    if (!block) {
      return res.status(404).json({ success: false, error: "Block not found" });
    }

    // Verify user owns the page
    const page = await Page.findById(block.pageId);
    if (!page || page.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: "Not authorized" });
    }

    block.isDeleted = true;
    await block.save();

    // Update page's updatedAt
    page.updatedAt = new Date();
    await page.save();

    res.status(200).json({ success: true, message: "Block deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Permanently delete a block
export const permanentDeleteBlock = async (req, res) => {
  try {
    const { id } = req.params;

    const block = await Block.findById(id);
    if (!block) {
      return res.status(404).json({ success: false, error: "Block not found" });
    }

    // Verify user owns the page
    const page = await Page.findById(block.pageId);
    if (!page || page.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: "Not authorized" });
    }

    await block.deleteOne();

    res.status(200).json({ success: true, message: "Block permanently deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};