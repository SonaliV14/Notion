import crypto from 'crypto';
import Collaborator from "../models/Collaborator.js";
import Page from "../models/Page.js";
import User from "../models/User.js";

// Generate random invite token
const generateInviteToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Invite a collaborator to a page
export const inviteCollaborator = async (req, res) => {
  try {
    const { pageId } = req.params;
    const { email, role = 'editor' } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, error: "Email is required" });
    }

    // Validate role
    if (!['viewer', 'editor', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, error: "Invalid role" });
    }

    // Check if page exists
    const page = await Page.findById(pageId);
    if (!page) {
      return res.status(404).json({ success: false, error: "Page not found" });
    }

    // Check if user has permission to invite (must be owner or admin)
    const isOwner = page.owner.toString() === req.user._id.toString();
    const isAdmin = await Collaborator.findOne({
      pageId,
      userId: req.user._id,
      role: 'admin',
      status: 'accepted'
    });

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, error: "Not authorized to invite collaborators" });
    }

    // Check if user is trying to invite themselves
    if (email.toLowerCase() === req.user.email.toLowerCase()) {
      return res.status(400).json({ success: false, error: "Cannot invite yourself" });
    }

    // Check if collaboration already exists
    const existing = await Collaborator.findOne({ pageId, email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ 
        success: false, 
        error: existing.status === 'pending' 
          ? "Invitation already sent to this email" 
          : "User is already a collaborator" 
      });
    }

    // Check if invited user exists in system
    const invitedUser = await User.findOne({ email: email.toLowerCase() });

    // Generate invite token and expiry (7 days)
    const inviteToken = generateInviteToken();
    const inviteExpiresAt = new Date();
    inviteExpiresAt.setDate(inviteExpiresAt.getDate() + 7);

    // Create collaboration invitation
    const collaborator = new Collaborator({
      pageId,
      userId: invitedUser?._id || null,
      email: email.toLowerCase(),
      role,
      status: 'pending',
      invitedBy: req.user._id,
      inviteToken,
      inviteExpiresAt
    });

    await collaborator.save();

    // Populate the collaborator data
    await collaborator.populate('userId', 'firstname lastname email');
    await collaborator.populate('invitedBy', 'firstname lastname email');

    // TODO: Send email notification here
    // await emailService.sendCollaborationInvite({ 
    //   recipientEmail: email,
    //   inviterName: `${req.user.firstname} ${req.user.lastname}`,
    //   pageTitle: page.title,
    //   role,
    //   inviteToken
    // });

    res.status(201).json({ 
      success: true, 
      collaborator,
      inviteLink: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/invite/${inviteToken}`,
      message: "Invitation sent successfully"
    });
  } catch (err) {
    console.error('Invite collaborator error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get all collaborators for a page
export const getPageCollaborators = async (req, res) => {
  try {
    const { pageId } = req.params;

    // Check if page exists
    const page = await Page.findById(pageId);
    if (!page) {
      return res.status(404).json({ success: false, error: "Page not found" });
    }

    // Check if user has access to this page
    const isOwner = page.owner.toString() === req.user._id.toString();
    const isCollaborator = await Collaborator.findOne({
      pageId,
      userId: req.user._id,
      status: 'accepted'
    });

    if (!isOwner && !isCollaborator) {
      return res.status(403).json({ success: false, error: "Not authorized" });
    }

    // Get all collaborators
    const collaborators = await Collaborator.find({ pageId })
      .populate('userId', 'firstname lastname email')
      .populate('invitedBy', 'firstname lastname email')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, collaborators });
  } catch (err) {
    console.error('Get collaborators error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get all pages where user is a collaborator
export const getCollaboratedPages = async (req, res) => {
  try {
    const collaborations = await Collaborator.find({
      userId: req.user._id,
      status: 'accepted'
    })
    .populate({
      path: 'pageId',
      match: { isDeleted: false },
      populate: { path: 'owner', select: 'firstname lastname email' }
    })
    .sort({ updatedAt: -1 });

    // Filter out null pages (deleted pages) and add role info
    const pages = collaborations
      .filter(collab => collab.pageId)
      .map(collab => ({
        ...collab.pageId.toObject(),
        userRole: collab.role,
        isOwner: false,
        isCollaborated: true
      }));

    res.status(200).json({ success: true, pages });
  } catch (err) {
    console.error('Get collaborated pages error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Accept collaboration invite
export const acceptInvite = async (req, res) => {
  try {
    const { token } = req.params;

    const collaborator = await Collaborator.findOne({ inviteToken: token })
      .populate('pageId')
      .populate('invitedBy', 'firstname lastname email');

    if (!collaborator) {
      return res.status(404).json({ success: false, error: "Invalid invitation token" });
    }

    if (collaborator.status !== 'pending') {
      return res.status(400).json({ 
        success: false, 
        error: collaborator.status === 'accepted' 
          ? "Invitation already accepted" 
          : "Invitation was rejected" 
      });
    }

    // Check if invitation has expired
    if (new Date() > collaborator.inviteExpiresAt) {
      return res.status(400).json({ success: false, error: "Invitation has expired" });
    }

    // Check if the logged-in user's email matches the invited email
    if (req.user.email.toLowerCase() !== collaborator.email.toLowerCase()) {
      return res.status(403).json({ 
        success: false, 
        error: "This invitation is for a different email address" 
      });
    }

    // Update collaboration status
    collaborator.status = 'accepted';
    collaborator.userId = req.user._id;
    await collaborator.save();

    res.status(200).json({ 
      success: true, 
      collaborator,
      page: collaborator.pageId,
      message: "Invitation accepted successfully"
    });
  } catch (err) {
    console.error('Accept invite error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Reject collaboration invite
export const rejectInvite = async (req, res) => {
  try {
    const { token } = req.params;

    const collaborator = await Collaborator.findOne({ inviteToken: token });

    if (!collaborator) {
      return res.status(404).json({ success: false, error: "Invalid invitation token" });
    }

    if (collaborator.status !== 'pending') {
      return res.status(400).json({ success: false, error: "Invitation already processed" });
    }

    // Check if the logged-in user's email matches
    if (req.user.email.toLowerCase() !== collaborator.email.toLowerCase()) {
      return res.status(403).json({ 
        success: false, 
        error: "This invitation is for a different email address" 
      });
    }

    collaborator.status = 'rejected';
    await collaborator.save();

    res.status(200).json({ 
      success: true, 
      message: "Invitation rejected"
    });
  } catch (err) {
    console.error('Reject invite error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Update collaborator role
export const updateCollaboratorRole = async (req, res) => {
  try {
    const { collaboratorId } = req.params;
    const { role } = req.body;

    if (!['viewer', 'editor', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, error: "Invalid role" });
    }

    const collaborator = await Collaborator.findById(collaboratorId);
    if (!collaborator) {
      return res.status(404).json({ success: false, error: "Collaborator not found" });
    }

    // Check if page exists
    const page = await Page.findById(collaborator.pageId);
    if (!page) {
      return res.status(404).json({ success: false, error: "Page not found" });
    }

    // Only owner or admin can update roles
    const isOwner = page.owner.toString() === req.user._id.toString();
    const isAdmin = await Collaborator.findOne({
      pageId: collaborator.pageId,
      userId: req.user._id,
      role: 'admin',
      status: 'accepted'
    });

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, error: "Not authorized to update roles" });
    }

    collaborator.role = role;
    await collaborator.save();

    await collaborator.populate('userId', 'firstname lastname email');

    res.status(200).json({ 
      success: true, 
      collaborator,
      message: "Role updated successfully"
    });
  } catch (err) {
    console.error('Update role error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Remove collaborator
export const removeCollaborator = async (req, res) => {
  try {
    const { collaboratorId } = req.params;

    const collaborator = await Collaborator.findById(collaboratorId);
    if (!collaborator) {
      return res.status(404).json({ success: false, error: "Collaborator not found" });
    }

    // Check if page exists
    const page = await Page.findById(collaborator.pageId);
    if (!page) {
      return res.status(404).json({ success: false, error: "Page not found" });
    }

    // Only owner or admin can remove collaborators (or users can remove themselves)
    const isOwner = page.owner.toString() === req.user._id.toString();
    const isAdmin = await Collaborator.findOne({
      pageId: collaborator.pageId,
      userId: req.user._id,
      role: 'admin',
      status: 'accepted'
    });
    const isSelf = collaborator.userId?.toString() === req.user._id.toString();

    if (!isOwner && !isAdmin && !isSelf) {
      return res.status(403).json({ success: false, error: "Not authorized to remove this collaborator" });
    }

    await collaborator.deleteOne();

    res.status(200).json({ 
      success: true, 
      message: "Collaborator removed successfully"
    });
  } catch (err) {
    console.error('Remove collaborator error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get pending invitations for current user
export const getPendingInvites = async (req, res) => {
  try {
    const invites = await Collaborator.find({
      email: req.user.email.toLowerCase(),
      status: 'pending',
      inviteExpiresAt: { $gte: new Date() }
    })
    .populate('pageId', 'title icon coverImage')
    .populate('invitedBy', 'firstname lastname email')
    .sort({ createdAt: -1 });

    res.status(200).json({ success: true, invites });
  } catch (err) {
    console.error('Get pending invites error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};