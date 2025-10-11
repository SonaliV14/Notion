// import React, { useState, useEffect } from 'react';
// import { X, Mail, UserPlus, Trash2, Eye, Edit, Crown } from 'lucide-react';
// import { useAuth } from '../contexts/AuthContext';
// import { 
//   inviteCollaborator, 
//   getPageCollaborators, 
//   updateCollaboratorRole, 
//   removeCollaborator 
// } from '../services/api';

// export default function ShareModal({ page, isOpen, onClose }) {
//   const { user } = useAuth();
//   const [email, setEmail] = useState('');
//   const [role, setRole] = useState('editor');
//   const [collaborators, setCollaborators] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [inviting, setInviting] = useState(false);

//   useEffect(() => {
//     if (isOpen && page) {
//       loadCollaborators();
//     }
//   }, [isOpen, page]);

//   const loadCollaborators = async () => {
//     if (!user?.token || !page?._id) return;
    
//     setLoading(true);
//     const res = await getPageCollaborators(page._id, user.token);
//     if (res.success) {
//       setCollaborators(res.collaborators || []);
//     }
//     setLoading(false);
//   };

//   const handleInvite = async (e) => {
//     e.preventDefault();
//     if (!email.trim() || !user?.token) return;

//     setInviting(true);
//     const res = await inviteCollaborator(page._id, email, role, user.token);
    
//     if (res.success) {
//       alert('Invitation sent successfully!');
//       setEmail('');
//       setRole('editor');
//       loadCollaborators();
//     } else {
//       alert('Failed to send invitation: ' + res.error);
//     }
//     setInviting(false);
//   };

//   const handleRoleChange = async (collaboratorId, newRole) => {
//     if (!user?.token) return;
//     const res = await updateCollaboratorRole(collaboratorId, newRole, user.token);
//     if (res.success) {
//       loadCollaborators();
//     } else {
//       alert('Failed to update role: ' + res.error);
//     }
//   };

//   const handleRemove = async (collaboratorId) => {
//     if (!user?.token) return;
//     if (!window.confirm('Remove this collaborator?')) return;

//     const res = await removeCollaborator(collaboratorId, user.token);
//     if (res.success) {
//       loadCollaborators();
//     } else {
//       alert('Failed to remove collaborator: ' + res.error);
//     }
//   };

//   const getRoleIcon = (role) => {
//     switch (role) {
//       case 'admin': return <Crown className="w-4 h-4 text-yellow-400" />;
//       case 'editor': return <Edit className="w-4 h-4 text-blue-400" />;
//       case 'viewer': return <Eye className="w-4 h-4 text-gray-400" />;
//       default: return null;
//     }
//   };

//   const getRoleBadgeColor = (role) => {
//     switch (role) {
//       case 'admin': return 'bg-yellow-900/30 text-yellow-400 border-yellow-700';
//       case 'editor': return 'bg-blue-900/30 text-blue-400 border-blue-700';
//       case 'viewer': return 'bg-gray-700/30 text-gray-400 border-gray-600';
//       default: return 'bg-gray-700 text-gray-300';
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
//       <div className="bg-neutral-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
//         <div className="flex items-center justify-between p-6 border-b border-neutral-700">
//           <div>
//             <h2 className="text-2xl font-bold text-white">Share "{page?.title}"</h2>
//             <p className="text-sm text-gray-400 mt-1">Invite others to collaborate</p>
//           </div>
//           <button onClick={onClose} className="p-2 hover:bg-neutral-700 rounded-lg transition-colors">
//             <X className="w-5 h-5 text-gray-400" />
//           </button>
//         </div>

//         <div className="flex-1 overflow-y-auto p-6">
//           <form onSubmit={handleInvite} className="mb-6">
//             <label className="block text-sm font-medium text-gray-300 mb-2">
//               Invite by email
//             </label>
//             <div className="flex gap-2">
//               <div className="flex-1 flex gap-2">
//                 <div className="flex-1 relative">
//                   <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//                   <input
//                     type="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     placeholder="colleague@example.com"
//                     className="w-full pl-10 pr-4 py-2.5 bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
//                     required
//                   />
//                 </div>
//                 <select
//                   value={role}
//                   onChange={(e) => setRole(e.target.value)}
//                   className="px-4 py-2.5 bg-neutral-900 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
//                 >
//                   <option value="viewer">Viewer</option>
//                   <option value="editor">Editor</option>
//                   <option value="admin">Admin</option>
//                 </select>
//               </div>
//               <button
//                 type="submit"
//                 disabled={inviting}
//                 className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg text-white font-medium flex items-center gap-2 transition-colors"
//               >
//                 <UserPlus className="w-4 h-4" />
//                 {inviting ? 'Inviting...' : 'Invite'}
//               </button>
//             </div>
//           </form>

