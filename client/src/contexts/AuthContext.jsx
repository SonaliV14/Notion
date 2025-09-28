import React, { createContext, useContext, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // --------- SIGNUP ----------
  const signup = async (formData) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/signup`,
        formData
      );
      // console.log(res.data.token)
      setUser(res.data.user);
      localStorage.setItem("token", res.data.token);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Signup failed", 
      };
    }
  };

  // --------- LOGIN ----------
  const login = async (formData) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        formData
      );
      setUser(res.data.user);
      localStorage.setItem("token", res.data.token);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Login failed", // ✅ fixed
      };
    }
  };

  // --------- GOOGLE LOGIN ----------
  const googleLogin = async (credential) => {
    try {
      // Send the raw Google ID token to backend
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/google-login`,
        { token: credential } // ✅ match backend expectation
      );

      setUser(res.data.user);
      localStorage.setItem("token", res.data.token);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Google login failed", // ✅ fixed
      };
    }
  };

  // --------- LOGOUT ----------
  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{ user, signup, login, googleLogin, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
