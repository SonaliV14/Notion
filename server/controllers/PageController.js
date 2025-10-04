import Page from "../models/Page.js";

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

// Get a single page
export const getPage = async (req, res) => {
  try {
    const page = await Page.findById(req.params.id);

    if (!page) return res.status(404).json({ success: false, error: "Page not found" });
    if (page.owner.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, error: "Not authorized" });

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
    if (page.owner.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, error: "Not authorized" });

    const { title, content } = req.body;
    if (title) page.title = title;
    if (content !== undefined) page.content = content;

    await page.save();
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