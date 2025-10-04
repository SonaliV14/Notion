import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Page from "../models/Page.js";
import dotenv from 'dotenv';


dotenv.config();

const authMiddleware = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, error: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ success: false, error: 'User not found' });
    }

    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Not authorized, token failed' });
  }
};

// check if the logged-in user is the owner of the page
export const isPageOwner = async (req, res, next) => {
  try {
    const page = await Page.findById(req.params.id);
    if (!page) return res.status(404).json({ message: "Page not found" });

    if (page.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to access this page" });
    }

    req.page = page; // attach page to request for later use
    next();
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export default authMiddleware;
