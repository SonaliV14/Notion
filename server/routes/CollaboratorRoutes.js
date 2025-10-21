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

// All routes are protected with authMiddleware
router.use(authMiddleware);

// Invite a collaborator to a page
router.post("/pages/:pageId/collaborators", inviteCollaborator);

// Get all collaborators for a page
router.get("/pages/:pageId/collaborators", getPageCollaborators);

// Get all pages where user is a collaborator
router.get("/collaborated-pages", getCollaboratedPages);

// Get pending invitations for current user
router.get("/invites/pending", getPendingInvites);

// Accept collaboration invite
router.post("/invites/accept/:token", acceptInvite);  // ✅ FIXED: Changed route order

// Reject collaboration invite
router.post("/invites/reject/:token", rejectInvite);  // ✅ FIXED: Changed route order

// Update collaborator role
router.patch("/collaborators/:collaboratorId/role", updateCollaboratorRole);

// Remove collaborator
router.delete("/collaborators/:collaboratorId", removeCollaborator);

export default router;