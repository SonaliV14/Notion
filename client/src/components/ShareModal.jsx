import React, { useState, useEffect } from 'react';
import { X, Mail, UserPlus, Trash2, Eye, Edit, Crown, Copy, Check, Lock, Globe, ChevronDown } from 'lucide-react';

// Mock useAuth hook for demo
const useAuth = () => ({
  user: {
    token: 'demo-token',
    email: 'user@example.com',
    firstname: 'John',
    lastname: 'Doe'
  }
});

// Mock API functions for demo
const mockAPI = {
  inviteCollaborator: async (pageId, email, role, token) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      success: true,
      inviteLink: `http://localhost:5173/invite/abc123xyz`,
      collaborator: {
        _id: Date.now().toString(),
        email,
        role,
        status: 'pending',
        userId: null
      }
    };
  },
  getPageCollaborators: async (pageId, token) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      success: true,
      collaborators: [
        {
          _id: '1',
          email: 'collaborator@example.com',
          role: 'editor',
          status: 'accepted',
          userId: {
            firstname: 'Jane',
            lastname: 'Smith',
            email: 'collaborator@example.com'
          }
        }
      ]
    };
  },
  updateCollaboratorRole: async (collabId, role, token) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
  },
  removeCollaborator: async (collabId, token) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
  },
  updatePage: async (pageId, data, token) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true, page: { ...data } };
  }
};

