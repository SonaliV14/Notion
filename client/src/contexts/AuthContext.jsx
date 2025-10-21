import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");
    return savedUser
      ? { ...JSON.parse(savedUser), token: savedToken }
      : null;
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);

  const signup = async (formData) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/signup`,
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
        error: err.response?.data?.error || "Signup failed",
      };
    }
  };

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

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};