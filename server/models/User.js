import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String }, 
  isGoogleUser: { type: Boolean, default: false } 
});

export default mongoose.model("User", userSchema);
