import React, { createContext, useContext, useState } from "react";
import axios from "axios";

// Create the context
const AuthContext = createContext();

// Custom hook to use auth context easily
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // Initialize user from localStorage (if available)
  // Include token in user object for easier access later
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");
    return savedUser
      ? { ...JSON.parse(savedUser), token: savedToken }
      : null;
  });

  // ---------------- SIGNUP ----------------
  const signup = async (formData) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/signup`,
        formData
      );

      // Include token inside user object
      const userData = { ...res.data.user, token: res.data.token };

      // Save in state
      setUser(userData);

      // Save in localStorage for persistence
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token);

      // Automatically set axios default header for Authorization
      axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;

      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error || "Signup failed",
      };
    }
  };

  // ---------------- LOGIN ----------------
  const login = async (formData) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        formData
      );

      const userData = { ...res.data.user, token: res.data.token };
      setUser(userData);

      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token);

      axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;

      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error || "Login failed",
      };
    }
  };

  // ---------------- LOGOUT ----------------
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
