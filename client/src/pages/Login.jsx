import React, { useState } from 'react';
import { BookOpen, Eye, EyeOff, Mail, Lock, AlertCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      if (formData.email === 'demo@example.com' && formData.password === 'password') {
        alert('Login successful! (This is a demo)');
      } else {
        setError('Invalid email or password. Try demo@example.com with password: password');
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen font-sans bg-neutral-950 text-white relative overflow-hidden">
      <header className="fixed top-0 w-full bg-black border-b border-neutral-800 z-50 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-4">
          <div className="inline-flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-white border border-neutral-800 shadow-2xl">
              <BookOpen className="w-6 h-6 text-black" />
            </div>
            <span className="text-2xl font-bold text-white">NoteHub</span>
          </div>
          <button onClick={() => navigate('/')} className="px-3 py-2 rounded-2xl text-l font-bold border-2 border-neutral-700/50 bg-neutral-800/20 backdrop-blur-xl text-white hover:border-neutral-600/70 hover:bg-neutral-700/30 transition-all duration-300 transform hover:scale-105">
            <ArrowLeft className="w-4 h-4 inline-block mr-1" />
            Back to Home
          </button>
        </div>
      </header>

      <div className="relative min-h-screen flex items-center justify-center pt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-6">
          <h2 className="text-3xl font-bold text-white text-center">Welcome back</h2>
          <p className="text-base text-neutral-400 text-center">
            Sign in to your account to continue your journey
          </p>

          <div className="p-8 shadow-2xl rounded-3xl border border-neutral-700 bg-neutral-900/80 backdrop-blur-lg transition-all duration-300">
            {error && (
              <div className="border rounded p-4 mb-4 flex items-start space-x-2 bg-red-800 border-red-600 text-red-400">
                <AlertCircle className="w-5 h-5 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1 text-white">Email address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter email"
                    className="w-full pl-10 pr-3 py-2 text-sm rounded-lg border border-neutral-700 bg-neutral-800 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1 text-white">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Enter password"
                    className="w-full pl-10 pr-10 py-2 text-sm rounded-lg border border-neutral-700 bg-neutral-800 text-white focus:outline-none"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword 
                      ? <EyeOff className="h-5 w-5 text-gray-400" /> 
                      : <Eye className="h-5 w-5 text-gray-400" />}
                  </button>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-3 text-base font-semibold rounded-2xl bg-white text-black hover:bg-neutral-200 transition-all"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
          </div>

          <p className="text-sm text-center text-neutral-400">
            Don't have an account?{' '}
            <button
              className="text-white font-semibold "
              onClick={() => navigate('/signup')}
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
