import React from 'react';
import { BookOpen, Twitter, Github, Linkedin, Mail, Heart } from 'lucide-react';

const Footer = () => {
  const socialLinks = [
    { href: '#', icon: <Twitter className="w-5 h-5" /> },
    { href: '#', icon: <Github className="w-5 h-5" /> },
    { href: '#', icon: <Linkedin className="w-5 h-5" /> },
    { href: '#', icon: <Mail className="w-5 h-5" /> }
  ];

  return (
    <footer className="bg-gray-800 text-gray-200 py-6">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-2 mb-4 md:mb-0">
          <BookOpen className="w-6 h-6 text-white" />
          <span className="text-lg font-bold text-white">NoteHub</span>
        </div>

        {/* Social */}
        <div className="flex space-x-4 mb-4 md:mb-0">
          {socialLinks.map((social, i) => (
            <a key={i} href={social.href} className="hover:text-white transition-colors">
              {social.icon}
            </a>
          ))}
        </div>

        {/* Copyright */}
        <div className="text-gray-500 text-sm text-center">
          © 2025 NoteHub • Made with <Heart className="w-4 h-4 inline mx-1 fill-current text-white" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
