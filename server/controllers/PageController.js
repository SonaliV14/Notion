import Page from "../models/Page.js";
import Block from "../models/Block.js";

// Create a new page with initial empty block
export const createPage = async (req, res) => {
  try {
    const { title, icon, coverImage } = req.body;

    const newPage = new Page({
      title: title || "Untitled",
      icon: icon || "👋",
      coverImage: coverImage || null,
      owner: req.user._id,
      lastEditedBy: req.user._id,
      isDeleted: false
    });

    await newPage.save();

    // Create initial empty paragraph block
    const initialBlock = new Block({
      pageId: newPage._id,
      type: 'paragraph',
      content: "",
      order: 0,
      isDeleted: false
    });

    await initialBlock.save();

    res.status(201).json({ 
      success: true, 
      page: newPage,
      blocks: [initialBlock]
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get all active (non-deleted) pages of logged-in user
export const getUserPages = async (req, res) => {
  try {
    const { favorite, search, sortBy = 'updatedAt', order = 'desc' } = req.query;

    const query = { 
      owner: req.user._id,
      isDeleted: false 
    };

    // Filter by favorites
    if (favorite === 'true') {
      query.isFavorite = true;
    }

    // Search by title
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const sortOrder = order === 'asc' ? 1 : -1;
    const sortOptions = { [sortBy]: sortOrder };

    const pages = await Page.find(query)
      .sort(sortOptions)
      .select('-__v');
    
    res.status(200).json({ success: true, pages });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get all deleted pages (trash) of logged-in user
export const getTrashPages = async (req, res) => {
  try {
    const pages = await Page.find({ 
      owner: req.user._id,
      isDeleted: true 
    })
    .sort({ deletedAt: -1 })
    .select('-__v');
    
    res.status(200).json({ success: true, pages });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get all favorite pages
export const getFavoritePages = async (req, res) => {
  try {
    const pages = await Page.find({ 
      owner: req.user._id,
      isDeleted: false,
      isFavorite: true
    })
    .sort({ updatedAt: -1 })
    .select('-__v');
    
    res.status(200).json({ success: true, pages });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get a single page with all its blocks
export const getPage = async (req, res) => {
  try {
    const page = await Page.findById(req.params.id).select('-__v');

    if (!page) {
      return res.status(404).json({ success: false, error: "Page not found" });
    }
    if (page.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: "Not authorized" });
    }

    // Get all blocks for this page
    const blocks = await Block.find({ 
      pageId: page._id, 
      isDeleted: false 
    })
    .sort({ order: 1 })
    .select('-__v');

    res.status(200).json({ 
      success: true, 
      page,
      blocks 
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Update page metadata (title, icon, cover, etc.)
export const updatePage = async (req, res) => {
  try {
    const page = await Page.findById(req.params.id);

    if (!page) {
      return res.status(404).json({ success: false, error: "Page not found" });
    }
    if (page.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: "Not authorized" });
    }

    const { title, icon, coverImage, isFavorite, permissions } = req.body;
    
    if (title !== undefined) page.title = title;
    if (icon !== undefined) page.icon = icon;
    if (coverImage !== undefined) page.coverImage = coverImage;
    if (isFavorite !== undefined) page.isFavorite = isFavorite;
    if (permissions !== undefined) page.permissions = permissions;
    
    page.updatedAt = new Date();

    await page.save();
    res.status(200).json({ success: true, page });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Toggle favorite status
export const toggleFavorite = async (req, res) => {
  try {
    const page = await Page.findById(req.params.id);

    if (!page) {
      return res.status(404).json({ success: false, error: "Page not found" });
    }
    if (page.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: "Not authorized" });
    }

    page.isFavorite = !page.isFavorite;
    await page.save();

    res.status(200).json({ 
      success: true, 
      page,
      message: page.isFavorite ? "Added to favorites" : "Removed from favorites"
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Duplicate a page with all its blocks
export const duplicatePage = async (req, res) => {
  try {
    const originalPage = await Page.findById(req.params.id);

    if (!originalPage) {
      return res.status(404).json({ success: false, error: "Page not found" });
    }
    if (originalPage.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: "Not authorized" });
    }

    // Create duplicate page
    const duplicatePage = new Page({
      title: `${originalPage.title} (Copy)`,
      icon: originalPage.icon,
      coverImage: originalPage.coverImage,
      owner: req.user._id,
      isDeleted: false
    });

    await duplicatePage.save();

    // Get all blocks from original page
    const originalBlocks = await Block.find({ 
      pageId: originalPage._id, 
      isDeleted: false 
    }).sort({ order: 1 });

    // Create duplicate blocks
    const duplicateBlocks = originalBlocks.map(block => ({
      pageId: duplicatePage._id,
      type: block.type,
      content: block.content,
      properties: block.properties,
      order: block.order,
      parentBlockId: block.parentBlockId,
      isDeleted: false
    }));

    if (duplicateBlocks.length > 0) {
      await Block.insertMany(duplicateBlocks);
    }

    res.status(201).json({ 
      success: true, 
      page: duplicatePage,
      message: "Page duplicated successfully"
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Soft delete a page (move to trash)
export const deletePage = async (req, res) => {
  try {
    const page = await Page.findById(req.params.id);

    if (!page) {
      return res.status(404).json({ success: false, error: "Page not found" });
    }
    if (page.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: "Not authorized" });
    }

    page.isDeleted = true;
    page.deletedAt = new Date();
    await page.save();

    // Soft delete all blocks of this page
    await Block.updateMany(
      { pageId: page._id },
      { isDeleted: true }
    );

    res.status(200).json({ 
      success: true, 
      message: "Page moved to trash" 
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Restore page from trash
export const restorePage = async (req, res) => {
  try {
    const page = await Page.findById(req.params.id);

    if (!page) {
      return res.status(404).json({ success: false, error: "Page not found" });
    }
    if (page.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: "Not authorized" });
    }

    page.isDeleted = false;
    page.deletedAt = null;
    await page.save();

    // Restore all blocks of this page
    await Block.updateMany(
      { pageId: page._id },
      { isDeleted: false }
    );

    res.status(200).json({ 
      success: true, 
      message: "Page restored", 
      page 
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Permanently delete a page and all its blocks
export const permanentDeletePage = async (req, res) => {
  try {
    const page = await Page.findById(req.params.id);

    if (!page) {
      return res.status(404).json({ success: false, error: "Page not found" });
    }
    if (page.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: "Not authorized" });
    }

    // Delete all blocks first
    await Block.deleteMany({ pageId: page._id });

    // Delete the page
    await page.deleteOne();

    res.status(200).json({ 
      success: true, 
      message: "Page permanently deleted" 
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};