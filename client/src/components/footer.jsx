import React from 'react';
import { 
  BookOpen, 
  Heart, 
  Star, 
  Globe, 
  Twitter, 
  Github, 
  Linkedin, 
  Mail, 
  Users, 
  HelpCircle, 
  Phone, 
  Zap, 
  FileText, 
  Settings, 
  TrendingUp, 
  Award, 
  Clock 
} from 'lucide-react';

const Footer = () => {
  const productLinks = [
    { name: 'Features', href: '#', icon: <Zap className="w-4 h-4" /> },
    { name: 'Templates', href: '#', icon: <FileText className="w-4 h-4" /> },
    { name: 'Integrations', href: '#', icon: <Settings className="w-4 h-4" /> },
  ];

  const companyLinks = [
    { name: 'About Us', href: '#', icon: <Users className="w-4 h-4" /> },
    { name: 'Careers', href: '#', icon: <TrendingUp className="w-4 h-4" /> },
    { name: 'Blog', href: '#', icon: <Award className="w-4 h-4" /> },
  ];

  const supportLinks = [
    { name: 'Help Center', href: '#', icon: <HelpCircle className="w-4 h-4" /> },
    { name: 'Contact Us', href: '#', icon: <Phone className="w-4 h-4" /> },
  ];

  const socialLinks = [
    { name: 'Twitter', href: '#', icon: <Twitter className="w-5 h-5" /> },
    { name: 'GitHub', href: '#', icon: <Github className="w-5 h-5" /> },
    { name: 'LinkedIn', href: '#', icon: <Linkedin className="w-5 h-5" /> },
    { name: 'Email', href: '#', icon: <Mail className="w-5 h-5" /> }
  ];

  const stats = [
    { label: 'User Rating', value: '4.9', icon: <Star className="w-5 h-5 text-gray-100 fill-current" /> },
    { label: 'Active Users', value: '50K+', icon: <Globe className="w-5 h-5 text-gray-100" /> },
    { label: 'Notes Created', value: '1M+', icon: <Heart className="w-5 h-5 text-gray-100 fill-current" /> },
  ];

  return (
    <footer className="bg-black text-gray-200 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Brand & Social */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div className="flex items-center space-x-2 mb-6 md:mb-0">
            <BookOpen className="w-8 h-8 text-white" />
            <span className="text-2xl font-bold text-white">NoteHub</span>
          </div>

          <div className="flex space-x-4">
            {socialLinks.map((social, i) => (
              <a key={i} href={social.href} className="hover:text-white transition-colors">
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Links and Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center text-white"><Zap className="w-4 h-4 mr-2" />Product</h4>
            <ul className="space-y-2">
              {productLinks.map((link, i) => (
                <li key={i}>
                  <a href={link.href} className="text-gray-400 hover:text-white flex items-center transition-colors">
                    {link.icon}<span className="ml-2">{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center text-white"><Users className="w-4 h-4 mr-2" />Company</h4>
            <ul className="space-y-2">
              {companyLinks.map((link, i) => (
                <li key={i}>
                  <a href={link.href} className="text-gray-400 hover:text-white flex items-center transition-colors">
                    {link.icon}<span className="ml-2">{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center text-white"><HelpCircle className="w-4 h-4 mr-2" />Support</h4>
            <ul className="space-y-2">
              {supportLinks.map((link, i) => (
                <li key={i}>
                  <a href={link.href} className="text-gray-400 hover:text-white flex items-center transition-colors">
                    {link.icon}<span className="ml-2">{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Stats</h4>
            <ul className="space-y-2">
              {stats.map((stat, i) => (
                <li key={i} className="flex items-center text-gray-400">
                  {stat.icon}<span className="ml-2">{stat.value} {stat.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-6 text-center text-gray-500 text-sm">
          © 2025 NoteHub. All rights reserved. Made with <Heart className="w-4 h-4 inline mx-1 fill-current text-white" /> for productivity enthusiasts.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
