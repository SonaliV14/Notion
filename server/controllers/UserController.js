import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_KEY, { expiresIn: "7d" });
};

export const signup = async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, error: "User already exists" });
    }

    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    const newUser = await User.create({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      authProvider: password ? "local" : "google",
      isGoogleUser: !password,
    });

    const token = generateToken(newUser._id);

    res.status(201).json({ success: true, token, user: newUser });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ success: false, error: "Invalid credentials" });
    }

    if (user.isGoogleUser) {
      return res.status(400).json({ success: false, error: "Use Google login for this account" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, error: "Invalid credentials" });
    }

    const token = generateToken(user._id);

    res.status(200).json({ success: true, token, user });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error" });
  }
};

export const googleLogin = async (req, res) => {
  const { email, firstname, lastname, googleId } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        firstname,
        lastname,
        email,
        googleId,
        authProvider: "google",
        isGoogleUser: true,
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({ success: true, token, user });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error" });
  }
};
