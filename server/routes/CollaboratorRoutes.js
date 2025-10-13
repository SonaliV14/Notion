import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  inviteCollaborator,
  getPageCollaborators,
  getCollaboratedPages,
  acceptInvite,
  rejectInvite,
  updateCollaboratorRole,
  removeCollaborator,
  getPendingInvites
} from "../controllers/CollaboratorController.js";

const router = express.Router();

// Invite a collaborator to a page
router.post("/pages/:pageId/collaborators", authMiddleware, inviteCollaborator);

// Get all collaborators for a page
router.get("/pages/:pageId/collaborators", authMiddleware, getPageCollaborators);

// Get all pages where user is a collaborator
router.get("/collaborated-pages", authMiddleware, getCollaboratedPages);

// Get pending invitations for current user
router.get("/invites/pending", authMiddleware, getPendingInvites);

// Accept collaboration invite
router.post("/invites/:token/accept", authMiddleware, acceptInvite);

// Reject collaboration invite
router.post("/invites/:token/reject", authMiddleware, rejectInvite);

// Update collaborator role
router.patch("/collaborators/:collaboratorId/role", authMiddleware, updateCollaboratorRole);

// Remove collaborator
router.delete("/collaborators/:collaboratorId", authMiddleware, removeCollaborator);

export default router;