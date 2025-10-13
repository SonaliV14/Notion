import Page from "../models/Page.js";
import Block from "../models/Block.js";
import Collaborator from "../models/Collaborator.js";

// Helper function to check if user has access to page
const checkPageAccess = async (pageId, userId, requiredRole = null) => {
  const page = await Page.findById(pageId);
  if (!page) return { hasAccess: false, page: null, role: null };

  // Check if user is owner
  const isOwner = page.owner.toString() === userId.toString();
  if (isOwner) return { hasAccess: true, page, role: 'owner' };

  // Check if user is a collaborator
  const collaboration = await Collaborator.findOne({
    pageId,
    userId,
    status: 'accepted'
  });

  if (!collaboration) return { hasAccess: false, page, role: null };

  // If specific role required, check it
  if (requiredRole) {
    const roleHierarchy = { viewer: 1, editor: 2, admin: 3 };
    const hasRequiredRole = roleHierarchy[collaboration.role] >= roleHierarchy[requiredRole];
    return { hasAccess: hasRequiredRole, page, role: collaboration.role };
  }

  return { hasAccess: true, page, role: collaboration.role };
};

// Create a new page with initial empty block
export const createPage = async (req, res) => {
  try {
    const { title, icon, coverImage } = req.body;

    const newPage = new Page({
      title: title || "Untitled",
      icon: icon || "👋",
      coverImage: coverImage || null,
      owner: req.user._id,
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

    // Return page with ownership flags
    const pageObject = newPage.toObject();
    pageObject.isOwner = true;
    pageObject.userRole = 'owner';

    res.status(201).json({ 
      success: true, 
      page: pageObject,
      blocks: [initialBlock]
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get all active (non-deleted) pages of logged-in user (owned only)
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

    // Get owned pages
    const ownedPages = await Page.find(query)
      .sort(sortOptions)
      .select('-__v')
      .lean();

    // Add ownership info to each page
    const pagesWithOwnership = ownedPages.map(page => ({
      ...page,
      userRole: 'owner',
      isOwner: true
    }));
    
    res.status(200).json({ success: true, pages: pagesWithOwnership });
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
    .select('-__v')
    .lean();

    // Add ownership info
    const pagesWithOwnership = pages.map(page => ({
      ...page,
      userRole: 'owner',
      isOwner: true
    }));
    
    res.status(200).json({ success: true, pages: pagesWithOwnership });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get a single page with all its blocks
export const getPage = async (req, res) => {
  try {
    const { hasAccess, page, role } = await checkPageAccess(req.params.id, req.user._id);

    if (!hasAccess || !page) {
      return res.status(403).json({ success: false, error: "Not authorized to view this page" });
    }

    // Get all blocks for this page
    const blocks = await Block.find({ 
      pageId: page._id, 
      isDeleted: false 
    })
    .sort({ order: 1 })
    .select('-__v');

    // Add role information
    const pageWithRole = {
      ...page.toObject(),
      userRole: role,
      isOwner: role === 'owner'
    };

    res.status(200).json({ 
      success: true, 
      page: pageWithRole,
      blocks 
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Update page metadata (title, icon, cover, etc.)
export const updatePage = async (req, res) => {
  try {
    // Check if user has editor or admin access
    const { hasAccess, page, role } = await checkPageAccess(req.params.id, req.user._id, 'editor');

    if (!hasAccess || !page) {
      return res.status(403).json({ success: false, error: "Not authorized to edit this page" });
    }

    const { title, icon, coverImage, isFavorite, permissions } = req.body;
    
    if (title !== undefined) page.title = title;
    if (icon !== undefined) page.icon = icon;
    if (coverImage !== undefined) page.coverImage = coverImage;
    
    // Only owner can change favorite status and permissions
    if (role === 'owner') {
      if (isFavorite !== undefined) page.isFavorite = isFavorite;
      if (permissions !== undefined) page.permissions = permissions;
    }
    
    page.updatedAt = new Date();
    await page.save();

    // Return page with role info
    const pageWithRole = {
      ...page.toObject(),
      userRole: role,
      isOwner: role === 'owner'
    };

    res.status(200).json({ success: true, page: pageWithRole });
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
    
    // Only owner can favorite/unfavorite
    if (page.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: "Only owner can manage favorites" });
    }

    page.isFavorite = !page.isFavorite;
    await page.save();

    const pageWithRole = {
      ...page.toObject(),
      userRole: 'owner',
      isOwner: true
    };

    res.status(200).json({ 
      success: true, 
      page: pageWithRole,
      message: page.isFavorite ? "Added to favorites" : "Removed from favorites"
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Duplicate a page with all its blocks
export const duplicatePage = async (req, res) => {
  try {
    const { hasAccess, page, role } = await checkPageAccess(req.params.id, req.user._id);

    if (!hasAccess || !page) {
      return res.status(403).json({ success: false, error: "Not authorized to duplicate this page" });
    }

    // Create duplicate page (always owned by the user duplicating)
    const duplicatePage = new Page({
      title: `${page.title} (Copy)`,
      icon: page.icon,
      coverImage: page.coverImage,
      owner: req.user._id,
      isDeleted: false
    });

    await duplicatePage.save();

    // Get all blocks from original page
    const originalBlocks = await Block.find({ 
      pageId: page._id, 
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

    const pageWithRole = {
      ...duplicatePage.toObject(),
      userRole: 'owner',
      isOwner: true
    };

    res.status(201).json({ 
      success: true, 
      page: pageWithRole,
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

    // Only owner can delete
    if (page.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: "Only page owner can delete" });
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
    
    // Only owner can restore
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

    const pageWithRole = {
      ...page.toObject(),
      userRole: 'owner',
      isOwner: true
    };

    res.status(200).json({ 
      success: true, 
      message: "Page restored", 
      page: pageWithRole
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
    
    // Only owner can permanently delete
    if (page.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: "Not authorized" });
    }

    // Delete all collaborations
    await Collaborator.deleteMany({ pageId: page._id });

    // Delete all blocks
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