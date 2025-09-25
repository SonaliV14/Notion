import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen, Users, Zap, Shield, ArrowRight, Star, Globe, Smartphone,
  Menu, X
} from 'lucide-react';
import Header from "../components/Header";
import Footer from "../components/Footer";

const LandingPage = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    { icon: <BookOpen />, title: "Rich Text Editor", description: "Create beautiful documents with our powerful block-based editor that adapts to your writing style." },
    { icon: <Users />, title: "Team Collaboration", description: "Work together in real-time with your team members across different time zones and devices." },
    { icon: <Zap />, title: "Lightning Fast", description: "Experience blazing fast performance with instant sync and zero-latency interactions." },
    { icon: <Shield />, title: "Secure & Private", description: "Your data is encrypted and protected with enterprise-grade security protocols." },
    { icon: <Globe />, title: "Access Anywhere", description: "Work from any device, anywhere in the world with seamless cloud synchronization." },
    { icon: <Smartphone />, title: "Mobile Ready", description: "Fully responsive design that works perfectly on mobile devices and tablets." }
  ];

  const testimonials = [
    { name: "Sarah Johnson", role: "Product Manager at TechCorp", content: "NoteHub has revolutionized how our team collaborates. The interface is intuitive, and the features are exactly what we needed.", rating: 5, avatar: "SJ" },
    { name: "Michael Chen", role: "Software Engineer at StartupXYZ", content: "The best note-taking app I've ever used. Clean interface, powerful features, and incredible performance.", rating: 5, avatar: "MC" },
    { name: "Emily Davis", role: "UX Designer at Creative Co", content: "Perfect for organizing my design thoughts and collaborating with developers. It's become essential to my workflow.", rating: 5, avatar: "ED" }
  ];

  const stats = [
    { value: "10K+", label: "Active Users" },
    { value: "50M+", label: "Notes Created" },
    { value: "99.9%", label: "Uptime" },
    { value: "24/7", label: "Support" }
  ];

  return (
    <div className="min-h-screen font-sans bg-neutral-950 text-white relative overflow-x-hidden">

      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 border border-neutral-800/30 rounded-full animate-pulse shadow-2xl shadow-neutral-800/20"></div>
        <div className="absolute top-3/4 right-1/4 w-64 h-64 border border-neutral-700/40 rounded-full animate-pulse shadow-xl shadow-neutral-700/15" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-neutral-900/20 rounded-full animate-spin" style={{ animationDuration: '60s' }}></div>
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900/10 via-transparent to-neutral-900/5"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-neutral-800/5 to-transparent"></div>
      </div>

      <Header />

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 pt-20 bg-black backdrop-blur-2xl">
          <div className="px-6 py-8 space-y-8">
            <a href="#features" className="block text-2xl font-medium text-white border-b border-neutral-700">Features</a>
            <a href="#testimonials" className="block text-2xl font-medium text-white border-b border-neutral-700">Reviews</a>
            <a href="#pricing" className="block text-2xl font-medium text-white border-b border-neutral-700">Pricing</a>
            <a href="/login" className="block text-2xl font-medium text-white border-b border-neutral-700">Sign In</a>
            <a href="/signup" className="block w-full py-4 rounded-2xl text-xl font-bold text-center bg-white text-black transition-all">Get Started</a>
          </div>
        </div>
      )}

      <section className="pt-32 pb-20 relative text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-6xl md:text-8xl font-black mb-8 leading-[0.9] tracking-tighter">
            Your ideas deserve a
            <span className="block bg-gradient-to-r from-white via-neutral-200 to-neutral-300 bg-clip-text text-transparent drop-shadow-2xl">better workspace</span>
          </h1>
          <p className="text-2xl mb-12 max-w-4xl mx-auto leading-relaxed text-neutral-400 font-light">
            NoteHub is the connected workspace where better, faster work happens. Write, plan, collaborate, and get organized — all in one powerful platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <a href="/signup" className="group px-12 py-6 rounded-3xl text-xl font-bold bg-white text-neutral-900 hover:bg-neutral-100 transform hover:scale-105 flex items-center space-x-3 transition-all duration-300  shadow-white/20 border border-neutral-200/20 hover:shadow-white/30">
              <span>Get NoteHub free</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
            </a>
            <button
              onClick={() => navigate('/contact-us')}
              className="px-12 py-6 rounded-3xl text-xl font-bold text-white border-2 border-neutral-700 bg-transparent transition-all duration-300 hover:bg-neutral-800 hover:scale-105 shadow-2xl shadow-black/20"
            >
              Contact Us
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group p-6 rounded-3xl border bg-gradient-to-br from-neutral-800/20 to-neutral-900/30 shadow-2xl hover:scale-105">
                <div className="text-4xl font-black mb-2 bg-gradient-to-r from-white to-neutral-300 bg-clip-text text-transparent">{stat.value}</div>
                <div className="text-neutral-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black mb-6">
              Everything you need
              <span className="block bg-gradient-to-r from-white via-neutral-200 to-neutral-300 bg-clip-text text-transparent drop-shadow-xl">to stay organized</span>
            </h2>
            <p className="text-xl text-neutral-400 font-light">
              Manage your tasks, notes, and collaboration efficiently with NoteHub.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group p-8 rounded-3xl border bg-gradient-to-br from-neutral-800/20 to-neutral-900/30 shadow-2xl hover:-translate-y-3 hover:border-neutral-600/50 transition-all">
                <div className="mb-6 p-4 bg-gradient-to-br from-neutral-700/30 to-neutral-800/40 rounded-3xl w-fit border group-hover:bg-white group-hover:shadow-2xl">
                  {React.cloneElement(feature.icon, { className: "w-10 h-10 text-white group-hover:text-black" })}
                </div>
                <h3 className="text-2xl font-bold text-white">{feature.title}</h3>
                <p className="text-neutral-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black mb-6">
              Loved by teams
              <span className="block bg-gradient-to-r from-white via-neutral-200 to-neutral-300 bg-clip-text text-transparent drop-shadow-xl">worldwide</span>
            </h2>
            <p className="text-xl font-light text-neutral-400">
              See what our users have to say about their NoteHub experience
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="group p-8 rounded-3xl border bg-gradient-to-br from-neutral-800/20 to-neutral-900/30 shadow-2xl hover:-translate-y-2 hover:border-neutral-600/50 transition-all">
                <div className="flex items-center mb-6 space-x-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="mb-8 text-neutral-300">{testimonial.content}</p>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white to-neutral-200 text-neutral-900 shadow-2xl border">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-white">{testimonial.name}</p>
                    <p className="text-neutral-400 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 text-center relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-5xl font-black mb-8 leading-tight">
            Ready to get
            <span className="block bg-gradient-to-r from-white via-neutral-200 to-neutral-300 bg-clip-text text-transparent drop-shadow-2xl">started</span>
          </h2>
          <p className="text-2xl mb-12 text-neutral-400">
            Join thousands of teams already using NoteHub to organize their work, streamline collaboration, and bring their best ideas to life.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <a
              href="/signup"
              className="px-12 py-6 rounded-2xl text-xl font-bold bg-white text-black flex items-center space-x-3 transition-all duration-300 shadow-2xl shadow-black/20 border border-neutral-700 hover:scale-105"
            >
              <span>Start for free</span>
              <ArrowRight className="w-6 h-6" />
            </a>
            <button
              onClick={() => navigate('/contact-us')}
              className="px-12 py-6 rounded-2xl text-xl font-bold text-white border-2 border-neutral-700 bg-transparent transition-all duration-300 hover:bg-neutral-800 hover:scale-105 shadow-2xl shadow-black/20"
            >
              Contact Us
            </button>
          </div>

          <p className="mt-8 text-neutral-500 text-sm">
            Free forever for personal use • Upgrade anytime
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
