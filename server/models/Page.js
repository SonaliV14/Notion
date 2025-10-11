import mongoose from "mongoose";

const pageSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true,
    default: "Untitled"
  },
  icon: { 
    type: String, 
    default: "👋" 
  },
  coverImage: { 
    type: String, 
    default: null 
  },
  owner: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true,
    index: true 
  },
  isDeleted: { 
    type: Boolean, 
    default: false,
    index: true
  },
  deletedAt: { 
    type: Date, 
    default: null 
  },
  isFavorite: { 
    type: Boolean, 
    default: false 
  },
  permissions: {
    type: String,
    enum: ['private', 'shared', 'public'],
    default: 'private'
  }
}, { 
  timestamps: true 
});

// Compound indexes for efficient queries
pageSchema.index({ owner: 1, isDeleted: 1, updatedAt: -1 });
pageSchema.index({ owner: 1, isFavorite: 1, isDeleted: 1 });

export default mongoose.model("Page", pageSchema);