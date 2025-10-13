import mongoose from "mongoose";

const collaboratorSchema = new mongoose.Schema({
  pageId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Page", 
    required: true,
    index: true 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: false // Can be null for pending invites
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  role: { 
    type: String, 
    enum: ['viewer', 'editor', 'admin'],
    default: 'viewer'
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  invitedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  inviteToken: {
    type: String,
    unique: true,
    sparse: true
  },
  inviteExpiresAt: {
    type: Date
  }
}, { timestamps: true });

// Compound index to prevent duplicate collaborators
collaboratorSchema.index({ pageId: 1, email: 1 }, { unique: true });
collaboratorSchema.index({ inviteToken: 1 });
collaboratorSchema.index({ userId: 1, status: 1 });

export default mongoose.model("Collaborator", collaboratorSchema);