// Simplified API service for demo purposes
const API_BASE_URL = 'http://localhost:5000';

// Mock API functions for development/demo
export const login = async (email, password) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (email === 'demo@notehub.com' && password === 'password') {
    return {
      token: 'mock-jwt-token',
      user: {
        id: 1,
        firstname: 'John',
        lastname: 'Doe',
        email: email
      }
    };
  } else {
    throw new Error('Invalid credentials');
  }
};

export const signup = async (firstname, lastname, email, password) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    message: 'User created successfully'
  };
};

export const googleLogin = async (token) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    token: 'mock-google-jwt-token',
    user: {
      id: 2,
      firstname: 'Google',
      lastname: 'User',
      email: 'google.user@gmail.com'
    }
  };
};

export const getProfile = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    id: 1,
    firstname: 'John',
    lastname: 'Doe',
    email: 'demo@notehub.com'
  };
};

// For production use, uncomment and modify these:
/*
import axios from 'axios';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (email, password) => {
  const response = await api.post('/login', { email, password });
  return response.data;
};

export const signup = async (firstname, lastname, email, password) => {
  const response = await api.post('/signup', { firstname, lastname, email, password });
  return response.data;
};

export const googleLogin = async (token) => {
  const response = await api.post('/google', { token });
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get('/profile');
  return response.data;
};
*/

export default { login, signup, googleLogin, getProfile };