import React from 'react';
import { BookOpen, Heart, Star, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white py-16 mt-auto relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full blur-lg"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-center space-y-8 lg:space-y-0">
          {/* Brand Section */}
          <div className="flex flex-col items-center lg:items-start space-y-4">
            <div className="flex items-center space-x-3 group">
              <div className="relative">
                <BookOpen className="w-10 h-10 text-blue-400 group-hover:text-purple-400 transition-colors duration-300" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <span className="text-3xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  NoteHub
                </span>
                <div className="text-sm text-blue-200 -mt-1">Crafted with care</div>
              </div>
            </div>
            <p className="text-gray-300 max-w-md text-center lg:text-left leading-relaxed">
              Empowering creators, thinkers, and dreamers to organize their world beautifully.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="flex items-center justify-center space-x-1">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="text-2xl font-bold text-white">4.9</span>
              </div>
              <div className="text-sm text-gray-300">User Rating</div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-center space-x-1">
                <Globe className="w-5 h-5 text-blue-400" />
                <span className="text-2xl font-bold text-white">50K+</span>
              </div>
              <div className="text-sm text-gray-300">Active Users</div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-center space-x-1">
                <Heart className="w-5 h-5 text-red-400 fill-current" />
                <span className="text-2xl font-bold text-white">1M+</span>
              </div>
              <div className="text-sm text-gray-300">Notes Created</div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-8 text-gray-300">
            <a href="#" className="hover:text-white transition-colors duration-300 relative group">
              Privacy
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></div>
            </a>
            <a href="#" className="hover:text-white transition-colors duration-300 relative group">
              Terms
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></div>
            </a>
            <a href="#" className="hover:text-white transition-colors duration-300 relative group">
              Support
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></div>
            </a>
          </div>
        </div>
        
        <div className="border-t border-gray-700/50 mt-12 pt-8 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2025 NoteHub. All rights reserved. Made with{' '}
              <Heart className="w-4 h-4 text-red-400 inline mx-1 fill-current" />
              for productivity enthusiasts.
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>Version 2.0</span>
              <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
              <span>Built for the future</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;