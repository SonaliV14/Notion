import React, { useState } from 'react';
import { BookOpen, Menu, X } from 'lucide-react';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full bg-black border-b border-neutral-800 z-50 shadow-2xl shadow-black/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-3xl flex items-center justify-center bg-white shadow-2xl shadow-black/20 border border-neutral-800">
              <BookOpen className="w-6 h-6 text-black" />
            </div>
            <span className="text-2xl font-black tracking-tight text-white">NoteHub</span>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-neutral-400 hover:text-white font-medium transition-all duration-300">Features</a>
            <a href="#testimonials" className="text-neutral-400 hover:text-white font-medium transition-all duration-300">Reviews</a>
            <a href="/login" className="text-neutral-400 hover:text-white font-medium transition-all duration-300">Sign In</a>
            <a href="/signup" className="px-6 py-3 rounded-2xl font-bold bg-white text-black hover:bg-neutral-100 transition-all">Get Started</a>
          </nav>

          <button className="md:hidden p-2 rounded-2xl hover:bg-neutral-800 transition-all duration-300" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 pt-20 bg-black backdrop-blur-2xl">
          <div className="px-6 py-8 space-y-8">
            <a href="#features" className="block text-2xl font-medium text-white border-b border-neutral-700">Features</a>
            <a href="#testimonials" className="block text-2xl font-medium text-white border-b border-neutral-700">Reviews</a>
            <a href="/login" className="block text-2xl font-medium text-white border-b border-neutral-700">Sign In</a>
            <a href="/signup" className="block w-full py-4 rounded-2xl text-xl font-bold text-center bg-white text-black transition-all">Get Started</a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