export default function ShareModal({ page: propPage, isOpen, onClose }) {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('editor');
  const [collaborators, setCollaborators] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inviting, setInviting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [generalAccess, setGeneralAccess] = useState('private');
  const [showAccessDropdown, setShowAccessDropdown] = useState(false);
  
  // Demo page data
  const page = propPage || {
    _id: 'demo-page',
    title: 'My Awesome Page',
    permissions: 'private',
    owner: 'user-id'
  };

  useEffect(() => {
    if (isOpen && page) {
      loadCollaborators();
      setGeneralAccess(page.permissions || 'private');
    }
  }, [isOpen, page]);

  const loadCollaborators = async () => {
    if (!user?.token || !page?._id) return;
    
    setLoading(true);
    const res = await mockAPI.getPageCollaborators(page._id, user.token);
    if (res.success) {
      setCollaborators(res.collaborators || []);
    }
    setLoading(false);
  };

  const handleInvite = async () => {
    if (!email.trim() || !user?.token) return;
    
    setInviting(true);
    const res = await mockAPI.inviteCollaborator(page._id, email, role, user.token);
    
    if (res.success) {
      alert('Invitation sent successfully!');
      setEmail('');
      setRole('editor');
      loadCollaborators();
    } else {
      alert('Failed to send invitation: ' + res.error);
    }
    setInviting(false);
  };

  const handleRoleChange = async (collaboratorId, newRole) => {
    if (!user?.token) return;
    const res = await mockAPI.updateCollaboratorRole(collaboratorId, newRole, user.token);
    if (res.success) {
      loadCollaborators();
    } else {
      alert('Failed to update role: ' + res.error);
    }
  };

  const handleRemove = async (collaboratorId) => {
    if (!user?.token) return;
    if (!window.confirm('Remove this collaborator?')) return;
    
    const res = await mockAPI.removeCollaborator(collaboratorId, user.token);
    if (res.success) {
      loadCollaborators();
    } else {
      alert('Failed to remove collaborator: ' + res.error);
    }
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/page/${page._id}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAccessChange = async (newAccess) => {
    setGeneralAccess(newAccess);
    setShowAccessDropdown(false);
    
    // Update page permissions in backend
    if (user?.token) {
      await mockAPI.updatePage(page._id, { permissions: newAccess }, user.token);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-neutral-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header with Share/Publish tabs */}
        <div className="border-b border-neutral-700">
          <div className="flex items-center justify-between px-6 pt-4">
            <div className="flex gap-6">
              <button className="text-white font-medium pb-3 border-b-2 border-white">
                Share
              </button>
              <button className="text-gray-400 font-medium pb-3">
                Publish
              </button>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-neutral-700 rounded-lg transition-colors">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Invite Input */}
          <div className="mb-6">
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleInvite()}
                placeholder="Email or group, separated by commas"
                className="flex-1 px-4 py-2.5 bg-transparent border-2 border-blue-500 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-400"
              />
              <button
                onClick={handleInvite}
                disabled={inviting}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white font-medium transition-colors"
              >
                {inviting ? 'Inviting...' : 'Invite'}
              </button>
            </div>
          </div>

          {/* Current User */}
          <div className="mb-6">
            <div className="flex items-center justify-between p-3 hover:bg-neutral-900/50 rounded-lg transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {user.firstname?.[0]}{user.lastname?.[0]}
                </div>
                <div>
                  <div className="text-white text-sm">
                    {user.firstname} {user.lastname} <span className="text-gray-400">(You)</span>
                  </div>
                  <div className="text-xs text-gray-400">{user.email}</div>
                </div>
              </div>
              <div className="text-sm text-gray-400">Full access</div>
            </div>
          </div>

          {/* General Access Section */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-300 mb-3">General access</h3>
            <div className="bg-neutral-900/50 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-neutral-700 rounded flex items-center justify-center">
                    {generalAccess === 'private' ? (
                      <Lock className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Globe className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => setShowAccessDropdown(!showAccessDropdown)}
                      className="flex items-center gap-2 text-white hover:bg-neutral-800 px-2 py-1 rounded transition-colors"
                    >
                      <span className="text-sm font-medium">
                        {generalAccess === 'private' ? 'Only people invited' : 'Anyone on the web with link'}
                      </span>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    
                    {showAccessDropdown && (
                      <div className="absolute top-full left-0 mt-1 w-64 bg-neutral-800 border border-neutral-700 rounded-lg shadow-2xl py-1 z-50">
                        <button
                          onClick={() => handleAccessChange('private')}
                          className="w-full px-3 py-2 text-sm text-left hover:bg-neutral-700 flex items-center gap-3 transition-colors"
                        >
                          <Lock className="w-4 h-4 text-gray-400" />
                          <span className="text-white">Only people invited</span>
                          {generalAccess === 'private' && <Check className="w-4 h-4 text-blue-400 ml-auto" />}
                        </button>
                        <button
                          onClick={() => handleAccessChange('shared')}
                          className="w-full px-3 py-2 text-sm text-left hover:bg-neutral-700 flex items-center gap-3 transition-colors"
                        >
                          <Globe className="w-4 h-4 text-gray-400" />
                          <span className="text-white">Anyone on the web with link</span>
                          {generalAccess === 'shared' && <Check className="w-4 h-4 text-blue-400 ml-auto" />}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Learn about sharing & Copy link */}
          <div className="flex items-center justify-between mb-6">
            <button className="text-sm text-gray-400 hover:text-gray-300 flex items-center gap-2 transition-colors">
              <span className="w-5 h-5 border border-gray-600 rounded-full flex items-center justify-center text-xs">?</span>
              Learn about sharing
            </button>
            <button
              onClick={handleCopyLink}
              className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-white flex items-center gap-2 transition-colors text-sm"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy link
                </>
              )}
            </button>
          </div>

          {/* Collaborators List */}
          {collaborators.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-300 mb-3">
                People with access
              </h3>
              
              {loading ? (
                <div className="text-center py-8 text-gray-400">Loading collaborators...</div>
              ) : (
                <div className="space-y-2">
                  {collaborators.map((collab) => (
                    <div 
                      key={collab._id}
                      className="flex items-center justify-between p-3 hover:bg-neutral-900/50 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {collab.userId?.firstname?.[0] || collab.email[0].toUpperCase()}
                          {collab.userId?.lastname?.[0] || ''}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm text-white">
                            {collab.userId ? (
                              `${collab.userId.firstname} ${collab.userId.lastname}`
                            ) : (
                              collab.email
                            )}
                          </div>
                          <div className="text-xs text-gray-400">{collab.email}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {collab.status === 'pending' && (
                          <span className="px-2 py-1 bg-yellow-900/30 text-yellow-400 text-xs rounded">
                            Pending
                          </span>
                        )}
                        <select
                          value={collab.role}
                          onChange={(e) => handleRoleChange(collab._id, e.target.value)}
                          className="px-3 py-1.5 bg-neutral-900 border border-neutral-700 rounded text-sm text-white focus:outline-none focus:border-blue-500"
                        >
                          <option value="viewer">Can view</option>
                          <option value="editor">Can edit</option>
                          <option value="admin">Full access</option>
                        </select>
                        <button
                          onClick={() => handleRemove(collab._id)}
                          className="p-2 hover:bg-red-900/30 rounded transition-colors"
                          title="Remove"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}