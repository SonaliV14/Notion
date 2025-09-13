import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, signup as apiSignup, googleLogin as apiGoogleLogin } from '../services/api.js';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Since localStorage is not available in artifacts, we'll simulate the auth state
  useEffect(() => {
    // Simulate checking for stored auth data
    // In a real app, this would check localStorage/sessionStorage
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  const login = async (email, password) => {
    try {
      // For demo purposes, we'll do simple validation
      if (email === 'demo@notehub.com' && password === 'password') {
        const userData = {
          id: 1,
          firstname: 'John',
          lastname: 'Doe',
          email: email
        };
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setUser(userData);
        return { success: true };
      } else {
        return { 
          success: false, 
          error: 'Invalid email or password. Try demo@notehub.com with password: password' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: 'Login failed. Please try again.' 
      };
    }
  };

  const signup = async (firstname, lastname, email, password) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock successful signup
      return { success: true };

      // In a real app, you would use:
      // await apiSignup(firstname, lastname, email, password);
      // return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Signup failed' 
      };
    }
  };

  const googleLogin = async (token) => {
    try {
      // Simulate Google login
      const mockResponse = {
        token: 'mock-google-jwt-token',
        user: {
          id: 2,
          firstname: 'Google',
          lastname: 'User',
          email: 'google.user@gmail.com'
        }
      };

      await new Promise(resolve => setTimeout(resolve, 1000));
      setUser(mockResponse.user);
      return { success: true };

      // In a real app, you would use:
      // const response = await apiGoogleLogin(token);
      // const { token: appToken, user: userData } = response;
      // localStorage.setItem('token', appToken);
      // localStorage.setItem('user', JSON.stringify(userData));
      // setUser(userData);
      // return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Google login failed' 
      };
    }
  };

  const logout = () => {
    // In artifacts, we just clear the in-memory state
    setUser(null);
    
    // In a real app, you would also clear localStorage:
    // localStorage.removeItem('token');
    // localStorage.removeItem('user');
  };

  const value = {
    user,
    login,
    signup,
    googleLogin,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};