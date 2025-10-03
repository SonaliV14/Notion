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
      owner: req.user._id, // user from authMiddleware
    });

    await newPage.save();
    res.status(201).json({ success: true, page: newPage });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get all pages of logged-in user
export const getUserPages = async (req, res) => {
  try {
    const pages = await Page.find({ owner: req.user._id }).sort({ updatedAt: -1 });
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
    if (content) page.content = content;

    await page.save();
    res.status(200).json({ success: true, page });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Delete a page
export const deletePage = async (req, res) => {
  try {
    const page = await Page.findById(req.params.id);

    if (!page) return res.status(404).json({ success: false, error: "Page not found" });
    if (page.owner.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, error: "Not authorized" });

    await page.deleteOne();
    res.status(200).json({ success: true, message: "Page deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
