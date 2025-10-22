import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { acceptInvite, rejectInvite } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { CheckCircle, XCircle, Loader, Mail, FileText, Users, AlertTriangle } from 'lucide-react';

export default function InviteAcceptPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [inviteData, setInviteData] = useState(null);

  useEffect(() => {
    if (!user) {
      localStorage.setItem('pendingInviteToken', token);
      navigate('/login');
    }
  }, [user, navigate, token]);

  const handleAccept = async () => {
    if (!user) {
      localStorage.setItem('pendingInviteToken', token);
      navigate('/login');
      return;
    }

    setLoading(true);
    setError(null);
    
    const res = await acceptInvite(token);
    
    if (res.success) {
      setSuccess(true);
      setInviteData({
        pageTitle: res.page?.title || 'Untitled Page',
        inviterName: res.collaborator?.invitedBy ? 
          `${res.collaborator.invitedBy.firstname} ${res.collaborator.invitedBy.lastname}` : 
          'Someone'
      });
      
      // Redirect to the page with proper URL
      setTimeout(() => {
        if (res.page?._id) {
          navigate(`/page/${res.page._id}`);
        } else {
          navigate('/');
        }
      }, 2000);
    } else {
      setError(res.error || 'Failed to accept invitation');
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!user) return;

    setRejecting(true);
    setError(null);
    
    const res = await rejectInvite(token);
    
    if (res.success) {
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } else {
      setError(res.error || 'Failed to reject invitation');
      setRejecting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4">
        <div className="bg-neutral-800 rounded-lg border border-neutral-700 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Invitation Accepted!
          </h1>
          <p className="text-gray-400 mb-4">
            {inviteData ? (
              <>You are now collaborating on "<strong>{inviteData.pageTitle}</strong>"</>
            ) : (
              'Redirecting you to the page...'
            )}
          </p>
          <Loader className="w-6 h-6 text-blue-500 animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  if (rejecting) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4">
        <div className="bg-neutral-800 rounded-lg border border-neutral-700 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-neutral-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Invitation Declined
          </h1>
          <p className="text-gray-400 mb-4">
            Redirecting you back...
          </p>
          <Loader className="w-6 h-6 text-gray-500 animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4">
      <div className="bg-neutral-800 rounded-lg border border-neutral-700 p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Collaboration Invitation
          </h1>
          <p className="text-gray-400">
            You've been invited to collaborate on a page
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-700 rounded-lg flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-200 font-medium mb-1">Error</p>
              <p className="text-sm text-red-300">{error}</p>
            </div>
          </div>
        )}

        <div className="bg-neutral-900 rounded-lg p-4 mb-6 border border-neutral-700">
          <div className="flex items-center gap-3 mb-3">
            <FileText className="w-5 h-5 text-gray-400" />
            <div className="flex-1">
              <p className="text-sm text-gray-400">Page Collaboration</p>
              <p className="text-white font-medium">Join as a collaborator</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-gray-400" />
            <div className="flex-1">
              <p className="text-sm text-gray-400">Invited by</p>
              <p className="text-white font-medium">
                {user.firstname} {user.lastname} (You)
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleAccept}
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white font-medium flex items-center justify-center gap-2 transition-colors"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Accepting...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Accept Invitation
              </>
            )}
          </button>

          <button
            onClick={handleReject}
            disabled={loading}
            className="w-full py-3 bg-neutral-700 hover:bg-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <XCircle className="w-5 h-5" />
            Decline
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-6">
          This invitation may expire after 7 days
        </p>
      </div>
    </div>
  );
}