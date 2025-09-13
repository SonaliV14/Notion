import React from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { Navigate } from 'react-router-dom';
import { BookOpen, Sparkles } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center relative overflow-hidden">
        {/* Background Patterns */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-blue-300 to-purple-300 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-gradient-to-r from-purple-300 to-pink-300 rounded-full blur-3xl animate-pulse-slow delay-200"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-gradient-to-r from-cyan-300 to-blue-300 rounded-full blur-2xl animate-pulse-slow delay-400"></div>
        </div>

        {/* Loader Content */}
        <div className="text-center relative z-10">
          <div className="flex items-center justify-center mb-8 space-x-4">
            <div className="relative">
              <BookOpen className="w-16 h-16 text-blue-600 animate-bounce" />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-white animate-pulse" />
              </div>
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                NoteHub
              </h1>
              <p className="text-sm text-gray-500 -mt-1">Loading your workspace...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
