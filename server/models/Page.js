import mongoose from "mongoose";

const pageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: mongoose.Schema.Types.Mixed, default: "" }, 
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // who created it
}, { timestamps: true });

export default mongoose.model("Page", pageSchema);
