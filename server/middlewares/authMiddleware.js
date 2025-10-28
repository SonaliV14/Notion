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
    console.error('❌ No token provided');
    return res.status(401).json({ success: false, error: 'Not authorized, no token' });
  }

  try {
    console.log('🔐 Verifying token...');
    // IMPORTANT: Use JWT_SECRET (not JWT_KEY)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token decoded:', { id: decoded.id, email: decoded.email });
    
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      console.error('❌ User not found for token');
      return res.status(401).json({ success: false, error: 'User not found' });
    }

    console.log('✅ Auth successful for user:', req.user.email);
    next();
  } catch (err) {
    console.error('❌ Token verification failed:', err.message);
    return res.status(401).json({ success: false, error: 'Not authorized, token failed' });
  }
};

// check if the logged-in user is the owner of the page
export const isPageOwner = async (req, res, next) => {
  try {
    const page = await Page.findById(req.params.id);
    if (!page) {
      return res.status(404).json({ success: false, message: "Page not found" });
    }

    if (page.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to access this page" });
    }

    req.page = page;
    next();
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

export default authMiddleware;