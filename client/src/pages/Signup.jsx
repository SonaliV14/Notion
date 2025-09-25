import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { BookOpen, Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { signup, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
    if (success) setSuccess('');
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const result = await signup(formData.firstname, formData.lastname, formData.email, formData.password);
      if (result.success) {
        setSuccess('Account created successfully! Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Signup failed. Please try again.');
    }

    setLoading(false);
  };

  const handleGoogleResponse = async (response) => {
    try {
      const res = await googleLogin(response.credential);
      if (res.success) {
        navigate('/dashboard');
      } else {
        setError(res.error);
      }
    } catch (err) {
      setError('Google signup failed. Please try again.');
    }
  };

  useEffect(() => {
    /* global google */
    if (window.google) {
      google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
      });
      google.accounts.id.renderButton(
        document.getElementById('googleSignUpDiv'),
        { theme: 'outline', size: 'large', width: 240 }
      );
    } else {
      console.error('Google Identity Services not loaded. Make sure script is included in index.html');
    }
  }, []);

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
          <button
            onClick={() => navigate('/')}
            className="px-3 py-2 rounded-2xl text-l font-bold border-2 border-neutral-700/50 bg-neutral-800/20 backdrop-blur-xl text-white hover:border-neutral-600/70 hover:bg-neutral-700/30 transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-neutral-900/30"
          >
            <ArrowLeft className="w-4 h-4 inline-block mr-1" /> Back to Home
          </button>
        </div>
      </header>

      <div className="relative min-h-screen flex items-center justify-center pt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <h2 className="text-3xl font-bold text-white text-center">Create your account</h2>
          <p className="text-base text-neutral-400 text-center">
            Join thousands of users organizing their ideas
          </p>

          <div className="py-8 px-6 shadow-2xl rounded-3xl border border-neutral-700 bg-neutral-900/80 backdrop-blur-lg transition-all duration-300">
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

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-white">First name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      name="firstname"
                      type="text"
                      required
                      value={formData.firstname}
                      onChange={handleChange}
                      placeholder="First name"
                      className="block w-full pl-10 pr-3 py-3 border rounded-lg bg-neutral-800 border-neutral-700 text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-white">Last name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      name="lastname"
                      type="text"
                      required
                      value={formData.lastname}
                      onChange={handleChange}
                      placeholder="Last name"
                      className="block w-full pl-10 pr-3 py-3 border rounded-lg bg-neutral-800 border-neutral-700 text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-white">Email address</label>
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
                    placeholder="Enter your email"
                    className="block w-full pl-10 pr-3 py-3 border rounded-lg bg-neutral-800 border-neutral-700 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-white">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    className="block w-full pl-10 pr-12 py-3 border rounded-lg bg-neutral-800 border-neutral-700 text-white focus:outline-none"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-white">Confirm password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    className="block w-full pl-10 pr-12 py-3 border rounded-lg bg-neutral-800 border-neutral-700 text-white focus:outline-none"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 rounded border-neutral-700"
                />
                <label htmlFor="terms" className="ml-2 text-sm text-white">
                  I agree to the <a href="#" className="underline text-white">Terms of Service</a> and <a href="#" className="underline text-white">Privacy Policy</a>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 text-base font-semibold rounded-2xl bg-white text-black hover:bg-neutral-200 transition-all"
              >
                {loading ? 'Creating account...' : 'Create account'}
              </button>
            </form>

            <div id="googleSignUpDiv" className="w-full mt-4"></div>

            <p className="text-sm text-center text-neutral-400 mt-4">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-white ">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
