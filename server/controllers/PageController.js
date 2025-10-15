import Page from "../models/Page.js";
import User from "../models/User.js";
import { v4 as uuidv4 } from 'uuid';

// Create a new page
export const createPage = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, error: "Title is required" });
    }

    const newPage = new Page({
      title,
      content: content || "",
      owner: req.user._id,
      isDeleted: false
    });

    await newPage.save();
    res.status(201).json({ success: true, page: newPage });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get all active (non-deleted) pages of logged-in user
export const getUserPages = async (req, res) => {
  try {
    const pages = await Page.find({ 
      owner: req.user._id,
      isDeleted: false 
    }).sort({ updatedAt: -1 });
    
    res.status(200).json({ success: true, pages });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get all pages shared with the user
export const getSharedPages = async (req, res) => {
  try {
    const pages = await Page.find({
      'sharedWith.user': req.user._id,
      isDeleted: false
    })
    .populate('owner', 'firstname lastname email')
    .sort({ updatedAt: -1 });
    
    res.status(200).json({ success: true, pages });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get favorite pages
export const getFavoritePages = async (req, res) => {
  try {
    const pages = await Page.find({
      $or: [
        { owner: req.user._id },
        { 'sharedWith.user': req.user._id }
      ],
      isFavorite: true,
      isDeleted: false
    }).sort({ updatedAt: -1 });
    
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
    }).sort({ deletedAt: -1 });
    
    res.status(200).json({ success: true, pages });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Search pages
export const searchPages = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ success: false, error: "Search query is required" });
    }

    const pages = await Page.find({
      $or: [
        { owner: req.user._id },
        { 'sharedWith.user': req.user._id }
      ],
      isDeleted: false,
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } }
      ]
    })
    .populate('owner', 'firstname lastname email')
    .sort({ updatedAt: -1 });
    
    res.status(200).json({ success: true, pages });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get a single page
