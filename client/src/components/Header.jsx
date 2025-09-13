import React from 'react';
import { BookOpen, Sparkles } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-20">
          <div className="flex items-center space-x-3 group">
            <div className="relative">
              <BookOpen className="w-10 h-10 text-blue-600 group-hover:text-purple-600 transition-colors duration-300" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-pulse"></div>
            </div>
            <div>
              <span className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-purple-700 transition-all duration-300">
                NoteHub
              </span>
              <div className="flex items-center space-x-1 -mt-1">
                <div className="text-xs text-gray-500 font-medium">Your digital workspace</div>
                <Sparkles className="w-3 h-3 text-purple-400 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;