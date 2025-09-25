import { createContext, useContext, useState, useEffect } from "react";
import { login, signup, googleLogin } from "../services/api";
import React from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const savedUser = localStorage.getItem("authUser");
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const loginUser = async (formData) => {
    const result = await login(formData);
    if (result.success) {
      localStorage.setItem("authToken", result.token);
      localStorage.setItem("authUser", JSON.stringify(result.user));
      setUser(result.user);
    }
    return result;
  };

  const signupUser = async (formData) => {
    const result = await signup(formData);
    if (result.success) {
      localStorage.setItem("authToken", result.token);
      localStorage.setItem("authUser", JSON.stringify(result.user));
      setUser(result.user);
    }
    return result;
  };

  const googleLoginUser = async (credential) => {
    const result = await googleLogin(credential);
    if (result.success) {
      localStorage.setItem("authToken", result.token);
      localStorage.setItem("authUser", JSON.stringify(result.user));
      setUser(result.user);
    }
    return result;
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, signupUser, googleLoginUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