export const getPage = async (req, res) => {
  try {
    const page = await Page.findById(req.params.id)
      .populate('owner', 'firstname lastname email')
      .populate('sharedWith.user', 'firstname lastname email');

    if (!page) return res.status(404).json({ success: false, error: "Page not found" });
    
    // Check if user has access
    const isOwner = page.owner._id.toString() === req.user._id.toString();
    const isSharedWith = page.sharedWith.some(s => s.user._id.toString() === req.user._id.toString());
    
    if (!isOwner && !isSharedWith) {
      return res.status(403).json({ success: false, error: "Not authorized" });
    }

    // Track last viewed
    page.lastViewedBy = page.lastViewedBy.filter(
      v => v.user.toString() !== req.user._id.toString()
    );
    page.lastViewedBy.push({ user: req.user._id, viewedAt: new Date() });
    await page.save();

    res.status(200).json({ success: true, page });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Update a page
export const updatePage = async (req, res) => {
  try {
    const page = await Page.findById(req.params.id);

    if (!page) return res.status(404).json({ success: false, error: "Page not found" });
    
    // Check if user has edit permission
    const isOwner = page.owner.toString() === req.user._id.toString();
    const sharedUser = page.sharedWith.find(s => s.user.toString() === req.user._id.toString());
    const hasEditPermission = sharedUser && sharedUser.permission === 'edit';
    
    if (!isOwner && !hasEditPermission) {
      return res.status(403).json({ success: false, error: "Not authorized to edit" });
    }

    const { title, content } = req.body;
    if (title) page.title = title;
    if (content !== undefined) page.content = content;

    await page.save();
    res.status(200).json({ success: true, page });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Toggle favorite
export const toggleFavorite = async (req, res) => {
  try {
    const page = await Page.findById(req.params.id);

    if (!page) return res.status(404).json({ success: false, error: "Page not found" });
    
    const isOwner = page.owner.toString() === req.user._id.toString();
    const isSharedWith = page.sharedWith.some(s => s.user.toString() === req.user._id.toString());
    
    if (!isOwner && !isSharedWith) {
      return res.status(403).json({ success: false, error: "Not authorized" });
    }

    page.isFavorite = !page.isFavorite;
    await page.save();

    res.status(200).json({ success: true, page });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Duplicate a page
export const duplicatePage = async (req, res) => {
  try {
    const originalPage = await Page.findById(req.params.id);

    if (!originalPage) return res.status(404).json({ success: false, error: "Page not found" });
    
    const isOwner = originalPage.owner.toString() === req.user._id.toString();
    const isSharedWith = originalPage.sharedWith.some(s => s.user.toString() === req.user._id.toString());
    
    if (!isOwner && !isSharedWith) {
      return res.status(403).json({ success: false, error: "Not authorized" });
    }

    const duplicatedPage = new Page({
      title: `${originalPage.title} (Copy)`,
      content: originalPage.content,
      owner: req.user._id,
      isDeleted: false
    });

    await duplicatedPage.save();
    res.status(201).json({ success: true, page: duplicatedPage });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Share page with users
export const sharePage = async (req, res) => {
  try {
    const { emails, permission } = req.body;
    const page = await Page.findById(req.params.id);

    if (!page) return res.status(404).json({ success: false, error: "Page not found" });
    
    if (page.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: "Only owner can share" });
    }

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({ success: false, error: "Email addresses required" });
    }

    const users = await User.find({ email: { $in: emails } });
    
    if (users.length === 0) {
      return res.status(404).json({ success: false, error: "No users found with provided emails" });
    }

    users.forEach(user => {
      const alreadyShared = page.sharedWith.some(
        s => s.user.toString() === user._id.toString()
      );
      
      if (!alreadyShared && user._id.toString() !== page.owner.toString()) {
        page.sharedWith.push({
          user: user._id,
          permission: permission || 'view',
          sharedAt: new Date()
        });
      }
    });

    await page.save();
    await page.populate('sharedWith.user', 'firstname lastname email');

    res.status(200).json({ 
      success: true, 
      page,
      message: `Page shared with ${users.length} user(s)` 
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Remove user from shared page
export const removeSharedUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const page = await Page.findById(req.params.id);

    if (!page) return res.status(404).json({ success: false, error: "Page not found" });
    
    if (page.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: "Only owner can remove users" });
    }

    page.sharedWith = page.sharedWith.filter(
      s => s.user.toString() !== userId
    );

    await page.save();
    res.status(200).json({ success: true, page });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Generate public share link
export const generateShareLink = async (req, res) => {
  try {
    const page = await Page.findById(req.params.id);

    if (!page) return res.status(404).json({ success: false, error: "Page not found" });
    
    if (page.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: "Only owner can generate share link" });
    }

    if (!page.publicShareLink) {
      page.publicShareLink = uuidv4();
      page.isPublic = true;
      await page.save();
    }

    const shareUrl = `${req.protocol}://${req.get('host')}/shared/${page.publicShareLink}`;
    res.status(200).json({ success: true, shareUrl, shareLink: page.publicShareLink });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Disable public share link
export const disableShareLink = async (req, res) => {
  try {
    const page = await Page.findById(req.params.id);

    if (!page) return res.status(404).json({ success: false, error: "Page not found" });
    
    if (page.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: "Only owner can disable share link" });
    }

    page.isPublic = false;
    page.publicShareLink = null;
    await page.save();

    res.status(200).json({ success: true, message: "Share link disabled" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get page by public share link
export const getPageByShareLink = async (req, res) => {
  try {
    const { shareLink } = req.params;
    const page = await Page.findOne({ publicShareLink: shareLink, isPublic: true })
      .populate('owner', 'firstname lastname email');

    if (!page) {
      return res.status(404).json({ success: false, error: "Page not found or link is invalid" });
    }

    res.status(200).json({ success: true, page });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Soft delete a page (move to trash)
export const deletePage = async (req, res) => {
  try {
    const page = await Page.findById(req.params.id);

    if (!page) return res.status(404).json({ success: false, error: "Page not found" });
    if (page.owner.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, error: "Not authorized" });

    page.isDeleted = true;
    page.deletedAt = new Date();
    await page.save();

    res.status(200).json({ success: true, message: "Page moved to trash" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Restore page from trash
export const restorePage = async (req, res) => {
  try {
    const page = await Page.findById(req.params.id);

    if (!page) return res.status(404).json({ success: false, error: "Page not found" });
    if (page.owner.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, error: "Not authorized" });

    page.isDeleted = false;
    page.deletedAt = null;
    await page.save();

    res.status(200).json({ success: true, message: "Page restored", page });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Permanently delete a page
export const permanentDeletePage = async (req, res) => {
  try {
    const page = await Page.findById(req.params.id);

    if (!page) return res.status(404).json({ success: false, error: "Page not found" });
    if (page.owner.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, error: "Not authorized" });

    await page.deleteOne();
    res.status(200).json({ success: true, message: "Page permanently deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};