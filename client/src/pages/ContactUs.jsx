import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ArrowLeft, Mail, User, Smartphone, MessageCircle, CheckCircle, AlertCircle } from 'lucide-react';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    message: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
    if (success) setSuccess('');
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.contact || !formData.message) {
      setError('All fields are required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Invalid email address');
      return false;
    }
    if (!/^\d{10}$/.test(formData.contact)) {
      setError('Contact number must be 10 digits');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    // Here you can send data to backend
    setTimeout(() => {
      setSuccess('Message sent successfully!');
      setFormData({ name: '', email: '', contact: '', message: '' });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen font-sans bg-neutral-950 text-white relative overflow-hidden">
      {/* Header */}
      <header className="fixed top-0 w-full bg-black border-b border-neutral-800 z-50 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-4">
          <div className="inline-flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-white border border-neutral-800 shadow-2xl">
              <BookOpen className="w-6 h-6 text-black" />
            </div>
            <span className="text-2xl font-bold text-white">NoteHub</span>
          </div>
          <button onClick={() => navigate('/')} className="px-3 py-2 rounded-2xl text-l font-bold border-2 border-neutral-700/50 bg-neutral-800/20 backdrop-blur-xl text-white hover:border-neutral-600/70 hover:bg-neutral-700/30 transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-neutral-900/30">
            <ArrowLeft className="w-4 h-4 inline-block mr-1" /> Back to Home
          </button>
        </div>
      </header>

      {/* Form Section */}
      <div className="relative min-h-screen flex items-center justify-center pt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <h2 className="text-3xl font-bold text-white text-center">Contact Us</h2>
          <p className="text-base text-neutral-400 text-center">
            Fill out the form and our team will reach you soon
          </p>

          <div className="py-8 px-6 shadow-2xl rounded-3xl border border-neutral-700 bg-neutral-900/80 backdrop-blur-lg transition-all duration-300">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="border rounded p-4 mb-4 flex items-center space-x-2 bg-red-800 border-red-600 text-red-400">
                  <AlertCircle className="w-5 h-5 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="border rounded p-4 mb-4 flex items-center space-x-2 bg-neutral-800 border-neutral-700 text-green-400">
                  <CheckCircle className="w-5 h-5 mt-0.5" />
                  <span>{success}</span>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2 text-white">Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="block w-full pl-10 pr-3 py-3 border rounded-lg bg-neutral-800 border-neutral-700 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-white">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your email"
                    className="block w-full pl-10 pr-3 py-3 border rounded-lg bg-neutral-800 border-neutral-700 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-white">Contact Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Smartphone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    name="contact"
                    type="text"
                    required
                    value={formData.contact}
                    onChange={handleChange}
                    placeholder="10-digit number"
                    className="block w-full pl-10 pr-3 py-3 border rounded-lg bg-neutral-800 border-neutral-700 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-white">Your Message</label>
                <div className="relative">
                  <div className="absolute top-3 left-3 flex items-center pointer-events-none">
                    <MessageCircle className="h-5 w-5 text-gray-400" />
                  </div>
                  <textarea
                    name="message"
                    required
                    placeholder="Enter your message"
                    className="block w-full pl-10 pr-3 py-3 border rounded-lg bg-neutral-800 border-neutral-700 text-white focus:outline-none resize-none"
                    rows={4}
                  ></textarea>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 text-base font-semibold rounded-2xl bg-white text-black hover:bg-neutral-200 transition-all"
              >
                {loading ? 'Sending message...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
