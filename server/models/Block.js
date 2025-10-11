import mongoose from "mongoose";

const blockSchema = new mongoose.Schema({
  pageId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Page", 
    required: true,
    index: true 
  },
  type: { 
    type: String, 
    required: true,
    enum: [
      'paragraph',
      'heading1',
      'heading2', 
      'heading3',
      'bulletList',
      'numberedList',
      'todo',
      'quote',
      'code',
      'divider',
      'callout',
      'toggle'
    ]
  },
  content: { 
    type: mongoose.Schema.Types.Mixed, 
    default: "" 
  },
  properties: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  },
  order: { 
    type: Number, 
    required: true 
  },
  parentBlockId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Block", 
    default: null 
  },
  isDeleted: { 
    type: Boolean, 
    default: false 
  }
}, { timestamps: true });

// Compound index for efficient querying
blockSchema.index({ pageId: 1, order: 1 });
blockSchema.index({ pageId: 1, isDeleted: 1, order: 1 });

export default mongoose.model("Block", blockSchema);