//           <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-4 mb-6">
//             <h3 className="text-sm font-semibold text-gray-300 mb-3">Access Levels</h3>
//             <div className="space-y-2 text-sm">
//               <div className="flex items-start gap-2">
//                 <Eye className="w-4 h-4 text-gray-400 mt-0.5" />
//                 <div>
//                   <span className="font-medium text-gray-300">Viewer:</span>
//                   <span className="text-gray-400"> Can only view the page content</span>
//                 </div>
//               </div>
//               <div className="flex items-start gap-2">
//                 <Edit className="w-4 h-4 text-blue-400 mt-0.5" />
//                 <div>
//                   <span className="font-medium text-gray-300">Editor:</span>
//                   <span className="text-gray-400"> Can view and edit the page</span>
//                 </div>
//               </div>
//               <div className="flex items-start gap-2">
//                 <Crown className="w-4 h-4 text-yellow-400 mt-0.5" />
//                 <div>
//                   <span className="font-medium text-gray-300">Admin:</span>
//                   <span className="text-gray-400"> Can edit, manage collaborators, and delete</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div>
//             <h3 className="text-sm font-semibold text-gray-300 mb-3">
//               Collaborators ({collaborators.length})
//             </h3>
            
//             {loading ? (
//               <div className="text-center py-8 text-gray-400">Loading collaborators...</div>
//             ) : collaborators.length === 0 ? (
//               <div className="text-center py-8">
//                 <UserPlus className="w-12 h-12 text-gray-600 mx-auto mb-3" />
//                 <p className="text-gray-400">No collaborators yet</p>
//                 <p className="text-sm text-gray-500 mt-1">Invite someone to get started</p>
//               </div>
//             ) : (
//               <div className="space-y-2">
//                 {collaborators.map((collab) => (
//                   <div 
//                     key={collab._id}
//                     className="flex items-center justify-between p-3 bg-neutral-900 border border-neutral-700 rounded-lg hover:border-neutral-600 transition-colors"
//                   >
//                     <div className="flex items-center gap-3 flex-1">
//                       <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
//                         {collab.userId?.firstname?.[0]}{collab.userId?.lastname?.[0]}
//                       </div>
//                       <div className="flex-1">
//                         <div className="font-medium text-white">
//                           {collab.userId?.firstname} {collab.userId?.lastname}
//                         </div>
//                         <div className="text-sm text-gray-400">{collab.email}</div>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         {collab.status === 'pending' && (
//                           <span className="px-2 py-1 bg-yellow-900/30 text-yellow-400 text-xs rounded border border-yellow-700">
//                             Pending
//                           </span>
//                         )}
//                         <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs font-medium ${getRoleBadgeColor(collab.role)}`}>
//                           {getRoleIcon(collab.role)}
//                           {collab.role.charAt(0).toUpperCase() + collab.role.slice(1)}
//                         </div>
//                       </div>
//                     </div>
                    
//                     <div className="flex items-center gap-1 ml-3">
//                       {collab.status === 'accepted' && (
//                         <select
//                           value={collab.role}
//                           onChange={(e) => handleRoleChange(collab._id, e.target.value)}
//                           className="px-2 py-1 bg-neutral-800 border border-neutral-700 rounded text-sm text-white focus:outline-none focus:border-blue-500"
//                         >
//                           <option value="viewer">Viewer</option>
//                           <option value="editor">Editor</option>
//                           <option value="admin">Admin</option>
//                         </select>
//                       )}
//                       <button
//                         onClick={() => handleRemove(collab._id)}
//                         className="p-2 hover:bg-red-900/30 rounded transition-colors"
//                         title="Remove collaborator"
//                       >
//                         <Trash2 className="w-4 h-4 text-red-400" />
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         <div className="p-6 border-t border-neutral-700 bg-neutral-800/50">
//           <div className="flex items-center justify-between">
//             <p className="text-sm text-gray-400">Invitations expire in 7 days</p>
//             <button onClick={onClose} className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-white transition-colors">
//               Done
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }