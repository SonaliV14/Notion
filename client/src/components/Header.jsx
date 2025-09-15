import React from 'react';
import { BookOpen, Sparkles } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-black/95 backdrop-blur-xl border-b border-gray-800 sticky top-0 z-50 shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-900/20 to-transparent"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex justify-center items-center h-20">
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-gray-300/20 rounded-full blur-lg group-hover:blur-xl transition-all duration-300"></div>
              <BookOpen className="w-10 h-10 text-white group-hover:text-gray-200 transition-colors duration-300 relative z-10" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-white to-gray-300 rounded-full animate-pulse"></div>
            </div>
            <div>
              <span className="text-3xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-300 bg-clip-text text-transparent group-hover:from-gray-100 group-hover:to-white transition-all duration-300">
                NoteHub
              </span>
              <div className="flex items-center space-x-1 -mt-1">
                <div className="text-xs text-gray-400 font-medium group-hover:text-gray-300 transition-colors duration-300">
                  Your digital workspace
                </div>
                <Sparkles className="w-3 h-3 text-gray-300 animate-pulse group-hover:text-white transition-colors duration-300" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;