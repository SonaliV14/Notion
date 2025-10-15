import mongoose from "mongoose";

const pageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: mongoose.Schema.Types.Mixed, default: "" }, 
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null },
  isFavorite: { type: Boolean, default: false },
  
  // Collaboration fields
  sharedWith: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    permission: { type: String, enum: ['view', 'edit'], default: 'view' },
    sharedAt: { type: Date, default: Date.now }
  }],
  
  isPublic: { type: Boolean, default: false },
  publicShareLink: { type: String, unique: true, sparse: true },
  
  // Activity tracking
  lastViewedBy: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    viewedAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

// Index for faster searches
pageSchema.index({ title: 'text', content: 'text' });

export default mongoose.model("Page", pageSchema);